import { NextRequest, NextResponse } from 'next/server';
import { closerAgent } from '@/agents/stage-9-closer/CloserAgent';

/**
 * API: INITIATE CLOSING (STAGE 9)
 * Triggers the Closer Agent to handle a viewing request and initialize a deal.
 */
export async function POST(request: NextRequest) {
  try {
    const { leadId, propertyCode, visitorName, visitorEmail, visitorPhone } = await request.json();

    if (!propertyCode || !visitorName) {
      return NextResponse.json({ error: 'Missing lead or property identity.' }, { status: 400 });
    }

    // 1. Trigger the Closer Agent (Agent 04)
    // Note: In a real flow, leadId would be fetched/created from Agent 01/06.
    // For this integration, we'll use a placeholder if not provided.
    const effectiveLeadId = leadId || `lead_${Date.now()}`;
    
    const result = await closerAgent.handleViewingRequest(effectiveLeadId, propertyCode);

    return NextResponse.json({
      success: true,
      dealId: result.dealId,
      introMessage: result.introMessage,
      meta: result.meta
    });

  } catch (error) {
    console.error('[API Closer] Initiation Error:', error);
    return NextResponse.json({ 
      error: 'Failed to synchronize with the Closer Agent.',
      details: (error as Error).message 
    }, { status: 500 });
  }
}
