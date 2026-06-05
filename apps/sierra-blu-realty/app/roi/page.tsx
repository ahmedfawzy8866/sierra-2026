'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ArrowLeft, TrendingUp, Calculator, HelpCircle } from 'lucide-react';

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

const ROI_STATS = [
  { compound: 'Lake View Residence', yield: '9.2%', growth: '+14.5%', tier: 'Top Tier Yield', rentPremium: 'Very High' },
  { compound: 'Mivida Emaar', yield: '8.7%', growth: '+12.8%', tier: 'Prime Resale', rentPremium: 'High' },
  { compound: 'Mountain View Hyde Park', yield: '8.4%', growth: '+13.2%', tier: 'Family Favorite', rentPremium: 'Medium-High' },
  { compound: 'Madinaty TMG', yield: '# Yield Lead: 10.4%', growth: '+9.5%', tier: 'Volume High Yield', rentPremium: 'High' },
  { compound: 'El Shorouk Compounds', yield: '7.8%', growth: '+11.0%', tier: 'Entry Opportunity', rentPremium: 'Medium' },
];

export default function RoiAnalysisPage() {
  const { theme } = useTheme();
  const mode = (theme === 'light' ? 'light' : 'dark') as 'light' | 'dark';
  const th = THEMES[mode];

  // Calculator State
  const [purchasePrice, setPurchasePrice] = useState(12000000); // 12M EGP
  const [expectedRent, setExpectedRent] = useState(90000); // 90k EGP / month
  const [capitalAppreciation, setCapitalAppreciation] = useState(12); // 12% / year

  const grossYield = ((expectedRent * 12) / purchasePrice) * 100;
  const netYield = grossYield - 1.2; // subtracting maintenance fees/tax estimate
  const totalReturn = netYield + capitalAppreciation;

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
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.02em' }}>AI ROI Investment Analysis</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: th.textSub }}>Capital Appreciation & Rental Yield Modeling</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(233,193,118,0.1)', border: `1px solid ${G}`, borderRadius: '24px', padding: '6px 16px', fontSize: '0.8rem', color: G }}>
          <TrendingUp size={14} />
          <span>Real-Time Yield Index</span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div style={{ maxWidth: 1200, margin: '2rem auto', width: '100%', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flex: 1 }}>
        {/* Left Pane: Interactive Market Yield Index */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400, margin: '0 0 0.5rem 0' }}>New Cairo & East District Yield Rankings</h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: th.textSub }}>AI-tracked, direct-owner prioritized metrics updated weekly.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {ROI_STATS.map((stat, idx) => (
              <div key={idx} style={{ padding: '1.25rem', background: th.card, border: `1px solid ${th.border}`, borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                {/* Visual bar behind compound representation */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: stat.yield.includes('10.4') ? '100%' : `${parseFloat(stat.yield) * 10}%`, background: 'rgba(233,193,118,0.03)', zIndex: 1 }} />
                
                <div style={{ zIndex: 2 }}>
                  <span style={{ fontSize: '0.75rem', color: G, fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>{stat.tier}</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#fff' }}>{stat.compound}</span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: th.textSub, marginTop: '2px' }}>Rent Premium: {stat.rentPremium}</span>
                </div>

                <div style={{ zIndex: 2, textAlign: 'right' }}>
                  <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 600, color: G }}>{stat.yield}</span>
                  <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 500 }}>{stat.growth} YoY Growth</span>
                </div>
              </div>
            ))}
          </div>

          {/* Investment Insight Badge */}
          <div style={{ background: 'rgba(233,193,118,0.05)', border: `1px dashed ${G}`, borderRadius: '16px', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <HelpCircle size={24} color={G} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 500, color: G }}>Sierra AI Insight: Direct Owner Advantage</h4>
              <p style={{ margin: 0, fontSize: '0.8rem', color: th.textSub, lineHeight: 1.6 }}>
                By targetting a **40%+ Direct Owner Sourcing Ratio**, Sierra eliminates high co-brokerage fee splits, unlocking an average of **1.5% to 2.2% higher net entry yields** on Golden Square properties.
              </p>
            </div>
          </div>
        </div>

        {/* Right Pane: ROI Calculator */}
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontFamily: "'Cormorant Garamond', serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calculator size={20} color={G} />
            AI Dynamic Yield Calculator
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Input 1: Purchase Price */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: th.textSub }}>Purchase Price (EGP)</span>
                <span style={{ fontWeight: 600, color: G }}>EGP {purchasePrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={3000000}
                max={50000000}
                step={500000}
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: G }}
              />
            </div>

            {/* Input 2: Expected Monthly Rent */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: th.textSub }}>Expected Monthly Rent (EGP)</span>
                <span style={{ fontWeight: 600, color: G }}>EGP {expectedRent.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={15000}
                max={300000}
                step={5000}
                value={expectedRent}
                onChange={(e) => setExpectedRent(Number(e.target.value))}
                style={{ width: '100%', accentColor: G }}
              />
            </div>

            {/* Input 3: Capital Appreciation Estimate */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: th.textSub }}>Expected Capital Appreciation (YoY %)</span>
                <span style={{ fontWeight: 600, color: G }}>{capitalAppreciation}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={capitalAppreciation}
                onChange={(e) => setCapitalAppreciation(Number(e.target.value))}
                style={{ width: '100%', accentColor: G }}
              />
            </div>
          </div>

          <div style={{ width: '100%', height: '1px', backgroundColor: th.border, margin: '0.5rem 0' }} />

          {/* Results Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: th.textSub }}>Gross Rental Yield</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', fontFamily: "'DM Mono', monospace" }}>{grossYield.toFixed(2)}%</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: th.textSub }}>Net Yield (Est. After Fees)</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 600, color: G, fontFamily: "'DM Mono', monospace" }}>{netYield.toFixed(2)}%</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(233,193,118,0.04)', border: `1px solid ${th.border}`, borderRadius: '12px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', color: G, fontWeight: 500 }}>Total Annualized Return</span>
                <span style={{ fontSize: '0.7rem', color: th.textSub }}>Rental Net Yield + Appreciation</span>
              </div>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: G, fontFamily: "'DM Mono', monospace" }}>{totalReturn.toFixed(2)}%</span>
            </div>
          </div>

          <Link href="/?dealType=resale#listings" style={{ width: '100%' }}>
            <button style={{ width: '100%', padding: '14px', background: `linear-gradient(135deg,${G2},${G})`, color: '#000', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Search High ROI Listings
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
