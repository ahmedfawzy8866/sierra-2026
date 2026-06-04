'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit, getCountFromServer } from 'firebase/firestore';
import { Building2, TrendingUp, Handshake, Activity } from 'lucide-react';

interface KPI {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: string;
}

interface RecentDeal {
  id: string;
  clientName: string;
  propertyTitle?: string;
  stage: string;
  status: string;
  amount: number;
  updatedAt: string;
  terms?: { currency?: string; offerPrice?: number };
}

const STAGE_COLORS: Record<string, string> = {
  draft:           'bg-gray-100 text-gray-600',
  offered:         'bg-blue-50 text-blue-600',
  negotiation:     'bg-yellow-50 text-yellow-700',
  signing:         'bg-purple-50 text-purple-600',
  payment_pending: 'bg-orange-50 text-orange-600',
  closed:          'bg-green-50 text-green-700',
};

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [recentDeals, setRecentDeals] = useState<RecentDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Total units
        const unitsSnap = await getCountFromServer(collection(db, 'listings'));
        const totalUnits = unitsSnap.data().count;

        // 2. Active deals (not closed)
        const activeDealsSnap = await getCountFromServer(
          query(collection(db, 'deals'), where('stage', '!=', 'closed'))
        );
        const activeDeals = activeDealsSnap.data().count;

        // 3. Recent deals for the feed
        const recentQ = query(collection(db, 'deals'), orderBy('updatedAt', 'desc'), limit(8));
        const recentSnap = await getDocs(recentQ);
        const recent = recentSnap.docs.map(d => ({ id: d.id, ...d.data() } as RecentDeal));

        // 4. Sync health
        const syncQ = query(collection(db, 'sync_jobs'), orderBy('createdAt', 'desc'), limit(1));
        const syncSnap = await getDocs(syncQ);
        const syncStatus = syncSnap.empty ? 'No syncs yet' : syncSnap.docs[0].data().status;

        setKpis([
          {
            label: 'Total Units',
            value: totalUnits.toLocaleString(),
            sub: 'in Firestore inventory',
            icon: Building2,
            color: '#031632',
          },
          {
            label: 'Active Deals',
            value: activeDeals.toLocaleString(),
            sub: 'in pipeline',
            icon: Handshake,
            color: '#C9A84C',
          },
          {
            label: 'Recent Activity',
            value: recent.length.toLocaleString(),
            sub: 'deals updated recently',
            icon: TrendingUp,
            color: '#3a5570',
          },
          {
            label: 'Sync Status',
            value: syncStatus === 'success' ? '✓ Live' : syncStatus || 'Pending',
            sub: 'last integration relay',
            icon: Activity,
            color: syncStatus === 'success' ? '#16a34a' : '#C9A84C',
          },
        ]);

        setRecentDeals(recent);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[#071422] tracking-tight mb-1"
          style={{ fontFamily: 'var(--font-display)' }}>
          Intelligence Dashboard
        </h1>
        <p className="text-[#3a5570] text-sm">
          Real-time overview of the Sierra Blu operating system.
        </p>
      </div>

      {/* ══ KPI Cards ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 h-36 animate-pulse" />
            ))
          : kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label}
                  className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)] hover:shadow-[0_8px_32px_-4px_rgba(3,22,50,0.1)] transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${kpi.color}14` }}>
                      <Icon size={18} style={{ color: kpi.color }} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold tracking-tight mb-1"
                    style={{ color: kpi.color, fontFamily: 'var(--font-display)' }}>
                    {kpi.value}
                  </div>
                  <div className="text-xs font-semibold text-[#071422] mb-0.5">{kpi.label}</div>
                  <div className="text-[10px] text-[#3a5570]/60 uppercase tracking-wide">{kpi.sub}</div>
                </div>
              );
            })}
      </div>

      {/* ══ Recent Deals Feed ══ */}
      <div className="bg-white rounded-2xl shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)] overflow-hidden">
        <div className="px-8 py-6 border-b border-[#f3f4f5] flex items-center justify-between">
          <h2 className="font-bold text-[#071422]" style={{ fontFamily: 'var(--font-display)' }}>
            Recent Deal Activity
          </h2>
          <span className="text-[9px] text-[#3a5570]/50 uppercase tracking-widest font-mono">
            Live Feed
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[#3a5570]/40 text-sm">Loading feed...</div>
        ) : recentDeals.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#3a5570]/40 text-sm">No deals yet.</p>
            <p className="text-[9px] text-[#3a5570]/30 mt-2 uppercase tracking-widest">
              Deals will appear here once created.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#f3f4f5]">
            {recentDeals.map((deal) => (
              <div key={deal.id}
                className="flex items-center justify-between px-8 py-5 hover:bg-[#f8f9fa] transition-colors">
                <div>
                  <div className="font-semibold text-sm text-[#071422]">{deal.clientName}</div>
                  <div className="text-[10px] text-[#3a5570]/50 uppercase tracking-wide mt-0.5">
                    {deal.propertyTitle}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[9px] font-bold px-3 py-1.5 rounded uppercase tracking-widest ${
                    STAGE_COLORS[deal.stage] ?? 'bg-gray-50 text-gray-500'
                  }`}>
                    {deal.stage}
                  </span>
                  <span className="font-mono font-semibold text-sm text-[#031632]">
                    {deal.terms?.currency || 'EGP'} {deal.terms?.offerPrice?.toLocaleString() ?? '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
