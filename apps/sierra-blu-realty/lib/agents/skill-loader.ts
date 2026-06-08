/**
 * SIERRA ESTATES — SKILL REGISTRY & LOADER (V2)
 * Real implementations for all Nexus Agent tools.
 */

import { adminDb } from '../server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { COLLECTIONS } from '../models/schema';

export interface SkillDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface Skill {
  definition: SkillDefinition;
  execute: (args: any) => Promise<string>;
}

class SkillRegistry {
  private skills: Map<string, Skill> = new Map();

  constructor() {
    this.registerInternalSkills();
  }

  private registerInternalSkills() {

    // ── 1. Get Lead Info ────────────────────────────────────────────────────
    this.register({
      definition: {
        name: 'get_lead_info',
        description: 'Fetches a stakeholder\'s profile, budget, interests, and pipeline stage from Firestore.',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Full or partial name of the stakeholder' }
          },
          required: ['name']
        }
      },
      execute: async (args) => {
        try {
          const snap = await adminDb.collection(COLLECTIONS.stakeholders)
            .where('name', '>=', args.name)
            .where('name', '<=', args.name + '\uf8ff')
            .limit(1).get();
          if (snap.empty) return `No stakeholder found matching "${args.name}".`;
          const l = snap.docs[0].data();
          return [
            `👤 Stakeholder: ${l.name}`,
            `📱 Phone: ${l.phone || 'N/A'}`,
            `💰 Budget: ${l.budget || 'N/A'} – ${l.budgetMax || 'N/A'}`,
            `📍 Interests: ${l.aiProfiling?.interests?.join(', ') || 'Not profiled'}`,
            `🔄 Stage: ${l.orchestrationState?.stage || 'S1'}`,
            `🎯 Top Matches: ${l.aiProfiling?.topMatches?.length || 0} assets`
          ].join('\n');
        } catch (err: any) {
          return `Error fetching lead: ${err.message}`;
        }
      }
    });

    // ── 2. Search Properties ─────────────────────────────────────────────────
    this.register({
      definition: {
        name: 'search_properties',
        description: 'Search the property inventory by price range, location, or type.',
        parameters: {
          type: 'object',
          properties: {
            maxPrice: { type: 'number', description: 'Maximum price in EGP' },
            minPrice: { type: 'number', description: 'Minimum price in EGP' },
            location: { type: 'string', description: 'Area or compound name (partial match)' },
            type: { type: 'string', description: 'Property type: apartment, villa, penthouse, etc.' }
          }
        }
      },
      execute: async (args) => {
        try {
          let q = adminDb.collection(COLLECTIONS.units).where('status', '==', 'available');
          if (args.maxPrice) q = q.where('price', '<=', args.maxPrice) as any;
          if (args.minPrice) q = q.where('price', '>=', args.minPrice) as any;
          const snap = await (q as any).limit(5).get();
          if (snap.empty) return 'No matching properties found for those criteria.';
          let result = `Found ${snap.size} matching properties:\n\n`;
          snap.forEach((d: any) => {
            const u = d.data();
            result += `🏠 ${u.title || u.code} — EGP ${u.price?.toLocaleString()}\n📍 ${u.location || 'N/A'} | ${u.type || 'N/A'}\n\n`;
          });
          return result.trim();
        } catch (err: any) {
          return `Error searching properties: ${err.message}`;
        }
      }
    });

    // ── 3. Get Portfolio Stats ────────────────────────────────────────────────
    this.register({
      definition: {
        name: 'get_portfolio_stats',
        description: 'Returns live counts of inventory, leads, and closed sales from the database.',
        parameters: { type: 'object', properties: {} }
      },
      execute: async () => {
        try {
          const [units, leads, sales] = await Promise.all([
            adminDb.collection(COLLECTIONS.units).count().get(),
            adminDb.collection(COLLECTIONS.stakeholders).count().get(),
            adminDb.collection(COLLECTIONS.sales).count().get()
          ]);
          return [
            `📊 Sierra Estates Live Stats:`,
            `🏢 Total Units: ${units.data().count}`,
            `👤 Total Leads: ${leads.data().count}`,
            `✅ Closed Sales: ${sales.data().count}`
          ].join('\n');
        } catch (err: any) {
          return `Error fetching stats: ${err.message}`;
        }
      }
    });

    // ── 4. Reply to Client via Telegram ──────────────────────────────────────
    this.register({
      definition: {
        name: 'reply_to_client',
        description: 'Sends a message to a client or stakeholder via Telegram.',
        parameters: {
          type: 'object',
          properties: {
            chatId: { type: 'string', description: 'The Telegram chat ID of the recipient' },
            message: { type: 'string', description: 'The professional message to send' }
          },
          required: ['chatId', 'message']
        }
      },
      execute: async (args) => {
        try {
          const token = process.env.TELEGRAM_BOT_TOKEN;
          if (!token) return 'Cannot send — TELEGRAM_BOT_TOKEN not configured.';
          const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: args.chatId, text: args.message, parse_mode: 'HTML' })
          });
          const data = await res.json() as any;
          return data.ok ? `✅ Message delivered to chat ${args.chatId}.` : `❌ Telegram error: ${data.description}`;
        } catch (err: any) {
          return `Error sending message: ${err.message}`;
        }
      }
    });

    // ── 5. Update Lead Stage ──────────────────────────────────────────────────
    this.register({
      definition: {
        name: 'update_lead_stage',
        description: 'Advances or updates the orchestration stage of a stakeholder in the pipeline.',
        parameters: {
          type: 'object',
          properties: {
            leadId: { type: 'string', description: 'Firestore document ID of the lead' },
            stage: { type: 'string', description: 'New stage: S1, S2, S3, S4, S5, S6, S7, S8, S9, S10' }
          },
          required: ['leadId', 'stage']
        }
      },
      execute: async (args) => {
        try {
          await adminDb.collection(COLLECTIONS.stakeholders).doc(args.leadId).update({
            'orchestrationState.stage': args.stage,
            'orchestrationState.status': 'active',
            updatedAt: FieldValue.serverTimestamp()
          });
          return `✅ Lead ${args.leadId} advanced to stage ${args.stage}.`;
        } catch (err: any) {
          return `Error updating lead: ${err.message}`;
        }
      }
    });

    // ── 6. Analyze ROI (Real Financial Engine) ────────────────────────────────
    this.register({
      definition: {
        name: 'analyze_roi',
        description: 'Calculates ROI, rental yield, and legal risk for a Signature Asset.',
        parameters: {
          type: 'object',
       