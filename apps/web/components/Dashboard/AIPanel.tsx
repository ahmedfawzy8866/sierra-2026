"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Zap, AlertCircle, TrendingUp, RefreshCw, ChevronRight, Activity } from 'lucide-react';

interface Insight {
  type: 'opportunity' | 'warning' | 'tip';
  text: string;
  priority?: 'low' | 'high';
  action?: string;
}

interface InsightStats {
  listings: number;
  stakeholders: number;
  sales: string;
  priorityFocus: number;
}

interface InsightResponse {
  insights?: Insight[] | null;
  error?: string;
}

const FALLBACK_INSIGHTS: Insight[] = [
  { 
    type: 'opportunity', 
    text: 'Structural demand for premium littoral assets in the North Coast corridor continues to accelerate.',
    priority: 'high',
    action: 'Analyze Portfolio'
  },
  { 
    type: 'warning', 
    text: 'High-intensity stakeholders require immediate executive consultation to maintain lifecycle velocity.',
    priority: 'high',
    action: 'Command Pipeline'
  },
];

export default function AIPanel() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const isMountedRef = useRef(true);
  const latestRequestRef = useRef(0);

  const fetchAndAnalyze = useCallback(async () => {
    const requestId = ++latestRequestRef.current;
    setLoading(true);

    try {
      const [listingsSnap, stakeholdersSnap, hotStakeholdersSnap, salesSnap, activitiesSnap] = await Promise.all([
        getDocs(collection(db, 'listings')),
        getDocs(collection(db, 'leads')),
        getDocs(query(collection(db, 'leads'), where('strategicIntensity', '==', 'hot'))),
        getDocs(collection(db, 'sales')),
        getDocs(query(collection(db, 'activities'), orderBy('createdAt', 'desc'), limit(5))),
      ]);

      let totalSales = 0;
      salesSnap.docs.forEach((salesDoc) => {
        totalSales += Number(salesDoc.data().amount ?? 0);
      });

      const activitiesList = activitiesSnap.docs
        .map((activityDoc) => {
          const text = activityDoc.data().text;
          return typeof text === 'string' && text.trim() ? text.trim() : 'Unknown activity';
        })
        .slice(0, 5);

      const stats: InsightStats = {
        listings: listingsSnap.size,
        stakeholders: stakeholdersSnap.size,
        sales: `EGP ${(totalSales / 1000000).toFixed(1)}M`,
        priorityFocus: hotStakeholdersSnap.size,
      };

      const response = await fetch('/api/openclaw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats, activities: activitiesList }),
      });

      const data = await response.json() as InsightResponse;
      if (!isMountedRef.current || requestId !== latestRequestRef.current) {
        return;
      }

      if (Array.isArray(data.insights) && data.insights.length > 0) {
        setInsights(data.insights);
      } else {
        setInsights(FALLBACK_INSIGHTS);
      }
    } catch (error) {
      console.warn("Analysis data fetch failed:", error);
      setInsights(FALLBACK_INSIGHTS);
    }

    if (!isMountedRef.current || requestId !== latestRequestRef.current) {
      return;
    }

    setLoading(false);
    setLastRefreshed(new Date());
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    void fetchAndAnalyze();
  }, [fetchAndAnalyze]);

  return (
    <div className="cinematic-surface" style={{ 
      borderRadius: '24px', 
      padding: '32px', 
      position: 'relative', 
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)'
    }}>
      {/* Decorative Neural Net Pattern */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        width: '400px', 
        height: '400px', 
        background: 'radial-gradient(circle at center, var(--gold)05 0%, transparent 70%)',
        opacity: 0.5,
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '32px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '14px', 
            background: 'var(--luxury-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)', color: 'var(--navy)'
          }}>
            <Brain size={24} />
          </div>
          <div>
            <span className="serif" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
              Strategic Intelligence Portal
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--gold)', fontWeight: 500, letterSpacing: '0.5px' }}>
              <Activity size={12} className={loading ? 'pulse' : ''} />
              <span>{loading ? 'ANALYZING MARKET SIGNALS...' : 'NEURAL CORE ACTIVE'}</span>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {lastRefreshed && !loading && (
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500, opacity: 0.7 }}>
              SYNC {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => void fetchAndAnalyze()}
            disabled={loading}
            style={{ 
              width: '36px', height: '36px', borderRadius: '50%', 
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
              cursor: 'pointer', transition: 'background 0.2s'
            }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </motion.button>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ 
                height: '160px', borderRadius: '16px', 
                background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px'
              }}
            >
              <div className="neural-ping-animation"></div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', letterSpacing: '1px' }}>RECONSTRUCTING PARADIGMS</span>
            </motion.div>
          ) : (
            <>
              <motion.div 
                key="insights"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}
              >
                {insights.map((insight, i) => (
                  <InsightCard key={i} insight={insight} />
                ))}
              </motion.div>

              {/* Neural Orchestration Pipeline (V4.0) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '20px', 
                  border: '1px solid rgba(255,255,255,0.03)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                      Operational Orchestration Ledger (V4.0)
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: 600 }}>10 STAGES SYNCHRONIZED</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px' }}>
                  {[
                    { label: 'Ingest', color: 'var(--gold)' },
                    { label: 'Parse', color: 'var(--gold)' },
                    { label: 'Brand', color: 'var(--gold)' },
                    { label: 'Sync', color: 'var(--gold)' },
                    { label: 'Lead', color: 'var(--blue-light)' },
                    { label: 'Match', color: 'var(--success)', pulse: true },
                    { label: 'Sales', color: 'rgba(255,255,255,0.1)' },
                    { label: 'Visit', color: 'rgba(255,255,255,0.1)' },
                    { label: 'Close', color: 'rgba(255,255,255,0.1)' },
                    { label: 'Loop', color: 'rgba(255,255,255,0.1)' },
                  ].map((stage, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ 
                        height: '4px', background: stage.color, borderRadius: '4px', marginBottom: '8px',
                        boxShadow: stage.color !== 'rgba(255,255,255,0.1)' ? `0 0 8px ${stage.color}` : 'none',
                        position: 'relative'
                      }}>
                        {stage.pulse && (
                          <div style={{ 
                            position: 'absolute', top: '-4px', left: '50%', transform: 'translateX(-50%)', 
                            width: '12px', height: '12px', borderRadius: '50%', background: stage.color,
                            animation: 'node-pulse 2s infinite ease-out'
                          }} />
                        )}
                      </div>
                      <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{stage.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .neural-ping-animation {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--gold);
          position: relative;
        }
        .neural-ping-animation::before, .neural-ping-animation::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 50%;
          border: 1px solid var(--gold);
          animation: ping 2s infinite cubic-bezier(0, 0, 0.2, 1);
        }
        .neural-ping-animation::after { animation-delay: 1s; }
        @keyframes ping {
          75%, 100% { transform: scale(3); opacity: 0; }
        }
        @keyframes node-pulse {
          0% { transform: translateX(-50%) scale(1); opacity: 0.8; }
          100% { transform: translateX(-50%) scale(3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const isHigh = insight.priority === 'high';
  
  return (
    <motion.div 
      whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.04)' }}
      style={{ 
        padding: '24px', 
        borderRadius: '16px', 
        background: 'rgba(255,255,255,0.02)', 
        border: `1px solid ${isHigh ? 'rgba(200, 169, 110, 0.2)' : 'rgba(255,255,255,0.05)'}`,
        position: 'relative',
        display: 'flex',
        gap: '20px',
        transition: 'all 0.3s'
      }}
    >
      <div style={{ 
        width: '40px', height: '40px', borderRadius: '10px', 
        background: insight.type === 'opportunity' ? 'var(--success)10' : insight.type === 'warning' ? 'var(--error)10' : 'var(--gold)10',
        color: insight.type === 'opportunity' ? 'var(--success)' : insight.type === 'warning' ? 'var(--error)' : 'var(--gold)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        {insight.type === 'opportunity' ? <TrendingUp size={20} /> : insight.type === 'warning' ? <AlertCircle size={20} /> : <Zap size={20} />}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '1px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            {insight.type} SIGNAL
          </span>
          {isHigh && (
            <span style={{ 
              fontSize: '8px', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', 
              background: 'var(--luxury-gradient)', color: 'var(--navy)', textTransform: 'uppercase' 
            }}>
              Critical Protocol
            </span>
          )}
        </div>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)', marginBottom: '16px', opacity: 0.9 }}>
          {insight.text}
        </p>
        
        {insight.action && (
          <motion.button 
            whileHover={{ x: 4 }}
            style={{ 
              background: 'none', border: 'none', padding: 0, color: 'var(--gold)', 
              fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' 
            }}
          >
            {insight.action}
            <ChevronRight size={14} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
