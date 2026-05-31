import { NextResponse, NextRequest } from 'next/server';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/server/auth-guard';

/**
 * Agent Hub - Agent orchestration (admin-only)
 * TODO: Complete agent orchestration implementation
 */
export async function POST(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authenticated) return unauthorizedResponse();
  try {
    const { agentId, message } = await req.json();

    if (!message) {
      return NextResponse.json({ success: false, error: 'No message provided.' });
    }

    return NextResponse.json({
      success: true,
      agentId,
      response: `Agent ${agentId} received: ${message}`,
      status: 'pending',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Internal error.' });
  }
}
