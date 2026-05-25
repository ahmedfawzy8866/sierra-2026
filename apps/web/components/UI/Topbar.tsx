"use client";
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useI18n } from '../../lib/I18nContext';
import { useTheme } from 'next-themes';
import BrandLogo from './BrandLogo';
import LanguageToggle from './LanguageToggle';
import { Search, Bell, Moon, Sun, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface TopbarProps {
  onHomeClick: () => void;
  onSignOut: () => void;
  userInitials?: string;
  displayName?: string;
  isGuest?: boolean;
}

export default function Topbar({
  onHomeClick,
  onSignOut,
  userInitials = 'AF',
  displayName = 'Ahmed Fawzy',
  isGuest = false,
}: TopbarProps) {
  const { setLocale, locale } = useI18n();
  const { theme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    try {
      if (!isGuest) {
        await signOut(auth);
      }
      onSignOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="topbar midnight-mode w-full h-[80px] px-8 flex items-center justify-between border-b border-white/5 sticky top-0 z-[60] backdrop-blur-3xl bg-navy/80" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-12 flex-1">
        <button 
          onClick={onHomeClick} 
          className="hover:opacity-80 transition-opacity"
          aria-label="Return to Dashboard"
        >
          <BrandLogo size="sm" />
        </button>

        {/* ── Search Surface ── */}
        <div className="relative max-w-xl flex-1 group">
          <Search 
            size={16} 
            className="absolute start-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-gold transition-colors" 
          />
          <input
            type="text"
            placeholder={locale === 'ar' ? "استعلام عن الأصول أو الإشارات الاستخباراتية..." : "Query assets, signals, or portfolio intelligence..."}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3 ps-12 pe-4 text-sm text-white/90 outline-none focus:border-gold/40 focus:bg-white/[0.05] transition-all duration-300 tracking-wide"
          />
          <div className="absolute end-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-20 group-focus-within:opacity-50 transition-opacity">
            <span className="text-[10px] font-bold border border-white/40 px-1.5 py-0.5 rounded">⌘</span>
            <span className="text-[10px] font-bold border border-white/40 px-1.5 py-0.5 rounded">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <LanguageToggle onLocaleChange={setLocale} />

        <div className="w-px h-6 bg-white/[0.08] mx-2" />

        <div className="flex items-center gap-1">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleTheme}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-gold transition-colors"
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-gold transition-colors relative"
          >
            <Bell size={18} />
            <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_#C8A96E]" />
          </motion.button>
        </div>

        {/* ── User Quick Info ── */}
        <motion.div 
          onClick={handleSignOut}
          whileHover={{ borderColor: 'rgba(201,168,76,0.3)', backgroundColor: 'rgba(255,255,255,0.02)' }}
          className="flex items-center gap-4 ps-4 pe-1 py-1 rounded-2xl border border-white/[0.05] bg-white/[0.01] cursor-pointer group transition-all duration-300 ms-4"
        >
          <div className="flex flex-col text-right rtl:text-left">
            <span className="text-xs font-bold text-white group-hover:text-gold transition-colors">{displayName}</span>
            <span className="text-[9px] font-black text-gold/40 uppercase tracking-widest">{isGuest ? 'Guest' : 'Admin'}</span>
          </div>
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center text-navy font-black text-xs shadow-lg">
              {userInitials}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`.midnight-mode { background: #050B14; }`}</style>
    </header>
  );
}
