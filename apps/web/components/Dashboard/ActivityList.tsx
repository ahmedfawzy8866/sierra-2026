"use client";
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Bell, Clock, ArrowUpRight, CheckCircle2, Info, Activity } from 'lucide-react';

interface ActivityItem {
  id: string;
  text: string;
  createdAt?: Timestamp;
  color?: string;
  type?: 'sale' | 'listing' | 'lead' | 'system';
}

const getActivityIcon = (text: string, color: string) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('sale') || lowerText.includes('transaction')) return <ArrowUpRight size={14} />;
  if (lowerText.includes('listing') || lowerText.includes('unit')) return <CheckCircle2 size={14} />;
  if (lowerText.includes('lead') || lowerText.includes('client')) return <Bell size={14} />;
  return <Info size={14} />;
};

const renderActivityText = (text: string) => {
  const segments = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);

  return segments.map((segment, index) => {
    if (segment.startsWith('**') && segment.endsWith('**')) {
      return <strong key={index} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{segment.slice(2, -2)}</strong>;
    }
    return <span key={index} style={{ color: 'var(--text-secondary)', opacity: 0.8 }}>{segment}</span>;
  });
};

export default function ActivityList() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const q = query(collection(db, 'activities'), orderBy('createdAt', 'desc'), limit(12));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((activityDoc) => ({
        id: activityDoc.id,
        ...activityDoc.data()
      } as ActivityItem));
      setActivities(list);
      setLoading(false);
    }, (error) => {
      console.error('Failed to load activity feed:', error);
      setActivities([]);
      setLoading(false);
    });

    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => {
      unsubscribe();
      window.clearInterval(timer);
    };
  }, []);

  const formatTime = (ts: Timestamp | undefined) => {
    if (!ts) return 'Just now';
    const date = ts.toDate();
    const diff = now - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="cinematic-surface" style={{ 
      borderRadius: '20px', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '400px'
    }}>
      <div style={{ 
        padding: '24px 32px', 
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.01)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', height: '32px', borderRadius: '8px', 
            background: 'var(--gold)10', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' 
          }}>
            <Activity size={18} />
          </div>
          <span className="serif" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Operational Velocity
          </span>
        </div>
        {loading ? (
          <RefreshCcw size={14} className="pulse" style={{ color: 'var(--gold)', opacity: 0.5 }} />
        ) : (
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gold)', background: 'var(--gold)15', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Live Feed
          </div>
        )}
      </div>

      <div style={{ padding: '24px 32px', overflowY: 'auto', flex: 1 }}>
        <div style={{ position: 'relative' }}>
          {/* Vertical timeline line */}
          <div style={{ 
            position: 'absolute', 
            left: '11px', 
            top: '8px', 
            bottom: '8px', 
            width: '1px', 
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.1) 90%, transparent)',
            zIndex: 0
          }}></div>

          <AnimatePresence mode="popLayout">
            {!loading && activities.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', opacity: 0.5 }}
              >
                Zero operational signals detected in the current window.
              </motion.div>
            )}
            
            {activities.map((act, i) => (
              <motion.div 
                key={act.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  marginBottom: '24px', 
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: 'var(--navy-light)',
                  border: `2px solid ${act.color || 'var(--gold)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: act.color || 'var(--gold)',
                  boxShadow: `0 0 10px ${act.color || 'var(--gold)'}20`,
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  {getActivityIcon(act.text, act.color || 'var(--gold)')}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14.5px', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                    {renderActivityText(act.text)}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    marginTop: '6px', 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)',
                    opacity: 0.6 
                  }}>
                    <Clock size={12} />
                    {formatTime(act.createdAt)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
