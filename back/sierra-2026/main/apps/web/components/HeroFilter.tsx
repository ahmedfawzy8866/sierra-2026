/**
 * i-SIERRA-2027 • BRAND COMPONENT PRESET
 * Path: components/HeroFilter.tsx
 * Design: High-End Dark Glassmorphism (Emaar • Uptown Cairo Edition)
 */

import React, { useState } from 'react';

export default function HeroFilter() {
  // Controlled states for interactive filtering metrics
  const [propertyType, setPropertyType] = useState('Golf Villa');
  const [viewPreference, setViewPreference] = useState('Full Golf Course');
  const [priceTier, setPriceTier] = useState('Ultra-Luxury');

  const handleSearchRedirect = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct search queries cleanly for the production router redirect
    const targetUrl = new URL('https://www.sierra-blu.com/listings');
    targetUrl.searchParams.append('type', propertyType);
    targetUrl.searchParams.append('view', viewPreference);
    targetUrl.searchParams.append('tier', priceTier);
    targetUrl.searchParams.append('source', 'i-sierra-2027-hero');

    window.location.href = targetUrl.toString();
  };

  return (
    <section className="relative min-h-[85vh] w-full bg-slate-950 flex flex-col justify-center overflow-hidden font-sans px-4 sm:px-8 py-16 md:py-24">

      {/* Visual Depth Background Matrix */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Ambient Glows to represent luxury spatial highlighting */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-500/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-slate-800/40 blur-[100px]" />

        {/* Subtle Geometric Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

        {/* Gradient Fallbacks over content */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50 z-10" />
      </div>

      {/* Main Content Interface Wrapper */}
      <div className="relative z-20 max-w-6xl mx-auto w-full flex flex-col justify-center flex-1">

        {/* Top Branding Header Stack */}
        <div className="max-w-3xl space-y-4 md:space-y-6 mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 text-amber-500 tracking-[0.2em] text-[10px] md:text-xs font-bold uppercase bg-gradient-to-r from-amber-500/10 to-transparent pl-3 pr-6 py-1.5 rounded-full border border-amber-500/20 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Emaar • Uptown Cairo • Exclusive 2027
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extralight tracking-tight text-white leading-[1.1] md:leading-[1.05]">
            Wake up to the <br />
            <span className="font-semibold bg-gradient-to-r from-white via-amber-100 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
              Signature Golf Views
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base md:text-lg max-w-xl font-light leading-relaxed">
            Elevated high-luxury living standing proudly 200 meters above sea level. Discover meticulously customized architectural layouts overlooking premium fairway expanses.
          </p>
        </div>

        {/* Form-Based Premium Glassmorphism Filter Board */}
        <form
          onSubmit={handleSearchRedirect}
          className="w-full bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2 items-center transition-all duration-500 hover:border-white/15"
        >
          {/* Dynamic Input Row 1: Property Type selection */}
          <div className="space-y-1.5 px-4 py-2 flex flex-col group justify-center">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest group-hover:text-amber-400 transition-colors duration-300">
              Property Type
            </label>
            <div className="relative">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-transparent text-white text-sm md:text-base font-light focus:outline-none appearance-none cursor-pointer pr-4"
              >
                <option value="Golf Villa" className="bg-slate-950 text-white">Golf Villa</option>
                <option value="Premium Apartment" className="bg-slate-950 text-white">Premium Apartment</option>
                <option value="Townhouse Suite" className="bg-slate-950 text-white">Townhouse Suite</option>
              </select>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xs">▼</span>
            </div>
          </div>

          {/* Dynamic Input Row 2: View selection */}
          <div className="space-y-1.5 px-4 py-2 flex flex-col group justify-center border-t md:border-t-0 md:border-l border-white/10">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest group-hover:text-amber-400 transition-colors duration-300">
              Desired View
            </label>
            <div className="relative">
              <select
                value={viewPreference}
                onChange={(e) => setViewPreference(e.target.value)}
                className="w-full bg-transparent text-white text-sm md:text-base font-light focus:outline-none appearance-none cursor-pointer pr-4"
              >
                <option value="Full Golf Course" className="bg-slate-950 text-white">Full Golf Course</option>
                <option value="Skyline & Greenery" className="bg-slate-950 text-white">Skyline & Greenery</option>
                <option value="Valley Horizons" className="bg-slate-950 text-white">Valley Horizons</option>
              </select>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xs">▼</span>
            </div>
          </div>

          {/* Dynamic Input Row 3: Valuation/Tier selection */}
          <div className="space-y-1.5 px-4 py-2 flex flex-col group justify-center border-t md:border-t-0 md:border-l border-white/10">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest group-hover:text-amber-400 transition-colors duration-300">
              Price Range
            </label>
            <div className="relative">
              <select
                value={priceTier}
                onChange={(e) => setPriceTier(e.target.value)}
                className="w-full bg-transparent text-white text-sm md:text-base font-light focus:outline-none appearance-none cursor-pointer pr-4"
              >
                <option value="Ultra-Luxury" className="bg-slate-950 text-white">Ultra-Luxury</option>
                <option value="Premium Tier" className="bg-slate-950 text-white">Premium Tier</option>
                <option value="Elite Collectibles" className="bg-slate-950 text-white">Elite Collectibles</option>
              </select>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-xs">▼</span>
            </div>
          </div>

          {/* Action Module CTA Submit Button */}
          <div className="pt-2 md:pt-0 pl-0 md:pl-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm px-6 py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 group"
            >
              <span>Find Match with AI</span>
              <svg
                className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>

      </div>
    </section>
  );
}
