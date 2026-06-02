'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

export interface StatsCardProps {
  label: string;
  value: string | number;
  delta?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

type AnimatedValueMeta = {
  numericValue: number | null;
  prefix: string;
  suffix: string;
  decimals: number;
  useGrouping: boolean;
};

const ANIMATION_DURATION_MS = 900;

export function extractAnimatedValue(value: string | number): AnimatedValueMeta {
  if (typeof value === 'number') {
    return {
      numericValue: value,
      prefix: '',
      suffix: '',
      decimals: Number.isInteger(value) ? 0 : 2,
      useGrouping: Math.abs(value) >= 1000,
    };
  }

  const match = value.match(/-?\d[\d,]*\.?\d*/);
  if (!match || match.index === undefined) {
    return { numericValue: null, prefix: '', suffix: value, decimals: 0, useGrouping: false };
  }

  const numericToken = match[0];
  const numericValue = Number.parseFloat(numericToken.replace(/,/g, ''));
  if (Number.isNaN(numericValue)) {
    return { numericValue: null, prefix: '', suffix: value, decimals: 0, useGrouping: false };
  }

  const decimals = numericToken.includes('.') ? numericToken.split('.')[1].length : 0;
  return {
    numericValue,
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index + numericToken.length),
    decimals,
    useGrouping: numericToken.includes(','),
  };
}

export function formatAnimatedValue(meta: AnimatedValueMeta, amount: number): string {
  if (meta.numericValue === null) {
    return meta.suffix;
  }

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
    useGrouping: meta.useGrouping,
  }).format(amount);

  return `${meta.prefix}${formatted}${meta.suffix}`;
}

const TREND_STYLES: Record<NonNullable<StatsCardProps['trend']>, { color: string; backgroundColor: string; borderColor: string }> = {
  up: {
    color: 'var(--status-success)',
    backgroundColor: 'rgba(30, 139, 122, 0.12)',
    borderColor: 'rgba(30, 139, 122, 0.24)',
  },
  down: {
    color: 'var(--status-error)',
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderColor: 'rgba(220, 38, 38, 0.24)',
  },
  neutral: {
    color: 'var(--text-secondary)',
    backgroundColor: 'rgba(244, 240, 232, 0.08)',
    borderColor: 'rgba(244, 240, 232, 0.16)',
  },
};

export default function StatsCard({ label, value, delta, icon, trend = 'neutral' }: StatsCardProps) {
  const meta = useMemo(() => extractAnimatedValue(value), [value]);
  const [displayValue, setDisplayValue] = useState<string>(() =>
    meta.numericValue === null ? String(value) : formatAnimatedValue(meta, 0),
  );

  useEffect(() => {
    if (meta.numericValue === null) {
      setDisplayValue(String(value));
      return;
    }

    const targetValue = meta.numericValue ?? 0;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / ANIMATION_DURATION_MS);
      const current = targetValue * progress;
      setDisplayValue(formatAnimatedValue(meta, current));
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [meta, value]);

  const trendStyle = TREND_STYLES[trend];
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="rounded-2xl border p-5 shadow-sm"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-accent)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-tertiary)' }}>
            {label}
          </p>
          <p className="text-3xl font-semibold" style={{ color: 'var(--ivory)' }}>
            {displayValue}
          </p>
        </div>
        {icon ? (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: 'rgba(201, 168, 76, 0.12)', color: 'var(--gold)' }}
          >
            {icon}
          </div>
        ) : null}
      </div>

      {delta ? (
        <div
          className="mt-4 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium"
          style={{
            color: trendStyle.color,
            backgroundColor: trendStyle.backgroundColor,
            borderColor: trendStyle.borderColor,
          }}
        >
          <TrendIcon size={14} />
          <span>{delta}</span>
        </div>
      ) : null}
    </motion.div>
  );
}
