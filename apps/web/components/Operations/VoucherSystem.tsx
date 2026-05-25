"use client";
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Ticket, Send, CheckCircle, Clock, Gift, Crown, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Voucher {
  id: string;
  code: string;
  type: string;
  value: number;
  leadName?: string;
  status: 'active' | 'redeemed' | 'expired';
  expiresAt: Timestamp;
}

export default function VoucherSystem() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'vouchers'));
    return onSnapshot(q, (snapshot) => {
      setVouchers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Voucher)));
      setLoading(false);
    });
  }, []);

  const createVoucher = async () => {
    const code = "SB-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    await addDoc(collection(db, 'vouchers'), {
      code,
      type: 'viewing-reward',
      value: 5000,
      currency: 'EGP',
      status: 'active',
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
  };

  return (
    <div className="glass-panel p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-navy flex items-center gap-3">
             <Ticket className="text-gold" />
             Sales Incentive Engine
          </h2>
          <p className="text-sm text-slate-400">Deploy high-velocity loyalty rewards (OS V4.0)</p>
        </div>
        <button 
          onClick={createVoucher}
          className="bg-navy text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg text-sm"
        >
          <Gift size={18} />
          GENERATE REWARD
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {vouchers.map((v) => (
            <motion.div 
              key={v.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-white/50 border border-slate-200 rounded-3xl p-6 overflow-hidden shadow-sm group"
            >
              {/* Ticket Notch */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-r border-slate-200" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 rounded-full border-l border-slate-200" />

              <div className="flex justify-between items-start mb-4">
                <div className="bg-gold/10 text-gold p-2 rounded-xl">
                  <Crown size={20} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Incentive Code</span>
                  <span className="text-lg font-mono font-bold text-navy">{v.code}</span>
                </div>
              </div>

              <div className="py-4 border-t border-dashed border-slate-200">
                <div className="flex justify-between items-end">
                   <div>
                      <span className="text-xs text-slate-400 block">Reward Value</span>
                      <span className="text-2xl font-serif font-bold text-emerald-600">5,000 <span className="text-xs">EGP</span></span>
                   </div>
                   <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <Clock size={12} />
                      {v.status === 'active' ? 'EXPIRES IN 7D' : 'REDEEMED'}
                   </div>
                </div>
              </div>

              <button className="w-full mt-4 bg-slate-100 text-slate-600 py-3 rounded-2xl text-xs font-bold hover:bg-gold hover:text-navy transition-all group-hover:shadow-md">
                DEPLOY TO WHATSAPP
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 40px;
        }
      `}</style>
    </div>
  );
}
