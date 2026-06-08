import { adminDb } from './server/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export type AuditAction =
  | 'STAKEHOLDER_ONBOARD'
  | 'STAKEHOLDER_SYNC'
  | 'PHASE_TRANSITION'
  | 'LISTING_CREATE'
  | 'LISTING_SYNC'
  | 'ASSET_REMOVAL'
  | 'SETTLEMENT_FINALIZED'
  | 'INTELLIGENCE_UPDATE';


export interface AuditLog {
  action: AuditAction;
  performer: string;
  performerId: string;
  targetId: string;
  targetType: 'listing' | 'partner' | 'sale' | 'stakeholder' | 'system';
  details: string;
  createdAt?: FirebaseFirestore.Timestamp;
}

export const logAuditAction = async (log: Omit<AuditLog, 'createdAt'>) => {
  try {
    await adminDb.collection('audit_logs').add({
      ...log,
      createdAt: Timestamp.now()
    });
  } catch (err) {
    console.error("Critical: Audit logging failed:", err);
  }
};
