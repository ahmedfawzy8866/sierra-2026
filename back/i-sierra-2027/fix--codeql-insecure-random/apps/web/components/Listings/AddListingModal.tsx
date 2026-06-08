"use client";
import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, getAnalyticsInstance } from '../../lib/firebase';
import { logEvent } from 'firebase/analytics';
import { useAuth } from '../../lib/AuthContext';
import { Listing } from './ListingsHub';

interface AddListingModalProps {
  onClose: () => void;
  onSuccess: () => void;
  listing?: Listing | null;
}

export default function AddListingModal({ onClose, onSuccess, listing }: AddListingModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    area: 'Hyde Park',
    type: 'Apartment',
    status: 'Available' as any,
    price: '',
    beds: 3,
    baths: 2,
    sqm: 150,
    imageUrl: '',
    description: '',
    isFeatured: false,
    // Spatial Intelligence & Virtual Presence
    coordinates: { lat: 30.0444, lng: 31.2357 },
    virtualTourUrl: '',
    // Codex fields
    orchestrationStage: 'S2' as 'S1' | 'S2' | 'S3' | 'S4',
    ownerType: 'Owner' as 'Owner' | 'Broker' | 'Internal',
    brandingReady: false,
    publishingReady: false,
    whatsappReady: false,
  });

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title,
        location: listing.location,
        area: listing.area,
        type: listing.type,
        status: listing.status,
        price: listing.price.replace('EGP ', ''),
        beds: listing.beds,
        baths: listing.baths,
        sqm: listing.sqm,
        imageUrl: listing.imageUrl || '',
        description: listing.description || '',
        isFeatured: listing.isFeatured || false,
        coordinates: (listing as any).coordinates || { lat: 30.0444, lng: 31.2357 },
        virtualTourUrl: (listing as any).virtualTourUrl || '',
        orchestrationStage: listing.orchestrationState?.stage || 'S2',
        ownerType: listing.ownerType || 'Owner',
        brandingReady: listing.automation?.brandingReady || false,
        publishingReady: listing.automation?.publishingReady || false,
        whatsappReady: listing.automation?.whatsappReady || false,
      });
      return;
    }

    setFormData(DEFAULT_FORM_DATA);
  }, [listing]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user) {
      alert('Authentication required for storage access.');
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `listings/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(uploadResult.ref);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error("Storage upload error:", error);
      alert('Failed to upload high-fidelity asset image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedPrice = formData.price.startsWith('EGP') ? formData.price : `EGP ${formData.price}`;
      
      const payload = {
        title: formData.title,
        location: formData.location,
        area: formData.area,
        type: formData.type,
        status: formData.status,
        price: formattedPrice,
        beds: formData.beds,
        baths: formData.baths,
        sqm: formData.sqm,
        imageUrl: formData.imageUrl,
        description: formData.description,
        isFeatured: formData.isFeatured,
        coordinates: formData.coordinates,
        virtualTourUrl: formData.virtualTourUrl,
        agent: listing?.agent || user?.displayName || user?.email?.split('@')[0] || 'Unknown Agent',
        orchestrationState: {
          stage: formData.orchestrationStage,
          lastTriggeredAt: serverTimestamp(),
        },
        automation: {
          brandingReady: formData.brandingReady,
          publishingReady: formData.publishingReady,
          whatsappReady: formData.whatsappReady,
          isPublishedToPF: listing?.automation?.isPublishedToPF || false,
        },
        ownerType: formData.ownerType,
        updatedAt: serverTimestamp(),
      };

      if (listing?.docId) {
        await updateDoc(doc(db, 'listings', listing.docId), payload);
      } else if (listing) {
        console.warn('Editing demo data creates a new saved listing.');
        await addDoc(collection(db, 'listings'), {
          ...payload,
          id: listing.id,
          createdAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'listings'), {
          ...payload,
          id: createListingId(),
          listedDays: 0,
          createdAt: serverTimestamp(),
        });
      }
      
      const analytics = await getAnalyticsInstance();
      if (analytics) {
        logEvent(analytics, listing?.docId ? 'listing_updated' : 'listing_created', {
          title: payload.title,
          type: payload.type,
          price: payload.price
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving listing:", error);
      alert('We could not save the listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(6, 12, 26, 0.8)',
      backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div className="card shadow-gold" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="card-header" style={{ justifyContent: 'space-between' }}>
          <span className="card-title">
            {listing ? '✨ Refine Asset Specifications' : '✨ Authorize Portfolio Entry'}
          </span>
          <button className="btn-ghost" onClick={onClose} style={{ fontSize: '24px', opacity: 0.7 }}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '24px' }}>
          <div className="form-group mb-4">
            <label className="form-label">Asset Identity (Title)</label>
            <input 
              required
              type="text" 
              className="form-input" 
              placeholder="e.g. Luxury Penthouse with Lake View"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="mb-4">
            <div className="form-group">
              <label className="form-label">Geographic Location</label>
              <input 
                required
                type="text" 
                className="form-input" 
                placeholder="e.g. New Cairo"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Strategic Area (Compound)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Hyde Park"
                value={formData.area}
                onChange={e => setFormData({...formData, area: e.target.value})}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="mb-4">
            <div className="form-group">
              <label className="form-label">Architectural Typology</label>
              <select className="form-select" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option>Apartment</option>
                <option>Villa</option>
                <option>Townhouse</option>
                <option>Penthouse</option>
                <option>Chalet</option>
                <option>Studio</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Portfolio Status</label>
              <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                <option>Available</option>
                <option>Reserved</option>
                <option>Pending</option>
                <option>Sold</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="mb-4">
            <div className="form-group">
              <label className="form-label">Orchestration Stage (Codex)</label>
              <select className="form-select select-gold" value={formData.orchestrationStage} onChange={e => setFormData({...formData, orchestrationStage: e.target.value as any})}>
                <option value="S1">S1: Data Acquisition</option>
                <option value="S2">S2: AI Listing Engine</option>
                <option value="S3">S3: Branding & Storage</option>
                <option value="S4">S4: Distribution Engine</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ownership Categorization</label>
              <select className="form-select" value={formData.ownerType} onChange={e => setFormData({...formData, ownerType: e.target.value as any})}>
                <option value="Owner">Direct Owner</option>
                <option value="Broker">Broker Partnership</option>
                <option value="Internal">Sierra Blue Internal</option>
              </select>
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Market Valuation (Asking Price)</label>
            <div className="input-prefix gold-border">
              <span>EGP</span>
              <input 
                required
                type="text" 
                placeholder="e.g. 5,500,000"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }} className="mb-4">
            <div className="form-group">
              <label className="form-label">Beds</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.beds}
                onChange={e => setFormData({...formData, beds: parseIntegerInput(e.target.value, formData.beds)})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Baths</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.baths}
                onChange={e => setFormData({...formData, baths: parseIntegerInput(e.target.value, formData.baths)})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Footprint (m²)</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.sqm}
                onChange={e => setFormData({...formData, sqm: parseIntegerInput(e.target.value, formData.sqm)})}
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label text-gold/80 flex items-center gap-2">
              <span>📍 Geospatial Coordinates</span>
              <span className="text-[10px] opacity-50 uppercase tracking-tighter">(Latitude, Longitude)</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input 
                type="number" 
                step="0.000001"
                className="form-input" 
                placeholder="Lat: 30.0444"
                value={formData.coordinates.lat}
                onChange={e => setFormData({...formData, coordinates: {...formData.coordinates, lat: parseFloat(e.target.value)}})}
              />
              <input 
                type="number" 
                step="0.000001"
                className="form-input" 
                placeholder="Lng: 31.2357"
                value={formData.coordinates.lng}
                onChange={e => setFormData({...formData, coordinates: {...formData.coordinates, lng: parseFloat(e.target.value)}})}
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label flex items-center gap-2">
              <span>🕶️ 360° Virtual Tour URL</span>
              <span className="badge badge-gold-sm">Premium Feature</span>
            </label>
            <input 
              type="url" 
              className="form-input" 
              placeholder="https://sierrablu.com/tours/..."
              value={formData.virtualTourUrl}
              onChange={e => setFormData({...formData, virtualTourUrl: e.target.value})}
            />
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Asset Narrative (Description)</label>
            <textarea 
              className="form-input" 
              rows={3}
              placeholder="The architectural narrative of this residence..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="form-group mb-4 p-4 rounded-xl bg-gold/5 border border-gold/10">
            <label className="form-label mb-3">Automation Readiness Protocols</label>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.brandingReady} onChange={e => setFormData({...formData, brandingReady: e.target.checked})} className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-gold/80">Branding Ready</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.publishingReady} onChange={e => setFormData({...formData, publishingReady: e.target.checked})} className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-gold/80">Market Sync Ready</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.whatsappReady} onChange={e => setFormData({...formData, whatsappReady: e.target.checked})} className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-gold/80">WhatsApp Broadcast</span>
              </label>
            </div>
          </div>

          <div className="form-group mb-4 flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={e => setFormData({...formData, isFeatured: e.target.checked})}
              className="w-4 h-4"
            />
            <label htmlFor="isFeatured" className="form-label mb-0 cursor-pointer">Promote to Featured Collection (Landing Page)</label>
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Property Visualization (Main Image)</label>
            <div 
              className={`image-upload-zone ${uploading ? 'uploading' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              style={{
                height: '140px',
                border: '2px dashed var(--gold-primary)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: formData.imageUrl ? `url(${formData.imageUrl}) center/cover` : 'rgba(212, 175, 55, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {!formData.imageUrl && !uploading && (
                <>
                  <span style={{ fontSize: '24px', marginBottom: '8px' }}>📸</span>
                  <span style={{ color: 'var(--gold-primary)', fontSize: '14px' }}>Upload Asset Media</span>
                </>
              )}
              {uploading && (
                <div className="loader-inner sm"></div>
              )}
              {formData.imageUrl && !uploading && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                }} className="hover-visible">
                  <span style={{ color: 'white' }}>Change Media</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Abort</button>
            <button type="submit" className="btn btn-primary shadow-gold" style={{ flex: 2 }} disabled={loading || uploading}>
              {loading ? 'Committing to Blockchain...' : (listing ? 'Confirm Specification' : 'Authorize Portfolio Entry')}
            </button>
          </div>
        </form>
      </div>
      
      <style>{`
        .image-upload-zone:hover .hover-visible {
          opacity: 1 !important;
        }
        .gold-border {
          border-color: var(--gold-primary) !important;
        }
        .mb-4 { margin-bottom: 20px; }
      `}</style>
    </div>
  );
}

const DEFAULT_FORM_DATA = {
  title: '',
  location: '',
  area: 'Hyde Park',
  type: 'Apartment',
  status: 'Available' as any,
  price: '',
  beds: 3,
  baths: 2,
  sqm: 150,
  imageUrl: '',
  description: '',
  isFeatured: false,
  coordinates: { lat: 30.0444, lng: 31.2357 },
  virtualTourUrl: '',
  orchestrationStage: 'S2' as 'S1' | 'S2' | 'S3' | 'S4',
  ownerType: 'Owner' as 'Owner' | 'Broker' | 'Internal',
  brandingReady: false,
  publishingReady: false,
  whatsappReady: false,
};

function createListingId() {
  return `P-${Math.floor(1000 + Math.random() * 9000)}`;
}

function parseIntegerInput(val: string, fallback: number): number {
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? fallback : parsed;
}
