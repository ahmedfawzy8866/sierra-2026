"use client";
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

import en from '../messages/en.json';
import ar from '../messages/ar.json';

export type Locale = 'ar' | 'en';

type Messages = typeof en;
type Namespace = keyof Messages;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (nsOrCombined: string, key?: string) => string;
  dir: 'ltr' | 'rtl';
}

const messages: Record<Locale, Messages> = { en, ar };
const LOCALE_STORAGE_KEY = 'sb_locale';

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Persist locale to localStorage so language survives page refresh
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (saved === 'ar' || saved === 'en') return saved;
    }
    return 'en';
  });

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
      document.documentElement.lang = next;
      document.documentElement.dir  = next === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  // Apply dir/lang on mount (covers page reload)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir  = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  const t = useCallback(
    (nsOrCombined: string, maybeKey?: string): string => {
      let namespace: Namespace;
      let key: string;

      if (maybeKey) {
        namespace = nsOrCombined as Namespace;
        key = maybeKey;
      } else {
        const dotIndex = nsOrCombined.indexOf('.');
        if (dotIndex === -1) return nsOrCombined;
        namespace = nsOrCombined.substring(0, dotIndex) as Namespace;
        key = nsOrCombined.substring(dotIndex + 1);
      }

      const ns = messages[locale]?.[namespace];
      if (!ns) return key;

      const parts = key.split('.');
      let result: unknown = ns;
      for (const part of parts) {
        if (result && typeof result === 'object' && part in result) {
          result = (result as Record<string, unknown>)[part];
        } else {
          return key;
        }
      }
      return typeof result === 'string' ? result : key;
    },
    [locale]
  );

  const dir: 'ltr' | 'rtl' = locale === 'ar' ? 'rtl' : 'ltr';

  const value = useMemo(
    () => ({ locale, setLocale, t, dir }),
    [locale, setLocale, t, dir]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
