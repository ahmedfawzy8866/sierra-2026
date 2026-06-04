"use client";
import React, { useState } from 'react';
import { Listing } from './ListingsHub';

interface ShareModalProps {
  listing: Listing;
  onClose: () => void;
}

export default function ShareListingModal({ listing, onClose }: ShareModalProps) {
  const [agentMessage, setAgentMessage] = useState(`Take a look at this Sierra Blu listing: ${listing.title} in ${listing.location}.`);
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://sierrablurealty.com/listings/${listing.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${agentMessage}\n\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWA = () => {
    const msg = encodeURIComponent(`${agentMessage}\n\n${shareUrl}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const shareFB = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '90%' }}>
        <div className="modal-header">
          <h2 className="modal-title">✨ Share Listing</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Property Preview Card */}
          <div className="prop-card" style={{ marginBottom: '24px', boxShadow: 'none', border: '1px solid var(--border)' }}>
            <div className="prop-img" style={{ height: '180px' }}>
              <div className="prop-img-placeholder" style={{ fontSize: '48px' }}>🏘️</div>
              <div className="prop-price" style={{ bottom: '12px', right: '12px', fontSize: '18px' }}>{listing.price}</div>
            </div>
            <div className="prop-body" style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{listing.title}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>📍 {listing.location}</p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Personal message</label>
            <textarea
              className="form-input"
              rows={3}
              value={agentMessage}
              onChange={e => setAgentMessage(e.target.value)}
              style={{ resize: 'none', fontSize: '13px' }}
            />
          </div>

          <div className="share-suite-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button className="btn btn-outline" onClick={shareWA} style={{ gap: '8px' }}>
               WhatsApp
            </button>
            <button className="btn btn-outline" onClick={shareFB} style={{ gap: '8px' }}>
               Facebook
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleCopy} 
              style={{ gridColumn: '1 / -1', gap: '8px' }}
            >
              {copied ? '✅ Link copied' : '🔗 Copy listing link'}
            </button>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center', opacity: 0.6, fontSize: '11px' }}>
          Sierra Blu — Beyond Brokerage
        </div>
      </div>

      <style>{`
        .share-suite-grid button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
        }
      `}</style>
    </div>
  );
}
