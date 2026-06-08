'use client';

import React, { useState, useEffect, useRef } from 'react';
import { fetchAllMapProperties } from '@/lib/database-protocol';
import type { SierraProperty } from '@/lib/database-protocol';

export default function SierraBluUnified() {
  const [properties, setProperties] = useState<SierraProperty[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllMapProperties().then(setProperties);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getStereoscopicTransform = () => {
    if (!heroRef.current) return '';
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((mousePos.x - rect.left) / rect.width - 0.5) * 10;
    const y = ((mousePos.y - rect.top) / rect.height - 0.5) * 10;
    return `perspective(1500px) rotateX(${y}deg) rotateY(${x}deg)`;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-ivory-100 text-navy-300">
      {/* ═══════════════════════════════════════════════════════════
          FIXED GLASS NAVBAR
          ═══════════════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-navy-300/80 backdrop-blur-md border-b border-sierra-estatese-500/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-safe py-4 flex justify-between items-center">
          {/* Logo & Brand */}
          <div className="flex items-baseline gap-2">
            <h1 className="font-serif text-2xl text-navy-300">SIERRA ESTATES</h1>
            <span className="text-sm text-sierra-estatese-500 font-sans tracking-widest">REALTY</span>
          </div>

          {/* AirCenter Infrastructure Tracker */}
          <div className="flex items-center gap-3 bg-navy-300/20 backdrop-blur px-4 py-2 rounded-full border border-sierra-estatese-500/30 font-mono text-xs text-sierra-estatese-500">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Node-Sync v12.4 · Firestore Engine Online</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8">
            <button className="text-navy-300 hover:text-sierra-estatese-500 transition-colors text-sm uppercase tracking-widest">
              Properties
            </button>
            <button className="text-navy-300 hover:text-sierra-estatese-500 transition-colors text-sm uppercase tracking-widest">
              Intelligence
            </button>
            <button className="bg-gold-500 hover:bg-gold-600 text-navy-300 px-6 py-2 rounded text-sm uppercase tracking-widest font-medium transition-colors">
              Explore
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          TREF HERO VIEWPORT
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative h-screen bg-gradient-to-b from-navy-300 via-navy-200 to-ivory-100 pt-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-sierra-estatese-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-safe h-full flex flex-col justify-center">
          <div className="animate-fade-in">
            <p className="text-sierra-estatese-500 font-sans text-sm uppercase tracking-widest mb-6">
              Beyond Brokerage
            </p>
            <h2 className="font-serif text-display-lg text-navy-300 mb-4 leading-tight">
              Refined Decisions.<br />Intelligence-Led.
            </h2>
            <p className="font-sans text-lg text-navy-200 max-w-xl mb-12">
              Egypt's first institutional real estate advisory, powered by AI matching and curated by experts. Properties that fit, capital that flows.
            </p>

            {/* PEACHWORLDS STEREOSCOPIC CORE */}
            <div
              ref={heroRef}
              className="mt-12 bg-white/5 backdrop-blur border border-ivory-100/20 rounded-2xl p-8 max-w-2xl"
              style={{ transform: getStereoscopicTransform(), transition: 'transform 0.3s ease-out' }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-navy-200 text-sm uppercase tracking-widest mb-2">Properties</p>
                  <p className="text-5xl font-serif text-gold-500">{properties.length}+</p>
                </div>
                <div>
                  <p className="text-navy-200 text-sm uppercase tracking-widest mb-2">Match Rate</p>
                  <p className="text-5xl font-serif text-sierra-estatese-500">98%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HUBTOWN MAP SEARCH CONSOLE
          ═══════════════════════════════════════════════════════════ */}
      <section className="bg-ivory-100 py-20">
        <div className="max-w-7xl mx-auto px-safe">
          <h3 className="font-serif text-heading-lg text-navy-300 mb-12">Market Intelligence</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Property Collections List */}
            <div className="bg-white rounded-xl shadow-card p-6 max-h-96 overflow-y-auto">
              <h4 className="font-serif text-heading-md text-navy-300 mb-6">Available Collections</h4>
              <div className="space-y-3">
                {properties.slice(0, 10).map((prop) => (
                  <div
                    key={prop.id}
                    className="p-4 bg-ivory-100 rounded-lg border-l-4 border-sierra-estatese-500 hover:bg-ivory-200 transition-colors cursor-pointer"
                  >
                    <p className="font-medium text-navy-300">{prop.sbrCode}</p>
                    <p className="text-sm text-navy-200">{prop.compound}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Spatial Map Pins */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-6 relative h-96 overflow-hidden">
              <h4 className="font-serif text-heading-md text-navy-300 mb-4 absolute top-6 left-6 z-10">
                Spatial Distribution
              </h4>

              <div className="relative w-full h-full bg-gradient-subtle rounded-lg overflow-hidden">
                {/* Map Background Placeholder */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjRGMEU4Ii8+Cjwvc3ZnPg==')] bg-cover opacity-30" />

                {/* Property Pins */}
                {properties.slice(0, 8).map((prop, idx) => (
                  <div
                    key={prop.id}
                    className="absolute w-12 h-12 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{
                      left: `${((prop.location.lng - 31.4) / 0.3) * 100}%`,
                      top: `${((30.1 - prop.location.lat) / 0.15) * 100}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-sierra-estatese-500 rounded-full opacity-30 animate-pulse" />
                    <div className="relative z-10 bg-sierra-estatese-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-sans text-xs font-bold group-hover:scale-150 transition-transform">
                      {Math.round(prop.price / 1000000)}
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-navy-300 text-ivory-100 text-xs px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {prop.sbrCode}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer className="bg-navy-300 text-ivory-100 py-12">
        <div className="max-w-7xl mx-auto px-safe text-center">
          <p className="text-sm text-ivory-100/70 mb-4">
            © 2026 Sierra Estates Realty. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 text-xs uppercase tracking-widest">
            <a href="#" className="hover:text-sierra-estatese-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-sierra-estatese-500 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-gold-500 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
