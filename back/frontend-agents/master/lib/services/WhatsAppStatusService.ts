import { adminDb } from '@/lib/server/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export class WhatsAppStatusService {
  private static STATUS_DOC = 'system_status/whatsapp_node';

  /**
   * Logs a pulse from the scraper node to indicate it is alive and syncing.
   */
  static async recordHeartbeat(status: 'active' | 'syncing' | 'error' = 'active') {
    try {
      const [collectionName, docId] = this.STATUS_DOC.split('/');
      await adminDb.collection(collectionName).doc(docId).set({
        status,
        lastPulse: Timestamp.now(),
        nodeId: 'OPENCLAW_NODE_01',
        heartbeatInterval: 60000 // Expected pulse every 60s
      }, { merge: true });
    } catch (error) {
      console.error("❌ Failed to record WhatsApp pulse:", error);
    }
  }

  /**
   * Records specific errors from the scraper node.
   */
  static async recordError(errorMessage: string) {
    try {
      const [collectionName, docId] = this.STATUS_DOC.split('/');
      await adminDb.collection(collectionName).doc(docId).update({
        status: 'error',
        lastError: errorMessage,
        errorTimestamp: Timestamp.now()
      });
    } catch (error) {
      console.error("❌ Failed to record node error:", error);
    }
  }
}
