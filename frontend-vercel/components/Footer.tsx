'use client';

import Link from 'next/link';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Explore Properties', href: '/listings' },
    { label: 'Advanced Search',    href: '/listings?advanced=1' },
    { label: 'Market Insights',    href: '/insights' },
    { label: "Buyer's Guide",      href: '/guides/buyer' },
  ],
  Services: [
    { label: 'Private Consultation', href: '/concierge' },
    { label: 'Investment Advisory',  href: '/services/advisory' },
    { label: 'Virtual Tours',        href: '/virtual-tour' },
    { label: 'Concierge',            href: '/concierge' },
  ],
  Company: [
    { label: 'About Sierra Estates', href: '/about' },
    { label: 'Our Team',         href: '/about#team' },
    { label: 'Careers',          href: '/careers' },
    { label: 'Press',            href: '/about#press' },
  ],
  Legal: [
    { label: 'Privacy Policy',  href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Compliance',      href: '/legal/compliance' },
    { label: 'Contact',         href: '/contact' },
  ],
};

const SOCIAL = [
  {
    label: 'WhatsApp', href: 'https://wa.me/201000000000',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram', href: 'https://instagram.com/sierrablu',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn', href: 'https://linkedin.com/company/sierrablu',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="site-footer"
      style={{ background: 'var(--navy)', color: 'rgba(244,240,232,0.55)' }}
    >
      {/* ── Pre-footer CTA Band ──────────────────────────────────────── */}
      <div
        className="border-b"
        style={{
          borderColor: 'rgba(200,150,26,0.15)',
          background: 'linear-gradient(135deg, rgba(200,150,26,0.07) 0%, rgba(230,57,70,0.04) 100%)',
        }}
      >
        <div className="max-w-[var(--content-width)] mx-auto px-8 py-16 text-center">
          <p
            className="text-[11px] uppercase tracking-[0.3em] mb-4 font-semibold"
            style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}
          >
            Your Next Chapter Awaits
          </p>
          <h2
            className="font-light mb-5"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: 'rgba(244,240,232,0.95)',
              lineHeight: 1.2,
            }}
          >
            Ready to Invest in Excellence?
          </h2>
          <p className="text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Join our portfolio of satisfied investors and secure your next luxury property today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/listings"
              id="footer-cta-explore"
              className="px-8 py-3.5 rounded-lg text-[12px] font-bold uppercase tracking-[0.2em] transition-all duration-300"
              style={{ background: 'var(--gold)', color: 'var(--navy)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--gold-light)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--gold)')}
            >
              Explore Portfolio
            </Link>
            <Link
              href="/concierge"
              id="footer-cta-viewing"
              className="px-8 py-3.5 rounded-lg text-[12px] font-bold uppercase tracking-[0.2em] border-2 transition-all duration-300"
              style={{ borderColor: 'rgba(244,240,232,0.3)', color: 'rgba(244,240,232,0.9)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,240,232,0.8)';
                (e.currentTarget as HTMLElement).style.background = 'rgba(244,240,232,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(244,240,232,0.3)';
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              Schedule Viewing
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ─────────────────────────────────────────── */}
      <div className="max-w-[var(--content-width)] mx-auto px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
                <path d="M20 4L36 13V27L20 36L4 27V13L20 4Z" fill="var(--gold)" opacity="0.9"/>
                <text x="20" y="25" textAnchor="middle" fill="var(--navy)" fontSize="11" fontWeight="700" fontFamily="Inter">SB</text>
              </svg>
              <div>
                <p
                  className="font-semibold tracking-[0.2em] text-base leading-none"
                  style={{ fontFamily: 'var(--font-serif)', color: 'rgba(244,240,232,0.95)' }}
                >
                  SIERRA ESTATES
                </p>
                <p
                  className="text-[8px] tracking-[0.45em] uppercase mt-0.5 leading-none"
                  style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}
                >
                  REALTY
                </p>
              </div>
            </div>
            <p className="text-[12px] leading-relaxed max-w-[180px] mb-5">
              Egypt&rsquo;s premier luxury real estate intelligence platform.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ background: 'rgba(244,240,232,0.08)', color: 'rgba(244,240,232,0.5)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--gold)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--navy)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(244,240,232,0.08)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(244,240,232,0.5)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-[10px] uppercase tracking-[0.18em] mb-4 font-bold"
                style={{ color: 'rgba(244,240,232,0.7)' }}
              >
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[12px] transition-colors duration-200"
                      style={{ color: 'rgba(244,240,232,0.5)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(244,240,232,0.5)')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────────────────────── */}
      <div
        className="border-t"
        style={{ borderColor: 'rgba(200,150,26,0.15)' }}
      >
        <div className="max-w-[var(--content-width)] mx-auto px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            © {year} Sierra Estates Realty. All rights reserved.
          </p>
          <div
            className="h-px flex-1 mx-8 opacity-20"
            style={{ background: 'linear-gradient(to right, transparent, var(--gold), transparent)' }}
          />
          <p
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}
          >
            PropTech Intelligence · {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
