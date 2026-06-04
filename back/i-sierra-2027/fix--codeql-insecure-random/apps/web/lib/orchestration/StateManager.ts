import 'server-only';
import { adminDb } from '../server/firebase-admin';
import { COLLECTIONS } from '../models/schema';
import { OrchestrationStage } from '../services/orchestrator';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

/**
 * Centralized State Manager for orchestration.
 * Agents call StateManager methods instead of writing to Firestore directly.
 * This creates a seam for:
 * - Testing (mock StateManager)
 * - Auditing (log all state changes)
 * - Consistency (centralized mutation logic)
 */
export class StateManager {
  /**
   * Update document stage and mark as processing.
   */
  static async startStage(
    docId: string,
    collection: keyof typeof COLLECTIONS,
    stage: OrchestrationStage
  ): Promise<void> {
    const docRef = adminDb.collection(COLLECTIONS[collection]).doc(docId);
    await docRef.update({
      'orchestrationState.stage': stage,
      'orchestrationState.status': 'processing',
      'orchestrationState.lastTriggeredAt': Timestamp.now(),
    });
  }

  /**
   * Mark stage as complete and advance to next.
   */
  static async completeStage(
    docId: string,
    collection: keyof typeof COLLECTIONS,
    nextStage: OrchestrationStage,
    updates?: Record<string, any>
  ): Promise<void> {
    const docRef = adminDb.collection(COLLECTIONS[collection]).doc(docId);
    await docRef.update({
      ...updates,
      'orchestrationState.stage': nextStage,
      'orchestrationState.status': 'completed',
      'orchestrationState.lastCompletedAt': Timestamp.now(),
    });
  }

  /**
   * Mark stage as failed with error reason.
   */
  static async failStage(
    docId: string,
    collection: keyof typeof COLLECTIONS,
    stage: OrchestrationStage,
    errorMessage: string
  ): Promise<void> {
    const docRef = adminDb.collection(COLLECTIONS[collection]).doc(docId);
    await docRef.update({
      'orchestrationState.status': 'failed',
      'orchestrationState.error': errorMessage,
      'orchestrationState.failedAt': Timestamp.now(),
    });
  }

  /**
   * Pause pipeline for human review.
   */
  static async pauseForReview(
    docId: string,
    collection: keyof typeof COLLECTIONS,
    stage: OrchestrationStage,
    reason: string
  ): Promise<void> {
    const docRef = adminDb.collection(COLLECTIONS[collection]).doc(docId);
    await docRef.update({
      'orchestrationState.status': 'waiting_agent_review',
      'orchestrationState.stage': stage,
      'orchestrationState.reviewReason': reason,
      'orchestrationState.pausedAt': Timestamp.now(),
    });
  }

  /**
   * Update any document fields (S1, S2, S3, etc. agent-specific data).
   * Agents call this instead of doing docRef.update() directly.
   */
  static async updateFields(
    docId: string,
    collection: keyof typeof COLLECTIONS,
    updates: Record<string, any>
  ): Promise<void> {
    const docRef = adminDb.collection(COLLECTIONS[collection]).doc(docId);
    await docRef.update(updates);
  }

  /**
   * Fetch current document state.
   * Agents should call this to read before making decisions.
   */
  static async getDocument(
    docId: string,
    collection: keyof typeof COLLECTIONS
  ): Promise<any> {
    const docRef = adminDb.collection(COLLECTIONS[collection]).doc(docId);
    const snap = await docRef.get();
    return snap.exists ? snap.data() : null;
  }

  /**
   * Check if document exists.
   */
  static async exists(
    docId: string,
    collection: keyof typeof COLLECTIONS
  ): Promise<boolean> {
    const docRef = adminDb.collection(COLLECTIONS[collection]).doc(docId);
    const snap = await docRef.get();
    return snap.exists;
  }

  /**
   * Add to orchestration history.
   */
  static async addHistoryEntry(
    docId: string,
    collection: keyof typeof COLLECTIONS,
    stage: OrchestrationStage,
    status: string,
    details?: Record<string, any>
  ): Promise<void> {
    const docRef = adminDb.collection(COLLECTIONS[collection]).doc(docId);
    const historyEntry = {
      stage,
      status,
      timestamp: Timestamp.now(),
      engineVersion: '12.0.0-quiet-luxury',
      ...details,
    };

    await docRef.update({
      orchestrationHistory: FieldValue.arrayUnion(historyEntry),
    });
  }
}
