import { NextResponse } from 'next/server';
import { WhatsAppStatusService } from '@/lib/services/WhatsAppStatusService';

/**
 * POST /api/whatsapp/heartbeat
 * Called by the scraper bot every ~60s to signal it is alive.
 */
export async function POST() {
  await WhatsAppStatusService.recordHeartbeat('active');
  return NextResponse.json({ ok: true, ts: new Date().toISOString() });
}

export async function GET() {
  return NextResponse.json({ status: 'heartbeat endpoint active' });
}
