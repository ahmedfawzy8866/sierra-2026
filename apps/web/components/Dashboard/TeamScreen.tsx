"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  deleteDoc,
  doc, 
  serverTimestamp, 
  orderBy 
} from 'firebase/firestore';
import AdvisorProfile from './AdvisorProfile';
import { useI18n } from '@/lib/I18nContext';

interface Partner {
  id: string;
  name: string;
  role: string;
  deals: number;
  revenue: string;
  initials: string;
  color: string;
  badge?: string;
}

export default function TeamScreen({ onNavigate }: { onNavigate?: (screen: any) => void }) {
  const { locale, t } = useI18n();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Partner | null>(null);
  const [partnerDraft, setPartnerDraft] = useState({
    name: '',
    role: '',
    deals: 0,
    revenue: '',
    initials: '',
    color: 'var(--blue)'
  });

  useEffect(() => {
    const q = query(collection(db, 'partners'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Partner[];
      setPartners(data);
      setLoading(false);
    }, (err) => {
      console.error("Partners sync failed:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const enlistPartner = async () => {
    if (!partnerDraft.name || !partnerDraft.role) return;
    try {
      const initials = partnerDraft.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      await addDoc(collection(db, 'partners'), {
        ...partnerDraft,
        initials,
        createdAt: serverTimestamp()
      });
      setShowModal(false);
      setPartnerDraft({ name: '', role: '', deals: 0, revenue: '', initials: '', color: 'var(--blue)' });
    } catch (err) {
      console.error("Enlistment failed:", err);
    }
  };

  const terminatePartner = async (id: string) => {
    if (!confirm("Are you sure you want to terminate this partnership?")) return;
    try {
      await deleteDoc(doc(db, 'partners', id));
    } catch (err) {
      console.error("Termination failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="section-loader">
        <div className="loader-logo sm">SB</div>
        <div className="loader-text sm">Synchronizing Executive Assets…</div>
      </div>
    );
  }

  if (selectedAdvisor) {
    return <AdvisorProfile advisor={selectedAdvisor} onBack={() => setSelectedAdvisor(null)} />;
  }

  return (
    <div className="team-screen animate-fade-in-up stagger-1">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="serif gold-underline" style={{ fontSize: '28px' }}>{t('team.title')}</h1>
          <div className="page-sub">{t('team.subtitle')}</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ {t('team.enlistPartner')}</button>
      </div>

      <div className="kpi-grid mb-8 mt-2">
        <div className="kpi-card cinematic-glow">
          <div className="kpi-label">{t('team.strategicPersonnel')}</div>
          <div className="kpi-value">{partners.length}</div>
          <div className="kpi-badge blue">ADVISORS</div>
        </div>
        <div className="kpi-card cinematic-glow">
          <div className="kpi-label">{t('team.yieldBenchmarking')}</div>
          <div className="kpi-value gold">2.4%</div>
          <div className="kpi-badge up">+0.2%</div>
        </div>
        <div className="kpi-card cinematic-glow">
          <div className="kpi-label">{t('team.objectiveFulfillment')}</div>
          <div className="kpi-value">92%</div>
          <div className="kpi-badge blue">STABLE</div>
        </div>
        <div className="kpi-card cinematic-glow">
          <div className="kpi-label">{t('team.avgPayout')}</div>
          <div className="kpi-value gold">EGP 124K</div>
          <div className="kpi-badge warn">NET</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {partners.map((agent, index) => (
          <div className={`card glass-panel hover:border-gold/30 transition-all duration-500 animate-fade-in-up stagger-${(index % 4) + 1}`} key={agent.id} style={{ padding: '24px', position: 'relative' }}>
            <button 
              onClick={() => terminatePartner(agent.id)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', opacity: 0.15, cursor: 'pointer', fontSize: '12px' }}
              className="hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="user-avatar" style={{ margin: 0, width: '56px', height: '56px', fontSize: '20px', background: agent.color, boxShadow: `0 0 15px ${agent.color}33` }}>
                {agent.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)' }}>{agent.name}</div>
                <div style={{ fontSize: '11px', opacity: 0.5, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>{agent.role}</div>
              </div>
              {agent.deals > 10 && (
                <div style={{ textAlign: 'right' }}>
                  <div className="badge badge-gold" style={{ fontSize: '9px', padding: '2px 8px' }}>Elite</div>
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontSize: '10px', opacity: 0.4, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Liquidation</div>
                <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '15px' }}>{agent.revenue} EGP</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', opacity: 0.4, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Volume</div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>{agent.deals} Assets</div>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => setSelectedAdvisor(agent)}>Profile</button>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Message</button>
            </div>
          </div>
        ))}

        <div className="card hover:border-gold/50 hover:bg-gold/5 transition-all duration-300" onClick={() => setShowModal(true)} style={{ 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          border: '2px dashed rgba(200,169,110,0.2)', 
          background: 'rgba(200,169,110,0.02)', 
          cursor: 'pointer',
          minHeight: '234px',
          borderRadius: '20px'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.4 }}>👤</div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px' }}>+ {t('team.enlistExecutive')}</span>
          <p style={{ fontSize: '11px', opacity: 0.5, marginTop: '8px' }}>{t('team.authorizeCredentials')}</p>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay reveal" onClick={() => setShowModal(false)}>
          <div className="modal-content-luxury glass-effect" onClick={e => e.stopPropagation()} style={{ border: '1px solid rgba(200,169,110,0.2)' }}>
            <div className="modal-header-luxury">
              <h2 className="serif text-2xl text-gold">{t('team.enlistmentModalTitle')}</h2>
              <p className="text-secondary text-sm">{t('team.enlistmentModalSub')}</p>
            </div>
            
            <div className="specification-grid">
              <div className="spec-group full">
                <label>Legal Name</label>
                <input 
                  autoFocus
                  placeholder="Full Name"
                  value={partnerDraft.name} 
                  onChange={e => setPartnerDraft(p => ({ ...p, name: e.target.value }))} 
                  className="form-input"
                />
              </div>
              
              <div className="spec-group">
                <label>Strategic Role</label>
                <input 
                  placeholder="Senior Portfolio Consultant"
                  value={partnerDraft.role} 
                  onChange={e => setPartnerDraft(p => ({ ...p, role: e.target.value }))} 
                  className="form-input"
                />
              </div>
              
              <div className="spec-group">
                <label>Color Theme</label>
                <select value={partnerDraft.color} onChange={e => setPartnerDraft(p => ({ ...p, color: e.target.value }))} className="form-select">
                  <option value="var(--blue)">Sierra Blue</option>
                  <option value="var(--gold)">Sierra Gold</option>
                  <option value="var(--navy)">Sierra Navy</option>
                  <option value="#7c3aed">Royal Violet</option>
                  <option value="#059669">Emerald Growth</option>
                </select>
              </div>
              
              <div className="spec-group">
                <label>Baseline Deals</label>
                <input 
                  type="number"
                  placeholder="0"
                  value={partnerDraft.deals} 
                  onChange={e => setPartnerDraft(p => ({ ...p, deals: parseInt(e.target.value) || 0 }))} 
                  className="form-input"
                />
              </div>

              <div className="spec-group">
                <label>Aggregate GCI (EGP)</label>
                <input 
                  placeholder="e.g. 5.2M"
                  value={partnerDraft.revenue} 
                  onChange={e => setPartnerDraft(p => ({ ...p, revenue: e.target.value }))} 
                  className="form-input"
                />
              </div>
            </div>

            <div className="modal-actions-luxury mt-8 flex justify-end gap-4 border-t border-white/5 pt-6">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>{t('team.terminateEntry')}</button>
              <button className="btn btn-gold shadow-gold" onClick={enlistPartner}>{t('team.authorizePartnership')}</button>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden mt-12" style={{ background: 'linear-gradient(135deg, var(--navy-dark), #1e3a5f)', border: '1px solid rgba(200,169,110,0.3)' }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '48px' }}>
          <div style={{ color: '#fff' }}>
            <h3 className="serif text-3xl mb-3 text-gold">{t('team.ledgerTitle')}</h3>
            <p className="text-white/70 text-sm max-w-md leading-relaxed">
              {t('team.ledgerSub')}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right', color: '#fff', opacity: 0.4, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              {t('team.adminOnly')}
            </div>
            <button 
              className="btn btn-gold py-4 px-8 shadow-gold font-bold" 
              onClick={() => onNavigate && onNavigate('ledger')}
            >
              <span className="me-2 text-lg">📊</span> {t('team.accessLedger')}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .specification-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 30px;
        }
        .spec-group.full { grid-column: span 2; }
        .spec-group label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--gold);
          opacity: 0.7;
          margin-bottom: 8px;
        }
        .modal-content-luxury {
          width: 100%;
          max-width: 600px;
          background: var(--surface);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
        }
        .glass-effect {
          backdrop-filter: blur(24px);
          background: rgba(10, 15, 28, 0.95);
        }
      `}</style>
    </div>
  );
}


