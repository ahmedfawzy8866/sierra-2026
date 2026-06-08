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
    pageTitle: 'Join Our Team',
    heroH: 'Build the Future of Real Estate',
    heroSub: 'Sierra Estates is looking for talented individuals passionate about excellence, intelligence, and transforming the property market.',
    openingsH: 'Open Positions',
    openings: [
      { title: 'Senior Property Advisor', location: 'Cairo', type: 'Full-time', desc: 'Lead client relationships and deliver premium advisory services across our portfolio.' },
      { title: 'AI/Data Analyst', location: 'Remote', type: 'Full-time', desc: 'Build market intelligence systems and predictive models for property insights.' },
      { title: 'Content & Marketing Manager', location: 'Cairo', type: 'Full-time', desc: 'Shape our brand voice and create compelling market narratives.' },
      { title: 'Operations Specialist', location: 'Cairo', type: 'Full-time', desc: 'Optimize our internal workflows and client experience processes.' },
    ],
    culturH: 'Why Join Sierra Estates?',
    culture: [
      'Work at the intersection of technology and luxury real estate',
      'Collaborate with a small, elite team pushing boundaries',
      'Access to continuous learning and professional development',
      'Competitive compensation and performance incentives',
      'Flexible work arrangements for top talent',
    ],
    footDesc: 'Beyond Brokerage. Intelligence-led real estate advisory for discerning investors in New Cairo and beyond.',
  },
  ar: {
    dir: 'rtl' as const,
    brand: 'سييرا بلو', sub: 'للعقارات',
    pageTitle: 'انضم إلى فريقنا',
    heroH: 'ابنِ مستقبل العقارات',
    heroSub: 'تبحث سييرا بلو عن أفراد موهوبين متحمسين للتفوق والذكاء وتحويل سوق العقارات.',
    openingsH: 'الوظائف الشاغرة',
    openings: [
      { title: 'مستشار عقاري أول', location: 'القاهرة', type: 'دوام كامل', desc: 'قيادة علاقات العملاء وتقديم خدمات استشارية مميزة عبر محفظتنا.' },
      { title: 'محلل ذكاء اصطناعي/بيانات', location: 'عن بعد', type: 'دوام كامل', desc: 'بناء أنظمة ذكاء السوق والنماذج التنبؤية لرؤى العقارات.' },
      { title: 'مدير المحتوى والتسويق', location: 'القاهرة', type: 'دوام كامل', desc: 'صياغة صوت علامتنا التجارية وإنشاء سرديات سوق جذابة.' },
      { title: 'متخصص العمليات', location: 'القاهرة', type: 'دوام كامل', desc: 'تحسين سير عملنا الداخلي وعمليات تجربة العميل.' },
    ],
    culturH: 'لماذا تنضم إلى سييرا بلو؟',
    culture: [
      'العمل في تقاطع التكنولوجيا والعقارات الفاخرة',
      'التعاون مع فريق صغير نخبوي يدفع الحدود',
      'الوصول إلى التعلم المستمر والتطوير المهني',
      'تعويضات تنافسية وحوافز الأداء',
      'ترتيبات العمل المرنة للمواهب المتميزة',
    ],
    footDesc: 'أبعد من الوساطة. استشارات عقارية مدعومة بالذكاء الاصطناعي للمستثمرين في القاهرة الجديدة.',
  },
};

export default function CareersPage() {
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
            <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{T.heroSub}</p>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section style={{ background: mode === 'dark' ? '#0A1520' : th.bgAlt, padding: '96px 0' }}>
        <div style={sec}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>Now Hiring</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text }}>{T.openingsH}</h2>
          </div>
          <div className="grid gap-5">
            {T.openings.map((j, i) => (
              <div key={i} style={{ background: th.surface, border: `1px solid ${th.border}`, borderRadius: 14, padding: 32, textAlign: isAr ? 'right' : 'left' }}>
                <div className="flex justify-between items-start gap-4 mb-4" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
                  <div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, color: th.text, marginBottom: 8 }}>{j.title}</h3>
                    <div className="flex gap-3" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
                      <span style={{ fontSize: 12, color: th.textSub, fontFamily: "'Jost', sans-serif" }}>{j.location}</span>
                      <span style={{ fontSize: 12, color: G, fontFamily: "'Jost', sans-serif" }}>{j.type}</span>
                    </div>
                  </div>
                  <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '9px 16px', borderRadius: 4, textDecoration: 'none', whiteSpace: 'nowrap' }}>Apply</Link>
                </div>
                <p style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.85, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{j.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section style={{ background: th.bg, padding: '96px 0' }}>
        <div style={sec}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text }}>{T.culturH}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {T.culture.map((c, i) => (
              <div key={i} className="flex items-start gap-4" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: G, flexShrink: 0, marginTop: 6 }} />
                <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.6, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{c}</p>
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
            <div style={{ fontSize: 11, fontWeight: 300, color: 'rgba(239,248,247,0.28)', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>© 2026 Sierra Estates Realty. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
