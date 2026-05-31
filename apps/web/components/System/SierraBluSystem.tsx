'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/I18nContext';

// Mock Data updated for the New Cairo Rent & Resale Market
const MOCK_PROPERTIES = [
  { 
    id: 1, 
    title: 'Luxury Standalone Villa in Golden Square', 
    location: 'Fifth Settlement, New Cairo',
    price: 'EGP 28,500,000', 
    purpose: 'RESALE',
    beds: 5, 
    baths: 6, 
    sqft: '4,200', 
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500',
    aiScore: '9.4'
  },
  { 
    id: 2, 
    title: 'Modern 3BR Apartment facing AUC Campus', 
    location: 'Urban Area, New Cairo',
    price: 'EGP 45,000 / mo', 
    purpose: 'RENT',
    beds: 3, 
    baths: 2.5, 
    sqft: '1,950', 
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
    aiScore: '8.9'
  },
  { 
    id: 3, 
    title: 'Premium Townhouse with Private Garden', 
    location: 'El Rehab City, New Cairo',
    price: 'EGP 14,200,000', 
    purpose: 'RESALE',
    beds: 4, 
    baths: 4, 
    sqft: '3,100', 
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
    aiScore: '9.1'
  },
];

export default function SierraBluSystem() {
  const { locale, setLocale } = useI18n();
  const [search, setSearch] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('All');
  const isAr = locale === 'ar';

  // Filter properties based on purpose (Rent/Resale) and search term
  const filteredProperties = MOCK_PROPERTIES.filter(property => {
    const matchesPurpose = purposeFilter === 'All' || property.purpose === purposeFilter;
    const matchesSearch = property.title.toLowerCase().includes(search.toLowerCase()) || 
                          property.location.toLowerCase().includes(search.toLowerCase());
    return matchesPurpose && matchesSearch;
  });

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="flex flex-col h-screen bg-gray-50 text-gray-800 antialiased font-sans">
      
      {/* 1. SYSTEM HEADER & BRANDING */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 z-10 shrink-0 shadow-sm">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black text-blue-900 tracking-tight uppercase">
              Sierra-Blu<span className="text-blue-600 font-medium">Realty</span>
            </span>
            <span className="hidden sm:inline-block bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
              SaaS Intelligence
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium tracking-wide">Beyond Brokerage</p>
        </div>

        {/* Specialized Navigation for Rent & Resale */}
        <nav className="hidden md:flex space-x-8 font-semibold text-sm text-gray-600">
          <button onClick={() => setPurposeFilter('All')} className={`transition-colors ${purposeFilter === 'All' ? 'text-blue-600' : 'hover:text-blue-900'}`}>All Matrix</button>
          <button onClick={() => setPurposeFilter('RENT')} className={`transition-colors ${purposeFilter === 'RENT' ? 'text-blue-600' : 'hover:text-blue-900'}`}>Rentals</button>
          <button onClick={() => setPurposeFilter('RESALE')} className={`transition-colors ${purposeFilter === 'RESALE' ? 'text-blue-600' : 'hover:text-blue-900'}`}>Resale Market</button>
          <a href="#" className="hover:text-blue-900 flex items-center space-x-1">
            <span>AI Insights</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition">
            Dashboard
          </button>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-200">
            Console Login
          </button>
        </div>
      </header>

      {/* 2. ADVANCED AI SEARCH & FILTER ENGINE */}
      <section className="bg-white border-b border-gray-200 px-6 py-4 shrink-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
          
          {/* Real-time search */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
              type="text" 
              placeholder="Search New Cairo districts (e.g., Golden Square, Rehab, AUC area)..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* SaaS Core Selectors */}
          <div className="flex space-x-3">
            <select 
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:border-blue-500 transition cursor-pointer text-gray-700"
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
            >
              <option value="All">All Transactions</option>
              <option value="RENT">Rent Portfolios</option>
              <option value="RESALE">Resale Pipeline</option>
            </select>
            
            <button className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition shadow-sm flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"></path></svg>
              <span>Predictive Filters</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. CORE SPLIT INTERACTION DESIGN */}
      <main className="flex flex-1 overflow-hidden">
        
        {/* LEFT COMPONENT: DATA DRIVEN PORTFOLIO ASSETS GRID */}
        <section className="w-full lg:w-7/12 overflow-y-auto px-6 py-6 scroll-smooth">
          <div className="max-w-3xl mx-auto">
            
            {/* SaaS Descriptor Banner */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-blue-500/30 px-2 py-0.5 rounded border border-blue-400/20">Market Intelligence</span>
                <h2 className="text-lg font-bold mt-1">New Cairo’s First AI-Powered Rent & Resale SaaS</h2>
                <p className="text-xs text-blue-200/80 mt-0.5">Real-time yields, predictive capital growth, and aggregated primary/secondary market layers.</p>
              </div>
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-white">
                <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">Active Opportunities</h1>
                <p className="text-xs text-gray-500 font-medium">Showing {filteredProperties.length} refined matching assets</p>
              </div>
              <select className="text-xs bg-transparent font-bold text-gray-600 border-none focus:ring-0 cursor-pointer">
                <option>Sort: Highest AI Yield</option>
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
              </select>
            </div>

            {/* Smart Property Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProperties.map((property) => (
                <div key={property.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/[0.02] transition-all duration-300 group cursor-pointer flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <img 
                        src={property.img} 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                      />
                      
                      {/* Dynamic Purpose Badge */}
                      <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold shadow-sm tracking-wider ${
                        property.purpose === 'RENT' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        FOR {property.purpose}
                      </div>

                      {/* AI Proprietary Score Badge */}
                      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-lg text-white flex items-center space-x-1.5 border border-white/10 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                        <span className="text-[10px] font-medium text-gray-300">AI Score:</span>
                        <span className="text-xs font-bold text-blue-400">{property.aiScore}</span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h2 className="text-xl font-black text-gray-900 tracking-tight mb-0.5">{property.price}</h2>
                      <p className="text-xs font-bold text-blue-600 mb-2">{property.location}</p>
                      <h3 className="text-sm font-semibold text-gray-700 group-hover:text-blue-900 transition-colors line-clamp-1">{property.title}</h3>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 border-t border-gray-100 pt-3 mt-2">
                      <span className="flex items-center space-x-1">📁 <span>{property.beds} Bed</span></span>
                      <span className="flex items-center space-x-1">🛁 <span>{property.baths} Bath</span></span>
                      <span className="flex items-center space-x-1">📐 <span>{property.sqft} Sq Ft</span></span>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredProperties.length === 0 && (
                <div className="col-span-full py-12 text-center bg-gray-100 rounded-2xl border border-dashed border-gray-300">
                  <p className="text-sm text-gray-500 font-medium">No inventory elements match your current search constraints.</p>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* RIGHT COMPONENT: GEOSPATIAL INTELLIGENCE LAYERING */}
        <section className="hidden lg:block lg:w-5/12 bg-slate-900 relative border-l border-gray-200">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-slate-950/40 z-10 pointer-events-none" />
          
          {/* Map Vector/SDK Container */}
          <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
            
            {/* Interactive Blueprint Mock Element */}
            <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner animate-pulse">
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            
            <h3 className="font-bold text-gray-100 mb-1.5 text-base tracking-tight">Geospatial Engine Ready</h3>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              Injecting Mapbox GL / Google Maps core instance targeted at coordinates <span className="text-blue-400 font-mono font-semibold">30.0263° N, 31.4913° E</span> (New Cairo Hub).
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-xs">
              <span className="text-[10px] bg-slate-800 text-gray-300 px-2 py-1 rounded font-mono border border-slate-700">Heatmaps: Active</span>
              <span className="text-[10px] bg-slate-800 text-blue-400 px-2 py-1 rounded font-mono border border-slate-700">Yield Matrix: Integrated</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
