'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/I18nContext';
import { useTheme } from 'next-themes';
import ShieldLogo from '@/components/Landing/ShieldLogo';

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

const COPY = {
  en: {
    dir: 'ltr' as const,
    brand: 'SIERRA BLU', sub: 'REALTY',
    tagline: 'INTELLIGENCE-LED PROPERTY ADVISORY',
    pageTitle: 'About Sierra Blu',
    heroH: 'Building Tomorrow\'s Real Estate Intelligence',
    heroSub: 'Sierra Blu is redefining how investors discover, understand, and acquire premium properties across Egypt\'s most coveted addresses.',
    missionH: 'Our Mission',
    missionT: 'Precision meets Purpose',
    missionD: 'We believe exceptional properties deserve exceptional advisory. Every client receives research-backed guidance, curated selections, and dedicated support from first inquiry to final signature.',
    visionH: 'Our Vision',
    visionT: 'Intelligence-Led Real Estate',
    visionD: 'Egypt\'s premier platform where AI-driven analytics meet human expertise, creating a new standard for luxury real estate operations.',
    valuesH: 'Core Values',
    values: [
      { icon: '◆', title: 'Precision', desc: 'Every decision backed by data, every recommendation researched, every process refined.' },
      { icon: '◈', title: 'Integrity', desc: 'Full transparency with clients. No pressure sales, no overpricing — only honest guidance.' },
      { icon: '◉', title: 'Excellence', desc: 'Luxury service delivered consistently. From first response to closing support, excellence is standard.' },
    ],
    footDesc: 'Beyond Brokerage. Intelligence-led real estate advisory for discerning investors in New Cairo and beyond.',
  },
  ar: {
    dir: 'rtl' as const,
    brand: 'سييرا بلو', sub: 'للعقارات',
    tagline: 'استشارات عقارية مدعومة بالذكاء الاصطناعي',
    pageTitle: 'عن سييرا بلو',
    heroH: 'بناء ذكاء العقارات في الغد',
    heroSub: 'سييرا بلو تعيد تعريف كيفية اكتشاف المستثمرين للعقارات المميزة وفهمها والحصول عليها عبر أفضل العناوين المختارة في مصر.',
    missionH: 'رسالتنا',
    missionT: 'الدقة تلتقي بالغاية',
    missionD: 'نؤمن بأن العقارات الاستثنائية تستحق استشارات استثنائية. كل عميل يتلقى إرشادات مدعومة بالبحث، وتوصيات منتقاة، ودعماً متخصصاً من أول استفسار لآخر توقيع.',
    visionH: 'رؤيتنا',
    visionT: 'عقارات ذكية مدعومة بالذكاء الاصطناعي',
    visionD: 'منصة مصر الأولى حيث تلتقي التحليلات الذكية بالخبرة البشرية، لإنشاء معيار جديد في العمليات العقارية الفاخرة.',
    valuesH: 'قيمنا الأساسية',
    values: [
      { icon: '◆', title: 'الدقة', desc: 'كل قرار مدعوم بالبيانات، كل توصية مبحوثة، كل عملية محسّنة.' },
      { icon: '◈', title: 'النزاهة', desc: 'شفافية كاملة مع العملاء. بدون ضغوط بيع، بدون مبالغة في الأسعار — فقط إرشادات صادقة.' },
      { icon: '◉', title: 'التفوق', desc: 'خدمة فاخرة مقدمة بثبات. من أول رد إلى دعم الإغلاق، التفوق هو المعيار.' },
    ],
    footDesc: 'أبعد من الوساطة. استشارات عقارية مدعومة بالذكاء الاصطناعي للمستثمرين في القاهرة الجديدة.',
  },
};

export default function AboutPage() {
  const { locale } = useI18n();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setLoaded(true), 80);
  }, []);

  const lang = locale === 'ar' ? 'ar' : 'en';
  const mode = (theme === 'light' ? 'light' : 'dark') as 'light' | 'dark';
  const th = THEMES[mode];
  const T = COPY[lang];
  const isAr = lang === 'ar';

  const sec: React.CSSProperties = { maxWidth: 1280, margin: '0 auto', padding: '0 48px' };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: th.bg, color: th.text, transition: 'background .5s, color .5s' }} dir={T.dir}>

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: th.heroBg, paddingTop: 100, marginTop: 0 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1800&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: mode === 'dark' ? 0.3 : 0.1 }} />
        <div style={{ position: 'absolute', inset: 0, background: mode === 'dark' ? 'linear-gradient(105deg,rgba(10,21,32,.97) 0%,rgba(13,32,53,.85) 50%,rgba(10,21,32,.6) 100%)' : 'linear-gradient(105deg,rgba(192,214,212,.98) 0%,rgba(213,232,230,.95) 50%,rgba(192,214,212,.7) 100%)' }} />
        <div style={{ ...sec, position: 'relative', zIndex: 2, width: '100%', textAlign: isAr ? 'right' : 'left' }}>
          <div style={{ maxWidth: 700, animation: loaded ? 'fadeUp .6s ease .1s both' : 'none' }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 300, color: th.text, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>{T.heroH}</h1>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: th.textSub, marginBottom: 40, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.heroSub}</p>
            <Link href="/listings" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '12px 26px', borderRadius: 4, textDecoration: 'none' }}>Explore Properties →</Link>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ background: mode === 'dark' ? '#0A1520' : th.bgAlt, padding: '96px 0' }}>
        <div style={sec}>
          <div className="grid md:grid-cols-2 gap-16">
            {/* Mission */}
            <div style={{ textAlign: isAr ? 'right' : 'left' }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.missionH}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3vw, 44px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: th.text, marginBottom: 16 }}>{T.missionT}</h2>
              <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${G2},${G})`, borderRadius: 1, margin: '14px 0', marginLeft: isAr ? 'auto' : 0 }} />
              <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.85, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.missionD}</p>
            </div>

            {/* Vision */}
            <div style={{ textAlign: isAr ? 'right' : 'left' }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.visionH}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3vw, 44px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: th.text, marginBottom: 16 }}>{T.visionT}</h2>
              <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${G2},${G})`, borderRadius: 1, margin: '14px 0', marginLeft: isAr ? 'auto' : 0 }} />
              <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.85, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.visionD}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: th.bg, padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ opacity: mode === 'dark' ? 0.025 : 0.02 }}>
          <ShieldLogo size={600} />
        </div>
        <div style={{ ...sec, position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>{T.valuesH}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text }}>{T.missionT}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {T.values.map((v, i) => (
              <div key={i} style={{ background: th.surface, border: `1px solid ${th.border}`, borderRadius: 14, padding: 32, textAlign: isAr ? 'right' : 'left' }}>
                <div style={{ fontSize: 28, color: G, marginBottom: 16, fontFamily: "'Cormorant Garamond', serif" }}>{v.icon}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, color: th.text, marginBottom: 10 }}>{v.title}</h3>
                <div style={{ width: 36, height: 2, background: `linear-gradient(90deg,${G2},${G})`, borderRadius: 1, marginBottom: 14, marginLeft: isAr ? 'auto' : 0 }} />
                <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.85, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
          </div>
          <div className="flex justify-between items-center flex-wrap gap-3 pt-6" style={{ borderTop: '1px solid rgba(239,248,247,0.07)', flexDirection: isAr ? 'row-reverse' : 'row' }}>
            <div style={{ fontSize: 11, fontWeight: 300, color: 'rgba(239,248,247,0.28)', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>© 2026 Sierra Blu Realty. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
