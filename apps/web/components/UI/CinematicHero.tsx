"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import BrandLogo from './BrandLogo';

export default function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the parallax effect
  const springConfig = { damping: 50, stiffness: 400 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax shifts:
  // Video moves slightly in the counter-direction of the mouse (simulating it being far away)
  const videoX = useTransform(smoothX, [-0.5, 0.5], ['2%', '-2%']);
  const videoY = useTransform(smoothY, [-0.5, 0.5], ['2%', '-2%']);

  // Text moves slightly in the same direction of the mouse (simulating it being close)
  const textX = useTransform(smoothX, [-0.5, 0.5], ['-15px', '15px']);
  const textY = useTransform(smoothY, [-0.5, 0.5], ['-15px', '15px']);

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();

    // Normalize mouse position between -0.5 and 0.5
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    // Reset to center smoothly
    mouseX.set(0);
    mouseY.set(0);
  };

  // SVG "Build from nothing" path variants
  const pathVariants: import('framer-motion').Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1, 
      transition: { duration: 2, ease: "easeInOut", delay: 0.5 }
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[90vh] overflow-hidden bg-[#030712] flex items-center justify-center font-serif text-[#F4F0E8]"
      style={{ perspective: 1000 }}
    >
      {/* 1. LAYER ONE: The Dark Space/Earth Video (Deep Background) */}
      <motion.div 
        className="absolute inset-0 z-0 scale-[1.05]"
        style={{ x: videoX, y: videoY }}
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="object-cover w-full h-full opacity-60 mix-blend-screen"
        >
          {/* Placeholder: Working royalty-free subtle video. You will replace this with your actual space-to-earth video */}
          <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" type="video/mp4" />
        </video>
        
        {/* Gradients to blend video smoothly into the UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-transparent to-transparent z-10" />
      </motion.div>

      {/* 2. LAYER TWO: Sierra Blu Subtle Watermark (Top Right) */}
      <motion.div 
        className="absolute top-8 right-12 z-20 opacity-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 2, duration: 2 }}
      >
        <BrandLogo size="md" />
      </motion.div>

      {/* 3. LAYER THREE: Foreground Text & UI (Floating Parallax) */}
      <motion.div 
        className="relative z-30 flex flex-col items-center text-center px-4"
        style={{ x: textX, y: textY }}
      >
        
        {/* Animated "Build from nowhere" Decorative SVG */}
        <div className="mb-6">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              d="M50 5 L95 50 L50 95 L5 50 Z" 
              stroke="#C9A24D" 
              strokeWidth="1"
              variants={pathVariants}
              initial="hidden"
              animate="visible"
              className="drop-shadow-[0_0_8px_rgba(201,162,77,0.8)]"
            />
            <motion.circle 
              cx="50" cy="50" r="10" 
              fill="#C9A24D" 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 2, duration: 1, ease: "easeOut" }}
            />
          </svg>
        </div>

        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tighter"
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
        >
          Smarter Decisions, <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#C9A24D] to-white">
            AI-Driven.
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl font-sans tracking-widest text-[#F4F0E8]/70 uppercase mb-12 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 2 }}
        >
          Curated Luxury Real Estate in New Cairo, <br/>Powered by Disciplined Intelligence.
        </motion.p>
        
        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-6 font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <button className="px-8 py-4 bg-transparent border border-[#C9A24D] text-[#C9A24D] text-sm uppercase tracking-[0.2em] font-bold hover:bg-[#C9A24D] hover:text-black transition-all duration-500 rounded-sm">
            Explore Listings
          </button>
          
          <button className="px-8 py-4 bg-white text-black text-sm uppercase tracking-[0.2em] font-bold hover:bg-transparent hover:text-white hover:border-white border border-transparent transition-all duration-500 rounded-sm relative overflow-hidden group">
            <span className="relative z-10 w-full h-full flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0B1A3E] group-hover:bg-white transition-colors" />
              Contact an Advisor
            </span>
          </button>
        </motion.div>

      </motion.div>
      
      {/* 4. Mouse Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#C9A24D] to-transparent animate-pulse" />
      </motion.div>
    </div>
  );
}
