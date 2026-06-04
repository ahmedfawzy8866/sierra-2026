import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/server/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * One-time admin user setup. Protected by CRON_SECRET.
 * DELETE THIS FILE after use.
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { email, password, displayName } = await req.json();

    let uid: string;
    try {
      const user = await adminAuth.createUser({ email, password, displayName });
      uid = user.uid;
    } catch (err: unknown) {
      if ((err as { code?: string }).code === 'auth/email-already-exists') {
        const existing = await adminAuth.getUserByEmail(email);
        uid = existing.uid;
        await adminAuth.updateUser(uid, { password });
      } else {
        throw err;
      }
    }

    await adminDb.collection('users').doc(uid).set({
      email,
      displayName,
      role: 'admin',
      createdAt: Timestamp.now(),
    }, { merge: true });

    return NextResponse.json({ success: true, uid });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
