"use client";
import React, { useEffect, useRef, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import AddListingModal from './AddListingModal';
import ShareListingModal from './ShareListingModal';
import SyncWizard from './SyncWizard';

export interface Listing {
  docId?: string;
  id: string; // Standardized Code
  title: string;
  titleAr?: string;
  location: string;
  area: string;
  type: string;
  status: 'Available' | 'Reserved' | 'Sold' | 'Pending';
  price: string;
  beds: number;
  baths: number;
  sqm: number;
  agent: string;
  listedDays: number;
  imageUrl?: string;
  description?: string;
  descriptionAr?: string;
  isFeatured?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  
  // Codex v4.0 Alignment
  orchestrationState: {
    stage: 'S1' | 'S2' | 'S3' | 'S4'; // S1: Acquisition, S2: AI Listing, S3: Branding, S4: Distribution
    lastTriggeredAt?: Timestamp;
  };
  automation: {
    brandingReady: boolean;
    publishingReady: boolean;
    whatsappReady: boolean;
    isPublishedToPF?: boolean;
  };
  ownerType: 'Owner' | 'Broker' | 'Internal';
}

const FALLBACK_LISTINGS: Listing[] = [
  { 
    id: 'P-1042', title: 'Mountain View iCity Mansion', location: 'October City, Giza', area: 'Mountain View iCity', type: 'Villa', status: 'Available', price: 'EGP 18,500,000', beds: 6, baths: 5, sqm: 520, agent: 'Ahmed Fawzy', listedDays: 12,
    orchestrationState: { stage: 'S4' },
    automation: { brandingReady: true, publishingReady: true, whatsappReady: true },
    ownerType: 'Owner'
  },
  { 
    id: 'P-1089', title: 'Hyde Park Grand Boulevard', location: 'New Cairo, Cairo', area: 'Hyde Park', type: 'Apartment', status: 'Available', price: 'EGP 7,200,000', beds: 4, baths: 3, sqm: 225, agent: 'Sara Nabil', listedDays: 5,
    orchestrationState: { stage: 'S4' },
    automation: { brandingReady: true, publishingReady: true, whatsappReady: false },
    ownerType: 'Broker'
  },
  { 
    id: 'P-1103', title: 'Sodic East Sky Penthouse', location: 'New Cairo, Cairo', area: 'Sodic East', type: 'Penthouse', status: 'Reserved', price: 'EGP 14,750,000', beds: 5, baths: 4, sqm: 420, agent: 'Ahmed Fawzy', listedDays: 3,
    orchestrationState: { stage: 'S4' },
    automation: { brandingReady: true, publishingReady: true, whatsappReady: true },
    ownerType: 'Internal'
  },
  { 
    id: 'P-1117', title: 'Palm Hills Signature Townhouse', location: 'October City, Giza', area: 'Palm Hills', type: 'Townhouse', status: 'Available', price: 'EGP 12,900,000', beds: 4, baths: 4, sqm: 310, agent: 'Mona Hassan', listedDays: 18,
    orchestrationState: { stage: 'S3' },
    automation: { brandingReady: true, publishingReady: false, whatsappReady: false },
    ownerType: 'Owner'
  },
  { 
    id: 'P-1124', title: 'Marassi Shoreline Chalet', location: 'North Coast, Alexandria', area: 'Marassi', type: 'Chalet', status: 'Available', price: 'EGP 9,100,000', beds: 3, baths: 2, sqm: 160, agent: 'Sara Nabil', listedDays: 9,
    orchestrationState: { stage: 'S4' },
    automation: { brandingReady: true, publishingReady: true, whatsappReady: true },
    ownerType: 'Broker'
  },
];

const STATUS_COLORS: Record<string, string> = {
  Available: 'badge-success',
  Reserved: 'badge-warning',
  Sold: 'badge-navy',
  Pending: 'badge-blue',
};

const TYPE_ICONS: Record<string, string> = {
  Villa: '🏡', Apartment: '🏢', Penthouse: '🌆', Townhouse: '🏘️', Chalet: '🏖️', Studio: '🏠',
};

interface ListingCardProps {
  listing: Listing;
  onShare: (listing: Listing) => void;
  onEdit: (listing: Listing) => void;
  onDelete: (listing: Listing) => void;
}

function ListingCard({ listing, onShare, onEdit, onDelete }: ListingCardProps) {
  return (
    <div key={listing.docId ?? listing.id} className="prop-card animate-fade-in">
      <div className="prop-img">
        {listing.imageUrl ? (
          <img src={listing.imageUrl} alt={listing.title} className="prop-img-real" />
        ) : (
          <div className="prop-img-placeholder">{TYPE_ICONS[listing.type] || '🏢'}</div>
        )}
        <div className="prop-status-badge">
          <span className={`badge ${STATUS_COLORS[listing.status]}`}>{listing.status}</span>
        </div>
        <div className="prop-actions-top">
          <button className="prop-action-icon" title="Share" onClick={() => onShare(listing)}>↗</button>
          <button className="prop-action-icon" title="Edit" onClick={() => onEdit(listing)}>✏</button>
          <button className="prop-action-icon btn-danger-icon" title="Delete" onClick={() => onDelete(listing)}>🗑</button>
        </div>
      </div>
      <div className="prop-body">
        <div className="prop-type-meta">
          <span className="badge badge-outline">{listing.type}</span>
          <span className="listing-id">{listing.id}</span>
        </div>
        <div className="prop-title">{listing.title}</div>
        <div className="prop-location">📍 {listing.location}</div>
        <div className="prop-price">{listing.price}</div>
        <div className="prop-specs-row">
          <div className="spec-item"><span>🛏</span> {listing.beds}</div>
          <div className="spec-item"><span>🚿</span> {listing.baths}</div>
          <div className="spec-item"><span>📐</span> {listing.sqm} m²</div>
        </div>
        </div>
        
        {/* Stage 5: Luxury 3D Visualizer Placeholder */}
        <div className="prop-3d-visualizer-mini">
          <div className="visualizer-label">
            <span className="icon">💎</span>
            <span>3D SPATIAL PREVIEW READY</span>
          </div>
          <div className="visualizer-mesh-placeholder"></div>
        </div>

        <div className="prop-footer">
          <button className="btn btn-primary btn-full shadow-gold" onClick={() => onShare(listing)}>
            ✨ Broadcast Listing
          </button>
        </div>
      </div>
  );
}

export default function ListingsHub() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [shareListing, setShareListing] = useState<Listing | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [toast, setToast] = useState('');
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((snapshotDoc) => ({
        ...snapshotDoc.data(),
        docId: snapshotDoc.id,
      } as Listing));
      if (data.length > 0) {
        setListings(data);
      } else {
        setListings(FALLBACK_LISTINGS);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Firestore access error, using secure fallback data:", error);
      setListings(FALLBACK_LISTINGS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const types = ['All', ...Array.from(new Set([...FALLBACK_LISTINGS, ...listings].map(l => l.type)))];
  const statuses = ['All', 'Available', 'Reserved', 'Sold', 'Pending'];

  const filtered = (listings.length > 0 ? listings : FALLBACK_LISTINGS).filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || l.type === typeFilter;
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async (listing: Listing) => {
    if (!window.confirm('Remove this luxury asset from the portfolio?')) return;
    try {
      if (listing.docId && !FALLBACK_LISTINGS.some(f => f.id === listing.id)) {
        await deleteDoc(doc(db, 'listings', listing.docId));
        showToast('Asset removed successfully');
      } else {
        showToast('System fallback assets cannot be modified');
      }
    } catch (err) {
      showToast('Action restricted or database error');
    }
  };

  if (loading) {
    return (
      <div className="section-loader">
        <div className="loader-logo sm">SB</div>
        <div className="loader-text sm">Synchronizing luxury inventory…</div>
      </div>
    );
  }

  return (
    <div className="listings-view animate-fade-in">
      <div className="page-header">
        <div className="header-flex">
          <div>
            <h1>Signature Portfolio</h1>
            <div className="page-sub">
              {filtered.length} elite assets registered in the architectural inventory
            </div>
          </div>
          <div className="header-controls">
            <div className="view-toggle">
              <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>⊞ Grid</button>
              <button className={`view-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>☰ Table</button>
            </div>
            <div className="action-buttons">
              <button className="btn btn-outline" onClick={() => setIsSyncOpen(true)}>Inventory Reconciliation</button>
              <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>+ Incorporate Signature Asset</button>
            </div>
          </div>
        </div>
      </div>

      <div className="filter-row card">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input clean-input"
            placeholder="Search by identity, location or asset specification…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filters-group">
          <select className="form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
          <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="prop-grid">
          {filtered.map(listing => (
            <ListingCard 
              key={listing.docId ?? listing.id} 
              listing={listing} 
              onShare={setShareListing} 
              onEdit={(l) => { setEditingListing(l); setIsAddModalOpen(true); }}
              onDelete={handleDelete}
            />
          ))}
          {filtered.length === 0 && (
            <div className="empty-state card">
              <div className="empty-icon">📂</div>
              <p>No listings found matching your refined criteria.</p>
              <button className="btn btn-outline btn-sm" onClick={() => {setSearch(''); setTypeFilter('All'); setStatusFilter('All');}}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card table-card overflow-x">
          <table className="premium-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Asset Identity</th>
                <th>Typology</th>
                <th>Status</th>
                <th>Capital Valuation</th>
                <th>Architectural Footprint</th>
                <th>Management</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(listing => (
                <tr key={listing.docId ?? listing.id}>
                  <td className="asset-id">{listing.id}</td>
                  <td>
                    <div className="asset-name">{listing.title}</div>
                    <div className="asset-location">📍 {listing.location}</div>
                  </td>
                  <td><span className="badge badge-outline">{listing.type}</span></td>
                  <td><span className={`badge ${STATUS_COLORS[listing.status]}`}>{listing.status}</span></td>
                  <td className="asset-valuation">{listing.price}</td>
                  <td className="asset-specs">{listing.sqm} m² · {listing.beds}B/{listing.baths}B</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" onClick={() => setShareListing(listing)}>✨</button>
                      <button className="btn-icon" onClick={() => { setEditingListing(listing); setIsAddModalOpen(true); }}>✏</button>
                      <button className="btn-icon danger" onClick={() => handleDelete(listing)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isAddModalOpen && (
        <AddListingModal 
          listing={editingListing}
          onClose={() => { setIsAddModalOpen(false); setEditingListing(null); }} 
          onSuccess={() => { 
            showToast(editingListing?.docId ? 'Portfolio ledger updated' : 'New signature asset incorporated'); 
            setIsAddModalOpen(false); 
            setEditingListing(null);
          }}
        />
      )}

      {shareListing && (
        <ShareListingModal listing={shareListing} onClose={() => setShareListing(null)} />
      )}

      {isSyncOpen && (
        <SyncWizard 
          onClose={() => setIsSyncOpen(false)}
          onSuccess={(count) => {
            setIsSyncOpen(false);
            showToast(`Successfully imported ${count} premium assets`);
          }}
        />
      )}

      {toast && (
        <div className="toast show animate-slide-up">
          <span className="toast-icon">✨</span>
          {toast}
        </div>
      )}
    </div>
  );
}

