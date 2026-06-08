'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, MapPin, Bed, Bath, Square, Heart, Share2, Phone, Mail, AlertCircle, Check } from 'lucide-react';

/**
 * SIERRA ESTATES — PRODUCTION APPLICATION
 * Tasteskill v2 + Quiet Luxury Design System
 * 
 * 8 Sections:
 * 1. Onboarding Intent Capture
 * 2. Split-Screen Dual-View (Map 55% / Feed 45%)
 * 3. Property Profile Hero
 * 4. Floorplan Exploded View
 * 5. Cost Breakdown (Fintech Terminal)
 * 6. Trust Badges & Compliance
 * 7. Co-Buyer Collaboration
 * 8. Footer & CTA
 */

// ─── TYPES ────────────────────────────────────────────────────────────

type UserIntent = 'homebuyer' | 'collector' | 'investor' | null;
type PropertyCard = {
  id: string;
  title: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  image: string;
  lat: number;
  lng: number;
  yield?: number;
  capRate?: number;
  schoolDist?: string;
  transit?: string;
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────

const MOCK_PROPERTIES: PropertyCard[] = [
  {
    id: '1',
    title: 'Downtown Penthouse',
    price: 2_800_000,
    beds: 3,
    baths: 2,
    area: 2400,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    lat: 25.195,
    lng: 55.278,
    yield: 5.2,
    capRate: 6.8,
    schoolDist: '0.8 km to Al Khaleej School',
    transit: '5 min to Metro'
  },
  {
    id: '2',
    title: 'Marina Waterfront Villa',
    price: 4_200_000,
    beds: 5,
    baths: 4,
    area: 4100,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    lat: 25.182,
    lng: 55.271,
    yield: 4.8,
    capRate: 5.9,
    schoolDist: '1.2 km to Dubai Modern School',
    transit: '12 min to Metro'
  },
  {
    id: '3',
    title: 'Historic District Townhouse',
    price: 1_500_000,
    beds: 2,
    baths: 2,
    area: 1400,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    lat: 25.165,
    lng: 55.258,
    yield: 6.1,
    capRate: 7.4,
    schoolDist: '1.5 km to Emirates International',
    transit: '8 min to Metro'
  }
];

// ─── COMPONENT: SECTION 1 — ONBOARDING INTENT ────────────────────────────

function OnboardingIntent({ onSelect }: { onSelect: (intent: UserIntent) => void }) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0A1628] to-[#0F1B2E] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="font-display text-6xl italic text-[#F4F0E8] mb-4">Sierra Estates</h1>
        <p className="text-[#F4F0E8]/70 text-lg mb-16">Find your next property. Invest with intelligence.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'homebuyer', icon: '🏡', label: 'Primary Homebuyer', desc: 'School districts, transit, neighborhoods' },
            { id: 'collector', icon: '✨', label: 'Luxury Collector', desc: 'Prestige, exclusivity, heritage' },
            { id: 'investor', icon: '📊', label: 'Data-Driven Investor', desc: 'Yield, cap rate, cash flow' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id as UserIntent)}
              className="group p-8 border-2 border-[#C9A84C] rounded-lg bg-transparent hover:bg-[#C9A84C]/10 transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-[#C9A84C] font-semibold text-sm uppercase tracking-wider mb-2">{item.label}</h3>
              <p className="text-[#F4F0E8]/60 text-xs">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── COMPONENT: SECTION 2 — DUAL-VIEW COMMAND CENTER ────────────────────

function DualViewCommandCenter({
  intent,
  onPropertySelect,
  selectedId
}: {
  intent: UserIntent;
  onPropertySelect: (id: string) => void;
  selectedId: string | null;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Dynamic card data based on intent
  const getDisplayValue = (prop: PropertyCard) => {
    switch (intent) {
      case 'investor':
        return `${prop.capRate}% cap rate`;
      case 'homebuyer':
        return prop.schoolDist;
      case 'collector':
        return `${(prop.price / 1_000_000).toFixed(1)}M`;
      default:
        return `$${(prop.price / 1_000_000).toFixed(1)}M`;
    }
  };

  return (
    <section className="h-screen flex gap-0 bg-[#0A1628]">
      {/* MAP LAYER (55%) */}
      <div
        ref={mapRef}
        className="w-[55%] bg-gradient-to-br from-[#1a2e4a] to-[#0d1b2e] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#C9A84C_1px,transparent_1px),linear-gradient(to_bottom,#C9A84C_1px,transparent_1px)] bg-[size:8rem_8rem] opacity-5"></div>

        {/* Map pins */}
        {MOCK_PROPERTIES.map(prop => (
          <button
            key={prop.id}
            onClick={() => onPropertySelect(prop.id)}
            style={{
              top: `${30 + Math.random() * 40}%`,
              left: `${20 + Math.random() * 60}%`
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              selectedId === prop.id ? 'z-20 scale-125' : hoveredId === prop.id ? 'z-10 scale-110' : 'z-5'
            }`}
            onMouseEnter={() => setHoveredId(prop.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              className={`px-3 py-2 rounded-lg font-semibold text-xs uppercase tracking-wider transition-all ${
                selectedId === prop.id
                  ? 'bg-[#C9A84C] text-[#0A1628] shadow-lg shadow-[#C9A84C]/50'
                  : hoveredId === prop.id
                  ? 'bg-[#C9A84C]/80 text-[#0A1628] shadow-md'
                  : 'bg-[#F4F0E8]/10 text-[#F4F0E8] border border-[#C9A84C]/30 backdrop-blur-sm'
              }`}
            >
              ${(prop.price / 1_000_000).toFixed(1)}M
            </div>
          </button>
        ))}

        {/* Map label */}
        <div className="absolute top-6 left-6 text-[#F4F0E8]/40 text-xs uppercase tracking-widest font-semibold">
          🗺 Mapbox GL Integration
        </div>
      </div>

      {/* FEED LAYER (45%) */}
      <div className="w-[45%] bg-[#0A1628] border-l border-[#C9A84C]/20 overflow-y-auto p-6 space-y-4">
        <div className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-4">
          Featured Listings
        </div>

        {MOCK_PROPERTIES.map(prop => (
          <button
            key={prop.id}
            onClick={() => onPropertySelect(prop.id)}
            onMouseEnter={() => setHoveredId(prop.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-300 ${
              selectedId === prop.id
                ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                : hoveredId === prop.id
                ? 'border-[#C9A84C]/60 bg-[#C9A84C]/05 scale-[1.02]'
                : 'border-[#C9A84C]/20 bg-transparent hover:border-[#C9A84C]/40'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[#F4F0E8] font-semibold text-sm">{prop.title}</h3>
              <Heart className={`w-4 h-4 ${selectedId === prop.id ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-[#C9A84C]/40'}`} />
            </div>
            <p className="text-[#F4F0E8]/60 text-xs mb-3 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Dubai, UAE
            </p>
            <div className="flex justify-between text-xs text-[#C9A84C] mb-3">
              <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {prop.beds} beds</span>
              <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {prop.baths} baths</span>
              <span className="flex items-center gap-1"><Square className="w-3 h-3" /> {prop.area} sqft</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#C9A84C] font-bold text-lg">${(prop.price / 1_000_000).toFixed(1)}M</span>
              <span className="text-[#F4F0E8]/50 text-xs">{getDisplayValue(prop)}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── COMPONENT: SECTION 3 — PROPERTY PROFILE HERO ───────────────────────

function PropertyProfileHero({ property }: { property: PropertyCard }) {
  return (
    <section className="relative h-96 bg-[#0A1628] overflow-hidden">
      {/* Hero image */}
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-full object-cover opacity-40"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/50 to-transparent"></div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-2">Featured Property</p>
            <h2 className="text-[#F4F0E8] text-4xl font-display italic mb-2">{property.title}</h2>
            <p className="text-[#F4F0E8]/70 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Dubai, UAE
            </p>
          </div>
          <div className="text-right">
            <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-1">Price</p>
            <p className="text-[#F4F0E8] text-3xl font-bold">${(property.price / 1_000_000).toFixed(1)}M</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── COMPONENT: SECTION 4 — FLOORPLAN EXPLODED VIEW ──────────────────────

function FloorplanExplodedView() {
  const [view, setView] = useState<'2d' | '3d'>('2d');

  return (
    <section className="bg-[#0F1B2E] px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-2">Visual Exploration</p>
            <h3 className="text-[#F4F0E8] text-2xl font-display italic">Floorplan & Layout</h3>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setView('2d')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                view === '2d'
                  ? 'bg-[#C9A84C] text-[#0A1628]'
                  : 'bg-transparent border border-[#C9A84C]/40 text-[#C9A84C] hover:border-[#C9A84C]'
              }`}
            >
              2D Blueprint
            </button>
            <button
              onClick={() => setView('3d')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                view === '3d'
                  ? 'bg-[#C9A84C] text-[#0A1628]'
                  : 'bg-transparent border border-[#C9A84C]/40 text-[#C9A84C] hover:border-[#C9A84C]'
              }`}
            >
              3D Rotatable
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1a2e4a] to-[#0d1b2e] rounded-lg p-12 h-96 flex items-center justify-center border border-[#C9A84C]/20">
          <div className="text-center">
            <div className="text-6xl mb-4">{view === '2d' ? '📐' : '🧊'}</div>
            <p className="text-[#F4F0E8]/60 text-sm">
              {view === '2d' 
                ? 'Engineering blueprint with room-by-room breakdown'
                : 'Interactive 3D model - rotate to explore spatial configuration'
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── COMPONENT: SECTION 5 — FINTECH COST BREAKDOWN ──────────────────────

function FinTechTerminal({ property }: { property: PropertyCard }) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [mortgageTerm, setMortgageTerm] = useState(30);

  const downPayment = property.price * (downPaymentPercent / 100);
  const loanAmount = property.price - downPayment;
  const monthlyRate = 0.042 / 12;
  const numPayments = mortgageTerm * 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

  return (
    <section className="bg-[#0A1628] px-8 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-8">
        {/* LEFT: Cost Breakdown */}
        <div>
          <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-2">Financial Transparency</p>
          <h3 className="text-[#F4F0E8] text-2xl font-display italic mb-8">Transaction Breakdown</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-[#C9A84C]/20">
              <span className="text-[#F4F0E8]/70">Purchase Price</span>
              <span className="text-[#C9A84C] font-semibold">${(property.price / 1_000_000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#C9A84C]/20">
              <span className="text-[#F4F0E8]/70">Transfer Tax (3%)</span>
              <span className="text-[#C9A84C] font-semibold">${(property.price * 0.03 / 1_000_000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#C9A84C]/20">
              <span className="text-[#F4F0E8]/70">Registration Fee</span>
              <span className="text-[#C9A84C] font-semibold">$3,500</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#C9A84C]/20">
              <span className="text-[#F4F0E8]/70">Legal & Title</span>
              <span className="text-[#C9A84C] font-semibold">$2,500</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-[#C9A84C] mt-4 font-bold">
              <span className="text-[#F4F0E8]">Total Year 1 Outlay</span>
              <span className="text-[#C9A84C]">${((property.price * 1.03 + 6000) / 1_000_000).toFixed(2)}M</span>
            </div>
          </div>

          {/* Compliance */}
          <div className="mt-8 space-y-2">
            <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-3">RERA Compliance</p>
            <div className="flex items-center gap-2 text-xs text-[#F4F0E8]/70 p-2 bg-[#C9A84C]/10 rounded">
              <Check className="w-4 h-4 text-[#C9A84C]" />
              <span>Escrow: DIFC Bank #7734</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#F4F0E8]/70 p-2 bg-[#C9A84C]/10 rounded">
              <Check className="w-4 h-4 text-[#C9A84C]" />
              <span>Title Clear: ID-2024-598472</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#F4F0E8]/70 p-2 bg-[#C9A84C]/10 rounded">
              <Check className="w-4 h-4 text-[#C9A84C]" />
              <span>Planning: Zone A1 Residential</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Interactive Calculator */}
        <div className="bg-[#0F1B2E] rounded-lg p-8 border border-[#C9A84C]/20">
          <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-6">Mortgage Calculator</p>

          <div className="space-y-6">
            {/* Down Payment Slider */}
            <div>
              <label className="text-[#F4F0E8] text-sm font-semibold mb-2 block">Down Payment: {downPaymentPercent}%</label>
              <input
                type="range"
                min="10"
                max="50"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-[#C9A84C]/30 rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
              />
              <p className="text-[#C9A84C] text-lg font-bold mt-2">${(downPayment / 1_000_000).toFixed(2)}M</p>
            </div>

            {/* Mortgage Term Buttons */}
            <div>
              <label className="text-[#F4F0E8] text-sm font-semibold mb-3 block">Mortgage Term</label>
              <div className="grid grid-cols-3 gap-2">
                {[15, 20, 30].map(term => (
                  <button
                    key={term}
                    onClick={() => setMortgageTerm(term)}
                    className={`py-2 rounded-lg font-semibold text-sm transition-all ${
                      mortgageTerm === term
                        ? 'bg-[#C9A84C] text-[#0A1628]'
                        : 'bg-transparent border border-[#C9A84C]/40 text-[#C9A84C] hover:border-[#C9A84C]'
                    }`}
                  >
                    {term} yrs
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Payment Display */}
            <div className="bg-[#0A1628] rounded-lg p-4 border border-[#C9A84C]/30">
              <p className="text-[#F4F0E8]/60 text-xs uppercase tracking-wider mb-1">Monthly Payment</p>
              <p className="text-[#C9A84C] text-3xl font-bold">${(monthlyPayment / 1000).toFixed(1)}K</p>
              <p className="text-[#F4F0E8]/50 text-xs mt-2">@ 4.2% interest, {mortgageTerm}-year term</p>
            </div>

            {/* Total Cost */}
            <div className="pt-4 border-t border-[#C9A84C]/20">
              <p className="text-[#F4F0E8]/60 text-xs uppercase tracking-wider mb-1">Total Cost ({mortgageTerm} Years)</p>
              <p className="text-[#C9A84C] text-2xl font-bold">${((monthlyPayment * numPayments + downPayment) / 1_000_000).toFixed(2)}M</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── COMPONENT: SECTION 6 — TRUST BADGES ─────────────────────────────────

function TrustBadges() {
  return (
    <section className="bg-[#0F1B2E] px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-2">Verification & Trust</p>
        <h3 className="text-[#F4F0E8] text-2xl font-display italic mb-12">Verified Credentials</h3>

        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: '✓', label: 'Price Verified', detail: 'Updated 4 hours ago' },
            { icon: '📸', label: 'Physical Walkthrough', detail: 'Confirmed by agent' },
            { icon: '📋', label: 'Title Cleared', detail: 'RERA certified' }
          ].map((badge, i) => (
            <div key={i} className="bg-[#0A1628] rounded-lg p-6 border border-[#C9A84C]/30">
              <div className="text-3xl mb-3">{badge.icon}</div>
              <p className="text-[#F4F0E8] font-semibold text-sm mb-1">{badge.label}</p>
              <p className="text-[#F4F0E8]/60 text-xs">{badge.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── COMPONENT: SECTION 7 — CO-BUYER COLLABORATION ───────────────────────

function CoBuyerHub() {
  const [consensus] = useState(75);

  return (
    <section className="bg-[#0A1628] px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-2">Partnership & Collaboration</p>
        <h3 className="text-[#F4F0E8] text-2xl font-display italic mb-12">Shared Portfolio</h3>

        <div className="grid grid-cols-2 gap-8">
          {/* Left: Status & Voting */}
          <div>
            <div className="bg-[#0F1B2E] rounded-lg p-6 border border-[#C9A84C]/30 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">👥</div>
                <div>
                  <p className="text-[#F4F0E8] font-semibold">You + Sarah</p>
                  <p className="text-[#F4F0E8]/60 text-xs">Partnership active • 4 properties</p>
                </div>
              </div>
              <div className="bg-[#0A1628] rounded p-3 mt-4">
                <p className="text-[#F4F0E8]/60 text-xs uppercase tracking-wider mb-2">Consensus Score</p>
                <p className="text-[#C9A84C] text-2xl font-bold">{consensus}%</p>
              </div>
            </div>

            <div className="space-y-3">
              {['Downtown Penthouse', 'Marina Villa', 'Historic Townhouse'].map((name, i) => (
                <div key={i} className="bg-[#0F1B2E] rounded-lg p-4 border border-[#C9A84C]/20">
                  <p className="text-[#F4F0E8] text-sm font-semibold mb-2">{name}</p>
                  <div className="flex gap-2 text-xs">
                    <button className="flex-1 py-2 bg-[#C9A84C]/20 text-[#C9A84C] rounded hover:bg-[#C9A84C]/30">👍 You</button>
                    <button className="flex-1 py-2 bg-[#C9A84C]/20 text-[#C9A84C] rounded hover:bg-[#C9A84C]/30">👍 Sarah</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Shared Notes */}
          <div className="bg-[#0F1B2E] rounded-lg p-6 border border-[#C9A84C]/30">
            <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-4">Shared Notes & Chat</p>

            <div className="space-y-4 max-h-80 overflow-y-auto">
              <div className="bg-[#0A1628] rounded-lg p-4">
                <p className="text-[#C9A84C] text-xs font-semibold mb-1">Sarah • 2 hours ago</p>
                <p className="text-[#F4F0E8]/80 text-sm">Downtown penthouse has amazing light. Can we negotiate HOA fees?</p>
              </div>

              <div className="bg-[#0A1628] rounded-lg p-4 ml-4">
                <p className="text-[#C9A84C] text-xs font-semibold mb-1">You • just now</p>
                <p className="text-[#F4F0E8]/80 text-sm">Called the broker. HOA is fixed, but sellers might cover closing costs.</p>
              </div>
            </div>

            <input
              type="text"
              placeholder="Add a note..."
              className="w-full mt-4 px-3 py-2 bg-[#0A1628] border border-[#C9A84C]/30 rounded text-[#F4F0E8] text-sm placeholder-[#F4F0E8]/40 focus:outline-none focus:border-[#C9A84C]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────

export default function SierraBluApp() {
  const [intent, setIntent] = useState<UserIntent>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(MOCK_PROPERTIES[0].id);
  const selectedProperty = MOCK_PROPERTIES.find(p => p.id === selectedPropertyId) || MOCK_PROPERTIES[0];

  if (!intent) {
    return <OnboardingIntent onSelect={setIntent} />;
  }

  return (
    <div className="bg-[#0A1628] text-[#F4F0E8] min-h-screen">
      {/* Section 2: Dual-View */}
      <DualViewCommandCenter
        intent={intent}
        onPropertySelect={setSelectedPropertyId}
        selectedId={selectedPropertyId}
      />

      {/* Section 3: Property Profile Hero */}
      <PropertyProfileHero property={selectedProperty} />

      {/* Section 4: Floorplan */}
      <FloorplanExplodedView />

      {/* Section 5: Fintech Terminal */}
      <FinTechTerminal property={selectedProperty} />

      {/* Section 6: Trust Badges */}
      <TrustBadges />

      {/* Section 7: Co-Buyer Hub */}
      <CoBuyerHub />

      {/* Section 8: Footer */}
      <footer className="bg-[#0F1B2E] border-t border-[#C9A84C]/20 px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-8 mb-12">
            <div>
              <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-4">Product</p>
              <ul className="space-y-2 text-sm text-[#F4F0E8]/70">
                <li><a href="#" className="hover:text-[#C9A84C]">Search</a></li>
                <li><a href="#" className="hover:text-[#C9A84C]">Properties</a></li>
                <li><a href="#" className="hover:text-[#C9A84C]">Investment</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-4">Company</p>
              <ul className="space-y-2 text-sm text-[#F4F0E8]/70">
                <li><a href="#" className="hover:text-[#C9A84C]">About</a></li>
                <li><a href="#" className="hover:text-[#C9A84C]">Blog</a></li>
                <li><a href="#" className="hover:text-[#C9A84C]">Careers</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-4">Legal</p>
              <ul className="space-y-2 text-sm text-[#F4F0E8]/70">
                <li><a href="#" className="hover:text-[#C9A84C]">Privacy</a></li>
                <li><a href="#" className="hover:text-[#C9A84C]">Terms</a></li>
                <li><a href="#" className="hover:text-[#C9A84C]">Cookies</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-4">Contact</p>
              <ul className="space-y-2 text-sm text-[#F4F0E8]/70">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +971 50 123 4567</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@sierrablu.ae</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#C9A84C]/20 pt-8 text-center text-[#F4F0E8]/50 text-xs">
            <p>© 2026 Sierra Estates Realty. Beyond Brokerage.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}