'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Mail, Phone, Calendar, Edit2, Save, X } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  stage: string;
  phase: string;
  originChannel: string;
  pfLeadId?: string;
  pfListingReferenceNumber?: string;
  propertyPreferences?: string;
  budgetRange?: string;
  timeline?: string;
  notes?: string;
  updatedAt?: any;
  createdAt?: any;
}

export default function AdminLeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params?.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});

  useEffect(() => {
    async function load() {
      if (!leadId) return;
      try {
        const docRef = doc(db, 'leads', leadId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Lead;
          setLead(data);
          setFormData(data);
        }
      } catch (err) {
        console.error('Failed to load lead:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [leadId]);

  const handleSave = async () => {
    if (!lead) return;
    try {
      await updateDoc(doc(db, 'leads', lead.id), {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      setLead({ ...lead, ...formData });
      setEditing(false);
    } catch (err) {
      console.error('Failed to update lead:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#C9A84C] text-sm animate-pulse">Loading lead...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-[#3a5570]/40">Lead not found</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[#f3f4f5] rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-[#3a5570]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#071422]" style={{ fontFamily: 'var(--font-display)' }}>
            {lead.name}
          </h1>
          <p className="text-[#3a5570] text-sm mt-1">Lead ID: {lead.id}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#071422]" style={{ fontFamily: 'var(--font-display)' }}>
                Contact Information
              </h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#031632] hover:bg-[#f3f4f5] rounded-lg transition-colors"
                >
                  <Edit2 size={14} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormData(lead);
                      setEditing(false);
                    }}
                    className="p-1.5 hover:bg-red-50 rounded text-red-600"
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#031632] text-white rounded-lg hover:bg-[#041f3d]"
                  >
                    <Save size={14} /> Save
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {editing ? (
                <>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
                    placeholder="Email"
                  />
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={e =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
                    placeholder="Phone"
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-[#3a5570]/40" />
                    <div>
                      <p className="text-xs text-[#3a5570]/60 uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-sm text-[#071422] font-mono">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-[#3a5570]/40" />
                    <div>
                      <p className="text-xs text-[#3a5570]/60 uppercase tracking-wide">
                        Phone
                      </p>
                      <p className="text-sm text-[#071422]">{lead.phone}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Lead Details */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
            <h2 className="text-lg font-bold text-[#071422] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Lead Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#3a5570]/60 uppercase tracking-wide font-semibold mb-2">
                  Source
                </p>
                <p className="text-sm text-[#071422] capitalize">{lead.source}</p>
              </div>
              <div>
                <p className="text-xs text-[#3a5570]/60 uppercase tracking-wide font-semibold mb-2">
                  Stage
                </p>
                <p className="text-sm text-[#071422] capitalize">{lead.stage}</p>
              </div>
              <div>
                <p className="text-xs text-[#3a5570]/60 uppercase tracking-wide font-semibold mb-2">
                  Channel
                </p>
                <p className="text-sm text-[#071422]">{lead.originChannel}</p>
              </div>
              <div>
                <p className="text-xs text-[#3a5570]/60 uppercase tracking-wide font-semibold mb-2">
                  Phase
                </p>
                <p className="text-sm text-[#071422] capitalize">{lead.phase}</p>
              </div>
            </div>
          </div>

          {/* Property Preferences */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
            <h2 className="text-lg font-bold text-[#071422] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Property Preferences
            </h2>
            {editing ? (
              <textarea
                value={formData.propertyPreferences || ''}
                onChange={e =>
                  setFormData({
                    ...formData,
                    propertyPreferences: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
                placeholder="Property preferences..."
                rows={4}
              />
            ) : (
              <p className="text-sm text-[#3a5570]">
                {lead.propertyPreferences || 'No preferences recorded'}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
            <h3 className="text-sm font-bold text-[#071422] mb-4 uppercase tracking-wide">
              Timeline
            </h3>
            <div className="space-y-3">
              {lead.createdAt && (
                <div className="flex items-start gap-3">
                  <Calendar size={14} className="text-[#3a5570]/40 mt-1" />
                  <div>
                    <p className="text-[10px] text-[#3a5570]/60 uppercase tracking-wide">
                      Created
                    </p>
                    <p className="text-xs text-[#071422] font-mono">
                      {lead.createdAt?.toDate?.()?.toLocaleDateString?.() || 'N/A'}
                    </p>
                  </div>
                </div>
              )}
              {lead.updatedAt && (
                <div className="flex items-start gap-3">
                  <Calendar size={14} className="text-[#3a5570]/40 mt-1" />
                  <div>
                    <p className="text-[10px] text-[#3a5570]/60 uppercase tracking-wide">
                      Updated
                    </p>
                    <p className="text-xs text-[#071422] font-mono">
                      {lead.updatedAt?.toDate?.()?.toLocaleDateString?.() || 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          {lead.pfListingReferenceNumber && (
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
              <h3 className="text-sm font-bold text-[#071422] mb-4 uppercase tracking-wide">
                Property Finder
              </h3>
              <p className="text-xs font-mono text-[#C9A84C] bg-[#031632]/5 px-2 py-1.5 rounded">
                {lead.pfListingReferenceNumber}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
