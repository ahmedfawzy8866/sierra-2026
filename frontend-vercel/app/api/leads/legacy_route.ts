import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, phone, message, locale } = data;

    // 1. Add to Firestore
    const leadRef = await addDoc(collection(db, 'leads'), {
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
        lastAnalyzedAt: serverTimestamp(),
      },
      automation: {
        followupReminderEnabled: true,
        interactionFrequency: 'medium',
      },
      createdAt: serverTimestamp()
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
