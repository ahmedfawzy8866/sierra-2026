'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InventoryService, Property } from '@/lib/services/InventoryService';
import { useI18n } from '@/lib/I18nContext';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, dir } = useI18n();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (id) {
      InventoryService.getProperty(id as string).then(data => {
        setProperty(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (!mounted) return null;

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="label-sm text-secondary animate-pulse">Synchronizing Intelligence...</div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="display-lg text-2xl">Asset Not Found.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface" dir={dir}>
      {/* ══ HEADER ══ */}
      <nav className="fixed top-0 inset-x-0 z-50 h-20 glass flex items-center justify-between px-8 md:px-16">
        <button onClick={() => router.back()} className="label-sm text-secondary hover:text-primary transition-colors flex items-center gap-2">
          ← {t('common.back')}
        </button>
        <div className="font-display font-extrabold tracking-tight text-primary text-xl uppercase">SIERRA BLU</div>
        <button className="label-sm bg-primary text-on-primary px-6 py-2 rounded">Concierge</button>
      </nav>

      {/* ══ HERO ══ */}
      <section className="relative h-[65vh] pt-20 overflow-hidden bg-surface-container-high">
        <img 
          src={property.propertyType === 'villa' ? '/villa.png' : '/penthouse.png'} 
          className="w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
        <div className="absolute bottom-16 left-8 md:left-16 right-8">
          <span className="label-sm text-secondary mb-4 block">{property.compound} · {property.location}</span>
          <h1 className="display-lg text-4xl md:text-7xl mb-6 text-primary">{property.title}</h1>
          <div className="font-mono text-3xl text-secondary">EGP {property.price.toLocaleString()}</div>
        </div>
      </section>

      {/* ══ CONTENT ══ */}
      <section className="max-w-7xl mx-auto px-8 md:px-16 py-20 grid lg:grid-cols-[1fr_360px] gap-20">
        <div className="space-y-16">
          {/* Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-12 border-y border-outline-variant">
            {[
              { label: 'Asset Type', val: property.propertyType },
              { label: 'Area', val: `${property.area} m²` },
              { label: 'Bedrooms', val: property.bedrooms },
              { label: 'Valuation', val: 'Optimum' }
            ].map((spec, i) => (
              <div key={i}>
                <div className="label-sm text-on-surface-variant mb-2">{spec.label}</div>
                <div className="font-display font-bold text-xl text-primary capitalize">{spec.val}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="max-w-2xl">
            <h3 className="headline-sm mb-8 text-primary">Strategic Asset Overview</h3>
            <div className="w-12 h-px bg-secondary mb-8" />
            <p className="text-on-surface-variant font-light leading-relaxed text-lg mb-8">
              A rare {property.propertyType} positioned within the high-velocity {property.compound} corridor. 
              Built to capture the optimum market yield while maintaining the privacy and prestige expected of a Sierra Blu listing.
            </p>
            <p className="text-on-surface-variant font-light leading-relaxed text-lg italic">
              "This unit has been manually vetted by our Senior Intelligence Analysts and meets all DQE standards for resale liquidity."
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="bg-surface-container-low p-10 rounded-xl shadow-ambient border border-outline-variant text-center">
            <span className="label-sm text-secondary mb-6 block">Ready to proceed?</span>
            <div className="font-display text-2xl font-bold text-primary mb-10">Acquisition Protocol</div>
            <button 
              onClick={() => setContactOpen(true)}
              className="w-full py-4 bg-primary text-on-primary rounded font-display font-bold text-[10px] tracking-widest uppercase mb-4 hover:bg-primary-container transition-all"
            >
              Schedule Inspection
            </button>
            <button className="w-full py-4 border border-outline-variant text-on-surface-variant rounded font-display font-bold text-[10px] tracking-widest uppercase hover:border-secondary transition-all">
              Request Brochure
            </button>
          </div>

          <div className="p-8 border border-outline-variant rounded-xl flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-xl">◈</div>
            <div>
              <div className="label-sm text-secondary mb-1">Sierra AI</div>
              <div className="text-sm font-bold text-primary">ROI Explanation Ready</div>
            </div>
          </div>
        </aside>
      </section>

      {/* ══ MODAL ══ */}
      {contactOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-md" onClick={() => setContactOpen(false)} />
          <div className="relative glass p-12 max-w-md w-full rounded-2xl shadow-ambient animate-[fadeUp_0.4s_ease]">
            <span className="label-sm text-secondary mb-3 block">Viewing Request</span>
            <h2 className="headline-sm text-primary mb-10">{property.title}</h2>
            
            <form className="space-y-4" onSubmit={async (e) => { 
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const payload = {
                propertyCode: property.id,
                visitorName: formData.get('name'),
                visitorEmail: formData.get('email'),
                visitorPhone: formData.get('phone'),
              };

              try {
                const res = await fetch('/api/closer/initiate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                const data = await res.json();
                
                if (data.success) {
                  setContactOpen(false);
                  alert(`Intelligence Synchronized.\n\nLeila (AI): "${data.introMessage}"`);
                } else {
                  throw new Error(data.error);
                }
              } catch (err) {
                alert('Connection Error: Pipeline could not be established.');
              }
            }}>
              <input 
                name="name"
                type="text"
                placeholder="Full Name"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded p-4 outline-none focus:border-secondary transition-all"
                required
              />
              <input 
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded p-4 outline-none focus:border-secondary transition-all"
                required
              />
              <input 
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded p-4 outline-none focus:border-secondary transition-all"
                required
              />
              <button className="w-full py-5 bg-primary text-on-primary rounded font-display font-bold text-xs tracking-[0.2em] uppercase mt-4">
                Initialize Contact
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
