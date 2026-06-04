"use client";
import React, { useState, useCallback } from 'react';

export type Locale = 'ar' | 'en';

interface LanguageToggleProps {
  onLocaleChange?: (locale: Locale) => void;
}

export default function LanguageToggle({ onLocaleChange }: LanguageToggleProps) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof document !== 'undefined') {
      return (document.documentElement.lang as Locale) || 'en';
    }
    return 'en';
  });

  const toggleLocale = useCallback(() => {
    const next: Locale = locale === 'en' ? 'ar' : 'en';
    setLocale(next);

    // Apply to DOM immediately
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';

    onLocaleChange?.(next);
  }, [locale, onLocaleChange]);

  return (
    <button
      onClick={toggleLocale}
      className="language-toggle"
      aria-label={`Switch to ${locale === 'en' ? 'Arabic' : 'English'}`}
      title={locale === 'en' ? 'التبديل للعربية' : 'Switch to English'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: '20px',
        border: '1px solid var(--glass-border, rgba(255,255,255,0.12))',
        background: 'rgba(255,255,255,0.04)',
        color: 'var(--text-secondary, #aaa)',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        letterSpacing: '0.5px',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--gold, #d4af37)';
        e.currentTarget.style.color = 'var(--gold, #d4af37)';
        e.currentTarget.style.background = 'rgba(212,175,55,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--glass-border, rgba(255,255,255,0.12))';
        e.currentTarget.style.color = 'var(--text-secondary, #aaa)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span style={{ fontFamily: locale === 'en' ? "'Inter', sans-serif" : "'IBM Plex Sans Arabic', sans-serif" }}>
        {locale === 'en' ? 'عربي' : 'EN'}
      </span>
    </button>
  );
}
