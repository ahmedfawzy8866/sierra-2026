// i-SIERRA-2027 • REFINED LIGHTWEIGHT MODULE
// Path: i-sierra-2027/components/HeroFilter.tsx
// Update: Removed heavy live map APIs; Integrated bulletproof minimal layout vector.

import React, { useState } from 'react';

export default function HeroFilter() {
  const [propertyType, setPropertyType] = useState('Golf Villa');
  const [viewPreference, setViewPreference] = useState('Full Golf Course');
  const [priceTier, setPriceTier] = useState('Ultra-Luxury');
  const [showLocationGuide, setShowLocationGuide] = useState(false);

  const handleSearchRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUrl = new URL('https://www.sierra-estates.com/listings');
    targetUrl.searchParams.append('type', propertyType);
    targetUrl.searchParams.append('view', viewPreference);
    targetUrl.searchParams.append('tier', priceTier);
    window.location.href = targetUrl.toString();
  };

  return (
    <section className="relative min-h-[80vh] w-full bg-slate-950 flex flex-col justify-center overflow-hidden font-sans px-4 sm:px-8 py-12">
      {/* Background Ambience Matrix */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-amber-500/5 blur-[100px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
      </div>

      <div className="relative z-20 max-w-5xl mx-auto w-full space-y-8">
        {/* Header Block & Simple Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-amber-500 tracking-widest text-[10px] font-bold uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Emaar • Uptown Cairo
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extralight text-white tracking-tight leading-tight">
              Signature <span className="font-semibold bg-gradient-to-r from-white to-amber-400 bg-clip-text text-transparent">Golf Views</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-light">
              Elevated luxury standing 200 meters above sea level. Clean structural filters matched with automated vector alignment layers.
            </p>
          </div>

          {/* Quick Utility Map-Alternative Toggle */}
          <button
            type="button"
            onClick={() => setShowLocationGuide(!showLocationGuide)}
            className="self-start md:self-auto flex items-center gap-2 text-xs font-medium border border-white/10 hover:border-amber-500/30 text-slate-300 hover:text-amber-400 bg-slate-900/40 backdrop-blur-md px-4 py-2.5 rounded-xl transition-all duration-300"
          >
            <span className={`w-2 h-2 rounded-full ${showLocationGuide ? 'bg-amber-400' : 'bg-slate-600'} transition-colors`} />
            {showLocationGuide ? 'Hide Location Profile' : 'Show Location Profile'}
          </button>
        </div>

        {/* Conditional Component: Simplified Vector Map Overlay */}
        {showLocationGuide && (
          <div className="w-full bg-slate-900/30 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
            <div className="space-y-2 max-w-sm">
              <h4 className="text-white text-sm font-semibold tracking-wide">Topographical Alignment Profile</h4>
              <p className="text-slate-400 text-xs font-light leading-relaxed">
                Primary cluster node set directly over the central championship golf fairways. Maximum elevation guarantees unblocked visual spans.
              </p>
            </div>
            {/* Elegant, pure inline CSS vector instead of broken script maps */}
            <div className="relative w-full md:w-64 h-24 bg-slate-950/80 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
              <div className="absolute inset-x-0 top-1/3 h-[1px] bg-gradient-to-r from-transparent via-amber-500/10 to-transparent rotate-3" />
              <div className="relative flex flex-col items-center">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping absolute" />
                <span className="w-2 h-2 bg-amber-500 rounded-full relative z-10" />
                <span className="text-[9px] uppercase tracking-widest text-amber-400 mt-2 font-bold">Uptown Hub Node</span>
              </div>
            </div>
          </div>
        )}

        {/* Streamlined Interactive Selector Grid */}
        <form 
          onSubmit={handleSearchRedirect}
          className="w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2 items-center shadow-2xl"
        >
          <div className="space-y-1 px-3">
            <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Property Type</label>
            <select 
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-transparent text-white text-sm font-light focus:outline-none appearance-none cursor-pointer"
            >
              <option value="Golf Villa" className="bg-slate-950">Golf Villa</option>
              <option value="Premium Apartment" className="bg-slate-950">Premium Apartment</option>
            </select>
          </div>

          <div className="space-y-1 px-3 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0">
            <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Desired View</label>
            <select 
              value={viewPreference}
              onChange={(e) => setViewPreference(e.target.value)}
              className="w-full bg-transparent text-white text-sm font-light focus:outline-none appearance-none cursor-pointer"
            >
              <option value="Full Golf Course" className="bg-slate-950">Full Golf Course</option>
              <option value="Skyline & Greenery" className="bg-slate-950">Skyline & Greenery</option>
            </select>
          </div>

          <div className="space-y-1 px-3 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0">
            <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-wider">Price Range</label>
            <select 
              value={priceTier}
              onChange={(e) => setPriceTier(e.target.value)}
              className="w-full bg-transparent text-white text-sm font-light focus:outline-none appearance-none cursor-pointer"
            >
              <option value="Ultra-Luxury" className="bg-slate-950">Ultra-Luxury</option>
              <option value="Premium Tier" className="bg-slate-950">Premium Tier</option>
            </select>
          </div>

          <div className="pt-2 md:pt-0">
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs py-4 rounded-xl shadow-lg transition-transform transform active:scale-[0.98]"
            >
              Find Match with AI
            </button>
          </div>
        </form>

      </div>
    </section>
  );
}
