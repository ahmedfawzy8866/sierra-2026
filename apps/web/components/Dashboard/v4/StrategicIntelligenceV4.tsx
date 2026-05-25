import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, Users, MapPin } from 'lucide-react';

const data = [
  { name: 'S1', pipe: 4000, stake: 2400 },
  { name: 'S2', pipe: 3000, stake: 1398 },
  { name: 'S3', pipe: 2000, stake: 9800 },
  { name: 'S4', pipe: 2780, stake: 3908 },
  { name: 'S5', pipe: 1890, stake: 4800 },
  { name: 'S6', pipe: 2390, stake: 3800 },
  { name: 'S7', pipe: 3490, stake: 4300 },
];

export const StrategicIntelligenceV4: React.FC = () => {
  return (
    <div className="neural-surface p-8 rounded-[2rem] border border-gold/10 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="text-gold" size={20} />
            STRATEGIC PIPELINE SYNTHESIS
          </h2>
          <p className="text-sm text-silver/40">Real-time neural mapping of global investment flows</p>
        </div>
        
        <div className="flex gap-2">
          {['24H', '7D', '30D', '1Y'].map((t) => (
            <button key={t} className="px-3 py-1 text-[10px] font-bold rounded-lg border border-white/5 text-silver/40 hover:text-gold hover:border-gold/20 transition-all">
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full mb-8 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPipe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C8A96E" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#C8A96E" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorStake" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E6DB4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2E6DB4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0B1A3E', border: '1px solid rgba(200,169,110,0.2)', borderRadius: '12px' }}
              itemStyle={{ fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="pipe" stroke="#C8A96E" strokeWidth={3} fillOpacity={1} fill="url(#colorPipe)" />
            <Area type="monotone" dataKey="stake" stroke="#2E6DB4" strokeWidth={3} fillOpacity={1} fill="url(#colorStake)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-silver/40 mb-1">Conversion Alpha</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">12.4%</span>
            <span className="text-xs text-success">+2.1%</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-silver/40 mb-1">Portfolio Velocity</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">0.8x</span>
            <span className="text-xs text-error">-0.05%</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-silver/40 mb-1">Stakeholder Retention</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">94.2%</span>
            <span className="text-xs text-success">+4.8%</span>
          </div>
        </div>
      </div>
      
      {/* Abstract background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
};
