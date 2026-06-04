'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ArrowLeft, Sparkles, Filter, CheckCircle, Award } from 'lucide-react';

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

const SAMPLE_LISTINGS = [
  { id: 1, title: 'Lake View Residence Apt', score: 98, compound: 'Lake View', price: '12.5M EGP', beds: 3, area: '210 m²', owner: 'Direct Owner (40%+ priority)', type: 'Resale', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=80' },
  { id: 2, title: 'Mivida Eco-Luxury Villa', score: 95, compound: 'Mivida', price: '18.2M EGP', beds: 4, area: '320 m²', owner: 'Direct Owner', type: 'Resale', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80' },
  { id: 3, title: 'Mountain View Penthouse', score: 92, compound: 'Mountain View', price: '14.5M EGP', beds: 4, area: '280 m²', owner: 'Vetted Broker co-broke', type: 'Primary', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80' },
  { id: 4, title: 'Madinaty Standalone Villa', score: 89, compound: 'Madinaty', price: '11.2M EGP', beds: 5, area: '420 m²', owner: 'Direct Owner', type: 'Resale', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80' },
  { id: 5, title: 'Shorouk Signature Twinhouse', score: 86, compound: 'Shorouk', price: '8.9M EGP', beds: 3, area: '245 m²', owner: 'Direct Owner (40%+ priority)', type: 'Resale', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80' },
];

export default function BestMatchesPage() {
  const { theme } = useTheme();
  const mode = (theme === 'light' ? 'light' : 'dark') as 'light' | 'dark';
  const th = THEMES[mode];

  const [activeFilter, setActiveFilter] = useState('all');

  const filteredListings = activeFilter === 'all' 
    ? SAMPLE_LISTINGS 
    : SAMPLE_LISTINGS.filter(l => l.owner.toLowerCase().includes('direct owner'));

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
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.02em' }}>Best Units Matches</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: th.textSub }}>AI-scored New Cairo matching listings engine</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(233,193,118,0.1)', border: `1px solid ${G}`, borderRadius: '24px', padding: '6px 16px', fontSize: '0.8rem', color: G }}>
          <Sparkles size={14} />
          <span>Real-Time Matching</span>
        </div>
      </div>

      {/* Main Bento Layout */}
      <div style={{ maxWidth: 1200, margin: '2rem auto', width: '100%', padding: '0 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
        
        {/* Toggle Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.75rem', fontFamily: "'Cormorant Garamond', serif', font-weight: 300" }}>Your AI Curated Matches</h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: th.textSub }}>High owner direct ratio listings prioritized.</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', background: th.card, border: `1px solid ${th.border}`, padding: '4px', borderRadius: '12px' }}>
            <button 
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: activeFilter === 'all' ? `linear-gradient(135deg, ${G2}, ${G})` : 'transparent',
                color: activeFilter === 'all' ? '#000' : th.textSub,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              All Matches
            </button>
            <button 
              onClick={() => setActiveFilter('direct')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: activeFilter === 'direct' ? `linear-gradient(135deg, ${G2}, ${G})` : 'transparent',
                color: activeFilter === 'direct' ? '#000' : th.textSub,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              Direct Owner Priority (40%+)
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredListings.map((listing) => (
            <div 
              key={listing.id}
              style={{
                background: th.card,
                border: `1px solid ${th.border}`,
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.16,1,.3,1)',
                position: 'relative'
              }}
            >
              {/* Match Score Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'rgba(13,32,53,0.85)',
                border: `1px solid ${G}`,
                color: G,
                borderRadius: '10px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backdropFilter: 'blur(8px)',
                zIndex: 2
              }}>
                <Award size={14} />
                <span>{listing.score}% Match</span>
              </div>

              {/* Image */}
              <div style={{ height: '200px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <img 
                  src={listing.img} 
                  alt={listing.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Content */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: G, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {listing.compound} · {listing.type}
                  </span>
                  <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.25rem', fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: '#fff' }}>
                    {listing.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: th.textSub }}>
                  <span>{listing.beds} Bedrooms</span>
                  <span>{listing.area}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#22c55e', background: 'rgba(34,197,94,0.06)', padding: '6px 10px', borderRadius: '8px' }}>
                  <CheckCircle size={14} />
                  <span>{listing.owner}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: `1px solid ${th.border}` }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 600, color: G, fontFamily: "'DM Mono', monospace" }}>{listing.price}</span>
                  <Link href={`/listings/${listing.id}`}>
                    <button style={{ padding: '6px 16px', background: 'transparent', border: `1px solid ${th.border}`, color: th.text, borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
