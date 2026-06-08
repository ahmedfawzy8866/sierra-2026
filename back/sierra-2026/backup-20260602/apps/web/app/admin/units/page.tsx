'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import {
  collection, query, where, orderBy, limit, getDocs,
  startAfter, QueryDocumentSnapshot, deleteDoc, doc, serverTimestamp, addDoc
} from 'firebase/firestore';
import { Plus, Search, Upload, CheckCircle2, Loader2, Trash2, LayoutGrid, List, DollarSign, Home } from 'lucide-react';

interface Unit {
  id: string;
  title: string;
  compound: string;
  propertyType: string;
  area: number;
  bedrooms: number;
  price: number;
  status: string;
  pfReferenceNumber?: string;
  automation?: { isPublishedToPF?: boolean };
}

const STATUS_OPTIONS = ['all', 'available', 'reserved', 'sold'];
const STATUS_STYLES: Record<string, string> = {
  available: 'bg-green-50 text-green-700',
  reserved:  'bg-yellow-50 text-yellow-700',
  sold:      'bg-gray-100 text-gray-500',
};

export default function AdminUnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    propertyType: 'apartment',
    compound: '',
    price: 0,
    area: 0,
    bedrooms: 1,
    bathrooms: 1,
  });

  async function publishToPF(unitId: string) {
    setPublishing(unitId);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/sync/publish', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId }),
      });
      if (res.ok) {
        setUnits(prev => prev.map(u => u.id === unitId ? { ...u, automation: { ...u.automation, isPublishedToPF: true } } : u));
      } else {
        const err = await res.json();
        alert(`Publish failed: ${err.error}`);
      }
    } catch (err: any) {
      alert(`Publish failed: ${err.message}`);
    } finally {
      setPublishing(null);
    }
  }

  async function handleDeleteUnit(unitId: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Delete this property permanently?')) return;
    try {
      await deleteDoc(doc(db, 'listings', unitId));
      setUnits(prev => prev.filter(u => u.id !== unitId));
    } catch (_err) {
      alert('Failed to delete property');
    }
  }

  async function handleCreateUnit() {
    if (!createForm.title || !createForm.compound) return;
    try {
      await addDoc(collection(db, 'listings'), {
        ...createForm,
        status: 'available',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setCreateForm({ title: '', propertyType: 'apartment', compound: '', price: 0, area: 0, bedrooms: 1, bathrooms: 1 });
      setShowCreateModal(false);
      setLastDoc(null);
      fetchUnits(true);
    } catch (_err) {
      alert('Failed to create property');
    }
  }

  const fetchUnits = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      let q = filter === 'all'
        ? query(collection(db, 'listings'), orderBy('createdAt', 'desc'), limit(50))
        : query(collection(db, 'listings'), where('status', '==', filter), orderBy('createdAt', 'desc'), limit(50));

      if (!reset && lastDoc) {
        q = filter === 'all'
          ? query(collection(db, 'listings'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(50))
          : query(collection(db, 'listings'), where('status', '==', filter), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(50));
      }

      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Unit));
      setUnits(reset ? data : prev => [...prev, ...data]);
      setLastDoc(snap.docs[snap.docs.length - 1] ?? null);
      setHasMore(snap.docs.length === 50);
    } finally {
      setLoading(false);
    }
  }, [filter, lastDoc]);

  useEffect(() => {
    setLastDoc(null);
    fetchUnits(true);
  }, [filter]);

  const displayed = search
    ? units.filter(u =>
        u.title?.toLowerCase().includes(search.toLowerCase()) ||
        u.compound?.toLowerCase().includes(search.toLowerCase())
      )
    : units;

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#071422] tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}>
            Unit Inventory
          </h1>
          <p className="text-[#3a5570] text-sm mt-0.5">{units.length} units loaded</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-[#031632] text-white px-5 py-2.5 rounded-lg
                       text-xs font-bold tracking-widest uppercase hover:bg-[#1a2b48] transition-colors"
          >
            <Plus size={14} />
            Add Unit
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-[#031632] text-white' : 'bg-white text-[#3a5570] hover:bg-[#f3f4f5]'}`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#031632] text-white' : 'bg-white text-[#3a5570] hover:bg-[#f3f4f5]'}`}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5570]/40" />
          <input
            type="text"
            placeholder="Search by title or compound..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e7e8e9] rounded-lg
                       text-sm outline-none focus:border-[#C9A84C] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                filter === s
                  ? 'bg-[#031632] text-white'
                  : 'bg-white text-[#3a5570] hover:bg-[#f3f4f5]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table/Grid View */}
      {viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f3f4f5]">
                  {['Title', 'Compound', 'Type', 'Area', 'Beds', 'Price (EGP)', 'Status', 'PF', 'Actions'].map(h => (
                    <th key={h}
                      className="text-left px-6 py-4 text-[9px] font-bold uppercase tracking-widest text-[#3a5570]/50">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && units.length === 0
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b border-[#f3f4f5]">
                        {Array.from({ length: 9 }).map((_, j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="h-4 bg-[#f3f4f5] rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : displayed.map(unit => (
                      <tr
                        key={unit.id}
                        className="border-b border-[#f3f4f5] hover:bg-[#f8f9fa] transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-sm text-[#071422] cursor-pointer" onClick={() => window.location.href = `/admin/units/${unit.id}`}>{unit.title}</td>
                        <td className="px-6 py-4 text-sm text-[#3a5570]">{unit.compound}</td>
                        <td className="px-6 py-4 text-sm text-[#3a5570] capitalize">{unit.propertyType}</td>
                        <td className="px-6 py-4 text-sm text-[#3a5570] font-mono">{unit.area} m²</td>
                        <td className="px-6 py-4 text-sm text-[#3a5570]">{unit.bedrooms}</td>
                        <td className="px-6 py-4 text-sm text-[#031632] font-mono font-semibold">
                          {unit.price?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-widest ${
                            STATUS_STYLES[unit.status] ?? 'bg-gray-50 text-gray-400'
                          }`}>
                            {unit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                          {unit.automation?.isPublishedToPF ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 size={14} />
                              <span className="text-[9px] font-bold uppercase tracking-wide">Live</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => publishToPF(unit.id)}
                              disabled={publishing === unit.id}
                              className="flex items-center gap-1.5 bg-[#C9A84C]/10 text-[#C9A84C] hover:bg-[#C9A84C]/20 px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-wide transition-colors disabled:opacity-50"
                            >
                              {publishing === unit.id ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                              {publishing === unit.id ? 'Publishing...' : 'Publish'}
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={e => handleDeleteUnit(unit.id, e)} className="text-red-600 hover:text-red-700">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Load More */}
          {hasMore && !search && (
            <div className="px-6 py-4 border-t border-[#f3f4f5] flex justify-center">
              <button
                onClick={() => fetchUnits(false)}
                disabled={loading}
                className="text-xs text-[#3a5570] hover:text-[#C9A84C] uppercase tracking-widest font-bold transition-colors"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayed.map(unit => (
            <div key={unit.id} className="bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(3,22,50,0.06)] hover:shadow-[0_4px_16px_-4px_rgba(3,22,50,0.1)] transition-shadow">
              <div className="aspect-video bg-[#f3f4f5] flex items-center justify-center">
                <Home size={32} className="text-[#3a5570]/30" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-[#071422] truncate">{unit.title}</h3>
                <p className="text-xs text-[#3a5570]/60 mt-1">{unit.compound}</p>
                <div className="grid grid-cols-2 gap-2 my-3 text-[10px]">
                  <div className="text-center p-2 bg-[#f3f4f5] rounded">
                    <div className="font-bold text-[#071422]">{unit.bedrooms}</div>
                    <div className="text-[#3a5570]/60">Beds</div>
                  </div>
                  <div className="text-center p-2 bg-[#f3f4f5] rounded">
                    <div className="font-bold text-[#071422]">{unit.area}</div>
                    <div className="text-[#3a5570]/60">m²</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-[#C9A84C] mb-3">
                  <DollarSign size={14} /> {(unit.price / 1000000).toFixed(1)}M
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/units/${unit.id}`} className="flex-1 text-center px-3 py-2 bg-[#031632] text-white text-xs font-bold rounded hover:bg-[#1a2b48] transition-colors">
                    View
                  </Link>
                  <button onClick={e => handleDeleteUnit(unit.id, e)} className="px-3 py-2 bg-red-50 text-red-600 text-xs font-bold rounded hover:bg-red-100">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#071422] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Add New Property
            </h2>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Title"
                value={createForm.title}
                onChange={e => setCreateForm({ ...createForm, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
              />
              <select
                value={createForm.propertyType}
                onChange={e => setCreateForm({ ...createForm, propertyType: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="townhouse">Townhouse</option>
              </select>
              <input
                type="text"
                placeholder="Compound"
                value={createForm.compound}
                onChange={e => setCreateForm({ ...createForm, compound: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
              />
              <input
                type="number"
                placeholder="Price"
                value={createForm.price}
                onChange={e => setCreateForm({ ...createForm, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
              />
              <input
                type="number"
                placeholder="Area (m²)"
                value={createForm.area}
                onChange={e => setCreateForm({ ...createForm, area: parseFloat(e.target.value) })}
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Beds"
                  value={createForm.bedrooms}
                  onChange={e => setCreateForm({ ...createForm, bedrooms: parseInt(e.target.value) })}
                  className="px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
                />
                <input
                  type="number"
                  placeholder="Baths"
                  value={createForm.bathrooms}
                  onChange={e => setCreateForm({ ...createForm, bathrooms: parseInt(e.target.value) })}
                  className="px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm font-semibold text-[#071422] hover:bg-[#f3f4f5]">
                Cancel
              </button>
              <button onClick={handleCreateUnit} className="flex-1 px-4 py-2.5 bg-[#031632] text-white rounded-lg text-sm font-semibold hover:bg-[#041f3d]">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
