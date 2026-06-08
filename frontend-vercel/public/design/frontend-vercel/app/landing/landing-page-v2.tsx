"use client";
/**
 * SIERRA ESTATES REALTY — PUBLIC LANDING PAGE V2
 * ─────────────────────────────────────────────────────────────────
 * Route:  /landing   (customer-facing, no login required)
 * Portal: /          (advisor dashboard, login required)
 *
 * Brand colors from official identity sheet:
 *   Primary Navy  #0A1628  Secondary Navy #10233F  Soft Navy #173456
 *   Premium Gold  #C9A84C  Gold Highlight #D8BB6A
 *   Neutral BG    #F7F4EE  Dark Text      #1C2430
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { collection, addDoc, getDocs, query, limit, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/models/schema";
import { useI18n } from "@/lib/I18nContext";

// ─── Brand tokens ─────────────────────────────────────────────────
const B = {
  navy1:    "#0A1628",
  navy2:    "#10233F",
  navy3:    "#173456",
  gold:     "#C9A84C",
  goldLt:   "#D8BB6A",
  goldFade: "rgba(201,168,76,0.15)",
  bg:       "#F7F4EE",
  bgCard:   "#FFFFFF",
  text:     "#1C2430",
  textMid:  "rgba(28,36,48,0.6)",
  textDim:  "rgba(28,36,48,0.38)",
  border:   "rgba(28,36,48,0.09)",
  // dark mode
  dkBg:     "#0A1628",
  dkCard:   "#10233F",
  dkText:   "#F4F1EA",
  dkBorder: "rgba(201,168,76,0.12)",
};

// ─── Shield Logo SVG (matches the brand shield exactly) ───────────
const ShieldLogo = ({ size = 40, dark = false }: { size?: number; dark?: boolean }) => (
  <svg width={size} height={size * 1.12} viewBox="0 0 80 90" fill="none">
    <defs>
      <linearGradient id="gld" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#D8BB6A" />
        <stop offset="50%" stopColor="#C9A84C" />
        <stop offset="100%" stopColor="#9E7A2A" />
      </linearGradient>
    </defs>
    {/* Shield body */}
    <path
      d="M40 3 L74 15 V45 Q74 72 40 85 Q6 72 6 45 V15 Z"
      fill={dark ? "#10233F" : "#0A1628"}
      stroke="url(#gld)"
      strokeWidth="2.5"
    />
    {/* Circuit pattern subtle */}
    <path d="M20 30 h8 v8 h8 v-8 h8" stroke="#C9A84C" strokeWidth="0.6" opacity="0.25" fill="none"/>
    {/* Buildings - 3 rectangles */}
    <rect x="28" y="22" width="8" height="30" rx="0.5" fill="#C9A84C" opacity="0.75"/>
    <rect x="37" y="16" width="10" height="36" rx="0.5" fill="#D8BB6A" opacity="0.9"/>
    <rect x="48" y="25" width="8" height="27" rx="0.5" fill="#C9A84C" opacity="0.75"/>
    {/* Roof / house */}
    <path d="M24 45 L40 35 L56 45" stroke="#C9A84C" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* Arrow sweep */}
    <path d="M18 55 Q35 47 58 38 L54 34 M58 38 L57 44"
      stroke="url(#gld)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Window dots */}
    <rect x="31" y="35" width="2" height="2" fill="#FFD700" opacity="0.8"/>
    <rect x="40" y="29" width="2" height="2" fill="#FFD700" opacity="0.9"/>
  </svg>
);

// ─── Compound map data ─────────────────────────────────────────────
const COMPOUNDS = [
  { name: "Mivida",      ar: "ميفيدا",       top: "28%", left: "22%", units: 47 },
  { name: "District 5",  ar: "ديستريكت 5",    top: "42%", left: "56%", units: 33 },
  { name: "Villette",    ar: "فيليت",         top: "60%", left: "30%", units: 29 },
  { name: "IL Bosco",    ar: "آيل بوسكو",     top: "65%", left: "68%", units: 24 },
  { name: "Palm Hills",  ar: "بالم هيلز",     top: "76%", left: "42%", units: 18 },
];

const FALLBACK_LISTINGS = [
  { id: "fallback-1", title: "The Glass Pavilion",    compound: "Mivida",     beds: 3, area: 245, price: 12500000, type: "Villa" },
  { id: "fallback-2", title: "The Meridian",          compound: "District 5", beds: 4, area: 310, price: 18200000, type: "Penthouse" },
  { id: "fallback-3", title: "Golden Estate",         compound: "Palm Hills",  beds: 5, area: 520, price: 24000000, type: "Villa" },
];

// ─── CSS ───────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&family=Cairo:wght@300;400;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy1: #0A1628;
  --navy2: #10233F;
  --navy3: #173456;
  --gold:  #C9A84C;
  --goldL: #D8BB6A;
  --bg:    #F7F4EE;
  --text:  #1C2430;
  --mid:   rgba(28,36,48,0.6);
  --dim:   rgba(28,36,48,0.38);
  --bdr:   rgba(28,36,48,0.09);
  --ease:  cubic-bezier(0.16,1,0.3,1);
  --ff-serif: 'Cormorant Garamond', 'Playfair Display', serif;
  --ff-body:  'Inter', sans-serif;
  --ff-ar:    'Cairo', sans-serif;
}

[data-dark="true"] {
  --bg:   #0A1628;
  --text: #F4F1EA;
  --mid:  rgba(244,241,234,0.6);
  --dim:  rgba(244,241,234,0.35);
  --bdr:  rgba(201,168,76,0.12);
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: var(--ff-body); -webkit-font-smoothing: antialiased; transition: background 0.4s var(--ease), color 0.4s var(--ease); }
[dir="rtl"] body { font-family: var(--ff-ar); }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

/* ── Reveal animation ── */
.reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.9s var(--ease), transform 0.9s var(--ease); }
.reveal.in { opacity: 1; transform: none; }

/* ── NAV ── */
.sb-nav {
  position: fixed; inset: 0 0 auto; z-index: 100;
  padding: 20px 48px;
  display: flex; align-items: center; justify-content: space-between;
  transition: all 0.5s var(--ease);
}
.sb-nav.scrolled {
  background: rgba(247,244,238,0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 12px 48px;
  border-bottom: 1px solid var(--bdr);
  box-shadow: 0 2px 24px rgba(10,22,40,0.06);
}
[data-dark="true"] .sb-nav.scrolled { background: rgba(10,22,40,0.94); }
.sb-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.sb-logo-text { display: flex; flex-direction: column; line-height: 1.1; }
.sb-logo-name { font-family: var(--ff-serif); font-size: 17px; font-weight: 600; color: var(--text); letter-spacing: 0.02em; }
.sb-logo-sub { font-size: 8px; letter-spacing: 0.35em; text-transform: uppercase; color: var(--gold); font-weight: 600; }
.sb-nav-links { display: flex; gap: 32px; align-items: center; }
.sb-nav-link { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--mid); text-decoration: none; transition: color 0.2s; }
.sb-nav-link:hover { color: var(--gold); }
.sb-nav-right { display: flex; align-items: center; gap: 12px; }
.sb-toggle-btn { background: none; border: 1px solid var(--bdr); color: var(--mid); border-radius: 6px; padding: 6px 10px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; }
.sb-toggle-btn:hover { border-color: var(--gold); color: var(--gold); }
.sb-portal-btn {
  background: var(--navy1); color: #F4F1EA;
  border: none; border-radius: 8px;
  padding: 10px 20px; font-size: 11px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  cursor: pointer; text-decoration: none;
  display: inline-flex; align-items: center; gap: 8px;
  transition: all 0.3s var(--ease);
}
.sb-portal-btn:hover { background: var(--navy2); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(10,22,40,0.25); }
[data-dark="true"] .sb-portal-btn { background: var(--gold); color: var(--navy1); }
[data-dark="true"] .sb-portal-btn:hover { background: var(--goldL); }

/* ── HERO ── */
.sb-hero {
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 0;
  padding: 120px 48px 80px;
  position: relative;
  overflow: hidden;
}
.sb-hero::before {
  content: '';
  position: absolute;
  top: -100px; right: -200px;
  width: 700px; height: 700px;
  background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 65%);
  border-radius: 50%;
  pointer-events: none;
}
.sb-hero-left { position: relative; z-index: 2; }
.sb-hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 14px; border-radius: 20px;
  border: 1px solid rgba(201,168,76,0.35);
  background: rgba(201,168,76,0.08);
  font-size: 9px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 28px;
}
.sb-hero-badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: pulse-dot 2s infinite; }
@keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }
.sb-h1 {
  font-family: var(--ff-serif);
  font-size: clamp(52px, 5.5vw, 80px);
  font-weight: 400; line-height: 1.0;
  letter-spacing: -0.02em; margin-bottom: 24px;
  color: var(--text);
}
.sb-h1 em { color: var(--gold); font-style: normal; }
.sb-hero-sub { font-size: 16px; line-height: 1.7; color: var(--mid); max-width: 460px; margin-bottom: 40px; font-weight: 300; }
.sb-hero-btns { display: flex; gap: 14px; margin-bottom: 56px; flex-wrap: wrap; }
.sb-btn-primary {
  background: var(--navy1); color: #F4F1EA;
  border: none; border-radius: 10px; padding: 16px 28px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
  cursor: pointer; display: inline-flex; align-items: center; gap: 10px;
  transition: all 0.3s var(--ease);
}
.sb-btn-primary:hover { background: var(--navy2); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(10,22,40,0.2); }
[data-dark="true"] .sb-btn-primary { background: var(--gold); color: var(--navy1); }
.sb-btn-ghost {
  background: transparent; color: var(--text);
  border: 1px solid var(--bdr); border-radius: 10px; padding: 16px 28px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
  cursor: pointer; display: inline-flex; align-items: center; gap: 10px;
  transition: all 0.3s var(--ease);
}
.sb-btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
.sb-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 0; border-top: 1px solid var(--bdr); padding-top: 32px; }
.sb-stat { padding-right: 24px; }
.sb-stat:not(:last-child) { border-right: 1px solid var(--bdr); margin-right: 24px; }
.sb-stat-n { font-family: var(--ff-serif); font-size: 36px; font-weight: 400; color: var(--gold); }
.sb-stat-l { font-size: 9px; text-transform: uppercase; letter-spacing: 0.25em; color: var(--dim); margin-top: 4px; font-weight: 600; }
.sb-hero-right { position: relative; display: flex; align-items: center; justify-content: center; }
.sb-hero-img-wrap {
  width: 100%; aspect-ratio: 4/5;
  border-radius: 24px; overflow: hidden;
  position: relative; background: var(--navy2);
}
.sb-hero-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: transform 8s ease; }
.sb-hero-img:hover { transform: scale(1.04); }
.sb-hero-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,22,40,0.85) 0%, transparent 55%); }
.sb-hero-img-tag { position: absolute; bottom: 24px; left: 24px; right: 24px; }
.sb-hero-img-tag-dot { font-size: 9px; color: var(--gold); font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 6px; }
.sb-hero-img-tag-name { font-family: var(--ff-serif); font-size: 24px; color: #F4F1EA; }
.sb-scroll-hint { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--dim); }
.sb-scroll-hint span { font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; font-weight: 600; }
.sb-scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, var(--gold), transparent); animation: scroll-line 2s ease-in-out infinite; }
@keyframes scroll-line { 0%{opacity:1} 50%{opacity:0.3} 100%{opacity:1} }

/* ── TRUST BAR ── */
.sb-trust { border-top: 1px solid var(--bdr); border-bottom: 1px solid var(--bdr); padding: 22px 48px; display: flex; align-items: center; gap: 40px; background: var(--bg); }
.sb-trust-label { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--dim); font-weight: 700; white-space: nowrap; }
.sb-trust-brands { display: flex; gap: 40px; flex-wrap: wrap; align-items: center; }
.sb-trust-brand { font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--dim); font-family: var(--ff-serif); transition: color 0.2s; }
.sb-trust-brand:hover { color: var(--gold); }
.sb-pf-badge { margin-left: auto; display: inline-flex; align-items: center; gap: 7px; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25); border-radius: 6px; padding: 7px 14px; font-size: 9px; color: var(--gold); font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; white-space: nowrap; }
.sb-pf-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e; }

/* ── SECTION ── */
.sb-section { padding: 100px 48px; }
.sb-section-label { font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: var(--gold); font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
.sb-section-label::before { content: ''; width: 28px; height: 1px; background: var(--gold); }
.sb-h2 { font-family: var(--ff-serif); font-size: clamp(36px, 4vw, 58px); font-weight: 400; line-height: 1.05; letter-spacing: -0.01em; color: var(--text); margin-bottom: 16px; }
.sb-h2 em { color: var(--gold); font-style: normal; }
.sb-section-sub { font-size: 16px; line-height: 1.65; color: var(--mid); max-width: 520px; font-weight: 300; }
.sb-section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 52px; gap: 32px; flex-wrap: wrap; }

/* ── LISTING CARDS ── */
.sb-listings { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
.sb-card {
  border-radius: 16px; overflow: hidden;
  background: var(--bgCard, #fff);
  border: 1px solid var(--bdr);
  cursor: pointer; transition: transform 0.5s var(--ease), box-shadow 0.5s var(--ease), border-color 0.3s;
}
[data-dark="true"] .sb-card { background: var(--navy2); }
.sb-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px rgba(10,22,40,0.12); border-color: rgba(201,168,76,0.3); }
.sb-card-img { position: relative; height: 280px; overflow: hidden; background: var(--navy3); }
.sb-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--ease); }
.sb-card:hover .sb-card-img img { transform: scale(1.06); }
.sb-card-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,22,40,0.7) 0%, transparent 55%); }
.sb-card-badge { position: absolute; top: 14px; left: 14px; padding: 4px 10px; background: rgba(10,22,40,0.85); border: 1px solid var(--gold); border-radius: 4px; font-size: 8px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold); }
.sb-card-pf { position: absolute; top: 14px; right: 14px; width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e; }
.sb-card-body { padding: 20px; }
.sb-card-compound { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; font-weight: 600; }
.sb-card-name { font-family: var(--ff-serif); font-size: 20px; font-weight: 400; color: var(--text); margin-bottom: 4px; line-height: 1.2; }
.sb-card-type { font-size: 11px; color: var(--dim); margin-bottom: 14px; font-style: italic; }
.sb-card-price { font-family: var(--ff-serif); font-size: 22px; font-weight: 600; color: var(--gold); margin-bottom: 14px; }
.sb-card-specs { display: flex; gap: 16px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--bdr); }
.sb-card-spec { font-size: 11px; color: var(--mid); display: flex; align-items: center; gap: 5px; }
.sb-card-cta { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text); display: flex; align-items: center; gap: 6px; transition: gap 0.2s, color 0.2s; }
.sb-card:hover .sb-card-cta { gap: 12px; color: var(--gold); }

/* ── MAP ── */
.sb-map-wrap { position: relative; height: 440px; border-radius: 16px; overflow: hidden; background: var(--navy2); border: 1px solid var(--bdr); }
.sb-map-bg { position: absolute; inset: 0; }
.sb-map-grid { position: absolute; inset: 0; }
.sb-map-label { position: absolute; top: 20px; left: 20px; padding: 8px 14px; background: rgba(10,22,40,0.85); backdrop-filter: blur(10px); border-radius: 6px; font-size: 10px; color: #F4F1EA; font-weight: 600; border: 1px solid rgba(201,168,76,0.2); }
.sb-map-pin { position: absolute; transform: translate(-50%,-50%); }
.sb-map-pin-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 16px rgba(201,168,76,0.6); }
.sb-map-pin-ring { position: absolute; top: -8px; left: -8px; width: 26px; height: 26px; border-radius: 50%; border: 1px solid rgba(201,168,76,0.35); animation: pin-ring 3s ease-in-out infinite; }
@keyframes pin-ring { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.4);opacity:0} }
.sb-map-pin-label { position: absolute; left: 16px; top: -10px; white-space: nowrap; background: rgba(10,22,40,0.9); padding: 5px 10px; border-radius: 4px; font-size: 10px; color: #F4F1EA; font-weight: 600; border: 1px solid rgba(201,168,76,0.2); }
.sb-map-pin-units { font-size: 8px; color: var(--gold); margin-top: 1px; }
.sb-map-total { position: absolute; bottom: 18px; right: 18px; padding: 8px 14px; background: rgba(10,22,40,0.85); border-radius: 6px; font-size: 10px; color: rgba(244,241,234,0.6); border: 1px solid rgba(201,168,76,0.12); }

/* ── SIERRA AI ── */
.sb-ai-section { background: var(--navy1); padding: 100px 48px; }
.sb-ai-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.sb-ai-bot { width: 56px; height: 56px; border-radius: 16px; background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.3); display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 24px; }
.sb-ai-h2 { font-family: var(--ff-serif); font-size: clamp(36px,4vw,56px); font-weight: 400; color: #F4F1EA; line-height: 1.05; margin-bottom: 12px; }
.sb-ai-h2 em { color: var(--gold); font-style: normal; }
.sb-ai-tagline { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 20px; font-weight: 600; }
.sb-ai-sub { font-size: 16px; line-height: 1.7; color: rgba(244,241,234,0.55); max-width: 440px; margin-bottom: 36px; font-weight: 300; }
.sb-ai-btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 28px; background: var(--gold); color: var(--navy1); border: none; border-radius: 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.3s var(--ease); text-decoration: none; }
.sb-ai-btn:hover { background: var(--goldL); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(201,168,76,0.3); }
.sb-ai-right { background: rgba(255,255,255,0.03); border: 1px solid rgba(201,168,76,0.12); border-radius: 20px; padding: 32px; }
.sb-ai-chat { display: flex; flex-direction: column; gap: 14px; }
.sb-chat-bubble { padding: 14px 18px; border-radius: 12px; font-size: 14px; line-height: 1.5; max-width: 85%; }
.sb-chat-bot { background: rgba(201,168,76,0.12); border: 1px solid rgba(201,168,76,0.2); color: rgba(244,241,234,0.85); align-self: flex-start; border-radius: 4px 12px 12px 12px; }
.sb-chat-user { background: rgba(255,255,255,0.06); color: rgba(244,241,234,0.6); align-self: flex-end; border-radius: 12px 4px 12px 12px; font-size: 13px; }
.sb-chat-name { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; font-weight: 700; }

/* ── CTA FORM ── */
.sb-cta-section { padding: 100px 48px; }
.sb-cta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.sb-form { background: var(--navy1); border-radius: 20px; padding: 48px; display: flex; flex-direction: column; gap: 16px; }
[data-dark="true"] .sb-form { background: var(--navy2); border: 1px solid rgba(201,168,76,0.15); }
.sb-form-title { font-family: var(--ff-serif); font-size: 26px; font-weight: 400; color: #F4F1EA; margin-bottom: 8px; }
.sb-form-sub { font-size: 13px; color: rgba(244,241,234,0.5); margin-bottom: 8px; line-height: 1.5; }
.sb-input { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 15px 18px; font-size: 14px; color: #F4F1EA; outline: none; font-family: inherit; transition: border-color 0.2s; }
.sb-input::placeholder { color: rgba(244,241,234,0.3); }
.sb-input:focus { border-color: var(--gold); background: rgba(255,255,255,0.08); }
.sb-form-submit { background: var(--gold); color: var(--navy1); border: none; border-radius: 10px; padding: 16px; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.3s var(--ease); }
.sb-form-submit:hover { background: var(--goldL); transform: translateY(-1px); }
.sb-form-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.sb-form-error { font-size: 11px; color: #ff8080; }
.sb-form-success { text-align: center; padding: 32px; }
.sb-form-success-icon { font-size: 40px; margin-bottom: 12px; }
.sb-form-success-text { font-family: var(--ff-serif); font-size: 22px; color: #F4F1EA; margin-bottom: 8px; }
.sb-form-success-sub { font-size: 13px; color: rgba(244,241,234,0.5); }

/* ── FOOTER ── */
.sb-footer { border-top: 1px solid var(--bdr); padding: 60px 48px 32px; }
.sb-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
.sb-footer-brand-name { font-family: var(--ff-serif); font-size: 18px; color: var(--text); margin-top: 12px; font-weight: 400; }
.sb-footer-brand-sub { font-size: 8px; letter-spacing: 0.35em; text-transform: uppercase; color: var(--gold); margin-top: 3px; font-weight: 600; }
.sb-footer-tagline { font-size: 13px; color: var(--dim); margin-top: 14px; line-height: 1.6; font-style: italic; font-family: var(--ff-serif); max-width: 280px; }
.sb-footer-col-title { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--dim); font-weight: 700; margin-bottom: 20px; }
.sb-footer-links { display: flex; flex-direction: column; gap: 10px; }
.sb-footer-link { font-size: 13px; color: var(--mid); text-decoration: none; font-weight: 400; transition: color 0.2s; }
.sb-footer-link:hover { color: var(--gold); }
.sb-footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 28px; border-top: 1px solid var(--bdr); flex-wrap: wrap; gap: 12px; }
.sb-footer-copy { font-size: 10px; color: var(--dim); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; }

/* ── MOBILE ── */
@media (max-width: 900px) {
  .sb-nav { padding: 16px 20px; }
  .sb-nav.scrolled { padding: 12px 20px; }
  .sb-nav-links { display: none; }
  .sb-hero { grid-template-columns: 1fr; padding: 100px 20px 60px; gap: 40px; }
  .sb-hero-right { display: none; }
  .sb-h1 { font-size: 44px; }
  .sb-trust { padding: 18px 20px; flex-wrap: wrap; gap: 16px; }
  .sb-trust-brands { gap: 20px; }
  .sb-pf-badge { margin-left: 0; }
  .sb-section { padding: 64px 20px; }
  .sb-section-header { flex-direction: column; align-items: flex-start; }
  .sb-listings { grid-template-columns: 1fr; gap: 16px; }
  .sb-ai-grid { grid-template-columns: 1fr; gap: 40px; }
  .sb-ai-section { padding: 64px 20px; }
  .sb-cta-grid { grid-template-columns: 1fr; gap: 40px; }
  .sb-cta-section { padding: 64px 20px; }
  .sb-footer { padding: 48px 20px 24px; }
  .sb-footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
  .sb-footer-bottom { flex-direction: column; align-items: flex-start; }
  .sb-stats { gap: 0; }
  .sb-stat { padding-right: 12px; margin-right: 12px; }
}

/* ── NO SCROLLBAR ── */
.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }

/* ── Utility extensions ── */
.sb-section-no-top { padding-top: 0 !important; }
.sb-section-sub-mt { margin-top: 16px; }
.sb-footer-logo-row { display: flex; align-items: center; gap: 10px; }
.sb-footer-bottom-row { display: flex; align-items: center; gap: 16px; }
.sb-map-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
`;

// ─── Component ────────────────────────────────────────────────────
function LandingContent() {
  const { locale, setLocale } = useI18n();
  const ar = locale === "ar";

  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [listings, setListings] = useState<any[]>(FALLBACK_LISTINGS);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [formState, setFormState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [formError, setFormError] = useState("");

  // scroll listener
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Intersection Observer for .reveal elements
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Firebase listings
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, COLLECTIONS.units), limit(3)));
        if (!snap.empty) {
          setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      } catch { /* use fallback */ }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (formData.name.trim().length < 2) { setFormError(ar ? "ادخل اسمك الكامل" : "Please enter your full name"); return; }
    if (!formData.phone.match(/^(\+20|0)?1[0-9]{9}$/)) { setFormError(ar ? "رقم هاتف مصري غير صالح" : "Please enter a valid Egyptian phone number"); return; }
    setFormState("loading");
    try {
      await addDoc(collection(db, "leads"), { ...formData, source: "landing_v2", locale, createdAt: serverTimestamp() });
      setFormState("done");
    } catch { setFormState("error"); setFormError(ar ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong. Please try again."); }
  };

  const formatPrice = (p: number) =>
    ar ? `${(p / 1000000).toFixed(1)} مليون جنيه` : `EGP ${p.toLocaleString()}`;

  return (
    <div data-dark={dark} dir={ar ? "rtl" : "ltr"} className="min-h-dvh" style={{ background: dark ? B.navy1 : B.bg, color: dark ? B.dkText : B.text }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── NAV ── */}
      <nav className={`sb-nav ${scrolled ? "scrolled" : ""}`}>
        <a href="#" className="sb-logo">
          <ShieldLogo size={36} dark={dark} />
          <div className="sb-logo-text">
            <span className="sb-logo-name">Sierra Estates</span>
            <span className="sb-logo-sub">Beyond Brokerage</span>
          </div>
        </a>

        <div className="sb-nav-links">
          {[
            { en: "Properties", ar: "العقارات", href: "#listings" },
            { en: "Intelligence", ar: "الذكاء", href: "#intel" },
            { en: "Sierra AI", ar: "سييرا AI", href: "#sierra" },
            { en: "Contact", ar: "تواصل", href: "#contact" },
          ].map((l) => (
            <a key={l.en} href={l.href} className="sb-nav-link">{ar ? l.ar : l.en}</a>
          ))}
        </div>

        <div className="sb-nav-right">
          <button className="sb-toggle-btn" onClick={() => setLocale(ar ? "en" : "ar")}>{ar ? "EN" : "AR"}</button>
          <button className="sb-toggle-btn" onClick={() => setDark(!dark)}>{dark ? "☀" : "◑"}</button>
          <Link href="/" className="sb-portal-btn">
            {ar ? "بوابة المستشارين" : "Advisor Portal"} →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="sb-hero">
        <div className="sb-hero-left">
          <div className="sb-hero-badge reveal">
            {ar ? "أكبر محفظة عقارية في القاهرة الجديدة" : "New Cairo's Premier AI Real Estate Platform"}
          </div>
          <h1 className="sb-h1 reveal">
            {ar ? (<>قرارات أذكى.<br /><em>مدعومة بالذكاء</em><br /><em>الاصطناعي.</em></>) : (<>Smarter<br />Decisions.<br /><em>AI-Driven.</em></>)}
          </h1>
          <p className="sb-hero-sub reveal">
            {ar
              ? "سييرا بلو — أبعد من مجرد وساطة. نجمع بين أفضل العقارات في التجمع الخامس مع ذكاء اصطناعي يجد لك ما يناسبك بدقة."
              : "Sierra Estates Realty — curating the finest properties across New Cairo's top compounds, powered by AI that understands exactly what you're looking for."}
          </p>
          <div className="sb-hero-btns reveal">
            <button className="sb-btn-primary" onClick={() => document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" })}>
              {ar ? "استكشف العقارات" : "Explore Properties"} →
            </button>
            <button className="sb-btn-ghost" onClick={() => document.getElementById("sierra")?.scrollIntoView({ behavior: "smooth" })}>
              🤖 {ar ? "تحدث مع سييرا" : "Meet Sierra AI"}
            </button>
          </div>
          <div className="sb-stats reveal">
            {[
              { n: "1.2K+", l: ar ? "وحدة متاحة" : "Live Assets" },
              { n: "98%",   l: ar ? "دقة المطابقة" : "Match Score" },
              { n: "5+",    l: ar ? "كمباوند" : "Compounds" },
            ].map((s, i) => (
              <div key={i} className="sb-stat">
                <div className="sb-stat-n">{s.n}</div>
                <div className="sb-stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="sb-hero-right reveal">
          <div className="sb-hero-img-wrap">
            <img
              className="sb-hero-img"
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=85"
              alt="Luxury villa New Cairo"
            />
            <div className="sb-hero-img-overlay" />
            <div className="sb-hero-img-tag">
              <div className="sb-hero-img-tag-dot">● {ar ? "معيار الرفاهية الهادئة" : "Quiet Luxury Standard"}</div>
              <div className="sb-hero-img-tag-name">{ar ? "التجمع الخامس" : "The Fifth Settlement"}</div>
            </div>
          </div>
        </div>

        <div className="sb-scroll-hint">
          <div className="sb-scroll-line" />
          <span>{ar ? "مرر" : "Scroll"}</span>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="sb-trust">
        <span className="sb-trust-label">{ar ? "موثوق في" : "Featured in"}</span>
        <div className="sb-trust-brands">
          {["Emaar", "SODIC", "Mountain View", "Palm Hills", "ZED East"].map((b) => (
            <span key={b} className="sb-trust-brand">{b}</span>
          ))}
        </div>
        <div className="sb-pf-badge">
          <span className="sb-pf-dot" />
          Property Finder · Live
        </div>
      </div>

      {/* ── LISTINGS ── */}
      <section id="listings" className="sb-section">
        <div className="sb-section-header">
          <div>
            <div className="sb-section-label reveal">{ar ? "مختارة بعناية" : "Curated Selection"}</div>
            <h2 className="sb-h2 reveal">{ar ? (<>عقارات <em>مميزة</em></>) : (<>Featured <em>Assets</em></>)}</h2>
            <p className="sb-section-sub reveal">{ar ? "أفضل الوحدات في كمباوندات التجمع الخامس — متزامنة مع بروبرتي فايندر." : "Hand-picked from New Cairo's most coveted compounds — synced live with Property Finder."}</p>
          </div>
          <Link href="/listings" className="sb-btn-ghost reveal" style={{ alignSelf: "flex-end", textDecoration: "none" }}>
            {ar ? "كل العقارات" : "View All"} →
          </Link>
        </div>

        <div className="sb-listings">
          {listings.map((l, i) => (
            <div key={l.id || i} className="sb-card reveal" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="sb-card-img">
                <img
                  src={l.featuredImage || l.images?.[0] || `https://images.unsplash.com/photo-${["1600585154340-be6161a56a0c","1613490493576-7fde63acd811","1600596542815-ffad4c1539a9"][i % 3]}?w=600&q=80`}
                  alt={l.title}
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80`; }}
                />
                <div className="sb-card-img-overlay" />
                <div className="sb-card-badge">{l.dealStatus || (i === 0 ? "Hidden Gem" : "Featured")}</div>
                <div className="sb-card-pf" title="Synced to Property Finder" />
              </div>
              <div className="sb-card-body">
                <div className="sb-card-compound">{l.compound || "New Cairo"}</div>
                <div className="sb-card-name">{l.title || `Luxury Unit ${i + 1}`}</div>
                <div className="sb-card-type">{l.type || "Villa"}</div>
                <div className="sb-card-price">{formatPrice(l.price || 12000000)}</div>
                <div className="sb-card-specs">
                  <span className="sb-card-spec">🛏 {l.bedrooms || l.beds || 3} {ar ? "غرف" : "BR"}</span>
                  <span className="sb-card-spec">🚿 {l.bathrooms || 3} {ar ? "حمامات" : "BA"}</span>
                  <span className="sb-card-spec">📐 {l.area || l.sqm || 245} m²</span>
                </div>
                <div className="sb-card-cta">{ar ? "عرض التفاصيل" : "View Details"} →</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTELLIGENCE MAP ── */}
      <section id="intel" className="sb-section sb-section-no-top">
        <div className="sb-section-header">
          <div>
            <div className="sb-section-label reveal">{ar ? "بيانات حية" : "Live Intelligence"}</div>
            <h2 className="sb-h2 reveal">{ar ? (<>خريطة <em>التجمع الخامس</em></>) : (<>New Cairo <em>Coverage Map</em></>)}</h2>
          </div>
        </div>

        <div className="sb-map-wrap reveal">
          {/* Stylised abstract map */}
          <svg className="sb-map-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid */}
            {[...Array(10)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 11 + 5} x2="100" y2={i * 11 + 5 + Math.sin(i) * 1.5} stroke={B.gold} strokeOpacity="0.07" strokeWidth="0.2"/>
            ))}
            {[...Array(12)].map((_, i) => (
              <line key={`v${i}`} x1={i * 9 + 3} y1="0" x2={i * 9 + 3 + Math.cos(i) * 1.5} y2="100" stroke={B.gold} strokeOpacity="0.07" strokeWidth="0.2"/>
            ))}
            {/* Roads */}
            <path d="M0 50 Q25 46 50 54 T100 48" stroke={B.gold} strokeOpacity="0.2" strokeWidth="0.4" fill="none"/>
            <path d="M35 0 Q40 40 50 60 T60 100" stroke={B.gold} strokeOpacity="0.18" strokeWidth="0.35" fill="none"/>
          </svg>
          <div className="sb-map-label">🇪🇬 {ar ? "التجمع الخامس — القاهرة الجديدة" : "New Cairo · 5th Settlement"}</div>
          {COMPOUNDS.map((c, i) => (
            <div key={c.name} className="sb-map-pin" style={{ top: c.top, left: c.left, animationDelay: `${i * 0.4}s` }}>
              <div className="sb-map-pin-ring" style={{ animationDelay: `${i * 0.5}s` }} />
              <div className="sb-map-pin-dot" />
              <div className="sb-map-pin-label">
                {ar ? c.ar : c.name}
                <div className="sb-map-pin-units">{c.units} {ar ? "وحدة" : "units"}</div>
              </div>
            </div>
          ))}
          <div className="sb-map-total">5 {ar ? "كمباوند · 151 وحدة متاحة" : "Compounds · 151 Active Listings"}</div>
        </div>
      </section>

      {/* ── SIERRA AI ── */}
      <section id="sierra" className="sb-ai-section">
        <div className="sb-ai-grid">
          <div className="sb-ai-left">
            <div className="sb-ai-bot">🤖</div>
            <div className="sb-ai-tagline reveal">
              {ar ? "أول مستشار عقاري ذكاء اصطناعي رسمي في مصر" : "First Official AI Real Estate Consultant in Egypt"}
            </div>
            <h2 className="sb-ai-h2 reveal">
              {ar ? (<>مرحباً بك في<br /><em>سييرا</em></>) : (<>Meet<br /><em>Sierra</em></>)}
            </h2>
            <p className="sb-ai-sub reveal">
              {ar
                ? "سييرا مستشارتك الذكية على تيليجرام. تفهم احتياجاتك، تحلل السوق، وتجيبك بخيارات مخصصة لك في ثوان."
                : "Sierra is your AI advisor on Telegram. She understands your needs, analyzes the market, and delivers personalized recommendations in seconds."}
            </p>
            <a href="https://t.me/SierraBluBot" target="_blank" rel="noopener noreferrer" className="sb-ai-btn reveal">
              📲 {ar ? "ابدأ مع سييرا على تيليجرام" : "Start with Sierra on Telegram"}
            </a>
          </div>
          <div className="sb-ai-right reveal">
            <div className="sb-ai-chat">
              <div>
                <div className="sb-chat-name">Sierra · سييرا 🤖</div>
                <div className="sb-chat-bubble sb-chat-bot">
                  {ar ? "أهلاً! أنا سييرا 👋\nمساعدتك الذكية في سييرا بلو. حضرتك عايز/ة إيه؟" : "Hello! I'm Sierra 👋\nYour AI real estate advisor at Sierra Estates. What are you looking for?"}
                </div>
              </div>
              <div className="sb-chat-bubble sb-chat-user">{ar ? "عايز فيلا في ميفيدا، ٣ غرف، حوالي ١٥ مليون" : "Looking for a 3BR villa in Mivida, around 15M EGP"}</div>
              <div>
                <div className="sb-chat-name">Sierra · سييرا 🤖</div>
                <div className="sb-chat-bubble sb-chat-bot">
                  {ar ? "ممتاز! لقيتلك ٣ وحدات مناسبة في ميفيدا بمستوى مطابقة ٩٦٪. هبعتلك التفاصيل دلوقتي... ✨" : "Great! I found 3 matching villas in Mivida with 96% match score. Sending details now... ✨"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FORM ── */}
      <section id="contact" className="sb-cta-section">
        <div className="sb-cta-grid">
          <div>
            <div className="sb-section-label reveal">{ar ? "ابدأ رحلتك" : "Begin Your Journey"}</div>
            <h2 className="sb-h2 reveal">{ar ? (<>جد مكانك<br />في <em>القاهرة الجديدة</em></>) : (<>Find Your Place<br />in <em>New Cairo.</em></>)}</h2>
            <p className="sb-section-sub reveal sb-section-sub-mt">
              {ar ? "دع الذكاء الاصطناعي يطابقك مع منزلك المثالي. تواصل مع مستشارينا الآن." : "Let our AI match you with your perfect home. Our advisors respond within 2 hours."}
            </p>
          </div>

          <div className="sb-form reveal">
            {formState === "done" ? (
              <div className="sb-form-success">
                <div className="sb-form-success-icon">✅</div>
                <div className="sb-form-success-text">{ar ? "تم الاستلام!" : "Received!"}</div>
                <div className="sb-form-success-sub">{ar ? "سنتواصل معك خلال ساعتين." : "We'll be in touch within 2 hours."}</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="sb-form-title">{ar ? "احجز جلسة مجانية" : "Book a Free Session"}</div>
                <div className="sb-form-sub">{ar ? "لا توجد التزامات — فقط نتائج." : "No commitment — just results."}</div>
                <input className="sb-input" placeholder={ar ? "الاسم الكامل" : "Full Name"} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <input className="sb-input" placeholder={ar ? "رقم الهاتف (01XXXXXXXXX)" : "Phone (01XXXXXXXXX)"} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                {formError && <div className="sb-form-error">{formError}</div>}
                <button className="sb-form-submit" type="submit" disabled={formState === "loading"}>
                  {formState === "loading" ? (ar ? "جاري الإرسال..." : "Sending...") : (ar ? "احجز الآن" : "Secure My Session")}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="sb-footer">
        <div className="sb-footer-grid">
          <div>
            <div className="sb-footer-logo-row">
              <ShieldLogo size={32} dark={dark} />
              <div>
                <div className="sb-footer-brand-name">Sierra Estates</div>
                <div className="sb-footer-brand-sub">Beyond Brokerage</div>
              </div>
            </div>
            <div className="sb-footer-tagline">
              {ar ? '"العقارات في مصر لم تعد مجرد موقع — إنها بيانات، رغبة، وتصميم."' : '"Real estate in New Cairo is no longer just location — it\'s data, desire, and design."'}
            </div>
          </div>

          {[
            { title: ar ? "استكشاف" : "Discovery", links: [{ en: "All Listings", ar: "كل العقارات" }, { en: "Intelligence", ar: "ذكاء السوق" }, { en: "New Cairo Map", ar: "خريطة التجمع" }] },
            { title: ar ? "الشركة" : "Company", links: [{ en: "About Us", ar: "عن الشركة" }, { en: "Advisors", ar: "المستشارون" }, { en: "Careers", ar: "وظائف" }] },
            { title: ar ? "تواصل" : "Contact", links: [{ en: "+20 100 123 4567", ar: "+20 100 123 4567" }, { en: "hello@sierrablurealty.com", ar: "hello@sierrablurealty.com" }, { en: "New Cairo, Egypt", ar: "التجمع الخامس، مصر" }] },
          ].map((col) => (
            <div key={col.title}>
              <div className="sb-footer-col-title">{col.title}</div>
              <div className="sb-footer-links">
                {col.links.map((l) => <a key={l.en} href="#" className="sb-footer-link">{ar ? l.ar : l.en}</a>)}
              </div>
            </div>
          ))}
        </div>

        <div className="sb-footer-bottom">
          <span className="sb-footer-copy">© 2026 Sierra Estates Realty. All Rights Reserved.</span>
          <div className="sb-footer-bottom-row">
            <div className="sb-pf-badge"><span className="sb-pf-dot" />PF Synced</div>
            <a href="#" className="sb-footer-link">Privacy</a>
            <a href="#" className="sb-footer-link">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return <LandingContent />;
}
