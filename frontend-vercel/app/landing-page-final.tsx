'use client';
import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useI18n } from '@/lib/I18nContext';

// Constants & Design Tokens
const COLORS = {
  gold: '#E9C176',
  goldDark: '#C8961A',
  goldLight: '#F5D78E',
  navy: '#071422',
  dark: '#0A1E35',
  cream: '#EFF8F7',
  white: '#FFFFFF',
  textLight: '#EFF8F7',
  textDark: '#071422',
};

const THEMES = {
  dark: {
    bg: '#071422',
    bg2: '#0A1E35',
    surface: 'rgba(255,255,255,0.04)',
    surfaceHover: 'rgba(233,193,118,0.08)',
    card: '#0A1E35',
    cardBorder: 'rgba(233,193,118,0.08)',
    border: 'rgba(233,193,118,0.15)',
    text: '#EFF8F7',
    textSub: 'rgba(239,248,247,0.6)',
    textMuted: 'rgba(239,248,247,0.32)',
  },
  light: {
    bg: '#EFF8F7',
    bg2: '#FFFFFF',
    surface: 'rgba(27,108,168,0.05)',
    surfaceHover: 'rgba(233,193,118,0.10)',
    card: '#FFFFFF',
    cardBorder: 'rgba(27,108,168,0.08)',
    border: 'rgba(27,108,168,0.12)',
    text: '#071422',
    textSub: 'rgba(7,20,34,0.60)',
    textMuted: 'rgba(7,20,34,0.35)',
  },
};

interface ListingCard {
  id: number;
  title: string;
  description: string;
}

const MOCK_LISTINGS: ListingCard[] = [
  { id: 1, title: 'Luxury Villa #1', description: 'Exclusive property in prime location.' },
  { id: 2, title: 'Luxury Villa #2', description: 'Exclusive property in prime location.' },
  { id: 3, title: 'Luxury Villa #3', description: 'Exclusive property in prime location.' },
];

const LANDING_STYLE_VARS = {
  '--lp-gap-md': '12px',
  '--lp-card-radius': '12px',
  '--lp-filter-padding': '16px',
} as CSSProperties;

// i18n Copy
const COPY = {
  en: {
    dir: 'ltr',
    brand: 'SIERRA BLU',
    sub: 'REALTY',
    tagline: 'AI-POWERED REAL ESTATE INTELLIGENCE',
    nav: ['Properties', 'Intelligence', 'About', 'Contact'],
    cta: 'Enter Portal',
    heroTag: 'Beyond Brokerage',
    heroH1: ['Smarter', 'Decisions.'],
    heroItalic: 'AI‑Driven.',
    heroSub: 'The Real in Real Estate',
    heroDesc:
      'Exceptional homes, intelligently matched. We connect discerning investors with Egypt\'s finest properties — curated by humans, powered by AI.',
    btnDiscover: 'Explore Properties',
    btnView: 'Meet Sierra AI',
    stats: [
      ['1,200+', 'Properties'],
      ['98%', 'Match Accuracy'],
      ['8+', 'Compounds'],
      ['4s', 'Avg. Response'],
    ],
    scroll: 'Scroll',
    secListings: 'Exclusive Listings',
    h2Listings: 'Homes worth knowing.',
    viewAll: 'View All →',
    beds: 'bed',
    baths: 'bath',
    secWhy: 'Why Sierra Blu',
    h2Why: 'The Sierra Blu Difference',
    why: [
      {
        icon: '◆',
        title: 'Curated Selection',
        desc: 'Every listing is personally vetted by our senior advisors. No overpriced inventory.',
      },
      {
        icon: '◈',
        title: 'Smart Investment',
        desc: 'AI-driven ROI analysis and market comparison. Decisions backed by data.',
      },
      {
        icon: '◉',
        title: 'Trusted Guidance',
        desc: 'From first inquiry to final signature, a dedicated advisor for your goals.',
      },
    ],
    secAI: 'Meet Sierra',
    aiH: 'Your AI Real Estate Consultant',
    aiSub: 'First Official AI Real Estate Bot in Egypt',
    ctaTag: 'Ready?',
    ctaH: 'Let\'s Find Your Home',
    ctaSub: 'Connect with our advisors today.',
    formName: 'Your Name',
    formPhone: 'Phone Number',
    formSubmit: 'Get Started',
    formSuccess: 'Thank you! We\'ll be in touch shortly.',
    copyright: '© 2026 Sierra Blu Realty. All rights reserved.',
    footerLinks: ['About', 'Contact', 'Privacy', 'Terms'],
  },
  ar: {
    dir: 'rtl',
    brand: 'سييرا بلو',
    sub: 'وكالة عقارات',
    tagline: 'ذكاء اصطناعي في العقارات',
    nav: ['العقارات', 'الذكاء', 'عنا', 'اتصل بنا'],
    cta: 'دخول المنصة',
    heroTag: 'ما وراء الوساطة',
    heroH1: ['قرارات', 'ذكية'],
    heroItalic: 'مدعومة بالذكاء الاصطناعي',
    heroSub: 'الحقيقة في العقارات',
    heroDesc: 'منازل استثنائية، مطابقة ذكية. نربط المستثمرين بأفضل العقارات في مصر.',
    btnDiscover: 'استكشف العقارات',
    btnView: 'تعرف على سييرا',
    stats: [
      ['1200+', 'عقار'],
      ['98%', 'دقة المطابقة'],
      ['8+', 'مجمعات'],
      ['4 ثوان', 'الرد المتوسط'],
    ],
    scroll: 'اسحب',
    secListings: 'قوائم حصرية',
    h2Listings: 'منازل تستحق الاهتمام',
    viewAll: '← عرض الكل',
    beds: 'غرفة نوم',
    baths: 'حمام',
    secWhy: 'لماذا سييرا بلو',
    h2Why: 'الفرق في سييرا بلو',
    why: [
      { icon: '◆', title: 'اختيار منسق', desc: 'كل عقار تم التحقق منه شخصياً.' },
      { icon: '◈', title: 'استثمار ذكي', desc: 'تحليل العائد بقوة الذكاء الاصطناعي.' },
      { icon: '◉', title: 'إرشادات موثوقة', desc: 'مستشار مخصص لأهدافك.' },
    ],
    secAI: 'تعرف على سييرا',
    aiH: 'مستشارك العقاري بالذكاء الاصطناعي',
    aiSub: 'أول مستشار ذكاء اصطناعي عقاري في مصر',
    ctaTag: 'جاهز؟',
    ctaH: 'دعنا نجد منزلك',
    ctaSub: 'تواصل مع مستشارينا اليوم',
    formName: 'اسمك',
    formPhone: 'رقم الهاتف',
    formSubmit: 'ابدأ الآن',
    formSuccess: 'شكراً! سنتواصل معك قريباً.',
    copyright: '© 2026 سييرا بلو. جميع الحقوق محفوظة.',
    footerLinks: ['عنا', 'اتصل', 'الخصوصية', 'الشروط'],
  },
};

// ═══════════════════════════════════════════════════════════
// LANDING PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

import { useTheme } from 'next-themes';

export default function LandingPage() {
  const { locale, setLocale } = useI18n();
  const { theme, setTheme } = useTheme();
  
  const toggleLocale = () => setLocale(locale === 'ar' ? 'en' : 'ar');
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const listings = MOCK_LISTINGS;
  const [mounted, setMounted] = useState(false);
  const [heroView, setHeroView] = useState<'A' | 'B'>('A'); // View A: Default Backdrop, View B: Virtual Tour

  const T = COPY[locale as keyof typeof COPY] || COPY.en;
  const th = THEMES[mode];
  const isAr = locale === 'ar';

  // Scroll animations
  useEffect(() => {
    setMounted(true);
    setMode(theme === 'dark' ? 'dark' : 'light');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [theme]);

  if (!mounted) return null;

  const GlobalStyle = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
    
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .gold-text {
      background: linear-gradient(135deg, #E9C176 0%, #C8961A 40%, #F5D78E 70%, #987734 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: goldShimmer 4s linear infinite;
    }
    
    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .reveal-d1 { transition-delay: 0.1s; }
    .reveal-d2 { transition-delay: 0.2s; }
    .reveal-d3 { transition-delay: 0.3s; }
  `;

  return (
    <>
      <style>{GlobalStyle}</style>
      <div
        style={{
          background: th.bg,
          color: th.text,
          minHeight: '100vh',
          fontFamily: '"Jost", "Inter", sans-serif',
          direction: T.dir as 'ltr' | 'rtl',
          transition: 'background 500ms ease, color 500ms ease',
          ...LANDING_STYLE_VARS,
        }}
      >
        {/* ══ NAVIGATION ══ */}
        <nav
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backdropFilter: 'blur(20px)',
            background: `rgba(7, 20, 34, ${mode === 'dark' ? '0.96' : '0.1'})`,
            borderBottom: `1px solid ${th.border}`,
            padding: '16px 60px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '24px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: COLORS.gold,
            }}
          >
            {T.brand}
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            {T.nav.map((item, i) => (
              <button
                key={i}
                style={{
                  background: 'none',
                  border: 'none',
                  color: th.textSub,
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'color 250ms ease',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = COLORS.gold)}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = th.textSub)}
              >
                {item}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: `1px solid ${th.border}`,
                color: th.text,
                borderRadius: '6px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {mode === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={toggleLocale}
              style={{
                background: 'none',
                border: `1px solid ${th.border}`,
                color: th.text,
                borderRadius: '6px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {locale === 'ar' ? 'EN' : 'AR'}
            </button>
            <button
              style={{
                background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                color: COLORS.navy,
                border: 'none',
                borderRadius: '6px',
                padding: '10px 20px',
                fontWeight: 600,
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: `0 4px 20px rgba(233,193,118,0.25)`,
              }}
            >
              {T.cta}
            </button>
          </div>
        </nav>

        {/* ══ FRAMED SPLIT-HERO EXPERIENCE ══ */}
        <section
          className="relative w-full h-[100dvh] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${th.bg} 0%, ${th.bg2} 100%)`,
          }}
        >
          {/* VIEW A: AI Smart Filter & Voucher Alert */}
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-700 ease-silk"
            style={{
              transform: heroView === 'A' ? 'translateY(0)' : 'translateY(-100%)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '96px 60px',
            }}
          >
            <div className="absolute inset-0 bg-navy-80 z-0">
              {/* Fallback lightweight backdrop (30%) */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "url('/design/hero/hero-careers.jpg')", // Placeholder
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </div>
            
            <div className="relative z-10 reveal" style={{ maxWidth: '800px', textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(230, 57, 70, 0.1)',
                  border: `1px solid ${COLORS.gold}`,
                  color: COLORS.gold,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '24px',
                }}
              >
                10% Off WhatsApp Voucher Alert
              </div>

              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: COLORS.gold,
                  marginBottom: '16px',
                }}
              >
                {T.heroTag}
              </div>

              <h1
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 'clamp(48px, 8vw, 96px)',
                  fontWeight: 300,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  marginBottom: '16px',
                  color: COLORS.white,
                }}
              >
                {T.heroH1.map((word, i) => (
                  <div key={i}>
                    {i === T.heroH1.length - 1 ? (
                      <span className="gold-text">{word}</span>
                    ) : (
                      word
                    )}
                  </div>
                ))}
              </h1>

              <p
                style={{
                  fontSize: '18px',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.8)',
                  maxWidth: '600px',
                  margin: '0 auto 40px',
                  lineHeight: 1.7,
                }}
              >
                {T.heroDesc}
              </p>

              {/* AI Smart Filter Bar (Placeholder UI) */}
              <div
                className="glass-card"
                style={{
                  display: 'flex',
                  gap: 'var(--lp-gap-md)',
                  padding: 'var(--lp-filter-padding)',
                  borderRadius: 'var(--lp-card-radius)',
                  background: 'rgba(10, 30, 53, 0.6)',
                  border: `1px solid ${COLORS.goldDark}`,
                  backdropFilter: 'blur(16px)',
                  margin: '0 auto',
                  maxWidth: '600px',
                }}
              >
                <input
                  type="text"
                  placeholder={isAr ? 'ابحث بالحي/الميزانية/نوع العقار…' : 'Describe your ideal property (compound, budget, type)…'}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: COLORS.white,
                    outline: 'none',
                    fontSize: '14px',
                    padding: '8px',
                  }}
                />
                <button
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                    color: COLORS.navy,
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 24px',
                    fontWeight: 600,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* VIEW B: Interactive Virtual Tour */}
          <div
            className="absolute inset-0 w-full h-full transition-transform duration-700 ease-silk"
            style={{
              transform: heroView === 'B' ? 'translateY(0)' : 'translateY(100%)',
              zIndex: 10,
              background: COLORS.navy,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Placeholder for Virtual Tour iFrame/SDK */}
            <div style={{ color: COLORS.gold, fontSize: '24px', fontFamily: '"Cormorant Garamond", serif' }}>
              Interactive High-Tech Virtual Tour
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>
              Powered by Virtual Tour Provider Key
            </p>
          </div>

          {/* Floating Frame Control Button */}
          <div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: COLORS.gold, letterSpacing: '0.1em' }}>
              {heroView === 'A' ? 'Virtual Tour' : 'Back to Home'}
            </span>
            <button
              onClick={() => setHeroView((prev) => (prev === 'A' ? 'B' : 'A'))}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                border: 'none',
                color: COLORS.navy,
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: `0 8px 30px rgba(233,193,118,0.35)`,
                transition: 'transform 300ms ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.1)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
            >
              {heroView === 'A' ? '🔽' : '🔼'}
            </button>
          </div>
        </section>

        {/* ══ STATS ══ */}
        <section
          style={{
            padding: '64px 60px',
            background: th.bg,
            borderTop: `1px solid ${th.border}`,
            borderBottom: `1px solid ${th.border}`,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '40px',
          }}
        >
          {T.stats.map((stat, i) => (
            <div key={i} className={`reveal reveal-d${i + 1}`} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: COLORS.gold,
                  marginBottom: '8px',
                }}
              >
                {stat[0]}
              </div>
              <div style={{ fontSize: '12px', color: th.textMuted, letterSpacing: '0.08em' }}>
                {stat[1]}
              </div>
            </div>
          ))}
        </section>

        {/* ══ WHY SECTION ══ */}
        <section
          style={{
            padding: '96px 60px',
            background: th.bg,
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: COLORS.gold,
                  marginBottom: '12px',
                }}
              >
                {T.secWhy}
              </div>
              <h2
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 'clamp(32px, 5vw, 56px)',
                  fontWeight: 300,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                {T.h2Why}
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '32px',
              }}
            >
              {T.why.map((item, i) => (
                <div
                  key={i}
                  className={`reveal reveal-d${i + 1}`}
                  style={{
                    padding: '32px',
                    background: th.card,
                    border: `1px solid ${th.cardBorder}`,
                    borderRadius: '12px',
                    transition: 'all 300ms ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px rgba(233,193,118,0.12)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      marginBottom: '12px',
                      color: COLORS.gold,
                    }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 500,
                      marginBottom: '8px',
                      color: th.text,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: th.textSub,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ AI INVESTMENT MAP ══ */}
        <section style={{ padding: '96px 60px', background: th.bg, borderTop: `1px solid ${th.border}` }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '32px' }}>
              <span className="gold-text">AI Investment Map</span>
            </h2>
            <div style={{ height: '400px', background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <p style={{ color: th.textMuted }}>Map Powered by {process.env.NEXT_PUBLIC_AI_MAP_ENGINE_TOKEN ? 'AI Engine' : 'Map Engine (Configure Token)'}</p>
            </div>
          </div>
        </section>

        {/* ══ GRID / FEATURED PROPERTIES ══ */}
        <section style={{ padding: '96px 60px', background: th.bg2, borderTop: `1px solid ${th.border}` }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '48px', textAlign: 'center' }}>
               Curated <span className="gold-text">Collection</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              {listings.map((listing) => (
                <div key={listing.id} style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: '12px', padding: '24px', transition: 'transform 300ms ease' }}
                     onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
                     onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div style={{ height: '200px', background: 'rgba(233,193,118,0.1)', borderRadius: '8px', marginBottom: '16px' }}></div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px', color: th.text }}>{listing.title}</h3>
                  <p style={{ fontSize: '14px', color: th.textSub }}>{listing.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ AI HUB ══ */}
        <section style={{ padding: '96px 60px', background: th.bg, borderTop: `1px solid ${th.border}` }}>
           <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '24px' }}>
              The <span className="gold-text">AI Hub</span>
            </h2>
            <p style={{ fontSize: '16px', color: th.textSub, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
              Leverage advanced machine learning algorithms to predict market trends and find your perfect investment.
            </p>
            <div style={{ padding: '40px', background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: '12px' }}>
              <div style={{ color: COLORS.gold, fontSize: '24px', marginBottom: '16px' }}>AI Match Engine Active</div>
              <button style={{
                  background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                  color: COLORS.navy,
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 24px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  cursor: 'pointer'
              }}>Start AI Matching</button>
            </div>
           </div>
        </section>

        {/* ══ ROI CALCULATOR ══ */}
        <section style={{ padding: '96px 60px', background: th.bg2, borderTop: `1px solid ${th.border}` }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '40px' }}>
              ROI <span className="gold-text">Calculator</span>
            </h2>
            <div style={{ padding: '40px', background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${th.border}`, paddingBottom: '16px' }}>
                <span style={{ fontSize: '16px', color: th.textSub }}>Investment Amount</span>
                <span style={{ fontSize: '20px', fontWeight: 600, color: th.text }}>$1,000,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${th.border}`, paddingBottom: '16px' }}>
                <span style={{ fontSize: '16px', color: th.textSub }}>Expected Return (5 Yrs)</span>
                <span style={{ fontSize: '20px', fontWeight: 600, color: COLORS.gold }}>+45%</span>
              </div>
              <button style={{
                  background: 'transparent',
                  color: th.text,
                  border: `1px solid ${COLORS.gold}`,
                  borderRadius: '6px',
                  padding: '12px 24px',
                  marginTop: '16px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  cursor: 'pointer'
              }}>Customize Calculation</button>
            </div>
          </div>
        </section>

        {/* ══ CTA FORM ══ */}
        <section
          style={{
            padding: '96px 60px',
            background: mode === 'dark' ? 'linear-gradient(135deg, #050B14, #071422)' : 'linear-gradient(135deg, #EFF8F7, #DFF1EE)',
            borderTop: `1px solid ${th.border}`,
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <div className="reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: COLORS.gold,
                  marginBottom: '12px',
                }}
              >
                {T.ctaTag}
              </div>
              <h2
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: 'clamp(32px, 5vw, 48px)',
                  fontWeight: 300,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '12px',
                }}
              >
                {T.ctaH}
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 300,
                  color: th.textSub,
                  lineHeight: 1.7,
                }}
              >
                {T.ctaSub}
              </p>
            </div>

            <div className="reveal reveal-d1">
              {submitted ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px',
                    background: mode === 'dark' ? 'rgba(233, 193, 118, 0.08)' : 'rgba(233, 193, 118, 0.14)',
                    border: `1px solid rgba(233, 193, 118, 0.3)`,
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>✓</div>
                  <div
                    style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '26px',
                      color: COLORS.gold,
                      marginBottom: '8px',
                    }}
                  >
                    {locale === 'en' ? 'Thank you!' : 'شكراً!'}
                  </div>
                  <p style={{ fontSize: '14px', color: th.textSub }}>
                    {T.formSuccess}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {[
                    { key: 'name', label: T.formName, type: 'text' },
                    { key: 'phone', label: T.formPhone, type: 'tel' },
                  ].map((field) => (
                    <input
                      key={field.key}
                      type={field.type}
                      required
                      placeholder={field.label}
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: e.target.value,
                        })
                      }
                      style={{
                        background: th.card,
                        border: `1px solid ${th.border}`,
                        borderRadius: '6px',
                        padding: '13px 16px',
                        color: th.text,
                        fontFamily: '"Jost", sans-serif',
                        fontSize: '14px',
                        fontWeight: 300,
                        outline: 'none',
                        transition: 'border-color 200ms ease',
                        textAlign: isAr ? 'right' : 'left',
                      }}
                      onFocus={(e) => {
                        (e.target as HTMLElement).style.borderColor = COLORS.gold;
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLElement).style.borderColor = th.border;
                      }}
                    />
                  ))}
                  <button
                    type="submit"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                      color: COLORS.navy,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '14px',
                      fontWeight: 600,
                      fontSize: '12px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      boxShadow: `0 4px 20px rgba(233,193,118,0.25)`,
                      transition: 'all 300ms ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.opacity = '0.88';
                      (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.opacity = '1';
                      (e.target as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    {T.formSubmit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer
          style={{
            background: mode === 'dark' ? '#040E1C' : '#040E1C',
            color: '#EFF8F7',
            padding: '72px 60px 36px',
            borderTop: '1px solid rgba(233, 193, 118, 0.12)',
          }}
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: '60px',
              marginBottom: '48px',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '20px',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  color: COLORS.gold,
                  marginBottom: '8px',
                }}
              >
                {T.brand}
              </div>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: 'rgba(239, 248, 247, 0.4)',
                  maxWidth: '280px',
                }}
              >
                The future of real estate in Egypt.
              </p>
            </div>
            {T.footerLinks.map((link, i) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: COLORS.gold,
                    marginBottom: '16px',
                  }}
                >
                  {link}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(239, 248, 247, 0.06)',
              paddingTop: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 300,
                color: 'rgba(239, 248, 247, 0.25)',
              }}
            >
              {T.copyright}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
