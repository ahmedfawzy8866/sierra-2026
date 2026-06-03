'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Briefcase, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

interface JobCardProps {
  title: string;
  location: string;
  type: string;
  desc: string;
  isAr: boolean;
  applyText: string;
}

export default function JobCard({ title, location, type, desc, isAr, applyText }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, borderColor: 'rgba(201, 168, 76, 0.4)', scale: 1.005 }}
      transition={{ duration: 0.3 }}
      className="p-6 md:p-8 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-gold-400/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group shadow-sm hover:shadow-lg"
    >
      {/* Decorative ambient gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold-300/0 via-gold-300/5 to-gold-300/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <h3 className="font-display text-xl md:text-2xl text-ivory group-hover:text-gold-300 transition-colors duration-300">
            {title}
          </h3>
          <div className={`flex flex-wrap items-center gap-4 text-xs font-mono tracking-wider text-ivory/60 ${isAr ? 'flex-row-reverse' : ''}`}>
            <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md">
              <MapPin size={12} className="text-gold-300" />
              {location}
            </span>
            <span className="flex items-center gap-1.5 bg-gold-400/10 text-gold-300 px-2.5 py-1 rounded-md border border-gold-400/20">
              <Briefcase size={12} />
              {type}
            </span>
          </div>
        </div>
        <p className={`text-sm text-ivory/80 leading-relaxed font-ui ${isAr ? 'font-arabic' : ''}`}>
          {desc}
        </p>
      </div>

      <div className={`flex shrink-0 ${isAr ? 'justify-start' : 'justify-end'}`}>
        <Link
          href={`/contact?subject=${encodeURIComponent(title)}`}
          aria-label={isAr ? `قدّم الآن لوظيفة ${title}` : `Apply now for ${title}`}
          className="group/cta inline-flex items-center gap-2 px-6 py-3.5 bg-gold-gradient text-navy font-semibold text-xs rounded-lg uppercase tracking-widest transition-all duration-300 group-hover:shadow-glow group-hover:scale-[1.02]"
        >
          <span>{applyText}</span>
          {isAr ? (
            <ArrowLeft size={14} className="transition-transform duration-300 group-hover/cta:-translate-x-1" />
          ) : (
            <ArrowRight size={14} className="transition-transform duration-300 group-hover/cta:translate-x-1" />
          )}
        </Link>
      </div>
    </motion.div>
  );
}
