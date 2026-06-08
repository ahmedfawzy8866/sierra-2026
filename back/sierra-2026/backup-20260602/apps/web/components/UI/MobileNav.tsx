"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Users,
  MapPin,
  BarChart3,
} from 'lucide-react';

type Screen =
  | 'dashboard' | 'listings' | 'crm' | 'leads' | 'reports' | 'team'
  | 'clients' | 'protocols' | 'media' | 'experiences' | 'ledger' | 'sync'
  | 'processing' | 'nexus' | 'intelligence' | 'map' | 'system'
  | 'team-crm' | 'admin-dashboard' | 'database';

interface MobileNavProps {
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const TABS: { id: Screen; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Home', icon: <LayoutDashboard size={22} /> },
  { id: 'listings', label: 'Listings', icon: <Building2 size={22} /> },
  { id: 'map', label: 'Map', icon: <MapPin size={22} /> },
  { id: 'crm', label: 'CRM', icon: <Users size={22} /> },
  { id: 'reports', label: 'Reports', icon: <BarChart3 size={22} /> },
];

export default function MobileNav({ activeScreen, onNavigate }: MobileNavProps) {
  return (
    /* Only renders on md and below — hidden on desktop */
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[70] flex items-center justify-around"
      style={{
        background: 'color-mix(in srgb, var(--surface) 92%, transparent)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        height: 'calc(64px + env(safe-area-inset-bottom))',
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeScreen === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className="relative flex flex-col items-center justify-center gap-[3px] flex-1 h-full"
            style={{ color: isActive ? '#D4AF37' : 'var(--text-dim)' }}
            aria-label={tab.label}
          >
            {isActive && (
              <motion.div
                layoutId="mobile-nav-pill"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full"
                style={{ background: '#D4AF37' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <motion.div
              animate={{ scale: isActive ? 1.15 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {tab.icon}
            </motion.div>
            <span
              className="text-[10px] font-bold uppercase tracking-wide"
              style={{ opacity: isActive ? 1 : 0.5 }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
