'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

const G = '#E9C176';
const G2 = '#C8961A';

const THEMES = {
  dark: {
    bg: '#0D2035', text: '#EFF8F7', textSub: 'rgba(239,248,247,0.78)',
    border: 'rgba(233,193,118,0.18)', card: '#122A47'
  },
  light: {
    bg: '#D5E8E6', text: '#071422', textSub: 'rgba(7,20,34,0.78)',
    border: 'rgba(27,108,168,0.20)', card: '#E2EDEC'
  },
};

export default function VirtualTourComingSoon() {
  const { theme } = useTheme();
  const mode = (theme === 'light' ? 'light' : 'dark') as 'light' | 'dark';
  const th = THEMES[mode];

  return (
    <div style={{ background: th.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: 600, textAlign: 'center' }}>
        {/* Animated icon */}
        <div className="mb-8" style={{ fontSize: 80, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
          🏠
        </div>

        {/* Heading */}
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: th.text, marginBottom: 16 }}>
          Virtual Tours
        </h1>

        {/* Subheading */}
        <div style={{ fontSize: 18, fontWeight: 300, lineHeight: 1.6, color: th.textSub, marginBottom: 32, fontFamily: "'Jost', sans-serif" }}>
          Experience properties like never before with our immersive 360° virtual tours powered by AI.
        </div>

        {/* Description */}
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: 12, padding: 32, marginBottom: 40 }}>
          <div style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.8, color: th.textSub, marginBottom: 20, fontFamily: "'Jost', sans-serif" }}>
            We're crafting an immersive experience that lets you explore every corner of our featured properties from the comfort of your home. Walk through luxury villas, penthouses, and compounds with interactive 360° views, floor plans, and AI-guided insights.
          </div>

          <div className="space-y-3">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexDirection: 'row' }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: `linear-gradient(135deg,${G2},${G})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#071422', fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 13, color: th.textSub, fontFamily: "'Jost', sans-serif" }}>360° immersive property walkthroughs</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: `linear-gradient(135deg,${G2},${G})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#071422', fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 13, color: th.textSub, fontFamily: "'Jost', sans-serif" }}>AI-guided property insights and analysis</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: `linear-gradient(135deg,${G2},${G})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#071422', fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 13, color: th.textSub, fontFamily: "'Jost', sans-serif" }}>Interactive floor plans and measurements</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: `linear-gradient(135deg,${G2},${G})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#071422', fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 13, color: th.textSub, fontFamily: "'Jost', sans-serif" }}>Real-time availability and pricing</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/">
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `linear-gradient(135deg,${G2},${G})`, color: '#071422', border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '14px 32px', borderRadius: 4, transition: 'all 0.3s ease' }}>
              ← Back to Listings
            </button>
          </Link>

          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: G, border: `1px solid ${G}`, cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '14px 32px', borderRadius: 4, transition: 'all 0.3s ease' }}>
            Notify Me
          </button>
        </div>

        {/* Coming Soon Badge */}
        <div style={{ marginTop: 48, padding: 16, background: 'rgba(233,193,118,0.10)', border: `1px solid ${th.border}`, borderRadius: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: '.14em', color: G, textTransform: 'uppercase', fontFamily: "'Jost', sans-serif" }}>
            🚀 Coming Very Soon
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
