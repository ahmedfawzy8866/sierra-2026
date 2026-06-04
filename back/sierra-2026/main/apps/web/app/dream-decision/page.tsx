'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ArrowLeft, CheckCircle, Compass } from 'lucide-react';

const G = '#E9C176';
const G2 = '#C8961A';

const THEMES = {
  dark: {
    bg: '#0D2035', text: '#EFF8F7', textSub: 'rgba(239,248,247,0.78)',
    border: 'rgba(233,193,118,0.18)', card: '#122A47', bg2: '#0A1520',
  },
  light: {
    bg: '#EEF2F4', text: '#0C1B2E', textSub: 'rgba(12,27,46,0.74)',
    border: 'rgba(12,27,46,0.14)', card: '#FFFFFF', bg2: '#DCE4E8',
  },
};

export default function DreamDecisionPage() {
  const { theme } = useTheme();
  const mode = (theme === 'light' ? 'light' : 'dark') as 'light' | 'dark';
  const th = THEMES[mode];

  const [step, setStep] = useState(1);
  const [priority, setPriority] = useState('');
  const [budget, setBudget] = useState('');

  const handleNext = (val: string) => {
    if (step === 1) setPriority(val);
    if (step === 3) setBudget(val);
    setStep(prev => prev + 1);
  };

  const getRecommendation = () => {
    if (budget === 'low') {
      return {
        compound: 'Madinaty Talaat Moustafa',
        reason: 'Best fit for budget constraints while offering highly integrated mega-city services, perfect for families.',
        stats: 'Avg price EGP 7.5M · High occupancy · 10.4% Rental Yield',
        actionUrl: '/?location=madinaty#listings'
      };
    }
    if (priority === 'lifestyle' || priority === 'luxury') {
      return {
        compound: 'Lake View Residence (Golden Square)',
        reason: 'Unmatched landscape-to-water ratios, premium residential density, and situated directly in the heart of Tagamoa Golden Square.',
        stats: 'Avg price EGP 12.5M · High-end finished rentals · 9.2% ROI',
        actionUrl: '/?location=fifth#listings'
      };
    }
    return {
      compound: 'Mivida Emaar',
      reason: 'Perfect ecological environment, high security, prime resale value, and exceptional walking masterplan.',
      stats: 'Avg price EGP 14.8M · Prime family favorite · 8.7% ROI',
      actionUrl: '/?location=fifth#listings'
    };
  };

  const recommendation = getRecommendation();

  return (
    <div style={{ background: th.bg, color: th.text, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Jost', sans-serif" }}>
      {/* Header */}
      <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', borderBottom: `1px solid ${th.border}`, backdropFilter: 'blur(20px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/">
            <button style={{ background: 'transparent', border: `1px solid ${th.border}`, color: th.text, width: 40, height: 40, borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.02em' }}>AI Dream Home Advisor</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: th.textSub }}>AI-driven lifestyle matching for compound selection</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(233,193,118,0.1)', border: `1px solid ${G}`, borderRadius: '24px', padding: '6px 16px', fontSize: '0.8rem', color: G }}>
          <Compass size={14} />
          <span>Decision Intelligence</span>
        </div>
      </div>

      {/* Main Form Area */}
      <div style={{ maxWidth: 700, margin: '4rem auto', width: '100%', padding: '0 2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyItems: 'center' }}>
        
        {step <= 3 ? (
          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '24px', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Step Counter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: G, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Question {step} of 3
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3].map((s) => (
                  <span key={s} style={{ width: '24px', height: '4px', borderRadius: '2px', backgroundColor: step >= s ? G : 'rgba(255,255,255,0.08)' }} />
                ))}
              </div>
            </div>

            {/* Step 1: Priority */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.75rem', fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                  What is your absolute priority in a home?
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button onClick={() => handleNext('luxury')} style={{ padding: '1.25rem', textAlign: 'left', background: 'rgba(255,255,255,0.01)', border: `1px solid ${th.border}`, borderRadius: '16px', color: th.text, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <strong style={{ display: 'block', color: G, fontSize: '1rem' }}>Luxury & Status</strong>
                    <span style={{ fontSize: '0.8rem', color: th.textSub }}>Exclusive community, high security, and bespoke landscaping.</span>
                  </button>
                  <button onClick={() => handleNext('yield')} style={{ padding: '1.25rem', textAlign: 'left', background: 'rgba(255,255,255,0.01)', border: `1px solid ${th.border}`, borderRadius: '16px', color: th.text, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <strong style={{ display: 'block', color: G, fontSize: '1rem' }}>Investment Yield (ROI)</strong>
                    <span style={{ fontSize: '0.8rem', color: th.textSub }}>High occupancy rates, strong rental demand, and capital gains.</span>
                  </button>
                  <button onClick={() => handleNext('lifestyle')} style={{ padding: '1.25rem', textAlign: 'left', background: 'rgba(255,255,255,0.01)', border: `1px solid ${th.border}`, borderRadius: '16px', color: th.text, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <strong style={{ display: 'block', color: G, fontSize: '1rem' }}>Family Lifestyle & Quietness</strong>
                    <span style={{ fontSize: '0.8rem', color: th.textSub }}>Lush parks, walking trails, kids playgrounds, and nearby international schools.</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Family Size */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.75rem', fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                  Who will be living in your dream home?
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button onClick={() => handleNext('single')} style={{ padding: '1.25rem', textAlign: 'left', background: 'rgba(255,255,255,0.01)', border: `1px solid ${th.border}`, borderRadius: '16px', color: th.text, cursor: 'pointer' }}>
                    <strong style={{ display: 'block', color: G, fontSize: '1rem' }}>Single / Professional couple</strong>
                    <span style={{ fontSize: '0.8rem', color: th.textSub }}>Seeking modern smart-penthouses, close to premium hubs/cafes.</span>
                  </button>
                  <button onClick={() => handleNext('family')} style={{ padding: '1.25rem', textAlign: 'left', background: 'rgba(255,255,255,0.01)', border: `1px solid ${th.border}`, borderRadius: '16px', color: th.text, cursor: 'pointer' }}>
                    <strong style={{ display: 'block', color: G, fontSize: '1rem' }}>Family with children</strong>
                    <span style={{ fontSize: '0.8rem', color: th.textSub }}>Requires 3-5 bedrooms, expansive gardens, secure compounds, and nearby clubs.</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Budget */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.75rem', fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                  What is your target budget for this investment?
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button onClick={() => handleNext('low')} style={{ padding: '1.25rem', textAlign: 'left', background: 'rgba(255,255,255,0.01)', border: `1px solid ${th.border}`, borderRadius: '16px', color: th.text, cursor: 'pointer' }}>
                    <strong style={{ display: 'block', color: G, fontSize: '1rem' }}>Under EGP 8,000,000</strong>
                    <span style={{ fontSize: '0.8rem', color: th.textSub }}>Exceptional standard apartments in premium residential compounds.</span>
                  </button>
                  <button onClick={() => handleNext('mid')} style={{ padding: '1.25rem', textAlign: 'left', background: 'rgba(255,255,255,0.01)', border: `1px solid ${th.border}`, borderRadius: '16px', color: th.text, cursor: 'pointer' }}>
                    <strong style={{ display: 'block', color: G, fontSize: '1rem' }}>EGP 8,000,000 - 15,000,000</strong>
                    <span style={{ fontSize: '0.8rem', color: th.textSub }}>Luxury apartments, spacious penthouses, or townhouses.</span>
                  </button>
                  <button onClick={() => handleNext('high')} style={{ padding: '1.25rem', textAlign: 'left', background: 'rgba(255,255,255,0.01)', border: `1px solid ${th.border}`, borderRadius: '16px', color: th.text, cursor: 'pointer' }}>
                    <strong style={{ display: 'block', color: G, fontSize: '1rem' }}>EGP 15,000,000+</strong>
                    <span style={{ fontSize: '0.8rem', color: th.textSub }}>Exclusive standalone villas, prime compounds, and custom properties.</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Recommendation Output */
          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '24px', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', color: '#22c55e', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem auto' }}>
                <CheckCircle size={32} />
              </div>
              <span style={{ fontSize: '0.85rem', color: G, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block' }}>
                Sierra AI Compound Recommendation
              </span>
              <h2 style={{ margin: '0.5rem 0', fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#fff' }}>
                {recommendation.compound}
              </h2>
              <span style={{ display: 'inline-block', fontSize: '0.8rem', color: th.textSub, background: th.bg, border: `1px solid ${th.border}`, padding: '4px 14px', borderRadius: '999px', marginTop: '4px' }}>
                {recommendation.stats}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.95rem', color: th.textSub, lineHeight: 1.7, padding: '0 1rem' }}>
              {recommendation.reason}
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link href={recommendation.actionUrl}>
                <button style={{ padding: '14px 28px', background: `linear-gradient(135deg, ${G2}, ${G})`, color: '#000', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Explore Curated Units
                </button>
              </Link>
              <button 
                onClick={() => setStep(1)}
                style={{ padding: '14px 28px', background: 'transparent', border: `1px solid ${th.border}`, color: th.text, borderRadius: '12px', cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Restart Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
