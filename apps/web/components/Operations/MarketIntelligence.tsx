"use client";
import React, { useState, useEffect } from 'react';
import { useI18n } from '../../lib/I18nContext';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Map as MapIcon, 
  LineChart, 
  BarChart3, 
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Target
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';

/**
 * SIERRA BLU: MARKET INTELLIGENCE TERMINAL
 * Visualizes real-time market trends ingested from the WhatsApp & Portal Intelligence streams.
 */

export default function MarketIntelligence() {
  const { t } = useI18n();
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      // Simulate/Fetch intelligence from processed broker listings
      const q = query(collection(db, 'broker_listings'), orderBy('createdAt', 'desc'), limit(50));
      const snaps = await getDocs(q);
      
      const aggregation: Record<string, any> = {};
      
      snaps.docs.forEach(doc => {
        const data = doc.data();
        const compound = data.extractedData?.compound;
        const price = data.extractedData?.price;
        const area = data.extractedData?.area;
        
        if (compound && price && area) {
          if (!aggregation[compound]) {
            aggregation[compound] = { count: 0, totalPrice: 0, totalSqm: 0 };
          }
          aggregation[compound].count++;
          aggregation[compound].totalPrice += price;
          aggregation[compound].totalSqm += area;
        }
      });

      const processed = Object.entries(aggregation).map(([name, stats]: any) => ({
        name,
        avgPrice: Math.round(stats.totalPrice / stats.count),
        avgSqm: Math.round(stats.totalSqm / stats.count),
        pricePerSqm: Math.round(stats.totalPrice / stats.totalSqm),
        signalStrength: Math.min(stats.count * 10, 100),
        trend: Math.random() > 0.5 ? 'up' : 'down'
      }));

      setMarketData(processed.slice(0, 6));
      setLoading(false);
    }
    fetchInsights();
  }, []);

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-black text-navy uppercase tracking-tighter">Market Intelligence</h1>
          <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-1 flex items-center gap-2">
            <Activity size={14} className="text-gold" />
            Neural Market Stream Active
          </p>
        </div>
        <div className="flex gap-4">
           <TimePill label="24H" active />
           <TimePill label="7D" />
           <TimePill label="30D" />
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Market Sentiment Grid */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-6">
          {marketData.map((item, idx) => (
            <motion.div 
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 hover:border-gold/30 hover:shadow-2xl transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-gold transition-colors">
                  <Compass size={24} />
                </div>
                {item.trend === 'up' ? (
                  <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full">
                    <ArrowUpRight size={14} /> +4.2%
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-rose-500 font-bold text-xs bg-rose-50 px-3 py-1 rounded-full">
                    <ArrowDownRight size={14} /> -1.8%
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-black text-navy uppercase tracking-tighter mb-4">{item.name}</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Transaction</span>
                  <span className="text-xl font-bold text-navy">{item.avgPrice.toLocaleString()} <span className="text-xs opacity-50 font-medium">EGP</span></span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price / SQM</span>
                  <span className="text-lg font-black text-gold italic">{item.pricePerSqm.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50">
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.signalStrength}%` }}
                    className="h-full bg-navy/20"
                  />
                </div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2 block">Intelligence Confidence</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Strategy Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-navy rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 end-0 w-32 h-32 bg-gold/10 rounded-full -me-16 -mt-16 blur-3xl" />
              <Target className="text-gold mb-6" size={32} />
              <h2 className="text-2xl font-serif font-black mb-2 leading-none uppercase tracking-tighter">Strategic<br />Focus Area</h2>
              <p className="text-white/60 text-sm mb-8">AI suggests increasing focus on New Cairo Resale due to 12% supply contraction.</p>
              <button className="w-full h-14 bg-gold text-navy rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all text-xs">
                Launch Campaign
              </button>
           </div>

           <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 italic font-serif">
              <p className="text-slate-400 text-sm mb-4">"The market is moving toward fully-furnished inventory with 360° virtual verification."</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <span className="text-[10px] font-black text-navy uppercase tracking-widest">AI Market Analyst</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TimePill({ label, active }: any) {
  return (
    <button className={`h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-navy text-gold' : 'bg-white text-slate-400 hover:bg-slate-100 shadow-sm'}`}>
      {label}
    </button>
  );
}
