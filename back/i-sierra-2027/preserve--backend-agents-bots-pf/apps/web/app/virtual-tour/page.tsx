'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ArrowLeft, Sparkles, Smartphone, Upload, Eye, Check, AlertCircle } from 'lucide-react';

const G = '#E9C176';
const G2 = '#C8961A';

const THEMES = {
  dark: {
    bg: '#0D2035', text: '#EFF8F7', textSub: 'rgba(239,248,247,0.78)',
    border: 'rgba(233,193,118,0.18)', card: '#122A47', bg2: '#0A1520',
  },
  light: {
    bg: '#EEF2F4', text: '#0C1B2E', textSub: 'rgba(12,27,46,0.74)',
    border: 'rgba(12,27,46,0.14)', card: '#FFFFFF', bg2: '#DCE4E8',
  },
};

export default function S24VirtualTourPage() {
  const { theme } = useTheme();
  const mode = (theme === 'light' ? 'light' : 'dark') as 'light' | 'dark';
  const th = THEMES[mode];

  // Drag State for Interactive 360° simulated player
  const [bgPosition, setBgPosition] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const [tourStatus, setTourStatus] = useState<'idle' | 'uploading' | 'processing' | 'ready'>('idle');

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX - bgPosition;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const newPos = e.clientX - startX.current;
    setBgPosition(newPos);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Touch handlers for S24 Ultra device simulations
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX - bgPosition;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const newPos = e.touches[0].clientX - startX.current;
    setBgPosition(newPos);
  };

  const handleSimulateUpload = () => {
    setTourStatus('uploading');
    setTimeout(() => {
      setTourStatus('processing');
      setTimeout(() => {
        setTourStatus('ready');
      }, 2000);
    }, 1500);
  };

  return (
    <div style={{ background: th.bg, color: th.text, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Jost', sans-serif" }}>
      {/* Header */}
      <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', borderBottom: `1px solid ${th.border}`, backdropFilter: 'blur(20px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/">
            <button style={{ background: 'transparent', border: `1px solid ${th.border}`, color: th.text, width: 40, height: 40, borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.02em' }}>S24 Ultra Virtual Tour Hub</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: th.textSub }}>AI-powered panoramic property mapping</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(233,193,118,0.1)', border: `1px solid ${G}`, borderRadius: '24px', padding: '6px 16px', fontSize: '0.8rem', color: G }}>
          <Smartphone size={14} />
          <span>Galaxy S24 Ultra Tuned</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '2rem auto', width: '100%', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2rem', flex: 1 }}>
        
        {/* Left Pane: Interactive 360° Simulated Player */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400, margin: '0 0 0.5rem 0' }}>
              Simulated Interactive 360° Property Player
            </h2>
            <p style={{ margin: 0, fontSize: '0.9rem', color: th.textSub }}>
              Click and drag horizontally in the viewport below to experience a live New Cairo villa panorama.
            </p>
          </div>

          {/* Interactive Player Viewport */}
          <div 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            style={{ 
              height: '420px', 
              width: '100%', 
              background: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=80')`,
              backgroundSize: 'cover',
              backgroundPositionX: `${bgPosition}px`,
              backgroundPositionY: 'center',
              border: `1px solid ${G}`,
              borderRadius: '24px',
              cursor: 'grab',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              userSelect: 'none'
            }}
          >
            {/* Compass HUD Overlay */}
            <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', backgroundColor: 'rgba(13,32,53,0.8)', border: `1px solid ${th.border}`, borderRadius: '12px', padding: '6px 14px', fontSize: '0.75rem', color: G, backdropFilter: 'blur(8px)' }}>
              🧭 Living Room · Mivida Premium
            </div>

            {/* Draggable indicator */}
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(13,32,53,0.8)', border: `1px solid ${th.border}`, borderRadius: '16px', padding: '6px 16px', fontSize: '0.75rem', color: '#fff', pointerEvents: 'none', backdropFilter: 'blur(8px)', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span>↔ Drag to Rotate Panorama</span>
            </div>
          </div>

          {/* S24 Ultra Sourcing Upload Card */}
          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: "'Cormorant Garamond', serif", display: 'flex', alignItems: 'center', gap: '0.5rem', color: G }}>
              <Upload size={18} />
              S24 Ultra Panorama Uploader
            </h3>
            
            <div style={{ border: `2px dashed ${th.border}`, borderRadius: '16px', padding: '2.5rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.01)', cursor: 'pointer', transition: 'all 0.3s' }} onClick={handleSimulateUpload}>
              <Smartphone size={36} color={G} style={{ margin: '0 auto 1rem auto' }} />
              <strong style={{ display: 'block', fontSize: '0.95rem', color: '#fff', marginBottom: '0.25rem' }}>
                {tourStatus === 'idle' && 'Drop S24 Ultra raw 360° panoramas here'}
                {tourStatus === 'uploading' && 'Uploading high-res panoramic frame...'}
                {tourStatus === 'processing' && 'AI stitching & leveling in progress...'}
                {tourStatus === 'ready' && 'Virtual Tour is fully rendered! ✓'}
              </strong>
              <span style={{ fontSize: '0.75rem', color: th.textSub }}>
                {tourStatus === 'idle' && 'Supports raw 50MP / 200MP JPEG/HEIC captures'}
                {tourStatus === 'uploading' && 'Transferring 42MB asset...'}
                {tourStatus === 'processing' && 'Calibrating horizon & depth factors...'}
                {tourStatus === 'ready' && 'Ready to share with client in custom PDF brochure!'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Pane: Galaxy S24 Ultra Settings Guide */}
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontFamily: "'Cormorant Garamond', serif", color: G, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Smartphone size={20} />
              S24 Ultra Setup Guide
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: th.textSub }}>
              Optimized checklist for capturing luxury 360° tours natively.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ background: 'rgba(233,193,118,0.1)', color: G, width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, flexShrink: 0 }}>1</span>
              <div>
                <strong style={{ color: '#fff', display: 'block' }}>Set Camera Resolution</strong>
                Configure your native camera to **50MP or 200MP Mode** inside the Samsung camera settings to maximize clarity in wide panoramas.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ background: 'rgba(233,193,118,0.1)', color: G, width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, flexShrink: 0 }}>2</span>
              <div>
                <strong style={{ color: '#fff', display: 'block' }}>Use Ultra-Wide 0.6x Panorama</strong>
                Switch your camera format to **Panorama Mode** and select the **0.6x (Ultra-Wide)** lens to capture full ceiling-to-floor sweeps.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ background: 'rgba(233,193,118,0.1)', color: G, width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, flexShrink: 0 }}>3</span>
              <div>
                <strong style={{ color: '#fff', display: 'block' }}>Level Placement at 1.5m</strong>
                Mount the S24 Ultra on a **level tripod** positioned exactly in the center of the room at chest height (approximately 1.5 meters).
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ background: 'rgba(233,193,118,0.1)', color: G, width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontWeight: 600, flexShrink: 0 }}>4</span>
              <div>
                <strong style={{ color: '#fff', display: 'block' }}>Voice Command / 2s Timer</strong>
                Enable "Voice Commands" (say *'Smile'* or *'Capture'*) or configure a **2-second timer delay** to eliminate minor phone shakes when starting the panorama sweep.
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${th.border}`, paddingTop: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'rgba(233,193,118,0.02)', border: `1px dashed ${th.border}`, padding: '1rem', borderRadius: '12px' }}>
            <AlertCircle size={20} color={G} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.75rem', color: th.textSub, lineHeight: 1.5 }}>
              *Note: Lola AI integrates a customized stitching pipeline that automatically extracts lighting factors and aligns shadows for perfect professional listing output.*
            </span>
          </div>

          <Link href="/">
            <button style={{ width: '100%', padding: '12px', background: 'transparent', border: `1px solid ${th.border}`, color: th.text, borderRadius: '12px', cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ← Return Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
