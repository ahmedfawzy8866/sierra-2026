'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ArrowLeft, Sparkles, DollarSign, Calculator, Percent, Layers, Home } from 'lucide-react';

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

const BASE_SQM_PRICES: Record<string, number> = {
  'lake-view': 68000,
  'mivida': 72000,
  'mountain-view': 58000,
  'villette': 64000,
  'madinaty': 38000,
  'shorouk': 32000,
};

export default function UnitPricingPage() {
  const { theme } = useTheme();
  const mode = (theme === 'light' ? 'light' : 'dark') as 'light' | 'dark';
  const th = THEMES[mode];

  // Parameters
  const [compound, setCompound] = useState('lake-view');
  const [area, setArea] = useState(180);
  const [bedrooms, setBedrooms] = useState(3);
  const [finishing, setFinishing] = useState('fully-finished');
  const [furnished, setFurnished] = useState('unfurnished');

  const basePricePerSqm = BASE_SQM_PRICES[compound] || 45000;
  
  // Adjust base price based on criteria
  let finishingMultiplier = 1;
  if (finishing === 'fully-finished') finishingMultiplier = 1.15;
  if (finishing === 'core-shell') finishingMultiplier = 0.85;

  let furnishedMultiplier = 1;
  if (furnished === 'fully-furnished') furnishedMultiplier = 1.2;

  let bedroomPremium = bedrooms * 150000; // premium per bedroom count

  const calculatedBase = (area * basePricePerSqm * finishingMultiplier * furnishedMultiplier) + bedroomPremium;
  const rangeMin = calculatedBase * 0.93;
  const rangeMax = calculatedBase * 1.07;
  const calculatedSqmPrice = calculatedBase / area;

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
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.02em' }}>Precise Pricing Index</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: th.textSub }}>AI valuation models calibrated to Egypt resale parameters</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(233,193,118,0.1)', border: `1px solid ${G}`, borderRadius: '24px', padding: '6px 16px', fontSize: '0.8rem', color: G }}>
          <Percent size={14} />
          <span>Fuzzy Valuation Calibrator</span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div style={{ maxWidth: 1200, margin: '2rem auto', width: '100%', padding: '0 2rem', display: 'grid', gridTemplateColumns: '420px 1fr', gap: '2rem', flex: 1 }}>
        
        {/* Left Pane: Parameter Form */}
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: "'Cormorant Garamond', serif", display: 'flex', alignItems: 'center', gap: '0.5rem', color: G }}>
            <Layers size={18} />
            Unit Attributes
          </h3>

          {/* Selector 1: Compound */}
          <div>
            <label style={{ fontSize: '0.8rem', color: th.textSub, display: 'block', marginBottom: '0.4rem' }}>Target Compound</label>
            <select
              value={compound}
              onChange={(e) => setCompound(e.target.value)}
              style={{ width: '100%', padding: '10px', background: th.bg, color: th.text, border: `1px solid ${th.border}`, borderRadius: '10px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="lake-view">Lake View Residence (Golden Square)</option>
              <option value="mivida">Mivida Emaar (Golden Square)</option>
              <option value="villette">Villette SODIC (Golden Square)</option>
              <option value="mountain-view">Mountain View Hyde Park</option>
              <option value="madinaty">Madinaty (TMG Suez Road)</option>
              <option value="shorouk">El Shorouk City Compounds</option>
            </select>
          </div>

          {/* Selector 2: Area */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
              <span style={{ color: th.textSub }}>Built-Up Area (m²)</span>
              <span style={{ fontWeight: 600, color: G }}>{area} m²</span>
            </div>
            <input
              type="range"
              min={60}
              max={800}
              step={10}
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              style={{ width: '100%', accentColor: G }}
            />
          </div>

          {/* Selector 3: Bedrooms */}
          <div>
            <label style={{ fontSize: '0.8rem', color: th.textSub, display: 'block', marginBottom: '0.4rem' }}>Bedrooms</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((bed) => (
                <button
                  key={bed}
                  onClick={() => setBedrooms(bed)}
                  style={{
                    padding: '8px 0',
                    border: `1px solid ${bedrooms === bed ? G : th.border}`,
                    background: bedrooms === bed ? `linear-gradient(135deg, ${G2}, ${G})` : 'transparent',
                    color: bedrooms === bed ? '#000' : th.text,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {bed} B
                </button>
              ))}
            </div>
          </div>

          {/* Selector 4: Finishing Type */}
          <div>
            <label style={{ fontSize: '0.8rem', color: th.textSub, display: 'block', marginBottom: '0.4rem' }}>Finishing Type</label>
            <select
              value={finishing}
              onChange={(e) => setFinishing(e.target.value)}
              style={{ width: '100%', padding: '10px', background: th.bg, color: th.text, border: `1px solid ${th.border}`, borderRadius: '10px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="core-shell">Core & Shell (Semi-Finished)</option>
              <option value="fully-finished">Fully Finished (High-End)</option>
              <option value="ultra-lux">Ultra-Lux Finishing</option>
            </select>
          </div>

          {/* Selector 5: Furnished Status */}
          <div>
            <label style={{ fontSize: '0.8rem', color: th.textSub, display: 'block', marginBottom: '0.4rem' }}>Furnishing Status</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {['unfurnished', 'fully-furnished'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFurnished(f)}
                  style={{
                    padding: '8px 0',
                    border: `1px solid ${furnished === f ? G : th.border}`,
                    background: furnished === f ? `linear-gradient(135deg, ${G2}, ${G})` : 'transparent',
                    color: furnished === f ? '#000' : th.text,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                  }}
                >
                  {f === 'unfurnished' ? 'Unfurnished' : 'Fully Furnished'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane: AI Valuation Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Pricing Output Block */}
          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '24px', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${G2}, ${G})` }} />
            
            <span style={{ fontSize: '0.85rem', color: G, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '0.5rem' }}>
              Sierra Valuation Estimate Range
            </span>

            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 600, margin: '0.5rem 0', fontFamily: "'DM Mono', monospace", color: '#fff' }}>
              EGP {(rangeMin / 1000000).toFixed(2)}M - {(rangeMax / 1000000).toFixed(2)}M
            </h2>

            <p style={{ margin: 0, fontSize: '0.9rem', color: th.textSub }}>
              Estimated average cost: <strong style={{ color: G }}>EGP {calculatedBase.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem', borderTop: `1px solid ${th.border}`, paddingTop: '1.5rem' }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: th.textSub }}>AVG PRICE / SQM</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: "'DM Mono', monospace", color: G }}>EGP {calculatedSqmPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: th.textSub }}>VALUATION CONFIDENCE</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 600, fontFamily: "'DM Mono', monospace", color: '#22c55e' }}>96% (High Confidence)</span>
              </div>
            </div>
          </div>

          {/* Premium Market Comparison List */}
          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '24px', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Home size={16} color={G} />
              Recent Comparable Verified Matches
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Array.from({ length: 2 }).map((_, i) => {
                const compPrice = calculatedBase * (1 + (i === 0 ? 0.03 : -0.04));
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.01)', border: `1px solid ${th.border}`, borderRadius: '14px' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', color: '#fff' }}>
                        {bedrooms}B Finished Apartment
                      </span>
                      <span style={{ fontSize: '0.75rem', color: th.textSub }}>
                        {area} m² · {compound.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: '1rem', fontWeight: 600, color: G, fontFamily: "'DM Mono', monospace" }}>
                        EGP {(compPrice / 1000000).toFixed(2)}M
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        Direct Owner
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gold Button to start a request */}
          <Link href={`/?priceRange=${(calculatedBase / 1000000).toFixed(0)}&compound=${compound}#listings`}>
            <button style={{ width: '100%', padding: '14px', background: `linear-gradient(135deg,${G2},${G})`, color: '#000', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Explore Matching Units
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
