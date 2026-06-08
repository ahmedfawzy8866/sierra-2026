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
    pageTitle: 'Featured Projects',
    heroH: 'Premium Development Projects',
    heroSub: 'Discover Egypt\'s most coveted residential and mixed-use developments. Each project is hand-selected for investment quality and market positioning.',
    projectsH: 'Our Portfolio',
    projects: [
      { name: 'Fifth Settlement Estates', location: '5th Settlement · Cairo', units: '45', yield: '8.2%', status: 'Selling', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80' },
      { name: 'Madinaty Grand', location: 'Madinaty · New Cairo', units: '120', yield: '7.5%', status: 'Launching', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80' },
      { name: 'Mountain View Residences', location: 'New Cairo', units: '32', yield: '8.8%', status: 'Selling', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80' },
      { name: 'Downtown Heights', location: 'New Cairo Center', units: '78', yield: '7.9%', status: 'Coming Soon', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' },
    ],
    footDesc: 'Beyond Brokerage. Intelligence-led real estate advisory for discerning investors in New Cairo and beyond.',
  },
  ar: {
    dir: 'rtl' as const,
    brand: 'سييرا بلو', sub: 'للعقارات',
    pageTitle: 'المشاريع المميزة',
    heroH: 'مشاريع تطوير عقاري مميزة',
    heroSub: 'اكتشف أكثر المشاريع السكنية والمختلطة المطلوبة في مصر. كل مشروع تم اختياره يدويًا لجودة الاستثمار والموقع السوقي.',
    projectsH: 'محفظتنا',
    projects: [
      { name: 'إستيتس التجمع الخامس', location: 'التجمع الخامس · القاهرة', units: '45', yield: '8.2%', status: 'قيد البيع', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80' },
      { name: 'مدينتي جراند', location: 'مدينتي · القاهرة الجديدة', units: '120', yield: '7.5%', status: 'قيد الإطلاق', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80' },
      { name: 'ماونتن فيو ريزيدنسز', location: 'القاهرة الجديدة', units: '32', yield: '8.8%', status: 'قيد البيع', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80' },
      { name: 'داونتاون هايتس', location: 'وسط القاهرة الجديدة', units: '78', yield: '7.9%', status: 'قريباً', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' },
    ],
    footDesc: 'أبعد من الوساطة. استشارات عقارية مدعومة بالذكاء الاصطناعي للمستثمرين في القاهرة الجديدة.',
  },
};

export default function ProjectsPage() {
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
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1800&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: mode === 'dark' ? 0.3 : 0.1 }} />
        <div style={{ position: 'absolute', inset: 0, background: mode === 'dark' ? 'linear-gradient(105deg,rgba(10,21,32,.97) 0%,rgba(13,32,53,.85) 50%,rgba(10,21,32,.6) 100%)' : 'linear-gradient(105deg,rgba(192,214,212,.98) 0%,rgba(213,232,230,.95) 50%,rgba(192,214,212,.7) 100%)' }} />
        <div style={{ ...sec, position: 'relative', zIndex: 2, width: '100%', textAlign: isAr ? 'right' : 'left' }}>
          <div style={{ maxWidth: 700, animation: loaded ? 'fadeUp .6s ease .1s both' : 'none' }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(40px, 5vw, 72px)', fontWeight: 300, color: th.text, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>{T.heroH}</h1>
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.heroSub}</p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section style={{ background: mode === 'dark' ? '#0A1520' : th.bgAlt, padding: '96px 0' }}>
        <div style={sec}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>Development Pipeline</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text }}>{T.projectsH}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {T.projects.map((p, i) => (
              <div key={i} style={{ background: th.card, border: `1px solid ${th.cardBorder}`, borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'all .3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(233,193,118,0.15)`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', height: 240, objectFit: 'cover' }} />
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12, flexDirection: isAr ? 'row-reverse' : 'row' }}>
                    <div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: th.text, marginBottom: 4 }}>{p.name}</h3>
                      <div style={{ fontSize: 12, color: th.textSub, fontFamily: "'Jost', sans-serif" }}>{p.location}</div>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: '#fff', background: p.status === 'Selling' || p.status === 'قيد البيع' ? G2 : p.status === 'Launching' || p.status === 'قيد الإطلاق' ? G : '#7EA8B4', padding: '4px 10px', borderRadius: 50, fontFamily: "'Jost', sans-serif" }}>{p.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4" style={{ borderTop: `1px solid ${th.border}` }}>
                    <div style={{ textAlign: isAr ? 'right' : 'left' }}>
                      <div style={{ fontSize: 9, color: th.textMuted, fontFamily: "'Jost', sans-serif", textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>Units</div>
                      <div style={{ fontSize: 18, color: G, fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{p.units}</div>
                    </div>
                    <div style={{ textAlign: isAr ? 'right' : 'left' }}>
                      <div style={{ fontSize: 9, color: th.textMuted, fontFamily: "'Jost', sans-serif", textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>Est. Yield</div>
                      <div style={{ fontSize: 18, color: G, fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{p.yield}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: th.bg, padding: '96px 0', textAlign: 'center' }}>
        <div style={sec}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text, marginBottom: 20 }}>{lang === 'en' ? 'Interested in a Project?' : 'هل أنت مهتم بمشروع؟'}</h2>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '12px 26px', borderRadius: 4, textDecoration: 'none' }}>{lang === 'en' ? 'Request Details' : 'اطلب التفاصيل'} →</Link>
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
