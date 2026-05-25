import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../lib/AuthContext';
import { I18nProvider } from '../lib/I18nContext';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sierra Blu Realty | سييرا بلو العقارية',
  description: 'Cinematic Luxury Real Estate — Premium properties across Egypt\'s most exclusive communities | عقارات فاخرة في أرقى المجتمعات المصرية',
  keywords: ['real estate', 'luxury', 'Egypt', 'عقارات', 'فاخرة', 'مصر', 'Sierra Blu'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" disableTransitionOnChange>
          <I18nProvider>
            <AuthProvider>
              <div className="mouse-glow" />
              <Toaster position="top-right" />
              {children}
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
