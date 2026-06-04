'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

/**
 * SIERRA BLU — TESTIMONIALS CAROUSEL
 * A luxury, smooth-transition carousel for client testimonials
 */

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  isArabic?: boolean;
}

export default function TestimonialsCarousel({ testimonials, isArabic = false }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <div className="relative w-full max-w-5xl mx-auto py-20 px-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: isArabic ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isArabic ? -100 : 100 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-10 text-[#C9A84C]/20">
            <Quote size={80} fill="currentColor" />
          </div>

          <p className="font-playfair italic text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-12 px-4">
            "{current.quote}"
          </p>

          <div className="flex flex-col items-center">
             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#0A1628] flex items-center justify-center text-white font-bold text-xl mb-4 border border-white/10 shadow-xl">
               {current.avatar ? <img src={current.avatar} alt={current.name} className="w-full h-full rounded-full object-cover" /> : current.name[0]}
             </div>
             <h4 className="text-xl font-semibold text-[#C9A84C] tracking-wide">{current.name}</h4>
             <p className="text-sm uppercase tracking-[0.2em] text-white/40 mt-1">{current.role}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2 md:px-0">
        <button 
          onClick={prev}
          className="pointer-events-auto p-4 rounded-full border border-white/10 bg-white/5 hover:bg-[#C9A84C] hover:text-[#0A1628] text-white transition-all duration-300"
        >
          {isArabic ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
        <button 
          onClick={next}
          className="pointer-events-auto p-4 rounded-full border border-white/10 bg-white/5 hover:bg-[#C9A84C] hover:text-[#0A1628] text-white transition-all duration-300"
        >
          {isArabic ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-3 mt-16">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-12 bg-[#C9A84C]' : 'w-4 bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
}
