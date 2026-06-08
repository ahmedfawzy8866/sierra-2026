'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback, useRef } from 'react';
import FilterBar from './FilterBar';

interface NavItem { label: string; href: string; }

const NAV_ITEMS: NavItem[] = [
  { label: 'Buy',          href: '/listings?purpose=resale' },
  { label: 'Rent',         href: '/listings?purpose=rent' },
  { label: 'New Projects', href: '/projects' },
  { label: 'Find Agent',   href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [filterVisible, setFilterVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 20);
    // Hide filter bar after scrolling past 400px, show again near top
    setFilterVisible(y < 400 || y < lastScrollY.current);
    lastScrollY.current = y;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-[var(--z-sticky)] transition-all duration-500 ease-silk ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-[var(--navy-08)]'
          : 'bg-transparent'
      }`}
      style={{ transition: 'background 0.4s var(--ease-silk), box-shadow 0.4s var(--ease-silk)' }}
    >
      {/* ── Top Nav Bar ─────────────────────────────────────────────── */}
      <div className="max-w-[var(--max-width)] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between py-4">

          {/* Logo — centered on desktop */}
          <div className="flex-1 flex items-start">
            <Link href="/" aria-label="Sierra Estates Home">
              <div className="flex items-center gap-3 group">
                {/* Logo mark */}
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle, rgba(230,57,70,0.25) 0%, rgba(200,150,26,0.12) 50%, transparent 70%)',
                      inset: '-12px',
                    }}
                  />
                  {/* Fallback SVG logo if image missing */}
                  <div className="w-10 h-10 relative flex items-center justify-center">
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                      <circle cx="20" cy="20" r="19" stroke="#E63946" strokeWidth="1.5" fill="none" opacity="0.3"/>
                      <path d="M20 6L32 14V26L20 34L8 26V14L20 6Z" fill="#E63946" opacity="0.9"/>
                      <path d="M20 10L28 15V25L20 30L12 25V15L20 10Z" fill="#FAF8F3" opacity="0.15"/>
                      <text x="20" y="24" textAnchor="middle" fill="#FAF8F3" fontSize="10" fontWeight="700" fontFamily="Inter">SB</text>
                    </svg>
                  </div>
                </div>
                <div>
                  <p
                    className="font-serif text-[17px] font-semibold tracking-[0.18em] text-[var(--navy)] leading-none"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    SIERRA ESTATES
                  </p>
                  <p
                    className="text-[8px] uppercase tracking-[0.42em] text-[var(--red)] font-bold leading-none mt-0.5"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    REALTY
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--navy-80)] hover:text-[var(--gold)] transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex-1 flex justify-end items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden md:block text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--navy-60)] hover:text-[var(--navy)] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/listings"
              id="header-cta"
              className="px-5 py-2.5 bg-[var(--navy)] hover:bg-[var(--gold)] hover:text-[var(--navy)] text-white rounded-[var(--radius-md)] text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 ease-silk shadow-sm"
            >
              Browse
            </Link>
            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-btn"
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Open menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className={`block w-5 h-0.5 bg-[var(--navy)] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-[var(--navy)] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-[var(--navy)] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── Integrated Filter Bar ─────────────────────────────────── */}
        <div
          className={`pb-3 transition-all duration-500 ease-silk overflow-hidden ${
            filterVisible ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {scrolled && <FilterBar compact />}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t border-[var(--navy-08)] shadow-lg animate-[slide-down_200ms_ease-silk_forwards]"
        >
          <nav className="px-6 py-4 flex flex-col gap-4" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm uppercase tracking-[0.15em] font-semibold text-[var(--navy-80)] hover:text-[var(--gold)] transition-colors py-2 border-b border-[var(--navy-08)]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="text-sm text-[var(--navy-60)] py-2"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
