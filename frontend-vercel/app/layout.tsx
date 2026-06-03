import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { Providers } from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './styles/design.css';
import './globals.css';

const LOCALE_COOKIE_KEY = 'sb_locale';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sierra Blu Realty | سييرا بلو العقارية',
  description:
    "Cinematic Luxury Real Estate — Premium properties across Egypt's most exclusive communities | عقارات فاخرة في أرقى المجتمعات المصرية",
  keywords: ['real estate', 'luxury', 'Egypt', 'New Cairo', 'عقارات', 'فاخرة', 'مصر', 'Sierra Blu'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Sierra Blu Realty',
    description: "Egypt's Premier Property Intelligence Platform",
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_EG',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = cookies();
  const locale = cookieStore.get(LOCALE_COOKIE_KEY)?.value === 'ar' ? 'ar' : 'en';

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Preconnect to font CDN & image CDNs */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>
        <Providers>
          {/* Sticky Header with embedded compact FilterBar */}
          <Header />
          {/* Page content padded below fixed header */}
          <main id="main-content">
            {children}
          </main>
          {/* Global Footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
