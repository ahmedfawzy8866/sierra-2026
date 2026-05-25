"use client";
import React, { useState } from 'react';
import { parseRawTextToProperty, Property } from '../../lib/firebase/inventory';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Clipboard, CheckCircle2 } from 'lucide-react';
import PropertyForm from './PropertyForm';

interface PasteUnitProps {
  onSave: (prop: Partial<Property>) => Promise<void>;
  onClose: () => void;
}

export default function PasteUnit({ onSave, onClose }: PasteUnitProps) {
  const [rawText, setRawText] = useState('');
  const [parsedData, setParsedData] = useState<Partial<Property> | null>(null);
  const [step, setStep] = useState<'input' | 'review'>('input');

  const handleParse = () => {
    if (!rawText.trim()) return;
    const data = parseRawTextToProperty(rawText);
    setParsedData(data);
    setStep('review');
  };

  const examples = [
    "Apartment for rent in Mivida - 3 bedrooms - furnished - 85K EGP/month - 200 sqm",
    "فاريا ميفيدا للايجار 3 غرف مفروشة بـ 85 الف جنيه شهريا بمساحة 200 متر",
    "Hyde Park villa for sale - 5 bed - 350 sqm - price 25M EGP - semi furnished"
  ];

  if (step === 'review' && parsedData) {
    return (
      <PropertyForm 
        property={parsedData as Property} 
        onSave={onSave} 
        onClose={() => setStep('input')} 
      />
    );
  }

  return (
    <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="paste-container"
        style={{ 
          width: '600px', 
          background: 'white', 
          borderRadius: '24px', 
          padding: '32px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          position: 'relative'
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'var(--navy)', color: 'var(--gold)' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Intelligence Hub: Text Import</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>Paste raw property details to auto-parse asset attributes</p>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Raw Intelligence Input</label>
          <div style={{ position: 'relative' }}>
            <textarea 
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="Paste WhatsApp listing or property description here..."
              style={{ 
                width: '100%', 
                height: '240px', 
                padding: '20px', 
                borderRadius: '16px', 
                border: '1px solid #E2E8F0',
                fontSize: '15px',
                lineHeight: '1.6',
                outline: 'none',
                resize: 'none'
              }}
            />
            {!rawText && (
              <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: '#CBD5E1' }}>
                <Clipboard size={48} opacity={0.2} />
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#94A3B8', marginBottom: '8px' }}>Sample Patterns Supported</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {examples.map((ex, i) => (
              <div key={i} onClick={() => setRawText(ex)} style={{ fontSize: '12px', color: '#64748B', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', border: '1px dashed #E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                "{ex}"
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleParse}
          disabled={!rawText.trim()}
          style={{ 
            width: '100%', 
            padding: '16px', 
            borderRadius: '12px', 
            border: 'none', 
            background: 'var(--navy)', 
            color: 'white', 
            fontWeight: 600, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            opacity: rawText.trim() ? 1 : 0.5
          }}
        >
          <CheckCircle2 size={18} color="var(--gold)" />
          Parse & Reconstruct Asset
        </button>
      </motion.div>
    </div>
  );
}
