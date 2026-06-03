import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebase-admin';

/**
 * POST /api/crm/leads
 * Grades incoming leads dynamically on a 1-10 priority scale tracking target intents and budgets.
 * Automatically routes tasks to specialized closing agents using round-robin logic.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client_name, client_mobile, extracted_metrics, conversation_summary } = body;
    const normalizedClientName = typeof client_name === 'string' ? client_name.trim() : '';
    const normalizedClientMobile = typeof client_mobile === 'string' ? client_mobile.trim() : '';

    if (!normalizedClientName || !normalizedClientMobile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: client_name and client_mobile are required.',
        },
        { status: 400 }
      );
    }

    if (!extracted_metrics || typeof extracted_metrics !== 'object' || Array.isArray(extracted_metrics)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payload: extracted_metrics object is required.',
        },
        { status: 400 }
      );
    }

    // Execute internal qualitative metrics tracking analytics (Sierra AI Profile Scoring Logic)
    let leadScoreValue = 0;
    if (extracted_metrics.intent !== 'UNKNOWN') leadScoreValue += 3;
    if (extracted_metrics.capital_budget > 0) leadScoreValue += 4;
    if (extracted_metrics.timeline_weeks > 0 && extracted_metrics.timeline_weeks <= 4) leadScoreValue += 3;
    else leadScoreValue += 1;

    const leadDocumentId = `SBR-LEAD-${Date.now()}`;
    const mappedCompoundFieldString = String(extracted_metrics.compound_target || '').toLowerCase().trim();
    
    // Automatic workload allocation routing matches according to consultant structural specialty vectors
    let selectedSalesCloserRepId = 'GENERAL_ACTIVE_REPS_POOL';
    if (mappedCompoundFieldString.includes('uptown') || mappedCompoundFieldString.includes('mokattam')) {
      selectedSalesCloserRepId = 'CLOSER_MOKATTAM_SPECIALIST';
    } else if (mappedCompoundFieldString.includes('mivida')) {
      selectedSalesCloserRepId = 'CLOSER_VIP_GOLDEN_SQUARE';
    }

    const structuredLeadRecord = {
      id: leadDocumentId,
      name: normalizedClientName,
      mobile: normalizedClientMobile,
      sierra_ai_score: leadScoreValue,
      target_location: extracted_metrics.compound_target,
      budget_ceiling: extracted_metrics.capital_budget,
      pipeline_stage: leadScoreValue >= 8 ? 'VIP_QUALIFIED_CORRIDOR' : 'LEAD_SOURCED',
      assigned_specialist: selectedSalesCloserRepId,
      interaction_logs_summary: conversation_summary,
      timestamp: new Date().toISOString()
    };

    // Safe write using adminDb (compile-safe in Vercel build loops)
    await adminDb.collection('Leads').doc(leadDocumentId).set(structuredLeadRecord);

    // Apply the Golden Hour rule notification block: trigger instant webhook to Google Calendar
    if (leadScoreValue >= 8 && process.env.ZAPIER_CALENDAR_WEBHOOK_URL) {
      await fetch(process.env.ZAPIER_CALENDAR_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_title: `🔥 VIP Immediate Route [Sierra AI Score: ${leadScoreValue}/10]`,
          description: `Lead Profile: ${normalizedClientName} | Specialized rep: ${selectedSalesCloserRepId} | Budget: ${extracted_metrics.capital_budget} EGP`,
          phone_number: normalizedClientMobile
        })
      }).catch(() => {});
    }

    return NextResponse.json({ 
      success: true, 
      lead_id: leadDocumentId, 
      metrics_score: `${leadScoreValue}/10`, 
      rep_owner: selectedSalesCloserRepId 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected server error while processing lead.';
    return NextResponse.json(
      { success: false, error: `Lead processing failed: ${message}` },
      { status: 500 }
    );
  }
}
