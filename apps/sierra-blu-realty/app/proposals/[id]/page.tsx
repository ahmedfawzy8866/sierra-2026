"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS, Proposal } from '@/lib/models/schema';
import ProposalView from '@/components/Proposals/ProposalView';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicProposalPage() {
  const params = useParams();
  const id = params.id as string;
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProposal = async () => {
      try {
        const docRef = doc(db, COLLECTIONS.proposals, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Proposal;
          setProposal(data);
          
          // Track view analytics (Server-side increment if possible, but client-side for now)
          await updateDoc(docRef, {
            viewCount: increment(1),
            lastViewedAt: serverTimestamp()
          });
        } else {
          setError("This strategic package is no longer available or has been moved.");
        }
      } catch (err) {
        console.error("Proposal access failure:", err);
        setError("Unable to secure a connection to the Sierra Blu intelligence vault.");
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  return (
    <main className="min-h-screen bg-navy overflow-x-hidden">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-navy"
          >
            <div className="sb-loader-luxury mb-4">SB</div>
            <div className="text-gold tracking-[0.3em] text-xs uppercase animate-pulse">
              Synchronizing Asset Portfolio...
            </div>
          </motion.div>
        ) : error ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen flex items-center justify-center p-6 text-center"
          >
            <div className="max-w-md">
              <div className="text-gold text-4xl mb-6">!</div>
              <h2 className="serif text-2xl text-white mb-4">Access Restricted</h2>
              <p className="text-silver/60 mb-8">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-navy transition-all uppercase tracking-widest text-xs"
              >
                Retry Connection
              </button>
            </div>
          </motion.div>
        ) : proposal ? (
          <ProposalView key="view" proposal={proposal} />
        ) : null}
      </AnimatePresence>

      <style>{`
        .bg-navy { background-color: #0A1A3A; }
        .text-gold { color: #C9A24A; }
        .sb-loader-luxury {
          width: 40px;
          height: 40px;
          border: 1px solid #C9A24A;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #C9A24A;
          font-family: var(--font-serif);
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          animation: luxury-spin 3s infinite linear;
        }
        @keyframes luxury-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
