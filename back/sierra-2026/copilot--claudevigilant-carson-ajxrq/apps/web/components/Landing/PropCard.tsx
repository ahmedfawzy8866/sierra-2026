'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PropCardProps {
  id: string | number;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  badge: string;
  badgeColor: string;
  img: string;
  dealDelay?: number;
  dealt?: boolean;
  isAr?: boolean;
}

export default function PropCard({ id, title, location, price, beds, baths, sqft, badge, badgeColor, img, dealDelay = 0, dealt = false, isAr = false }: PropCardProps) {
  const [hov, setHov] = useState(false);

  return (
    <Link
      href={`/listings/${id}`}
      className={`deal-card${dealt ? ' dealt' : ''} block`}
      style={{ animationDelay: `${dealDelay}s` }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        className="rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300"
        style={{
          background: 'var(--surface-container-high)',
          border: `1px solid ${hov ? 'rgba(233,193,118,0.38)' : 'var(--outline-variant)'}`,
          boxShadow: hov
            ? '0 24px 56px rgba(0,0,0,0.35), 0 0 30px rgba(233,193,118,0.12)'
            : '0 4px 24px rgba(0,0,0,0.15)',
          transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        }}
      >
        <div className="relative h-[200px] overflow-hidden" style={{ background: '#122A47' }}>
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-600"
            style={{ transform: hov ? 'scale(1.07)' : 'scale(1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span
            className="absolute top-3 left-3 text-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
            style={{ background: badgeColor, fontFamily: "'Jost', sans-serif" }}
          >
            {badge}
          </span>
        </div>
        <div className="p-4 pb-5">
          <div className="text-[9px] font-medium tracking-[.16em] uppercase text-secondary mb-1" style={{ fontFamily: "'Jost', sans-serif" }}>
            {location}
          </div>
          <div className="font-serif text-xl font-semibold text-on-surface leading-tight mb-2" style={{ textAlign: isAr ? 'right' : 'left' }}>
            {title}
          </div>
          <div className="font-mono text-lg font-medium text-secondary mb-2.5 tracking-tight">
            {price}
          </div>
          <div
            className="flex gap-3.5 text-[11px] text-on-surface-variant font-mono font-light pt-3"
            style={{ borderTop: '1px solid var(--outline-variant)', flexDirection: isAr ? 'row-reverse' : 'row' }}
          >
            <span>{beds} {isAr ? 'غرف' : 'bed'}</span>
            <span>{baths} {isAr ? 'حمامات' : 'bath'}</span>
            <span>{sqft}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
