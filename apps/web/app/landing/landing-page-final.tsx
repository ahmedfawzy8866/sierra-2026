'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useI18n } from '@/lib/I18nContext';
import dynamic from 'next/dynamic';

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
  const [listings, setListings] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

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

        {/* ══ HERO SECTION ══ */}
        <section
          style={{
            padding: '96px 60px',
            background: `linear-gradient(135deg, ${th.bg} 0%, ${th.bg2} 100%)`,
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="reveal" style={{ maxWidth: '800px', textAlign: 'center' }}>
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
                color: th.textSub,
                maxWidth: '600px',
                margin: '0 auto 40px',
                lineHeight: 1.7,
              }}
            >
              {T.heroDesc}
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                style={{
                  background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
                  color: COLORS.navy,
                  border: 'none',
                  borderRadius: '6px',
                  padding: '14px 32px',
                  fontWeight: 600,
                  fontSize: '12px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: `0 8px 30px rgba(233,193,118,0.35)`,
                }}
              >
                {T.btnDiscover}
              </button>
              <button
                style={{
                  background: 'transparent',
                  color: th.text,
                  border: `1px solid ${th.border}`,
                  borderRadius: '6px',
                  padding: '13px 32px',
                  fontWeight: 600,
                  fontSize: '12px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 300ms ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = COLORS.gold;
                  (e.target as HTMLElement).style.color = COLORS.gold;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = th.border;
                  (e.target as HTMLElement).style.color = th.text;
                }}
              >
                {T.btnView}
              </button>
            </div>
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
