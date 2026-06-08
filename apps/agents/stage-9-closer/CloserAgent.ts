import { Deal, DealStatus } from '../../lib/models/deals';
import { adminDb } from '../../lib/server/firebase-admin';
import { COLLECTIONS, InvestmentStakeholder } from '../../lib/models/schema';
import { proposalGenerator } from './proposal-generator';
import { getTemplate } from './messaging/templates';
import * as admin from 'firebase-admin';

/**
 * SIERRA BLU — THE CLOSER (AGENT 04)
 * Manages Stage 9 & 10 of the Intelligence Pipeline.
 * Responsible for Deal Orchestration, E-Signatures, and Closing.
 */
export class CloserAgent {
  private static instance: CloserAgent;

  private constructor() {}

  public static getInstance(): CloserAgent {
    if (!CloserAgent.instance) {
      CloserAgent.instance = new CloserAgent();
    }
    return CloserAgent.instance;
  }

  /**
   * S9 INITIATION: Triggered by a viewing request from S8.
   * Initializes a new Deal object in 'draft' status.
   */
  async handleViewingRequest(leadId: string, propertyCode: string) {
    try {
      console.info(`[CloserAgent] Initiating S9 for Lead: ${leadId} | Property: ${propertyCode}`);
      
      // 1. Fetch Lead Details for personalization
      const leadSnap = await adminDb.collection(COLLECTIONS.stakeholders).doc(leadId).get();
      const leadData = leadSnap.data() as InvestmentStakeholder;
      const leadName = leadData?.name || 'Valued Investor';

      // 1.5 Fetch Property Details
      const propertySnap = await adminDb.collection(COLLECTIONS.units).doc(propertyCode).get();
      const propertyTitle = propertySnap.exists ? (propertySnap.data()?.title || propertyCode) : propertyCode;

      // 2. Initialize Deal Document
      const dealData: Partial<Deal> = {
        leadId,
        propertyCode,
        clientName: leadName,
        propertyTitle: propertyTitle,
        status: 'draft',
        orchestration: {
          currentStage: 9.0,
          nextAction: 'generate_proposal',
          leilaPersonaInformed: true
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp() as any,
        updatedAt: admin.firestore.FieldValue.serverTimestamp() as any
      };

      const dealRef = await adminDb.collection('deals').add(dealData);

      // 3. Prepare Follow-up Template (Leila's Persona)
      const introMessage = getTemplate('viewingFollowUp', 'en')
        .replace('{propertyName}', propertyTitle)
        .replace('{leadName}', leadName);

      return { 
        success: true, 
        dealId: dealRef.id, 
        introMessage,
        meta: { leadName, propertyTitle }
      };
    } catch (error) {
      console.error(`[CloserAgent] S9 Initiation Failed:`, error);
      throw new Error(`Failed to initiate closing pipeline for lead ${leadId}`);
    }
  }

  /**
   * S9.1: Finalizes the proposal document and prepares it for the client.
   */
  async finalizeProposal(dealId: string, terms: Deal['terms']) {
    try {
      const dealSnap = await adminDb.collection('deals').doc(dealId).get();
      if (!dealSnap.exists) throw new Error('Deal not found');
      
      const deal = dealSnap.data() as Deal;

      // Generate Document via Proposal Engine
      const proposalUrl = await proposalGenerator.generate(
        deal, 
        { name: 'Investor' }, // TODO: Fetch full profile
        { title: deal.propertyCode }
      );

      await adminDb.collection('deals').doc(dealId).update({
        'status': 'offered',
        'terms': terms,
        'documents.proposalUrl': proposalUrl,
        'orchestration.currentStage': 9.1,
        'orchestration.nextAction': 'initiate_signing',
        'updatedAt': admin.firestore.FieldValue.serverTimestamp()
      });

      console.info(`[CloserAgent] S9.1 Proposal Finalized: ${dealId}`);
      return { success: true, proposalUrl };
    } catch (error) {
      console.error(`[CloserAgent] S9.1 Finalization Failed:`, error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * S9.2: Initiates the E-Signature workflow (Docusign/Composio).
   */
  async initiateSigning(dealId: string, leadEmail: string) {
    try {
      console.info(`[CloserAgent] S9.2 Initiating Signing: ${dealId}`);
      
      // Placeholder for Docusign Integration
      const signingUrl = `https://docusign.sierra-blu.com/sign?deal=${dealId}`;

      await adminDb.collection('deals').doc(dealId).update({
        'status': 'signing',
        'signing.status': 'sent',
        'orchestration.currentStage': 9.2,
        'orchestration.nextAction': 'wait_for_signature',
        'updatedAt': admin.firestore.FieldValue.serverTimestamp()
      });

      return { success: true, signingUrl };
    } catch (error) {
      console.error(`[CloserAgent] S9.2 Signing Initiation Failed:`, error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * S9.3: Processes the final closing and signals Agent 04 Stage 10.
   */
  async completeClosing(dealId: string) {
    try {
      console.info(`[CloserAgent] S9.3 Completing Deal: ${dealId}`);

      await adminDb.collection('deals').doc(dealId).update({
        'status': 'closed',
        'orchestration.currentStage': 9.3,
        'orchestration.nextAction': 'trigger_s10_feedback',
        'updatedAt': admin.firestore.FieldValue.serverTimestamp()
      });

      return { 
        success: true, 
        message: getTemplate('signingComplete', 'en') 
      };
    } catch (error) {
      console.error(`[CloserAgent] S9.3 Closing Failed:`, error);
      return { success: false, error: (error as Error).message };
    }
  }
}

export const closerAgent = CloserAgent.getInstance();
