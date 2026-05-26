import type { Metadata } from 'next';
import { Providers } from './providers';
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
