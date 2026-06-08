import { adminDb } from '../server/firebase-admin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { COLLECTIONS } from '../models/schema';

/**
 * SIERRA BLU NEURAL MEMORY HUB
 * Purpose: Global learning across all deals and lead rejections.
 */
export class MemoryService {

  /**
   * Records a "Negative Signal" (Objection) and updates global intelligence.
   */
  static async recordRejection(leadId: string, unitId: string, reason: string) {
    // 1. Update Lead's private memory
    const leadRef = adminDb.collection(COLLECTIONS.stakeholders).doc(leadId);
    await leadRef.update({
      'intelligence.objections': FieldValue.arrayUnion({
        unitId,
        reason,
        timestamp: new Date()
      }),
      'intelligence.memory.negativeSignals': FieldValue.arrayUnion({
        category: this.categorizeReason(reason),
        description: reason,
        importance: 0.8
      })
    });

    // 2. Update Global Intelligence Patterns
    const globalRef = adminDb.collection(COLLECTIONS.intelligence).doc('global_patterns');
    const category = this.categorizeReason(reason);

    await globalRef.set({
      [`rejectionStats.${category}`]: FieldValue.increment(1),
      lastTrendUpdate: Timestamp.now()
    }, { merge: true });
  }

  /**
   * Fetches global trends to inform AI prompts.
   */
  static async getGlobalTrends() {
    const globalRef = adminDb.collection(COLLECTIONS.intelligence).doc('global_patterns');
    const snap = await globalRef.get();
    return snap.exists ? snap.data() : null;
  }

  private static categorizeReason(reason: string): string {
    const r = reason.toLowerCase();
    if (r.includes('price') || r.includes('expensive')) return 'price';
    if (r.includes('location') || r.includes('community')) return 'location';
    if (r.includes('finish') || r.includes('quality')) return 'finishing';
    if (r.includes('small') || r.includes('space') || r.includes('layout')) return 'layout';
    return 'other';
  }
}
