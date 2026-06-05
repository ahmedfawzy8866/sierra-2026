'use client';

import React from 'react';
import styles from './RefinedSearchBar.module.css';

interface SearchOption {
  v: string;
  l: string;
}

interface SearchSegment {
  val: string;
  set: (val: string) => void;
  label: string;
  opts: SearchOption[];
}

interface RefinedSearchBarProps {
  segments: SearchSegment[];
  onSearch: () => void;
  searchBtnText: string;
  isAr?: boolean;
}

export default function RefinedSearchBar({ segments, onSearch, searchBtnText, isAr = false }: RefinedSearchBarProps) {
  return (
    <div className={`reveal grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-0 rounded-xl overflow-hidden mb-12 lux-glass !border-white/5 shadow-2xl ${isAr ? 'flex-row-reverse' : ''}`}>
      {segments.map((seg, i) => (
        <div key={i} className={`px-6 py-4 border-r border-white/5 ${isAr ? 'text-right' : 'text-left'}`}>
          <div className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/40 mb-1.5 font-body">{seg.label}</div>
          <select 
            value={seg.val} 
            onChange={(e) => seg.set(e.target.value)} 
            title={seg.label}
            className={styles.filterSelect}
          >
            {seg.opts.map((o) => (
              <option key={o.v} value={o.v} className={styles.filterOption}>
                {o.l}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button 
        onClick={onSearch} 
        className="lux-button-primary !rounded-none !px-8 border-none !text-[11px] font-bold tracking-widest"
      >
        {searchBtnText}
      </button>
    </div>
  );
}
