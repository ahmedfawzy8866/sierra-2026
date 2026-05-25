import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  Users, 
  Building2, 
  Cpu, 
  TrendingUp, 
  Activity as ActivityIcon, 
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Clock,
  Wifi,
  Database,
  Terminal
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { useI18n } from '../../lib/I18nContext';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { COLLECTIONS, Activity as ActivityType } from '../../lib/models/schema';

interface AdminDashboardProps {
  greeting: string;
  firstName: string;
  dateString: string;
}

export default function AdminDashboard({ greeting, firstName, dateString }: AdminDashboardProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isDeploying, setIsDeploying] = React.useState(false);
  const [deployProgress, setDeployProgress] = React.useState(0);
  const [deployError, setDeployError] = React.useState<string | null>(null);
  const [showLogs, setShowLogs] = React.useState(false);
  const [logs, setLogs] = React.useState<ActivityType[]>([]);
  const [counts, setCounts] = React.useState({
    team: 0,
    inventory: 0,
    health: '99.8%',
    growth: '8.4%'
  });
  const [syncState, setSyncState] = React.useState<{
    [key: string]: { loading: boolean; success?: string; error?: string }
  }>({});

  const handleSync = async (action: string) => {
    setSyncState(prev => ({ ...prev, [action]: { loading: true } }));
    try {
      const response = await fetch(`/api/property-finder?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Sync failed');
      setSyncState(prev => ({ ...prev, [action]: { loading: false, success: data.message } }));
      setTimeout(() => setSyncState(prev => ({ ...prev, [action]: { loading: false } })), 5000);
    } catch (err: any) {
      setSyncState(prev => ({ ...prev, [action]: { loading: false, error: err.message } }));
      setTimeout(() => setSyncState(prev => ({ ...prev, [action]: { loading: false } })), 5000);
    }
  };

  React.useEffect(() => {
    // Team Count
    const teamUnsub = onSnapshot(collection(db, COLLECTIONS.users), (snap) => {
      setCounts(prev => ({ ...prev, team: snap.size }));
    });

    // Inventory Count
    const invUnsub = onSnapshot(collection(db, COLLECTIONS.units), (snap) => {
      setCounts(prev => ({ ...prev, inventory: snap.size }));
    });

    // Recent Activities
    const q = query(collection(db, COLLECTIONS.activities), orderBy('createdAt', 'desc'), limit(10));
    const logsUnsub = onSnapshot(q, (snap) => {
      const logsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityType));
      setLogs(logsData);
    });

    // Simulated Latency Monitor
    const latencyInterval = setInterval(() => {
      setCounts(prev => ({
        ...prev,
        health: (99 + Math.random() * 0.9).toFixed(1) + '%'
      }));
    }, 5000);

    return () => {
      teamUnsub();
      invUnsub();
      logsUnsub();
      clearInterval(latencyInterval);
    };
  }, []);

  const stats = [
    { label: t('admin.humanCapital'), value: counts.team.toLocaleString(), icon: <Users size={20} />, change: '+2 this month', color: 'blue' },
    { label: t('admin.listings'), value: counts.inventory.toLocaleString(), icon: <Building2 size={20} />, change: '+56 this week', color: 'gold' },
    { label: t('admin.backendOrchestration'), value: counts.health, icon: <Cpu size={20} />, change: 'Stable', color: 'emerald' },
    { label: t('admin.intelligence'), value: 'High', icon: <TrendingUp size={20} />, change: counts.growth + ' growth', color: 'purple' },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 space-y-12 max-w-[1600px] mx-auto"
    >
      {/* ── Header ── */}
      <header 
        className="flex justify-between items-end"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMousePos({
            x: (e.clientX - rect.left) / rect.width - 0.5,
            y: (e.clientY - rect.top) / rect.height - 0.5
          });
        }}
      >
        <motion.div 
          variants={itemVariants}
          style={{
            x: mousePos.x * 20,
            y: mousePos.y * 10,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[1px] w-8 bg-gold/50" />
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">{dateString}</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
            {greeting}, <span className="luxury-gradient-text">{firstName}</span>
          </h1>
          <p className="text-white/40 mt-4 max-w-lg text-lg font-medium leading-relaxed">
            {t('admin.greeting')}
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-6 backdrop-blur-xl flex items-center gap-6"
        >
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{t('admin.systemStatus')}</span>
            <span className="text-emerald-500 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t('admin.operational')}
            </span>
          </div>
          <button 
            onClick={async () => {
              if (isDeploying) return;
              setIsDeploying(true);
              setDeployProgress(0);
              setDeployError(null);
              
              // ── Step 1: Initialize ──
              setDeployProgress(10);
              
              try {
                // ── Step 2: Trigger Backend API ──
                const response = await fetch('/api/admin/deploy', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.uid}` // Basic UID for identity trace in API
                  },
                  body: JSON.stringify({ type: 'patch' })
                });

                if (!response.ok) throw new Error('Deployment pipeline failed to initialize');
                
                setDeployProgress(40);
                
                // ── Step 3: Simulate remaining pipeline steps (Cache purge, Indexing) ──
                const interval = setInterval(() => {
                  setDeployProgress(prev => {
                    if (prev >= 95) {
                      clearInterval(interval);
                      return 95;
                    }
                    return prev + 5;
                  });
                }, 400);

                // Wait for simulation to finish
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                setDeployProgress(100);
                setTimeout(() => {
                  setIsDeploying(false);
                  setDeployProgress(0);
                }, 2000);

              } catch (err: any) {
                console.error(err);
                setDeployError(err.message);
                setIsDeploying(false);
              }
            }}
            disabled={isDeploying}
            className={`
              bg-gold text-navy px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(200,169,110,0.3)]
              ${isDeploying ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-105 active:scale-95'}
            `}
          >
            {isDeploying ? `${t('admin.deploying')} ${deployProgress}%` : t('admin.deployPatch')}
          </button>
        </motion.div>
      </header>

      {isDeploying && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-gold/10 border border-gold/20 rounded-2xl p-4 overflow-hidden"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em] flex items-center gap-2">
              <Terminal size={12} />
              {t('admin.pipelineActive')}
            </span>
            <span className="text-[10px] font-mono text-gold">{deployProgress}%</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gold"
              initial={{ width: 0 }}
              animate={{ width: `${deployProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {deployError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold"
        >
          {deployError}
        </motion.div>
      )}

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ 
              y: -12, 
              rotateX: mousePos.y * 10,
              rotateY: mousePos.x * 10,
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderColor: 'rgba(200,169,110,0.3)',
              transition: { duration: 0.2 }
            }}
            style={{ perspective: 1000 }}
            className="group relative bg-white/[0.03] border border-white/[0.05] rounded-3xl p-8 transition-all duration-500 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={16} className="text-gold" />
            </div>
            
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-500 mb-6 group-hover:scale-110 transition-transform duration-500`}>
              {stat.icon}
            </div>

            <div>
              <div className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</div>
              <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">{stat.label}</div>
              <div className="text-[10px] font-black text-gold/60 uppercase tracking-widest bg-gold/5 px-2 py-1 rounded-md inline-block">
                {stat.change}
              </div>
            </div>

            {/* Background glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gold/5 blur-[50px] rounded-full group-hover:bg-gold/10 transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Health / Operations */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-10 relative overflow-hidden"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">{t('admin.backendOrchestration')}</h3>
              <p className="text-white/30 text-sm mt-1">{t('admin.syncHealth')}</p>
            </div>
            <div className="flex gap-2">
               <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-white/50 hover:text-white transition-colors">
                 <ActivityIcon size={18} />
               </button>
            </div>
          </div>

          <div className="space-y-6">
            {[
              { name: 'Property Finder API', status: 'Online', latency: '42ms', load: 12 },
              { name: 'WhatsApp Gateway', status: 'Online', latency: '128ms', load: 45 },
              { name: 'Telegram Bot', status: 'Online', latency: '15ms', load: 8 },
              { name: 'AI Image Processor', status: 'Processing', latency: '2.4s', load: 88 },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5">
                <div className={`w-3 h-3 rounded-full ${item.status === 'Online' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gold shadow-[0_0_10px_rgba(200,169,110,0.5)]'}`} />
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">{item.name}</div>
                  <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">{item.status}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono text-white/60">{item.latency}</div>
                  <div className="w-24 h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.load}%` }}
                      className="h-full bg-gold/50"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security & Access */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-br from-navy-light/50 to-transparent border border-white/[0.05] rounded-[2.5rem] p-10 flex flex-col"
        >
          <div className="flex-1">
            <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-8">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight mb-4">{t('admin.securityProtocol')}</h3>
            <p className="text-white/40 text-sm leading-relaxed mb-8">
              {t('admin.securityNote')}
            </p>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3 text-xs font-bold text-white/60">
                <Wifi size={14} className="text-emerald-500" />
                Network Latency: <span className="text-white font-mono">18ms</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-white/60">
                <Database size={14} className="text-gold" />
                Firestore Sync: <span className="text-white font-mono">Optimal</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowLogs(true)}
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-gold hover:text-navy transition-all duration-500"
          >
            {t('admin.viewLogs')}
          </button>
        </motion.div>
      </div>

      {/* ── Property Finder Synchronization ── */}
      <motion.div 
        variants={itemVariants}
        className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-10 relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1">
            <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-8">
              <Database size={28} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight mb-4">Data Orchestration</h3>
            <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md">
              Trigger manual synchronization pipelines to ingest the latest luxury real estate listings and stakeholder leads directly from the Property Finder API gateway.
            </p>
          </div>
          <div className="flex-1 w-full flex flex-col gap-4">
            {['sync-listings', 'sync-leads'].map((action) => (
              <div key={action} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-white font-bold text-lg mb-1 capitalize">{action.replace('-', ' ')}</h4>
                  <p className="text-white/40 text-xs">Synchronize latest {action.split('-')[1]} from external gateway.</p>
                </div>
                <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleSync(action)}
                    disabled={syncState[action]?.loading}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                      syncState[action]?.loading ? 'bg-gold/50 text-navy cursor-not-allowed' : 'bg-gold hover:bg-white text-navy'
                    }`}
                  >
                    {syncState[action]?.loading ? 'Syncing...' : 'Execute Sync'}
                  </button>
                  {syncState[action]?.error && (
                    <span className="text-red-400 text-xs font-bold">{syncState[action]?.error}</span>
                  )}
                  {syncState[action]?.success && (
                    <span className="text-emerald-400 text-xs font-bold">{syncState[action]?.success}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Security Logs Modal ── */}
      {showLogs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/90 backdrop-blur-2xl">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 w-full max-w-2xl shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">{t('admin.securityAudit').split(' ')[0]} <span className="luxury-gradient-text">{t('admin.securityAudit').split(' ').slice(1).join(' ')}</span></h3>
                <p className="text-white/40 text-xs font-medium mt-1">{t('admin.auditNote')}</p>
              </div>
              <button onClick={() => setShowLogs(false)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                {t('common.close')}
              </button>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pe-4 scrollbar-hide">
              {logs.length === 0 ? (
                <div className="py-20 text-center text-white/20 font-black uppercase tracking-[0.4em]">
                  No activities recorded yet.
                </div>
              ) : logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold">
                      <Clock size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{log.description}</div>
                      <div className="text-[10px] text-white/30 font-black uppercase tracking-widest">
                        {log.actorName} • {log.createdAt && (log.createdAt as any).toDate ? (log.createdAt as any).toDate().toLocaleTimeString() : 'Recently'}
                      </div>
                    </div>
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 text-gold/80`}>
                    {log.type.split('_').join(' ')}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <style>{`
        .luxury-gradient-text {
          background: linear-gradient(135deg, #C8A96E 0%, #F5E6C8 50%, #C8A96E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
}
