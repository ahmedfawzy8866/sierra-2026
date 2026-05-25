import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppStatusService } from '@/lib/services/WhatsAppStatusService';
import { WhatsAppParserService } from '@/lib/services/WhatsAppParserService';

/**
 * SIERRA BLU WEBHOOK ENTRY POINT
 * This endpoint receives real-time streams from messaging gateways.
 * 
 * Supports: WhatsApp Business API, Telegram Bot Webhooks, or Automation Bridges.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Log incoming payload for audit
    console.log("📥 Incoming Webhook Payload:", JSON.stringify(body, null, 2));

    // Update Node Connectivity Heartbeat
    await WhatsAppStatusService.recordHeartbeat('syncing');

    // Dynamic extraction logic (Adapter Pattern)
    // Here we adapt the payload to our internal processing schema.
    const message = body.message?.text || body.text || body.Body;
    const sender = body.from || body.From || "External Signal";
    const group = body.groupName || body.Source || "WhatsApp Broker Group";

    if (!message) {
      return NextResponse.json({ error: "Empty signal ignored" }, { status: 400 });
    }

    // Trigger AI Neural Processing
    const result = await WhatsAppParserService.processIncomingMessage(message, sender, group);

    return NextResponse.json({ 
      status: "success", 
      id: result.id,
      ai_confidence: "high",
      processed_at: new Date().toISOString()
    });

  } catch (error) {
    console.error("🚨 Webhook Critical Failure:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}

/**
 * GET Handler for Webhook Verification (Required by Meta/Twilio)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Verify the webhook setup
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ status: "Sierra Blu Webhook Active" });
}
