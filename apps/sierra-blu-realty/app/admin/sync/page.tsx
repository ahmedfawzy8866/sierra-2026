'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { RefreshCw, Users, Zap, Loader2, CheckCircle2, XCircle, CreditCard, Webhook, Database } from 'lucide-react';

interface SyncResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface ActivityLog {
  id: string;
  type: string;
  description: string;
  actorName: string;
  createdAt: any;
}

export default function AdminSyncPage() {
  const [syncingListings, setSyncingListings] = useState(false);
  const [syncingLeads, setSyncingLeads] = useState(false);
  const [syncingFull, setSyncingFull] = useState(false);
  const [syncingAirtable, setSyncingAirtable] = useState(false);
  const [listingsResult, setListingsResult] = useState<SyncResult | null>(null);
  const [leadsResult, setLeadsResult] = useState<SyncResult | null>(null);
  const [fullResult, setFullResult] = useState<SyncResult | null>(null);
  const [airtableResult, setAirtableResult] = useState<SyncResult | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [credits, setCredits] = useState<any>(null);
  const [loadingCredits, setLoadingCredits] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    try {
      const q = query(
        collection(db, 'activities'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const snap = await getDocs(q);
      setActivities(snap.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLog)));
    } catch (err) {
      console.error('Failed to load activities:', err);
    }
  }

  async function getAuthHeaders(): Promise<HeadersInit> {
    const token = await auth.currentUser?.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async function postSync(url: string, setLoading: (v: boolean) => void, setResult: (v: SyncResult) => void) {
    setLoading(true);
    setResult({ success: false });
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setResult({ success: res.ok, data, error: data.error });
      if (res.ok) loadActivities();
    } catch (err: any) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  }

  function runSync(action: string, setLoading: (v: boolean) => void, setResult: (v: SyncResult) => void) {
    return postSync(`/api/sync?action=${action}`, setLoading, setResult);
  }

  async function checkCredits() {
    setLoadingCredits(true);
    try {
      const res = await fetch('/api/property-finder?action=credit-balance');
      const data = await res.json();
      setCredits(data);
    } catch {
      setCredits({ error: 'Failed to fetch' });
    } finally {
      setLoadingCredits(false);
    }
  }

  const actions = [
    {
      title: 'Sync Listings',
      desc: 'Pull latest listings from Property Finder into inventory',
      icon: RefreshCw,
      loading: syncingListings,
      result: listingsResult,
      action: () => runSync('sync-listings', setSyncingListings, setListingsResult),
      color: '#3B82F6',
    },
    {
      title: 'Sync Leads',
      desc: 'Import new leads from Property Finder',
      icon: Users,
      loading: syncingLeads,
      result: leadsResult,
      action: () => runSync('sync-leads', setSyncingLeads, setLeadsResult),
      color: '#10B981',
    },
    {
      title: 'Full Sync',
      desc: 'Run complete sync: listings + leads + dedup engine',
      icon: Zap,
      loading: syncingFull,
      result: fullResult,
      action: () => runSync('run-sync', setSyncingFull, setFullResult),
      color: '#C9A84C',
    },
    {
      title: 'Sync Airtable',
      desc: 'Import owner/broker listings from the Airtable base into inventory',
      icon: Database,
      loading: syncingAirtable,
      result: airtableResult,
      action: () => postSync('/api/sync/airtable', setSyncingAirtable, setAirtableResult),
      color: '#8B5CF6',
    },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#071422] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Sync Center
        </h1>
        <p className="text-[#3a5570] text-sm mt-0.5">Property Finder &amp; Airtable integration management</p>
      </div>

      {/* ══ Quick Actions ══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {actions.map(({ title, desc, icon: Icon, loading, result, action, color }) => (
          <div key={title}
            className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)] hover:shadow-[0_8px_32px_-4px_rgba(3,22,50,0.1)] transition-shadow">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}14` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-[#071422]">{title}</h3>
                <p className="text-[11px] text-[#3a5570]/60 mt-0.5">{desc}</p>
              </div>
            </div>

            <button onClick={action} disabled={loading}
              className="w-full bg-[#031632] text-white px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-[#1a2b48] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Running...</> : `Run ${title}`}
            </button>

            {result && (
              <div className={`mt-3 p-3 rounded-lg text-xs ${result.success ? 'bg-green-50 text-green-700' : result.error ? 'bg-red-50 text-red-600' : ''}`}>
                {result.success ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} />
                    <span className="font-mono">{JSON.stringify(result.data, null, 0).slice(0, 120)}</span>
                  </div>
                ) : result.error ? (
                  <div className="flex items-center gap-1.5">
                    <XCircle size={12} />
                    <span>{result.error}</span>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ══ PF Credits ══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-[#C9A84C]" />
              <h3 className="font-bold text-sm text-[#071422]">PF API Credits</h3>
            </div>
            <button onClick={checkCredits} disabled={loadingCredits}
              className="text-xs text-[#3a5570] hover:text-[#C9A84C] uppercase tracking-widest font-bold transition-colors">
              {loadingCredits ? 'Checking...' : 'Check Balance'}
            </button>
          </div>
          {credits && (
            <div className="font-mono text-sm text-[#031632]">
              {credits.error ? (
                <span className="text-red-500">{credits.error}</span>
              ) : (
                <pre className="text-xs bg-[#f3f4f5] p-3 rounded-lg overflow-auto">{JSON.stringify(credits, null, 2)}</pre>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
          <div className="flex items-center gap-2 mb-4">
            <Webhook size={16} className="text-[#8B5CF6]" />
            <h3 className="font-bold text-sm text-[#071422]">Webhook Endpoint</h3>
          </div>
          <div className="bg-[#f3f4f5] p-3 rounded-lg">
            <code className="text-xs text-[#031632] font-mono break-all">
              {typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/property-finder` : '/api/webhooks/property-finder'}
            </code>
          </div>
          <p className="text-[10px] text-[#3a5570]/50 mt-2">
            Events: lead.created, lead.updated, lead.assigned, listing.published, listing.unpublished
          </p>
        </div>
      </div>

      {/* ══ Sync Activity Log ══ */}
      <div className="bg-white rounded-2xl shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)] overflow-hidden">
        <div className="px-8 py-6 border-b border-[#f3f4f5] flex items-center justify-between">
          <h2 className="font-bold text-[#071422]" style={{ fontFamily: 'var(--font-display)' }}>
            Sync Activity Log
          </h2>
          <span className="text-[9px] text-[#3a5570]/50 uppercase tracking-widest font-mono">
            Last 20 entries
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#3a5570]/40 text-sm">No sync activity yet.</p>
            <p className="text-[9px] text-[#3a5570]/30 mt-2 uppercase tracking-widest">
              Run a sync to see activity here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#f3f4f5]">
            {activities.filter(a => a.type === 'sync_completed').map(act => (
              <div key={act.id} className="flex items-center justify-between px-8 py-5 hover:bg-[#f8f9fa] transition-colors">
                <div>
                  <div className="text-sm text-[#071422]">{act.description?.replace(/\*\*/g, '')}</div>
                  <div className="text-[10px] text-[#3a5570]/50 mt-0.5 font-mono">{act.actorName}</div>
                </div>
                <div className="text-[10px] text-[#3a5570]/40 font-mono">
                  {act.createdAt?.toDate ? act.createdAt.toDate().toLocaleString() : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
