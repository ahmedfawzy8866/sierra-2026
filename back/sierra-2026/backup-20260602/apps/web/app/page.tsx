'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useI18n } from '@/lib/I18nContext';
import { useTheme } from 'next-themes';
import ShieldLogo from '@/components/Landing/ShieldLogo';
import PropCard from '@/components/Landing/PropCard';
import { 
  Sparkles, Smartphone, MapPin, TrendingUp, DollarSign, 
  Bot, ChevronRight, X, Check, Heart, HelpCircle, Layers
} from 'lucide-react';

const LiveMap = dynamic(() => import('@/components/Maps/LiveMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-900/50 animate-pulse flex items-center justify-center text-slate-500 font-serif">Initializing Intelligence Map...</div>,
});

// ══════════════════════════════════════════════════════════
//  DESIGN TOKENS & DICTIONARY
// ══════════════════════════════════════════════════════════
const G = '#E9C176';
const G2 = '#C8961A';

const SPELLING_CORRECTIONS: Record<string, string> = {
  "mevida": "Mivida Emaar",
  "mvida": "Mivida Emaar",
  "meveda": "Mivida Emaar",
  "lakeview": "Lake View Residence",
  "laka view": "Lake View Residence",
  "lake vew": "Lake View Residence",
  "mountainview": "Mountain View Hyde Park",
  "mt view": "Mountain View Hyde Park",
  "mv hyde park": "Mountain View Hyde Park",
  "shorouk": "El Shorouk Compounds",
  "sherouk": "El Shorouk Compounds",
  "shrok": "El Shorouk Compounds",
  "shorok": "El Shorouk Compounds",
  "madinaty": "Madinaty TMG",
  "madenaty": "Madinaty TMG",
  "madina": "Madinaty TMG",
  "madnty": "Madinaty TMG",
  "villette": "Villette SODIC",
  "vilette": "Villette SODIC",
  "waterway": "Waterway New Cairo",
  "water way": "Waterway New Cairo",
};

const DETAILED_COMPOUNDS = [
  "Lake View Residence",
  "Mivida Emaar",
  "Mountain View Hyde Park",
  "Villette SODIC",
  "Waterway New Cairo",
  "Madinaty TMG",
  "El Shorouk Compounds"
];

const THEMES = {
  dark: {
    bg: '#0D2035', bgAlt: '#0A1520', bg2: '#122A47',
    surface: 'rgba(255,255,255,0.06)', surfaceHover: 'rgba(233,193,118,0.12)',
    card: '#122A47', cardBorder: 'rgba(233,193,118,0.12)',
    border: 'rgba(233,193,118,0.22)', borderHover: 'rgba(233,193,118,0.45)',
    text: '#EFF8F7', textSub: 'rgba(239,248,247,0.85)', textMuted: 'rgba(239,248,247,0.55)',
    navBg: 'rgba(13,32,53,0.72)', footerBg: '#040E1C', heroBg: '#0A1520',
    accent: '#E9C176', accentStrong: '#F2D195', accentSoft: 'rgba(233,193,118,0.14)',
  },
  light: {
    bg: '#EEF2F4', bgAlt: '#DCE4E8', bg2: '#F8FAFB',
    surface: 'rgba(12,27,46,0.05)', surfaceHover: 'rgba(154,107,14,0.14)',
    card: '#FFFFFF', cardBorder: 'rgba(12,27,46,0.12)',
    border: 'rgba(12,27,46,0.18)', borderHover: 'rgba(154,107,14,0.5)',
    text: '#0C1B2E', textSub: 'rgba(12,27,46,0.82)', textMuted: 'rgba(12,27,46,0.55)',
    navBg: 'rgba(238,242,244,0.75)', footerBg: '#08182B', heroBg: '#DCE4E8',
    accent: '#9A6B0E', accentStrong: '#7E560A', accentSoft: 'rgba(154,107,14,0.12)',
  },
};

const STATIC_LISTINGS = [
  { id: 1, title: 'Aurora Penthouse', titleAr: 'بنتهاوس أورورا', location: 'Madinaty TMG · Suez Road', locationAr: 'مدينتي · القاهرة الجديدة', price: 'EGP 8,500,000', beds: 4, baths: 3, sqft: '320 m²', badge: 'High Yield', badgeColor: '#7C3AED', furnished: 'furnished', dealType: 'resale', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=80' },
  { id: 2, title: 'Villa Lumière', titleAr: 'فيلا لوميير', location: 'Mountain View · 5th Settlement', locationAr: 'ماونتن فيو · التجمع الخامس', price: 'EGP 14,200,000', beds: 5, baths: 4, sqft: '480 m²', badge: '40%+ Owner Direct', badgeColor: '#C8961A', furnished: 'unfurnished', dealType: 'resale', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80' },
  { id: 3, title: 'Waterway Signature Apt', titleAr: 'شقة واتروي مميزة', location: 'Waterway New Cairo · Golden Square', locationAr: 'واتروي · القاهرة الجديدة', price: 'EGP 11,500,000', beds: 3, baths: 3, sqft: '220 m²', badge: 'Direct Owner', badgeColor: '#1B6CA8', furnished: 'furnished', dealType: 'resale', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80' },
  { id: 4, title: 'Lake View Premium Suite', titleAr: 'شقة ليك فيو فاخرة', location: 'Lake View Residence · Golden Square', locationAr: 'ليك فيو · التجمع الخامس', price: 'EGP 12,500,000', beds: 3, baths: 3, sqft: '210 m²', badge: 'Best ROI', badgeColor: '#059669', furnished: 'unfurnished', dealType: 'rent', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80' },
  { id: 5, title: 'Mivida Garden Penthouse', titleAr: 'بنتهاوس ميفيدا بحديقة', location: 'Mivida Emaar · Golden Square', locationAr: 'ميفيدا · التجمع الخامس', price: 'EGP 14,800,000', beds: 4, baths: 3, sqft: '280 m²', badge: '40%+ Owner Direct', badgeColor: '#DC2626', furnished: 'furnished', dealType: 'resale', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80' },
  { id: 6, title: 'Shorouk Twin Residence', titleAr: 'توين هاوس الشروق', location: 'El Shorouk Compounds · Suez Corridor', locationAr: 'الشروق · القاهرة الجديدة', price: 'EGP 8,900,000', beds: 3, baths: 3, sqft: '245 m²', badge: 'Direct Owner', badgeColor: '#D97706', furnished: 'unfurnished', dealType: 'rent', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80' },
];

const SAMPLE_LISTINGS = [
  { id: 1, title: 'Lake View Residence Apt', score: 98, compound: 'Lake View', price: '12.5M EGP', beds: 3, area: '210 m²', owner: 'Direct Owner (40%+ priority)', type: 'Resale', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=80' },
  { id: 2, title: 'Mivida Eco-Luxury Villa', score: 95, compound: 'Mivida', price: '18.2M EGP', beds: 4, area: '320 m²', owner: 'Direct Owner', type: 'Resale', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80' },
  { id: 3, title: 'Mountain View Penthouse', score: 92, compound: 'Mountain View', price: '14.5M EGP', beds: 4, area: '280 m²', owner: 'Vetted Broker co-broke', type: 'Primary', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80' },
  { id: 4, title: 'Madinaty Standalone Villa', score: 89, compound: 'Madinaty', price: '11.2M EGP', beds: 5, area: '420 m²', owner: 'Direct Owner', type: 'Resale', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80' },
  { id: 5, title: 'Shorouk Signature Twinhouse', score: 86, compound: 'Shorouk', price: '8.9M EGP', beds: 3, area: '245 m²', owner: 'Direct Owner (40%+ priority)', type: 'Resale', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80' },
];

export default function LandingPage() {
  const { locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  
  // Basic states
  const [mounted, setMounted] = useState(false);
  
  // Custom Filter State
  const [dealType, setDealType] = useState<'rent' | 'resale'>('resale');
  const [selectedCompounds, setSelectedCompounds] = useState<string[]>([]);
  const [compoundSearchQuery, setCompoundSearchQuery] = useState('');
  const [showCompoundDropdown, setShowCompoundDropdown] = useState(false);
  const [suggestedSpelling, setSuggestedSpelling] = useState<string | null>(null);

  // Request Modal State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestName, setRequestName] = useState('');
  const [requestPhone, setRequestPhone] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // AI Support overlay panel state
  const [showAiSupport, setShowAiSupport] = useState(false);
  const [aiSupportTab, setAiSupportTab] = useState<'menu' | 'map' | 'roi' | 'pricing' | 'tour' | 'advice' | 'matches' | 'dream'>('menu');

  // ROI Projections
  const [roiPrice, setRoiPrice] = useState(12000000);
  const [roiRent, setRoiRent] = useState(90000);

  // Pricing Engine
  const [calcCompound, setCalcCompound] = useState('lake-view');
  const [calcArea, setCalcArea] = useState(180);

  // Dream Advisor
  const [dreamStep, setDreamStep] = useState(1);
  const [dreamBudget, setDreamBudget] = useState('');

  // S24 Ultra Drag State
  const [bgPosition, setBgPosition] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const lang = locale === 'ar' ? 'ar' : 'en';
  const mode = (theme === 'light' ? 'light' : 'dark') as 'light' | 'dark';
  const th = THEMES[mode];
  const isAr = lang === 'ar';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Typo Auto-Correct Handler
  const handleCompoundSearchChange = (val: string) => {
    setCompoundSearchQuery(val);
    const cleanQuery = val.trim().toLowerCase();
    
    if (SPELLING_CORRECTIONS[cleanQuery]) {
      setSuggestedSpelling(SPELLING_CORRECTIONS[cleanQuery]);
    } else {
      // Fuzzy prefix matching
      const foundMatch = Object.keys(SPELLING_CORRECTIONS).find(k => k.startsWith(cleanQuery) || cleanQuery.startsWith(k));
      if (foundMatch && cleanQuery.length > 2) {
        setSuggestedSpelling(SPELLING_CORRECTIONS[foundMatch]);
      } else {
        setSuggestedSpelling(null);
      }
    }
  };

  const selectSuggestedCompound = () => {
    if (suggestedSpelling && !selectedCompounds.includes(suggestedSpelling)) {
      setSelectedCompounds([...selectedCompounds, suggestedSpelling]);
      setCompoundSearchQuery('');
      setSuggestedSpelling(null);
    }
  };

  const toggleCompoundSelection = (comp: string) => {
    if (selectedCompounds.includes(comp)) {
      setSelectedCompounds(selectedCompounds.filter(c => c !== comp));
    } else {
      setSelectedCompounds([...selectedCompounds, comp]);
    }
  };

  // Filter listings based on multi-select compounds and deal type
  const filteredListings = STATIC_LISTINGS.filter(item => {
    const matchesDeal = item.dealType === dealType;
    const matchesCompound = selectedCompounds.length === 0 || selectedCompounds.some(c => item.location.toLowerCase().includes(c.split(' ')[0].toLowerCase()));
    return matchesDeal && matchesCompound;
  });

  // ROI calculations
  const grossYield = ((roiRent * 12) / roiPrice) * 100;

  // S24 Ultra Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX - bgPosition;
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setBgPosition(e.clientX - startX.current);
  };
  const handleMouseUp = () => { isDragging.current = false; };

  const submitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    // Simulate API closer fallback alert log
    console.log(`NEW REQUEST SUBMITTED! Sourcing target: ${dealType.toUpperCase()} in ${selectedCompounds.join(', ') || 'Any Compound'}. Client: ${requestName} (${requestPhone})`);
    setTimeout(() => {
      setShowRequestModal(false);
      setRequestSubmitted(false);
      setRequestName('');
      setRequestPhone('');
    }, 2500);
  };

  return (
    <div style={{ minHeight: '100vh', background: th.bg, color: th.text, transition: 'background .5s, color .5s', direction: isAr ? 'rtl' : 'ltr' }}>
      
      {/* ══ STICKY FRAMELESS SMART FILTER & REQUEST BAR ══ */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 500, 
        background: th.navBg, 
        backdropFilter: 'blur(20px)', 
        borderBottom: `1px solid ${th.border}`, 
        padding: '8px 24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', maxWidth: '1280px', margin: '0 auto' }}>
          
          {/* Logo Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <ShieldLogo size={32} />
            <div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 600, color: th.accent, letterSpacing: '.15em' }}>SIERRA BLU</span>
              <span style={{ display: 'block', fontSize: '6px', letterSpacing: '.3em', color: th.textSub, marginTop: -2 }}>EGYPT INTEL OS</span>
            </div>
          </div>

          {/* Sticky Smart Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', background: 'rgba(255,255,255,0.015)', border: `1px solid ${th.border}`, borderRadius: '14px', padding: '4px 8px', backdropFilter: 'blur(10px)' }}>
            
            {/* Toggle just Rent / Resale */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', padding: '2px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <button 
                onClick={() => setDealType('rent')}
                style={{ 
                  padding: '6px 14px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  background: dealType === 'rent' ? `linear-gradient(135deg, ${G2}, ${G})` : 'transparent',
                  color: dealType === 'rent' ? '#000' : th.textSub,
                  transition: 'all 0.2s'
                }}
              >
                {isAr ? 'إيجار' : 'Rent'}
              </button>
              <button 
                onClick={() => setDealType('resale')}
                style={{ 
                  padding: '6px 14px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  background: dealType === 'resale' ? `linear-gradient(135deg, ${G2}, ${G})` : 'transparent',
                  color: dealType === 'resale' ? '#000' : th.textSub,
                  transition: 'all 0.2s'
                }}
              >
                {isAr ? 'إعادة بيع' : 'Resale'}
              </button>
            </div>

            {/* Compounds Multi-Select & Typo-Corrector Field */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowCompoundDropdown(!showCompoundDropdown)}
                style={{ 
                  padding: '8px 16px', 
                  background: 'rgba(0,0,0,0.15)', 
                  border: `1px solid ${th.border}`, 
                  borderRadius: '8px', 
                  fontSize: '0.8rem', 
                  color: '#fff', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: '220px'
                }}
              >
                <MapPin size={14} color={G} />
                <span>
                  {selectedCompounds.length === 0 
                    ? (isAr ? 'اختر الكمباوندات' : 'Select Compounds...') 
                    : `${selectedCompounds.length} Compounds`}
                </span>
              </div>

              {showCompoundDropdown && (
                <div style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  marginTop: '8px', 
                  width: '320px', 
                  background: th.bg, 
                  border: `1px solid ${th.border}`, 
                  borderRadius: '16px', 
                  padding: '1rem', 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  zIndex: 600
                }}>
                  {/* Spelling Typo Autocorrect Input */}
                  <div>
                    <input 
                      type="text" 
                      placeholder={isAr ? 'ابحث مع التصحيح الإملائي...' : 'Type compound (with typos)...'} 
                      value={compoundSearchQuery}
                      onChange={e => handleCompoundSearchChange(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '8px 12px', 
                        background: 'rgba(0,0,0,0.2)', 
                        border: `1px solid ${th.border}`, 
                        borderRadius: '8px', 
                        fontSize: '0.8rem',
                        color: '#fff',
                        outline: 'none'
                      }}
                    />
                    
                    {suggestedSpelling && (
                      <div 
                        onClick={selectSuggestedCompound}
                        style={{ 
                          marginTop: '6px', 
                          padding: '6px 10px', 
                          background: 'rgba(233,193,118,0.12)', 
                          border: `1px dashed ${G}`, 
                          borderRadius: '8px', 
                          fontSize: '0.75rem', 
                          color: G,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        <Sparkles size={12} />
                        <span>Did you mean: <strong>{suggestedSpelling}</strong>? Click to add!</span>
                      </div>
                    )}
                  </div>

                  {/* Checklist options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
                    {DETAILED_COMPOUNDS.map(comp => {
                      const selected = selectedCompounds.includes(comp);
                      return (
                        <div 
                          key={comp} 
                          onClick={() => toggleCompoundSelection(comp)}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            fontSize: '0.8rem', 
                            cursor: 'pointer',
                            padding: '4px 0'
                          }}
                        >
                          <div style={{ 
                            width: '14px', 
                            height: '14px', 
                            borderRadius: '4px', 
                            border: `1px solid ${selected ? G : th.border}`, 
                            backgroundColor: selected ? G : 'transparent',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#000',
                            fontSize: '0.6rem'
                          }}>
                            {selected && '✓'}
                          </div>
                          <span>{comp}</span>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={() => setShowCompoundDropdown(false)}
                    style={{ width: '100%', padding: '6px', background: `linear-gradient(135deg, ${G2}, ${G})`, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', color: '#000' }}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Gold Button Request */}
            <button 
              onClick={() => setShowRequestModal(true)}
              style={{ 
                padding: '8px 20px', 
                background: `linear-gradient(135deg, ${G2}, ${G})`, 
                color: '#000', 
                border: 'none', 
                borderRadius: '10px', 
                cursor: 'pointer', 
                fontWeight: 700, 
                fontSize: '0.8rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                boxShadow: `0 4px 14px rgba(233,193,118,0.25)`
              }}
            >
              {isAr ? 'إرسال طلب' : 'Request'}
            </button>
          </div>

          {/* Quick controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} style={{ background: th.surface, border: `1px solid ${th.border}`, color: th.accent, padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
              {isAr ? 'EN' : 'AR'}
            </button>
            <button onClick={() => setTheme(mode === 'dark' ? 'light' : 'dark')} style={{ background: th.surface, border: `1px solid ${th.border}`, color: th.textSub, width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
              {mode === 'dark' ? '☀' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      {/* ══ LUXURY SLENDER MINIMAL HERO Eyebrow ══ */}
      <section style={{ 
        paddingTop: '110px', 
        paddingBottom: '24px', 
        textAlign: 'center', 
        background: `linear-gradient(180deg, ${th.bgAlt} 0%, ${th.bg} 100%)`,
        borderBottom: `1px solid ${th.border}`
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <span style={{ fontSize: '0.75rem', color: th.accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.15em', display: 'block', marginBottom: '8px' }}>
            New Cairo · Madinaty · Shorouk Rent & Resale
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, color: th.text, lineHeight: 1.2, margin: '0 0 8px 0' }}>
            New Cairo Living, <span style={{ fontWeight: 500, background: `linear-gradient(135deg, ${G}, ${G2})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Matched by Intelligence</span>
          </h1>
          <p style={{ margin: 0, fontSize: '0.9rem', color: th.textSub, fontWeight: 300 }}>
            Curating high-ROI resale assets and direct owner listings (40%+ priority direct owner target).
          </p>
        </div>
      </section>

      {/* ══ DIRECT LISTINGS VIEWPORT ══ */}
      <section style={{ padding: '40px 0', background: th.bg }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', fontWeight: 400, margin: 0 }}>
                {isAr ? 'عقارات مختارة بعناية' : 'Curated Verified Listings'}
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: th.textSub }}>
                Showing {filteredListings.length} matching properties.
              </p>
            </div>
            
            {/* Compound pills status */}
            {selectedCompounds.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selectedCompounds.map(c => (
                  <span key={c} style={{ fontSize: '0.7rem', background: 'rgba(233,193,118,0.1)', border: `1px solid ${G}`, color: G, padding: '4px 10px', borderRadius: '20px' }}>{c}</span>
                ))}
              </div>
            )}
          </div>

          {filteredListings.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', border: `1px dashed ${th.border}`, borderRadius: '20px', color: th.textSub }}>
              <HelpCircle size={40} color={G} style={{ margin: '0 auto 1rem auto' }} />
              <p>No listings matched your active compound filters. Clear some selections in the top bar to expand matches!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {filteredListings.map((p, idx) => (
                <PropCard
                  key={p.id}
                  id={p.id}
                  title={isAr ? p.titleAr : p.title}
                  location={isAr ? p.locationAr : p.location}
                  price={p.price}
                  beds={p.beds}
                  baths={p.baths}
                  sqft={p.sqft}
                  badge={p.badge}
                  badgeColor={p.badgeColor}
                  img={p.img}
                  dealDelay={idx * 0.05}
                  dealt={true}
                  isAr={isAr}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ INTERACTIVE LIVE MAP & WHY SECTIONS ══ */}
      <section style={{ background: th.bgAlt, padding: '60px 0', borderTop: `1px solid ${th.border}` }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: G, textTransform: 'uppercase', letterSpacing: '.1em' }}>Market Intelligence</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', fontWeight: 300, color: th.text, margin: '8px 0' }}>
                New Cairo Growth & Sourcing Dashboard
              </h2>
              <p style={{ fontSize: '0.9rem', color: th.textSub, lineHeight: 1.7, marginBottom: '24px' }}>
                Track compound-specific indices and off-market direct listings. Our automated scrapers monitor over 80+ local WhatsApp co-brokerage clusters and Facebook hubs to ensure you receive verified owner properties first.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '16px', padding: '16px' }}>
                  <strong style={{ display: 'block', fontSize: '1.25rem', color: G }}>40%+ Target</strong>
                  <span style={{ fontSize: '0.8rem', color: th.textSub }}>Exclusive direct owner listings ratio.</span>
                </div>
                <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '16px', padding: '16px' }}>
                  <strong style={{ display: 'block', fontSize: '1.25rem', color: G }}>10.4% Max ROI</strong>
                  <span style={{ fontSize: '0.8rem', color: th.textSub }}>Top yield recorded in Madinaty.</span>
                </div>
              </div>
            </div>
            
            <div style={{ height: '340px', borderRadius: '24px', overflow: 'hidden', border: `1px solid ${th.border}`, boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
              <LiveMap mode={mode} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ THE LUXURY FLOATING "AI SUPPORT" ACTION BUTTON ══ */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 600 }}>
        <button 
          onClick={() => { setShowAiSupport(true); setAiSupportTab('menu'); }}
          style={{ 
            background: `linear-gradient(135deg, ${G2}, ${G})`, 
            color: '#000', 
            border: 'none', 
            borderRadius: '50px', 
            padding: '14px 28px', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            fontSize: '0.85rem', 
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: `0 8px 32px rgba(200, 150, 26, 0.4)`,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16,1,.3,1)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
        >
          <Sparkles size={16} />
          <span>AI Support Hub</span>
        </button>
      </div>

      {/* ══ AI SUPPORT SLIDE-OUT OVERLAY DRAWER ══ */}
      {showAiSupport && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(4,14,28,0.75)', 
          backdropFilter: 'blur(10px)', 
          zIndex: 1000, 
          display: 'flex', 
          justifyContent: 'flex-end' 
        }}>
          
          <div style={{ 
            width: '100%', 
            maxWidth: '520px', 
            height: '100vh', 
            background: th.bg, 
            borderLeft: `1px solid ${th.border}`, 
            padding: '2rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem', 
            boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setShowAiSupport(false)}
              style={{ 
                position: 'absolute', 
                top: '1.5rem', 
                right: '1.5rem', 
                background: 'transparent', 
                border: `1px solid ${th.border}`, 
                color: th.text, 
                width: 36, 
                height: 36, 
                borderRadius: '50%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                cursor: 'pointer' 
              }}
            >
              <X size={18} />
            </button>

            {/* Menu Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: G }}>
                <Sparkles size={20} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>Sierra Real Estate intelligence</span>
              </div>
              <h2 style={{ margin: '0.25rem 0 0 0', fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300 }}>
                {aiSupportTab === 'menu' && 'Sierra AI Executive Support'}
                {aiSupportTab === 'map' && 'Map Sourcing Intelligence'}
                {aiSupportTab === 'roi' && 'AI ROI Yield Ranking'}
                {aiSupportTab === 'pricing' && 'Precise pricing Index'}
                {aiSupportTab === 'tour' && 'S24 Ultra Virtual Tours'}
                {aiSupportTab === 'advice' && 'Bilingual AI Broker Advisory'}
                {aiSupportTab === 'matches' && 'Intelligent Unit Matcher'}
                {aiSupportTab === 'dream' && 'Compound Selection Advisor'}
              </h2>
            </div>

            {/* ══ CONDITIONAL DRAWER TABS ══ */}
            
            {/* SUB-MENU TABS */}
            {aiSupportTab !== 'menu' && (
              <button 
                onClick={() => setAiSupportTab('menu')}
                style={{ 
                  alignSelf: 'flex-start', 
                  background: 'transparent', 
                  border: `1px solid ${th.border}`, 
                  color: G, 
                  padding: '6px 14px', 
                  borderRadius: '8px', 
                  fontSize: '0.75rem', 
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                ← Back to AI Menu
              </button>
            )}

            {/* 1. Main Options Grid */}
            {aiSupportTab === 'menu' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => setAiSupportTab('map')} 
                  style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '1rem', padding: '1.25rem', background: th.card, border: `1px solid ${th.border}`, borderRadius: '16px', color: '#fff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <MapPin size={24} color={G} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Map Intelligent Search (Live Map)</strong>
                    <span style={{ fontSize: '0.75rem', color: th.textSub }}>Press compound pins to view active sourced units directly.</span>
                  </div>
                  <ChevronRight size={18} style={{ marginLeft: 'auto' }} />
                </button>

                <button 
                  onClick={() => setAiSupportTab('roi')} 
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: th.card, border: `1px solid ${th.border}`, borderRadius: '16px', color: '#fff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <TrendingUp size={24} color={G} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Best ROI Investment Analysis by AI</strong>
                    <span style={{ fontSize: '0.75rem', color: th.textSub }}>Rental yields & compound appreciation indexes in EGP.</span>
                  </div>
                  <ChevronRight size={18} style={{ marginLeft: 'auto' }} />
                </button>

                <button 
                  onClick={() => setAiSupportTab('pricing')} 
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: th.card, border: `1px solid ${th.border}`, borderRadius: '16px', color: '#fff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <DollarSign size={24} color={G} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Unit Precise Pricing</strong>
                    <span style={{ fontSize: '0.75rem', color: th.textSub }}>Fuzzy price-per-sqm calculator modeled for Egypt.</span>
                  </div>
                  <ChevronRight size={18} style={{ marginLeft: 'auto' }} />
                </button>

                <button 
                  onClick={() => setAiSupportTab('tour')} 
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: th.card, border: `1px solid ${th.border}`, borderRadius: '16px', color: '#fff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <Smartphone size={24} color={G} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Galaxy S24 Ultra Virtual Tours</strong>
                    <span style={{ fontSize: '0.75rem', color: th.textSub }}>Capture and upload 360° panoramas directly.</span>
                  </div>
                  <ChevronRight size={18} style={{ marginLeft: 'auto' }} />
                </button>

                <button 
                  onClick={() => setAiSupportTab('advice')} 
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: th.card, border: `1px solid ${th.border}`, borderRadius: '16px', color: '#fff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <Bot size={24} color={G} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Ask for Advice - Sierra AI Broker</strong>
                    <span style={{ fontSize: '0.75rem', color: th.textSub }}>Egypt\'s only specialized AI broker answering all trends.</span>
                  </div>
                  <ChevronRight size={18} style={{ marginLeft: 'auto' }} />
                </button>

                <button 
                  onClick={() => setAiSupportTab('matches')} 
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: th.card, border: `1px solid ${th.border}`, borderRadius: '16px', color: '#fff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <Layers size={24} color={G} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Best Units Matches (Listing Search)</strong>
                    <span style={{ fontSize: '0.75rem', color: th.textSub }}>Bento-grid priority list based on direct owner ratio.</span>
                  </div>
                  <ChevronRight size={18} style={{ marginLeft: 'auto' }} />
                </button>

                <button 
                  onClick={() => setAiSupportTab('dream')} 
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: th.card, border: `1px solid ${th.border}`, borderRadius: '16px', color: '#fff', cursor: 'pointer', textAlign: 'left' }}
                >
                  <Heart size={24} color={G} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>AI Compound Selector</strong>
                    <span style={{ fontSize: '0.75rem', color: th.textSub }}>Decide the ideal dream home zone and lifestyle compound.</span>
                  </div>
                  <ChevronRight size={18} style={{ marginLeft: 'auto' }} />
                </button>
              </div>
            )}

            {/* 2. Map Module */}
            {aiSupportTab === 'map' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: th.textSub }}>Compounds index by sourcing count:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {DETAILED_COMPOUNDS.map(c => (
                    <div 
                      key={c}
                      onClick={() => {
                        setSelectedCompounds([c]);
                        setShowAiSupport(false);
                      }}
                      style={{ 
                        padding: '1rem', 
                        background: 'rgba(255,255,255,0.01)', 
                        border: `1px solid ${th.border}`, 
                        borderRadius: '12px', 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{c}</span>
                      <span style={{ color: G, fontFamily: "'DM Mono', monospace" }}>{c.includes('Lake') ? '14 Units' : '9 Units'}</span>
                    </div>
                  ))}
                </div>
                <Link href="/map" style={{ width: '100%' }}>
                  <button style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg, ${G2}, ${G})`, color: '#000', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                    Open Live Sourcing Map
                  </button>
                </Link>
              </div>
            )}

            {/* 3. ROI Module */}
            {aiSupportTab === 'roi' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: th.textSub, marginBottom: '0.25rem' }}>Purchase Price (EGP)</label>
                  <input 
                    type="range" 
                    min={4000000} 
                    max={30000000} 
                    value={roiPrice} 
                    onChange={e => setRoiPrice(Number(e.target.value))} 
                    style={{ width: '100%', accentColor: G }} 
                  />
                  <span style={{ fontSize: '0.9rem', color: G, fontFamily: "'DM Mono', monospace" }}>EGP {roiPrice.toLocaleString()}</span>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: th.textSub, marginBottom: '0.25rem' }}>Expected Rent (Monthly)</label>
                  <input 
                    type="range" 
                    min={20000} 
                    max={200000} 
                    value={roiRent} 
                    onChange={e => setRoiRent(Number(e.target.value))} 
                    style={{ width: '100%', accentColor: G }} 
                  />
                  <span style={{ fontSize: '0.9rem', color: G, fontFamily: "'DM Mono', monospace" }}>EGP {roiRent.toLocaleString()}</span>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(233,193,118,0.04)', border: `1px solid ${th.border}`, borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: th.textSub }}>Calculated Gross Rental Yield</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 700, color: G, fontFamily: "'DM Mono', monospace" }}>{grossYield.toFixed(2)}%</span>
                </div>

                <Link href="/roi" style={{ width: '100%' }}>
                  <button style={{ width: '100%', padding: '12px', background: 'transparent', border: `1px solid ${th.border}`, color: th.text, borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                    Open Extended ROI Analyzer Page
                  </button>
                </Link>
              </div>
            )}

            {/* 4. Pricing Module */}
            {aiSupportTab === 'pricing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: th.textSub, marginBottom: '0.25rem' }}>Target Compound</label>
                  <select 
                    value={calcCompound} 
                    onChange={e => setCalcCompound(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: th.bg, color: th.text, border: `1px solid ${th.border}`, borderRadius: '8px' }}
                  >
                    <option value="lake-view">Lake View Residence</option>
                    <option value="mivida">Mivida Emaar</option>
                    <option value="mountain-view">Mountain View Hyde Park</option>
                    <option value="madinaty">Madinaty TMG</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: th.textSub, marginBottom: '0.25rem' }}>Area Size (m²)</label>
                  <input 
                    type="range" 
                    min={80} 
                    max={400} 
                    value={calcArea} 
                    onChange={e => setCalcArea(Number(e.target.value))} 
                    style={{ width: '100%', accentColor: G }} 
                  />
                  <span style={{ fontSize: '0.9rem', color: G, fontFamily: "'DM Mono', monospace" }}>{calcArea} m²</span>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(233,193,118,0.04)', border: `1px solid ${th.border}`, borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: th.textSub }}>AI Estimated Price per Sqm</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: G, fontFamily: "'DM Mono', monospace" }}>
                    EGP {calcCompound === 'lake-view' ? '68,000' : '72,000'}
                  </span>
                </div>

                <Link href="/pricing" style={{ width: '100%' }}>
                  <button style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg, ${G2}, ${G})`, color: '#000', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                    Open Precise Pricing Tool
                  </button>
                </Link>
              </div>
            )}

            {/* 5. Virtual Tours S24 Ultra */}
            {aiSupportTab === 'tour' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: 'rgba(255,255,255,0.01)', border: `1px solid ${th.border}`, borderRadius: '12px', padding: '12px' }}>
                  <Smartphone size={24} color={G} style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#fff', display: 'block' }}>Galaxy S24 Ultra Calibration</strong>
                    <span style={{ fontSize: '0.75rem', color: th.textSub }}>Mount at 1.5m, set camera to Pro Ultra-Wide 0.6x, and capture 360° panorama.</span>
                  </div>
                </div>

                <div 
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ 
                    height: '180px', 
                    background: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80')",
                    backgroundSize: 'cover',
                    backgroundPositionX: `${bgPosition}px`,
                    borderRadius: '12px',
                    border: `1px solid ${G}`,
                    cursor: 'grab'
                  }}
                />

                <Link href="/virtual-tour" style={{ width: '100%' }}>
                  <button style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg, ${G2}, ${G})`, color: '#000', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                    Launch S24 Ultra Virtual Tour Hub
                  </button>
                </Link>
              </div>
            )}

            {/* 6. Ask Advice Chat */}
            {aiSupportTab === 'advice' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: `1px solid ${th.border}`, borderRadius: '12px', fontSize: '0.85rem' }}>
                  <strong style={{ color: G, display: 'block', marginBottom: '4px' }}>Sierra AI Advisor Broker</strong>
                  I am specialized in Golden Square, Suez Road and Shorouk sectors. Ask me about average price per sqm or property yields!
                </div>
                <Link href="/advice" style={{ width: '100%' }}>
                  <button style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg, ${G2}, ${G})`, color: '#000', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                    Open Live AI Advice Portal
                  </button>
                </Link>
              </div>
            )}

            {/* 7. Smart Matches bento */}
            {aiSupportTab === 'matches' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {SAMPLE_LISTINGS.slice(0, 3).map(l => (
                  <div key={l.id} style={{ padding: '12px', background: th.card, border: `1px solid ${th.border}`, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.85rem' }}>{l.title}</strong>
                      <span style={{ fontSize: '0.75rem', color: th.textSub }}>{l.compound} · {l.beds} Beds</span>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: G }}>{l.score}%</span>
                  </div>
                ))}
                <Link href="/matches" style={{ width: '100%' }}>
                  <button style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg, ${G2}, ${G})`, color: '#000', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                    View Curated Bento Matches
                  </button>
                </Link>
              </div>
            )}

            {/* 8. Dream Advisor Questionnaire */}
            {aiSupportTab === 'dream' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
                {dreamStep <= 2 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: G }}>Question {dreamStep} of 2</span>
                    {dreamStep === 1 ? (
                      <div>
                        <h4 style={{ margin: '0 0 1rem 0' }}>What is your core investment priority?</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <button onClick={() => setDreamStep(2)} style={{ padding: '10px', background: 'transparent', border: `1px solid ${th.border}`, borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Luxury Lifestyles</button>
                          <button onClick={() => setDreamStep(2)} style={{ padding: '10px', background: 'transparent', border: `1px solid ${th.border}`, borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>High Occupancy Yields</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 style={{ margin: '0 0 1rem 0' }}>Target budget segment?</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <button onClick={() => { setDreamBudget('low'); setDreamStep(3); }} style={{ padding: '10px', background: 'transparent', border: `1px solid ${th.border}`, borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Under 8M EGP</button>
                          <button onClick={() => { setDreamBudget('high'); setDreamStep(3); }} style={{ padding: '10px', background: 'transparent', border: `1px solid ${th.border}`, borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>15M+ EGP</button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: G }}>AI Recommendation:</h4>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600, display: 'block', marginBottom: '1rem' }}>
                      {dreamBudget === 'low' ? 'Madinaty Talaat Moustafa' : 'Lake View Residence'}
                    </span>
                    <button onClick={() => setDreamStep(1)} style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${th.border}`, color: th.text, borderRadius: '8px', fontSize: '0.75rem', cursor: 'pointer' }}>
                      Reset Quiz
                    </button>
                  </div>
                )}
                
                <Link href="/dream-decision" style={{ width: '100%', marginTop: '1rem' }}>
                  <button style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg, ${G2}, ${G})`, color: '#000', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                    Open Dream Advisor Page
                  </button>
                </Link>
              </div>
            )}

            {/* Sidebar Branding footer */}
            <div style={{ marginTop: 'auto', borderTop: `1px solid ${th.border}`, paddingTop: '1rem', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldLogo size={24} />
              <span style={{ fontSize: '0.7rem', color: th.textMuted }}>Sierra Blu Intelligence OS © 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* ══ DYNAMIC LUXURY REQUEST POPUP MODAL ══ */}
      {showRequestModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(4,14,28,0.85)', 
          backdropFilter: 'blur(12px)', 
          zIndex: 1000, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '24px'
        }}>
          <div style={{ 
            width: '100%', 
            maxWidth: '460px', 
            background: th.bg, 
            border: `1px solid ${G}`, 
            borderRadius: '24px', 
            padding: '2.5rem', 
            position: 'relative',
            boxShadow: '0 12px 40px rgba(233,193,118,0.15)'
          }}>
            <button 
              onClick={() => setShowRequestModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: th.text, cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: G, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.15em', display: 'block' }}>
                Sierra Concierge Matching
              </span>
              <h3 style={{ margin: '0.25rem 0', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.75rem', color: '#fff' }}>
                Request Custom Property Match
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: th.textSub }}>
                We will match you with direct owner lists in {selectedCompounds.join(', ') || 'New Cairo Compounds'}.
              </p>
            </div>

            {requestSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', color: '#22c55e', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1rem auto' }}>
                  <Check size={24} />
                </div>
                <strong style={{ display: 'block', fontSize: '1.1rem', color: G, marginBottom: '0.25rem' }}>Request Sent Successfully!</strong>
                <span style={{ fontSize: '0.8rem', color: th.textSub }}>Our AI Leila will vet the database and email results to you in minutes.</span>
              </div>
            ) : (
              <form onSubmit={submitRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: th.textSub, marginBottom: '0.4rem' }}>Your Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter your full name" 
                    value={requestName}
                    onChange={e => setRequestName(e.target.value)}
                    style={{ width: '100%', padding: '12px', background: th.card, border: `1px solid ${th.border}`, borderRadius: '10px', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: th.textSub, marginBottom: '0.4rem' }}>WhatsApp Mobile Number</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="e.g. +20 100 123 4567" 
                    value={requestPhone}
                    onChange={e => setRequestPhone(e.target.value)}
                    style={{ width: '100%', padding: '12px', background: th.card, border: `1px solid ${th.border}`, borderRadius: '10px', color: '#fff', outline: 'none' }}
                  />
                </div>

                <button 
                  type="submit" 
                  style={{ width: '100%', padding: '14px', background: `linear-gradient(135deg, ${G2}, ${G})`, color: '#000', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}
                >
                  Submit Match Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#040E1C', color: '#EFF8F7', padding: '60px 0 30px', borderTop: '1px solid rgba(233,193,118,0.12)', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <ShieldLogo size={36} />
                <div>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', fontWeight: 600, color: G }}>SIERRA BLU REALTY</span>
                  <span style={{ display: 'block', fontSize: '6px', color: 'rgba(255,255,255,0.4)', letterSpacing: '.3em' }}>BEYOND BROKERAGE</span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(239,248,247,0.45)', lineHeight: 1.7, maxWidth: '300px' }}>
                Egypt\'s first tech-driven, intelligence-led real estate advisory. Grounded in New Cairo, Suez Suez Corridor, and the Administrative Capital.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontSize: '0.8rem', color: G, textTransform: 'uppercase', marginBottom: '1rem' }}>Standalones</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'rgba(239,248,247,0.45)' }}>
                <Link href="/map" className="hover:text-white">Map search</Link>
                <Link href="/roi" className="hover:text-white">ROI Calculator</Link>
                <Link href="/pricing" className="hover:text-white">Pricing Index</Link>
                <Link href="/virtual-tour" className="hover:text-white">Virtual Tours</Link>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.8rem', color: G, textTransform: 'uppercase', marginBottom: '1rem' }}>Inquiries</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'rgba(239,248,247,0.45)' }}>
                <Link href="/advice" className="hover:text-white">Ask Sierra Advice</Link>
                <Link href="/matches" className="hover:text-white">Smart Match Finder</Link>
                <Link href="/dream-decision" className="hover:text-white">Dream Compound Selector</Link>
              </div>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid rgba(239,248,247,0.07)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(239,248,247,0.28)' }}>
            <span>© 2026 Sierra Blu Realty. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '15px' }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
