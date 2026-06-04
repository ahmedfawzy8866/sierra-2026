/**
 * SIERRA BLU — STAGE 10: FEEDBACK LOOP
 * Closes the circle by capturing stakeholder satisfaction and triggering re-match logic.
 */

import { adminDb } from '../server/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { COLLECTIONS, type Lead } from '../models/schema';
import { sendTelegramMessage } from './telegram-controller';

/**
 * Triggers the post-sale feedback process.
 */
export async function initiateFeedbackLoop(leadId: string, saleId: string) {
  console.log(`[FeedbackLoop] Initiating for Lead: ${leadId}`);

  // 1. Send Survey (Simulated via automated log)
  await adminDb.collection(COLLECTIONS.stakeholders).doc(leadId).update({
    'automation.feedbackRequested': true,
    'automation.lastFeedbackAt': Timestamp.now(),
    'orchestrationState.stage': 'S10_FEEDBACK_PENDING',
    stage: 'closed-won'
  });

  // 2. Notify for Manual Quality Check
  await sendTelegramMessage(`📊 <b>S10: Feedback Loop Initiated</b>\nStakeholder satisfaction survey deployed for Sale: ${saleId}.`);

  // 3. Re-Match Logic: A closed buyer is a prime target for future investments
  // In a real scenario, this would trigger a background task to refresh matches with a 'Portfolio Owner' profile.
}

/**
 * Captures the actual feedback result.
 */
export async function submitStakeholderFeedback(leadId: string, score: number, comment: string) {
  await adminDb.collection(COLLECTIONS.stakeholders).doc(leadId).update({
    'aiProfiling.satisfactionScore': score,
    'intelligence.lastFeedbackComment': comment,
    'orchestrationState.stage': 'S10_COMPLETED',
    'orchestrationState.status': 'archived'
  });

  await sendTelegramMessage(`🌟 <b>Stakholder Success</b>\nFeedback received: ${score}/5. "<i>${comment}</i>"\nPipeline Cycle Complete.`);
}

/**
 * Stage 10/S8 Interaction: Records why a stakeholder passed on a unit.
 * Powers the Learning Loop to make the Matching Engine smarter.
 */
export async function recordSelectionFeedback(
  leadId: string,
  unitId: string,
  action: 'pass' | 'interested',
  reason?: string
) {
  const leadRef = adminDb.collection(COLLECTIONS.stakeholders).doc(leadId);
  const leadSnap = await leadRef.get();
  if (!leadSnap.exists) return;
  const lead = leadSnap.data() as Lead;

  const timestamp = Timestamp.now();

  // 1. Record in Interaction History
  const historyItem = { unitId, action, timestamp, reason };
  const updatedHistory = [...(lead.interactionHistory || []), historyItem];

  // 2. If 'pass', record move to objections and learn from it
  let updateData: any = {
    interactionHistory: updatedHistory,
    updatedAt: timestamp
  };

  if (action === 'pass' && reason) {
    const objection = { unitId, reason, timestamp };
    updateData['intelligence.objections'] = [...(lead.intelligence?.objections || []), objection];

    // Simple Learning: If reason mentions 'dark' or 'low floor', add to dislikes
    const existingDislikes = lead.intelligence?.preferences?.dislikes || [];
    if (reason.toLowerCase().includes('dark') && !existingDislikes.includes('dark units')) {
      updateData['intelligence.preferences.dislikes'] = [...existingDislikes, 'dark units'];
    }
  }

  await leadRef.update(updateData);

  // 3. Notify agent if 'interested'
  if (action === 'interested') {
    await sendTelegramMessage(`🔥 <b>High Intent Detected</b>\nStakeholder <b>${lead.name}</b> is interested in unit: <code>${unitId}</code>.\nAction: Contact immediately to close.`);
  }
}
