'use client';

/**
 * SIERRA BLU — CONCIERGE GALLERY (S8)
 * Mobile-first swipeable gallery showing top 3-5 curated properties.
 * 
 * Design: Quiet Luxury (Deep Navy, Gold, Ivory).
 * Typography: Playfair Display + Inter.
 * Persona: Sierra (Warm Editorial Luxury tone).
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Share2, MapPin, TrendingUp, Info } from 'lucide-react';
import type { ConciergeSelection, ConciergeUnit } from '@/lib/services/portfolio-engine';
import { LuxuryCard, GoldButton, EditorialHeading } from '@/components/UI/LuxurySkeleton';

interface ConciergeGalleryProps {
  portfolio: ConciergeSelection;
  onViewingRequested?: (unitId: string) => void;
  onShare?: (unit: ConciergeUnit) => void;
}

export default function ConciergeGallery({
  portfolio,
  onViewingRequested,
  onShare,
}: ConciergeGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPersonalNote, setShowPersonalNote] = useState(true);

  const currentUnit = portfolio.units[currentIndex];
  const isLastUnit = currentIndex === portfolio.units.length - 1;

  const handleNext = () => {
    if (currentIndex < portfolio.units.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Swipe gesture handler
  const handleDragEnd = (_: never, info: { offset: { x: number } }) => {
    const threshold = 50;
    if (info.offset.x < -threshold) handleNext();
    else if (info.offset.x > threshold) handlePrev();
  };

  return (
    <div className="min-h-screen bg-[#F4F0E8] flex flex-col font-inter">
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="h-20 border-b border-[#C9A84C]/10 flex items-center justify-between px-6 md:px-12 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#0A1628]/40 font-bold">Sierra Blu Realty</span>
          <span className="text-xs text-[#C9A84C] font-semibold italic">Private Portfolio</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-[#0A1628]/60 font-medium">{currentIndex + 1} of {portfolio.units.length}</span>
          <div className="w-10 h-10 rounded-full border border-[#C9A84C]/20 flex items-center justify-center overflow-hidden bg-[#0A1628]">
             <span className="text-[10px] text-[#C9A84C] font-bold">L</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center py-8 md:py-16 px-4 max-w-5xl mx-auto w-full">
        
        {/* --- LEILA'S PERSONAL NOTE --- */}
        <AnimatePresence>
          {showPersonalNote && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full mb-12 overflow-hidden"
            >
              <LuxuryCard className="border-none shadow-sm relative overflow-hidden bg-white">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A84C]" />
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <EditorialHeading level={2} className="text-2xl md:text-3xl mb-4 italic">
                      Dear {portfolio.leadName.split(' ')[0]},
                    </EditorialHeading>
                    <p className="text-[#0A1628]/80 text-sm md:text-base leading-relaxed italic font-serif">
                      "{portfolio.personalNote}"
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-6 h-[1px] bg-[#C9A84C]" />
                      <span className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-bold">Sierra, Senior Concierge</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPersonalNote(false)}
                    className="text-[10px] uppercase tracking-tighter text-[#0A1628]/30 hover:text-[#0A1628] transition-colors self-end md:self-start"
                  >
                    Dismiss
                  </button>
                </div>
              </LuxuryCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MAIN PROPERTY DISPLAY --- */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Gallery / Images (8 columns) */}
          <div className="lg:col-span-7 w-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentUnit.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                className="relative aspect-[4/5] md:aspect-square bg-[#0A1628] rounded-sm overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
              >
                {currentUnit.imageUrl ? (
                  <img
                    src={currentUnit.imageUrl}
                    alt={currentUnit.title}
                    className="w-full h-full object-cover transition-transform duration-10000 hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <EditorialHeading level={3} className="text-[#F4F0E8]/20">Asset View Unavailable</EditorialHeading>
                  </div>
                )}
                
                {/* Match Score Overlay */}
                <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-[#C9A84C]">{currentUnit.matchScore}%</span>
                  <span className="text-[8px] uppercase tracking-tighter text-white/60">Match</span>
                </div>

                {/* Navigation Arrows — overlay at bottom */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-between px-6">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    title="Previous property"
                    aria-label="Previous property"
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white disabled:opacity-20 hover:bg-[#C9A84C] hover:text-[#0A1628] transition-all duration-300"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={isLastUnit}
                    title="Next property"
                    aria-label="Next property"
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white disabled:opacity-20 hover:bg-[#C9A84C] hover:text-[#0A1628] transition-all duration-300"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 mt-5">
              {portfolio.units.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  title={`Property ${i + 1}`}
                  aria-label={`Go to property ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'bg-[#C9A84C] w-8'
                      : 'bg-[#0A1628]/20 w-1.5 hover:bg-[#0A1628]/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Details (5 columns) */}
          <div className="lg:col-span-5 space-y-8 py-4">
            <motion.div
              key={`details-${currentUnit.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#C9A84C] font-bold block mb-4">Prime Selection</span>
                <EditorialHeading level={1} className="text-4xl md:text-5xl lg:text-6xl mb-2 italic tracking-tight">
                  {currentUnit.title}
                </EditorialHeading>
                <div className="flex items-center gap-2 text-[#0A1628]/50 text-xs">
                  <MapPin size={12} className="text-[#C9A84C]" />
                  <span className="font-medium tracking-wide">Elite District • New Cairo</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 py-4 border-y border-[#C9A84C]/10">
                <span className="text-4xl font-light text-[#0A1628]">{(currentUnit.price / 1_000_000).toFixed(1)}M</span>
                <span className="text-sm font-bold text-[#C9A84C] tracking-[0.2em]">EGP</span>
              </div>

              {/* Financial Dashboard */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-[#C9A84C]/5 rounded-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} className="text-[#C9A84C]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#0A1628]/40 font-bold">Annual Yield</span>
                  </div>
                  <p className="text-2xl font-medium text-[#0A1628]">{currentUnit.estimatedYield.toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-white border border-[#C9A84C]/5 rounded-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Info size={14} className="text-[#C9A84C]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#0A1628]/40 font-bold">Est. ROI (3Y)</span>
                  </div>
                  <p className="text-2xl font-medium text-[#0A1628]">{currentUnit.estimatedROI.toFixed(1)}%</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[#0A1628]/70 text-sm leading-relaxed">
                  {currentUnit.description}
                </p>
                <div className="p-4 bg-[#0A1628] text-[#F4F0E8] rounded-sm text-xs italic leading-relaxed border-l-4 border-[#C9A84C]">
                  "Laila's Insight: {currentUnit.reason}"
                </div>
              </div>

              <div className="pt-6 flex flex-col gap-4">
                <GoldButton 
                  label="Schedule Private Viewing" 
                  onClick={() => onViewingRequested && onViewingRequested(currentUnit.id)}
                  className="w-full py-5 text-sm shadow-lg shadow-[#C9A84C]/20"
                />
                <button 
                  onClick={() => onShare && onShare(currentUnit)}
                  className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#0A1628]/40 font-bold hover:text-[#C9A84C] transition-colors"
                >
                  <Share2 size={12} />
                  Share Selection
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 border-t border-[#C9A84C]/10 bg-white/30 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-[#0A1628]/30 mb-4 font-bold">
          Confidentiality Agreement Active
        </p>
        <p className="text-[11px] text-[#0A1628]/50 max-w-lg mx-auto leading-relaxed italic">
          This portfolio is curated exclusively for {portfolio.leadName}. All projections are based on current market trends and historical performance by Sierra Blu Realty.
        </p>
      </footer>
    </div>
  );
}
