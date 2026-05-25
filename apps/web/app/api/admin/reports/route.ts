import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/server/auth-guard';
import { adminDb } from '@/lib/server/firebase-admin';

export async function GET(req: NextRequest) {
  // Verify admin authentication
  const authResult = await verifyAdminRequest(req);
  if (!authResult.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('timeRange') || 'month';
    const reportType = searchParams.get('type') || 'summary';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    let data = {};

    if (reportType === 'summary' || reportType === 'all') {
      // Get key metrics
      const totalUnits = await adminDb.collection('listings').countDocuments();
      const totalLeads = await adminDb.collection('leads').countDocuments();
      const closedDeals = await adminDb
        .collection('deals')
        .where('stage', '==', 'closed')
        .countDocuments();

      data = {
        ...data,
        metrics: {
          totalUnits,
          totalLeads,
          closedDeals,
          avgDealValue: 2500000, // Mock value
        },
      };
    }

    if (reportType === 'deals' || reportType === 'all') {
      // Get deal trends
      const dealsSnap = await adminDb
        .collection('deals')
        .where('createdAt', '>=', startDate)
        .orderBy('createdAt', 'desc')
        .get();

      const dealsByMonth: Record<string, number> = {};
      dealsSnap.forEach(doc => {
        const date = doc.data().createdAt?.toDate?.() || new Date();
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        dealsByMonth[month] = (dealsByMonth[month] || 0) + 1;
      });

      data = {
        ...data,
        dealTrends: Object.entries(dealsByMonth).map(([month, count]) => ({
          month,
          deals: count,
        })),
      };
    }

    if (reportType === 'agents' || reportType === 'all') {
      // Get top agents (mock data in real implementation)
      data = {
        ...data,
        topAgents: [
          { name: 'Ahmed Mahmoud', deals: 8, revenue: 12000000 },
          { name: 'Fatima Hassan', deals: 6, revenue: 9500000 },
          { name: 'Mohamed Ali', deals: 5, revenue: 8200000 },
        ],
      };
    }

    return NextResponse.json({
      success: true,
      timeRange,
      data,
    });
  } catch (err) {
    console.error('Error generating report:', err);
    return NextResponse.json(
      { error: 'Failed to generate report', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
