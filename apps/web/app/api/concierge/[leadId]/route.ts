import { adminDb } from '@/lib/server/firebase-admin';
import { COLLECTIONS } from '@/lib/models/schema';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) => {
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
