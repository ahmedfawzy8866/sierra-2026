import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebase-admin';

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

// Routes high-yield incoming leads immediately based on agent specialization vectors
function routeLeadToSpecialtyPool(compound: string): string {
  const norm = compound.toLowerCase().trim();
  if (norm.includes('uptown') || norm.includes('mokattam')) return 'CLOSER_MOKATTAM_SPECIALIST';
  if (norm.includes('mivida') || norm.includes('sodic')) return 'CLOSER_FIFTH_SETTLEMENT_EXPERT';
  return 'GENERAL_SALES_ACTIVE_POOL';
}

export async function POST(request: Request) {
  try {
    const payload: InboundLeadPayload = await request.json();
    const { client_name, client_mobile, extracted_metrics, conversation_summary } = payload;

    // Deterministic Sierra AI Lead Scoring Algorithm (1 to 10 Scale valuation)
    let leilaScore = 0;
    if (extracted_metrics.intent !== 'UNKNOWN') leilaScore += 3;
    if (extracted_metrics.capital_budget > 0) leilaScore += 4;
    if (extracted_metrics.timeline_weeks > 0 && extracted_metrics.timeline_weeks <= 4) leilaScore += 3;
    else if (extracted_metrics.timeline_weeks > 4 && extracted_metrics.timeline_weeks <= 12) leilaScore += 2;
    else leilaScore += 1;

    const leadId = `SBR-LEAD-${Date.now()}`;
    const assignedCloser = routeLeadToSpecialtyPool(extracted_metrics.compound_target);

    const leadDocument = {
      id: leadId,
      name: client_name,
      mobile: client_mobile,
      sierra_ai_score: leilaScore,
      target_compound: extracted_metrics.compound_target,
      budget: extracted_metrics.capital_budget,
      pipeline_stage: leilaScore >= 8 ? 'VIP_QUALIFIED_ROUTE' : 'LEAD_SOURCED',
      assigned_agent: assignedCloser,
      summary: conversation_summary,
      timestamp: new Date().toISOString()
    };

    await adminDb.collection('Leads').doc(leadId).set(leadDocument);

    // Enforce Golden Hour rule: send instantly to Zapier/Calendar if score is equal or above 8
    if (leilaScore >= 8) {
      await fetch(String(process.env.ZAPIER_CALENDAR_WEBHOOK_URL), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_title: `🔥 VIP Immediate Route [Sierra AI Score: ${leilaScore}/10]`,
          description: `Investor Profile: ${client_name} | Target addressed: ${extracted_metrics.compound_target} | Lead Owner: ${assignedCloser}`,
          phone: client_mobile
        })
      }).catch(_err => console.error("Zapier Webhook Relay Blocked: ", _err));
    }

    return NextResponse.json({ success: true, lead_id: leadId, leila_score: `${leilaScore}/10`, routed_closer: assignedCloser });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
