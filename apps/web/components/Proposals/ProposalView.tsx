"use client";
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Timestamp } from 'firebase/firestore';
import { Proposal, Unit } from '@/lib/models/schema';
import ConciergeGallery from '@/components/Proposals/ConciergeGallery';
import type { ConciergeSelection } from '@/lib/services/portfolio-engine';
import { MapPin, Bed, Bath, Maximize2, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface ProposalViewProps {
  proposal: Proposal;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 50 } 
  }
};

export default function ProposalView({ proposal }: ProposalViewProps) {
  return (
    <div className="proposal-public-view min-h-screen bg-navy text-white selection:bg-gold selection:text-navy">
      {/* Cinematic Background Gradient */}
      <div className="fixed inset-0 bg-radial-gradient from-blue-900/20 via-navy to-navy -z-10" />
      <div className="mouse-glow opacity-30" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 py-16 lg:py-24"
      >
        {/* Header Section */}
        <motion.header variants={itemVariants} className="text-center mb-16">
          <div className="sb-logo-luxury mb-6 mx-auto">SB</div>
          <h1 className="serif text-4xl lg:text-6xl mb-4 tracking-tight">
            Strategic Options Package
          </h1>
          <div className="text-gold uppercase tracking-[0.2em] text-sm lg:text-base mb-8">
            Specially Curated for {proposal.leadName}
          </div>
          <p className="max-w-2xl mx-auto text-silver/80 text-lg leading-relaxed">
            {proposal.strategicSummary || "An exclusive selection of premium assets analyzed for their investment potential and lifestyle alignment."}
          </p>
        </motion.header>

        {/* Premium Assets Gallery (Horizontal Scrolling) */}
        <div className="mb-24">
          <ConciergeGallery portfolio={{
            id: proposal.id || '',
            leadId: proposal.leadId,
            leadName: proposal.leadName || '',
            createdAt: (proposal.createdAt as Timestamp) || Timestamp.now(),
            personalNote: proposal.strategicSummary || '',
            whatsappLink: '',
            matchingScore: 0,
            estimatedPortfolioROI: proposal.financialAnalysis?.projectedROI || 0,
            units: proposal.units.map(u => ({
              id: u.id,
              title: u.title,
              price: u.price,
              matchScore: u.matchScore,
              estimatedYield: u.financialAnalysis?.annualYield || 0,
              estimatedROI: u.financialAnalysis?.projectedROI || 0,
              imageUrl: u.images?.[0],
              description: '',
              reason: u.matchReason,
            })),
          } satisfies ConciergeSelection} />
        </div>

        {/* Footer & Trust Layer */}
        <motion.footer variants={itemVariants} className="mt-24 pt-16 border-t border-white/5 text-center">
          <div className="flex items-center justify-center mb-8 text-silver/40">
            <ShieldCheck size={20} className="me-2" />
            <span className="uppercase text-xs tracking-widest">Secured by Sierra Blu Intelligence</span>
          </div>
          <div className="serif text-xl mb-4 italic text-silver/60">
            "We do not just find properties; we secure your architectural legacy."
          </div>
          <div className="text-xs text-silver/30 mt-12 pb-8">
            &copy; {new Date().getFullYear()} Sierra Blu Realty. All rights reserved. Selective Private Disclosure.
          </div>
        </motion.footer>
      </motion.div>

      <style>{`
        .bg-navy { background-color: #0A1A3A; }
        .text-navy { color: #0A1A3A; }
        .text-silver { color: #E2E8F0; }
        .text-gold { color: #C9A24A; }
        .gold-text { color: #C9A24A; }
        
        .glass-card-luxury {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
        }

        .badge-luxury {
          background: rgba(10, 26, 58, 0.8);
          backdrop-filter: blur(4px);
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid rgba(201, 162, 74, 0.3);
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          color: white;
        }

        .btn-luxury-full {
          background: none;
          border: 1px solid #C9A24A;
          color: #C9A24A;
          padding: 12px 24px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.85rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-luxury-full:hover {
          background: #C9A24A;
          color: #0A1A3A;
        }

        .sb-logo-luxury {
          width: 60px;
          height: 60px;
          border: 1px solid #C9A24A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: #C9A24A;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
    </div>
  );
}
