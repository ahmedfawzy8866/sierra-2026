'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Compass, ShieldCheck, Languages, ArrowRight, Percent, Award, Users, TrendingUp, Phone, Calendar } from 'lucide-react';
import InteractiveCrmMap from '@/components/UI/InteractiveCrmMap';
import LuxuryVirtualViewport from '@/components/UI/LuxuryVirtualViewport';
import MobileBottomNav from '@/components/UI/MobileBottomNav';
import PremiumHero from '@/components/UI/PremiumHero';
import InventoryShowcase from '@/components/Listings/InventoryShowcase';
import TestimonialsCarousel from '@/components/UI/TestimonialsCarousel';

// ─── TRANSLATION DICTIONARY ───────────────────────────────────────────────────
const DICTIONARY = {
  en: {
    navTitle: 'SIERRA BLU',
    navSubtitle: 'BEYOND BROKERAGE',
    ctaExplore: 'Explore Portfolio',
    ctaContact: 'Direct advisory',
    tagline: 'Sovereign Real Estate Advisory',
    title: 'The Apex of Luxury Real Estate in New Cairo',
    desc: 'Uncompromising standard. Highly vetted, off-market inventory matched intelligently to the capital goals of elite investors.',
    stat1Val: '847+',
    stat1Lbl: ' HNWI Advisory Clients',
    stat2Val: '10.5%',
    stat2Lbl: 'Average ROI Realized',
    stat3Val: '$2.8B',
    stat3Lbl: 'Assets Under advisory',
    featuresTitle: 'Advisory Pillars',
    feature1Title: 'Off-Market Access',
    feature1Desc: 'Direct integration with primary luxury developers and private asset holders, bypassing noisy listings.',
    feature2Title: 'ROI Data Engines',
    feature2Desc: 'Advanced points tracking metrics verifying capital yield, rental index rates, and compound histories.',
    feature3Title: 'Defensive Integrity',
    feature3Desc: 'Zero spam. Encrypted secure databases, qualified point routing, and absolute transactional transparency.',
    contactTitle: 'Direct Advisory Lines',
    contactSubtitle: 'Request immediate callback or live telemetry walk.',
    inputName: 'Full Name',
    inputPhone: 'WhatsApp Contact Line',
    btnSubmit: 'Request Golden Hour Call',
  },
  ar: {
    navTitle: 'سييرا بلو',
    navSubtitle: 'ما وراء الوساطة العقارية',
    ctaExplore: 'استكشف المحفظة العقارية',
    ctaContact: 'استشارة مباشرة',
    tagline: 'مستشار التطوير العقاري السيادي',
    title: 'قمة العقارات الفاخرة في القاهرة الجديدة',
    desc: 'معايير لا تقبل المساومة. محفظة حصرية ومدروسة بعناية من العقارات المميزة تتطابق بذكاء مع الأهداف الرأسمالية للنخبة.',
    stat1Val: '٨٤٧+',
    stat1Lbl: 'عملاء الاستشارات الاستثمارية',
    stat2Val: '١٠.٥٪',
    stat2Lbl: 'متوسط العائد الاستثماري المحقق',
    stat3Val: '٢.٨ مليار دولار',
    stat3Lbl: 'الأصول الخاضعة للاستشارات',
    featuresTitle: 'ركائز الاستشارة',
    feature1Title: 'عقارات حصرية خارج السوق',
    feature1Desc: 'تواصل مباشر مع كبار المطورين وملاك العقارات الحصريين بعيداً عن ضوضاء السماسرة.',
    feature2Title: 'محركات بيانات العائد',
    feature2Desc: 'نظام متطور لتتبع ومراقبة العائد على رأس المال، ومؤشرات الإيجار والنمو التاريخي للمجمعات السكنية.',
    feature3Title: 'الخصوصية الدفاعية والأمان',
    feature3Desc: 'خصوصية كاملة. قواعد بيانات مشفرة، توجيه ذكي للمكالمات وتأكيد كامل للشفافية التعاقدية.',
    contactTitle: 'قنوات الاتصال المباشرة',
    contactSubtitle: 'اطلب إعادة الاتصال الفوري أو جولة بث افتراضية حية.',
    inputName: 'الاسم بالكامل',
    inputPhone: 'رقم الواتساب للتواصل المباشر',
    btnSubmit: 'اطلب مكالمة الساعة الذهبية',
  },
};

export default function UnifiedHomepage() {
  const [isAr, setIsAr] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('explore');
  const [filters, setFilters] = useState({
    purpose: '',
    type: '',
    compound: '',
    budget: '',
  });
  
  const t = isAr ? DICTIONARY.ar : DICTIONARY.en;

  const toggleLanguage = () => {
    setIsAr((prev) => !prev);
  };

  const resetFilters = () => {
    setFilters({
      purpose: '',
      type: '',
      compound: '',
      budget: '',
    });
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-[#F4F0E8] dark:bg-[#071422] text-[#071422] dark:text-[#F4F0E8] transition-all duration-700 ${
        isAr ? 'font-arabic' : 'font-sans'
      }`}
    >
      {/* ─── FLOATING TOP ADVISORY HEADER ────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#071422]/70 backdrop-blur-md border-b border-[#071422]/10 dark:border-white/10 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-playfair text-xl font-bold tracking-[0.1em] text-[#071422] dark:text-white">
              {t.navTitle}
            </span>
            <span className="text-[8px] tracking-[0.3em] font-mono text-[#C9A84C] font-semibold">
              {t.navSubtitle}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#071422]/15 dark:border-white/20 text-xs font-semibold hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all"
            >
              <Languages size={14} />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>
            
            <a
              href="#contact"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#C9A84C] to-[#E9C176] text-[#071422] font-semibold text-xs rounded-xl shadow-lg hover:shadow-2xl transition-all uppercase tracking-wider"
            >
              {t.ctaContact}
            </a>
          </div>
        </div>
      </nav>

      {/* ─── MOBILE VIEW DECIDER INDEX ───────────────────────────────────────── */}
      <div className="pt-20">
        {activeMobileTab === 'explore' && (
          <>
            {/* Interactive AR Virtual Tour & Refined Filter Hero Section */}
            <PremiumHero
              isArabic={isAr}
              onSearch={(searchFilters) => {
                setFilters(searchFilters);
                const element = document.getElementById('inventory');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            />

            {/* Live Synchronized High-Fidelity Inventory Showcase */}
            <div id="inventory" className="relative z-10">
              {(filters.purpose || filters.type || filters.compound || filters.budget) && (
                <div className="max-w-6xl mx-auto px-4 md:px-12 pt-6">
                  <button
                    onClick={resetFilters}
                    className="text-xs font-mono uppercase tracking-wider text-[#071422]/70 dark:text-white/70 hover:text-[#C9A84C] transition-colors"
                  >
                    {isAr ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
                  </button>
                </div>
              )}
              <InventoryShowcase filters={filters} />
            </div>

            {/* Testimonials Carousel Section */}
            <div className="py-24 bg-[#F4F0E8] dark:bg-[#071422]/50 border-y border-[#071422]/5 dark:border-white/5">
              <TestimonialsCarousel />
            </div>

            {/* 360 Telemetry Spatial Tour Section */}
            <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                <div className="lg:col-span-1">
                  <span className="text-[10px] tracking-[0.25em] font-semibold text-[#C9A84C] uppercase font-mono block mb-2">
                    {isAr ? 'معاينة تكنولوجية متقدمة' : 'SPATIAL TELEMETRY'}
                  </span>
                  <h3 className="font-playfair text-3xl md:text-4xl font-light leading-tight mb-4 text-[#071422] dark:text-white">
                    {isAr ? 'عاين عقارك عن بعد عبر الواقع الافتراضي' : 'Walk Through Spatial Models Remotely'}
                  </h3>
                  <p className="text-sm text-[#071422]/70 dark:text-white/70 leading-relaxed mb-6">
                    {isAr
                      ? 'لا داعي لإضاعة وقتك الثمين في الزيارات الميدانية. قمنا بهندسة نظام مسح وتليمتري ذكي يتيح لك التجول بدقة ملليمترية داخل الوحدات من أي مكان في العالم.'
                      : 'Eliminate friction and redundant site inspections. Our fully integrated Spatial Telemetry renders real-time 3D models with absolute accuracy.'}
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <LuxuryVirtualViewport isAr={isAr} />
                </div>
              </div>
            </section>
          </>
        )}

        {activeMobileTab === 'map' && (
          <div className="px-4 py-8 max-w-5xl mx-auto">
            <InteractiveCrmMap isAr={isAr} />
          </div>
        )}

        {activeMobileTab === 'yields' && (
          <div className="px-6 py-12 max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center mx-auto mb-6">
              <Percent size={28} />
            </div>
            <h3 className="font-playfair text-2xl font-semibold mb-4 text-[#071422] dark:text-white">
              {isAr ? 'مؤشر أداء العوائد الاستثمارية الذكي' : 'AI Capital Yield Index'}
            </h3>
            <p className="text-sm text-[#071422]/70 dark:text-white/70 max-w-lg mx-auto mb-8">
              {isAr
                ? 'استخدم نظام تسعير سييرا المتطور لمقارنة عوائد الإيجار ونسب النمو التاريخية في مختلف قطاعات القاهرة الجديدة.'
                : 'Benchmark yields, historic appreciation metrics, and rental indexes across Madinaty, Mostakbal City, and 5th Settlement.'}
            </p>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0A1520] border border-[#071422]/10 dark:border-white/10 text-left">
              <div className="space-y-4">
                <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="text-xs text-[#071422]/60 dark:text-white/60">Mostakbal City Sector</span>
                  <span className="text-emerald-400 font-bold">10.5% Est. ROI</span>
                </div>
                <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <span className="text-xs text-[#071422]/60 dark:text-white/60">Fifth Settlement Luxury BUA</span>
                  <span className="text-emerald-400 font-bold">9.2% Est. ROI</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-xs text-[#071422]/60 dark:text-white/60">Madinaty Premium Villas</span>
                  <span className="text-emerald-400 font-bold">8.8% Est. ROI</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMobileTab === 'console' && (
          <div className="px-6 py-12 max-w-xl mx-auto">
            <div className="p-8 rounded-3xl bg-[#050b14] border border-[#C9A84C]/30 text-white font-mono text-xs shadow-luxury">
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400 font-bold">SIERRA CONCIERGE TERMINAL v3.1</span>
              </div>
              <div className="space-y-4">
                <p className="text-white/60">&gt; Status: Ingestion Engine Listening...</p>
                <p className="text-white/60">&gt; Database: Firestore Spark Connected.</p>
                <p className="text-[#C9A84C] font-semibold">&gt; Live API Endpoint: ghp_HnhlnsCBqUaEOvPDm2F... Active.</p>
                <p className="text-white/40">&gt; Waiting for Lead Signal Trigger...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── DIRECT ADVISORY & CALLBACK GATEWAY ─────────────────────────────────── */}
      <section id="contact" className="py-24 px-6 md:px-12 max-w-4xl mx-auto mt-12 border-t border-[#071422]/10 dark:border-white/10">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.25em] font-semibold text-[#C9A84C] uppercase font-mono block mb-2">
            {isAr ? 'بوابة النخبة' : 'GOLDEN HOUR ADVISORY'}
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl font-light mb-4 text-[#071422] dark:text-white">
            {t.contactTitle}
          </h2>
          <p className="text-sm text-[#071422]/60 dark:text-white/60">
            {t.contactSubtitle}
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); alert('Lead qualified. Dispatching Scribe Webhook...'); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#071422]/60 dark:text-white/60 mb-2 font-mono">
                {t.inputName}
              </label>
              <input
                type="text"
                required
                className="w-full px-5 py-4 rounded-xl bg-white dark:bg-[#071422] border border-[#071422]/15 dark:border-white/10 focus:border-[#C9A84C] outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#071422]/60 dark:text-white/60 mb-2 font-mono">
                {t.inputPhone}
              </label>
              <input
                type="tel"
                required
                placeholder="+20 1..."
                className="w-full px-5 py-4 rounded-xl bg-white dark:bg-[#071422] border border-[#071422]/15 dark:border-white/10 focus:border-[#C9A84C] outline-none transition-colors text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-[#071422] text-white dark:bg-gradient-to-r dark:from-[#C9A84C] dark:to-[#E9C176] dark:text-[#071422] font-semibold text-xs rounded-xl shadow-lg hover:shadow-2xl transition-all uppercase tracking-widest font-mono"
          >
            {t.btnSubmit}
          </button>
        </form>
      </section>

      {/* ─── FOOTER SECTION ────────────────────────────────────────────────────── */}
      <footer className="py-12 text-center text-xs text-[#071422]/40 dark:text-white/40 border-t border-[#071422]/5 dark:border-white/5 pb-24 md:pb-12">
        <p className="font-mono">© {new Date().getFullYear()} SIERRA BLU INT. ALL RIGHTS RESERVED.</p>
        <p className="mt-2 text-[10px]">{t.navSubtitle}</p>
      </footer>

      {/* Fixed Mobile Bottom Touch zone navigation */}
      <MobileBottomNav activeTab={activeMobileTab} setActiveTab={setActiveMobileTab} isAr={isAr} />
    </div>
  );
}
