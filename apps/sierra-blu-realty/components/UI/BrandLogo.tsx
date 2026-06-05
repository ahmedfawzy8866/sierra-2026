"use client";
import React, { useState, useEffect } from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  themeOverride?: 'dark' | 'light';
  /** 'wordmark' = horizontal text logo | 'emblem' = SVG shield | 'shield' = official PNG shield mark (default) */
  variant?: 'wordmark' | 'emblem' | 'shield';
}

/**
 * BRAND LOGO — Sierra Blu Realty
 *
 * variant="wordmark" (default):
 *   Strategic Double-Panel Crop. Source image (/sierra-blu-logo.jpg) contains two
 *   logo variants side-by-side. Left 50% = dark variant, Right 50% = light variant.
 *   We clip via overflow-hidden and slide the image to reveal the correct half.
 *
 * variant="emblem":
 *   Gold shield crest (/sierra-blu-emblem.svg). Scales uniformly.
 *   Ideal for: favicons, chat widget headers, loading screens, app icons.
 */
export default function BrandLogo({
  size = 'md',
  themeOverride,
  variant = 'shield',
}: BrandLogoProps) {
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    if (themeOverride) {
      setCurrentTheme(themeOverride);
      return;
    }
    const updateTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      setCurrentTheme(theme);
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, [themeOverride]);

  // ── Wordmark sizes (horizontal banner) ──────────────────────────────────
  const wordmarkSizes = {
    sm: { width: 120, height: 48 },
    md: { width: 160, height: 64 },
    lg: { width: 300, height: 120 },
    xl: { width: 440, height: 176 },
  };

  // ── Emblem sizes (square shield) ────────────────────────────────────────
  const emblemSizes = {
    sm: { width: 40, height: 44 },
    md: { width: 56, height: 62 },
    lg: { width: 96, height: 106 },
    xl: { width: 160, height: 176 },
  };

  const isLight = currentTheme === 'light';

  // ── SHIELD VARIANT (official PNG logo — navy/gold crest) ────────────────
  if (variant === 'shield') {
    const { width, height } = emblemSizes[size];
    return (
      <img
        src="/sierra-blu-logo.png"
        alt="Sierra Blu Realty"
        draggable={false}
        width={width}
        height={height}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          objectFit: 'contain',
          userSelect: 'none',
          filter: isLight
            ? 'drop-shadow(0 1px 3px rgba(212,175,55,0.4))'
            : 'drop-shadow(0 2px 8px rgba(212,175,55,0.35))',
          transition: 'filter 0.4s ease',
        }}
      />
    );
  }

  // ── EMBLEM VARIANT (SVG) ─────────────────────────────────────────────────
  if (variant === 'emblem') {
    const { width, height } = emblemSizes[size];
    return (
      <img
        src="/sierra-blu-emblem.svg"
        alt="Sierra Blu Realty Shield"
        draggable={false}
        width={width}
        height={height}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          userSelect: 'none',
          filter: isLight
            ? 'drop-shadow(0 1px 3px rgba(212,175,55,0.4))'
            : 'drop-shadow(0 2px 8px rgba(212,175,55,0.35))',
          transition: 'filter 0.4s ease',
        }}
      />
    );
  }

  // ── WORDMARK VARIANT (default) ───────────────────────────────────────────
  const { width, height } = wordmarkSizes[size];
  return (
    <div
      className="brand-logo-container"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <img
        src="/sierra-blu-logo.jpg"
        alt="Sierra Blu Realty"
        draggable={false}
        style={{
          position: 'absolute',
          width: '200%',
          height: '100%',
          maxWidth: 'none',
          minWidth: '200%',
          left: isLight ? '-100%' : '0%',
          top: '0',
          objectFit: 'fill',
          transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </div>
  );
}
