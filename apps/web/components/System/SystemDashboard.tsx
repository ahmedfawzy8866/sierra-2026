"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Cpu, Globe, Database, ArrowRight, Settings } from 'lucide-react';
import MaintenanceMonitor from './MaintenanceMonitor';

export default function SystemDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'dqe' | 'orchestrator' | 'distribution' | 'maintenance'>('overview');

  return (
    <div className="p-8 max-w-7xl mx-auto text-white" style={{ minHeight: '100vh', backgroundColor: 'var(--midnight-navy, #0B1021)' }}>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light tracking-wide flex items-center gap-3">
            <Cpu className="text-[var(--burnished-gold, #C9A96E)]" />
            OUTSIDER SYSTEM <span className="text-sm px-2 py-1 bg-white/10 rounded-full text-white/70 ms-2">v12.0</span>
          </h1>
          <p className="text-white/60 mt-2 text-sm uppercase tracking-widest">Admin & Employee Intelligence Dashboard</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-md bg-white/5 border border-white/10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs tracking-wider">PIPELINE ACTIVE</span>
          </div>
        </div>
      </header>

      <div className="flex gap-6 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
        {['overview', 'dqe', 'orchestrator', 'distribution', 'maintenance'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`uppercase tracking-wider text-sm pb-2 transition-all ${
              activeTab === tab 
                ? 'text-[var(--burnished-gold, #C9A96E)] border-b-2 border-[var(--burnished-gold, #C9A96E)]' 
                : 'text-white/50 hover:text-white'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Assets in Pipeline" value="1,204" icon={<Database size={20} />} trend="+12 this week" />
            <StatCard title="DQE Flags (Duplicates)" value="34" icon={<ShieldCheck size={20} />} trend="-5 this week" />
            <StatCard title="Active Syndications" value="892" icon={<Globe size={20} />} trend="Property Finder synced" />

            <div className="col-span-1 md:col-span-3 mt-6 p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
              <h3 className="text-lg font-light mb-4 text-[var(--burnished-gold, #C9A96E)]">Live Orchestrator Feed</h3>
              <div className="space-y-4">
                <FeedItem time="Just now" event="Asset MVD-3F-75K+G generated branded media via Canvas Engine." status="success" />
                <FeedItem time="2 mins ago" event="Property Finder API Sync successful for 12 records." status="success" />
                <FeedItem time="15 mins ago" event="Data Quality Estimation flagged a potential duplicate in Shorouk Villa." status="warning" />
                <FeedItem time="1 hr ago" event="WhatsApp Scraper ingested 5 new raw texts. Routed to Scribe." status="info" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dqe' && (
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
            <h3 className="text-lg font-light mb-6 text-[var(--burnished-gold, #C9A96E)] flex items-center gap-2">
              <ShieldCheck /> Data Quality Estimation (DQE) Queue
            </h3>
            <p className="text-sm text-white/60 mb-6">Review pending assets flagged for +/- 5% price variance or duplicate locations.</p>
            
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-white/50 border-b border-white/10">
                <tr>
                  <th className="pb-3 font-medium">System Code</th>
                  <th className="pb-3 font-medium">Compound</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Flag Reason</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-mono text-[var(--burnished-gold, #C9A96E)]">CFC-2U-45K</td>
                    <td className="py-4 text-white/80">Cairo Festival City</td>
                    <td className="py-4 text-white/80">45,000 EGP</td>
                    <td className="py-4 text-amber-400">Duplicate Match (98%)</td>
                    <td className="py-4 text-right">
                      <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orchestrator' && (
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
            <h3 className="text-lg font-light mb-6 text-[var(--burnished-gold, #C9A96E)] flex items-center gap-2">
              <Activity /> 10-Stage Pipeline Overview
            </h3>
            <div className="flex flex-col space-y-6 relative before:absolute before:inset-0 before:ms-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
               <PipelineStage num="1" title="Scribe Intake" desc="Raw data parsed from WhatsApp Scraper." active />
               <PipelineStage num="2" title="Property Coding" desc="Assigned internal code [Location]-[Rooms]-[Price]." active />
               <PipelineStage num="3" title="Branded Asset Generation" desc="Applied Sierra Blu Standard gradient and logo." active />
               <PipelineStage num="4" title="Copywriting AI" desc="Generated dual-format narratives (Social & Portal)." active />
               <PipelineStage num="5" title="Neural Matching" desc="Awaiting client assignment." />
            </div>
          </div>
        )}

        {activeTab === 'distribution' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
                <h3 className="text-lg font-light mb-4">Property Finder API Sync</h3>
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                   <div className="flex items-center gap-3">
                      <Globe className="text-green-400" />
                      <span>Status: <strong className="text-green-400">Connected</strong></span>
                   </div>
                   <button className="text-xs bg-[var(--burnished-gold, #C9A96E)] text-black px-4 py-2 rounded font-medium">Force Sync</button>
                </div>
             </div>
             <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
                <h3 className="text-lg font-light mb-4">Telegram OS Bot</h3>
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                   <div className="flex items-center gap-3">
                      <Activity className="text-green-400" />
                      <span>Status: <strong className="text-green-400">Listening</strong></span>
                   </div>
                   <button className="text-xs bg-white/10 px-4 py-2 rounded font-medium">View Logs</button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceMonitor />
        )}
      </motion.div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm text-white/60 tracking-wide uppercase">{title}</h3>
        <div className="text-[var(--burnished-gold, #C9A96E)] opacity-80">{icon}</div>
      </div>
      <div className="text-4xl font-light mb-2">{value}</div>
      <div className="text-xs text-green-400/80 tracking-wider">{trend}</div>
    </div>
  );
}

function FeedItem({ time, event, status }: { time: string, event: string, status: 'success' | 'warning' | 'info' }) {
  const colors = {
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  };
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
      <div className={`mt-1.5 w-2 h-2 rounded-full ${colors[status]}`}></div>
      <div>
        <p className="text-sm text-white/90">{event}</p>
        <p className="text-xs text-white/40 mt-1">{time}</p>
      </div>
    </div>
  );
}

function PipelineStage({ num, title, desc, active = false }: { num: string, title: string, desc: string, active?: boolean }) {
  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-[var(--midnight-navy, #0B1021)] ${active ? 'bg-[var(--burnished-gold, #C9A96E)]' : 'bg-white/20'} text-black font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md`}>
        {num}
      </div>
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-1">
          <h4 className={`text-base ${active ? 'text-[var(--burnished-gold, #C9A96E)]' : 'text-white/70'}`}>{title}</h4>
        </div>
        <p className="text-sm text-white/60">{desc}</p>
      </div>
    </div>
  );
}
