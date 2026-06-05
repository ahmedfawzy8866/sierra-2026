"use client";

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function ConnectionSentinel() {
  const [nodeStatus, setNodeStatus] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'system_status', 'whatsapp_node'), (doc) => {
      setNodeStatus(doc.data());
    });
    return () => unsub();
  }, []);

  const getStatusColor = () => {
    if (!nodeStatus) return 'bg-gray-500';
    const lastPulse = nodeStatus.lastPulse?.toDate();
    const diff = Date.now() - (lastPulse?.getTime() || 0);
    
    if (diff > 120000) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'; // 2 mins silence
    if (nodeStatus.status === 'syncing') return 'bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.5)]';
    return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
  };

  return (
    <div className="glass-panel-luxury p-4 flex items-center justify-between border-l-4 border-amber-500/50">
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-amber-500/80">Neural Node: WhatsApp</h4>
          <p className="text-sm font-medium text-white/90">
            {nodeStatus?.status === 'syncing' ? 'Ingesting Property Streams...' : 
             nodeStatus?.status === 'active' ? 'Operational & Ready' : 
             'Node Offline'}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-tighter text-white/40">Last Pulse</p>
        <p className="text-xs font-mono text-white/60">
          {nodeStatus?.lastPulse ? nodeStatus.lastPulse.toDate().toLocaleTimeString() : '--:--'}
        </p>
      </div>
    </div>
  );
}
