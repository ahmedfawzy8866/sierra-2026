/**
 * SIERRA BLU — STAGE 9: STRATEGIC ACQUISITION ENGINE
 * Orchestrates contract synthesis, stakeholder verification, and commission processing.
 */

import { adminDb } from '../server/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { COLLECTIONS, type Sale, type Lead, type Unit } from '../models/schema';
import { sendTelegramMessage } from './telegram-controller';
import { initiateFeedbackLoop } from './feedback-engine';
import { GoogleAIService } from '../server/google-ai';

/**
 * Initiates the formal Closing Protocol for a Strategic Acquisition.
 * Includes Asset reservation and Contract Synthesis.
 */
export async function initiateClosing(
  leadId: string,
  unitId: string,
  agentId: string,
  salePrice: number,
  commissionPercent: number = 2.5
): Promise<string> {
  // ─── VALIDATION: Ensure Asset Availability ──────────────────────
  const unitRef = adminDb.collection(COLLECTIONS.units).doc(unitId);
  const unitSnap = await unitRef.get();
  if (unitSnap.exists && (unitSnap.data() as Unit).status === 'sold') {
    throw new Error(`[Strategic Acquisition Error] Asset ${unitId} is already marked as SOLD.`);
  }

  const commissionAmount = (salePrice * commissionPercent) / 100;

  const saleData = {
    leadId,
    unitId,
    agentId,
    salePrice,
    commissionPercent,
    commissionAmount,
    status: 'pending' as const,
    closingDate: Timestamp.now(),
    createdAt: Timestamp.now(),
  };

  const docRef = await adminDb.collection(COLLECTIONS.sales).add(saleData);

  // Generate Contract Preview URL (Simulated)
  const contractUrl = `https://sierrablu.luxury/contracts/preview/${docRef.id}`;

  // Update unit status to 'reserved'
  await adminDb.collection(COLLECTIONS.units).doc(unitId).update({
    status: 'reserved',
    updatedAt: Timestamp.now(),
  });

  // Update Stakeholder (Lead) State
  await adminDb.collection(COLLECTIONS.stakeholders).doc(leadId).update({
    'orchestrationState.stage': 'S9_ACQUISITION_IN_PROGRESS',
    'intelligence.contractUrl': contractUrl
  });

  await sendTelegramMessage(`💎 <b>Strategic Acquisition Initiated</b>\nContract synthesised for Asset: ${unitId}. Awaiting stakeholder affirmation.`);

  return docRef.id;
}

/**
 * Finalizes the sale, marks unit as sold, and triggers the feedback loop.
 */
export async function finalizeSale(saleId: string) {
  const saleRef = adminDb.collection(COLLECTIONS.sales).doc(saleId);
  const saleSnap = await saleRef.get();
  if (!saleSnap.exists) return;
  const sale = saleSnap.data() as Sale;

  await saleRef.update({
    status: 'completed',
    updatedAt: Timestamp.now(),
  });

  // Mark Signature Asset as Sold in Global Registry
  await adminDb.collection(COLLECTIONS.units).doc(sale.unitId).update({
    status: 'sold',
    updatedAt: Timestamp.now(),
  });

  // Trigger Stage 10: High-Fidelity Feedback Loop
  await initiateFeedbackLoop(sale.leadId, saleId);

  await sendTelegramMessage(`🏆 <b>Strategic Acquisition Finalized</b>\nCommission Affirmation: ${sale.commissionAmount} EGP\nTransitioning to Stage 10: Mission Feedback.`);
}

/**
 * Generates an AI-powered Strategic Acquisition Summary (Contract Preview).
 * Uses Sierra persona to affirm the deal value.
 */
export async function generateContractPreview(leadId: string, unitId: string): Promise<string> {
  const leadSnap = await adminDb.collection(COLLECTIONS.stakeholders).doc(leadId).get();
  const unitSnap = await adminDb.collection(COLLECTIONS.units).doc(unitId).get();

  if (!leadSnap.exists || !unitSnap.exists) return "Strategic acquisition context pending.";

  const lead = leadSnap.data() as Lead;
  const unit = unitSnap.data() as Unit;

  const systemPrompt = `ROLE: You are "Sierra," the Executive Closer for Sierra Blu Realty.
TASK: Write a high-fidelity "Affirmation of Strategic Alignment" for this property acquisition.
TONE: Congratulations, institutional precision, and Levantine professional warmth.
CONTEXT: Stakeholder ${lead.name} is acquiring Asset ${unit.title} (${unit.compound}).
INTENT: Briefly summarize why this acquisition is a masterstroke of investment fidelity.

Output as 2-3 powerful sentences in the 'Sierra' persona.`;

  try {
    const data = await GoogleAIService.chatCompletions(
      'closing-engine', 'acquisition-affirmation',
      [{ role: 'system', content: systemPrompt }],
      { model: 'gemini-1.5-flash', temperature: 0.5 }
    );

    return data.choices[0].message.content || "Strategic alignment affirmed. Acquisition protocol finalized.";
  } catch (err) {
    console.error("[ClosingEngine] AI Affirmation failed:", err);
    return "Strategic alignment affirmed. Acquisition protocol finalized.";
  }
}
