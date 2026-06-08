"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { fetchProperties, fetchPropertiesFromDB, Property } from '@/lib/firebase';
import { 
  Building2, MapPin, DollarSign, Search, MessageSquare, 
  Layers, Users, Sliders, TrendingUp, Compass, Maximize, 
  Sparkles, CheckCircle2, ChevronRight, UserCheck, ShieldAlert, X
} from 'lucide-react';

const SERVICES = [
  { title: "Personalized Luxury", desc: "Tailored guidance with market expertise and negotiation excellence.", icon: "👤" },
  { title: "AI-Driven Market Analysis", desc: "Real-time data and predictive insights for smarter decisions.", icon: "🧠" },
  { title: "Exclusive Property Listings", desc: "Handpicked residential and investment opportunities.", icon: "🛡️" },
  { title: "Intelligent Investment", desc: "Data-backed strategies for long-term growth.", icon: "📈" }
];

export default function SierraBluSaaSMasterpiece() {
  const [filter, setFilter] = useState<'Rent' | 'Resale'>('Rent');
  const [paymentFilter, setPaymentFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [currency, setCurrency] = useState<'EGP' | 'USD'>('EGP'); 
  const [activeMapLayer, setActiveMapLayer] = useState<string>('standard');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Firestore Data Source
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Laila Lebanese Concierge Drawer States
  const [isLailaOpen, setIsLailaOpen] = useState<boolean>(false);
  const [lailaChat, setLailaChat] = useState<Array<{ sender: 'laila' | 'user'; text: string }>>([
    { sender: 'laila', text: 'يا مية أهلاً وسهلاً بك بنظام سييرا إستيتس الفاخر.. معك ليلى، كيف بقدر أخدمك اليوم بخصوص عقارات القاهرة الجديدة؟' }
  ]);
  const [userChatInput, setUserChatInput] = useState<string>('');

  // CRM Pipeline State (Admin Mode)
  const [pipelineLeads, setPipelineLeads] = useState([
    { id: 'L1', name: 'عمر التميمي', stage: 'S1: Intake', budget: '$2,000/mo', target: 'Mivida' },
    { id: 'L2', name: 'سارة فريد', stage: 'S3: Requirements', budget: '20M EGP', target: 'Villette' },
    { id: 'L3', name: 'Karim Hegazi', stage: 'S5: Proposal Sent', budget: '$4,000/mo', target: 'Lake View' },
  ]);

  // Admin Search Parser States
  const [adminBotQuery, setAdminBotQuery] = useState<string>('');
  const [adminBotReply, setAdminBotReply] = useState<Property[] | null>(null);

  // Tref / Peachworlds Mouse Movement Interaction Engines
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 50, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 15 });

  const rotateX = useTransform(springY, [-400, 400], [8, -8]);
  const rotateY = useTransform(springX, [-400, 400], [-8, 8]);

  const { scrollYProgress } = useScroll();
  const yText = useTransform(scrollYProgress, [0, 0.4], [0, 80]);
  const opacityText = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // Load Firestore properties on startup & dynamically sync
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchProperties();
      setProperties(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter pipeline handling for Curated Inventory
  const filteredCatalog = useMemo(() => {
    const filterUpper = filter.toUpperCase();
    return properties.filter(prop => {
      const matchesPurpose = prop.purpose === filterUpper;
      const matchesPayment = paymentFilter === 'All' || prop.paymentType === paymentFilter;
      const matchesSearch = prop.title.toLowerCase().includes(search.toLowerCase()) || 
                            prop.location.toLowerCase().includes(search.toLowerCase()) ||
                            prop.compound_name.toLowerCase().includes(search.toLowerCase()) ||
                            prop.unit_code.toLowerCase().includes(search.toLowerCase());
      return matchesPurpose && matchesPayment && matchesSearch;
    });
  }, [properties, filter, paymentFilter, search]);

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

  // Dynamic price conversion helper
  const formatPrice = (property: Property) => {
    const isRent = property.purpose === 'RENT';
    const amount = currency === 'EGP' ? property.price : (property.priceUSD || Math.round(property.price / 48));
    return `${currency} ${amount.toLocaleString()}${isRent ? ' / mo' : ''}`;
  };

  // Levant Concierge chat mechanism
  const handleLailaMessage = () => {
    if (!userChatInput.trim()) return;
    const userText = userChatInput;
    setLailaChat(prev => [...prev, { sender: 'user', text: userText }]);
    setUserChatInput('');

    setTimeout(() => {
      let reply = 'تكرم عينك، عم سجل هيدي البيانات عندي وسيقوم مساعد المدير بالتواصل معك فوراً لتنسيق جولة تفقدية بـ Sierra Estates.';
      if (userText.toLowerCase().includes('سعر') || userText.includes('ميزانية') || userText.includes('بكم') || userText.includes('فلوس')) {
        reply = 'من عيوني.. بالنسبة للأسعار، فيك تبدل العملة لـ USD أو EGP مباشرة من أعلى الصفحة وتشوف الميزانية الأنسب لك على الكتالوج والخريطة التفاعلية.';
      } else if (userText.includes('ميفيدا') || userText.includes('mivida')) {
        reply = 'ميفيدا اختيار بياخد العقل بـ التجمع الخامس! عندنا وحدات لقطة هنيك حالياً بخطط سداد مرنة (قسط على ٧ سنين ومقدم ١٠٪)، وفيك تطلع عليها فوراً بالكتالوج.';
      } else if (userText.includes('قسط') || userText.includes('installment') || userText.includes('دفع')) {
        reply = 'أكيد يا غالي، فيك تفلتر الكتالوج مباشرة حسب طرق الدفع كاش أو أقساط مريحة لتختار الأنسب لاستثمارك.';
      }
      setLailaChat(prev => [...prev, { sender: 'laila', text: reply }]);
    }, 1000);
  };

  // Admin Query Parser
  const handleAdminBotSearch = () => {
    if (!adminBotQuery) return;
    const query = adminBotQuery.toLowerCase();
    
    const matches = properties.filter(item => {
      const matchCompound = query.includes(item.compound_name.toLowerCase()) || 
                            (query.includes('ميفيدا') && item.compound_name === 'Mivida') || 
                            (query.includes('ايستاون') && item.compound_name === 'Eastown') ||
                            (query.includes('مدينتي') && item.compound_name === 'Madinaty') ||
                            (query.includes('فيليت') && item.compound_name === 'Villette');
      
      const matchHighValue = query.includes('لقطة') || query.includes('عائد') || query.includes('ممتاز') ? item.valueTag === 'High Value' : true;
      return matchCompound && matchHighValue;
    });
    
    setAdminBotReply(matches.length > 0 ? matches : []);
  };

  return (
    <main className="min-h-screen bg-[#F4F0E8] text-[#0B2341] font-sans antialiased overflow-x-hidden selection:bg-[#0B2341] selection:text-white">
      
      {/* 1. FIXED GLASS NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-5 md:px-12 bg-[#F4F0E8]/90 backdrop-blur-xl border-b border-[#0B2341]/5 transition-all">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-serif text-2xl font-black tracking-tight text-[#0B2341] outline-none">
            Sierra Estates
          </Link>
          <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-[#C9A24D] border border-[#C9A24D]/30 px-2 py-0.5 rounded font-bold font-mono">
            Beyond Brokerage
          </span>
        </div>
        
        {/* Floating SaaS Status Bar (AirCenter Style) */}
        <div className="hidden lg:flex items-center gap-2.5 px-4 py-1.5 bg-white/70 border border-gray-200/40 rounded-full shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
            Sierra OS v12.0 · Live Database Sync Active
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium">
          
          {/* EGP/USD Toggle */}
          <div className="bg-white/60 p-1 rounded-xl flex items-center border border-gray-200/50 shadow-sm">
            <button 
              onClick={() => setCurrency('EGP')} 
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${currency === 'EGP' ? 'bg-[#0B2341] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              EGP
            </button>
            <button 
              onClick={() => setCurrency('USD')} 
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${currency === 'USD' ? 'bg-[#0B2341] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              USD
            </button>
          </div>

          <div className="h-6 w-[1px] bg-gray-300"></div>

          {/* OS Switcher Client vs Admin */}
          <div className="flex space-x-1 bg-white/60 p-1 rounded-xl border border-gray-200/50">
            <button 
              onClick={() => setIsAdmin(false)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${!isAdmin ? 'bg-[#1E88D9] text-white shadow-sm' : 'text-gray-500 hover:text-[#0B2341]'}`}
            >
              Client UI
            </button>
            <button 
              onClick={() => setIsAdmin(true)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center space-x-1 transition-all ${isAdmin ? 'bg-[#0B2341] text-white shadow-sm' : 'text-gray-500 hover:text-[#0B2341]'}`}
            >
              <Layers className="w-3 h-3" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ============================================================================
          GATE ROUTER: CLIENT PRE-PARALLAX GRAPH vs DOCK SYSTEM
         ============================================================================ */}
      {!isAdmin ? (
        <>
          {/* 2. TREF-INSPIRED IMMERSIVE SPATIAL HERO SECTION */}
          <section 
            ref={heroRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-[95dvh] w-full flex items-center justify-center pt-28 pb-12 px-6 md:px-12 max-w-[1500px] mx-auto overflow-hidden z-10"
          >
            {/* Background Parallax Floating Branding Mark (Merged with 'S' Typology) */}
            <motion.div style={{ y: yText }} className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none z-0">
              <span className="font-serif text-[48rem] font-bold text-[#0B2341]">S</span>
            </motion.div>

            <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
              
              {/* Left Column with dynamic absolute alignments */}
              <motion.div 
                style={{ y: yText, opacity: opacityText }}
                className="w-full lg:w-[56%] flex flex-col justify-center text-left z-10"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200/50 rounded-full w-max mb-6 shadow-sm">
                  <span className="text-xs">⚡</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#C9A24D]">PropTech Innovation 2026</span>
                </div>
                
                <h1 className="font-serif text-4xl md:text-6xl lg:text-[4.6rem] xl:text-[5.4rem] leading-[1.06] tracking-tight text-[#0B2341] font-bold mb-8">
                  The first Real Estate <span className="text-[#1E88D9] font-normal italic">SaaS program</span> specialized in <span className="font-extrabold text-[#0B2341]">Rent & Re-sale</span> in New Cairo.
                </h1>
                
                <p className="text-lg md:text-xl text-gray-500 font-light max-w-xl mb-10 leading-relaxed">
                  Unlock market-best opportunities in Golden Square with AI-powered intelligence. Experience pure asset optimization driven by institutional datasets.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#properties" className="px-8 py-4 bg-[#0B2341] text-white hover:bg-[#1E88D9] text-center transition-all rounded-full font-medium tracking-wide shadow-md focus:outline-none focus:ring-2 focus:ring-[#1E88D9] focus:ring-offset-2">
                    Scan Live Inventory
                  </a>
                  <a href="#services" className="px-8 py-4 bg-white/80 border border-gray-200 text-[#0B2341] text-center hover:bg-gray-50 transition-all rounded-full font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200">
                    System Capabilities
                  </a>
                </div>
              </motion.div>

              {/* Right Column with Peachworld Spatial Perspective Widget */}
              <div className="w-full lg:w-[44%] h-[480px] lg:h-[660px] perspective-[1500px] z-10">
                <motion.div 
                  style={{ rotateX, rotateY }}
                  className="relative w-full h-full rounded-[2.8rem] overflow-hidden shadow-2xl border border-white/60 bg-white transition-all duration-300 ease-out"
                >
                  <Image 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop" 
                    alt="Sierra Estates Analytical Core Visualization Asset" 
                    fill 
                    className="object-cover scale-102 transition-transform duration-700 select-none pointer-events-none"
                    priority
                  />
                  
                  {/* Overlay Glass Dashboard Widget (AirCenter Reference) */}
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/75 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl flex items-center justify-between z-20">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 block mb-0.5">SaaS Core Vector Focus</span>
                      <span className="font-serif text-base font-bold text-[#0B2341]">Fifth Settlement Assets</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 block mb-0.5">Neural Match Accuracy</span>
                      <span className="text-xs font-bold text-[#1E88D9] bg-[#1E88D9]/10 px-2.5 py-1 rounded-md border border-[#1E88D9]/20 font-mono">98.4%</span>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </section>

          {/* 3. CAPABILITIES GRID */}
          <section id="services" className="py-28 px-6 md:px-12 bg-white border-y border-gray-200/40">
            <div className="max-w-[1400px] mx-auto">
              <div className="mb-20 text-center lg:text-left">
                <span className="text-[#C9A24D] uppercase tracking-widest text-xs font-bold px-3 py-1 bg-[#F4F0E8] rounded-full">System Engine</span>
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
                    className="bg-[#F4F0E8]/30 p-8 rounded-3xl border border-gray-100 flex flex-col justify-between h-full hover:bg-white hover:shadow-xl transition-all duration-300"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/50 flex items-center justify-center text-xl mb-6 shadow-sm">{srv.icon}</div>
                      <h3 className="font-serif text-xl font-semibold text-[#0B2341] mb-3">{srv.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed font-light">{srv.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. VERIFIED OPPORTUNITIES (Dynamic Split List & Live Map Viewport) */}
          <section id="properties" className="py-28 px-6 md:px-12 bg-[#F4F0E8] relative z-10">
            <div className="max-w-[1400px] mx-auto space-y-12">
              
              <div className="flex flex-col items-center text-center space-y-6">
                <h2 className="font-serif text-4xl md:text-5xl text-[#0B2341] tracking-tight font-medium">Curated Asset Streams</h2>
                
                {/* Advanced Search & Payment Filtering Controls */}
                <div className="w-full max-w-4xl bg-white p-4 rounded-3xl border border-gray-200/60 shadow-xl flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 w-full relative">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#1E88D9]" />
                    <input 
                      type="text" 
                      placeholder="Search compound districts (e.g. Mivida, Eastown, Villette)..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-semibold outline-none focus:bg-white focus:border-[#1E88D9] transition-all text-[#0B2341]"
                    />
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    {/* Payment structure dropdown filter */}
                    <select 
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-bold uppercase tracking-wider outline-none cursor-pointer text-gray-500 hover:text-[#0B2341] focus:bg-white focus:border-[#1E88D9] transition"
                    >
                      <option value="All">All Payment Types</option>
                      <option value="CASH">Cash Settlement</option>
                      <option value="INSTALLMENTS">Installment Options</option>
                    </select>

                    {/* Capsule toggle pill for Rent vs Resale */}
                    <div className="flex p-1 bg-gray-100 rounded-2xl border border-gray-200/60 shrink-0">
                      <button 
                        onClick={() => setFilter('Rent')}
                        className={`py-2 px-5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all ${filter === 'Rent' ? 'bg-[#0B2341] text-white shadow-md' : 'text-gray-400 hover:text-[#0B2341]'}`}
                      >
                        Rent
                      </button>
                      <button 
                        onClick={() => setFilter('Resale')}
                        className={`py-2 px-5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all ${filter === 'Resale' ? 'bg-[#0B2341] text-white shadow-md' : 'text-gray-400 hover:text-[#0B2341]'}`}
                      >
                        Resale
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-6 h-6 border-2 border-[#0B2341] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Syncing with Firestore Data Core...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* LEFT STREAM: ACTIVE PROPERTY LIST */}
                  <div className="lg:col-span-7 space-y-8 max-h-[85vh] overflow-y-auto pr-4 scrollbar-thin">
                    <AnimatePresence mode="popLayout">
                      {filteredCatalog.map((prop) => (
                        <motion.article 
                          key={prop.id}
                          layout
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          onClick={() => setSelectedPropertyId(prop.id)}
                          className={`group bg-white rounded-[2rem] overflow-hidden border transition-all duration-500 cursor-pointer flex flex-col md:flex-row ${
                            selectedPropertyId === prop.id 
                              ? 'border-[#1E88D9] shadow-xl ring-2 ring-[#1E88D9]/10' 
                              : 'border-gray-200/50 shadow-sm hover:shadow-xl hover:border-[#1E88D9]/30'
                          }`}
                        >
                          <div className="relative w-full md:w-[40%] h-[240px] md:h-auto overflow-hidden bg-gray-100 min-h-[220px]">
                            <Image 
                              src={prop.img_url || prop.img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500"} 
                              alt={prop.compound_name} 
                              fill 
                              sizes="(max-width: 768px) 100vw, 30vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                            />
                            
                            <div className="absolute top-4 left-4 flex flex-col gap-1 items-start z-10">
                              <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wider shadow-sm text-[#0B2341] font-mono">
                                {prop.unit_code}
                              </span>
                              {prop.paymentDetails && (
                                <span className="bg-[#0B2341] text-white px-2 py-0.5 rounded text-[8px] font-bold tracking-wide">
                                  {prop.paymentDetails}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-6 md:p-8 flex flex-col justify-between flex-1 space-y-6">
                            <div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-serif text-2xl font-bold tracking-tight text-[#0B2341] mb-1">
                                    {formatPrice(prop)}
                                  </h3>
                                  <p className="text-xs font-bold text-[#1E88D9] mb-3">
                                    {prop.compound_name}, New Cairo
                                  </p>
                                </div>
                                
                                {prop.aiScore && (
                                  <div className="bg-[#0B2341]/5 px-2.5 py-1.5 rounded-xl border border-[#0B2341]/10 text-right shrink-0">
                                    <span className="text-[9px] font-bold text-gray-400 block uppercase">ROI INDEX</span>
                                    <span className="text-xs font-black text-[#1E88D9]">{prop.aiScore}</span>
                                  </div>
                                )}
                              </div>
                              
                              <p className="text-sm font-semibold text-gray-700 group-hover:text-[#0B2341] transition-colors line-clamp-2">
                                {prop.title || `Curated ${prop.beds}BR Villa in Golden Square`}
                              </p>

                              <div className="flex gap-4 text-[10px] text-gray-400 font-bold font-mono mt-4 pt-3 border-t border-gray-100">
                                <span>📁 {prop.beds} Bed</span>
                                <span>🛁 {prop.baths} Bath</span>
                                <span>📐 {prop.bua_m2} M²</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 justify-end items-center">
                              {prop.virtualTourUrl && (
                                <a 
                                  href={prop.virtualTourUrl} target="_blank" rel="noreferrer"
                                  className="text-[10px] font-extrabold text-[#C9A24D] hover:bg-[#C9A24D]/5 border border-[#C9A24D]/30 px-3 py-1.5 rounded-full transition flex items-center space-x-1"
                                >
                                  <Compass className="w-3.5 h-3.5" />
                                  <span>360° TOUR</span>
                                </a>
                              )}
                              <button className="px-5 py-2.5 bg-[#0B2341] text-white hover:bg-[#1E88D9] rounded-full transition-all text-xs font-semibold tracking-wide">
                                Request Selection
                              </button>
                            </div>
                          </div>
                        </motion.article>
                      ))}

                      {filteredCatalog.length === 0 && (
                        <div className="py-20 text-center bg-white rounded-[2rem] border border-dashed border-gray-300">
                          <p className="text-sm text-gray-500 font-medium">No assets match your search guidelines.</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* RIGHT COLUMN: HIGH-BRANDED LIVE GEOSPATIAL MAPVIEWPORT */}
                  <div className="lg:col-span-5 h-[500px] lg:h-auto min-h-[480px] bg-[#0B2341] border border-gray-200/50 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between p-6 shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B2341]/20 to-slate-950/40 z-10 pointer-events-none" />
                    
                    {/* Layer selection switcher */}
                    <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-gray-200 z-20 flex justify-between items-center shadow-lg">
                      <span className="text-[10px] font-bold text-gray-500 pl-2">SBR Geospatial Overlay:</span>
                      <div className="flex space-x-1">
                        {['standard', 'heatmap', 'yield'].map((layer) => (
                          <button
                            key={layer}
                            onClick={() => setActiveMapLayer(layer)}
                            className={`px-3 py-1 text-[9px] font-extrabold rounded-lg capitalize transition-all ${
                              activeMapLayer === layer 
                                ? 'bg-[#1E88D9] text-white shadow-sm' 
                                : 'bg-gray-100 text-gray-600 hover:text-[#0B2341]'
                            }`}
                          >
                            {layer}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-[#071322] flex items-center justify-center opacity-25">
                      <div className="w-80 h-80 rounded-full border border-[#1E88D9]/20 animate-spin-slow flex items-center justify-center">
                        <div className="w-56 h-56 rounded-full border border-dashed border-[#C9A24D]/20 flex items-center justify-center">
                          <Compass className="w-12 h-12 text-[#C9A24D] animate-pulse" />
                        </div>
                      </div>
                    </div>

                    <div className="z-10 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-gray-200 mt-14 space-y-1 shadow-md">
                      <div className="flex items-center space-x-2 text-[#0B2341]">
                        <MapPin className="w-4 h-4 text-[#1E88D9] animate-pulse" />
                        <span className="text-xs uppercase font-extrabold tracking-widest">Live Localization Active</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Indexing coordinates targeted at Golden Square coordinates (30.026° N, 31.491° E).
                      </p>
                    </div>

                    {/* Coordinate Pins List representation */}
                    <div className="z-10 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 font-mono text-[9px] text-gray-300 space-y-1 max-h-[220px] overflow-y-auto">
                      {filteredCatalog.map(p => (
                        <div 
                          key={p.id} 
                          onClick={() => setSelectedPropertyId(p.id)}
                          className={`flex justify-between items-center py-1 border-b border-white/5 cursor-pointer hover:text-white transition ${
                            selectedPropertyId === p.id ? 'text-[#C9A24D] font-bold border-[#C9A24D]/25' : ''
                          }`}
                        >
                          <span>{p.compound_name} Node:</span>
                          <span>{p.lat.toFixed(4)}°N, {p.lng.toFixed(4)}°E</span>
                        </div>
                      ))}
                    </div>

                    <div className="z-10 flex flex-wrap gap-1.5 justify-center">
                      <span className={`text-[9px] px-2.5 py-1 rounded-full font-mono border ${activeMapLayer === 'heatmap' ? 'bg-orange-500/25 text-orange-400 border-orange-500/30' : 'bg-white/5 text-gray-500 border-white/10'}`}>Heatmaps: {activeMapLayer === 'heatmap' ? 'Ingesting' : 'Idle'}</span>
                      <span className={`text-[9px] px-2.5 py-1 rounded-full font-mono border ${activeMapLayer === 'yield' ? 'bg-green-500/25 text-green-400 border-green-500/30' : 'bg-white/5 text-gray-500 border-white/10'}`}>Yield Matrix: {activeMapLayer === 'yield' ? 'Online' : 'Idle'}</span>
                    </div>

                  </div>

                </div>
              )}

            </div>
          </section>
        </>
      ) : (
        
        // ============================================================================
        // GATE ROUTER: INTERNAL ADMINISTRATIVE PANEL WORKSPACE
        // ============================================================================
        <main className="p-8 pt-28 space-y-8 min-h-screen bg-[#F4F0E8]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm space-y-4 md:space-y-0">
            <div>
              <h2 className="font-serif text-2xl text-[#0B2341] font-bold">Internal Operations Command</h2>
              <p className="text-xs text-gray-500">Secure Database access panel for Manager and Assistant Manager workflows.</p>
            </div>
            <div className="flex space-x-4 text-xs font-mono">
              <div className="bg-[#F4F0E8] px-4 py-2 rounded-lg border border-gray-300">
                <span className="text-gray-500">Active Records:</span> <strong className="text-[#0B2341]">25,916 Packed</strong>
              </div>
              <div className="bg-[#F4F0E8] px-4 py-2 rounded-lg border border-gray-300">
                <span className="text-gray-500">Node Ingestion:</span> <strong className="text-green-600">100% Operational</strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ASSISTANT INVENTORY BOT INTERFACE COMPONENT */}
            <div className="lg:col-span-5 bg-white border border-gray-200 rounded-[2rem] p-6 flex flex-col justify-between space-y-6 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-[#1E88D9]">
                  <Sparkles className="w-5 h-5 text-[#C9A24D]" />
                  <h3 className="font-serif text-lg font-bold text-[#0B2341]">Inventory AI Routing Hub</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Deterministic database execution engine (Temperature 0.0) mapping natural text inputs to clean database objects instantly.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 p-2 rounded-xl flex items-center">
                  <input 
                    type="text" 
                    placeholder="بدي لقطة بميفيدا او ايستاون..."
                    value={adminBotQuery}
                    onChange={(e) => setAdminBotQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminBotSearch()}
                    className="w-full bg-transparent outline-none px-3 text-sm text-right font-arabic text-[#0B2341] font-semibold"
                  />
                  <button 
                    onClick={handleAdminBotSearch}
                    className="bg-[#1E88D9] text-white p-2.5 rounded-lg font-bold hover:bg-opacity-90 transition-all"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                {/* BOT MATCH OUTPUT GRID */}
                <div className="min-h-[180px] bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3 max-h-[220px] overflow-y-auto">
                  {adminBotReply === null ? (
                    <p className="text-xs text-gray-400 text-center pt-16 font-semibold">Enter search parameters to filter core inventory assets.</p>
                  ) : adminBotReply.length === 0 ? (
                    <p className="text-xs text-red-500 text-center pt-16 font-semibold">No units found matching exact structural criteria.</p>
                  ) : (
                    adminBotReply.map(item => (
                      <div key={item.id} className="bg-white p-2.5 rounded-lg border border-gray-200 flex justify-between items-center text-xs font-mono shadow-sm">
                        <div>
                          <p className="text-[#1E88D9] font-bold">{item.unit_code}</p>
                          <p className="text-gray-500 text-[10px]">{item.compound_name} • {item.bua_m2}M²</p>
                        </div>
                        <p className="text-[#0B2341] font-semibold">{currency === 'EGP' ? `${item.price.toLocaleString()} EGP` : `$${(item.priceUSD || Math.round(item.price / 48)).toLocaleString()}`}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* PIPELINE MANAGEMENT DASHBOARD VISUALS */}
            <div className="lg:col-span-7 bg-white border border-gray-200 rounded-[2rem] p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-[#0B2341]">10-Stage Leads Pipeline Management</h3>
                <span className="text-[10px] uppercase bg-gray-100 text-gray-500 px-2.5 py-1 rounded font-bold">SBR CRM V2.0</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {['S1: Intake', 'S3: Requirements', 'S5: Proposal Sent'].map((stageName) => (
                  <div key={stageName} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                    <p className="text-xs font-mono text-[#1E88D9] font-black border-b border-gray-200 pb-1.5">{stageName}</p>
                    <div className="space-y-2">
                      {pipelineLeads.filter(l => l.stage === stageName).map(lead => (
                        <div key={lead.id} className="bg-white p-3 rounded-lg border border-gray-200 space-y-1 shadow-sm">
                          <p className="text-xs font-semibold text-[#0B2341]">{lead.name}</p>
                          <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                            <span>{lead.target}</span>
                            <span className="text-green-600 font-bold">{lead.budget}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 text-center font-mono pt-2">
                Stages S6 Through S10 (Financial Negotiation, Viewing, Contract Signing, Closed) Hidden From Summary Panel view.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* 5. EDITORIAL FOOTER */}
      <footer className="bg-white py-16 px-6 md:px-12 text-center border-t border-gray-100 z-10 relative">
        <h2 className="font-serif text-3xl text-[#0B2341] font-bold tracking-tight">Sierra Estates</h2>
        <p className="text-gray-400 text-xs tracking-[0.25em] uppercase mt-2 mb-8 font-semibold">Beyond Brokerage · PropTech OS</p>
        <p className="text-gray-400 text-xs font-light tracking-wide">&copy; 2026 Sierra Estates Realty OS. All database and visual assets reserved.</p>
      </footer>

      {/* ============================================================================
          LAILA CONCIERGE FLOATING DRAWER SYSTEM (LEBANESE PROTOCOL CONFIG)
         ============================================================================ */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsLailaOpen(!isLailaOpen)}
          className="w-14 h-14 bg-[#0B2341] hover:bg-opacity-90 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105 relative border-2 border-[#C9A24D]"
        >
          {isLailaOpen ? <X className="w-6 h-6 text-[#C9A24D]" /> : <MessageSquare className="w-6 h-6 text-[#C9A24D]" />}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>

        <AnimatePresence>
          {isLailaOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white border border-[#C9A24D]/25 rounded-2xl shadow-2xl overflow-hidden flex flex-col justify-between z-50 animate-fade-in"
            >
              {/* DRAWER BOT HEADER */}
              <div className="bg-[#0B2341] p-4 border-b border-[#C9A24D]/20 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#C9A24D] flex items-center justify-center font-serif text-[#0B2341] font-bold">L</div>
                <div>
                  <h4 className="text-sm font-semibold text-white font-serif">Laila Concierge Chat</h4>
                  <p className="text-[10px] text-[#C9A24D] font-mono uppercase tracking-widest">Levant-Style SBR Intake Agent</p>
                </div>
              </div>

              {/* MESSAGES DISPLAY STRIP */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-gray-50 text-sm">
                {lailaChat.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'user' ? 'bg-[#1E88D9] text-white font-medium shadow-sm' : 'bg-white text-[#0B2341] border border-gray-200 shadow-sm'} font-arabic leading-relaxed`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* DRAWER INPUT PANEL COMPONENT */}
              <div className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2">
                <input 
                  type="text" 
                  placeholder="اكتب رسالتك لليلى هنا..."
                  value={userChatInput}
                  onChange={(e) => setUserChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLailaMessage()}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-white text-right font-arabic outline-none focus:border-[#1E88D9] text-[#0B2341]"
                />
                <button 
                  onClick={handleLailaMessage}
                  className="bg-[#0B2341] hover:bg-opacity-95 text-[#C9A24D] px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 font-sans"
                >
                  SEND
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}
