"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy,
  where,
  Timestamp 
} from 'firebase/firestore';
import { useI18n } from '@/lib/I18nContext';

interface Stakeholder {
  id: string;
  name: string;
  phone: string;
  portfolioPreference: string;
  capitalAllocation: string;
  strategicIntensity: string;
  phase: string;
  createdAt: any;
  assignedPartnerName?: string;
  originChannel: string;
}

export default function ClientsScreen() {
  const { t, locale } = useI18n();
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPhase, setFilterPhase] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Stakeholder[];
      setStakeholders(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = stakeholders.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                         s.phone.includes(search) ||
                         s.portfolioPreference.toLowerCase().includes(search.toLowerCase());
    const matchesPhase = filterPhase === 'all' || s.phase === filterPhase;
    return matchesSearch && matchesPhase;
  });

  if (loading) {
    return (
      <div className="section-loader">
        <div className="loader-logo sm">SB</div>
        <p className="mt-4 text-xs tracking-widest opacity-50 uppercase">Assembling Portfolio Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="clients-screen animate-fade-in-up">
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <h1 className="serif text-3xl mb-2 gold-underline">{locale === 'ar' ? 'محفظة المستثمرين' : 'Global Stakeholder Portfolio'}</h1>
        <p className="text-secondary text-sm">Comprehensive record of all active prospects, historical interactions, and asset allocations</p>
      </div>

      <div className="action-bar-luxury glass-panel mb-8 p-4 flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <span className="absolute start-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          <input 
            type="text" 
            className="w-full ps-12 pe-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-gold/50 outline-none transition-all text-sm"
            placeholder={locale === 'ar' ? 'ابحث بالاسم أو الهاتف أو المشروع...' : 'Search by name, phone, or portfolio preference...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <select 
          className="bg-navy-dark border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/50"
          value={filterPhase}
          onChange={e => setFilterPhase(e.target.value)}
        >
          <option value="all">{locale === 'ar' ? 'جميع المراحل' : 'All Phases'}</option>
          <option value="acquisition">{locale === 'ar' ? 'استحواذ' : 'Acquisition'}</option>
          <option value="consultation">{locale === 'ar' ? 'استشارة' : 'Consultation'}</option>
          <option value="inspection">{locale === 'ar' ? 'معاينة' : 'Inspection'}</option>
          <option value="structuring">{locale === 'ar' ? 'هيكلة الصفقة' : 'Structuring'}</option>
          <option value="settlement">{locale === 'ar' ? 'تمت الصفقة' : 'Settled'}</option>
        </select>

        <button className="btn btn-outline btn-sm py-3 px-6 h-auto">
          {locale === 'ar' ? 'تصدير التقرير' : 'Export Ledger'}
        </button>
      </div>

      <div className="table-luxury-wrapper overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
        <table className="w-full text-left border-collapse bg-white/[0.02] backdrop-blur-md">
          <thead>
            <tr className="bg-white/5 uppercase text-[10px] tracking-widest font-bold text-gold/80">
              <th className="px-6 py-5">{locale === 'ar' ? 'المستثمر' : 'Stakeholder Identity'}</th>
              <th className="px-6 py-5">{locale === 'ar' ? 'التخصيص المالي' : 'Capital Allocation'}</th>
              <th className="px-6 py-5">{locale === 'ar' ? 'الأصول المفضلة' : 'Portfolio Focus'}</th>
              <th className="px-6 py-5">{locale === 'ar' ? 'المستشار المسؤول' : 'Assigned Advisor'}</th>
              <th className="px-6 py-5">{locale === 'ar' ? 'المرحلة الحالية' : 'Operational Phase'}</th>
              <th className="px-6 py-5">{locale === 'ar' ? 'تاريخ الدخول' : 'Ingestion Date'}</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filtered.map((s, idx) => (
              <tr key={s.id} className="border-t border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/40 to-gold/10 flex items-center justify-center text-[10px] font-bold text-gold">
                      {s.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-gold transition-colors">{s.name}</div>
                      <div className="text-[10px] opacity-40">{s.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 font-mono text-gold/90">{s.capitalAllocation}</td>
                <td className="px-6 py-5">{s.portfolioPreference}</td>
                <td className="px-6 py-5 opacity-70 italic">{s.assignedPartnerName || 'Unassigned'}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                    s.phase === 'settlement' ? 'bg-emerald-500/10 text-emerald-500' :
                    s.phase === 'acquisition' ? 'bg-blue-500/10 text-blue-500' : 'bg-gold/10 text-gold'
                  }`}>
                    {s.phase}
                  </span>
                </td>
                <td className="px-6 py-5 opacity-40 text-xs">
                  {s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString() : 'Historical'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-20 text-center opacity-30 italic">No stakeholders matching your search criteria were found in the ledger.</div>
        )}
      </div>

      <style>{`
        .gold-underline {
          position: relative;
          display: inline-block;
        }
        .gold-underline::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 40px;
          height: 2px;
          background: var(--gold);
        }
      `}</style>
    </div>
  );
}
