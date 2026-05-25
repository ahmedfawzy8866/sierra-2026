"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Database, 
  RefreshCcw, 
  Trash2, 
  Clock, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  Shield,
  Cpu,
  Activity
} from 'lucide-react';

interface MaintenanceTask {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  lastRun: string;
  description: string;
}

export default function MaintenanceMonitor() {
  const [tasks, setTasks] = useState<MaintenanceTask[]>([
    { id: '1', name: 'Media Cache Flush', status: 'idle', lastRun: '2 hours ago', description: 'Clears optimized image fragments from the CDN edge.' },
    { id: '2', name: 'Database Re-indexing', status: 'idle', lastRun: '12 hours ago', description: 'Optimizes query paths for the 1,000+ unit inventory.' },
    { id: '3', name: 'Neural Sync Audit', status: 'idle', lastRun: '4 hours ago', description: 'Verifies stakeholder match fidelity across the pipeline.' },
    { id: '4', name: 'Legacy Log Rotation', status: 'idle', lastRun: '1 day ago', description: 'Archives S1-S2 raw logs into cold storage.' },
  ]);

  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Initializing Maintenance Monitor v12.0...',
    '[AUTH] Secure handshake established with Firestore.',
    '[MONITOR] Core metrics stabilized at 98.4% uptime.',
    '[SCRIBE] Stage 1 ingestion running at peak efficiency.'
  ]);

  const [activeTask, setActiveTask] = useState<string | null>(null);

  const runTask = (id: string) => {
    setActiveTask(id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'running' } : t));
    
    const taskName = tasks.find(t => t.id === id)?.name;
    setLogs(prev => [`[EXEC] Running ${taskName}...`, ...prev.slice(0, 9)]);

    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed', lastRun: 'Just now' } : t));
      setLogs(prev => [`[SUCCESS] ${taskName} completed successfully.`, ...prev.slice(0, 9)]);
      setActiveTask(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <HealthMetric label="CPU LOAD" value="12%" color="text-green-400" icon={<Cpu size={16} />} />
        <HealthMetric label="RAM USAGE" value="4.2 GB" color="text-blue-400" icon={<Zap size={16} />} />
        <HealthMetric label="DB LATENCY" value="24ms" color="text-[var(--burnished-gold, #C9A96E)]" icon={<Database size={16} />} />
        <HealthMetric label="UPTIME" value="99.98%" color="text-green-400" icon={<Activity size={16} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Maintenance Controls */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
          <h3 className="text-lg font-light mb-6 text-[var(--burnished-gold, #C9A96E)] flex items-center gap-2">
            <Shield size={20} /> Maintenance Procedures
          </h3>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="group flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${task.status === 'running' ? 'bg-[var(--burnished-gold, #C9A96E)]/20 animate-pulse' : 'bg-white/5'}`}>
                    {task.status === 'completed' ? <CheckCircle2 size={18} className="text-green-400" /> : 
                     task.status === 'running' ? <RefreshCcw size={18} className="text-[var(--burnished-gold, #C9A96E)] animate-spin" /> : 
                     <Clock size={18} className="text-white/40" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90">{task.name}</h4>
                    <p className="text-xs text-white/50">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono">Last: {task.lastRun}</span>
                  <button 
                    onClick={() => runTask(task.id)}
                    disabled={activeTask !== null}
                    className={`text-xs px-4 py-2 rounded border border-[var(--burnished-gold, #C9A96E)]/30 text-[var(--burnished-gold, #C9A96E)] hover:bg-[var(--burnished-gold, #C9A96E)] hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    {task.status === 'running' ? 'EXECUTING...' : 'INITIALIZE'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Terminal */}
        <div className="p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md font-mono overflow-hidden flex flex-col h-full">
          <h3 className="text-sm uppercase tracking-widest mb-4 text-white/40 flex items-center gap-2">
            <Terminal size={14} /> System Registry
          </h3>
          <div className="space-y-2 flex-grow">
            <AnimatePresence mode="popLayout">
              {logs.map((log, i) => (
                <motion.div
                  key={`${log}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-[10px] leading-relaxed"
                >
                  <span className={log.includes('SUCCESS') ? 'text-green-400' : log.includes('EXEC') ? 'text-[var(--burnished-gold, #C9A96E)]' : 'text-white/60'}>
                    {log}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] text-white/30 uppercase tracking-tighter">Connection Stable: Sierra Blu Core</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthMetric({ label, value, color, icon }: { label: string, value: string, color: string, icon: React.ReactNode }) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-1">
      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-white/40">
        <span>{label}</span>
        {icon}
      </div>
      <div className={`text-xl font-light tracking-tight ${color}`}>{value}</div>
    </div>
  );
}
