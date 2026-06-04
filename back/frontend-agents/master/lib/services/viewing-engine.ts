/**
 * SIERRA BLU — STAGE 8: VIEWING ENGINE
 * Automates the scheduling and reminding for site inspections.
 */

import { adminDb } from '../server/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { COLLECTIONS, type Viewing, type Lead } from '../models/schema';
import { sendTelegramMessage } from './telegram-controller';

/**
 * Schedule a new viewing.
 */
export async function scheduleViewing(
  leadId: string,
  unitId: string,
  agentId: string,
  scheduledAt: Date
): Promise<string> {
  const viewingData: Partial<Viewing> = {
    leadId,
    unitId,
    agentId,
    scheduledAt: Timestamp.fromDate(scheduledAt) as any,
    status: 'scheduled',
    location: "Site Office / Project Location", // Default
    reminderSent: false,
    createdAt: Timestamp.now() as any,
  };

  const docRef = await adminDb.collection(COLLECTIONS.viewings).add(viewingData);

  // Update Lead Stage
  await adminDb.collection(COLLECTIONS.stakeholders).doc(leadId).update({
    'orchestrationState.stage': 'S8_VIEWING_SCHEDULED',
    'status': 'negotiating'
  });

  // Notify Agent via Telegram
  await sendTelegramMessage(
    `🗓️ <b>Viewing Scheduled</b>\n\nStakeholder: ${leadId}\nUnit: ${unitId}\nTime: ${scheduledAt.toLocaleString()}`
  );

  return docRef.id;
}

/**
 * Marks a viewing as completed and potentially moves lead to 'negotiate' stage.
 */
export async function completeViewing(viewingId: string, notes?: string) {
  const viewingRef = adminDb.collection(COLLECTIONS.viewings).doc(viewingId);
  const viewingSnap = await viewingRef.get();

  if (!viewingSnap.exists) return;
  const viewing = viewingSnap.data() as Viewing;

  await viewingRef.update({
    status: 'completed',
    notes: notes || '',
    updatedAt: Timestamp.now(),
  });

  // Transition to Closing Ready
  await adminDb.collection(COLLECTIONS.stakeholders).doc(viewing.leadId).update({
    'orchestrationState.stage': 'S9_CLOSING_READY'
  });

  await sendTelegramMessage(`✅ <b>Viewing Completed</b>\nStakeholder has inspected the asset. Transitioning to Stage 9: Closing.`);
}
