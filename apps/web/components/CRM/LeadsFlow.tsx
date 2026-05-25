"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  updateDoc, 
  addDoc, 
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';
import { useI18n } from '@/lib/I18nContext';
import { 
  Zap, 
  ClipboardCheck, 
  Eye, 
  CheckCircle, 
  MessageSquare, 
  Phone,
  Plus,
  RefreshCw,
  ListTodo,
  X,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import KPIProgressBar from '../UI/KPIProgressBar';

export default function LeadsFlow() {
  const { user } = useAuth();
  const { t, locale, dir } = useI18n();
  const [leads, setLeads] = useState<any[]>([]);
  const [activeLead, setActiveLead] = useState<any>(null);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(true);

  const workflowSteps = useMemo(() => [
    { id: 'intake', label: t('flow.stages.intake'), icon: <MessageSquare size={16}/> },
    { id: 'ai-discovery', label: t('flow.stages.ai-discovery'), icon: <Zap size={16}/> },
    { id: 'advisory', label: t('flow.stages.advisory'), icon: <ClipboardCheck size={16}/> },
    { id: 'presentation', label: t('flow.stages.presentation'), icon: <Eye size={16}/> },
    { id: 'closed', label: t('flow.stages.closed'), icon: <CheckCircle size={16}/> },
  ], [t]);

  // --- DATA SYNC ---
  useEffect(() => {
    if (!user) return;
    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, orderBy('updatedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      console.error("Leads sync error:", error);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user]);

  // --- ACTIONS ---
  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    if (!user) return;
    const leadDoc = doc(db, 'leads', leadId);
    try {
      await updateDoc(leadDoc, { 
        status: newStatus, 
        updatedAt: serverTimestamp() 
      });
      if (activeLead && activeLead.id === leadId) {
        setActiveLead({ ...activeLead, status: newStatus });
      }
    } catch (err) { console.error(err); }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newLead.name || !newLead.phone) return;
    try {
      const leadsRef = collection(db, 'leads');
      await addDoc(leadsRef, {
        name: newLead.name,
        phone: newLead.phone,
        status: 'intake',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
        assignedTo: user.uid,
        phase: 'acquisition' // Compatible with ClientsScreen
      });
      setNewLead({ name: '', phone: '' });
      setIsAddingLead(false);
    } catch (err) { console.error(err); }
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      'intake': 'badge-blue',
      'ai-discovery': 'badge-navy',
      'advisory': 'badge-gold',
      'presentation': 'badge-warning',
      'closed': 'badge-success'
    };
    return styles[status] || 'badge-navy';
  };

  if (loading) return (
    <div className="section-loader">
      <RefreshCw className="w-10 h-10 text-gold animate-spin mb-4" />
      <div className="loader-text">{t('common.loading')}</div>
    </div>
  );

  return (
    <div className="leads-flow-container animate-fade-in-up" dir={dir}>
      {/* Header Area */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="serif gold-underline" style={{ fontSize: '32px' }}>{t('flow.title')}</h1>
          <div className="page-sub" style={{ opacity: 0.7 }}>{t('flow.subtitle')}</div>
        </div>
        <button className="btn btn-gold shadow-gold" onClick={() => setIsAddingLead(true)}>
          <Plus size={18} className="me-2"/> {t('flow.addLead')}
        </button>
      </div>

      <div className="flow-layout">
        {/* Pipeline Column */}
        <div className="pipeline-sidebar">
          <div className="kpi-section" style={{ marginBottom: '24px' }}>
            <KPIProgressBar 
              label={t('flow.callsTarget') || 'Strategic Calls'} 
              current={8} 
              target={25} 
              color="var(--gold)"
              icon={<Phone size={12} />}
            />
            <KPIProgressBar 
              label={t('flow.messagesTarget') || 'Nexus Messages'} 
              current={34} 
              target={50} 
              color="var(--blue-light)"
              icon={<MessageSquare size={12} />}
            />
          </div>

          <h2 className="sidebar-section-title">{t('flow.listTitle')}</h2>
          <div className="leads-list">
            {leads.length === 0 ? (
              <div className="p-8 text-center opacity-30 italic text-sm">{t('flow.noProspects')}</div>
            ) : (
              leads.map(lead => (
                <motion.div 
                  layoutId={lead.id}
                  key={lead.id} 
                  onClick={() => setActiveLead(lead)}
                  className={`lead-card-luxury glass-panel ${activeLead?.id === lead.id ? 'active' : ''}`}
                >
                  <div className="lead-card-header">
                    <div className="lead-avatar">
                      {lead.name?.[0] || 'U'}
                    </div>
                    <div className="lead-info">
                      <div className="lead-name">{lead.name || 'Unknown'}</div>
                      <div className="lead-phone"><Phone size={12}/> {lead.phone}</div>
                    </div>
                    <div className={`badge ${getStatusStyle(lead.status)}`} style={{ fontSize: '9px', marginLeft: 'auto' }}>
                      {t(`flow.stages.${lead.status}`)}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Engine Column */}
        <div className="engine-content">
          <AnimatePresence mode="wait">
            {activeLead ? (
              <motion.div 
                key={activeLead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="engine-card glass-panel"
              >
                <div className="engine-card-header">
                  <div className="flex items-center gap-4">
                    <div className="engine-icon-wrap">
                      <RefreshCw size={20} className="text-gold" />
                    </div>
                    <div>
                      <h2 className="serif text-2xl text-gold">{t('flow.engine')}</h2>
                      <p className="text-secondary text-sm uppercase tracking-widest">{activeLead.name}</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveLead(null)} className="btn-ghost p-2 rounded-full"><X size={20}/></button>
                </div>

                {/* Stepper */}
                <div className="stepper-horizontal">
                  {workflowSteps.map((step, idx) => {
                    const isActive = step.id === activeLead.status;
                    const isPast = workflowSteps.findIndex(s => s.id === activeLead.status) > idx;
                    return (
                      <div key={step.id} className="step-item">
                        <button 
                          onClick={() => updateLeadStatus(activeLead.id, step.id)}
                          className={`step-bubble ${isActive ? 'active' : isPast ? 'completed' : ''}`}
                        >
                          {isPast ? <CheckCircle size={18}/> : step.icon}
                        </button>
                        <span className={`step-label ${isActive ? 'active' : ''}`}>{step.label}</span>
                        {idx < workflowSteps.length - 1 && <div className="step-line" />}
                      </div>
                    );
                  })}
                </div>

                {/* Script Section */}
                <div className="script-container">
                  <div className="script-box cinematic-glow">
                    <div className="script-header">
                      <MessageSquare size={14} className="text-gold"/>
                      <span>{t(`flow.scripts.${activeLead.status}.title`)}</span>
                    </div>
                    <div className="script-text">
                      {t(`flow.scripts.${activeLead.status}.text`).replace('{name}', activeLead.name)}
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="tasks-box">
                    <div className="tasks-header">
                      <ListTodo size={14} className="text-blue-light"/>
                      <span>{t('flow.engine')} Tasks</span>
                    </div>
                    <div className="tasks-grid">
                      {(t(`flow.scripts.${activeLead.status}.tasks`) as unknown as string[]).map((task, i) => (
                        <div key={i} className="task-item">
                          <div className="task-number">{i+1}</div>
                          <div className="task-label">{task}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a href={`tel:${activeLead.phone}`} className="btn btn-primary w-full py-4 justify-center text-lg mt-4" style={{ borderRadius: '16px' }}>
                    <Phone size={20} className="me-3"/> {t('flow.callProspect')}
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="engine-empty glass-panel">
                <div className="empty-icon">
                  <User size={48} className="text-gold opacity-10" />
                </div>
                <h3 className="serif text-xl opacity-40">{t('flow.stats')}</h3>
                <p className="opacity-20 text-sm max-w-xs">{t('flow.noProspects')}</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add Lead Modal */}
      {isAddingLead && (
        <div className="modal-overlay reveal">
          <div className="modal-content glass-panel" style={{ maxWidth: '480px', padding: '40px' }}>
            <h2 className="serif text-3xl text-gold mb-8">{t('flow.newProspect')}</h2>
            <form onSubmit={handleAddLead} className="space-y-6">
              <div className="form-group">
                <label className="form-label">{t('crm.leadName')}</label>
                <input 
                  autoFocus required type="text" 
                  value={newLead.name} 
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})} 
                  className="form-input" 
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="form-group">
                <label className="form-label">{t('crm.phone')}</label>
                <input 
                  required type="tel" 
                  value={newLead.phone} 
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})} 
                  className="form-input" 
                  dir="ltr"
                  placeholder="01xxxxxxxxx"
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="submit" className="btn btn-gold flex-1 justify-center py-4">{t('flow.saveProspect')}</button>
                <button type="button" onClick={() => setIsAddingLead(false)} className="btn btn-ghost px-6">{t('common.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .flow-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 32px;
          height: calc(100vh - 240px);
        }

        .pipeline-sidebar {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .sidebar-section-title {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--text-secondary);
          margin-bottom: 16px;
          opacity: 0.6;
        }

        .leads-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-right: 4px;
        }

        .lead-card-luxury {
          padding: 16px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .lead-card-luxury:hover {
          background: rgba(255,255,255,0.03);
          transform: translateX(4px);
          border-color: rgba(200,169,110,0.2);
        }

        .lead-card-luxury.active {
          background: rgba(200,169,110,0.1);
          border-color: var(--gold);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }

        .lead-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .lead-avatar {
          width: 36px;
          height: 36px;
          background: var(--navy-dark);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--gold);
        }

        .lead-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .lead-phone {
          font-size: 11px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 2px;
        }

        .engine-content {
          height: 100%;
        }

        .engine-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 40px;
          background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%);
        }

        .engine-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }

        .engine-icon-wrap {
          width: 48px;
          height: 48px;
          background: rgba(200,169,110,0.1);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stepper-horizontal {
          display: flex;
          justify-content: space-between;
          margin-bottom: 48px;
          position: relative;
          padding: 0 20px;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .step-bubble {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }

        .step-bubble.active {
          background: var(--gold);
          color: var(--navy-dark);
          transform: scale(1.2);
          box-shadow: 0 0 30px rgba(200,169,110,0.4);
          border-color: var(--gold-light);
        }

        .step-bubble.completed {
          background: var(--blue);
          color: white;
          border-color: var(--blue-light);
        }

        .step-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-secondary);
          opacity: 0.5;
        }

        .step-label.active {
          color: var(--gold);
          opacity: 1;
        }

        .step-line {
          position: absolute;
          top: 22px;
          left: 50%;
          width: 200%;
          height: 1px;
          background: var(--border);
          z-index: -1;
        }

        .script-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .script-box {
          background: rgba(0,0,0,0.2);
          border-radius: 24px;
          padding: 32px;
          border: 1px solid rgba(255,255,255,0.05);
          position: relative;
        }

        .script-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--gold);
          margin-bottom: 20px;
          opacity: 0.8;
        }

        .script-text {
          font-size: 18px;
          font-style: italic;
          line-height: 1.6;
          color: var(--white);
          opacity: 0.9;
        }

        .tasks-box {
          background: rgba(255,255,255,0.02);
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.03);
        }

        .tasks-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--blue-light);
          margin-bottom: 16px;
        }

        .tasks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .task-item {
          background: rgba(0,0,0,0.1);
          padding: 12px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(255,255,255,0.02);
        }

        .task-number {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid rgba(74,144,217,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: var(--blue-light);
        }

        .task-label {
          font-size: 12px;
          font-weight: 500;
          opacity: 0.7;
        }

        .engine-empty {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px;
        }

        .empty-icon {
          width: 100px;
          height: 100px;
          background: rgba(200,169,110,0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        [dir='rtl'] .lead-card-luxury:hover {
          transform: translateX(-4px);
        }
      `}</style>
    </div>
  );
}
