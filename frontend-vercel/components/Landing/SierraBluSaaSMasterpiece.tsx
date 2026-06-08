'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { fetchPropertiesFromDB, Property } from '@/lib/firebase';

const SERVICES = [
  { title: "Personalized Luxury", desc: "Tailored guidance with market expertise and negotiation excellence.", icon: "👤" },
  { title: "AI-Driven Market Analysis", desc: "Real-time data and predictive insights for smarter decisions.", icon: "🧠" },
  { title: "Exclusive Property Listings", desc: "Handpicked residential and investment opportunities.", icon: "🛡️" },
  { title: "Intelligent Investment", desc: "Data-backed strategies for long-term growth.", icon: "📈" }
];

export default function SierraBluSaaSMasterpiece() {
  const [filter, setFilter] = useState<'Rent' | 'Resale'>('Rent');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Immersive Parallax & Mouse Movement Trackers (Peachworlds / AirCenter Style)
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const rotateX = useTransform(springY, [-300, 300], [6, -6]);
  const rotateY = useTransform(springX, [-300, 300], [-6, 6]);

  const { scrollYProgress } = useScroll();
  const yText = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const opacityText = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Sync with Firestore Engine
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchPropertiesFromDB(filter);
      setProperties(data);
      setLoading(false);
    }
    loadData();
  }, [filter]);

  // Handle Mouse Move for Spatial Vector Animation
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <main className="min-h-screen bg-[#F4F0E8] text-[#0B2341] font-sans antialiased overflow-x-hidden selection:bg-[#0B2341] selection:text-white">
      
      {/* 1. FIXED GLASS NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-5 md:px-12 bg-[#F4F0E8]/80 backdrop-blur-xl border-b border-[#0B2341]/5 transition-all">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#0B2341] outline-none">
          Sierra Estates
        </Link>
        
        {/* Floating SaaS Status Bar (AirCenter Style) */}
        <div className="hidden lg:flex items-center gap-2.5 px-4 py-1.5 bg-white/60 border border-gray-200/50 rounded-full shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
            Sierra OS v12.0 · Live Indexing Active
          </span>
        </div>

        <div className="hidden md:flex gap-10 items-center text-sm font-medium">
          <a href="#properties" className="hover:text-[#1E88D9] transition-colors outline-none">Properties</a>
          <a href="#services" className="hover:text-[#1E88D9] transition-colors outline-none">Services</a>
          <button className="px-5 py-2.5 bg-[#0B2341] text-white hover:bg-[#1E88D9] transition-all rounded-full font-medium shadow-sm">
            Launch Console
          </button>
        </div>
      </nav>

      {/* 2. SPATIAL HERO VIEWPORT (Integrated from Peachworlds, AirCenter & Tref) */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-screen w-full flex items-center justify-center pt-24 px-6 md:px-12 max-w-[1500px] mx-auto overflow-hidden z-10"
      >
        <div className="w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Text Column with Absolute Alignment */}
          <motion.div 
            style={{ y: yText, opacity: opacityText }}
            className="w-full lg:w-[55%] flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200/60 rounded-full w-max mb-6 shadow-sm">
              <span className="text-xs">⚡</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C9A24D]">The Next Architecture</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl lg:text-[4.5rem] xl:text-[5.2rem] leading-[1.08] tracking-tight text-[#0B2341] font-semibold mb-8">
              The first Real Estate SaaS program specialized in <span className="text-[#1E88D9] italic font-normal">Rent & Re-sale</span> in New Cairo.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-500 font-light max-w-xl mb-10 leading-relaxed">
              Unlock market best opportunities with AI-powered real estate intelligence. Experience clean institutional data with programmatic spatial tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#properties" className="px-8 py-4 bg-[#0B2341] text-white hover:bg-[#1E88D9] text-center transition-all rounded-full font-medium tracking-wide shadow-md outline-none">
                Scan Live Inventory
              </a>
              <a href="#services" className="px-8 py-4 bg-white/80 border border-gray-200 text-[#0B2341] text-center hover:bg-gray-50 transition-all rounded-full font-medium shadow-sm outline-none">
                System Capabilities
              </a>
            </div>
          </motion.div>

          {/* Right Fluid Asset Column (Peachworlds Interactive Spatial Perspective) */}
          <div className="w-full lg:w-[45%] h-[500px] lg:h-[680px] perspective-[1200px]">
            <motion.div 
              style={{ rotateX, rotateY }}
              className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/40 bg-white transition-all duration-200 ease-out"
            >
              <Image 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop" 
                alt="Sierra Estates Live SaaS Engine Asset" 
                fill 
                className="object-cover scale-102 transition-transform duration-500"
                priority
              />
              
              {/* Overlay Glass Dashboard Widget (AirCenter Reference) */}
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-0.5">Current Focus Area</span>
                  <span className="font-serif text-lg font-bold text-[#0B2341]">Golden Square, New Cairo</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-0.5">AI Matching Accuracy</span>
                  <span className="text-sm font-bold text-[#1E88D9] bg-[#1E88D9]/10 px-2.5 py-1 rounded-md border border-[#1E88D9]/20">98.4%</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 3. CAPABILITIES GRID */}
      <section id="services" className="py-28 px-6 md:px-12 bg-white border-y border-gray-200/50">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-20 text-center lg:text-left">
            <span className="text-[#C9A24D] uppercase tracking-widest text-xs font-bold px-3 py-1 bg-[#F4F0E8] rounded-full">Core Engineering</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#0B2341] mt-4 tracking-tight font-medium">Algorithmic Real Estate Architecture</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((srv, i) => (
              <motion.div 
                key={srv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#F4F0E8]/40 p-8 rounded-3xl border border-gray-100 flex flex-col justify-between h-full hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/60 flex items-center justify-center text-xl mb-6 shadow-sm">{srv.icon}</div>
                  <h3 className="font-serif text-xl font-semibold text-[#0B2341] mb-3">{srv.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">{srv.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VERIFIED OPPORTUNITIES (Dynamic Firestore Grid with Canvas Design) */}
      <section id="properties" className="py-28 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-[#0B2341] tracking-tight mb-8 font-medium">Curated Asset Streams</h2>
          
          {/* Custom Capsule Toggle Pill */}
          <div className="flex p-1.5 bg-gray-100/80 backdrop-blur-md rounded-full w-full max-w-sm border border-gray-200/60">
            <button 
              onClick={() => setFilter('Rent')}
              className={`flex-1 py-3 px-6 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${filter === 'Rent' ? 'bg-[#0B2341] text-white shadow-md' : 'text-gray-400 hover:text-[#0B2341]'}`}
            >
              Rent
            </button>
            <button 
              onClick={() => setFilter('Resale')}
              className={`flex-1 py-3 px-6 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${filter === 'Resale' ? 'bg-[#0B2341] text-white shadow-md' : 'text-gray-400 hover:text-[#0B2341]'}`}
            >
              Resale
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-6 h-6 border-2 border-[#0B2341] border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Syncing with Firestore Data Core...</span>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatePresence mode="popLayout">
              {properties.map((prop) => (
                <motion.article 
                  key={prop.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-200/50 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
                >
                  <div className="relative w-full h-[360px] overflow-hidden bg-gray-100">
                    <Image src={prop.imageUrl || prop.image} alt={prop.compound} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-102" />
                    <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider shadow-sm text-[#0B2341]">
                      {prop.sbrCode}
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-serif text-3xl font-semibold tracking-tight text-[#0B2341]">{prop.price}</h3>
                        <span className="text-gray-400 text-sm font-light tracking-wide">{prop.compound}, New Cairo</span>
                      </div>
                      
                      <div className="flex items-center gap-2.5 mb-8 bg-[#F4F0E8]/40 p-4 rounded-2xl border border-gray-100">
                        <span className="text-base">🧠</span>
                        <p className="text-xs text-[#0B2341] font-bold tracking-wide">
                          AI Assessment: <span className="font-light text-gray-500">{prop.specs}</span>
                        </p>
                      </div>
                    </div>
                    
                    <button className="w-full py-4 bg-[#0B2341] text-white hover:bg-[#1E88D9] rounded-xl transition-all duration-300 font-medium tracking-wide">
                      View Digital Asset
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* 5. EDITORIAL FOOTER */}
      <footer className="bg-white py-16 px-6 md:px-12 text-center border-t border-gray-100 z-10 relative">
        <h2 className="font-serif text-3xl text-[#0B2341] font-bold tracking-tight">Sierra Estates</h2>
        <p className="text-gray-400 text-xs tracking-[0.25em] uppercase mt-2 mb-8 font-semibold">Beyond Brokerage · PropTech OS</p>
        <p className="text-gray-400 text-xs font-light tracking-wide">&copy; 2026 Sierra Estates Realty OS. All architectural data systems reserved.</p>
      </footer>

    </main>
  );
}
