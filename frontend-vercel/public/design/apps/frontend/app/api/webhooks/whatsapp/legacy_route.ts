import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppStatusService } from '@/lib/services/WhatsAppStatusService';
import { WhatsAppParserService } from '@/lib/services/WhatsAppParserService';
import { OmnichannelChatService } from '@/lib/services/OmnichannelChatService';

/**
 * SIERRA ESTATES WEBHOOK ENTRY POINT
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
    const message = body.message?.text || body.text || body.Body || body.message || "";
    const sender = body.from || body.From || body.sender || "External Signal";
    const group = body.groupName || body.group || body.Source || "Direct Message";

    if (!message) {
      return NextResponse.json({ error: "Empty signal ignored" }, { status: 400 });
    }

    // Trigger Unified Omnichannel Processing
    const result = await OmnichannelChatService.handleIncomingMessage({
      platform: 'whatsapp',
      senderId: sender,
      senderName: sender,
      text: message,
      groupName: group
    });

    return NextResponse.json({ 
      status: "success", 
      reply: result.replyText,
      action: result.actionTaken,
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

  return NextResponse.json({ status: "Sierra Estates Webhook Active" });
}
