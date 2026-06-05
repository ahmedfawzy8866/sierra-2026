"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface KPIProgressBarProps {
  label: string;
  current: number;
  target: number;
  color?: string;
  icon?: React.ReactNode;
}

export default function KPIProgressBar({ 
  label, 
  current, 
  target, 
  color = 'var(--gold)',
  icon 
}: KPIProgressBarProps) {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  
  return (
    <div className="kpi-progress-container glass-panel" style={{ padding: '16px', borderRadius: '16px', marginBottom: '12px' }}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="opacity-70">{icon}</span>}
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{label}</span>
        </div>
        <span className="text-[10px] font-bold" style={{ color }}>{current} / {target}</span>
      </div>
      
      <div className="h-1.5 w-full bg-navy-dark rounded-full overflow-hidden border border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ 
            background: color,
            boxShadow: `0 0 10px ${color}44`
          }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-[9px] opacity-40">{percentage}% of daily goal</span>
        {percentage >= 100 && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] font-bold text-success"
          >
            TARGET REACHED
          </motion.span>
        )}
      </div>
    </div>
  );
}
