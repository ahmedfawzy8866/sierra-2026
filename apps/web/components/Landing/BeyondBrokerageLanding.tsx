"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";

export default function BeyondBrokerageLanding() {
  const heroBgRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // ─── NAV SCROLL ───
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);

    // ─── CURSOR ───
    let mx = 0, my = 0, rx = 0, ry = 0;
    let cursorAnimId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + "px";
        cursorRef.current.style.top = my + "px";
      }
    };
    
    const animateRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = rx + "px";
        cursorRingRef.current.style.top = ry + "px";
      }
      cursorAnimId = requestAnimationFrame(animateRing);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    animateRing();

    // Hover effects for cursor
    const interactiveEls = document.querySelectorAll('a, button, .prop-card, .service-card, .compound-item');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (cursorRef.current && cursorRingRef.current) {
          cursorRef.current.style.width = '20px';
          cursorRef.current.style.height = '20px';
          cursorRingRef.current.style.width = '56px';
          cursorRingRef.current.style.height = '56px';
        }
      });
      el.addEventListener('mouseleave', () => {
        if (cursorRef.current && cursorRingRef.current) {
          cursorRef.current.style.width = '12px';
          cursorRef.current.style.height = '12px';
          cursorRingRef.current.style.width = '36px';
          cursorRingRef.current.style.height = '36px';
        }
      });
    });

    // ─── HERO PARALLAX ───
    let tX = 0, tY = 0;
    const handleParallaxMove = (e: MouseEvent) => {
      tX = (e.clientX / window.innerWidth - 0.5) * 22;
      tY = (e.clientY / window.innerHeight - 0.5) * 14;
    };
    window.addEventListener("mousemove", handleParallaxMove);
    
    let parallaxAnimId: number;
    const tickParallax = () => {
      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `translate(${tX * 0.06}px, ${tY * 0.06}px) scale(1.08)`;
      }
      parallaxAnimId = requestAnimationFrame(tickParallax);
    };
    tickParallax();

    // ─── SCROLL REVEAL ───
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleParallaxMove);
      cancelAnimationFrame(cursorAnimId);
      cancelAnimationFrame(parallaxAnimId);
      observer.disconnect();
    };
  }, []);

  // ─── LEAFLET INITIALIZATION ───
  const initMap = () => {
    const L = (window as any).L;
    if (!L || mapRef.current) return;

    // Wait a brief moment for DOM to be ready if needed
    const mapEl = document.getElementById('sbr-map');
    if (!mapEl) return;

    const map = L.map('sbr-map', {
      center: [30.027, 31.465],
      zoom: 12,
      zoomControl: true,
      attributionControl: false,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '',
      maxZoom: 19,
    }).addTo(map);

    const goldIcon = () => L.divIcon({
      html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#D4AF37,#E8CC6A);clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%);display:flex;align-items:center;justify-content:center;border:2px solid #0D2444;box-shadow:0 2px 12px rgba(212,175,55,0.6);cursor:pointer;transform:rotate(0deg)"><span style="font-family:'Playfair Display',serif;font-size:11px;font-weight:700;color:#0D2444;">S</span></div>`,
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16],
    });

    const compounds = [
      { lat: 30.027, lng: 31.443, name: 'Mivida', units: 18, price: '8M – 18M EGP', type: 'Sale & Rent', code: 'MI' },
      { lat: 30.018, lng: 31.480, name: 'Hyde Park', units: 24, price: '70K – 120K/mo', type: 'Rental', code: 'HP' },
      { lat: 30.032, lng: 31.488, name: 'Cairo Festival City', units: 12, price: '15M – 28M EGP', type: 'Sale', code: 'CFC' },
      { lat: 30.045, lng: 31.455, name: 'Mountain View', units: 31, price: '12M – 22M EGP', type: 'Sale & Rent', code: 'MV' },
      { lat: 30.010, lng: 31.462, name: 'Palm Hills', units: 9, price: '90K – 150K/mo', type: 'Rental', code: 'PH' },
      { lat: 30.056, lng: 31.490, name: 'Sodic East', units: 15, price: '10M – 20M EGP', type: 'Sale', code: 'SE' },
      { lat: 30.038, lng: 31.435, name: 'Rehab City', units: 22, price: '50K – 90K/mo', type: 'Rental', code: 'RD' },
    ];

    compounds.forEach(c => {
      const marker = L.marker([c.lat, c.lng], { icon: goldIcon() }).addTo(map);
      
      const popupContent = `
        <div class="map-popup-card" style="background:#050B14;border:1px solid rgba(212,175,55,0.25);border-radius:4px;overflow:hidden;min-width:220px;">
          <div class="map-popup-verified" style="background:#D4AF37;color:#050B14;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;padding:6px 12px;display:flex;align-items:center;gap:6px;">
            <span>✓</span> VERIFIED LISTING
          </div>
          <div class="map-popup-body" style="padding:12px;">
            <div class="map-popup-name" style="font-size:13px;font-weight:600;color:#fff;margin-bottom:6px;">${c.name}</div>
            <div class="map-popup-price" style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#D4AF37;margin-bottom:4px;">${c.price}</div>
            <div class="map-popup-specs" style="font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:10px;">${c.units} units · ${c.type} · Code: ${c.code}</div>
            <button class="map-popup-btn" style="background:#D4AF37;color:#050B14;border:none;border-radius:2px;padding:8px 16px;font-size:11px;font-weight:700;letter-spacing:0.1em;cursor:pointer;width:100%;text-transform:uppercase;">View Details →</button>
          </div>
        </div>
      `;
      const popup = L.popup({ className: 'sbr-popup', closeButton: false, maxWidth: 240 })
        .setContent(popupContent);
      marker.bindPopup(popup);
      
      // Store in global so onclick can access it
      (window as any).sbrMarkers = (window as any).sbrMarkers || {};
      (window as any).sbrMarkers[c.name] = { marker, data: c };
    });
  };

  const flyToCompound = (lat: number, lng: number, name: string, event: React.MouseEvent) => {
    const L = (window as any).L;
    const markers = (window as any).sbrMarkers;
    if (mapRef.current && L && markers) {
      mapRef.current.flyTo([lat, lng], 14, { duration: 1.2, easeLinearity: 0.4 });
      if (markers[name]) markers[name].marker.openPopup();
      
      // Update active state
      document.querySelectorAll('.compound-item').forEach(i => i.classList.remove('active', 'bg-[#D4AF37]/10'));
      const target = event.currentTarget as HTMLElement;
      target.classList.add('active', 'bg-[#D4AF37]/10');
    }
  };

  const filterProps = (type: string, e: React.MouseEvent) => {
    document.querySelectorAll('.prop-filter button').forEach(b => {
      b.classList.remove('border-[#D4AF37]', 'text-[#D4AF37]', 'bg-[rgba(212,175,55,0.12)]');
    });
    const target = e.currentTarget as HTMLElement;
    target.classList.add('border-[#D4AF37]', 'text-[#D4AF37]', 'bg-[rgba(212,175,55,0.12)]');
  };

  return (
    <div className="bg-[#0A1628] text-white font-['Inter'] min-h-screen overflow-x-hidden relative selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="lazyOnload" onLoad={initMap} />
      
      <style dangerouslySetInnerHTML={{__html: `
        /* Custom cursor */
        body { cursor: none; }
        .sbr-cursor {
          position: fixed; width: 12px; height: 12px; background: #D4AF37; border-radius: 50%;
          pointer-events: none; z-index: 9999; transform: translate(-50%,-50%);
          transition: width 0.2s, height 0.2s, opacity 0.2s; mix-blend-mode: normal;
        }
        .sbr-cursor-ring {
          position: fixed; width: 36px; height: 36px; border: 1px solid rgba(212,175,55,0.5); border-radius: 50%;
          pointer-events: none; z-index: 9998; transform: translate(-50%,-50%);
          transition: transform 0.12s ease, width 0.25s, height 0.25s;
        }
        body:hover .sbr-cursor { opacity: 1; }

        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        @keyframes scrollLineAnim {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @keyframes rotateBadge {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-up { animation: fadeUp 1s ease both; }
        .animate-fade-slide-down { animation: fadeSlideDown 1.2s ease both; }
        .animate-pulse-dot { animation: pulseDot 2s infinite; }
        .animate-scroll-line { animation: scrollLineAnim 2s ease infinite; }
        .animate-rotate-badge { animation: rotateBadge 12s linear infinite; }
        
        /* Reveal */
        .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal.visible { opacity: 1; transform: none; }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }

        /* Leaflet overrides */
        .leaflet-container { background: #050B14; }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip { background: transparent; box-shadow: none; }
        .leaflet-popup-content { margin: 0; }
        .leaflet-popup-close-button { color: #D4AF37 !important; top: 4px !important; right: 4px !important; }
      `}} />

      {/* Cursor */}
      <div className="sbr-cursor" ref={cursorRef}></div>
      <div className="sbr-cursor-ring" ref={cursorRingRef}></div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[52px] py-[22px] transition-all duration-400 \${navScrolled ? 'bg-[#0A1628]/95 backdrop-blur-[18px] !py-[14px] border-b border-[#D4AF37]/10' : ''}`}>
        <Link href="#" className="flex items-center gap-[12px] no-underline">
          <div className="w-[44px] h-[44px] bg-gradient-to-br from-[#D4AF37] to-[#F1D38E] flex items-center justify-center relative" style={{ clipPath: 'polygon(50% 0%, 100% 18%, 100% 72%, 50% 100%, 0% 72%, 0% 18%)' }}>
            <span className="font-['Playfair_Display'] text-[16px] font-bold text-[#050B14] tracking-[-0.5px]">S</span>
          </div>
          <div className="flex flex-col">
            <span className="font-['Poppins'] text-[14px] font-semibold tracking-[0.12em] text-white">SIERRA BLU</span>
            <span className="font-['Inter'] text-[9px] tracking-[0.2em] text-[#D4AF37] uppercase">Realty · Beyond Brokerage</span>
          </div>
        </Link>
        <ul className="flex items-center gap-[36px] list-none m-0 p-0">
          {[
            { label: 'Properties', href: '#properties' },
            { label: 'Map', href: '#map' },
            { label: 'Services', href: '#services' },
            { label: 'Intelligence', href: '#about' },
          ].map((item, i) => (
            <li key={i}>
              <Link href={item.href} className="text-[13px] tracking-[0.05em] text-white/85 no-underline transition-colors duration-200 relative hover:text-[#D4AF37] group">
                {item.label}
                <span className="absolute -bottom-[2px] left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="#contact" className="bg-transparent border border-[#D4AF37] text-[#D4AF37] px-[22px] py-[9px] rounded-[3px] text-[12px] tracking-[0.1em] transition-all duration-250 hover:bg-[#D4AF37] hover:text-[#050B14] uppercase">
              Consult
            </Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] overflow-hidden flex items-end px-[52px] pb-[80px]" id="hero" onMouseDown={() => { if(heroBgRef.current) heroBgRef.current.style.transition = 'transform 0.15s ease'; }} onMouseUp={() => { if(heroBgRef.current) heroBgRef.current.style.transition = 'transform 0.4s ease'; }}>
        <div ref={heroBgRef} className="absolute inset-0 origin-center will-change-transform parallax-layer" style={{ backgroundImage: "linear-gradient(to bottom, rgba(10,22,40,0.2) 0%, rgba(10,22,40,0.1) 40%, rgba(10,22,40,0.85) 80%, rgba(10,22,40,1) 100%), url('https://images.unsplash.com/photo-1580407196238-dac33f57c410?w=1800&q=85')", backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}></div>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>

        <div className="absolute top-[110px] right-[52px] flex items-center gap-[10px] bg-[#0A1628]/70 backdrop-blur-[12px] border border-[#D4AF37]/30 rounded-[4px] px-[16px] py-[10px] text-[11px] tracking-[0.08em] text-[#D4AF37] uppercase animate-fade-slide-down" style={{ animationDelay: '1.5s' }}>
          <div className="w-[8px] h-[8px] rounded-full bg-[#D4AF37] animate-pulse-dot"></div>
          Verified by Sierra Blu · April 2026
        </div>

        <div className="relative z-10 max-w-[780px]">
          <div className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.25em] text-[#D4AF37] uppercase mb-[24px] animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <span className="w-[40px] h-[1px] bg-[#D4AF37] inline-block"></span>
            AI-Powered Real Estate Intelligence
          </div>
          <h1 className="font-['Playfair_Display'] text-[clamp(48px,7vw,86px)] leading-[1.0] font-normal tracking-[-0.02em] mb-[28px] animate-fade-up" style={{ animationDelay: '0.5s' }}>
            Human Expertise.<br/><em className="not-italic italic text-[#D4AF37]">AI Precision.</em><br/>Better Decisions.
          </h1>
          <p className="text-[16px] leading-[1.7] text-white/85 max-w-[480px] mb-[48px] animate-fade-up" style={{ animationDelay: '0.7s' }}>
            Sierra Blu Realty combines professional advisory with advanced AI-powered market analysis to identify the most suitable opportunities across New Cairo & Fifth Settlement.
          </p>
          <div className="flex items-center gap-[20px] animate-fade-up" style={{ animationDelay: '0.9s' }}>
            <Link href="#properties" className="bg-[#D4AF37] text-[#050B14] px-[36px] py-[16px] rounded-[3px] font-['Poppins'] text-[13px] font-semibold tracking-[0.08em] hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(212,175,55,0.35)] transition-all duration-200 uppercase inline-block">
              Explore Properties
            </Link>
            <Link href="#contact" className="bg-transparent text-white px-[36px] py-[15px] border border-white/30 rounded-[3px] font-['Poppins'] text-[13px] font-medium tracking-[0.08em] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-200 uppercase inline-block">
              Schedule Consultation
            </Link>
          </div>
        </div>

        <div className="absolute bottom-[80px] right-[52px] flex gap-[2px] animate-fade-up" style={{ animationDelay: '1.1s' }}>
          {[
            { num: '500+', label: 'Premium Units' },
            { num: '25', label: 'Compounds' },
            { num: '98%', label: 'Match Accuracy' }
          ].map((stat, i) => (
            <div key={i} className="bg-[#1A3D6B]/50 backdrop-blur-[12px] border border-[#D4AF37]/15 px-[28px] py-[20px] text-center">
              <div className="font-['Playfair_Display'] text-[28px] font-bold text-[#D4AF37] leading-none">{stat.num}</div>
              <div className="text-[10px] tracking-[0.15em] text-white/60 uppercase mt-[6px]">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[8px] text-[10px] tracking-[0.2em] text-white/60 uppercase animate-fade-up" style={{ animationDelay: '1.3s' }}>
          <div className="w-[1px] h-[50px] bg-gradient-to-b from-[#D4AF37] to-transparent animate-scroll-line"></div>
          Scroll
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-[#0A1628] py-[120px] relative overflow-hidden" id="services">
        <div className="max-w-[1320px] mx-auto px-[52px]">
          <div className="flex items-end justify-between mb-[60px]">
            <div>
              <div className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase mb-[16px] flex items-center gap-[12px] reveal">
                <span className="w-[30px] h-[1px] bg-[#D4AF37] inline-block"></span>
                Our Services
              </div>
              <h2 className="font-['Playfair_Display'] text-[clamp(36px,4.5vw,56px)] font-normal leading-[1.1] tracking-[-0.02em] reveal reveal-delay-1">
                Crafted for the<br/><em className="not-italic italic text-[#D4AF37]">Discerning Client</em>
              </h2>
            </div>
            <p className="max-w-[340px] text-[14px] leading-[1.7] text-white/60 reveal reveal-delay-2">
              We don't just find properties. We engineer better real estate decisions through structured analysis and professional advisory.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-[2px]">
            {[
              { num: '01', icon: '🏙️', title: 'Executive Rentals', desc: 'High-budget rentals in premium New Cairo compounds tailored for expatriates, executives, and international professionals.' },
              { num: '02', icon: '🏡', title: 'Residential Sales', desc: 'Guiding buyers toward carefully evaluated residential opportunities aligned with lifestyle preferences and investment considerations.' },
              { num: '03', icon: '🏢', title: 'Commercial & Admin', desc: "Strategic advisory for businesses and investors seeking office spaces and commercial units across New Cairo's business districts." },
              { num: '04', icon: '📊', title: 'Developer Relations', desc: 'Supporting developers and property owners with professional positioning, qualified buyer matching, and market intelligence.' }
            ].map((srv, i) => (
              <div key={i} className={`service-card relative bg-[#1A3D6B]/15 border border-[#D4AF37]/10 p-[40px_32px] overflow-hidden transition-all duration-300 cursor-pointer hover:bg-[#1A3D6B]/35 hover:border-[#D4AF37]/30 reveal reveal-delay-${i}`}>
                <div className="absolute top-0 left-0 w-0 h-[2px] bg-[#D4AF37] transition-all duration-400 group-hover:w-full" style={{ width: 'var(--hover-w, 0)' }}></div>
                <div className="absolute top-[28px] right-[28px] font-['Playfair_Display'] text-[48px] font-bold text-[#D4AF37]/5 leading-none pointer-events-none">{srv.num}</div>
                <div className="w-[52px] h-[52px] border border-[#D4AF37]/30 rounded-[4px] flex items-center justify-center mb-[28px] text-[22px]">{srv.icon}</div>
                <div className="font-['Poppins'] text-[16px] font-semibold mb-[14px] text-white">{srv.title}</div>
                <p className="text-[13.5px] leading-[1.65] text-white/60">{srv.desc}</p>
                {/* CSS hack for hover line */}
                <style dangerouslySetInnerHTML={{__html: `
                  .service-card:hover { --hover-w: 100%; }
                `}} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-[#0D2444]/50 py-[120px] relative overflow-hidden" id="properties">
        <div className="max-w-[1320px] mx-auto px-[52px]">
          <div className="flex items-end justify-between mb-[50px]">
            <div>
              <div className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase mb-[16px] flex items-center gap-[12px] reveal">
                <span className="w-[30px] h-[1px] bg-[#D4AF37] inline-block"></span>
                Featured Listings
              </div>
              <h2 className="font-['Playfair_Display'] text-[clamp(36px,4.5vw,56px)] font-normal leading-[1.1] tracking-[-0.02em] reveal reveal-delay-1">
                Verified <em className="not-italic italic text-[#D4AF37]">Properties</em>
              </h2>
            </div>
            <div className="prop-filter flex gap-[8px] reveal reveal-delay-2">
              <button className="bg-[rgba(212,175,55,0.12)] border border-[#D4AF37] text-[#D4AF37] px-[20px] py-[8px] rounded-[2px] text-[12px] tracking-[0.08em] cursor-pointer transition-all duration-200" onClick={(e) => filterProps('all', e)}>All</button>
              <button className="bg-transparent border border-white/15 text-white/60 px-[20px] py-[8px] rounded-[2px] text-[12px] tracking-[0.08em] cursor-pointer transition-all duration-200 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.12)]" onClick={(e) => filterProps('sale', e)}>For Sale</button>
              <button className="bg-transparent border border-white/15 text-white/60 px-[20px] py-[8px] rounded-[2px] text-[12px] tracking-[0.08em] cursor-pointer transition-all duration-200 hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.12)]" onClick={(e) => filterProps('rent', e)}>For Rent</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-[20px]">
            {[
              { loc: 'Mivida, New Cairo', title: 'Luxury Villa with Garden View', beds: 4, baths: 5, sqm: 320, price: 'EGP 14.5M', code: 'MI-4F-14M', type: 'For Sale', icon: '🏙️', compound: 'MIVIDA', bg: 'linear-gradient(135deg,#1a3d6b 0%,#0d2444 60%,#1a3d6b 100%)' },
              { loc: 'Hyde Park, New Cairo', title: 'Furnished Apartment — Lake View', beds: 3, baths: 3, sqm: 195, price: '85K / mo', code: 'HP-3F-85K', type: 'For Rent', icon: '🌊', compound: 'HYDE PARK', bg: 'linear-gradient(135deg,#2a5298 0%,#1a3d6b 60%,#0d2444 100%)' },
              { loc: 'Cairo Festival City', title: 'Penthouse with Rooftop Terrace', beds: 4, baths: 4, sqm: 410, price: 'EGP 22M', code: 'CFC-4F-22M', type: 'For Sale', icon: '🏛️', compound: 'CAIRO FESTIVAL', bg: 'linear-gradient(135deg,#0d2444 0%,#1a5080 60%,#1a3d6b 100%)' }
            ].map((prop, i) => (
              <div key={i} className={`prop-card bg-[#1A3D6B]/20 border border-[#D4AF37]/10 rounded-[4px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)] hover:border-[#D4AF37]/25 group reveal reveal-delay-\${i}`}>
                <div className="w-full h-[240px] bg-[#1a3d6b] relative overflow-hidden">
                  <div className="w-full h-full relative overflow-hidden transition-transform duration-500 flex items-center justify-center group-hover:scale-105" style={{ background: prop.bg }}>
                    <div className="text-center opacity-30">
                      <div className="text-[40px]">{prop.icon}</div>
                      <div className="text-[12px] text-[#D4AF37] tracking-[0.2em] mt-[8px] uppercase">{prop.compound}</div>
                    </div>
                  </div>
                  <div className="absolute top-[14px] left-[14px] flex gap-[8px]">
                    <span className="bg-[#D4AF37] text-[#050B14] px-[12px] py-[4px] rounded-[2px] text-[10px] tracking-[0.12em] uppercase font-semibold">✓ Verified</span>
                    <span className="bg-[#0A1628]/85 text-white border border-white/15 px-[12px] py-[4px] rounded-[2px] text-[10px] tracking-[0.12em] uppercase font-semibold">{prop.type}</span>
                  </div>
                </div>
                <div className="p-[24px]">
                  <div className="text-[11px] tracking-[0.15em] text-[#D4AF37] uppercase mb-[8px] flex items-center gap-[6px]">📍 {prop.loc}</div>
                  <div className="font-['Poppins'] text-[18px] font-semibold mb-[12px] text-white leading-[1.3]">{prop.title}</div>
                  <div className="flex gap-[20px] mb-[20px]">
                    <div className="flex items-center gap-[6px] text-[12.5px] text-white/60">🛏️ {prop.beds} Beds</div>
                    <div className="flex items-center gap-[6px] text-[12.5px] text-white/60">🚿 {prop.baths} Baths</div>
                    <div className="flex items-center gap-[6px] text-[12.5px] text-white/60">📐 {prop.sqm} m²</div>
                  </div>
                  <div className="flex items-center justify-between pt-[16px] border-t border-white/5">
                    <div>
                      <div className="font-['Playfair_Display'] text-[22px] font-bold text-[#D4AF37]">{prop.price}</div>
                      <div className="text-[11px] text-white/60 mt-[2px]">Code: {prop.code}</div>
                    </div>
                    <div className="w-[40px] h-[40px] border border-[#D4AF37]/30 rounded-[3px] flex items-center justify-center transition-colors duration-200 hover:bg-[#D4AF37]/10">→</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-[#0A1628] py-[120px] relative overflow-hidden" id="map">
        <div className="max-w-[1320px] mx-auto px-[52px]">
          <div className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase mb-[16px] flex items-center gap-[12px] reveal">
            <span className="w-[30px] h-[1px] bg-[#D4AF37] inline-block"></span>
            New Cairo Coverage
          </div>
          <h2 className="font-['Playfair_Display'] text-[clamp(36px,4.5vw,56px)] font-normal leading-[1.1] tracking-[-0.02em] mb-[40px] reveal reveal-delay-1">
            Explore <em className="not-italic italic text-[#D4AF37]">Our Market</em>
          </h2>
          <div className="grid grid-cols-[1fr_1.6fr] gap-0 border border-[#D4AF37]/10 rounded-[6px] overflow-hidden h-[600px] reveal reveal-delay-2">
            <div className="bg-[#1A3D6B]/30 backdrop-blur-[8px] p-[40px] flex flex-col border-r border-[#D4AF37]/10 overflow-y-auto">
              <div className="font-['Playfair_Display'] text-[28px] font-normal mb-[8px] leading-[1.2]">
                New Cairo &<br/><em className="not-italic italic text-[#D4AF37]">Fifth Settlement</em>
              </div>
              <p className="text-[13px] leading-[1.65] text-white/60 mb-[32px]">
                We cover all major premium compounds. Click any compound to explore available units.
              </p>
              <div className="flex-1">
                {[
                  { lat: 30.027, lng: 31.443, name: 'Mivida', units: 18 },
                  { lat: 30.018, lng: 31.480, name: 'Hyde Park', units: 24 },
                  { lat: 30.032, lng: 31.488, name: 'Cairo Festival City', units: 12 },
                  { lat: 30.045, lng: 31.455, name: 'Mountain View', units: 31 },
                  { lat: 30.010, lng: 31.462, name: 'Palm Hills', units: 9 },
                  { lat: 30.056, lng: 31.490, name: 'Sodic East', units: 15 },
                  { lat: 30.038, lng: 31.435, name: 'Rehab City', units: 22 },
                ].map((c, i) => (
                  <div key={i} className={`compound-item flex items-center gap-[14px] p-[14px_16px] rounded-[4px] cursor-pointer transition-colors duration-200 mb-[2px] hover:bg-[#D4AF37]/10 \${i === 0 ? 'active bg-[#D4AF37]/10' : ''}`} onClick={(e) => flyToCompound(c.lat, c.lng, c.name, e)}>
                    <div className="w-[10px] h-[10px] rounded-full bg-[#D4AF37] shrink-0 shadow-[0_0_0_3px_rgba(212,175,55,0.2)]"></div>
                    <span className="text-[14px] font-medium text-white">{c.name}</span>
                    <span className="text-[11px] text-white/60 ms-auto">{c.units} units</span>
                  </div>
                ))}
              </div>
            </div>
            <div id="sbr-map" className="h-full z-[1]"></div>
          </div>
        </div>
      </section>

      {/* VR Section */}
      <section className="bg-gradient-to-br from-[#050B14] via-[#1A3D6B]/40 to-[#0A1628] py-[120px] relative overflow-hidden" id="vr">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
        <div className="max-w-[1320px] mx-auto px-[52px]">
          <div className="grid grid-cols-2 gap-[80px] items-center relative z-10">
            <div>
              <div className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase mb-[24px] flex items-center gap-[12px] reveal">
                <span className="w-[30px] h-[1px] bg-[#D4AF37] inline-block"></span>
                Coming Soon
              </div>
              <h2 className="font-['Playfair_Display'] text-[clamp(36px,4.5vw,56px)] font-normal leading-[1.1] tracking-[-0.02em] mb-[24px] reveal reveal-delay-1">
                Virtual Reality<br/><em className="not-italic italic text-[#D4AF37]">Property Tours</em>
              </h2>
              <p className="text-[15px] leading-[1.75] text-white/85 mb-[40px] reveal reveal-delay-2">
                Experience properties before you visit. Our immersive VR tours allow you to walk through every room, assess finishes, and understand spatial flow — all from anywhere in the world.
              </p>
              <div className="flex flex-col gap-[16px] mb-[40px] reveal reveal-delay-3">
                {[
                  { icon: '🥽', text: 'Full 360° immersive property walkthrough' },
                  { icon: '📐', text: 'Accurate spatial measurements & floor plans' },
                  { icon: '🤝', text: 'Guided virtual tours with your advisor' },
                  { icon: '🌐', text: 'Available from any device, any country' },
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-[14px] text-[14px] text-white/85">
                    <div className="w-[36px] h-[36px] border border-[#D4AF37]/30 rounded-[3px] flex items-center justify-center text-[16px] shrink-0">{feat.icon}</div>
                    {feat.text}
                  </div>
                ))}
              </div>
              <Link href="#contact" className="bg-[#D4AF37] text-[#050B14] px-[36px] py-[16px] rounded-[3px] font-['Poppins'] text-[13px] font-semibold tracking-[0.08em] hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(212,175,55,0.35)] transition-all duration-200 uppercase inline-block reveal reveal-delay-4">
                Join the Waitlist
              </Link>
            </div>
            <div className="relative h-[460px] flex items-center justify-center reveal reveal-delay-2">
              <div className="w-full max-w-[420px] h-[280px] bg-[#0A1628]/80 border border-[#D4AF37]/20 rounded-[12px] flex items-center justify-center relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1A3D6B]/60 to-[#0A1628]/90"></div>
                <div className="relative z-10 text-center">
                  <span className="text-[56px] mb-[16px] block opacity-70">🥽</span>
                  <div className="font-['Poppins'] text-[14px] font-semibold text-[#D4AF37] tracking-[0.1em] uppercase mb-[8px]">VR Ready</div>
                  <div className="text-[12px] text-white/60">Immersive experience launching Q3 2026</div>
                </div>
                <div className="absolute -bottom-[20px] -right-[20px] bg-[#D4AF37] text-[#050B14] w-[100px] h-[100px] rounded-full flex flex-col items-center justify-center font-['Poppins'] text-[11px] font-bold tracking-[0.05em] uppercase text-center leading-[1.3] animate-rotate-badge shadow-lg">
                  VR<br/>READY<br/>Q3 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence / About */}
      <section className="bg-[#0A1628] py-[120px] relative overflow-hidden" id="about">
        <div className="max-w-[1320px] mx-auto px-[52px]">
          <div className="grid grid-cols-2 gap-[80px] items-center">
            <div className="relative h-[500px] reveal">
              <div className="absolute top-0 left-0 w-[75%] h-[75%] bg-gradient-to-br from-[#1A3D6B] to-[#1E4A7A] border border-[#D4AF37]/20 rounded-[6px] flex flex-col p-[32px] overflow-hidden">
                <div className="absolute bottom-[20px] right-[20px] font-['Playfair_Display'] text-[64px] text-[#D4AF37]/5 font-bold leading-none pointer-events-none">INTELLIGENCE</div>
                <div className="text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase mb-[16px]">Market Intelligence</div>
                <div className="font-['Playfair_Display'] text-[52px] font-bold text-[#D4AF37] leading-none">98%</div>
                <div className="text-[14px] text-white/60 mt-[8px]">Lead-to-match accuracy</div>
                <div className="mt-auto flex flex-col gap-[10px]">
                  {[
                    { label: 'Budget Match', val: '96%' },
                    { label: 'Location Fit', val: '92%' },
                    { label: 'Client Satisfaction', val: '99%' }
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col gap-[4px]">
                      <div className="text-[11px] text-white/60 flex justify-between"><span>{bar.label}</span><span>{bar.val}</span></div>
                      <div className="h-[3px] bg-white/10 rounded-[2px] overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F1D38E] rounded-[2px]" style={{ width: bar.val }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-[50%] h-[45%] bg-[#1A3D6B]/60 border border-[#D4AF37]/15 rounded-[6px] p-[24px] backdrop-blur-[8px] flex flex-col justify-between">
                <div>
                  <div className="text-[13px] text-white/60 mb-[8px]">Active Listings</div>
                  <div className="font-['Playfair_Display'] text-[36px] font-bold text-white">500+</div>
                </div>
                <span className="inline-block self-start bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] tracking-[0.12em] uppercase px-[10px] py-[4px] rounded-[2px]">
                  ↑ 34% MoM
                </span>
              </div>
            </div>

            <div className="reveal reveal-delay-2">
              <div className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase mb-[16px] flex items-center gap-[12px]">
                <span className="w-[30px] h-[1px] bg-[#D4AF37] inline-block"></span>
                Beyond Brokerage
              </div>
              <h2 className="font-['Playfair_Display'] text-[clamp(36px,4.5vw,56px)] font-normal leading-[1.1] tracking-[-0.02em] mb-[24px]">
                We Engineer<br/><em className="not-italic italic text-[#D4AF37]">Better Decisions</em>
              </h2>
              <p className="text-[15px] leading-[1.75] text-white/85 mb-[24px]">
                Sierra Blu Realty is built on expertise, intelligence, and transparency. Our approach combines professional advisors with advanced AI-powered analysis to identify the most relevant opportunities for each client.
              </p>
              <p className="text-[15px] leading-[1.75] text-white/60 mb-[40px]">
                Instead of overwhelming clients with listings, we focus on understanding priorities, analyzing options, and guiding smarter decisions. We guide decisions, not just transactions.
              </p>
              <div className="grid grid-cols-2 gap-[20px] mb-[40px]">
                <div className="p-[20px] border border-[#D4AF37]/15 rounded-[4px]">
                  <div className="text-[28px] font-['Playfair_Display'] text-[#D4AF37] font-bold">25+</div>
                  <div className="text-[12px] text-white/60 mt-[4px]">Premium Compounds</div>
                </div>
                <div className="p-[20px] border border-[#D4AF37]/15 rounded-[4px]">
                  <div className="text-[28px] font-['Playfair_Display'] text-[#D4AF37] font-bold">4.9★</div>
                  <div className="text-[12px] text-white/60 mt-[4px]">Client Rating</div>
                </div>
              </div>
              <Link href="#contact" className="bg-[#D4AF37] text-[#050B14] px-[36px] py-[16px] rounded-[3px] font-['Poppins'] text-[13px] font-semibold tracking-[0.08em] hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(212,175,55,0.35)] transition-all duration-200 uppercase inline-block">
                Discover Our Process
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#0D2444]/40 py-[100px] relative overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-[52px]">
          <div className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase mb-[16px] flex items-center gap-[12px] reveal">
            <span className="w-[30px] h-[1px] bg-[#D4AF37] inline-block"></span>
            Client Stories
          </div>
          <h2 className="font-['Playfair_Display'] text-[clamp(36px,4.5vw,56px)] font-normal leading-[1.1] tracking-[-0.02em] reveal reveal-delay-1">
            Voices of<br/><em className="not-italic italic text-[#D4AF37]">Trust</em>
          </h2>
          <div className="grid grid-cols-3 gap-[20px] mt-[56px]">
            {[
              { text: "\"Sierra Blu found us a penthouse in CFC that matched every criterion — within 72 hours. The AI matching system is genuinely impressive.\"", initials: 'JM', name: 'James Mitchell', role: 'International Executive · Expat' },
              { text: "\"As an investor, the ROI analysis was exceptional. They didn't just show properties — they showed me why each one was the right financial decision.\"", initials: 'SR', name: 'Sarah Rahman', role: 'Real Estate Investor · Dubai' },
              { text: "\"Relocated from London to New Cairo — Sierra Blu made the entire process feel effortless. True advisors, not salespeople.\"", initials: 'AK', name: 'Ahmed Khalil', role: 'Corporate Relocation · Mivida' }
            ].map((t, i) => (
              <div key={i} className={`bg-[#1A3D6B]/20 border border-[#D4AF37]/10 rounded-[6px] p-[36px] transition-colors duration-300 hover:border-[#D4AF37]/30 reveal reveal-delay-\${i}`}>
                <div className="flex gap-[4px] mb-[20px]">
                  {[1,2,3,4,5].map(star => <span key={star} className="text-[#D4AF37] text-[14px]">★</span>)}
                </div>
                <p className="text-[14.5px] leading-[1.7] text-white/85 mb-[28px] italic">{t.text}</p>
                <div className="flex items-center gap-[14px]">
                  <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-br from-[#D4AF37] to-[#b8943c] flex items-center justify-center font-['Poppins'] text-[16px] font-bold text-[#050B14]">{t.initials}</div>
                  <div>
                    <div className="text-[14px] font-semibold text-white">{t.name}</div>
                    <div className="text-[12px] text-white/60">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-[#D4AF37] py-[80px]" id="contact">
        <div className="max-w-[1320px] mx-auto px-[52px]">
          <div className="flex items-center justify-between gap-[48px]">
            <div>
              <h2 className="font-['Playfair_Display'] text-[40px] text-[#050B14] mb-[10px]">
                Your Next Property Decision<br/>Deserves Better Intelligence
              </h2>
              <p className="text-[16px] text-[#0D2444]/70">Schedule a private consultation with our advisory team.</p>
            </div>
            <div className="flex gap-[16px] shrink-0">
              <button className="bg-[#050B14] text-[#D4AF37] px-[44px] py-[18px] rounded-[3px] font-['Poppins'] text-[13px] font-bold tracking-[0.1em] uppercase cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(10,22,40,0.4)] whitespace-nowrap">
                Schedule Consultation
              </button>
              <a href="https://wa.me/201000000000" className="flex items-center gap-[8px] bg-[#0D2444]/15 text-[#050B14] border-[2px] border-[#050B14] px-[28px] py-[18px] rounded-[3px] font-['Poppins'] text-[12px] font-bold tracking-[0.1em] uppercase no-underline transition-colors duration-200 hover:bg-[#050B14]/10">
                📱 WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1628] pt-[80px] pb-[40px] border-t border-[#D4AF37]/10">
        <div className="max-w-[1320px] mx-auto px-[52px]">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-[60px] mb-[60px]">
            <div>
              <Link href="#" className="flex items-center gap-[12px] no-underline">
                <div className="w-[44px] h-[44px] bg-gradient-to-br from-[#D4AF37] to-[#F1D38E] flex items-center justify-center relative" style={{ clipPath: 'polygon(50% 0%, 100% 18%, 100% 72%, 50% 100%, 0% 72%, 0% 18%)' }}>
                  <span className="font-['Playfair_Display'] text-[16px] font-bold text-[#050B14] tracking-[-0.5px]">S</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Poppins'] text-[14px] font-semibold tracking-[0.12em] text-white">SIERRA BLU</span>
                  <span className="font-['Inter'] text-[9px] tracking-[0.2em] text-[#D4AF37] uppercase">Realty · Beyond Brokerage</span>
                </div>
              </Link>
              <p className="text-[13.5px] leading-[1.7] text-white/60 my-[20px] max-w-[280px]">
                AI-Powered Real Estate Intelligence for New Cairo & Fifth Settlement. We engineer better property decisions.
              </p>
              <div className="flex gap-[12px]">
                {['in', 'f', 'ig', 'wa'].map((social, i) => (
                  <Link key={i} href="#" className="w-[36px] h-[36px] border border-[#D4AF37]/20 rounded-[3px] flex items-center justify-center text-[14px] cursor-pointer transition-colors duration-200 text-white/60 no-underline hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] hover:text-[#D4AF37]">
                    {social}
                  </Link>
                ))}
              </div>
            </div>
            
            {[
              { title: 'Properties', links: ['For Sale', 'For Rent', 'New Developments', 'Investment Picks', 'Executive Rentals'] },
              { title: 'Compounds', links: ['Mivida', 'Hyde Park', 'Cairo Festival City', 'Mountain View', 'Palm Hills'] },
              { title: 'Company', links: ['About Sierra Blu', 'Our Services', 'Intelligence Layer', 'Careers', 'Contact'] }
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-['Poppins'] text-[11px] font-bold tracking-[0.2em] uppercase text-[#D4AF37] mb-[24px]">{col.title}</h4>
                <ul className="list-none m-0 p-0">
                  {col.links.map((link, j) => (
                    <li key={j} className="mb-[12px]">
                      <Link href="#" className="text-[13.5px] text-white/60 no-underline transition-colors duration-200 hover:text-white">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-[32px] flex items-center justify-between text-[12px] text-white/60">
            <span>© 2026 <span className="text-[#D4AF37]">Sierra Blu Realty</span>. All Rights Reserved. New Cairo, Egypt.</span>
            <span>Built with AI Intelligence · <span className="text-[#D4AF37]">Beyond Brokerage</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
