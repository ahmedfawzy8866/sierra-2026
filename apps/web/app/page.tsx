'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useI18n } from '@/lib/I18nContext';
import { useTheme } from 'next-themes';
import { InventoryService, Property } from '@/lib/services/InventoryService';
import ShieldLogo from '@/components/Landing/ShieldLogo';
import PropCard from '@/components/Landing/PropCard';

const LiveMap = dynamic(() => import('@/components/Maps/LiveMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-900/50 animate-pulse flex items-center justify-center text-slate-500 font-serif">Initializing Intelligence Map...</div>,
});

// ══════════════════════════════════════════════════════════
//  DESIGN TOKENS
// ══════════════════════════════════════════════════════════
const G = '#E9C176';
const G2 = '#C8961A';

const THEMES = {
  dark: {
    bg: '#0D2035', bgAlt: '#0A1520', bg2: '#122A47',
    surface: 'rgba(255,255,255,0.055)', surfaceHover: 'rgba(233,193,118,0.10)',
    card: '#122A47', cardBorder: 'rgba(233,193,118,0.10)',
    border: 'rgba(233,193,118,0.18)', borderHover: 'rgba(233,193,118,0.45)',
    text: '#EFF8F7', textSub: 'rgba(239,248,247,0.78)', textMuted: 'rgba(239,248,247,0.50)',
    navBg: 'rgba(13,32,53,0.96)', footerBg: '#091828', heroBg: '#0A1520',
  },
  light: {
    bg: '#D5E8E6', bgAlt: '#C0D6D4', bg2: '#E2EDEC',
    surface: 'rgba(27,108,168,0.08)', surfaceHover: 'rgba(233,193,118,0.14)',
    card: '#E2EDEC', cardBorder: 'rgba(27,108,168,0.14)',
    border: 'rgba(27,108,168,0.20)', borderHover: 'rgba(233,193,118,0.55)',
    text: '#071422', textSub: 'rgba(7,20,34,0.78)', textMuted: 'rgba(7,20,34,0.56)',
    navBg: 'rgba(213,232,230,0.97)', footerBg: '#040E1C', heroBg: '#C0D6D4',
  },
};

// ══════════════════════════════════════════════════════════
//  COPY (BILINGUAL)
// ══════════════════════════════════════════════════════════
const COPY = {
  en: {
    dir: 'ltr' as const,
    brand: 'SIERRA BLU', sub: 'REALTY',
    tagline: 'INTELLIGENCE-LED PROPERTY ADVISORY',
    nav: ['Properties', 'Intelligence', 'About', 'Contact'],
    cta: 'Enter Portal',
    heroTag: 'Beyond Brokerage',
    heroH1: ['Refined', 'Decisions.'],
    heroItalic: 'Intelligence-Led.',
    heroSub: 'Precision. Property. Purpose.',
    heroDesc: 'Exceptional properties, precisely matched. We guide discerning investors toward Egypt\'s finest addresses — curated by expert advisors, refined by AI.',
    btnDiscover: 'Explore Properties',
    btnView: 'Meet Sierra AI',
    stats: [['1,200+', 'Properties'], ['98%', 'Match Rate'], ['8+', 'Compounds'], ['4s', 'Response']],
    scroll: 'Scroll',
    secListings: 'Exclusive Listings',
    h2Listings: 'Properties worth your attention.',
    viewAll: 'View All →',
    searchType: 'Property Type', searchRooms: 'Bedrooms', searchCompound: 'Compound', searchBudget: 'Budget', searchBtn: 'Search',
    smartTitle: 'Smart Filters',
    smartHint: 'Use quick intents or combine filters to surface stronger matches instantly.',
    smartPresets: ['All', 'Family Ready', 'High ROI', 'Signature Homes'],
    smartMatched: 'Matches',
    smartNoMatches: 'No exact matches. Try clearing one filter to widen the search.',
    smartReset: 'Reset filters',
    smartSpotlight: 'Sierra Match Spotlight',
    smartScore: 'Match score',
    heroPulseLabel: 'Portfolio pulse',
    heroPulseValue: '28 verified opportunities this week',
    beds: 'bed', baths: 'bath',
    secWhy: 'Why Sierra Blu',
    h2Why: 'The Sierra Blu Standard',
    why: [
      { icon: '◆', title: 'Curated by Hand', desc: 'Each listing personally reviewed by senior advisors. No noise, no overpricing — only properties that meet our exacting standard.' },
      { icon: '◈', title: 'Grounded in Data', desc: 'AI-driven ROI modelling, live market comparisons, and growth corridor analysis. Conviction backed by evidence.' },
      { icon: '◉', title: 'Dedicated Advisory', desc: 'From first inquiry to final signature, one advisor who knows your criteria — and responds in four seconds.' },
    ],
    bannerH: 'Exceptional Homes, Intelligent Matching',
    bannerSub: 'منازل استثنائية، مطابقة ذكية',
    bannerBtn: 'View Properties',
    secMap: 'Market Intelligence',
    mapH1: 'New Cairo', mapH2: 'Investment Map',
    mapDesc: 'Live data across New Cairo\'s premium zones. Track growth corridors, rental yields, and off-market signals — updated from our property database.',
    zones: [
      { area: 'Fifth Settlement', stat: 'Growth +12%', color: '#4ECDC4' },
      { area: 'Madinaty', stat: 'High Demand', color: G },
      { area: 'Mountain View', stat: 'Yield 8%', color: '#7EA8B4' },
      { area: 'Mostakbal City', stat: 'Off‑Market', color: '#C084FC' },
    ],
    mapBtn: 'Explore AI Insights →',
    secAI: 'Meet Sierra',
    aiH: 'An Intelligence That Understands Property',
    aiSub: 'Egypt\'s first official AI real estate advisor',
    aiDesc: 'Sierra is always on — reading the market, answering your questions, and matching you with properties that fit your exact criteria. Start a conversation.',
    aiCTA: 'Start on Telegram →',
    aiFeatures: ['Instant property matching', 'Market analytics & ROI', 'Arabic & English', '24/7 availability'],
    aiChat: [
      { from: 'user', text: 'Looking for a 4‑bed villa under 15M EGP in Fifth Settlement' },
      { from: 'bot', text: 'Found 7 matching properties. Top pick: Villa Lumière — 5 beds, 480 m², EGP 14.2M. Annual yield: 8.3%. Shall I send the full report?' },
    ],
    secTesti: 'Client Stories',
    h2Testi: 'Perspectives',
    testimonials: [
      { q: 'Sierra matched me with a villa I hadn\'t considered. The AI understood my investment criteria better than I\'d articulated them.', name: 'Marcus Chen', role: 'Investor · Cairo', i: 'MC' },
      { q: 'A question at 2am, answered in seconds. That\'s not service — that\'s a different category.', name: 'Layla Hassan', role: 'Buyer · Dubai', i: 'LH' },
      { q: 'We found our compound home in 48 hours. The data, the filtering, the advisor — everything worked as if built specifically for us.', name: 'Omar Mansour', role: 'Family Buyer · Fifth Settlement', i: 'OM' },
    ],
    ctaTag: 'Begin Your Search',
    ctaH: 'Find Your Place in New Cairo',
    ctaSub: 'Leave your details — a Sierra advisor reaches out within four seconds.',
    formName: 'Your name', formPhone: 'Mobile number', formSubmit: 'Get in Touch',
    formSuccess: 'Thank you. A Sierra advisor will be in touch within four seconds.',
    footDesc: 'Beyond Brokerage. Intelligence-led real estate advisory for discerning investors in New Cairo and beyond.',
    footNav: 'Navigation', footNavLinks: ['Properties', 'Intelligence', 'About Us', 'Careers', 'Contact'],
    footMarkets: 'Markets', footMarketLinks: ['New Cairo', 'Fifth Settlement', 'Madinaty', 'Mostakbal City', 'Mountain View'],
    footContact: 'Contact',
    copyright: '© 2026 Sierra Blu Realty. All rights reserved.',
    legal: ['Privacy Policy', 'Terms of Service', 'Cookies'],
  },
  ar: {
    dir: 'rtl' as const,
    brand: 'سييرا بلو', sub: 'للعقارات',
    tagline: 'استشارات عقارية مدعومة بالذكاء الاصطناعي',
    nav: ['العقارات', 'الذكاء', 'عنّا', 'اتصل'],
    cta: 'الدخول للبوابة',
    heroTag: 'أبعد من الوساطة',
    heroH1: ['قرارات', 'أرقى.'],
    heroItalic: 'مدعومة بالذكاء.',
    heroSub: 'دقة. عقار. غاية.',
    heroDesc: 'عقارات استثنائية، مطابقة بدقة. نوجّه المستثمرين نحو أفخر العناوين في مصر — منتقاة بخبرة إنسانية، مُحسَّنة بالذكاء الاصطناعي.',
    btnDiscover: 'اكتشف العقارات',
    btnView: 'تعرّف على سييرا',
    stats: [['١٢٠٠+', 'عقار'], ['٩٨٪', 'دقة المطابقة'], ['٨+', 'كمباوند'], ['٤ث', 'الرد']],
    scroll: 'اسحب',
    secListings: 'قوائم حصرية',
    h2Listings: 'عقارات تستحق اهتمامك.',
    viewAll: '← عرض الكل',
    searchType: 'نوع العقار', searchRooms: 'غرف النوم', searchCompound: 'الكمباوند', searchBudget: 'الميزانية', searchBtn: 'بحث',
    smartTitle: 'فلاتر ذكية',
    smartHint: 'استخدم نوايا البحث السريعة أو اجمع الفلاتر للوصول لأفضل المطابقات فوراً.',
    smartPresets: ['الكل', 'مناسب للعائلات', 'عائد مرتفع', 'عقارات مميزة'],
    smartMatched: 'نتائج',
    smartNoMatches: 'لا توجد نتائج مطابقة تماماً. جرّب إزالة أحد الفلاتر لتوسيع البحث.',
    smartReset: 'إعادة ضبط الفلاتر',
    smartSpotlight: 'أفضل مطابقة من سييرا',
    smartScore: 'درجة المطابقة',
    heroPulseLabel: 'نبض المحفظة',
    heroPulseValue: '٢٨ فرصة موثقة هذا الأسبوع',
    beds: 'غرف', baths: 'حمامات',
    secWhy: 'لماذا سييرا بلو',
    h2Why: 'معيار سييرا بلو',
    why: [
      { icon: '◆', title: 'اختيار بعناية', desc: 'كل قائمة يراجعها مستشارونا الكبار شخصياً. لا ضجيج، لا مبالغة — فقط عقارات تستوفي معاييرنا الصارمة.' },
      { icon: '◈', title: 'مبني على البيانات', desc: 'نمذجة عائد الاستثمار بالذكاء الاصطناعي، ومقارنات السوق الحية، وتحليل ممرات النمو. قرارات مبنية على الأدلة.' },
      { icon: '◉', title: 'استشارة متخصصة', desc: 'من أول استفسار لآخر توقيع، مستشار واحد يعرف معاييرك ويستجيب في أربع ثوانٍ.' },
    ],
    bannerH: 'منازل استثنائية، مطابقة ذكية',
    bannerSub: 'Exceptional Homes, Intelligent Matching',
    bannerBtn: 'عرض العقارات',
    secMap: 'ذكاء السوق',
    mapH1: 'القاهرة الجديدة', mapH2: 'خريطة الاستثمار',
    mapDesc: 'بيانات حية عبر مناطق الاستثمار المميزة في القاهرة الجديدة. تتبع ممرات النمو وعوائد الإيجار والإشارات خارج السوق.',
    zones: [
      { area: 'التجمع الخامس', stat: 'نمو +١٢٪', color: '#4ECDC4' },
      { area: 'مدينتي', stat: 'طلب مرتفع', color: G },
      { area: 'ماونتن فيو', stat: 'عائد ٨٪', color: '#7EA8B4' },
      { area: 'مستقبل سيتي', stat: 'خارج السوق', color: '#C084FC' },
    ],
    mapBtn: '← استكشف رؤى الذكاء الاصطناعي',
    secAI: 'تعرّف على سييرا',
    aiH: 'ذكاء يفهم العقارات حقاً',
    aiSub: 'أول مستشار عقاري ذكي رسمي في مصر',
    aiDesc: 'سييرا تعمل على مدار الساعة — تقرأ السوق، تجيب أسئلتك، وتطابقك مع عقارات تناسب معاييرك بالضبط. ابدأ محادثة.',
    aiCTA: 'ابدأ على تيليجرام ←',
    aiFeatures: ['مطابقة فورية للعقارات', 'تحليلات السوق وعائد الاستثمار', 'عربي وإنجليزي', 'متاح ٢٤/٧'],
    aiChat: [
      { from: 'user', text: 'بدور على فيلا ٤ غرف أقل من ١٥م في التجمع الخامس' },
      { from: 'bot', text: 'وجدت ٧ عقارات تطابق معاييرك. أفضل خيار: فيلا لوميير — ٥ غرف، ٤٨٠م²، ١٤.٢م ج.م. عائد سنوي: ٨.٣٪. أرسل لك التقرير الكامل؟' },
    ],
    secTesti: 'قصص عملائنا',
    h2Testi: 'آراء عملائنا',
    testimonials: [
      { q: 'سييرا طابقتني مع فيلا لم أكن لأفكر فيها. فهمت معايير استثماري أفضل مما شرحتها.', name: 'ماركوس تشن', role: 'مستثمر · القاهرة', i: 'MC' },
      { q: 'سؤال الساعة ٢ صباحاً، والرد في ثوانٍ. هذه ليست خدمة — هذه فئة مختلفة.', name: 'ليلى حسن', role: 'مشترية · دبي', i: 'LH' },
      { q: 'وجدنا منزل الكمباوند في ٤٨ ساعة. البيانات، التصفية، المستشار — كل شيء عمل كأنه بُني لنا.', name: 'عمر منصور', role: 'مشتري عائلي · التجمع الخامس', i: 'OM' },
    ],
    ctaTag: 'ابدأ بحثك',
    ctaH: 'ابحث عن مكانك في القاهرة الجديدة',
    ctaSub: 'اترك بياناتك — مستشار سييرا سيتواصل معك خلال أربع ثوانٍ.',
    formName: 'اسمك', formPhone: 'رقم الموبايل', formSubmit: 'تواصل معنا',
    formSuccess: 'شكراً. مستشار سييرا سيتواصل معك خلال أربع ثوانٍ.',
    footDesc: 'أبعد من الوساطة. استشارات عقارية مدعومة بالذكاء الاصطناعي للمستثمرين في القاهرة الجديدة.',
    footNav: 'روابط التنقل', footNavLinks: ['العقارات', 'الذكاء', 'عنّا', 'الوظائف', 'اتصل'],
    footMarkets: 'الأسواق', footMarketLinks: ['القاهرة الجديدة', 'التجمع الخامس', 'مدينتي', 'مستقبل سيتي', 'ماونتن فيو'],
    footContact: 'تواصل معنا',
    copyright: '© ٢٠٢٦ سييرا بلو للعقارات. جميع الحقوق محفوظة.',
    legal: ['سياسة الخصوصية', 'شروط الخدمة', 'ملفات الارتباط'],
  },
};

// ══════════════════════════════════════════════════════════
//  STATIC LISTINGS (fallback while Firebase loads)
// ══════════════════════════════════════════════════════════
const STATIC_LISTINGS = [
  { id: 1, title: 'Aurora Penthouse', titleAr: 'بنتهاوس أورورا', location: 'Madinaty · New Cairo', locationAr: 'مدينتي · القاهرة الجديدة', price: 'EGP 8,500,000', beds: 4, baths: 3, sqft: '320 m²', badge: 'Hidden Gem', badgeColor: '#7C3AED', furnished: 'furnished', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=80' },
  { id: 2, title: 'Villa Lumière', titleAr: 'فيلا لوميير', location: 'Mountain View · 5th Settlement', locationAr: 'ماونتن فيو · التجمع الخامس', price: 'EGP 14,200,000', beds: 5, baths: 4, sqft: '480 m²', badge: 'Featured', badgeColor: '#C8961A', furnished: 'unfurnished', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80' },
  { id: 3, title: 'The Boulevard', titleAr: 'ذا بوليفار', location: 'Mostakbal City · Future', locationAr: 'مستقبل سيتي · المستقبل', price: 'EGP 3,800,000', beds: 3, baths: 2, sqft: '185 m²', badge: 'New', badgeColor: '#1B6CA8', furnished: 'furnished', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80' },
  { id: 4, title: 'Emirates Crown', titleAr: 'إيمارتس كراون', location: 'Fifth Settlement · Cairo', locationAr: 'التجمع الخامس · القاهرة', price: 'EGP 22,000,000', beds: 6, baths: 5, sqft: '650 m²', badge: 'Off Market', badgeColor: '#059669', furnished: 'unfurnished', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80' },
  { id: 5, title: 'Palm Residences', titleAr: 'بالم ريزيدنسز', location: 'Madinaty · Block 7', locationAr: 'مدينتي · بلوك ٧', price: 'EGP 5,900,000', beds: 3, baths: 3, sqft: '240 m²', badge: 'High ROI', badgeColor: '#DC2626', furnished: 'furnished', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80' },
  { id: 6, title: 'Sky Tower Penthouse', titleAr: 'بنتهاوس سكاي تاور', location: 'Downtown New Cairo', locationAr: 'وسط القاهرة الجديدة', price: 'EGP 11,500,000', beds: 4, baths: 4, sqft: '380 m²', badge: 'Price Reduced', badgeColor: '#D97706', furnished: 'unfurnished', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80' },
];

const _ZONE_COORDS: [number, number][] = [
  [30.0071, 31.4345],
  [30.0972, 31.6314],
  [30.0320, 31.4720],
  [30.1400, 31.7400],
];

const MAX_ROOMS_FILTER = '4';
const PRICE_RANGES = {
  '0-5': { min: 0, max: 5, inclusiveMax: false },
  '5-10': { min: 5, max: 10, inclusiveMax: true },
  '10-20': { min: 10, max: 20, inclusiveMax: true },
  '20+': { min: 20, max: Infinity, inclusiveMax: false },
} as const;

type FiltersState = { rooms: string; price: string; location: string; furnished: string };

const EMPTY_FILTERS: FiltersState = { rooms: '', price: '', location: '', furnished: '' };
const FILTER_PRESETS: FiltersState[] = [
  EMPTY_FILTERS,
  { rooms: '4', price: '', location: 'fifth', furnished: 'furnished' },
  { rooms: '3', price: '5-10', location: 'madinaty', furnished: '' },
  { rooms: '4', price: '20+', location: 'mountain', furnished: 'unfurnished' },
];
// Smart score starts at the minimum user-visible confidence baseline and grows with clear weights.
const BASE_MATCH_SCORE = 62;
const MIN_MATCH_SCORE = 62;
const MAX_MATCH_SCORE = 98;
const SCORE_WEIGHTS = {
  rooms: 12,
  priceMatch: 14,
  location: 10,
  furnished: 8,
  presetAffinity: 4,
  premiumSpaceBonusCap: 6,
} as const;
const LOCATION_SCORE_MATCHES: Record<string, string[]> = {
  fifth: ['fifth'],
  madinaty: ['madinaty'],
  mountain: ['mountain'],
  mostakbal: ['mostakbal', 'future'],
};

// ══════════════════════════════════════════════════════════
//  MAIN LANDING PAGE
// ══════════════════════════════════════════════════════════
export default function LandingPage() {
  const { locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [activeZone, setActiveZone] = useState<number | null>(null);
  const [listingsDealt, setListingsDealt] = useState(false);
  const [featured, setFeatured] = useState<Property[]>([]);
  const [logoColor, setLogoColor] = useState<'gold' | 'white' | 'dark'>('gold');
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS);
  const [activePreset, setActivePreset] = useState(0);
  const listingsSectionRef = useRef<HTMLDivElement>(null);

  const lang = locale === 'ar' ? 'ar' : 'en';
  const mode = (theme === 'light' ? 'light' : 'dark') as 'light' | 'dark';
  const th = THEMES[mode];
  const T = COPY[lang];
  const isAr = lang === 'ar';

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setLoaded(true), 80);

    InventoryService.getFeaturedListings(6).then(setFeatured).catch(() => {});

    const onScroll = () => setScrolled(window.scrollY > 55);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [mounted, lang, mode]);

  useEffect(() => {
    if (!listingsSectionRef.current || listingsDealt) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setListingsDealt(true); obs.disconnect(); } }),
      { threshold: 0.12 }
    );
    obs.observe(listingsSectionRef.current);
    return () => obs.disconnect();
  }, [listingsDealt]);

  useEffect(() => { setListingsDealt(false); setTimeout(() => setListingsDealt(true), 100); }, [lang, mode]);

  const sec: React.CSSProperties = { maxWidth: 1280, margin: '0 auto', padding: '0 48px' };

  const listings = featured.length > 0
    ? featured.map((p) => ({
        id: p.id,
        title: p.title,
        titleAr: p.title,
        location: `${p.compound} · ${p.location}`,
        locationAr: `${p.compound} · ${p.location}`,
        price: `EGP ${p.price.toLocaleString()}`,
        beds: p.bedrooms || 3,
        baths: Math.max(1, Math.floor((p.bedrooms || 3) * 0.7)),
        sqft: `${p.area || 200} m²`,
        badge: p.status || 'Available',
        badgeColor: G2,
        furnished: p.finishingType?.toLowerCase().includes('furnish') ? 'furnished' : 'unfurnished',
        img: STATIC_LISTINGS[Math.min(STATIC_LISTINGS.length - 1, featured.indexOf(p))].img,
      }))
    : STATIC_LISTINGS;

  const parsePriceMillions = (priceText: string) => Number((priceText.replace(/[^\d]/g, ''))) / 1_000_000;
  const applyPreset = useCallback((idx: number) => {
    setActivePreset(idx);
    setFilters({ ...(FILTER_PRESETS[idx] || EMPTY_FILTERS) });
  }, []);
  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setActivePreset(0);
  }, []);
  const scrollToListings = useCallback(() => {
    listingsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (!mounted) return null;

  const filteredListings = listings.filter((p) => {
    const matchesRooms = !filters.rooms || (filters.rooms === MAX_ROOMS_FILTER ? p.beds >= Number(MAX_ROOMS_FILTER) : p.beds === Number(filters.rooms));

    const priceMillions = parsePriceMillions(p.price);
    const selectedRange = filters.price ? PRICE_RANGES[filters.price as keyof typeof PRICE_RANGES] : undefined;
    const matchesPrice = !selectedRange || (
      priceMillions >= selectedRange.min &&
      (selectedRange.inclusiveMax ? priceMillions <= selectedRange.max : priceMillions < selectedRange.max)
    );

    const locationText = p.location.toLowerCase();

    const matchesLocation =
      !filters.location ||
      (filters.location === 'fifth' && locationText.includes('fifth')) ||
      (filters.location === 'madinaty' && locationText.includes('madinaty')) ||
      (filters.location === 'mountain' && locationText.includes('mountain')) ||
      (filters.location === 'mostakbal' && (locationText.includes('mostakbal') || locationText.includes('future')));

    const matchesFurnished = !filters.furnished || p.furnished === filters.furnished;

    return matchesRooms && matchesPrice && matchesLocation && matchesFurnished;
  });

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  const quickPresets = T.smartPresets;
  const scoredListings = filteredListings
    .map((p) => {
      let score = BASE_MATCH_SCORE;
      // Larger homes receive a capped premium-space boost to help differentiate similarly filtered results.
      score += Math.min(SCORE_WEIGHTS.premiumSpaceBonusCap, p.beds);
      if (filters.rooms && (filters.rooms === MAX_ROOMS_FILTER ? p.beds >= Number(MAX_ROOMS_FILTER) : p.beds === Number(filters.rooms))) score += SCORE_WEIGHTS.rooms;
      if (filters.price) {
        const priceMillions = parsePriceMillions(p.price);
        const selectedRange = PRICE_RANGES[filters.price as keyof typeof PRICE_RANGES];
        if (selectedRange && priceMillions >= selectedRange.min && (selectedRange.inclusiveMax ? priceMillions <= selectedRange.max : priceMillions < selectedRange.max)) score += SCORE_WEIGHTS.priceMatch;
      }
      const locationTokens = filters.location ? (LOCATION_SCORE_MATCHES[filters.location] || [filters.location]) : [];
      if (filters.location && locationTokens.some((token) => p.location.toLowerCase().includes(token))) score += SCORE_WEIGHTS.location;
      if (filters.furnished && p.furnished === filters.furnished) score += SCORE_WEIGHTS.furnished;
      if (activePreset > 0) score += SCORE_WEIGHTS.presetAffinity;
      return { ...p, smartScore: Math.max(MIN_MATCH_SCORE, Math.min(MAX_MATCH_SCORE, score)) };
    })
    .sort((a, b) => b.smartScore - a.smartScore);
  const spotlightListing = scoredListings[0];
  const smartFilterSelectStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: th.text,
    fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif",
    fontSize: 13,
    fontWeight: 300,
    width: '100%',
    cursor: 'pointer',
  };
  const smartFilterSegments = [
    {
      label: T.searchRooms,
      value: filters.rooms,
      onChange: (value: string) => { setActivePreset(0); setFilters({ ...filters, rooms: value }); },
      opts: [
        { value: '', label: isAr ? 'الكل' : 'Any' },
        { value: '1', label: isAr ? 'غرفة نوم واحدة' : '1 Bedroom' },
        { value: '2', label: isAr ? 'غرفتا نوم' : '2 Bedrooms' },
        { value: '3', label: isAr ? '3 غرف نوم' : '3 Bedrooms' },
        { value: MAX_ROOMS_FILTER, label: isAr ? '4+ غرف نوم' : '4+ Bedrooms' },
      ],
    },
    {
      label: T.searchCompound,
      value: filters.location,
      onChange: (value: string) => { setActivePreset(0); setFilters({ ...filters, location: value }); },
      opts: [
        { value: '', label: isAr ? 'كل المواقع' : 'All Locations' },
        { value: 'fifth', label: isAr ? 'التجمع الخامس' : 'Fifth Settlement' },
        { value: 'madinaty', label: isAr ? 'مدينتي' : 'Madinaty' },
        { value: 'mountain', label: isAr ? 'ماونتن فيو' : 'Mountain View' },
        { value: 'mostakbal', label: isAr ? 'مستقبل سيتي' : 'Mostakbal City' },
      ],
    },
    {
      label: T.searchBudget,
      value: filters.price,
      onChange: (value: string) => { setActivePreset(0); setFilters({ ...filters, price: value }); },
      opts: [
        { value: '', label: isAr ? 'أي ميزانية' : 'Any Budget' },
        { value: '0-5', label: isAr ? 'أقل من ٥م' : 'Under 5M EGP' },
        { value: '5-10', label: isAr ? '٥–١٠م' : '5–10M EGP' },
        { value: '10-20', label: isAr ? '١٠–٢٠م' : '10–20M EGP' },
        { value: '20+', label: isAr ? 'أكثر من ٢٠م' : '20M+ EGP' },
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: th.bg, color: th.text, transition: 'background .5s, color .5s' }} dir={T.dir}>

      {/* ══ NAV ══ */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, background: scrolled ? th.navBg : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${th.border}` : '1px solid transparent', transition: 'all .4s cubic-bezier(.16,1,.3,1)' }}>
        {/* Main navbar */}
        <div style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px md:0 48px', gap: 12 }} className="px-4 md:px-12">
          {/* Logo with color toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1 }}>
            <div style={{ position: 'relative', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <img
                src="/sierra-blu-logo.png"
                alt="Sierra Blu"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: logoColor === 'gold' ? 'none' : logoColor === 'white' ? 'brightness(0) invert(1)' : 'brightness(0)',
                  transition: 'filter .3s ease'
                }}
              />
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isAr ? 14 : 16, fontWeight: 600, letterSpacing: isAr ? '.06em' : '.2em', color: G, lineHeight: 1 }}>{T.brand}</div>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 7, letterSpacing: '.38em', color: th.textSub, marginTop: 2 }}>{T.sub}</div>
            </div>
          </div>

          {/* Mobile-first center nav + filters toggle button */}
          <div className="hidden md:flex items-center gap-6 flex-1">
            {T.nav.map((n) => (
              <span key={n} className="hover:text-secondary transition-colors cursor-pointer" style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.13em', textTransform: 'uppercase', color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{n}</span>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const colors: Array<'gold' | 'white' | 'dark'> = ['gold', 'white', 'dark'];
                const nextColor = colors[(colors.indexOf(logoColor) + 1) % colors.length];
                setLogoColor(nextColor);
              }}
              style={{ background: th.surface, border: `1px solid ${th.border}`, color: logoColor === 'gold' ? G : logoColor === 'white' ? '#fff' : '#000', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s ease' }}
              title="Toggle logo color"
            >
              ◎
            </button>
            <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} style={{ background: th.surface, border: `1px solid ${th.border}`, color: G, padding: '6px 12px', borderRadius: 4, fontSize: 10, fontWeight: 600, letterSpacing: '.1em', cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}>
              {lang === 'en' ? 'AR' : 'EN'}
            </button>
            <button onClick={() => setTheme(mode === 'dark' ? 'light' : 'dark')} style={{ background: th.surface, border: `1px solid ${th.border}`, color: th.textSub, width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {mode === 'dark' ? '☀' : '🌙'}
            </button>
            <button className="hidden sm:inline-flex" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: th.text, border: `1px solid ${th.border}`, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', padding: '7px 16px', borderRadius: 4, whiteSpace: 'nowrap' }}>{T.cta}</button>
          </div>
        </div>

        {/* Smart Filter Bar - Mobile-first responsive */}
        <div style={{ borderTop: `1px solid ${th.border}`, background: mode === 'dark' ? 'rgba(10,21,32,0.8)' : 'rgba(213,232,230,0.8)', backdropFilter: 'blur(12px)', padding: '12px 16px', display: scrolled ? 'grid' : 'none' }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 px-4 md:px-12">
          {/* Rooms Filter */}
          <div>
            <label style={{ fontSize: 8, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: th.textMuted, display: 'block', marginBottom: 2, fontFamily: "'Jost', sans-serif" }}>Rooms</label>
            <select
              value={filters.rooms}
              onChange={(e) => { setActivePreset(0); setFilters({ ...filters, rooms: e.target.value }); }}
              style={{ background: 'transparent', border: `1px solid ${th.border}`, outline: 'none', color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 12, fontWeight: 300, width: '100%', cursor: 'pointer', padding: '6px 8px', borderRadius: 4 }}
            >
              <option value="">Any</option>
              <option value="1">1 Bed</option>
              <option value="2">2 Beds</option>
              <option value="3">3 Beds</option>
              <option value="4">4+ Beds</option>
            </select>
          </div>

          {/* Price Filter */}
          <div>
            <label style={{ fontSize: 8, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: th.textMuted, display: 'block', marginBottom: 2, fontFamily: "'Jost', sans-serif" }}>Price Range</label>
            <select
              value={filters.price}
              onChange={(e) => { setActivePreset(0); setFilters({ ...filters, price: e.target.value }); }}
              style={{ background: 'transparent', border: `1px solid ${th.border}`, outline: 'none', color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 12, fontWeight: 300, width: '100%', cursor: 'pointer', padding: '6px 8px', borderRadius: 4 }}
            >
              <option value="">Any Price</option>
              <option value="0-5">Under 5M EGP</option>
              <option value="5-10">5-10M EGP</option>
              <option value="10-20">10-20M EGP</option>
              <option value="20+">20M+ EGP</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label style={{ fontSize: 8, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: th.textMuted, display: 'block', marginBottom: 2, fontFamily: "'Jost', sans-serif" }}>Location</label>
            <select
              value={filters.location}
              onChange={(e) => { setActivePreset(0); setFilters(prev => ({ ...prev, location: e.target.value })); }}
              style={{ background: 'transparent', border: `1px solid ${th.border}`, outline: 'none', color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 12, fontWeight: 300, width: '100%', cursor: 'pointer', padding: '6px 8px', borderRadius: 4 }}
            >
              <option value="">All Locations</option>
              <option value="fifth">Fifth Settlement</option>
              <option value="madinaty">Madinaty</option>
              <option value="mountain">Mountain View</option>
              <option value="mostakbal">Mostakbal City</option>
            </select>
          </div>

          {/* Furnished Filter */}
          <div>
            <label style={{ fontSize: 8, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: th.textMuted, display: 'block', marginBottom: 2, fontFamily: "'Jost', sans-serif" }}>Furnished</label>
            <select
              value={filters.furnished}
              onChange={(e) => { setActivePreset(0); setFilters({ ...filters, furnished: e.target.value }); }}
              style={{ background: 'transparent', border: `1px solid ${th.border}`, outline: 'none', color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 12, fontWeight: 300, width: '100%', cursor: 'pointer', padding: '6px 8px', borderRadius: 4 }}
            >
              <option value="">Any</option>
              <option value="furnished">Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              style={{ width: '100%', padding: '6px 8px', background: 'transparent', border: `1px solid ${th.border}`, color: th.textMuted, fontSize: 9, fontWeight: 500, letterSpacing: '.08em', cursor: 'pointer', borderRadius: 4, fontFamily: "'Jost', sans-serif", textTransform: 'uppercase' }}
            >
              Clear
            </button>
          </div>
        </div>
      </nav>

      {/* ══ HERO: UPTOWN CAIRO PREMIUM GOLF VIEWS ══ */}
      <section style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden', background: th.bg }} dir={isAr ? 'rtl' : 'ltr'}>

        {/* Premium Background Image with Layered Gradients */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {/* Base Image Layer */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1800&q=80')", backgroundSize: 'cover', backgroundPosition: 'center 30%', animation: loaded ? 'subtle-zoom 20s ease-in-out infinite' : 'none', transform: 'scale(1.05)' }} />

          {/* Radial Light Gradient - Creates depth and focal point */}
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 120% 80% at 50% 40%, ${mode === 'dark' ? 'rgba(13,32,53,0.3)' : 'rgba(192,214,212,0.25)'} 0%, transparent 70%)` }} />

          {/* Left Directional Gradient */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${mode === 'dark' ? 'rgba(13,32,53,0.92)' : 'rgba(192,214,212,0.95)'} 0%, ${mode === 'dark' ? 'rgba(13,32,53,0.65)' : 'rgba(213,232,230,0.75)'} 45%, ${mode === 'dark' ? 'rgba(13,32,53,0.45)' : 'rgba(213,232,230,0.5)'} 100%)` }} />

          {/* Top-to-Bottom Gradient */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, ${mode === 'dark' ? 'rgba(13,32,53,0.2)' : 'rgba(192,214,212,0.15)'} 0%, transparent 30%, transparent 70%, ${mode === 'dark' ? 'rgba(13,32,53,0.65)' : 'rgba(192,214,212,0.5)'} 100%)` }} />

          {/* Accent Color Rim - Subtle gold/amber glow */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${mode === 'dark' ? 'rgba(233,193,118,0.08)' : 'rgba(233,193,118,0.12)'} 0%, transparent 30%, transparent 70%, ${mode === 'dark' ? 'rgba(200,150,26,0.06)' : 'rgba(200,150,26,0.08)'} 100%)` }} />

          {/* Subtle Texture Overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")", opacity: 0.3 }} />
        </div>

        {/* Main Content Wrapper */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', padding: '0 48px', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 96, paddingBottom: 48 }}>

          {/* Hero Headline Group */}
          <div style={{ maxWidth: 800, marginBottom: 48, textAlign: isAr ? 'right' : 'left', animation: loaded ? 'fadeUp .7s ease .1s both' : 'none' }}>

            {/* Emaar Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${th.border}`, borderRadius: 999, padding: '8px 14px', background: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.35)', marginBottom: 24, backdropFilter: 'blur(8px)' }}>
              <span style={{ fontSize: 9, color: G, letterSpacing: '.12em', textTransform: 'uppercase', fontFamily: "'Jost', sans-serif", fontWeight: 600 }}>Emaar</span>
              <div style={{ width: 1, height: 14, background: th.border }} />
              <span style={{ fontSize: 9, color: th.textSub, letterSpacing: '.08em', fontFamily: "'Jost', sans-serif" }}>Uptown Cairo</span>
            </div>

            {/* Main Headline */}
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(42px, 6.5vw, 84px)', fontWeight: 300, color: th.text, lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: 24, animation: loaded ? 'fadeUp .8s ease .2s both' : 'none' }}>
              {lang === 'en' ? (
                <>Wake up to the <br /><span style={{ fontWeight: 500, background: `linear-gradient(135deg, ${th.text} 0%, ${G} 50%, ${G2} 100%)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Signature Golf Views</span></>
              ) : (
                <>استيقظ على <br /><span style={{ fontWeight: 500, background: `linear-gradient(135deg, ${th.text} 0%, ${G} 50%, ${G2} 100%)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>مناظر الجولف التوقيعية</span></>
              )}
            </h1>

            {/* Subheadline */}
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.7, color: th.textSub, maxWidth: 560, marginBottom: 32, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", animation: loaded ? 'fadeUp .8s ease .28s both' : 'none' }}>
              {lang === 'en'
                ? 'Elevated luxury living 200 meters above sea level. Find your tailored villa or apartment overlooking the pristine green fairways.'
                : 'العيش الفاخر المرتفع 200 متر فوق مستوى سطح البحر. ابحث عن فيلتك أو شقتك المخصصة إطلالة على ملاعب الجولف الخضراء النقية.'}
            </p>
          </div>

          {/* AI Smart Filter Search Bar */}
          <div style={{ width: '100%', maxWidth: 1100, background: mode === 'dark' ? 'rgba(13,32,53,0.5)' : 'rgba(255,255,255,0.4)', backdropFilter: 'blur(16px)', borderRadius: 16, border: `1px solid ${th.border}`, padding: 24, boxShadow: mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(13,32,53,0.1)', animation: loaded ? 'fadeUp .9s ease .35s both' : 'none' }} className="grid md:grid-cols-4 gap-4 items-end">

            {/* Filter 1: Property Type */}
            <div>
              <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: th.textMuted, display: 'block', marginBottom: 8, fontFamily: "'Jost', sans-serif" }}>{lang === 'en' ? 'Property Type' : 'نوع العقار'}</label>
              <select style={{ width: '100%', background: 'transparent', color: th.text, fontSize: 13, fontWeight: 400, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", border: 'none', outline: 'none', cursor: 'pointer', padding: '8px 0' }}>
                <option style={{ background: th.bg, color: th.text }}>{lang === 'en' ? 'Golf Villa' : 'فيلا الجولف'}</option>
                <option style={{ background: th.bg, color: th.text }}>{lang === 'en' ? 'Luxury Townhouse' : 'تاون هاوس فاخر'}</option>
                <option style={{ background: th.bg, color: th.text }}>{lang === 'en' ? 'Premium Apartment' : 'شقة فاخرة'}</option>
              </select>
            </div>

            {/* Filter 2: View Type */}
            <div style={{ borderLeft: isAr ? 'none' : `1px solid ${th.border}`, borderRight: isAr ? `1px solid ${th.border}` : 'none', paddingLeft: isAr ? 0 : 16, paddingRight: isAr ? 16 : 0 }}>
              <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: th.textMuted, display: 'block', marginBottom: 8, fontFamily: "'Jost', sans-serif" }}>{lang === 'en' ? 'Desired View' : 'المنظر المرغوب'}</label>
              <select style={{ width: '100%', background: 'transparent', color: th.text, fontSize: 13, fontWeight: 400, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", border: 'none', outline: 'none', cursor: 'pointer', padding: '8px 0' }}>
                <option style={{ background: th.bg, color: th.text }}>{lang === 'en' ? 'Full Golf Course' : 'ملعب الجولف كاملاً'}</option>
                <option style={{ background: th.bg, color: th.text }}>{lang === 'en' ? 'City Skyline & Greenery' : 'أفق المدينة والمساحات الخضراء'}</option>
                <option style={{ background: th.bg, color: th.text }}>{lang === 'en' ? 'Private Pool & Garden' : 'حمام سباحة خاص وحديقة'}</option>
              </select>
            </div>

            {/* Filter 3: Budget Range */}
            <div style={{ borderLeft: isAr ? 'none' : `1px solid ${th.border}`, borderRight: isAr ? `1px solid ${th.border}` : 'none', paddingLeft: isAr ? 0 : 16, paddingRight: isAr ? 16 : 0 }}>
              <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: th.textMuted, display: 'block', marginBottom: 8, fontFamily: "'Jost', sans-serif" }}>{lang === 'en' ? 'Price Range (EGP)' : 'نطاق السعر'}</label>
              <select style={{ width: '100%', background: 'transparent', color: th.text, fontSize: 13, fontWeight: 400, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", border: 'none', outline: 'none', cursor: 'pointer', padding: '8px 0' }}>
                <option style={{ background: th.bg, color: th.text }}>{lang === 'en' ? 'Premium Tier' : 'الفئة الفاخرة'}</option>
                <option style={{ background: th.bg, color: th.text }}>{lang === 'en' ? 'Ultra-Luxury Tier' : 'الفئة الفائقة الفخامة'}</option>
                <option style={{ background: th.bg, color: th.text }}>20M+</option>
              </select>
            </div>

            {/* AI Action Button */}
            <button onClick={scrollToListings} style={{ width: '100%', background: `linear-gradient(135deg, ${G2}, ${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: isAr ? '.02em' : '.14em', textTransform: 'uppercase', padding: '14px 20px', borderRadius: 12, boxShadow: `0 8px 24px rgba(233,193,118,0.3)`, transition: 'all .3s ease', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(233,193,118,0.4)`; const icon = e.currentTarget.querySelector('svg'); if (icon) icon.style.transform = 'translateX(4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(233,193,118,0.3)`; const icon = e.currentTarget.querySelector('svg'); if (icon) icon.style.transform = 'translateX(0)'; }}>
              <span>✨ {lang === 'en' ? 'Find with AI' : 'ابحث بالذكاء الاصطناعي'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 16, transition: 'transform .3s ease' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.4, zIndex: 20 }}>
          <span style={{ fontSize: 9, letterSpacing: '.24em', textTransform: 'uppercase', color: th.textMuted, fontFamily: "'Jost', sans-serif" }}>{T.scroll}</span>
          <div className="animate-shimmer" style={{ width: 1, height: 32, background: `linear-gradient(180deg, ${G}, transparent)` }} />
        </div>
      </section>

      {/* ══ LISTINGS ══ */}
      <section ref={listingsSectionRef} style={{ background: mode === 'dark' ? '#0A1520' : th.bgAlt, padding: '80px 0' }}>
        <div style={sec}>
          <div className="reveal flex justify-between items-end mb-10 flex-wrap gap-4" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
            <div style={{ textAlign: isAr ? 'right' : 'left' }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.secListings}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text }}>{T.h2Listings}</h2>
            </div>
            <Link href="/listings" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: th.text, border: `1px solid ${th.border}`, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', padding: '9px 20px', borderRadius: 4, textDecoration: 'none' }}>{T.viewAll}</Link>
          </div>

          {/* Smart Search Bar - Enhanced with intent presets */}
          <div className="reveal mb-10 rounded-xl p-5" style={{ background: mode === 'dark' ? 'rgba(18,42,71,0.72)' : 'rgba(255,255,255,0.55)', border: `1px solid ${th.border}`, backdropFilter: 'blur(10px)' }}>
            <div className="flex items-start justify-between gap-4 flex-wrap mb-4" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
              <div style={{ textAlign: isAr ? 'right' : 'left' }}>
                <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: G, fontFamily: "'Jost', sans-serif", marginBottom: 6 }}>{T.smartTitle}</div>
                <div style={{ fontSize: 12, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.smartHint}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexDirection: isAr ? 'row-reverse' : 'row' }}>
                <span style={{ fontSize: 11, color: th.textMuted, fontFamily: "'Jost', sans-serif" }}>{filteredListings.length} {T.smartMatched}</span>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} style={{ background: 'transparent', border: `1px solid ${th.border}`, color: th.textSub, borderRadius: 999, padding: '6px 12px', cursor: 'pointer', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', fontFamily: "'Jost', sans-serif" }}>{T.smartReset}</button>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap mb-4" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
              {quickPresets.map((preset, idx) => (
                <button
                  key={preset}
                  onClick={() => applyPreset(idx)}
                  style={{
                    borderRadius: 999,
                    padding: '7px 14px',
                    background: activePreset === idx ? `linear-gradient(135deg,${G2},${G})` : 'transparent',
                    color: activePreset === idx ? '#071422' : th.textSub,
                    border: `1px solid ${activePreset === idx ? G : th.border}`,
                    cursor: 'pointer',
                    fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif",
                    fontSize: 11,
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_auto] gap-2 md:gap-0 rounded-lg overflow-hidden md:overflow-visible" style={{ background: 'transparent', borderRadius: 8 }}>
              {smartFilterSegments.map((seg, i) => (
                <div
                  key={i}
                  className="md:rounded-none"
                  style={{
                    padding: '14px 18px',
                    background: mode === 'dark' ? '#122A47' : th.card,
                    border: `1px solid ${th.border}`,
                    borderRadius: i === 0 || i === smartFilterSegments.length - 1 ? 8 : 0,
                  }}
                >
                  <div style={{ fontSize: 8, fontWeight: 500, letterSpacing: '.16em', textTransform: 'uppercase', color: th.textMuted, marginBottom: 3, fontFamily: "'Jost', sans-serif" }}>{seg.label}</div>
                  <select value={seg.value} onChange={(e) => seg.onChange(e.target.value)} style={smartFilterSelectStyle}>
                    {seg.opts.map((o) => <option value={o.value} key={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}
              <button onClick={scrollToListings} style={{ borderRadius: '8px', padding: '14px 28px', background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '52px' }}>{T.searchBtn}</button>
            </div>
          </div>

          {spotlightListing && (
            <div className="reveal mb-6 rounded-xl p-5" style={{ background: mode === 'dark' ? 'rgba(9,24,40,0.75)' : 'rgba(255,255,255,0.65)', border: `1px solid ${th.border}` }}>
              <div className="flex items-center justify-between gap-4 flex-wrap" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
                <div style={{ textAlign: isAr ? 'right' : 'left' }}>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.16em', color: G, marginBottom: 4, fontFamily: "'Jost', sans-serif" }}>{T.smartSpotlight}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: th.text }}>{isAr ? spotlightListing.titleAr : spotlightListing.title}</div>
                  <div style={{ fontSize: 12, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{isAr ? spotlightListing.locationAr : spotlightListing.location}</div>
                </div>
                <div style={{ minWidth: 220 }}>
                  <div className="flex items-center justify-between mb-2" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
                    <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: th.textMuted, fontFamily: "'Jost', sans-serif" }}>{T.smartScore}</span>
                    <span style={{ fontSize: 22, color: G, fontFamily: "'DM Mono', monospace" }}>{spotlightListing.smartScore}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(7,20,34,0.12)', overflow: 'hidden' }}>
                    <div style={{ width: `${spotlightListing.smartScore}%`, height: '100%', background: `linear-gradient(90deg,${G2},${G})` }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {filteredListings.length === 0 && (
            <div className="reveal rounded-xl p-6 mb-6 text-center" style={{ background: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(27,108,168,0.08)', border: `1px solid ${th.border}` }}>
              <div style={{ fontSize: 13, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.smartNoMatches}</div>
            </div>
          )}

          {/* Listing cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((p, i) => (
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
                dealDelay={i * 0.09}
                dealt={listingsDealt}
                isAr={isAr}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY SIERRA BLU ══ */}
      <section style={{ background: th.bg, padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ opacity: mode === 'dark' ? 0.025 : 0.02 }}>
          <ShieldLogo size={600} />
        </div>
        <div style={{ ...sec, position: 'relative', zIndex: 2 }}>
          <div className="reveal text-center mb-14">
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.secWhy}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text }}>{T.h2Why}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {T.why.map((w, i) => (
              <div key={i} className={`reveal rounded-[14px] p-8 transition-all hover:-translate-y-1`} style={{ background: th.surface, border: `1px solid ${th.border}`, textAlign: isAr ? 'right' : 'left' }}>
                <div style={{ fontSize: 28, color: G, marginBottom: 16, fontFamily: "'Cormorant Garamond', serif" }}>{w.icon}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, color: th.text, marginBottom: 10 }}>{w.title}</h3>
                <div style={{ width: 36, height: 2, background: `linear-gradient(90deg,${G2},${G})`, borderRadius: 1, marginBottom: 14, marginLeft: isAr ? 'auto' : 0 }} />
                <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.85, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{w.desc}</p>
              </div>
            ))}
          </div>

          {/* Banner */}
          <div className="reveal mt-14 p-8 rounded-[14px] flex items-center justify-between flex-wrap gap-5" style={{ background: 'linear-gradient(130deg, rgba(233,193,118,0.10), rgba(233,193,118,0.04))', border: '1px solid rgba(233,193,118,0.22)', flexDirection: isAr ? 'row-reverse' : 'row' }}>
            <div style={{ textAlign: isAr ? 'right' : 'left' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: th.text, marginBottom: 4 }}>{T.bannerH}</div>
              <div style={{ fontSize: 12, color: 'rgba(233,193,118,0.7)', fontFamily: isAr ? "'Jost', sans-serif" : "'Cairo', sans-serif" }}>{T.bannerSub}</div>
            </div>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '12px 26px', borderRadius: 4 }}>{T.bannerBtn}</button>
          </div>
        </div>
      </section>

      {/* ══ INTELLIGENCE MAP ══ */}
      <section style={{ background: mode === 'dark' ? '#091828' : th.bgAlt, padding: '96px 0' }}>
        <div style={sec}>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div style={{ order: isAr ? 2 : 1 }}>
              <div className="reveal" style={{ textAlign: isAr ? 'right' : 'left' }}>
                <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.secMap}</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: th.text, marginBottom: 10 }}>
                  {T.mapH1}<br /><em className="gold-text" style={{ fontStyle: 'italic' }}>{T.mapH2}</em>
                </h2>
                <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${G2},${G})`, borderRadius: 1, margin: '14px 0' }} />
                <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.85, color: th.textSub, marginBottom: 24, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.mapDesc}</p>
              </div>
              <div className="flex flex-col gap-3">
                {T.zones.map((z, i) => (
                  <div
                    key={i}
                    className="reveal flex items-center gap-4 p-4 rounded-[12px] cursor-pointer transition-all hover:scale-105 group"
                    style={{ background: activeZone === i ? `${z.color}22` : th.surface, border: `2px solid ${activeZone === i ? z.color : th.border}`, flexDirection: isAr ? 'row-reverse' : 'row', boxShadow: activeZone === i ? `0 0 20px ${z.color}33` : 'none' }}
                    onClick={() => setActiveZone(activeZone === i ? null : i)}
                  >
                    {/* Animated indicator dot */}
                    <div style={{ position: 'relative', width: 12, height: 12, flexShrink: 0 }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: z.color, boxShadow: `0 0 12px ${z.color}99` }} />
                      <div className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ border: `1px solid ${z.color}`, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                    </div>
                    {/* Zone name */}
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", textAlign: isAr ? 'right' : 'left', letterSpacing: '.02em' }}>{z.area}</div>
                    {/* Stat badge with number emphasized */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isAr ? 'flex-start' : 'flex-end', gap: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: z.color, background: `${z.color}20`, padding: '4px 12px', borderRadius: 50, fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap', border: `1px solid ${z.color}40`, letterSpacing: '.05em' }}>{z.stat}</span>
                      <span style={{ fontSize: 9, fontWeight: 400, color: th.textMuted, fontFamily: "'Jost', sans-serif", textTransform: 'uppercase', letterSpacing: '.08em' }}>{activeZone === i ? '✓ Selected' : '→ Select'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal h-[480px]" style={{ order: isAr ? 1 : 2 }}>
              <div className="relative h-full rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(233,193,118,0.22)', boxShadow: '0 32px 80px rgba(0,0,0,.4)' }}>
                <LiveMap mode={mode} />
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none" style={{ fontSize: 8, letterSpacing: '4px', color: 'rgba(233,193,118,0.35)', fontFamily: "'Jost', sans-serif", whiteSpace: 'nowrap' }}>SIERRA BLU INTELLIGENCE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SIERRA AI ══ */}
      <section style={{ padding: '96px 0', background: mode === 'dark' ? 'linear-gradient(135deg, #0A1520 0%, #0D2035 50%, #122A47 100%)' : `linear-gradient(135deg, ${th.bgAlt} 0%, ${th.bg} 50%, ${th.bg2} 100%)`, borderTop: `1px solid ${th.border}`, borderBottom: `1px solid ${th.border}` }}>
        <div style={sec}>
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="reveal" style={{ textAlign: isAr ? 'right' : 'left', order: isAr ? 2 : 1 }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.secAI}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text, marginBottom: 10 }}>{T.aiH}</h2>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '.1em', color: '#1B6CA8', textTransform: 'uppercase', marginBottom: 16, fontFamily: "'Jost', sans-serif" }}>{T.aiSub}</div>
              <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${G2},${G})`, borderRadius: 1, margin: '14px 0' }} />
              <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.85, color: th.textSub, margin: '16px 0 24px', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.aiDesc}</p>
              <div className="flex flex-col gap-2.5 mb-7">
                {T.aiFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5" style={{ fontSize: 13, color: th.textSub, flexDirection: isAr ? 'row-reverse' : 'row', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: G, flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: isAr ? '.02em' : '.14em', textTransform: 'uppercase', padding: '12px 26px', borderRadius: 4 }}>{T.aiCTA}</button>
            </div>

            {/* Chat mockup */}
            <div className="reveal" style={{ order: isAr ? 1 : 2 }}>
              <div style={{ background: mode === 'dark' ? 'rgba(255,255,255,0.045)' : 'rgba(27,108,168,0.06)', border: '1px solid rgba(233,193,118,0.25)', borderRadius: 16, padding: 28, backdropFilter: 'blur(12px)', boxShadow: '0 0 40px rgba(233,193,118,0.10)' }}>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="relative flex-shrink-0" style={{ width: 50, height: 50, borderRadius: '50%', background: `linear-gradient(135deg,${G2},${G})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    ◈
                    <div className="absolute -inset-1 rounded-full animate-ping opacity-20" style={{ border: `1px solid ${G}` }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: th.text }}>Sierra</div>
                    <div style={{ fontSize: 11, color: '#4ADE80', marginTop: 2, fontFamily: "'DM Mono', monospace", fontWeight: 300 }}>● Online · 4s avg</div>
                  </div>
                </div>
                {T.aiChat.map((msg, i) => (
                  <div key={i} className="flex mb-2.5" style={{ justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 300, lineHeight: 1.6, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", background: msg.from === 'user' ? `linear-gradient(135deg,${G2},${G})` : 'rgba(255,255,255,0.06)', color: msg.from === 'user' ? '#071422' : th.text, border: msg.from === 'user' ? 'none' : `1px solid ${th.border}` }}>{msg.text}</div>
                  </div>
                ))}
                <div className="text-center mt-4" style={{ fontSize: 11, color: th.textMuted, fontFamily: "'Jost', sans-serif" }}>
                  AI-powered · 24/7 · Arabic & English
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ background: th.bg, padding: '96px 0' }}>
        <div style={sec}>
          <div className="reveal text-center mb-12">
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.secTesti}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text }}>{T.h2Testi}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {T.testimonials.map((t, i) => (
              <div key={i} className="reveal rounded-[14px]" style={{ padding: 28, background: th.card, border: `1px solid ${th.cardBorder}`, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, color: G, lineHeight: 0.7, marginBottom: 16 }}>&ldquo;</div>
                <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.85, color: th.textSub, marginBottom: 20, fontStyle: 'italic', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{t.q}</p>
                <div className="flex items-center gap-3" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg,${G2},${G})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#071422', flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>{t.i}</div>
                  <div style={{ textAlign: isAr ? 'right' : 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: th.textMuted, fontFamily: "'Jost', sans-serif" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FORM ══ */}
      <section style={{ padding: '96px 0', background: mode === 'dark' ? 'linear-gradient(135deg, #0A1520, #0D2035)' : `linear-gradient(135deg, ${th.bg}, ${th.bgAlt})`, borderTop: `1px solid ${th.border}` }}>
        <div style={{ ...sec, maxWidth: 600 }}>
          <div className="reveal text-center mb-10">
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.ctaTag}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: th.text, marginBottom: 12 }}>{T.ctaH}</h2>
            <p style={{ fontSize: 14, fontWeight: 300, color: th.textSub, lineHeight: 1.8, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.ctaSub}</p>
          </div>
          <div className="reveal">
            {submitted ? (
              <div className="text-center p-10 rounded-xl" style={{ background: mode === 'dark' ? 'rgba(233,193,118,0.08)' : 'rgba(233,193,118,0.14)', border: '1px solid rgba(233,193,118,0.3)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: G, marginBottom: 8 }}>{lang === 'en' ? 'Thank you.' : 'شكراً.'}</div>
                <p style={{ fontSize: 14, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.formSuccess}</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col gap-3.5">
                {[
                  { key: 'name' as const, label: T.formName, type: 'text' },
                  { key: 'phone' as const, label: T.formPhone, type: 'tel' },
                ].map((f) => (
                  <input
                    key={f.key}
                    type={f.type}
                    required
                    placeholder={f.label}
                    value={formData[f.key]}
                    onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    className="focus:border-secondary transition-colors"
                    style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 6, padding: '13px 16px', color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 14, fontWeight: 300, outline: 'none', textAlign: isAr ? 'right' : 'left' }}
                  />
                ))}
                <button type="submit" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '14px 26px', borderRadius: 4 }}>{T.formSubmit}</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#040E1C', color: '#EFF8F7', padding: '72px 0 36px', borderTop: '1px solid rgba(233,193,118,0.12)' }}>
        <div style={sec}>
          <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-14 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
                <ShieldLogo size={42} />
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isAr ? 16 : 19, fontWeight: 600, letterSpacing: isAr ? '.06em' : '.2em', color: G }}>{T.brand}</div>
                  <div style={{ fontSize: 8, letterSpacing: '.38em', color: 'rgba(239,248,247,0.45)', fontFamily: "'Jost', sans-serif" }}>{T.sub}</div>
                </div>
              </div>
              <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.85, color: 'rgba(239,248,247,0.45)', maxWidth: 280, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", textAlign: isAr ? 'right' : 'left' }}>{T.footDesc}</p>
            </div>
            {[
              { title: T.footNav, links: T.footNavLinks },
              { title: T.footMarkets, links: T.footMarketLinks },
            ].map((col) => (
              <div key={col.title} style={{ textAlign: isAr ? 'right' : 'left' }}>
                <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '.22em', color: G, marginBottom: 16, fontFamily: "'Jost', sans-serif" }}>{col.title}</div>
                {col.links.map((l) => (
                  <div key={l} className="hover:text-secondary transition-colors cursor-pointer" style={{ fontSize: 12, fontWeight: 300, color: 'rgba(239,248,247,0.45)', marginBottom: 10, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center flex-wrap gap-3 pt-6" style={{ borderTop: '1px solid rgba(239,248,247,0.07)', flexDirection: isAr ? 'row-reverse' : 'row' }}>
            <div style={{ fontSize: 11, fontWeight: 300, color: 'rgba(239,248,247,0.28)', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.copyright}</div>
            <div className="flex gap-5">
              {T.legal.map((l) => (
                <span key={l} className="hover:text-secondary transition-colors cursor-pointer" style={{ fontSize: 11, fontWeight: 300, color: 'rgba(239,248,247,0.28)', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
