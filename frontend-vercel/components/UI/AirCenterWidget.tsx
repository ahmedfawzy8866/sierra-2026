import React from 'react';
import { Activity, Settings, TrendingUp, Users } from 'lucide-react';

export function AirCenterWidget() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-sierra-navy/10 shadow-xl max-w-sm w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sierra-navy font-bold text-lg uppercase tracking-tight">AirCenter Control</h3>
        <button className="text-sierra-navy/40 hover:text-sierra-estatese transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-sierra-ivory p-4 rounded-2xl flex flex-col items-start border border-sierra-navy/5 hover:border-sierra-estatese/30 transition-colors">
          <Activity className="w-6 h-6 text-sierra-estatese mb-3" />
          <div className="text-sierra-navy font-bold text-2xl tracking-tight">24</div>
          <div className="text-sierra-navy/60 text-xs font-semibold uppercase tracking-wider mt-1">Live Units</div>
        </div>
        
        <div className="bg-sierra-ivory p-4 rounded-2xl flex flex-col items-start border border-sierra-navy/5 hover:border-sierra-gold/30 transition-colors">
          <TrendingUp className="w-6 h-6 text-sierra-gold mb-3" />
          <div className="text-sierra-navy font-bold text-2xl tracking-tight">98%</div>
          <div className="text-sierra-navy/60 text-xs font-semibold uppercase tracking-wider mt-1">Sync Velocity</div>
        </div>
        
        <div className="bg-sierra-ivory p-4 rounded-2xl flex flex-col items-start border border-sierra-navy/5 hover:border-sierra-navy/30 transition-colors col-span-2">
          <Users className="w-6 h-6 text-sierra-navy mb-3" />
          <div className="text-sierra-navy font-bold text-2xl tracking-tight">1,024</div>
          <div className="text-sierra-navy/60 text-xs font-semibold uppercase tracking-wider mt-1">Active Stakeholders</div>
          <div className="w-full bg-sierra-navy/10 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-sierra-navy h-full w-3/4 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
