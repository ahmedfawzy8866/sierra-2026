'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Search, LayoutGrid, List, Phone, Mail, Clock, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  stage: string;
  phase: string;
  originChannel: string;
  pfLeadId?: string;
  pfListingReferenceNumber?: string;
  updatedAt?: any;
  createdAt?: any;
}

const PIPELINE_COLUMNS = [
  { key: 'new', label: 'New Leads', stages: ['inbound', 'qualify'], color: '#3B82F6' },
  { key: 'engaged', label: 'Engaged', stages: ['engage', 'proposal', 'consultation'], color: '#C9A84C' },
  { key: 'viewing', label: 'Viewing', stages: ['viewing'], color: '#8B5CF6' },
  { key: 'negotiation', label: 'Negotiation', stages: ['negotiate', 'reserve', 'negotiation'], color: '#F59E0B' },
  { key: 'closing', label: 'Closing', stages: ['contract', 'handover', 'closed-won', 'closed'], color: '#10B981' },
];

const SOURCE_STYLES: Record<string, string> = {
  'property-finder': 'bg-blue-50 text-blue-600',
  whatsapp: 'bg-green-50 text-green-600',
  website: 'bg-purple-50 text-purple-600',
  referral: 'bg-amber-50 text-amber-600',
  telegram: 'bg-cyan-50 text-cyan-600',
};

function timeAgo(ts: any): string {
  if (!ts) return '';
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AdminDealsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'board' | 'list'>('board');
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [newDealForm, setNewDealForm] = useState({ name: '', email: '', phone: '', stage: 'new' });

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, 'leads'), orderBy('updatedAt', 'desc'), limit(200));
        const snap = await getDocs(q);
        setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() } as Lead)));
      } catch (err) {
        console.error('Failed to load leads:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = leads.filter(l => {
    if (sourceFilter !== 'all' && l.source !== sourceFilter) return false;
    if (search && !l.name?.toLowerCase().includes(search.toLowerCase()) && !l.phone?.includes(search)) return false;
    return true;
  });

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination } = result;
    if (!destination) return;

    const newStage = PIPELINE_COLUMNS.find(col => col.key === destination.droppableId)?.stages[0];
    if (!newStage) return;

    try {
      await updateDoc(doc(db, 'leads', draggableId), { stage: newStage, updatedAt: serverTimestamp() });
      setLeads(leads.map(l => (l.id === draggableId ? { ...l, stage: newStage } : l)));
    } catch (err) {
      console.error('Failed to update lead:', err);
    }
  };

  const handleAddDeal = async () => {
    if (!newDealForm.name || !newDealForm.email) return;
    try {
      await addDoc(collection(db, 'leads'), {
        ...newDealForm,
        stage: PIPELINE_COLUMNS.find(col => col.key === newDealForm.stage)?.stages[0] || 'inbound',
        source: 'manual',
        originChannel: 'admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setNewDealForm({ name: '', email: '', phone: '', stage: 'new' });
      setShowNewDealModal(false);
      // Reload
      const q = query(collection(db, 'leads'), orderBy('updatedAt', 'desc'), limit(200));
      const snap = await getDocs(q);
      setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() } as Lead)));
    } catch (err) {
      console.error('Failed to add deal:', err);
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#071422] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Deal Pipeline
          </h1>
          <p className="text-[#3a5570] text-sm mt-0.5">{filtered.length} leads in pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewDealModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#031632] text-white rounded-lg text-sm font-semibold hover:bg-[#041f3d] transition-colors"
          >
            <Plus size={16} /> Add Deal
          </button>
          <button onClick={() => setView('board')} className={`p-2 rounded-lg transition-colors ${view === 'board' ? 'bg-[#031632] text-white' : 'bg-white text-[#3a5570] hover:bg-[#f3f4f5]'}`}>
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-[#031632] text-white' : 'bg-white text-[#3a5570] hover:bg-[#f3f4f5]'}`}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5570]/40" />
          <input
            type="text" placeholder="Search by name or phone..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C] transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'property-finder', 'whatsapp', 'website', 'referral'].map(s => (
            <button key={s} onClick={() => setSourceFilter(s)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${sourceFilter === s ? 'bg-[#031632] text-white' : 'bg-white text-[#3a5570] hover:bg-[#f3f4f5]'}`}>
              {s === 'all' ? 'All' : s === 'property-finder' ? 'PF' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[#f3f4f5] rounded-xl p-4 h-96 animate-pulse" />
          ))}
        </div>
      ) : view === 'board' ? (
        /* ══ KANBAN BOARD VIEW ══ */
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 500 }}>
            {PIPELINE_COLUMNS.map(col => {
              const colLeads = filtered.filter(l =>
                col.stages.includes(l.stage) || col.stages.includes(l.phase)
              );
              return (
                <Droppable key={col.key} droppableId={col.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-w-[320px] flex-1 bg-[#f3f4f5] rounded-xl p-3"
                      style={{
                        background: snapshot.isDraggingOver ? '#E2E8F0' : '#f3f4f5',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: col.color }} />
                          <span className="text-xs font-bold text-[#071422] uppercase tracking-wide">{col.label}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#3a5570]/50 bg-white px-2 py-0.5 rounded">
                          {colLeads.length}
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {colLeads.map((lead, index) => (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white rounded-xl p-4 shadow-[0_2px_8px_-2px_rgba(3,22,50,0.06)] hover:shadow-[0_4px_16px_-4px_rgba(3,22,50,0.1)] transition-shadow cursor-grab active:cursor-grabbing"
                                style={{
                                  borderLeft: lead.source === 'property-finder' ? '3px solid #C9A84C' : '3px solid transparent',
                                  opacity: snapshot.isDragging ? 0.5 : 1,
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <span className="font-semibold text-sm text-[#071422] leading-tight flex-1">{lead.name}</span>
                                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${SOURCE_STYLES[lead.source] || 'bg-gray-50 text-gray-500'}`}>
                                    {lead.source === 'property-finder' ? 'PF' : lead.source || 'N/A'}
                                  </span>
                                </div>
                                {lead.phone && (
                                  <div className="flex items-center gap-1.5 text-[11px] text-[#3a5570]/70 mb-1">
                                    <Phone size={10} /> {lead.phone}
                                  </div>
                                )}
                                {lead.email && (
                                  <div className="flex items-center gap-1.5 text-[11px] text-[#3a5570]/70 mb-1 truncate">
                                    <Mail size={10} /> {lead.email}
                                  </div>
                                )}
                                <div className="flex items-center gap-1 text-[10px] text-[#3a5570]/40 mt-2">
                                  <Clock size={9} /> {timeAgo(lead.updatedAt || lead.createdAt)}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {colLeads.length === 0 && (
                          <div className="text-center py-8 text-[#3a5570]/30 text-xs">No leads</div>
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      ) : (
        /* ══ LIST VIEW ══ */
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f3f4f5]">
                  {['Name', 'Phone', 'Email', 'Source', 'Stage', 'Channel', 'Updated'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-[#3a5570]/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <tr key={lead.id} className="border-b border-[#f3f4f5] hover:bg-[#f8f9fa] transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-semibold text-sm text-[#071422]">{lead.name}</td>
                    <td className="px-6 py-4 text-sm text-[#3a5570] font-mono">{lead.phone}</td>
                    <td className="px-6 py-4 text-sm text-[#3a5570] truncate max-w-[200px]">{lead.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-widest ${SOURCE_STYLES[lead.source] || 'bg-gray-50 text-gray-500'}`}>
                        {lead.source || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#3a5570] capitalize">{lead.stage}</td>
                    <td className="px-6 py-4 text-[11px] text-[#3a5570]/60">{lead.originChannel}</td>
                    <td className="px-6 py-4 text-[11px] text-[#3a5570]/40 font-mono">{timeAgo(lead.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-[#3a5570]/40 text-sm">No leads found.</p>
            </div>
          )}
        </div>
      )}

      {/* New Deal Modal */}
      {showNewDealModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-[#071422] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              New Deal
            </h2>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Lead Name"
                value={newDealForm.name}
                onChange={e => setNewDealForm({ ...newDealForm, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
              />
              <input
                type="email"
                placeholder="Email"
                value={newDealForm.email}
                onChange={e => setNewDealForm({ ...newDealForm, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newDealForm.phone}
                onChange={e => setNewDealForm({ ...newDealForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewDealModal(false)}
                className="flex-1 px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm font-semibold text-[#071422] hover:bg-[#f3f4f5]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDeal}
                className="flex-1 px-4 py-2.5 bg-[#031632] text-white rounded-lg text-sm font-semibold hover:bg-[#041f3d]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
