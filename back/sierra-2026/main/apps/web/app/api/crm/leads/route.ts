import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebase-admin';

const SCORE_FOR_KNOWN_INTENT = 3;
const SCORE_FOR_VALID_BUDGET = 4;
const SCORE_FOR_URGENT_TIMELINE = 3;
const SCORE_FOR_NEAR_TERM_TIMELINE = 2;
const SCORE_FOR_LONG_TERM_TIMELINE = 1;
const URGENT_TIMELINE_WEEKS = 4;
const NEAR_TERM_TIMELINE_WEEKS = 12;

interface InboundLeadPayload {
  client_name: string;
  client_mobile: string;
  conversation_summary: string;
  extracted_metrics: {
    intent: 'RENT' | 'RESALE' | 'UNKNOWN';
    compound_target: string;
    capital_budget: number;
    timeline_weeks: number;
    rooms_required: number;
  };
}

function routeLeadToSpecialtyPool(compound: string): string {
  const normalized = compound.toLowerCase().trim();
  if (normalized.includes('uptown') || normalized.includes('mokattam')) return 'CLOSER_MOKATTAM_SPECIALIST';
  if (normalized.includes('mivida')) return 'CLOSER_VIP_GOLDEN_SQUARE';
  return 'GENERAL_ACTIVE_REPS_POOL';
}

export async function POST(request: Request) {
  try {
    const payload: InboundLeadPayload = await request.json();
    const { client_name, client_mobile, extracted_metrics, conversation_summary } = payload;

    let leadScoreValue = 0;
    if (extracted_metrics.intent !== 'UNKNOWN') leadScoreValue += SCORE_FOR_KNOWN_INTENT;
    if (extracted_metrics.capital_budget > 0) leadScoreValue += SCORE_FOR_VALID_BUDGET;
    if (extracted_metrics.timeline_weeks > 0 && extracted_metrics.timeline_weeks <= URGENT_TIMELINE_WEEKS) leadScoreValue += SCORE_FOR_URGENT_TIMELINE;
    else if (extracted_metrics.timeline_weeks > URGENT_TIMELINE_WEEKS && extracted_metrics.timeline_weeks <= NEAR_TERM_TIMELINE_WEEKS) leadScoreValue += SCORE_FOR_NEAR_TERM_TIMELINE;
    else leadScoreValue += SCORE_FOR_LONG_TERM_TIMELINE;

    const leadDocumentId = `SBR-LEAD-${Date.now()}`;
    const selectedSalesCloserRepId = routeLeadToSpecialtyPool(String(extracted_metrics.compound_target || ''));

    const structuredLeadRecord = {
      id: leadDocumentId,
      name: client_name,
      mobile: client_mobile,
      sierra_ai_score: leadScoreValue,
      target_location: extracted_metrics.compound_target,
      budget_ceiling: extracted_metrics.capital_budget,
      pipeline_stage: leadScoreValue >= 8 ? 'VIP_QUALIFIED_CORRIDOR' : 'LEAD_SOURCED',
      assigned_specialist: selectedSalesCloserRepId,
      interaction_logs_summary: conversation_summary,
      timestamp: new Date().toISOString()
    };

    await adminDb.collection('Leads').doc(leadDocumentId).set(structuredLeadRecord);

    if (leadScoreValue >= 8 && process.env.ZAPIER_CALENDAR_WEBHOOK_URL) {
      await fetch(process.env.ZAPIER_CALENDAR_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_title: `🔥 VIP Immediate Route [Sierra AI Score: ${leadScoreValue}/10]`,
          description: `Investor Profile: ${client_name} | Assigned Specialist: ${selectedSalesCloserRepId}`,
          phone_number: client_mobile
        })
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, lead_id: leadDocumentId, metrics_score: `${leadScoreValue}/10`, rep_owner: selectedSalesCloserRepId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
