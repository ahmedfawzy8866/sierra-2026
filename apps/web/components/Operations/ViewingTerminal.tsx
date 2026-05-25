'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { COLLECTIONS, type Viewing } from '@/lib/models/schema';
import { completeViewing } from '@/lib/services/viewing-engine';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const ViewingTerminal: React.FC = () => {
  const [viewings, setViewings] = useState<Viewing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.viewings), where('status', '==', 'scheduled'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Viewing));
      setViewings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleComplete = async (id: string) => {
    try {
      await completeViewing(id);
      toast.success('Viewing mark as complete. Moving to Closing Stage.');
    } catch (error) {
      toast.error('Failed to complete viewing.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="serif text-2xl text-gold">Stage 8: Viewing Terminal</h2>
          <p className="text-sm text-secondary">Manage site inspections and stakeholder physical engagement.</p>
        </div>
        <div className="badge badge-gold">Active Inspections: {viewings.length}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {viewings.map((viewing) => (
            <motion.div
              key={viewing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="luxury-card glass-panel-luxury"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gold mb-1">Stakeholder ID</p>
                  <p className="font-semibold">{viewing.leadId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-gold mb-1">Scheduled At</p>
                  <p className="font-semibold">
                    {new Date(viewing.scheduledAt?.toDate()).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-gold mb-1">Asset Identity</p>
                <p className="text-lg serif">{viewing.unitId}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleComplete(viewing.id!)}
                  className="btn btn-gold flex-1"
                >
                  Verify Completion
                </button>
                <button className="btn btn-outline flex-1">
                  Reschedule
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {!loading && viewings.length === 0 && (
          <div className="col-span-full py-12 text-center glass-panel rounded-2xl">
            <p className="text-secondary italic">No active viewings scheduled at this moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};
