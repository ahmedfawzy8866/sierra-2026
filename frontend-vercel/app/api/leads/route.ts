import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { COLLECTIONS } from '@/lib/models/schema';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, message, locale } = data;

    // 1. Add to Firestore
    const leadRef = await adminDb.collection(COLLECTIONS.stakeholders).add({
      name,
      email,
      phone,
      message,
      status: 'new',
      phase: 'acquisition',
      priority: 'warm',
      via: 'Website',
      interest: 'General Inquiry',
      capitalAllocation: 'To be determined',
      locale,
      aiProfiling: {
        interests: ['General Inquiry'],
        topMatches: [],
        lastAnalyzedAt: Timestamp.now(),
      },
      automation: {
        followupReminderEnabled: true,
        interactionFrequency: 'medium',
      },
      createdAt: Timestamp.now()
    });

    // 2. Send Telegram Notification
    const text = `
<b>🚀 New Lead - Sierra Estates Realty</b>
<b>Name:</b> ${name}
<b>Email:</b> ${email}
<b>Phone:</b> ${phone}
<b>Interest:</b> General Inquiry
<b>Message:</b> ${message}
<b>Locale:</b> ${locale}
    `.trim();

    await sendTelegramMessage(text);

    return NextResponse.json({ success: true, id: leadRef.id });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
