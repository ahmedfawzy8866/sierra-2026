'use client';

import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../lib/AuthContext';
import { I18nProvider } from '../lib/I18nContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" disableTransitionOnChange>
      <I18nProvider>
        <AuthProvider>
          <div className="mouse-glow" />
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
