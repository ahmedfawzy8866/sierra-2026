'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplitHeroViewport() {
  const [activeView, setActiveView] = useState<'A' | 'B'>('A');

  return (
    <div className="relative w-full h-dvh overflow-hidden bg-[#0A1628] select-none">
      <AnimatePresence mode="wait">
        {activeView === 'A' ? (
          <motion.section
            key="view-a"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full flex flex-col justify-between p-6 md:p-12 z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/40 via-transparent to-[#0A1628] z-0 pointer-events-none" />
            
            <div className="relative z-10 mt-16 max-w-2xl" dir="rtl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A84C] bg-[#10233F] px-3 py-1 rounded-full border border-[#C9A84C]/20">
                Sierra AI Operations Layer
              </span>
              <h1 className="font-serif text-4xl md:text-6xl text-[#F7F4EE] font-bold tracking-tight mt-4 leading-none">
                أول موقع متكامل <br />
                <span className="text-[#C9A84C]">لإدارة واستثمار العقارات</span>
              </h1>
            </div>

            <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <div className="bg-[#10233F]/90 backdrop-blur-md border border-[#C9A84C]/20 p-4 rounded-2xl flex items-center gap-3 shadow-xl">
                <span className="text-xl">🎁</span>
                <div>
                  <p className="text-xs font-bold text-[#F7F4EE]">WhatsApp Voucher Active</p>
                  <p className="text-[10px] text-[#D8BB6A]">Claim your 10% commission credit allocation now</p>
                </div>
              </div>

              <button
                onClick={() => setActiveView('B')}
                className="px-8 py-4 bg-gradient-to-r from-[#C9A84C] to-[#D8BB6A] text-[#0A1628] text-xs font-mono font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all hover:opacity-90"
              >
                Explore Space Telemetry 🔽
              </button>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="view-b"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full bg-[#10233F] z-20"
          >
            <div className="w-full h-full relative">
              <iframe 
                src="https://kuula.co/share/collection/7K_XG?logo=0&info=0&fs=1&vr=1&sd=1&thumbs=1"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
              <button
                onClick={() => setActiveView('A')}
                className="absolute top-24 right-6 md:right-12 bg-[#0A1628]/90 backdrop-blur-md text-[#F7F4EE] border border-[#C9A84C]/30 px-4 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-wider shadow-2xl transition-all"
              >
                🔼 Return To Panel Console
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
