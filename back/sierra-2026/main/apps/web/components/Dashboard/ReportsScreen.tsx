"use client";

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, Lead, Sale, Unit } from '../../lib/models/schema';

interface DashboardMetric {
  label: string;
  value: string;
  trend: string;
  color: string;
}

interface TrendPoint {
  label: string;
  value: number;
}

interface ReportsSnapshot {
  loading: boolean;
  metrics: DashboardMetric[];
  trendData: TrendPoint[];
  insight: string;
  topAreas: Array<{ label: string; count: number }>;
}

const initialState: ReportsSnapshot = {
  loading: true,
  metrics: [
    { label: 'Transaction Conversion Analytics', value: '--', trend: 'Waiting for live CRM data', color: 'var(--success)' },
    { label: 'Lifecycle Velocity', value: '--', trend: 'Waiting for live CRM data', color: 'var(--blue)' },
    { label: 'Asset Liquidity Index', value: '--', trend: 'Waiting for live inventory data', color: 'var(--gold)' },
    { label: 'Market Dominance Benchmarking', value: '--', trend: 'Waiting for portal sync data', color: 'var(--success)' },
  ],
  trendData: [],
  insight: 'Live analytics will appear when listings, leads, and sales data finish loading.',
  topAreas: [],
};

const toDate = (value: Timestamp | Date | string | null | undefined) => {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const percent = (value: number) => `${value.toFixed(1)}%`;

const monthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;

const buildReportsSnapshot = (listings: Unit[], leads: Array<Lead & Record<string, unknown>>, sales: Sale[]): ReportsSnapshot => {
  const closedLeads = leads.filter((lead) => {
    const phase = String((lead.phase as string | undefined) || '').toLowerCase();
    return phase === 'settlement' || lead.stage === 'closed-won' || Boolean(lead.closedAt);
  });

  const conversionRate = leads.length ? (closedLeads.length / leads.length) * 100 : 0;

  const lifecycleDurations = closedLeads
    .map((lead) => {
      const start = toDate(lead.createdAt as Timestamp | undefined);
      const end = toDate((lead.settledAt as Timestamp | undefined) || lead.closedAt || null);
      if (!start || !end) return null;
      return Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    })
    .filter((value): value is number => typeof value === 'number');

  const avgLifecycle = lifecycleDurations.length
    ? Math.round(lifecycleDurations.reduce((sum, value) => sum + value, 0) / lifecycleDurations.length)
    : 0;

  const transactedUnits = listings.filter((listing) => ['sold', 'rented'].includes(listing.status)).length;
  const liquidityIndex = listings.length ? transactedUnits / listings.length : 0;
  const portalPublished = listings.filter((listing) => listing.automation?.isPublishedToPF || listing.pfReferenceNumber).length;
  const portalCoverage = listings.length ? (portalPublished / listings.length) * 100 : 0;

  const currentMonth = new Date();
  currentMonth.setDate(1);
  const trendMap = new Map<string, number>();
  const trendLabels: TrendPoint[] = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - offset, 1);
    const key = monthKey(date);
    trendMap.set(key, 0);
    trendLabels.push({
      label: date.toLocaleDateString(undefined, { month: 'short' }),
      value: 0,
    });
  }

  closedLeads.forEach((lead) => {
    const settledAt = toDate((lead.settledAt as Timestamp | undefined) || lead.closedAt || null);
    if (!settledAt) return;
    const key = monthKey(settledAt);
    if (trendMap.has(key)) {
      trendMap.set(key, (trendMap.get(key) || 0) + 1);
    }
  });

  trendLabels.forEach((item, index) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - (5 - index), 1);
    item.value = trendMap.get(monthKey(date)) || 0;
  });

  const topAreas = Object.entries(
    listings.reduce<Record<string, number>>((acc, listing) => {
      const key = listing.compound || listing.location || listing.city || 'Unassigned';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label, count]) => ({ label, count }));

  const grossSales = sales.reduce((sum, sale) => sum + (sale.salePrice || 0), 0);
  const insight = portalCoverage < 40
    ? 'Property Finder coverage is still low compared with available inventory. Publishing more active units will strengthen channel visibility and unify lead attribution.'
    : conversionRate < 10
      ? 'Lead volume is healthy, but closing momentum is soft. Focus the CRM on structuring-stage stakeholders and faster follow-up cycles.'
      : `The pipeline is healthy, with ${closedLeads.length} converted stakeholders and EGP ${(grossSales / 1000000).toFixed(1)}M in recorded sales.`;

  return {
    loading: false,
    metrics: [
      {
        label: 'Transaction Conversion Analytics',
        value: percent(conversionRate),
        trend: `${closedLeads.length} converted stakeholders`,
        color: 'var(--success)',
      },
      {
        label: 'Lifecycle Velocity',
        value: avgLifecycle ? `${avgLifecycle} Days` : 'N/A',
        trend: lifecycleDurations.length ? 'Based on settled relationships' : 'Need more closed cycles',
        color: 'var(--blue)',
      },
      {
        label: 'Asset Liquidity Index',
        value: `${liquidityIndex.toFixed(2)}x`,
        trend: `${transactedUnits}/${listings.length || 0} sold or rented`,
        color: 'var(--gold)',
      },
      {
        label: 'Market Dominance Benchmarking',
        value: percent(portalCoverage),
        trend: `${portalPublished} units live on Property Finder`,
        color: 'var(--success)',
      },
    ],
    trendData: trendLabels.map((item) => ({
      ...item,
      value: trendLabels.length ? Math.max(item.value * 20, item.value > 0 ? 25 : 8) : 8,
    })),
    insight,
    topAreas,
  };
};

export default function ReportsScreen() {
  const [reportState, setReportState] = useState<ReportsSnapshot>(initialState);

  useEffect(() => {
    let listings: Unit[] = [];
    let leads: Array<Lead & Record<string, unknown>> = [];
    let sales: Sale[] = [];

    const refresh = () => {
      setReportState(buildReportsSnapshot(listings, leads, sales));
    };

    const unsubscribeListings = onSnapshot(collection(db, COLLECTIONS.units), (snapshot) => {
      listings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Unit));
      refresh();
    });

    const unsubscribeLeads = onSnapshot(collection(db, COLLECTIONS.stakeholders), (snapshot) => {
      leads = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Lead & Record<string, unknown>));
      refresh();
    });

    const unsubscribeSales = onSnapshot(collection(db, COLLECTIONS.sales), (snapshot) => {
      sales = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Sale));
      refresh();
    });

    return () => {
      unsubscribeListings();
      unsubscribeLeads();
      unsubscribeSales();
    };
  }, []);

  return (
    <div className="reports-screen animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="serif" style={{ fontSize: '28px', color: 'var(--navy)' }}>Market Intelligence</h1>
          <div className="page-sub">Strategic performance trends, market signals, and localized benchmarks</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline btn-sm" disabled={reportState.loading}>Live Snapshot</button>
          <button className="btn btn-primary btn-sm" disabled={reportState.loading}>Data Connected</button>
        </div>
      </div>

      <div className="kpi-grid">
        {reportState.metrics.map((stat) => (
          <div className="kpi-card glass-hover" key={stat.label}>
            <div className="kpi-label">{stat.label}</div>
            <div className="kpi-value" style={{ color: stat.color }}>{stat.value}</div>
            <div className="kpi-badge up" style={{ background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)' }}>
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="two-col" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Portfolio Absorption Rate</h3>
            <div className="badge badge-gold">{reportState.loading ? 'Loading' : 'Live Firestore Data'}</div>
          </div>
          <div className="card-body">
            <div className="bar-chart" style={{ height: '240px', alignItems: 'flex-end', paddingBottom: '20px' }}>
              {(reportState.trendData.length ? reportState.trendData : [{ label: 'Now', value: 8 }]).map((item, index, array) => (
                <div key={item.label} className="bar-item">
                  <div className="bar-fill" style={{ height: `${item.value}%`, background: 'var(--navy)', opacity: index === array.length - 1 ? 1 : 0.4 }}></div>
                  <div className="bar-label">{item.label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(var(--navy-rgb), 0.03)', borderRadius: '8px', fontSize: '13px', borderLeft: '3px solid var(--gold)' }}>
              <strong>AI Insight:</strong> {reportState.insight}
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--navy)', color: '#fff', border: 'none', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'rgba(200, 169, 110, 0.05)', borderRadius: '50%' }}></div>
          <div className="card-body" style={{ padding: '40px 30px', position: 'relative', zIndex: 1 }}>
            <h2 className="serif" style={{ color: 'var(--gold)', fontSize: '24px', marginBottom: '16px' }}>Cross-Platform Readiness</h2>
            <p style={{ opacity: 0.8, fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
              Property Finder performance is now tied directly to live Sierra Blu inventory and CRM records, so the report reflects what is really active in the system.
            </p>
            <div style={{ display: 'grid', gap: '12px', marginBottom: '30px' }}>
              {(reportState.topAreas.length ? reportState.topAreas : [{ label: 'No inventory yet', count: 0 }]).map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', fontSize: '13px' }}>
                  <span>{item.label}</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{item.count} assets</span>
                </div>
              ))}
            </div>
            <button className="btn btn-gold" style={{ width: '100%' }}>Review Connected Inventory</button>
          </div>
        </div>
      </div>
    </div>
  );
}
