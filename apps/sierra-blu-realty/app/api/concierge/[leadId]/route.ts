import { adminDb } from '@/lib/server/firebase-admin';
import { COLLECTIONS } from '@/lib/models/schema';
import { NextResponse } from 'next/server';
import { applyRateLimit, publicEndpointLimiter } from '@/lib/server/rate-limit';

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ leadId: string }> }
) => {
  const rateLimitResponse = applyRateLimit(req, publicEndpointLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { leadId } = await params;

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Query Firestore for the concierge portfolio
    const snapshot = await adminDb.collection(COLLECTIONS.conciergeSelections)
      .where('leadId', '==', leadId)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    const portfolio = snapshot.docs[0].data();
    portfolio.id = snapshot.docs[0].id;

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
};
