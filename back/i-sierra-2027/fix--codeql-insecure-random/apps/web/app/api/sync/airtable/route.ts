import { NextRequest, NextResponse } from 'next/server';
import { verifyRequest, unauthorizedResponse } from '@/lib/server/auth-guard';
import { adminDb } from '@/lib/server/firebase-admin';
import { AirtableIntegrationService } from '@/lib/services/AirtableIntegrationService';

/**
 * AIRTABLE SYNC API
 *
 * POST /api/sync/airtable  — pull listings from the configured Airtable base
 *                            into Firestore inventory.
 * GET  /api/sync/airtable  — report whether Airtable is configured (no secrets).
 *
 * Auth mirrors /api/sync: Firebase admins, or service/cron callers presenting
 * the X-SBR-SECRET-KEY header (verifyRequest's "secret" method).
 */

async function isAdmin(uid: string): Promise<boolean> {
  try {
    const userDoc = await adminDb.collection('users').doc(uid).get();
    return userDoc.exists && userDoc.data()?.role === 'admin';
  } catch (error) {
    console.error('[AIRTABLE_SYNC_AUTH_ERROR] Role check failed:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  const auth = await verifyRequest(request);
  if (!auth.authenticated) return unauthorizedResponse();
  if (auth.method === 'firebase' && !(await isAdmin(auth.uid!))) {
    return unauthorizedResponse('Admin privileges required');
  }

  const cfg = AirtableIntegrationService.getConfig();
  return NextResponse.json({
    configured: cfg !== null,
    tables: cfg?.tables ?? [],
  });
}

export async function POST(request: NextRequest) {
  const auth = await verifyRequest(request);
  if (!auth.authenticated) return unauthorizedResponse();
  if (auth.method === 'firebase' && !(await isAdmin(auth.uid!))) {
    return unauthorizedResponse('Admin privileges required');
  }

  try {
    const result = await AirtableIntegrationService.syncFromEnv();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    // Missing configuration is a client-actionable 400, not a server fault.
    const status = message.includes('not configured') ? 400 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
