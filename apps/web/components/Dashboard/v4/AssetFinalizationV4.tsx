import React from 'react';
import { CheckCircle2, Clock, MapPin, DollarSign, ArrowRight } from 'lucide-react';

const assets = [
  { id: 1, name: 'The Azure Penthouse', location: 'Dubai Marina', value: '$12.4M', status: 'Finalizing', progress: 92 },
  { id: 2, name: 'Obsidian Ridge Estate', location: 'Beverly Hills', value: '$45.0M', status: 'Verification', progress: 78 },
  { id: 3, name: 'Ivory Coast Villa', location: 'Saint-Tropez', value: '$18.2M', status: 'Escrow', progress: 99 },
];

export const AssetFinalizationV4: React.FC = () => {
  return (
    <div className="neural-surface p-8 rounded-[2rem] border border-gold/10 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="text-success" size={20} />
            ASSET FINALIZATION
          </h2>
          <p className="text-sm text-silver/40">Stage 09: Institutional Closing Protocol</p>
        </div>
        <button className="text-gold text-xs font-bold uppercase tracking-widest hover:underline transition-all">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-gold/20 hover:bg-white/[0.05] transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-navy-dark border border-white/10 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue/20 to-gold/20 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-gold transition-colors">{asset.name}</h4>
                  <p className="text-[10px] text-silver/40 flex items-center gap-1 uppercase tracking-tighter">
                    <MapPin size={10} /> {asset.location}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gold">{asset.value}</p>
                <p className="text-[10px] text-success font-bold uppercase">{asset.status}</p>
              </div>
            </div>
            
            <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue to-gold animate-shimmer" 
                style={{ width: `${asset.progress}%`, backgroundSize: '200% 100%' }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[9px] text-silver/30 font-bold uppercase tracking-widest">Protocol Sync</span>
              <span className="text-[9px] text-gold font-bold">{asset.progress}%</span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-4 rounded-xl border border-gold/20 text-gold text-xs font-bold uppercase tracking-[0.2em] hover:bg-gold/5 transition-all flex items-center justify-center gap-2">
        MANAGE GLOBAL INVENTORY
        <ArrowRight size={14} />
      </button>
    </div>
  );
};
