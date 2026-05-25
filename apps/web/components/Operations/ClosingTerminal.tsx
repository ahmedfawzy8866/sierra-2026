'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { COLLECTIONS, type Sale, type Lead } from '@/lib/models/schema';
import { finalizeSale } from '@/lib/services/closing-engine';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const ClosingTerminal: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.sales), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Sale));
      setSales(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleFinalize = async (id: string) => {
    try {
      await finalizeSale(id);
      toast.success('Sale finalized! Moving to Feedback Loop.');
    } catch (error) {
      toast.error('Failed to finalize sale.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="serif text-2xl text-gold">Stage 9: Closing Terminal</h2>
          <p className="text-sm text-secondary">Executive portal for final signature verification and commission lock-in.</p>
        </div>
        <div className="badge badge-success">Pending Closures: {sales.length}</div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {sales.map((sale) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-panel-luxury p-8 rounded-3xl border-gold/20 flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gold/60">Asset</label>
                    <p className="serif text-xl">{sale.unitId}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gold/60">Stakeholder</label>
                    <p className="text-lg">{sale.leadId}</p>
                  </div>
                </div>
                
                <div className="h-px bg-gold/10 w-full" />

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gold/60">Sale Value</label>
                    <p className="font-bold text-lg">{sale.salePrice?.toLocaleString()} EGP</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gold/60">Commission</label>
                    <p className="text-blue-light font-bold">%{sale.commissionPercent}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-gold/60">Net Payout</label>
                    <p className="text-success font-bold">{sale.commissionAmount?.toLocaleString()} EGP</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-64">
                <button className="btn btn-outline w-full py-4">
                  View Digital Contract
                </button>
                <button
                  onClick={() => handleFinalize(sale.id!)}
                  className="btn btn-gold w-full py-4 text-navy-dark"
                >
                  Finalize & Execute
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!loading && sales.length === 0 && (
          <div className="py-20 text-center glass-panel rounded-3xl opacity-50">
            <p className="serif text-xl">All Strategic Acquisitions Clear.</p>
          </div>
        )}
      </div>
    </div>
  );
};
