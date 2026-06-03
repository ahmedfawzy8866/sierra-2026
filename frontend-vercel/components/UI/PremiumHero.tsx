'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, ShieldCheck, Play, Award, RotateCcw, UploadCloud, Check, HelpCircle, ArrowRight } from 'lucide-react';

const COMPOUNDS = [
  'Mivida', 'Eastown', 'Villette (Sodic)', 'Taj City', 'Hyde Park', 'Mountain View iCity',
  'Mountain View Hyde Park', 'Madinaty', 'Uptown Cairo', 'Mostakbal City', 'El Shorouk',
  'Palm Hills New Cairo', 'Katameya Heights', 'Katameya Dunes', 'Stone Residence',
  'Fifth Square', 'La Vista City', 'Sarai', 'Bloomfields', 'SODIC East', 'Zed East',
  'The Waterway', 'Galleria Moon Valley', 'Lake View Residence', 'Al Rehab',
];

const PROPERTY_TYPES_EN = ['Apartment', 'Villa', 'Duplex', 'Penthouse', 'Twin House', 'Townhouse'];
const PROPERTY_TYPES_AR = ['شقة', 'فيلا', 'دوبلكس', 'بنتهاوس', 'توين هاوس', 'تاون هاوس'];

const BUDGETS_RESALE_EN = ['Under 5M EGP', '5M–10M EGP', '10M–20M EGP', '20M+ EGP'];
const BUDGETS_RESALE_AR = ['أقل من ٥ مليون جنيه', '٥–١٠ مليون جنيه', '١٠–٢٠ مليون جنيه', 'أكثر من ٢٠ مليون جنيه'];

const BUDGETS_RENT_EN = ['Under 20k EGP', '20k–50k EGP', '50k–100k EGP', '100k+ EGP'];
const BUDGETS_RENT_AR = ['أقل من ٢٠ ألف جنيه', '٢٠–٥٠ ألف جنيه', '٥٠–١٠٠ ألف جنيه', 'أكثر من ١٠٠ ألف جنيه'];

interface PremiumHeroProps {
  onSearch: (filters: { purpose: string; type: string; compound: string; budget: string }) => void;
  isArabic?: boolean;
}

// Helper scoring algorithm for compound search
function rankCompounds(q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return COMPOUNDS.slice(0, 8);
  const score = (name: string) => {
    const n = name.toLowerCase();
    if (n === s) return 1000;
    if (n.startsWith(s)) return 800 - n.length;
    const idx = n.indexOf(s);
    if (idx !== -1) return 600 - idx - n.length;
    
    // Subsequence check (handles typos & shorthand like "mtn vw")
    let i = 0;
    for (const ch of n) {
      if (ch === s[i]) i++;
      if (i === s.length) break;
    }
    if (i === s.length) return 300 - n.length;
    return -1;
  };
  return COMPOUNDS.map(n => ({ name: n, score: score(n) }))
    .filter(x => x.score > -1)
    .sort((a, b) => b.score - a.score)
    .map(x => x.name)
    .slice(0, 8);
}

export default function PremiumHero({ onSearch, isArabic = false }: PremiumHeroProps) {
  const [purpose, setPurpose] = useState('rent');
  const [selectedType, setSelectedType] = useState('Apartment');
  const [selectedBudget, setSelectedBudget] = useState('Under 20k EGP');
  
  // Compound Combobox States
  const [compoundQuery, setCompoundQuery] = useState('');
  const [isComboOpen, setIsComboOpen] = useState(false);
  const [activeComboIndex, setActiveComboIndex] = useState(0);
  const comboRef = useRef<HTMLDivElement>(null);
  
  const compoundResults = useMemo(() => rankCompounds(compoundQuery), [compoundQuery]);

  // 360° Draggable Panorama States
  const stageRef = useRef<HTMLDivElement>(null);
  const panoRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('Living Room');
  
  const pointerX = useRef(0);
  const startX = useRef(0);
  const startPos = useRef(0);

  const roomImages: Record<string, string> = {
    'Living Room': 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=2400&q=80',
    'Master Suite': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2400&q=80',
    'Kitchen': 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=2400&q=80',
    'Terrace': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2400&q=80',
  };

  const propertyTypes = useMemo(
    () => (isArabic ? PROPERTY_TYPES_AR : PROPERTY_TYPES_EN),
    [isArabic]
  );
  const budgets = useMemo(
    () =>
      purpose === 'rent'
        ? (isArabic ? BUDGETS_RENT_AR : BUDGETS_RENT_EN)
        : (isArabic ? BUDGETS_RESALE_AR : BUDGETS_RESALE_EN),
    [purpose, isArabic]
  );

  // Sync types and budgets on language/purpose change
  useEffect(() => {
    setSelectedType((prev) => (propertyTypes.includes(prev) ? prev : (propertyTypes[0] ?? prev)));
    setSelectedBudget((prev) => (budgets.includes(prev) ? prev : (budgets[0] ?? prev)));
  }, [propertyTypes, budgets]);

  // Click outside listener for combobox
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (comboRef.current && !comboRef.current.contains(e.target as Node)) {
        setIsComboOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Pointer dragging panning mechanism
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current || !panoRef.current) return;
    setIsDragging(true);
    startX.current = e.clientX;
    startPos.current = pointerX.current;
    stageRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !stageRef.current || !panoRef.current) return;
    const delta = e.clientX - startX.current;
    const maxPan = stageRef.current.clientWidth - panoRef.current.clientWidth;
    let newX = startPos.current + delta;
    newX = Math.max(maxPan, Math.min(0, newX));
    pointerX.current = newX;
    panoRef.current.style.transform = `translateX(${newX}px)`;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Auto-drift gentle rotation
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isDragging || !stageRef.current || !panoRef.current) return;
      const maxPan = stageRef.current.clientWidth - panoRef.current.clientWidth;
      let newX = pointerX.current - 0.4; // slow drift
      if (newX <= maxPan) newX = 0;
      pointerX.current = newX;
      panoRef.current.style.transform = `translateX(${newX}px)`;
    }, 30);

    return () => {
      clearInterval(intervalId);
    };
  }, [isDragging]);

  // S24 Ultra Upload State
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'dragging' | 'uploading' | 'success'>('idle');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadStatus('dragging');
  };

  const handleDragLeave = () => {
    setUploadStatus('idle');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      triggerUploadSimulate(files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      triggerUploadSimulate(files[0].name);
    }
  };

  const triggerUploadSimulate = (fileName: string) => {
    setUploadStatus('uploading');
    setTimeout(() => {
      setUploadStatus('success');
      setUploadedFile(fileName);
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadedFile(null);
      }, 5000);
    }, 2500);
  };

  const handleSearchSubmit = () => {
    onSearch({
      purpose,
      type: selectedType,
      compound: compoundQuery,
      budget: selectedBudget,
    });
  };

  return (
    <div className="relative w-full bg-[#F4F0E8] dark:bg-[#071422] transition-colors duration-500 py-16 md:py-24 px-6" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-10 items-start">
        
        {/* --- LEFT: VIRTUAL PANORAMA VIEWPORT --- */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#C9A84C]/10 border border-[#C9A84C]/35 text-[#C9A84C] text-[10px] tracking-[0.25em] font-semibold uppercase font-mono rounded-full w-max">
              <Award size={12} />
              {isArabic ? 'بث افتراضي مكاني' : '360° SPATIAL VIEWPORT'}
            </span>
            <h1 className="font-playfair text-4xl md:text-5xl font-light text-[#071422] dark:text-white leading-tight">
              {isArabic ? 'جولة سييرا العقارية الافتراضية' : 'Sierra Spatial Teleportation'}
            </h1>
            <p className="text-sm text-[#071422]/70 dark:text-white/60 font-light max-w-xl">
              {isArabic 
                ? 'استمتع بالتجول داخل أرقى الوحدات العقارية بالقاهرة الجديدة بدقة ملليمترية. اسحب للتوجيه والالتفاف.'
                : 'Drag anywhere to look around the virtual panorama, and choose rooms below to inspect interior fidelity.'}
            </p>
          </div>

          {/* Interactive Stage */}
          <div className="relative">
            <div 
              ref={stageRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className={`relative h-[360px] md:h-[480px] w-full border border-[#071422]/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-luxury select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              {/* Panorama Background Wrap */}
              <div 
                ref={panoRef}
                className="absolute top-0 left-0 h-full w-[280%] bg-cover bg-center transition-transform duration-100 ease-out pointer-events-none will-change-transform"
                style={{ backgroundImage: `url('${roomImages[currentRoom]}')` }}
              />

              {/* Glowing Overlays */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#071422]/80 backdrop-blur-md border border-[#C9A84C]/30 px-3 py-1.5 rounded-xl text-[9px] font-mono font-semibold text-white uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>360° · {isArabic ? 'معاينة حية' : currentRoom}</span>
              </div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 bg-[#071422]/75 backdrop-blur-sm text-white text-[11px] font-medium tracking-wide px-4 py-2 rounded-full shadow-lg">
                <Compass size={14} className="animate-spin" style={{ animationDuration: '6s' }} />
                <span>{isArabic ? 'اسحب للالتفاف حول الغرفة' : 'Drag to explore viewport'}</span>
              </div>
            </div>

            {/* Room Selectors */}
            <div className="flex flex-wrap gap-2.5 mt-4">
              {Object.keys(roomImages).map((room) => (
                <button
                  key={room}
                  onClick={() => setCurrentRoom(room)}
                  aria-label={isArabic ? `عرض ${room}` : `View ${room}`}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide border ease-silk transition-all ${
                    currentRoom === room 
                      ? 'bg-[#071422] dark:bg-white text-white dark:text-[#071422] border-transparent shadow-md'
                      : 'bg-white/60 dark:bg-[#0d2035]/30 hover:bg-white dark:hover:bg-[#0d2035]/50 text-[#071422] dark:text-white/80 border-[#071422]/10 dark:border-white/10'
                  }`}
                >
                  {isArabic ? (
                    room === 'Living Room' ? 'غرفة المعيشة' :
                    room === 'Master Suite' ? 'الجناح الرئيسي' :
                    room === 'Kitchen' ? 'المطبخ' : 'التراس الخارجي'
                  ) : room}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT: SMART FILTER & CAPTURE SETTINGS --- */}
        <div className="flex flex-col gap-8">
          
          {/* Smart Filter Card */}
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-[#0d2035]/40 backdrop-blur-md border border-[#071422]/10 dark:border-white/10 shadow-luxury overflow-visible">
            <h3 className="font-playfair text-xl font-light text-[#071422] dark:text-white mb-4">
              {isArabic ? 'تصفية المحفظة الحصرية' : 'Refined Smart Filter'}
            </h3>

            {/* Toggle: Rent / Resale */}
            <div className="flex p-1 bg-[#071422]/5 dark:bg-white/5 rounded-2xl mb-5">
              <button 
                onClick={() => setPurpose('rent')}
                aria-label={isArabic ? 'اختيار الإيجار' : 'Select rent'}
                className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider rounded-xl ease-silk transition-all ${
                  purpose === 'rent' 
                    ? 'bg-[#071422] dark:bg-white text-white dark:text-[#071422] shadow-md' 
                    : 'text-[#071422]/60 dark:text-white/60'
                }`}
              >
                {isArabic ? 'إيجار' : 'Rent'}
              </button>
              <button 
                onClick={() => setPurpose('resale')}
                aria-label={isArabic ? 'اختيار إعادة البيع' : 'Select resale'}
                className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider rounded-xl ease-silk transition-all ${
                  purpose === 'resale' 
                    ? 'bg-[#071422] dark:bg-white text-white dark:text-[#071422] shadow-md' 
                    : 'text-[#071422]/60 dark:text-white/60'
                }`}
              >
                {isArabic ? 'إعادة بيع' : 'Resale'}
              </button>
            </div>

            {/* Inputs Block */}
            <div className="flex flex-col gap-4">
              
              {/* Autocomplete Compound Search */}
              <div ref={comboRef} className="relative">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#071422]/50 dark:text-white/40 mb-1.5">
                  {isArabic ? 'الكمباوند أو المنطقة' : 'Compound Location'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={compoundQuery}
                    onFocus={() => setIsComboOpen(true)}
                    onChange={(e) => {
                      setCompoundQuery(e.target.value);
                      setIsComboOpen(true);
                      setActiveComboIndex(0);
                    }}
                    onKeyDown={(e) => {
                      if (!isComboOpen || compoundResults.length === 0) return;
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setActiveComboIndex((prev) => Math.min(prev + 1, compoundResults.length - 1));
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setActiveComboIndex((prev) => Math.max(prev - 1, 0));
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        setCompoundQuery(compoundResults[activeComboIndex]);
                        setIsComboOpen(false);
                      } else if (e.key === 'Escape') {
                        setIsComboOpen(false);
                      }
                    }}
                    placeholder={isArabic ? 'اكتب اسم الكمباوند...' : 'Type compound (e.g. Mivida)...'}
                    className="w-full px-4 py-3 bg-white dark:bg-[#071422] border border-[#071422]/15 dark:border-white/10 focus:border-[#C9A84C] outline-none text-xs rounded-xl transition-all"
                  />
                  <Search size={14} className="absolute right-3.5 top-3.5 text-[#071422]/40 dark:text-white/40 pointer-events-none" />
                </div>

                {/* Dropdown popup */}
                <AnimatePresence>
                  {isComboOpen && compoundResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-[#0d2035] border border-[#071422]/10 dark:border-white/10 shadow-2xl rounded-2xl max-h-56 overflow-y-auto"
                    >
                      {compoundResults.map((name, i) => (
                        <button
                          key={name}
                          onClick={() => {
                            setCompoundQuery(name);
                            setIsComboOpen(false);
                          }}
                          aria-label={isArabic ? `اختيار ${name}` : `Select ${name}`}
                          onMouseEnter={() => setActiveComboIndex(i)}
                          className={`w-full text-left px-4 py-3 text-xs flex items-center justify-between transition-all ${
                            i === activeComboIndex 
                              ? 'bg-[#C9A84C]/15 dark:bg-[#C9A84C]/10 text-[#C9A84C]' 
                              : 'text-[#071422] dark:text-white/80'
                          }`}
                        >
                          <span>{name}</span>
                          {name === compoundQuery && <Check size={12} />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Property Type Dropdown */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#071422]/50 dark:text-white/40 mb-1.5">
                  {isArabic ? 'نوع العقار' : 'Property Type'}
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white dark:bg-[#071422] border border-[#071422]/15 dark:border-white/10 focus:border-[#C9A84C] outline-none text-xs rounded-xl transition-all cursor-pointer"
                >
                  {propertyTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Budget Range Dropdown */}
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-[#071422]/50 dark:text-white/40 mb-1.5">
                  {isArabic ? 'الميزانية المتاحة' : 'Budget Range'}
                </label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white dark:bg-[#071422] border border-[#071422]/15 dark:border-white/10 focus:border-[#C9A84C] outline-none text-xs rounded-xl transition-all cursor-pointer"
                >
                  {budgets.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSearchSubmit}
              aria-label={isArabic ? 'تنفيذ بحث المحفظة المخصصة' : 'Submit custom portfolio search'}
              className="w-full mt-6 py-4 bg-[#071422] text-white dark:bg-gradient-to-r dark:from-[#C9A84C] dark:to-[#E9C176] dark:text-[#071422] font-semibold text-xs rounded-xl shadow-lg hover:shadow-2xl transition-all uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Search size={14} />
              <span>{isArabic ? 'بحث عن عقارات حصرية' : 'Search Custom Portfolio'}</span>
            </button>
          </div>

          {/* S24 Ultra Capture Steps */}
          <div className="p-6 rounded-3xl bg-white/70 dark:bg-[#0d2035]/40 backdrop-blur-md border border-[#071422]/10 dark:border-white/10 shadow-luxury">
            <div className="flex items-center justify-between mb-4 border-b border-[#071422]/5 dark:border-white/5 pb-3">
              <h3 className="font-playfair text-lg font-light text-[#071422] dark:text-white">
                {isArabic ? 'التقاط جولة 360° بهاتفك' : 'S24 Ultra Panorama Upload'}
              </h3>
              <div className="px-2.5 py-1 bg-[#C9A84C]/10 border border-[#C9A84C]/35 rounded text-[8px] font-mono text-[#C9A84C] font-semibold uppercase tracking-wider">
                Samsung S24 Pro
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded bg-[#C9A84C]/10 text-[#C9A84C] font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <h4 className="text-xs font-semibold text-[#071422] dark:text-white">Open Panorama Mode</h4>
                  <p className="text-[10px] text-[#071422]/60 dark:text-white/50 leading-relaxed mt-0.5">Use Pro mode or Panorama mode to sweep. Capture full 360° photospheres for seamless walkthrough stitching.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 rounded bg-[#C9A84C]/10 text-[#C9A84C] font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <h4 className="text-xs font-semibold text-[#071422] dark:text-white">Overlap 30% and Rotate</h4>
                  <p className="text-[10px] text-[#071422]/60 dark:text-white/50 leading-relaxed mt-0.5">Overlap adjacent sweeps by 30% from a fixed pivot point at chest level to ensure stitch alignment.</p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative mt-5 border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  uploadStatus === 'dragging' 
                    ? 'border-[#C9A84C] bg-[#C9A84C]/5'
                    : uploadStatus === 'uploading'
                    ? 'border-[#1E88D9] bg-[#1E88D9]/5'
                    : uploadStatus === 'success'
                    ? 'border-emerald-500 bg-emerald-500/5'
                    : 'border-[#071422]/15 dark:border-white/10 hover:border-[#C9A84C]/45'
                }`}
              >
                <input
                  type="file"
                  id="pano-upload"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <label htmlFor="pano-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  {uploadStatus === 'uploading' ? (
                    <>
                      <Compass size={24} className="text-[#1E88D9] animate-spin" />
                      <p className="text-[11px] font-semibold text-[#1E88D9]">Stitching Equirectangular Panorama...</p>
                      <p className="text-[9px] text-[#071422]/50 dark:text-white/40">Aligning frames via SBR Engine</p>
                    </>
                  ) : uploadStatus === 'success' ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                        <Check size={16} />
                      </div>
                      <p className="text-[11px] font-semibold text-emerald-500">Stitching Successful!</p>
                      <p className="text-[9px] text-[#071422]/60 dark:text-white/50 truncate max-w-[200px]">{uploadedFile}</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={24} className="text-[#071422]/40 dark:text-white/40" />
                      <p className="text-[11px] font-semibold text-[#071422] dark:text-white">
                        {isArabic ? 'اسقط صورة البانوراما هنا' : 'Drop your 360° panorama here'}
                      </p>
                      <p className="text-[9px] text-[#071422]/50 dark:text-white/40">
                        {isArabic ? 'أو اضغط للتصفح بهاتفك' : 'or tap to upload from S24 Ultra'}
                      </p>
                    </>
                  )}
                </label>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
