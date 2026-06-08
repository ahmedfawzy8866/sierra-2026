'use client';

import React, { useState, useEffect } from 'react';
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
    pageTitle: 'Contact Sierra Estates',
    heroH: 'Get in Touch',
    heroSub: 'Our advisory team responds within 4 seconds. Reach out via phone, email, or the form below.',
    formH: 'Start Your Conversation',
    formName: 'Full Name',
    formEmail: 'Email Address',
    formPhone: 'Phone Number',
    formMessage: 'Message',
    formSubmit: 'Send Message',
    contactH: 'Contact Information',
    contactEmail: 'hello@sierrablurealty.com',
    contactPhone: '+20 123 456 7890',
    contactAddress: 'New Cairo, Egypt',
    footDesc: 'Beyond Brokerage. Intelligence-led real estate advisory for discerning investors in New Cairo and beyond.',
  },
  ar: {
    dir: 'rtl' as const,
    brand: 'سييرا بلو', sub: 'للعقارات',
    pageTitle: 'تواصل معنا',
    heroH: 'تواصل معنا',
    heroSub: 'فريق الاستشارة لدينا يرد في غضون 4 ثوان. تواصل عبر الهاتف أو البريد الإلكتروني أو النموذج أدناه.',
    formH: 'ابدأ محادثتك',
    formName: 'الاسم الكامل',
    formEmail: 'عنوان البريد الإلكتروني',
    formPhone: 'رقم الهاتف',
    formMessage: 'الرسالة',
    formSubmit: 'إرسال الرسالة',
    contactH: 'معلومات التواصل',
    contactEmail: 'hello@sierrablurealty.com',
    contactPhone: '+20 123 456 7890',
    contactAddress: 'القاهرة الجديدة، مصر',
    footDesc: 'أبعد من الوساطة. استشارات عقارية مدعومة بالذكاء الاصطناعي للمستثمرين في القاهرة الجديدة.',
  },
};

export default function ContactPage() {
  const { locale } = useI18n();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

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

      {/* Contact Form & Info */}
      <section style={{ background: mode === 'dark' ? '#0A1520' : th.bgAlt, padding: '96px 0' }}>
        <div style={sec}>
          <div className="grid md:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>Send a Message</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3vw, 44px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: th.text, marginBottom: 32 }}>{T.formH}</h2>

              {submitted ? (
                <div style={{ background: mode === 'dark' ? 'rgba(233,193,118,0.08)' : 'rgba(233,193,118,0.14)', border: '1px solid rgba(233,193,118,0.3)', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: G, marginBottom: 8 }}>{lang === 'en' ? 'Thank you.' : 'شكراً.'}</div>
                  <p style={{ fontSize: 14, color: th.textSub, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif" }}>{lang === 'en' ? 'We\'ll be in touch shortly.' : 'سنتواصل معك قريباً.'}</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col gap-4">
                  <input type="text" required placeholder={T.formName} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 6, padding: '13px 16px', color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 14, fontWeight: 300, outline: 'none', textAlign: isAr ? 'right' : 'left' }} />
                  <input type="email" required placeholder={T.formEmail} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 6, padding: '13px 16px', color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 14, fontWeight: 300, outline: 'none', textAlign: isAr ? 'right' : 'left' }} />
                  <input type="tel" required placeholder={T.formPhone} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 6, padding: '13px 16px', color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 14, fontWeight: 300, outline: 'none', textAlign: isAr ? 'right' : 'left' }} />
                  <textarea required placeholder={T.formMessage} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 6, padding: '13px 16px', color: th.text, fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 14, fontWeight: 300, outline: 'none', textAlign: isAr ? 'right' : 'left', minHeight: 120, resize: 'none' }} />
                  <button type="submit" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: isAr ? "'Cairo', sans-serif" : "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '14px 26px', borderRadius: 4 }}>{T.formSubmit}</button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div style={{ textAlign: isAr ? 'right' : 'left' }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.24em', textTransform: 'uppercase', color: G, marginBottom: 10, fontFamily: "'Jost', sans-serif" }}>Reach Out</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3vw, 44px)', fontWeight: 300, lineHeight: 1.15, letterSpacing: '-0.02em', color: th.text, marginBottom: 32 }}>{T.contactH}</h2>
              <div className="space-y-6">
                <div>
                  <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: G, marginBottom: 6, fontFamily: "'Jost', sans-serif" }}>Email</div>
                  <div style={{ fontSize: 16, color: th.text, fontFamily: "'Jost', sans-serif" }}>{T.contactEmail}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: G, marginBottom: 6, fontFamily: "'Jost', sans-serif" }}>Phone</div>
                  <div style={{ fontSize: 16, color: th.text, fontFamily: "'Jost', sans-serif" }}>{T.contactPhone}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.1em', textTransform: 'uppercase', color: G, marginBottom: 6, fontFamily: "'Jost', sans-serif" }}>Address</div>
                  <div style={{ fontSize: 16, color: th.text, fontFamily: "'Jost', sans-serif" }}>{T.contactAddress}</div>
                </div>
              </div>
            </div>
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
