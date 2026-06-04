'use client';

export default function ShieldLogo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 120 138" fill="none">
      <defs>
        <linearGradient id="sbl-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5E070" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A07820" />
        </linearGradient>
        <linearGradient id="sbl-navy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A2545" />
          <stop offset="100%" stopColor="#000A20" />
        </linearGradient>
        <linearGradient id="sbl-bldg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <linearGradient id="sbl-ribbon" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#F0D060" />
          <stop offset="100%" stopColor="#B8941A" />
        </linearGradient>
        <clipPath id="sbl-clip">
          <path d="M60 8L106 25V78Q106 114 60 130Q14 114 14 78V25Z" />
        </clipPath>
      </defs>
      <path d="M60 2L112 21V79Q112 122 60 138Q8 122 8 79V21Z" fill="url(#sbl-gold)" />
      <path d="M60 8L106 25V78Q106 114 60 130Q14 114 14 78V25Z" fill="url(#sbl-navy)" />
      <g clipPath="url(#sbl-clip)">
        <rect x="28" y="42" width="14" height="40" fill="rgba(255,255,255,0.2)" rx="1" />
        <rect x="78" y="46" width="14" height="36" fill="rgba(255,255,255,0.15)" rx="1" />
        <rect x="50" y="22" width="20" height="58" fill="url(#sbl-bldg)" rx="1" />
        <rect x="50" y="22" width="10" height="58" fill="rgba(255,255,255,0.15)" rx="1" />
        <rect x="53" y="28" width="5" height="6" fill="#071422" opacity="0.8" rx="0.5" />
        <rect x="62" y="28" width="5" height="6" fill="#E9C176" opacity="0.6" rx="0.5" />
        <rect x="53" y="37" width="5" height="6" fill="#071422" opacity="0.8" rx="0.5" />
        <rect x="62" y="37" width="5" height="6" fill="#E9C176" opacity="0.5" rx="0.5" />
        <rect x="53" y="46" width="5" height="6" fill="#071422" opacity="0.8" rx="0.5" />
      </g>
      <path d="M14 100 Q35 84 58 72 Q80 58 108 46" stroke="url(#sbl-ribbon)" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M14 100 Q35 84 58 72 Q80 58 108 46" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M103 40L111 46L103 52" stroke="url(#sbl-ribbon)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 2L112 21V79Q112 122 60 138Q8 122 8 79V21Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
    </svg>
  );
}
