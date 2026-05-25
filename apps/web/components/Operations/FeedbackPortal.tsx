'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { COLLECTIONS, type Lead } from '@/lib/models/schema';
import { submitStakeholderFeedback } from '@/lib/services/feedback-engine';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export const FeedbackPortal: React.FC = () => {
  const [pendingLeads, setPendingLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.stakeholders), 
      where('orchestrationState.stage', '==', 'S10_FEEDBACK_PENDING')
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Lead));
      setPendingLeads(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (leadId: string, score: number, comment: string) => {
    try {
      await submitStakeholderFeedback(leadId, score, comment);
      toast.success('Feedback recorded. Pipeline cycle complete.');
    } catch (error) {
      toast.error('Error submitting feedback.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="serif text-2xl text-gold">Stage 10: Feedback Portal</h2>
        <p className="text-sm text-secondary">Continuous intelligence loop. Capturing satisfaction and refining matching parameters.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pendingLeads.map((lead) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="luxury-card flex flex-col md:flex-row gap-8"
          >
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{lead.name}</h3>
              <p className="text-sm text-secondary mb-4">Strategic Acquisition: {lead.intelligence?.closedAssetId}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">Satisfaction Score (1-5)</label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleSubmit(lead.id!, num, "Excellent experience.")}
                        className="w-12 h-12 rounded-full border border-gold/30 hover:bg-gold hover:text-navy flex items-center justify-center transition-all"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/3 bg-gold/5 p-6 rounded-2xl border border-gold/10">
              <h4 className="serif text-sm text-gold mb-2">Internal Note</h4>
              <p className="text-xs text-secondary leading-relaxed">
                Stakeholder has transitioned to a Portfolio Owner status. Future matching should prioritize resale yield and property management incentives.
              </p>
            </div>
          </motion.div>
        ))}

        {!loading && pendingLeads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-secondary">No pending feedback sessions.</p>
          </div>
        )}
      </div>
    </div>
  );
};
