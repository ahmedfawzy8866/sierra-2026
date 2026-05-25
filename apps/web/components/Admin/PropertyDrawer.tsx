"use client";
import React from 'react';
import { Property, generateUnitCode } from '../../lib/firebase/inventory';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Ruler, Bed, Bath, Edit3, Globe, Star, Share2, Trash2 } from 'lucide-react';

interface PropertyDrawerProps {
  property: Property | null;
  onClose: () => void;
  onEdit: (prop: Property) => void;
  onDelete: (id: string) => void;
}

export default function PropertyDrawer({ property, onClose, onEdit, onDelete }: PropertyDrawerProps) {
  if (!property) return null;

  const statusColors = {
    available: '#22C55E',
    reserved: '#F59E0B',
    sold: '#EF4444',
    draft: '#64748B',
    archived: '#94A3B8'
  };

  return (
    <AnimatePresence>
      <div 
        className="drawer-overlay" 
        style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', 
          zIndex: 1100, backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'flex-end'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{ 
            width: '500px', maxWidth: '100vw', background: 'white', 
            height: '100%', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Top Header / Close */}
          <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10 }}>
            <button 
              onClick={onClose}
              style={{ padding: '10px', borderRadius: '50%', background: 'white', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Hero Image */}
          <div style={{ height: '300px', background: '#f0f0f0', position: 'relative', overflow: 'hidden' }}>
            {property.cover_image_url ? (
              <img src={property.cover_image_url} alt={property.title_en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1' }}>
                <Globe size={64} />
              </div>
            )}
            <div style={{ 
              position: 'absolute', bottom: '24px', left: '24px', 
              background: 'rgba(10, 22, 40, 0.8)', padding: '6px 16px', 
              borderRadius: '8px', color: 'var(--gold)', fontFamily: 'monospace', 
              fontSize: '14px', letterSpacing: '1px', backdropFilter: 'blur(8px)'
            }}>
              {property.unit_code}
            </div>
          </div>

          {/* Details Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ 
                background: statusColors[property.status], color: 'white', 
                padding: '4px 12px', borderRadius: '6px', fontSize: '11px', 
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' 
              }}>
                {property.status}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {property.is_featured && <Star size={18} color="var(--gold)" fill="var(--gold)" />}
                {property.is_public ? <Globe size={18} color="#22C55E" /> : <X size={18} color="#EF4444" />}
              </div>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>{property.title_en}</h1>
            <h2 dir="rtl" style={{ fontSize: '20px', fontWeight: 600, color: '#475569', marginBottom: '24px', fontFamily: 'Cairo' }}>{property.title_ar}</h2>

            {/* Price section */}
            <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', marginBottom: '32px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--navy)' }}>{property.price.toLocaleString()}</span>
              <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gold)' }}>{property.currency}</span>
              <span style={{ fontSize: '14px', color: '#94A3B8', marginLeft: 'auto' }}>
                {property.offer_type === 'sale' ? 'Total Value' : 'Per Month'}
              </span>
            </div>

            {/* Specs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <div className="spec-card">
                <Bed size={20} color="var(--gold)" />
                <div className="spec-val">{property.bedrooms}</div>
                <div className="spec-lab">Bedrooms</div>
              </div>
              <div className="spec-card">
                <Bath size={20} color="var(--gold)" />
                <div className="spec-val">{property.bathrooms}</div>
                <div className="spec-lab">Bathrooms</div>
              </div>
              <div className="spec-card">
                <Ruler size={20} color="var(--gold)" />
                <div className="spec-val">{property.bua_m2}</div>
                <div className="spec-lab">BUA sqm</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', marginBottom: '32px' }}>
              <MapPin size={18} color="var(--gold)" />
              <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{property.compound_name}</span>
              <span>•</span>
              <span>{property.area_slug.replace('_', ' ').toUpperCase()}</span>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: '#94A3B8', marginBottom: '12px' }}>Asset Description</h3>
              <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '15px', marginBottom: '16px' }}>{property.description_en || 'No English description provided.'}</p>
              <p dir="rtl" style={{ color: '#475569', lineHeight: '1.6', fontSize: '15px', fontFamily: 'Cairo' }}>{property.description_ar || 'لا يوجد وصف متاح.'}</p>
            </div>

            {/* Gallery */}
            {property.gallery_urls && property.gallery_urls.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: '#94A3B8', marginBottom: '12px' }}>Visual Portfolio</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {property.gallery_urls.slice(0, 4).map((url, i) => (
                    <img key={i} src={url} alt="Gallery" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div style={{ padding: '24px', borderTop: '1px solid #E2E8F0', background: 'white', display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => onEdit(property)}
              style={{ 
                flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--gold)', 
                background: 'white', color: 'var(--navy)', fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' 
              }}
            >
              <Edit3 size={18} />
              Modify
            </button>
            <button 
              onClick={() => onDelete(property.id!)}
              style={{ 
                padding: '12px', borderRadius: '12px', border: 'none', 
                background: '#FEF2F2', color: '#EF4444', cursor: 'pointer' 
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      <style>{`
        .spec-card {
          padding: 16px;
          background: #F8FAFC;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .spec-val {
          font-weight: 700;
          color: var(--navy);
          font-size: 18px;
        }
        .spec-lab {
          font-size: 11px;
          color: #94A3B8;
          text-transform: uppercase;
        }
      `}</style>
    </AnimatePresence>
  );
}
