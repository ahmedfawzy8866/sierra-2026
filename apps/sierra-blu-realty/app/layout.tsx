import type { Metadata } from 'next';
import {
  Cormorant_Garamond,
  Manrope,
  Jost,
  Inter,
  DM_Mono,
  Cairo,
} from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

/* ──────────────────────────────────────────────────────────
   Brand typography — self-hosted via next/font (no render-block,
   no layout shift). Each binds a CSS variable consumed by
   globals.css (@theme + :root). Do not rename the variables —
   ~125 component references depend on --font-display/body/serif/
   mono/arabic resolving correctly.

   Display serif : Cormorant Garamond → editorial headlines, prices
   UI display    : Manrope            → strong UI display headings
   UI sans       : Jost → Inter       → labels, body, data
   Mono          : DM Mono            → prices, stats, SBR codes
   Arabic (RTL)  : Cairo              → all dir="rtl" content
   ────────────────────────────────────────────────────────── */
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
});

const fontVariables = [
  cormorant.variable,
  manrope.variable,
  jost.variable,
  inter.variable,
  dmMono.variable,
  cairo.variable,
].join(' ');

export const metadata: Metadata = {
  title: 'Sierra Estates Realty | سييرا إستيتس العقارية',
  description:
    'Cinematic Luxury Real Estate — Premium properties across Egypt\'s most exclusive communities | عقارات فاخرة في أرقى المجتمعات المصرية',
  keywords: ['real estate', 'luxury', 'Egypt', 'عقارات', 'فاخرة', 'مصر', 'Sierra Estates'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={fontVariables} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
