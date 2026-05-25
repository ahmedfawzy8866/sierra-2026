"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowUpRight, MapPin, Globe, Shield, User, Menu, X, Sparkles, TrendingUp, Building2, Phone } from 'lucide-react';
import BrandLogo from '../UI/BrandLogo';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { COLLECTIONS, Unit } from '../../lib/models/schema';

/* ─────────────────────────────────────────────────────────
   PROPERTY CARD — mobile-friendly horizontal snap card
───────────────────────────────────────────────────────── */
interface PropertyCardProps {
  image: string;
  location: string;
  title: string;
  price: string;
  index: number;
}

const PropertyCard = ({ image, location, title, price, index }: PropertyCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    viewport={{ once: true, margin: "-30px" }}
    className="group relative cursor-pointer flex-shrink-0 w-[80vw] md:w-full aspect-[3/4] overflow-hidden rounded-[1.75rem] shadow-xl snap-start"
  >
    <img
      src={image}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      onError={(e) => { e.currentTarget.src = "/penthouse.png"; }}
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/40 to-transparent" />

    <div className="absolute inset-0 p-6 flex flex-col justify-between">
      <span className="self-start px-3 py-1 bg-white/10 border border-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
        High ROI
      </span>
      <div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-2">
          <MapPin size={10} /> {location}
        </div>
        <h3 className="text-2xl md:text-3xl font-medium text-[#F4F0E8] leading-tight mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
          {title}
        </h3>
        <p className="text-base text-[#F4F0E8]/60 font-light">{price}</p>
        <div className="flex items-center gap-2 mt-3 text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">
          Explore <ArrowUpRight size={12} />
        </div>
      </div>
    </div>
  </motion.div>
);

export default function LightLandingScreen({ onEnterPortal }: { onEnterPortal: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [properties, setProperties] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const q = query(collection(db, COLLECTIONS.units), limit(6));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit));
        setProperties(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Static Fallbacks incase backend is empty or loading
  const fallbackProperties = [
    {
      image: "/estate.png",
      location: "New Cairo | District 5",
      title: "The Glass Pavilion",
      price: "EGP 42,500,000"
    },
    {
      image: "/villa.png",
      location: "New Cairo | Katameya Heights",
      title: "Azure Shore Villa",
      price: "EGP 68,000,000"
    },
    {
      image: "/penthouse.png",
      location: "New Cairo | Mivida",
      title: "The Minimalist Estate",
      price: "EGP 31,200,000"
    }
  ];

  const displayProperties = (properties.length > 0 && !loading) 
    ? properties.slice(0, 3).map(p => ({
        image: p.featuredImage || p.images?.[0] || "/penthouse.png",
        location: `New Cairo | ${p.compound || p.location || 'Premium Location'}`,
        title: p.title || 'Luxury Estate',
        price: `EGP ${p.price?.toLocaleString() || 'Contact for Price'}`
      }))
    : fallbackProperties;

  return (
    /* ─ Root: respects data-theme (dark/light) via CSS vars ─ */
    <div
      className="min-h-[100dvh] overflow-x-hidden selection:bg-[#D4AF37]/30"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* ══════════════ TOP NAV ══════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between
          px-5 md:px-10 transition-all duration-500
          ${isScrolled ? 'py-3 backdrop-blur-2xl shadow-sm' : 'py-5 md:py-6'}
        `}
        style={{
          background: isScrolled ? 'color-mix(in srgb, var(--bg) 88%, transparent)' : 'transparent',
          borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
        }}
      >
        <BrandLogo size="sm" />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {['Portfolio', 'Advisory', 'Intelligence', 'Contact'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[12px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text)' }}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onEnterPortal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-bold uppercase tracking-wider"
            style={{ background: 'var(--text)', color: 'var(--bg)' }}
          >
            <span className="hidden sm:inline">Enter Portal</span>
            <ChevronRight size={14} />
          </motion.button>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2.5 md:hidden rounded-xl"
            style={{ background: 'var(--surface)', color: 'var(--text)' }}
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* ══════════════ MOBILE MENU ══════════════ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[100] flex flex-col p-7"
            style={{ background: 'var(--bg)', paddingTop: 'calc(1.75rem + env(safe-area-inset-top))' }}
          >
            <div className="flex justify-between items-center mb-14">
              <BrandLogo size="md" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: 'var(--surface)', color: 'var(--text)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {['Portfolio', 'Advisory', 'Intelligence', 'Contact'].map((item, i) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1 }}
                  key={item}
                  href="#"
                  className="text-5xl font-medium leading-tight"
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
            </div>

            <div className="mt-auto pb-safe">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                onClick={() => { setMobileMenuOpen(false); onEnterPortal(); }}
                className="w-full py-5 rounded-2xl text-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3"
                style={{ background: 'var(--text)', color: 'var(--bg)' }}
              >
                Advisor Portal <ChevronRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center pt-24 pb-16 px-5 md:px-10 overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-bold uppercase tracking-widest mb-7"
                style={{ borderColor: 'rgba(212,175,55,0.35)', color: '#D4AF37', background: 'rgba(212,175,55,0.07)' }}
              >
                <Sparkles size={13} /> New Cairo's Largest Collection
              </div>

              <h1
                className="text-[14vw] sm:text-[10vw] lg:text-[6vw] leading-[1] font-medium tracking-tighter mb-6"
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
              >
                The Ultimate<br />
                <em className="not-italic" style={{ color: '#D4AF37' }}>Real Estate</em><br />
                <em className="not-italic" style={{ color: '#D4AF37' }}>Gathering.</em>
              </h1>

              <p className="text-base md:text-lg leading-relaxed mb-10 max-w-xl" style={{ color: 'var(--text-dim)' }}>
                Premier platform for rent &amp; resale in New Cairo. AI-powered analysis
                delivering hidden gems and luxury villas at unbeatable prices.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onEnterPortal}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-[14px] font-bold uppercase tracking-wider shadow-lg"
                  style={{ background: 'var(--text)', color: 'var(--bg)' }}
                >
                  Explore New Cairo <ArrowUpRight size={16} />
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-[14px] font-bold uppercase tracking-wider"
                  style={{ border: '1px solid var(--border)', color: 'var(--text)', background: 'var(--surface)' }}
                >
                  <Phone size={15} /> Contact Advisor
                </motion.button>
              </div>

              {/* Stats row — mobile-optimized */}
              <div className="grid grid-cols-3 gap-4 mt-12 pt-10" style={{ borderTop: '1px solid var(--border)' }}>
                {[
                  { value: '1.2K+', label: 'Live Assets' },
                  { value: '98%', label: 'Match Score' },
                  { value: '8+', label: 'Compounds' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl md:text-3xl font-bold" style={{ color: '#D4AF37', fontFamily: 'var(--font-serif)' }}>
                      {stat.value}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest font-bold mt-1" style={{ color: 'var(--text-dim)' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Hero visual card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.25 }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div
              className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl flex items-end"
              style={{ background: 'var(--sb-navy, #0A1628)' }}
            >
              <img
                src="/penthouse.png"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                alt="Luxury Property"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-transparent" />
              <div className="relative z-10 p-8">
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#D4AF37' }}>
                  ● Quiet Luxury Standard
                </div>
                <div className="text-3xl font-medium text-[#F4F0E8]" style={{ fontFamily: 'var(--font-serif)' }}>
                  The Fifth Settlement
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint — mobile only */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden flex flex-col items-center gap-2"
          style={{ color: 'var(--text-dim)' }}
        >
          <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, transparent, var(--text-dim))' }} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
        </motion.div>
      </section>

      {/* ══════════════ BRAND MARQUEE ══════════════ */}
      <section className="py-10" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 px-5">
          {['Emaar', 'SODIC', 'Mountain View', 'Palm Hills', 'Orascom', 'ZED East'].map((brand) => (
            <span key={brand} className="text-base font-bold uppercase tracking-widest opacity-25" style={{ color: 'var(--text)', fontFamily: 'var(--font-serif)' }}>
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* ══════════════ PROPERTIES ══════════════ */}
      <section className="py-20 md:py-32">
        <div className="px-5 md:px-10 max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-8 md:mb-14">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] block mb-3" style={{ color: '#D4AF37' }}>
                Curated Selection
              </span>
              <h2 className="text-4xl md:text-5xl font-medium" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}>
                Featured Assets
              </h2>
            </div>
            <button
              className="hidden md:flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest group"
              style={{ color: 'var(--text)' }}
            >
              View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Mobile: horizontal snap scroll — Desktop: grid */}
        <div className="md:hidden flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory px-5 pb-6 no-scrollbar">
          {displayProperties.map((prop, i) => (
            <PropertyCard key={i} {...prop} index={i} />
          ))}
        </div>
        <div className="hidden md:grid grid-cols-3 gap-8 px-10 max-w-[1400px] mx-auto">
          {displayProperties.map((prop, i) => (
            <PropertyCard key={i} {...prop} index={i} />
          ))}
        </div>

        {/* Mobile "View All" button */}
        <div className="md:hidden px-5 mt-6">
          <button
            className="w-full py-4 rounded-2xl text-[13px] font-bold uppercase tracking-widest"
            style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            View All Listings
          </button>
        </div>
      </section>

      {/* ══════════════ INTELLIGENCE SECTION ══════════════ */}
      <section className="py-20 md:py-32 mx-5 md:mx-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden" style={{ background: '#050B14' }}>
        <div className="px-7 md:px-14 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] block mb-4" style={{ color: '#D4AF37' }}>
                Intelligence Driven
              </span>
              <h2 className="text-4xl md:text-5xl font-medium mb-6 leading-[1.1] text-[#F4F0E8]" style={{ fontFamily: 'var(--font-serif)' }}>
                The Art of<br />Institutional Precision.
              </h2>
              <p className="text-base md:text-lg leading-relaxed mb-10 text-[#F4F0E8]/55 max-w-lg">
                Proprietary AI normalizes real-time data from 1,000+ sources — giving clients an unfair advantage in New Cairo's market.
              </p>

              <div className="grid grid-cols-3 gap-6">
                {[
                  { n: '1.2K+', l: 'Live Assets' },
                  { n: '98%', l: 'Match Score' },
                  { n: '4s', l: 'Avg. Match Time' },
                ].map((s) => (
                  <div key={s.l}>
                    <div className="text-3xl font-bold" style={{ color: '#D4AF37', fontFamily: 'var(--font-serif)' }}>{s.n}</div>
                    <div className="text-[10px] uppercase tracking-widest opacity-40 text-[#F4F0E8] mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: <Globe size={20} />, title: 'AI-Powered Access', desc: 'Instantly filtering noise to surface the best opportunities.' },
                { icon: <Shield size={20} />, title: 'Secure Advisory', desc: 'Privacy-first concierge for rent and resale clients.' },
                { icon: <User size={20} />, title: 'Human Touch', desc: 'Neural matching fused with professional instinct.' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl flex gap-5 items-start group transition-colors duration-300"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37' }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#F4F0E8] mb-1">{feature.title}</h3>
                    <p className="text-sm text-[#F4F0E8]/45 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA FOOTER BAND ══════════════ */}
      <section className="py-20 md:py-28 px-5 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] block mb-5" style={{ color: '#D4AF37' }}>
            Begin Your Journey
          </span>
          <h2 className="text-5xl md:text-6xl font-medium mb-8" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}>
            Find Your Place<br />in New Cairo.
          </h2>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onEnterPortal}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-[14px] font-bold uppercase tracking-wider shadow-xl"
            style={{ background: 'var(--text)', color: 'var(--bg)' }}
          >
            Enter Advisor Portal <ChevronRight size={16} />
          </motion.button>
        </motion.div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="px-5 md:px-10 pb-10 pt-12" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between gap-10">
          <div>
            <BrandLogo size="md" />
            <p className="mt-5 text-sm leading-relaxed max-w-xs italic" style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-serif)' }}>
              "Real estate in New Cairo is no longer just about locations — it is about data, desire, and design."
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10">
            {[
              { title: 'Discovery', links: ['Residential', 'Commercial', 'Investment'] },
              { title: 'Company', links: ['About Us', 'Advisors', 'Contact'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-5 opacity-40" style={{ color: 'var(--text)' }}>
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-[13px] font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity" style={{ color: 'var(--text)' }}>
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto mt-10 pt-6 flex flex-col sm:flex-row justify-between gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-[11px] uppercase tracking-widest font-bold opacity-30" style={{ color: 'var(--text)' }}>
            © 2026 Sierra Blu Realty. All Rights Reserved.
          </span>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms'].map((l) => (
              <a key={l} href="#" className="text-[11px] uppercase tracking-widest font-bold opacity-30 hover:opacity-60 transition-opacity" style={{ color: 'var(--text)' }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
