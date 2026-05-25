"use client";
import React, { useState, useEffect } from 'react';
import { 
  Property, 
  generateUnitCode, 
  generateNormalizedKey, 
  COMPOUND_CODES, 
  FurnishingStatus, 
  OfferType, 
  ListingType, 
  PropertyStatus, 
  Currency 
} from '../../lib/firebase/inventory';
import { X, Save, Plus, Trash2, MapPin, DollarSign, Home, Layout, Ruler, Images, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PropertyFormProps {
  property?: Property;
  onSave: (prop: Partial<Property>) => Promise<void>;
  onClose: () => void;
}

export default function PropertyForm({ property, onSave, onClose }: PropertyFormProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<Partial<Property>>(property || {
    status: 'draft',
    offer_type: 'sale',
    listing_type: 'resale',
    currency: 'EGP',
    furnishing: 'unfurnished',
    bedrooms: 1,
    bathrooms: 1,
    bua_m2: 0,
    price: 0,
    is_public: true,
    is_featured: false,
    stale_flag: false,
    gallery_urls: [],
    compound_name: '',
    compound_code: ''
  });

  const [saving, setSaving] = useState(false);

  // Auto-generate Unit Code
  useEffect(() => {
    const code = generateUnitCode(formData);
    setFormData(prev => ({ ...prev, unit_code: code }));
  }, [formData.compound_name, formData.bedrooms, formData.furnishing, formData.price, formData.currency, formData.offer_type]);

  const handleChange = (field: keyof Property, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-set compound code
    if (field === 'compound_name') {
      const code = COMPOUND_CODES[value.toLowerCase()] || value.substring(0, 2).toUpperCase();
      setFormData(prev => ({ ...prev, compound_name: value, compound_code: code }));
    }
  };

  const handleSave = async () => {
    if (!formData.title_en || !formData.compound_name || !formData.price) {
      alert("Please fill in main fields (Title, Compound, Price)");
      return;
    }
    
    try {
      setSaving(true);
      const normalizedKey = generateNormalizedKey(formData);
      await onSave({ ...formData, normalized_key: normalizedKey });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 0, label: 'Basic Info', icon: <Home size={16} /> },
    { id: 1, label: 'Location', icon: <MapPin size={16} /> },
    { id: 2, label: 'Specs', icon: <Ruler size={16} /> },
    { id: 3, label: 'Pricing', icon: <DollarSign size={16} /> },
    { id: 4, label: 'Media', icon: <Images size={16} /> },
    { id: 5, label: 'Flags', icon: <Flag size={16} /> }
  ];

  return (
    <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="form-container"
        style={{ 
          width: '900px', 
          maxWidth: '95vw', 
          height: '80vh', 
          background: 'white', 
          borderRadius: '24px', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px', background: 'var(--navy)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>{property ? 'Modify Asset' : 'Incorporate New Asset'}</h2>
            <div style={{ color: 'var(--gold)', fontSize: '12px', fontFamily: 'monospace', marginTop: '4px' }}>CODE: {formData.unit_code}</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Sidebar & Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Tabs Navigation */}
          <div style={{ width: '200px', background: '#F8FAFC', borderRight: '1px solid #E2E8F0', padding: '12px' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === tab.id ? 'white' : 'transparent',
                  color: activeTab === tab.id ? 'var(--navy)' : '#64748B',
                  boxShadow: activeTab === tab.id ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  transition: 'all 0.2s',
                  marginBottom: '4px'
                }}
              >
                <span style={{ color: activeTab === tab.id ? 'var(--gold)' : 'inherit' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 0 && (
                  <div style={{ display: 'grid', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="input-group">
                        <label>Title (English)</label>
                        <input value={formData.title_en || ''} onChange={e => handleChange('title_en', e.target.value)} placeholder="e.g. Modern Apartment with Lake View" />
                      </div>
                      <div className="input-group" dir="rtl">
                        <label>العنوان (العربية)</label>
                        <input value={formData.title_ar || ''} onChange={e => handleChange('title_ar', e.target.value)} placeholder="مثلاً: شقة مودرن بفيو بحيرة" style={{ fontFamily: 'Cairo, sans-serif' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div className="input-group">
                        <label>Offer Type</label>
                        <select value={formData.offer_type} onChange={e => handleChange('offer_type', e.target.value)}>
                          <option value="sale">Sale</option>
                          <option value="rent">Rent</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Listing Type</label>
                        <select value={formData.listing_type} onChange={e => handleChange('listing_type', e.target.value)}>
                          <option value="resale">Resale</option>
                          <option value="primary">Primary</option>
                          <option value="landlord_direct">Direct from Owner</option>
                          <option value="developer_inventory">Developer Inventory</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Status</label>
                        <select value={formData.status} onChange={e => handleChange('status', e.target.value)}>
                          <option value="draft">Draft</option>
                          <option value="available">Available</option>
                          <option value="reserved">Reserved</option>
                          <option value="sold">Sold</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 1 && (
                  <div style={{ display: 'grid', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="input-group">
                        <label>Compound Name</label>
                        <input value={formData.compound_name || ''} onChange={e => handleChange('compound_name', e.target.value)} placeholder="e.g. Mivida" />
                      </div>
                      <div className="input-group">
                        <label>Area Slug</label>
                        <select value={formData.area_slug} onChange={e => handleChange('area_slug', e.target.value)}>
                          <option value="new_cairo">New Cairo</option>
                          <option value="fifth_settlement">Fifth Settlement</option>
                          <option value="sheikh_zayed">Sheikh Zayed</option>
                        </select>
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Address Text</label>
                      <textarea value={formData.address_text || ''} onChange={e => handleChange('address_text', e.target.value)} style={{ minHeight: '100px' }} />
                    </div>
                  </div>
                )}

                {activeTab === 2 && (
                  <div style={{ display: 'grid', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div className="input-group">
                        <label>Bedrooms</label>
                        <input type="number" value={formData.bedrooms || 0} onChange={e => handleChange('bedrooms', parseInt(e.target.value))} />
                      </div>
                      <div className="input-group">
                        <label>Bathrooms</label>
                        <input type="number" value={formData.bathrooms || 0} onChange={e => handleChange('bathrooms', parseInt(e.target.value))} />
                      </div>
                      <div className="input-group">
                        <label>BUA (sqm)</label>
                        <input type="number" value={formData.bua_m2 || 0} onChange={e => handleChange('bua_m2', parseInt(e.target.value))} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="input-group">
                        <label>Furnishing</label>
                        <select value={formData.furnishing} onChange={e => handleChange('furnishing', e.target.value)}>
                          <option value="unfurnished">Unfurnished</option>
                          <option value="semi-furnished">Semi-Furnished</option>
                          <option value="furnished">Fully Furnished</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Finishing</label>
                        <select value={formData.finishing} onChange={e => handleChange('finishing', e.target.value)}>
                          <option value="core">Core & Shell</option>
                          <option value="semi">Semi Finished</option>
                          <option value="fully">Fully Finished</option>
                          <option value="ultra-luxury">Ultra Luxury</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 3 && (
                  <div style={{ display: 'grid', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                      <div className="input-group">
                        <label>Price</label>
                        <input type="number" value={formData.price || 0} onChange={e => handleChange('price', parseFloat(e.target.value))} style={{ fontSize: '24px', fontWeight: 600 }} />
                      </div>
                      <div className="input-group">
                        <label>Currency</label>
                        <select value={formData.currency} onChange={e => handleChange('currency', e.target.value)}>
                          <option value="EGP">EGP</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="input-group">
                        <label>Payment Type</label>
                        <select value={formData.payment_type} onChange={e => handleChange('payment_type', e.target.value)}>
                          <option value="cash">Cash</option>
                          <option value="installment">Installment</option>
                          <option value="both">Both</option>
                        </select>
                      </div>
                      <div className="input-group">
                        <label>Installment Years</label>
                        <input type="number" value={formData.installment_years || 0} onChange={e => handleChange('installment_years', parseInt(e.target.value))} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 4 && (
                  <div style={{ display: 'grid', gap: '24px' }}>
                    <div className="input-group">
                      <label>Cover Image URL</label>
                      <input value={formData.cover_image_url || ''} onChange={e => handleChange('cover_image_url', e.target.value)} placeholder="https://..." />
                    </div>
                    {formData.cover_image_url && (
                      <div style={{ width: '100%', height: '200px', borderRadius: '12px', background: '#f0f0f0', overflow: 'hidden' }}>
                        <img src={formData.cover_image_url} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div className="input-group">
                      <label>Gallery (comma separated URLs)</label>
                      <textarea 
                        value={formData.gallery_urls?.join(', ') || ''} 
                        onChange={e => handleChange('gallery_urls', e.target.value.split(',').map(s => s.trim()))} 
                        style={{ minHeight: '80px' }}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 5 && (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#F8FAFC', borderRadius: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>Featured Asset</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>Show prominent high-conversion badge and priority list placement</div>
                      </div>
                      <input type="checkbox" checked={formData.is_featured} onChange={e => handleChange('is_featured', e.target.checked)} style={{ width: '20px', height: '20px' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#F8FAFC', borderRadius: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>Public Visibility</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>If disabled, this asset is only visible to internal strategic personnel</div>
                      </div>
                      <input type="checkbox" checked={formData.is_public} onChange={e => handleChange('is_public', e.target.checked)} style={{ width: '20px', height: '20px' }} />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: '#F8FAFC' }}>
          <button 
            onClick={onClose}
            style={{ 
              padding: '12px 24px', 
              borderRadius: '12px', 
              border: '1px solid #E2E8F0', 
              background: 'white', 
              fontWeight: 600, 
              cursor: 'pointer' 
            }}
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            style={{ 
              padding: '12px 32px', 
              borderRadius: '12px', 
              border: 'none', 
              background: 'var(--navy)', 
              color: 'white', 
              fontWeight: 600, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'opacity 0.2s'
            }}
          >
            {saving ? 'Synchronizing...' : (
              <>
                <Save size={18} color="var(--gold)" />
                Finalize Asset
              </>
            )}
          </button>
        </div>
      </motion.div>

      <style>{`
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .input-group label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }
        .input-group input, .input-group select, .input-group textarea {
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #E2E8F0;
          font-size: 15px;
          transition: border-color 0.2s;
        }
        .input-group input:focus, .input-group select:focus, .input-group textarea:focus {
          outline: none;
          border-color: var(--gold);
        }
      `}</style>
    </div>
  );
}
