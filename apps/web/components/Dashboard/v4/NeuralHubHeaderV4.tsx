import React from 'react';
import { Search, Bell, Grid, User, LayoutDashboard, Globe, Shield, Zap } from 'lucide-react';

export const NeuralHubHeaderV4: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold cinematic-gold-text mb-2">
            Neural Hub <span className="text-silver/30 font-light">| EXECUTIVE</span>
          </h1>
          <p className="text-silver/50 tracking-wide flex items-center gap-2">
            <Zap size={14} className="text-gold" />
            Global Pipeline Synchronization: <span className="text-success font-medium">99.8% Efficiency</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-silver/40">
            <Shield size={14} className="text-blue-light" />
            <span>INSTITUTIONAL GRADE ACCESS</span>
          </div>
          
          <button className="w-12 h-12 rounded-2xl neural-surface border border-gold/20 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-error rounded-full ring-2 ring-navy-dark" />
          </button>
          
          <div className="flex items-center gap-3 ps-2 border-s border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white">Sierra Blu</p>
              <p className="text-[10px] text-silver/40 uppercase tracking-tighter">Chief Architect</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue to-navy flex items-center justify-center border-2 border-gold/30 shadow-lg shadow-blue/20">
              <User size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-silver/30" size={18} />
          <input 
            type="text" 
            placeholder="Search Portfolio Assets, Investment Stakeholders, or Strategic Insights..."
            className="w-100 w-full h-14 bg-white/5 border border-white/10 rounded-2xl ps-12 pe-4 text-white placeholder:text-silver/20 focus:outline-none focus:border-gold/30 focus:bg-white/[0.08] transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex-1 h-14 bg-gold rounded-2xl text-navy-dark font-bold text-sm tracking-tight hover:brightness-110 active:scale-95 transition-all">
            NEW ACQUISITION
          </button>
          <button className="w-14 h-14 neural-surface border border-white/10 rounded-2xl flex items-center justify-center text-silver/60 hover:text-white transition-colors">
            <Grid size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
