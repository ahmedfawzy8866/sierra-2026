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
    brand: 'SIERRA ESTATES', sub: 'REALTY',
    pageTitle: 'Our Services',
    heroH: 'Premium Advisory Services',
    heroSub: 'From property discovery to closing, we handle every aspect of your investment journey with precision and care.',
    servicesH: 'What We Offer',
    services: [
      { icon: '◆', title: 'Property Discovery', desc: 'AI-powered matching and curated selections based on your exact investment criteria.' },
      { icon: '◈', title: 'Market Intelligence', desc: 'Live ROI analysis, yield projections, and growth corridor insights for informed decisions.' },
      { icon: '◉', title: 'Advisory & Due Diligence', desc: 'Personal advisor support from first inquiry through final signature — always available.' },
      { icon: '◊', title: 'Deal Structuring', desc: 'Comprehensive analysis of financing options, legal frameworks, and tax optimization.' },
      { icon: '▪', title: 'Document Management', desc: 'Secure handling of all agreements, contracts, and closing documentation.' },
      { icon: '◈', title: 'Post-Close Support', desc: 'Ongoing asset management, rental yield tracking, and portfolio optimization.' },
    ],
    footDesc: 'Beyond Brokerage. Intelligence-led real estate advisory for discerning investors in New Cairo and beyond.',
  },
  ar: {
    dir: 'rtl' as const,
    brand: 'سييرا بلو', sub: 'للعقارات',
    pageTitle: 'خدماتنا',
    heroH: 'خدمات استشارة مميزة',
    heroSub: 'من اكتشاف العقار إلى الإغلاق، نتولى كل جوانب رحلة استثمارك بدقة واهتمام.',
    servicesH: 'ما نقدمه',
    services: [
      { icon: '◆', title: 'اكتشاف العقار', desc: 'مطابقة مدعومة بالذكاء الاصطناعي واختيارات منتقاة بناءً على معايير استثمارك.' },
      { icon: '◈', title: 'ذكاء السوق', desc: 'تحليل عائد الاستثمار الحي، وتوقعات العوائد، والرؤى حول ممرات النمو.' },
      { icon: '◉', title: 'استشارة فنية', desc: 'دعم مستشار شخصي من أول استفسار لآخر توقيع — متاح دائماً.' },
      { icon: '◊', title: 'هيكلة الصفقات', desc: 'تحليل شامل لخيارات التمويل والأطر القانونية وتحسين الضرائب.' },
      { icon: '▪', title: 'إدارة المستندات', desc: 'معالجة آمنة لجميع الاتفاقيات والعقود والوثائق الختامية.' },
      { icon: '◈', title: 'الدعم بعد الإغلاق', desc: 'إدارة الأصول المستمرة، وتتبع عائد الإيجار، وتحسين المحفظة.' },
    ],
    footDesc: 'أبعد من الوساطة. استشارات عقارية مدعومة بالذكاء الاصطناعي للمستثمرين في القاهرة الجديدة.',
  },
};

export default function ServicesPage() {
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
      <section style={{ position: 'relative', minHeight: '70vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: th.heroBg, paddingTop: 100, marginTop: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: mode === 'dark' ? 'linear-gradient(105deg,rgba(10,21,32,.97) 0%,rgba(13,32,53,.85) 50%,rgba(10,21,32,.6) 100%)' : 'linear-gradient(105deg,rgba(192,214,212,.98) 0%,rgba(213,232,230,.95) 50%,rgba(192,214,212,.7) 100%)' }} />
        <div style={{ ...sec, position: 'relative', zIndex: 2, width: '100%', textAlign: isAr ? 'right' : 'left' }}>
          <div style={{ maxWidth: 700, animation: loaded ? 'fadeUp .6s ease .1s both' : 'none' }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 300, color: th.text, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>{T.heroH}</h1>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: th.textSub, marginBottom: 40, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.heroSub}</p>
            <Link href="/listings" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '12px 26px', borderRadius: 4, textDecoration: 'none' }}>Explore Properties →</Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ background: mode === 'dark' ? '#0A1520' : th.bgAlt, padding: '96px 0' }}>
        <div style={sec}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>Comprehensive Solutions</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text }}>{T.servicesH}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {T.services.map((s, i) => (
              <div key={i} style={{ background: th.surface, border: `1px solid ${th.border}`, borderRadius: 14, padding: 32, textAlign: isAr ? 'right' : 'left', transition: 'all .3s ease', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(233,193,118,0.15)`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ fontSize: 28, color: G, marginBottom: 16, fontFamily: "'Cormorant Garamond', serif" }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, color: th.text, marginBottom: 10 }}>{s.title}</h3>
                <div style={{ width: 36, height: 2, background: `linear-gradient(90deg,${G2},${G})`, borderRadius: 1, marginBottom: 14, marginLeft: isAr ? 'auto' : 0 }} />
                <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.85, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: th.bg, padding: '96px 0', textAlign: 'center' }}>
        <div style={sec}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text, marginBottom: 20 }}>{lang === 'en' ? 'Ready to Start?' : 'هل تريد أن تبدأ؟'}</h2>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '12px 26px', borderRadius: 4, textDecoration: 'none' }}>{lang === 'en' ? 'Contact Us Today' : 'تواصل معنا اليوم'} →</Link>
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
            <div style={{ fontSize: 11, fontWeight: 300, color: 'rgba(239,248,247,0.28)', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>© 2026 Sierra Estates Realty. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
