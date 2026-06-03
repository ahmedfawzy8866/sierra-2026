'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/I18nContext';

export interface LeadScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

type BadgeTone = {
  label: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
};

const SIZE_STYLES: Record<NonNullable<LeadScoreBadgeProps['size']>, { badge: string; label: string }> = {
  sm: { badge: 'px-2 py-1 text-xs min-w-[2rem]', label: 'text-[11px]' },
  md: { badge: 'px-3 py-1.5 text-sm min-w-[2.5rem]', label: 'text-xs' },
  lg: { badge: 'px-4 py-2 text-base min-w-[3rem]', label: 'text-sm' },
};

export function getLeadScoreTone(score: number, locale: 'en' | 'ar' = 'en'): BadgeTone {
  const normalizedScore = Math.max(1, Math.min(10, Math.round(score)));
  if (normalizedScore <= 4) {
    return {
      label: locale === 'ar' ? 'أولوية منخفضة' : 'Low priority',
      textColor: 'var(--status-error)',
      backgroundColor: 'rgba(220, 38, 38, 0.12)',
      borderColor: 'rgba(220, 38, 38, 0.24)',
    };
  }
  if (normalizedScore <= 7) {
    return {
      label: locale === 'ar' ? 'أولوية متوسطة' : 'Medium priority',
      textColor: 'var(--status-warning)',
      backgroundColor: 'rgba(201, 125, 61, 0.12)',
      borderColor: 'rgba(201, 125, 61, 0.24)',
    };
  }
  return {
    label: locale === 'ar' ? 'عميل ذهبي' : 'VIP lead',
    textColor: 'var(--gold)',
    backgroundColor: 'rgba(201, 168, 76, 0.14)',
    borderColor: 'rgba(201, 168, 76, 0.28)',
  };
}

export default function LeadScoreBadge({ score, showLabel = true, size = 'md' }: LeadScoreBadgeProps) {
  const { locale } = useI18n();
  const normalizedScore = Math.max(1, Math.min(10, Math.round(score)));
  const tone = getLeadScoreTone(normalizedScore, locale);
  const styles = SIZE_STYLES[size];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className={`inline-flex items-center gap-2 rounded-full border font-semibold ${styles.badge} ${locale === 'ar' ? 'font-arabic' : 'font-ui'}`}
      style={{
        color: tone.textColor,
        backgroundColor: tone.backgroundColor,
        borderColor: tone.borderColor,
      }}
      aria-label={`${tone.label}: ${normalizedScore}/10`}
    >
      <span>{normalizedScore}/10</span>
      {showLabel ? <span className={`uppercase tracking-[0.18em] ${styles.label}`}>{tone.label}</span> : null}
    </motion.span>
  );
}
