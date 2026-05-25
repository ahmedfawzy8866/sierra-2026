"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Maximize, Bed, Bath, TrendingUp, ShieldCheck, ChevronRight, Info } from 'lucide-react';
import { Unit } from '../../lib/models/schema';

interface Props {
  unit: Unit;
  locale: 'en' | 'ar';
}

/**
 * AssetProposalCard: Strategic Visualization of a Portfolio Asset.
 * Optimized for mobile-first "Cinematic Luxury" delivery to stakeholders.
 * Supports Bilingual (EN/AR) layout and high-fidelity micro-interactions.
 */
export default function AssetProposalCard({ unit, locale }: Props) {
  const isRtl = locale === 'ar';
  
  const translations = {
    price: locale === 'ar' ? 'السعر المستهدف' : 'Target Price',
    area: locale === 'ar' ? 'المساحة' : 'Area',
    beds: locale === 'ar' ? 'غرف' : 'Beds',
    baths: locale === 'ar' ? 'حمامات' : 'Baths',
    roi: locale === 'ar' ? 'العائد الاستثماري' : 'Projected ROI',
    verified: locale === 'ar' ? 'موثوق' : 'Verified',
    viewDetails: locale === 'ar' ? 'عرض التفاصيل' : 'View Details',
    sqm: locale === 'ar' ? 'م٢' : 'sqm',
    premium: locale === 'ar' ? 'عقار فاخر' : 'Premium Asset',
  };

  // Format currency based on locale
  const formattedPrice = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(unit.price);

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`relative group overflow-hidden rounded-[32px] border border-white/5 bg-gradient-to-b from-navy-dark to-black shadow-2xl ${isRtl ? 'text-right font-arabic' : 'text-left font-inter'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* 🏛️ Overlay Status Tags */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gold/90 backdrop-blur-md text-navy px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl"
        >
          {unit.intelligence?.standard === 'luxury' ? 'Supreme Luxe' : translations.premium}
        </motion.div>
        
        {unit.intelligence?.legalRiskLevel === 'low' && (
          <div className="bg-success/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] font-bold border border-success/20">
            <ShieldCheck size={12} /> {translations.verified}
          </div>
        )}
      </div>

      {/* 🖼️ Cinematic Media Section */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={unit.featuredImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80'} 
          alt={unit.title}
          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
        
        {/* Strategic Price Anchor */}
        <div className="absolute bottom-4 right-4 left-4 flex justify-between items-end">
          <div className="glass-panel px-4 py-2 rounded-2xl border-white/10">
            <p className="text-[10px] text-gold/70 uppercase tracking-widest mb-0.5 font-bold">{translations.price}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{formattedPrice}</span>
              <span className="text-xs text-gold font-bold">EGP</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📝 Intelligence & Context */}
      <div className="p-7">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-gold/60 text-[11px] mb-2 uppercase tracking-[0.2em] font-black">
            <MapPin size={12} className="text-gold" /> {unit.compound || unit.location || 'Strategic Sector'}
          </div>
          <h3 className="text-2xl font-bold leading-tight line-clamp-2 text-white/95 group-hover:text-gold transition-colors duration-300">
            {isRtl && unit.titleAr ? unit.titleAr : unit.title}
          </h3>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-6 py-5 border-y border-white/5 mb-6 bg-white/[0.02] rounded-2xl px-4">
          <div className="flex flex-col items-center">
            <Bed size={16} className="text-gold/50 mb-1.5" />
            <span className="text-sm font-black text-white">{unit.bedrooms || '0'}</span>
            <span className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">{translations.beds}</span>
          </div>
          <div className="flex flex-col items-center border-x border-white/5">
            <Maximize size={16} className="text-gold/50 mb-1.5" />
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-black text-white">{unit.area}</span>
              <span className="text-[8px] text-white/40 uppercase">{translations.sqm}</span>
            </div>
            <span className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">{translations.area}</span>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp size={16} className="text-success/50 mb-1.5" />
            <span className="text-sm font-black text-success">+{unit.intelligence?.valuationScore || '8.2'}%</span>
            <span className="text-[9px] text-white/40 uppercase font-bold tracking-tighter">{translations.roi}</span>
          </div>
        </div>

        {/* Dynamic Action Protocol */}
        <div className="flex items-center justify-between mt-auto">
           <motion.button 
             whileTap={{ scale: 0.95 }}
             className="flex items-center gap-2 text-gold font-black text-[11px] tracking-[0.15em] uppercase hover:gap-4 transition-all"
           >
             {translations.viewDetails}
             <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
           </motion.button>
           
           <div className="flex items-center gap-3">
             <div className="h-8 w-[1px] bg-white/10"></div>
             <motion.div 
               whileHover={{ rotate: 15 }}
               className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center cursor-help"
             >
                <Info size={14} className="text-white/30" />
             </motion.div>
           </div>
        </div>
      </div>

      {/* 💫 Interactive Shine Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </motion.div>
  );
}
