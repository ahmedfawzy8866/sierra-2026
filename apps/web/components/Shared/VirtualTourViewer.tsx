"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../lib/I18nContext';
import { Pause, Play, X, Move } from 'lucide-react';

interface VirtualTourViewerProps {
  sceneUrl: string;
  title?: string;
  onClose?: () => void;
}

export default function VirtualTourViewer({ sceneUrl, title, onClose }: VirtualTourViewerProps) {
  const { t } = useI18n();
  const viewerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Pannellum from CDN if not already present
    if (!window.hasOwnProperty('pannellum')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.async = true;
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      
      document.head.appendChild(link);
      document.head.appendChild(script);

      script.onload = initViewer;
    } else {
      initViewer();
    }

    function initViewer() {
      if ((window as any).pannellum && viewerRef.current) {
        (window as any).pannellum.viewer(viewerRef.current, {
          type: 'equirectangular',
          panorama: sceneUrl,
          autoLoad: true,
          autoRotate: -2,
          showControls: false,
          compass: true,
          title: title || 'Sierra Blu Virtual Tour',
          author: 'Sierra Blu Realty',
        });
        setIsLoaded(true);
      }
    }
  }, [sceneUrl, title]);

  return (
    <div className="fixed inset-0 z-[5000] bg-navy/95 backdrop-blur-2xl flex flex-col overflow-hidden">
      <header className="p-8 flex justify-between items-center relative z-10">
        <div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">{title || t('spatial.startTour')}</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{t('tour.loading')}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsRotating(!isRotating)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${
              isRotating ? 'bg-gold border-gold text-navy shadow-[0_0_20px_rgba(201,162,74,0.3)]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {isRotating ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button 
            onClick={onClose}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </header>

      <div className="flex-1 relative mx-8 mb-8 rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
        <div ref={viewerRef} className="w-full h-full bg-navy-light" />
        
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4 bg-navy">
            <div className="w-16 h-16 border-t-2 border-gold rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gold">{t('tour.loading')}</p>
          </div>
        )}

        {/* Floating Tooltip */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/80 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
          <Move size={14} className="text-gold" />
          {t('tour.controls')}
        </div>
      </div>
      
      {/* Branding Subtitle */}
      <footer className="px-12 pb-8 flex justify-between items-center opacity-40">
        <span className="text-[9px] font-bold text-white uppercase tracking-[0.5em]">Beyond Brokerage</span>
        <span className="text-white text-xs font-serif italic">Sierra Blu Proprietary Intelligence</span>
      </footer>
    </div>
  );
}
