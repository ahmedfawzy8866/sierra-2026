'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Search, Mail, Phone, Trash2, Users, TrendingUp, DollarSign } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'agent' | 'broker' | 'viewer';
  status: 'active' | 'inactive';
  commissionRate?: number;
  totalCommission?: number;
  dealsCount?: number;
  joinedAt?: any;
  createdAt?: any;
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | TeamMember['role']>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [_editingId, _setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'agent' as TeamMember['role'], commissionRate: 5 });
  const [teamStats, setTeamStats] = useState({ totalAgents: 0, totalDeals: 0, totalCommission: 0 });

  // Load team members and commission data
  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, 'users'), where('role', 'in', ['admin', 'agent', 'broker']));
        const snap = await getDocs(q);

        const teamMembers = snap.docs.map(d => ({ id: d.id, ...d.data() } as TeamMember));

        // Load deal counts for each agent
        for (let i = 0; i < teamMembers.length; i++) {
          const dealsQ = query(collection(db, 'deals'), where('agentId', '==', teamMembers[i].id));
          const dealsSnap = await getDocs(dealsQ);
          teamMembers[i].dealsCount = dealsSnap.size;

          // Calculate commission (mock: assume 5% per deal at 2.5M average)
          const commission = (teamMembers[i].commissionRate || 5) * (teamMembers[i].dealsCount || 0) * 0.025 * 1000000 / 100;
          teamMembers[i].totalCommission = commission;
        }

        setMembers(teamMembers);

        // Calculate team stats
        const agents = teamMembers.filter(m => m.role === 'agent' || m.role === 'broker');
        const totalDeals = agents.reduce((sum, m) => sum + (m.dealsCount || 0), 0);
        const totalCommission = agents.reduce((sum, m) => sum + (m.totalCommission || 0), 0);

        setTeamStats({
          totalAgents: agents.length,
          totalDeals,
          totalCommission,
        });
      } catch (err) {
        console.error('Failed to load team members:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = members.filter(m => {
    if (roleFilter !== 'all' && m.role !== roleFilter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.email.includes(search)) return false;
    return true;
  });

  const handleAddMember = async () => {
    if (!formData.name || !formData.email) return;
    try {
      await addDoc(collection(db, 'users'), {
        ...formData,
        status: 'active',
        dealsCount: 0,
        totalCommission: 0,
        createdAt: serverTimestamp(),
      });
      setFormData({ name: '', email: '', phone: '', role: 'agent', commissionRate: 5 });
      setShowAddModal(false);
      // Reload
      const q = query(collection(db, 'users'), where('role', 'in', ['admin', 'agent', 'broker']));
      const snap = await getDocs(q);
      const teamMembers = snap.docs.map(d => ({ id: d.id, ...d.data() } as TeamMember));

      // Load deal counts for each agent
      for (let i = 0; i < teamMembers.length; i++) {
        const dealsQ = query(collection(db, 'deals'), where('agentId', '==', teamMembers[i].id));
        const dealsSnap = await getDocs(dealsQ);
        teamMembers[i].dealsCount = dealsSnap.size;
        const commission = (teamMembers[i].commissionRate || 5) * (teamMembers[i].dealsCount || 0) * 0.025 * 1000000 / 100;
        teamMembers[i].totalCommission = commission;
      }
      setMembers(teamMembers);
    } catch (err) {
      console.error('Failed to add member:', err);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Remove this team member?')) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      setMembers(members.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#071422] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Team Management
          </h1>
          <p className="text-[#3a5570] text-sm mt-0.5">{filtered.length} team members</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#031632] text-white rounded-lg text-sm font-semibold hover:bg-[#041f3d] transition-colors"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Team Insights */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#3a5570]/60 uppercase tracking-wide">Total Agents</span>
            <Users size={16} className="text-[#3B82F6]" />
          </div>
          <div className="text-2xl font-bold text-[#071422]">{teamStats.totalAgents}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#3a5570]/60 uppercase tracking-wide">Total Deals</span>
            <TrendingUp size={16} className="text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold text-[#071422]">{teamStats.totalDeals}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#3a5570]/60 uppercase tracking-wide">Total Commission</span>
            <DollarSign size={16} className="text-[#C9A84C]" />
          </div>
          <div className="text-2xl font-bold text-[#C9A84C]">EGP {(teamStats.totalCommission / 1000000).toFixed(1)}M</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5570]/40" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'admin', 'agent', 'broker'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                roleFilter === r ? 'bg-[#031632] text-white' : 'bg-white text-[#3a5570] hover:bg-[#f3f4f5]'
              }`}
            >
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Team List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)] overflow-hidden">
          <div className="divide-y divide-[#f3f4f5]">
            {filtered.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="mx-auto mb-3 text-[#3a5570]/30" size={32} />
                <p className="text-[#3a5570]/40 text-sm">No team members found.</p>
              </div>
            ) : (
              filtered.map(member => (
                <div key={member.id} className="flex items-center justify-between p-6 hover:bg-[#f8f9fa] transition-colors">
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-[#071422] mb-1">{member.name}</div>
                    <div className="flex items-center gap-3 text-xs text-[#3a5570]/60 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Mail size={12} /> {member.email}
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-1">
                          <Phone size={12} /> {member.phone}
                        </div>
                      )}
                      {member.role !== 'admin' && (
                        <>
                          <span className="w-0.5 h-0.5 bg-[#3a5570]/30 rounded-full" />
                          <div>{member.dealsCount || 0} deals</div>
                          {member.totalCommission && (
                            <>
                              <span className="w-0.5 h-0.5 bg-[#3a5570]/30 rounded-full" />
                              <div className="text-[#C9A84C]">EGP {(member.totalCommission / 1000000).toFixed(2)}M</div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide" style={{
                      background: member.role === 'admin' ? '#EDE9FE' : '#DBEAFE',
                      color: member.role === 'admin' ? '#6D28D9' : '#0369A1'
                    }}>
                      {member.role}
                    </span>
                    <button onClick={() => handleDeleteMember(member.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-[#071422] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Add Team Member
            </h2>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
              />
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
              >
                <option value="agent">Agent</option>
                <option value="broker">Broker</option>
                <option value="admin">Admin</option>
              </select>
              {formData.role !== 'admin' && (
                <input
                  type="number"
                  placeholder="Commission Rate (%)"
                  value={formData.commissionRate || 5}
                  onChange={e => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
                />
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm font-semibold text-[#071422] hover:bg-[#f3f4f5]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="flex-1 px-4 py-2.5 bg-[#031632] text-white rounded-lg text-sm font-semibold hover:bg-[#041f3d]"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
