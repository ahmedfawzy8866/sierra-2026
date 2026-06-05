import { adminDb } from '@/lib/server/firebase-admin';
import { COLLECTIONS } from '@/lib/models/schema';
import { Timestamp } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';
import { applyRateLimit, publicEndpointLimiter } from '@/lib/server/rate-limit';

interface ViewingRequest {
  leadId: string;
  unitId: string;
  portfolioId: string;
}

export const POST = async (req: Request) => {
  const rateLimitResponse = applyRateLimit(req, publicEndpointLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body: ViewingRequest = await req.json();
    const { leadId, unitId, portfolioId } = body;

    if (!leadId || !unitId) {
      return NextResponse.json(
        { error: 'Lead ID and Unit ID are required' },
        { status: 400 }
      );
    }

    // Create viewing request record
    const viewingRef = await adminDb.collection('viewing_requests').add({
      leadId,
      unitId,
      portfolioId,
      status: 'pending',
      createdAt: Timestamp.now(),
      requestedAt: new Date().toISOString(),
    });

    // Update lead record
    await adminDb.collection(COLLECTIONS.stakeholders).doc(leadId).update({
      [`viewingRequests.${unitId}`]: {
        requestedAt: Timestamp.now(),
        status: 'pending',
      },
      lastViewingRequestAt: Timestamp.now(),
    });

    // TODO: Send Telegram alert to sales team about viewing request
    console.log(`📍 Viewing request created for ${leadId} - ${unitId}`);

    return NextResponse.json({
      success: true,
      viewingId: viewingRef.id,
      message: 'Viewing request submitted successfully',
    });
  } catch (error) {
    console.error('Error requesting viewing:', error);
    return NextResponse.json(
      { error: 'Failed to request viewing' },
      { status: 500 }
    );
  }
};
