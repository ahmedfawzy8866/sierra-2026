import React from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  Activity, 
  Globe, 
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';
import { StatCardV4 } from './StatCardV4';
import { NeuralHubHeaderV4 } from './NeuralHubHeaderV4';
import { StrategicIntelligenceV4 } from './StrategicIntelligenceV4';
import { AssetFinalizationV4 } from './AssetFinalizationV4';

export default function DashboardV4() {
  return (
    <div className="min-h-screen bg-navy-dark text-white p-6 md:p-10 font-sans selection:bg-gold/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-navy-light/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        <NeuralHubHeaderV4 />

        {/* Global KPI Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCardV4 
            label="Investment Stakeholders" 
            value="1,284" 
            trend="+12.5%" 
            trendUp={true} 
            icon={Users} 
            delay="0.1s"
          />
          <StatCardV4 
            label="Strategic Pipeline" 
            value="$4.2B" 
            trend="+8.2%" 
            trendUp={true} 
            icon={TrendingUp} 
            delay="0.2s"
          />
          <StatCardV4 
            label="Portfolio Assets" 
            value="842" 
            trend="+3.4%" 
            trendUp={true} 
            icon={Briefcase} 
            delay="0.3s"
          />
          <StatCardV4 
            label="Closing Velocity" 
            value="14.2 Days" 
            trend="-2.1%" 
            trendUp={true} 
            icon={Activity} 
            delay="0.4s"
          />
        </div>

        {/* Main Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <StrategicIntelligenceV4 />
          </div>
          <div className="lg:col-span-1">
            <AssetFinalizationV4 />
          </div>
        </div>

        {/* Neural Signal Bar (Stage 10 Feedback) */}
        <div className="neural-surface p-4 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-gold/20 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-silver/60">Stage 10 Intelligence</p>
              <h4 className="text-sm font-medium text-white">Neural feedback loop identified 4 optimization vectors in the London Portfolio.</h4>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gold group-hover:translate-x-[-4px] transition-transform">SYSTEM OPTIMIZATION READY</span>
            <ChevronRight size={18} className="text-silver/30" />
          </div>
        </div>
      </div>
    </div>
  );
};
