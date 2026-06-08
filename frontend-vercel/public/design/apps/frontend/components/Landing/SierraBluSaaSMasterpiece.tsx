'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { fetchPropertiesFromDB, Property } from '@/lib/services/fetchProperties';

const SERVICES = [
  { title: "Personalized Luxury", desc: "Tailored guidance with market expertise and negotiation excellence.", icon: "👤" },
  { title: "AI-Driven Market Analysis", desc: "Real-time data and predictive insights for smarter decisions.", icon: "🧠" },
  { title: "Exclusive Property Listings", desc: "Handpicked residential and investment opportunities.", icon: "🛡️" },
  { title: "Intelligent Investment", desc: "Data-backed strategies for long-term growth.", icon: "📈" }
];

export default function SierraBluSaaSMasterpiece() {
  const [filterType, setFilterType] = useState<'Rent' | 'Resale'>('Rent');
  const [filterRooms, setFilterRooms] = useState<string>('Any');
  const [filterCompound, setFilterCompound] = useState<string>('');
  const [isCompoundOpen, setIsCompoundOpen] = useState(true); // User requested compound to be open
  const [isDarkMode, setIsDarkMode] = useState(true); // User requested dark default

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Parallax & Mouse Movement
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

  // Load properties based on Type filter
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchPropertiesFromDB(filterType);
      setProperties(data);
      setLoading(false);
    }
    loadData();
  }, [filterType]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Theme configuration
  const theme = {
    bg: isDarkMode ? 'bg-[#040D1A]' : 'bg-[#F4F0E8]',
    text: isDarkMode ? 'text-white' : 'text-[#0B2341]',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    navBg: isDarkMode ? 'bg-[#040D1A]/80' : 'bg-[#F4F0E8]/80',
    border: isDarkMode ? 'border-white/10' : 'border-[#0B2341]/10',
    cardBg: isDarkMode ? 'bg-[#0A1628]' : 'bg-white',
    cardHover: isDarkMode ? 'hover:bg-[#0D1E36]' : 'hover:bg-gray-50',
    accent: isDarkMode ? 'text-[#1E88D9]' : 'text-[#1565C0]',
    goldText: isDarkMode ? 'text-[#D4AF37]' : 'text-[#8A6600]', // Fixed light mode gold visibility
    goldBg: isDarkMode ? 'bg-[#D4AF37]' : 'bg-[#8A6600]',
    btnBg: isDarkMode ? 'bg-[#1E88D9] text-white hover:bg-[#3498db]' : 'bg-[#0B2341] text-white hover:bg-[#1E88D9]',
    btnOutline: isDarkMode ? 'border border-white/20 hover:bg-white/5' : 'border border-[#0B2341]/20 hover:bg-[#0B2341]/5',
    inputBg: isDarkMode ? 'bg-[#112240] text-white' : 'bg-gray-100 text-[#0B2341]'
  };

  const filteredProperties = properties.filter(p => {
    const matchCompound = filterCompound ? p.compound.toLowerCase().includes(filterCompound.toLowerCase()) : true;
    const matchRooms = filterRooms !== 'Any' ? p.specs?.includes(`${filterRooms} Bed`) : true; // naive check based on specs
    return matchCompound && matchRooms;
  });

  return (
    <main className={`min-h-screen ${theme.bg} ${theme.text} font-sans antialiased overflow-x-hidden transition-colors duration-500`}>
      
      {/* 1. NAVBAR */}
      <nav className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-5 md:px-12 ${theme.navBg} backdrop-blur-xl border-b ${theme.border} transition-all`}>
        <Link href="/" className={`font-serif text-2xl font-bold tracking-tight outline-none ${theme.text}`}>
          Sierra Estates
        </Link>
        
        <div className="hidden lg:flex items-center gap-2.5 px-4 py-1.5 bg-white/10 border border-white/10 rounded-full shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className={`text-[10px] uppercase tracking-widest font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Sierra OS v12.1 · Live Indexing
          </span>
        </div>

        <div className="hidden md:flex gap-8 items-center text-sm font-medium">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="hover:opacity-70 transition-opacity">
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <a href="#properties" className={`hover:${theme.accent} transition-colors outline-none`}>Properties</a>
          <a href="#services" className={`hover:${theme.accent} transition-colors outline-none`}>Services</a>
          <button className={`px-5 py-2.5 rounded-full font-medium shadow-sm ${theme.btnBg} transition-all`}>
            Launch Console
          </button>
        </div>
      </nav>

      {/* 2. SPATIAL HERO */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-screen w-full flex items-center justify-center pt-24 px-6 md:px-12 max-w-[1500px] mx-auto overflow-hidden z-10"
      >
        <div className="w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div style={{ y: yText, opacity: opacityText }} className="w-full lg:w-[55%] flex flex-col justify-center">
            <div className={`inline-flex items-center gap-2 px-3 py-1 ${theme.cardBg} border ${theme.border} rounded-full w-max mb-6 shadow-sm`}>
              <span className="text-xs">⚡</span>
              <span className={`text-[10px] uppercase tracking-widest font-bold ${theme.goldText}`}>The Next Architecture</span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-6xl lg:text-[4.5rem] xl:text-[5.2rem] leading-[1.08] tracking-tight font-semibold mb-8">
              The first Real Estate SaaS program specialized in <span className={`${theme.accent} italic font-normal`}>Rent & Re-sale</span> in New Cairo.
            </h1>
            
            <p className={`text-lg md:text-xl font-light max-w-xl mb-10 leading-relaxed ${theme.textSecondary}`}>
              Unlock market best opportunities with AI-powered real estate intelligence. Experience clean institutional data with programmatic spatial tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#properties" className={`px-8 py-4 ${theme.btnBg} text-center transition-all rounded-full font-medium tracking-wide shadow-md outline-none`}>
                Scan Live Inventory
              </a>
              <a href="#services" className={`px-8 py-4 ${theme.btnOutline} text-center transition-all rounded-full font-medium shadow-sm outline-none`}>
                System Capabilities
              </a>
            </div>
          </motion.div>

          <div className="w-full lg:w-[45%] h-[500px] lg:h-[680px] perspective-[1200px]">
            <motion.div style={{ rotateX, rotateY }} className={`relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border ${theme.border} transition-all duration-200 ease-out`}>
              <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop" alt="Sierra Estates Live SaaS Engine Asset" fill className="object-cover scale-102 transition-transform duration-500" priority />
              <div className={`absolute bottom-6 left-6 right-6 p-6 ${isDarkMode ? 'bg-black/60 border-white/20' : 'bg-white/70 border-white/50'} backdrop-blur-xl rounded-2xl border shadow-xl flex items-center justify-between`}>
                <div>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${theme.textSecondary} block mb-0.5`}>Current Focus Area</span>
                  <span className={`font-serif text-lg font-bold ${theme.text}`}>Golden Square, New Cairo</span>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${theme.textSecondary} block mb-0.5`}>AI Matching Accuracy</span>
                  <span className={`text-sm font-bold ${theme.accent} bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20`}>98.4%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES */}
      <section id="services" className={`py-28 px-6 md:px-12 border-y ${theme.border}`}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-20 text-center lg:text-left">
            <span className={`${theme.goldText} uppercase tracking-widest text-xs font-bold px-3 py-1 ${isDarkMode ? 'bg-[#112240]' : 'bg-[#F4F0E8]'} rounded-full`}>Core Engineering</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-4 tracking-tight font-medium">Algorithmic Real Estate Architecture</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((srv, i) => (
              <motion.div key={srv.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`${theme.cardBg} p-8 rounded-3xl border ${theme.border} flex flex-col justify-between h-full ${theme.cardHover} transition-all duration-300`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${isDarkMode ? 'bg-[#112240]' : 'bg-white'} border ${theme.border} flex items-center justify-center text-xl mb-6 shadow-sm`}>{srv.icon}</div>
                  <h3 className="font-serif text-xl font-semibold mb-3">{srv.title}</h3>
                  <p className={`${theme.textSecondary} text-sm leading-relaxed font-light`}>{srv.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VERIFIED OPPORTUNITIES & FILTER */}
      <section id="properties" className="py-28 px-6 md:px-12 max-w-[1400px] mx-auto">
        
        {/* COMPREHENSIVE FILTER ENGINE */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight mb-4 font-medium">Curated Asset Streams</h2>
              <p className={`${theme.textSecondary} font-light`}>Filter our live inventory with AI-powered precision.</p>
            </div>
            
            {/* Primary Type Toggle */}
            <div className={`flex p-1.5 rounded-full border ${theme.border} ${isDarkMode ? 'bg-[#112240]' : 'bg-gray-100'}`}>
              {(['Rent', 'Resale'] as const).map(type => (
                <button key={type} onClick={() => setFilterType(type)}
                  className={`py-2 px-6 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${filterType === type ? (isDarkMode ? 'bg-white text-[#0B2341]' : 'bg-[#0B2341] text-white') : `${theme.textSecondary} hover:${theme.text}`}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filter Panel */}
          <div className={`p-6 rounded-3xl border ${theme.border} ${theme.cardBg} shadow-lg`}>
            <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={() => setIsCompoundOpen(!isCompoundOpen)}>
              <h4 className={`text-sm font-bold tracking-widest uppercase ${theme.goldText}`}>Deep Filter Engine</h4>
              <span className="text-sm">{isCompoundOpen ? '▲' : '▼'}</span>
            </div>
            
            <AnimatePresence>
              {isCompoundOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 border-t border-white/5">
                    
                    {/* Compound Filter */}
                    <div className="flex flex-col gap-2">
                      <label className={`text-xs font-bold uppercase tracking-wider ${theme.textSecondary}`}>Compound Name</label>
                      <input type="text" placeholder="e.g. Mivida, Palm Hills..." value={filterCompound} onChange={(e) => setFilterCompound(e.target.value)}
                        className={`w-full p-3 rounded-xl border ${theme.border} ${theme.inputBg} focus:outline-none focus:ring-2 focus:ring-[#1E88D9]/50 transition-all`}
                      />
                    </div>

                    {/* Rooms Filter */}
                    <div className="flex flex-col gap-2">
                      <label className={`text-xs font-bold uppercase tracking-wider ${theme.textSecondary}`}>Bedrooms</label>
                      <div className={`flex p-1 rounded-xl border ${theme.border} ${theme.inputBg}`}>
                        {['Any', '1', '2', '3', '4'].map(r => (
                          <button key={r} onClick={() => setFilterRooms(r)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${filterRooms === r ? (isDarkMode ? 'bg-white text-black' : 'bg-gray-300 text-black') : 'hover:bg-white/5'}`}
                          >
                            {r === '4' ? '4+' : r}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RESULTS GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className={`w-6 h-6 border-2 ${theme.border} border-t-transparent rounded-full animate-spin`} style={{ borderTopColor: isDarkMode ? 'white' : '#0B2341' }} />
            <span className={`text-[10px] uppercase tracking-widest font-bold ${theme.textSecondary}`}>Syncing with Firestore...</span>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <AnimatePresence mode="popLayout">
              {filteredProperties.length === 0 && (
                <div className={`col-span-1 lg:col-span-2 text-center py-24 ${theme.textSecondary}`}>
                  <p>No properties match your exact filter criteria.</p>
                  <button onClick={() => { setFilterCompound(''); setFilterRooms('Any'); }} className={`mt-4 px-4 py-2 text-sm font-medium border ${theme.border} rounded-full`}>Clear Filters</button>
                </div>
              )}
              {filteredProperties.map((prop) => (
                <motion.article 
                  key={prop.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}
                  className={`group ${theme.cardBg} rounded-[2.5rem] overflow-hidden border ${theme.border} shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col`}
                >
                  <div className="relative w-full h-[360px] overflow-hidden bg-gray-800">
                    <Image src={prop.imageUrl || prop.image || ''} alt={prop.compound} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-102" />
                    <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider shadow-sm text-[#0B2341]">
                      {prop.sbrCode}
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-serif text-3xl font-semibold tracking-tight">{prop.price}</h3>
                        <span className={`${theme.textSecondary} text-sm font-light tracking-wide`}>{prop.compound}, New Cairo</span>
                      </div>
                      
                      <div className={`flex items-center gap-2.5 mb-8 ${isDarkMode ? 'bg-[#112240]' : 'bg-[#F4F0E8]/40'} p-4 rounded-2xl border ${theme.border}`}>
                        <span className="text-base">🧠</span>
                        <p className={`text-xs font-bold tracking-wide ${theme.text}`}>
                          AI Assessment: <span className={`font-light ${theme.textSecondary}`}>{prop.specs}</span>
                        </p>
                      </div>
                    </div>
                    
                    <button className={`w-full py-4 ${theme.btnBg} rounded-xl transition-all duration-300 font-medium tracking-wide`}>
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
      <footer className={`${theme.cardBg} py-16 px-6 md:px-12 text-center border-t ${theme.border} z-10 relative`}>
        <h2 className="font-serif text-3xl font-bold tracking-tight">Sierra Estates</h2>
        <p className={`${theme.textSecondary} text-xs tracking-[0.25em] uppercase mt-2 mb-8 font-semibold`}>Beyond Brokerage · PropTech OS</p>
        <p className={`${theme.textSecondary} text-xs font-light tracking-wide`}>&copy; 2026 Sierra Estates Realty OS. All architectural data systems reserved.</p>
      </footer>

    </main>
  );
}
