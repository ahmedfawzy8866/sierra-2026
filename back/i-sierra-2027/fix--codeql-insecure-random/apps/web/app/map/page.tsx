'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ArrowLeft, MapPin, Sparkles, Layers } from 'lucide-react';

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

const COMPOUNDS_MAP = [
  { id: 'lake-view', name: 'Lake View Residence', zone: 'Golden Square, New Cairo', lat: 30.0071, lng: 31.4345, units: 14, type: 'Premium Resale & Rent', avgPrice: '12.5M EGP', color: '#4ECDC4' },
  { id: 'mivida', name: 'Mivida Emaar', zone: 'Golden Square, New Cairo', lat: 30.0121, lng: 31.4425, units: 9, type: 'Eco-Luxury Residential', avgPrice: '14.8M EGP', color: '#E9C176' },
  { id: 'mountain-view', name: 'Mountain View Hyde Park', zone: '5th Settlement, New Cairo', lat: 30.0320, lng: 31.4720, units: 18, type: 'Family Villas & Penthouses', avgPrice: '16.2M EGP', color: '#7EA8B4' },
  { id: 'madinaty', name: 'Madinaty Talaat Moustafa', zone: 'Suez Road, Madinaty', lat: 30.0972, lng: 31.6314, units: 22, type: 'Integrated Mega-City', avgPrice: '7.5M EGP', color: '#C084FC' },
  { id: 'shorouk', name: 'El Shorouk City Compounds', zone: 'Shorouk Corridor', lat: 30.1400, lng: 31.7400, units: 11, type: 'Rent & Developer Projects', avgPrice: '5.8M EGP', color: '#F87171' },
];

export default function MapSearchPage() {
  const { theme } = useTheme();
  const mode = (theme === 'light' ? 'light' : 'dark') as 'light' | 'dark';
  const th = THEMES[mode];

  const [selectedCompound, setSelectedCompound] = useState<typeof COMPOUNDS_MAP[0] | null>(COMPOUNDS_MAP[0]);

  return (
    <div style={{ background: th.bg, color: th.text, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Jost', sans-serif" }}>
      {/* Header Bar */}
      <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', borderBottom: `1px solid ${th.border}`, backdropFilter: 'blur(20px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/">
            <button style={{ background: 'transparent', border: `1px solid ${th.border}`, color: th.text, width: 40, height: 40, borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.02em' }}>Map Intelligent Search</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: th.textSub }}>New Cairo, Madinaty & Shorouk Compound Pulse</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(233,193,118,0.1)', border: `1px solid ${G}`, borderRadius: '24px', padding: '6px 16px', fontSize: '0.8rem', color: G }}>
          <Sparkles size={14} />
          <span>Egypt\'s Only Live Sourcing Map</span>
        </div>
      </div>

      {/* Map Layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', height: 'calc(100vh - 72px)', overflow: 'hidden' }}>
        {/* Left: Beautiful Simulated Luxury Map Visualizer */}
        <div style={{ position: 'relative', backgroundColor: th.bg2, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Subtle Grid Lines to simulate digital map aesthetics */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(233,193,118,0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          {/* Centralized abstract map art showing compounds */}
          <div style={{ width: '85%', height: '80%', position: 'relative', border: `1px dashed ${th.border}`, borderRadius: '24px', background: 'rgba(255,255,255,0.01)', overflow: 'hidden' }}>
            
            {/* Sector Circles to represent zones */}
            <div style={{ position: 'absolute', top: '15%', left: '15%', width: '30%', height: '35%', borderRadius: '50%', border: '1px dashed rgba(233,193,118,0.1)', background: 'rgba(78,205,196,0.02)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(239,248,247,0.3)', letterSpacing: '0.1em' }}>Golden Square Sector</span>
            </div>
            
            <div style={{ position: 'absolute', bottom: '15%', right: '15%', width: '40%', height: '40%', borderRadius: '50%', border: '1px dashed rgba(233,193,118,0.1)', background: 'rgba(192,132,252,0.02)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'rgba(239,248,247,0.3)', letterSpacing: '0.1em' }}>Shorouk/Madinaty Sector</span>
            </div>

            {/* Interactive Pins */}
            {COMPOUNDS_MAP.map((comp) => {
              const isActive = selectedCompound?.id === comp.id;
              // Map lat/lng coordinates to visual percentage spreads
              const visualCoords: Record<string, { top: string; left: string }> = {
                'lake-view': { top: '35%', left: '25%' },
                'mivida': { top: '42%', left: '38%' },
                'mountain-view': { top: '22%', left: '55%' },
                'madinaty': { top: '65%', left: '60%' },
                'shorouk': { top: '50%', left: '78%' },
              };
              const position = visualCoords[comp.id];

              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompound(comp)}
                  style={{
                    position: 'absolute',
                    top: position.top,
                    left: position.left,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: isActive ? 10 : 5,
                    transition: 'all 0.3s cubic-bezier(0.16,1,.3,1)',
                  }}
                >
                  {/* Glowing Pulse Ring for active element */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      border: `2px solid ${comp.color}`,
                      animation: 'ping 1.5s infinite',
                      opacity: 0.5,
                    }} />
                  )}

                  {/* Pin Dot */}
                  <div style={{
                    width: isActive ? '24px' : '16px',
                    height: isActive ? '24px' : '16px',
                    borderRadius: '50%',
                    backgroundColor: comp.color,
                    border: `3px solid ${th.bg}`,
                    boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#000',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                  }}>
                    {isActive && '✓'}
                  </div>

                  {/* Pin Card Label */}
                  <div style={{
                    marginTop: '8px',
                    padding: '4px 12px',
                    backgroundColor: isActive ? 'var(--gold)' : 'rgba(13,32,53,0.85)',
                    color: isActive ? '#000' : '#fff',
                    border: `1px solid ${isActive ? 'transparent' : th.border}`,
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    backdropFilter: 'blur(8px)',
                  }}>
                    {comp.name} ({comp.units})
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sourcing Legend Overlay */}
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', display: 'flex', gap: '1.5rem', backgroundColor: 'rgba(13,32,53,0.85)', border: `1px solid ${th.border}`, backdropFilter: 'blur(12px)', borderRadius: '14px', padding: '12px 20px', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4ECDC4' }} />
              <span>Golden Square</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#E9C176' }} />
              <span>5th Settlement</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#C084FC' }} />
              <span>Madinaty</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F87171' }} />
              <span>Shorouk City</span>
            </div>
          </div>
        </div>

        {/* Right Pane: Selected Compound Active Sourcing Units */}
        <div style={{ borderLeft: `1px solid ${th.border}`, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
          {selectedCompound ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: G, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {selectedCompound.zone}
                </span>
                <h2 style={{ margin: '0.25rem 0 0.5rem 0', fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400 }}>
                  {selectedCompound.name}
                </h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: th.textSub }}>
                  {selectedCompound.type}
                </p>
              </div>

              {/* Stats Card */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: th.textSub, textTransform: 'uppercase' }}>Available Units</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 600, color: '#fff', fontFamily: "'DM Mono', monospace" }}>{selectedCompound.units}</span>
                </div>
                <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: th.textSub, textTransform: 'uppercase' }}>Avg Market Price</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 600, color: G, fontFamily: "'DM Mono', monospace", lineHeight: '1.75rem' }}>{selectedCompound.avgPrice}</span>
                </div>
              </div>

              {/* Verified Listings List */}
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={16} color={G} />
                  Active Sourced S1 Listings
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {Array.from({ length: Math.min(3, Math.ceil(selectedCompound.units / 3)) }).map((_, i) => {
                    const priceVal = (parseInt(selectedCompound.avgPrice) * (1 - i * 0.1)).toFixed(1);
                    return (
                      <div key={i} style={{ padding: '1rem', background: th.card, border: `1px solid ${th.border}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: G }}>
                            {selectedCompound.id.substring(0, 2).toUpperCase()}-{3+i}B-{priceVal}M
                          </span>
                          <span style={{ fontSize: '0.65rem', background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '2px 8px', borderRadius: '4px' }}>
                            {i === 0 ? '40%+ Owner Direct' : 'Verified Broker'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                          Luxury {3 + i} Bedroom Apartment in {selectedCompound.name}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: th.textSub }}>
                          <span>EGP {priceVal}M</span>
                          <span>{180 + i * 40} m²</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gold request button */}
              <Link href={`/?compound=${selectedCompound.id}#listings`}>
                <button style={{ width: '100%', padding: '14px', background: `linear-gradient(135deg,${G2},${G})`, color: '#000', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <MapPin size={16} />
                  View Units in Listings
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: th.textSub, textAlign: 'center' }}>
              <MapPin size={48} color={G} style={{ marginBottom: '1rem' }} />
              <p>Select a compound on the live map to inspect active New Cairo listings and direct owner inventory.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
