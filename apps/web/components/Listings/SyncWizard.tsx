"use client";
import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { logAuditAction } from '../../lib/audit';

interface SyncWizardProps {
  onClose: () => void;
  onSuccess: (count: number) => void;
}

type SyncType = 'portfolio' | 'stakeholders';
type WizardStage = 'CHOOSE_TYPE' | 'CHOOSE_SOURCE' | 'UPLOAD' | 'PORTAL' | 'MAPPING' | 'PREVIEW' | 'SYNCING' | 'COMPLETE';

type ImportValue = string | number | boolean | null | undefined;
type ImportRow = Record<string, ImportValue>;

interface ImportedListing {
  title: string;
  location: string;
  price: string;
  type: string;
  status: 'Available';
  agent: string;
  listedDays: number;
  beds: number;
  baths: number;
  sqm: number;
  area: string;
}

const REQUIRED_FIELDS = [
  { key: 'title', label: 'Property Title' },
  { key: 'location', label: 'Location' },
  { key: 'price', label: 'Financial Valuation' },
  { key: 'type', label: 'Classification' },
] as const;

const STAGES: WizardStage[] = ['UPLOAD', 'MAPPING', 'PREVIEW', 'SYNCING', 'COMPLETE'];
const STEP_LABELS = ['Data Ingest', 'Schema Mapping', 'Integrity Check', 'Syncing'];

const isImportRow = (value: unknown): value is ImportRow =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeRows = (payload: unknown): ImportRow[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isImportRow);
  }

  return isImportRow(payload) ? [payload] : [];
};

const readString = (row: ImportRow, ...keys: string[]) => {
  for (const key of keys) {
    const value = row[key];
    if (value === undefined || value === null) {
      continue;
    }

    const normalized = String(value).trim();
    if (normalized) {
      return normalized;
    }
  }

  return '';
};

const readNumber = (row: ImportRow, ...keys: string[]) => {
  const value = readString(row, ...keys);
  if (!value) {
    return 0;
  }

  const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const safeUUID = () => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
};

const createListingId = () => `P-${safeUUID().replace(/-/g, '').slice(0, 6).toUpperCase()}`;

const parseCsvRows = (text: string) => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  const pushCell = () => {
    currentRow.push(currentCell.trim());
    currentCell = '';
  };

  const pushRow = () => {
    if (currentRow.some((value) => value.length > 0)) {
      rows.push(currentRow);
    }
    currentRow = [];
  };

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (char === '"') {
      if (inQuotes && text[index + 1] === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      pushCell();
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && text[index + 1] === '\n') {
        index += 1;
      }
      pushCell();
      pushRow();
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    pushCell();
    pushRow();
  }

  return rows;
};

export default function SyncWizard({ onClose, onSuccess }: SyncWizardProps) {
  const [syncType, setSyncType] = useState<SyncType>('portfolio');
  const [rawData, setRawData] = useState<ImportRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [mappedData, setMappedData] = useState<any[]>([]);
  const [stage, setStage] = useState<WizardStage>('CHOOSE_TYPE');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let data: ImportRow[] = [];
        if (file.name.endsWith('.json')) {
          data = normalizeRows(JSON.parse(text));
        } else if (file.name.endsWith('.csv')) {
          const rows = parseCsvRows(text);
          if (rows.length < 2) {
            throw new Error('Incompatible format: Schema header missing.');
          }

          const [headers, ...records] = rows;
          data = records.map((record) => {
            return headers.reduce<ImportRow>((acc, header, index) => {
              acc[header] = record[index] ?? '';
              return acc;
            }, {});
          });
        }

        if (data.length === 0) {
          throw new Error('Data payload empty.');
        }

        setRawData(data);
        const initialMap: Record<string, string> = {};
        const sourceKeys = Object.keys(data[0] || {});
        REQUIRED_FIELDS.forEach(f => {
          const match = sourceKeys.find(sk => sk.toLowerCase() === f.key.toLowerCase());
          if (match) initialMap[f.key] = match;
        });
        setMappings(initialMap);
        setStage('MAPPING');
      } catch {
        alert('Data recognition error. Please provide a validated CSV or JSON dataset.');
      }
    };
    reader.readAsText(file);
  };

  const startMapping = () => {
    const processed = rawData.map((item) => {
      const mappedItem = {
        title: 'Pending identification',
        location: 'Pending identification',
        price: 'N/A',
        type: 'Unclassified',
        status: 'Available' as const,
        agent: 'Systems Integrator',
        listedDays: 0,
        beds: readNumber(item, 'beds', 'Bedrooms', 'Rooms'),
        baths: readNumber(item, 'baths', 'Bathrooms', 'WC'),
        sqm: readNumber(item, 'sqm', 'Area', 'Size', 'Footprint'),
        area: readString(item, 'Area', 'Region', 'Neighborhood') || 'Unspecified Sector',
      };

      REQUIRED_FIELDS.forEach((field) => {
        mappedItem[field.key] = readString(item, mappings[field.key]) || 'Pending identification';
      });

      return mappedItem;
    });
    setMappedData(processed);
    setStage('PREVIEW');
  };

  const handleSync = async () => {
    setStage('SYNCING');
    try {
      const batch = writeBatch(db);
      const collectionName = syncType === 'portfolio' ? 'listings' : 'leads';
      
      mappedData.forEach(item => {
        const newDocRef = doc(collection(db, collectionName));
        const finalData = syncType === 'portfolio' 
          ? { ...item, id: createListingId(), createdAt: serverTimestamp() }
          : { ...item, createdAt: serverTimestamp() };
          
        batch.set(newDocRef, finalData);
      });
      
      await batch.commit();

      await logAuditAction({
        action: syncType === 'portfolio' ? 'LISTING_SYNC' : 'STAKEHOLDER_SYNC',
        performer: 'Systems Integrator',
        performerId: 'system-sync-wizard',
        targetId: 'multiple-records',
        targetType: syncType === 'portfolio' ? 'listing' : 'stakeholder',
        details: `Synchronized ${mappedData.length} ${syncType} records via internal gateway protocol.`
      });

      setStage('COMPLETE');
      setTimeout(() => onSuccess(mappedData.length), 1500);
    } catch (err) {
      console.error("Integration Failure:", err);
      alert("Synchronization protocol interrupted. Please verify connectivity.");
      setStage('PREVIEW');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass animate-zoom-in" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px', width: '95%', border: '1px solid var(--gold)' }}>
        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <div>
            <h2 className="serif" style={{ color: 'var(--navy)', fontSize: '24px' }}>Strategic Synchronization</h2>
            <p style={{ fontSize: '12px', opacity: 0.6 }}>Multi-modal enterprise data ingestion engine</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="sync-steps" style={{ marginTop: '20px' }}>
            {STEP_LABELS.map((step, i) => (
              <div 
                key={step} 
                className={`sync-step ${STAGES.indexOf(stage) >= i ? 'active' : ''}`}
              >
                <div className="step-num">{i + 1}</div>
                <div className="step-name">{step}</div>
              </div>
            ))}
          </div>

          <div className="wizard-container" style={{ minHeight: '340px', padding: '20px 0' }}>
            {(stage === 'CHOOSE_TYPE' || stage === 'CHOOSE_SOURCE') && stage === 'CHOOSE_TYPE' && (
              <div className="choice-grid animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '40px 0' }}>
                <div 
                  className="choice-card glass hover-lift" 
                  onClick={() => { setSyncType('portfolio'); setStage('CHOOSE_SOURCE'); }}
                  style={{ padding: '32px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border)', borderRadius: '16px' }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏰</div>
                  <h3 className="serif" style={{ fontSize: '18px', color: 'var(--navy)' }}>Signature Portfolio</h3>
                  <p style={{ fontSize: '12px', opacity: 0.6 }}>Synchronize high-fidelity listing assets</p>
                </div>
                <div 
                  className="choice-card glass hover-lift gold-border" 
                  onClick={() => { setSyncType('stakeholders'); setStage('CHOOSE_SOURCE'); }}
                  style={{ padding: '32px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--gold)', borderRadius: '16px', background: 'rgba(212, 175, 55, 0.03)' }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>🤝</div>
                  <h3 className="serif" style={{ fontSize: '18px', color: 'var(--gold)' }}>Investment Stakeholders</h3>
                  <p style={{ fontSize: '12px', opacity: 0.6 }}>Ingest prospective capital partners and stakeholders</p>
                </div>
              </div>
            )}

            {stage === 'CHOOSE_SOURCE' && (
              <div className="choice-grid animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '40px 0' }}>
                <div 
                  className="choice-card glass hover-lift" 
                  onClick={() => setStage('UPLOAD')}
                  style={{ padding: '32px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border)', borderRadius: '16px' }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>📁</div>
                  <h3 className="serif" style={{ fontSize: '18px', color: 'var(--navy)' }}>Legacy Ingest</h3>
                  <p style={{ fontSize: '12px', opacity: 0.6 }}>Synchronize via local JSON or CSV protocols</p>
                </div>
                <div 
                  className="choice-card glass hover-lift gold-border" 
                  onClick={() => setStage('PORTAL')}
                  style={{ padding: '32px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--gold)', borderRadius: '16px', background: 'rgba(212, 175, 55, 0.03)' }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '16px' }}>🌐</div>
                  <h3 className="serif" style={{ fontSize: '18px', color: 'var(--gold)' }}>{syncType === 'portfolio' ? 'Property Finder' : 'Stakeholder Gateway'}</h3>
                  <p style={{ fontSize: '12px', opacity: 0.6 }}>Direct enterprise gateway synchronization</p>
                </div>
                <div style={{ gridColumn: 'span 2', textAlign: 'center' }}>
                  <button className="btn-ghost" onClick={() => setStage('CHOOSE_TYPE')} style={{ fontSize: '12px' }}>Back to Specifications</button>
                </div>
              </div>
            )}

            {stage === 'PORTAL' && (
              <div className="portal-sync-zone animate-fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ marginBottom: '32px' }}>
                  <img src="https://www.propertyfinder.ae/blog/wp-content/uploads/2018/12/Logo_Propertyfinder_red.png" alt="Property Finder" style={{ height: '40px', marginBottom: '12px', filter: 'grayscale(1) brightness(0.5)' }} />
                  <p style={{ fontSize: '13px', opacity: 0.7 }}>Secure enterprise synchronization protocol active</p>
                </div>
                <div className="form-group" style={{ maxWidth: '400px', margin: '0 auto' }}>
                  <label className="form-label" style={{ textAlign: 'left' }}>Portfolio Reference / Filter Query</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter reference ID or search criteria..." 
                    style={{ marginBottom: '24px' }}
                  />
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '14px' }}
                    onClick={async () => {
                      setStage('SYNCING');
                      try {
                        const action = syncType === 'portfolio' ? 'search-listings' : 'search-stakeholders';
                        const res = await fetch(`/api/property-finder?action=${action}`);
                        const result = await res.json();
                        
                        if (!result.data || !Array.isArray(result.data)) {
                          throw new Error("Invalid portal data structure");
                        }

                        if (syncType === 'portfolio') {
                          const mappedFromPF = result.data.map((pf: any) => ({
                            id: pf.reference_number || `PF-${pf.id}`,
                            title: pf.title?.en || 'Untitled Signature Asset',
                            location: pf.location?.name || 'Dubai, UAE',
                            area: pf.location?.name || 'Exclusive Sector',
                            type: pf.type.charAt(0).toUpperCase() + pf.type.slice(1),
                            status: pf.status === 'published' ? 'Available' : 'Pending',
                            price: `${pf.price.currency} ${pf.price.value.toLocaleString()}`,
                            beds: pf.bedrooms,
                            baths: pf.bathrooms,
                            sqm: pf.size.unit === 'sqm' ? pf.size.value : Math.round(pf.size.value * 0.092903),
                            agent: 'Property Finder Gateway',
                            listedDays: pf.created_at ? Math.floor((Date.now() - new Date(pf.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0,
                            imageUrl: pf.images?.find((img: any) => img.is_main)?.url || pf.images?.[0]?.url || '',
                          }));
                          setMappedData(mappedFromPF);
                          setMappedData(mappedFromPF);
                        } else {
                          const mappedLeadsFromPF = result.data.map((pf: any) => ({
                            name: pf.customer?.name || 'Anonymous Stakeholder',
                            phone: pf.customer?.phone || 'N/A',
                            email: pf.customer?.email || 'N/A',
                            portfolioPreference: pf.listing_reference_number || 'General Interest',
                            capitalAllocation: 'To be determined',
                            strategicIntensity: 'warm',
                            phase: 'acquisition',
                            stage: 'lead',
                            originChannel: 'Property Finder',
                            originalReference: pf.id,
                            pfLeadId: pf.id,
                            assignedPartnerId: pf.agent?.id || pf.user?.id || '', 
                            message: pf.message || '',
                            automation: {
                              botInitiated: false,
                              scoringCompleted: false,
                              whatsappFollowupSent: false
                            }
                          }));
                          setMappedData(mappedLeadsFromPF);
                        }

                        setStage('PREVIEW');
                      } catch (err) {
                        console.error("Portal Ingest Error:", err);
                        alert("Gateway synchronization protocol failed. Verify credentials in environmental vault.");
                        setStage('PORTAL');
                      }
                    }}
                  >
                    Initiate Portal Ingest
                  </button>
                  <button className="btn-ghost" onClick={() => setStage('CHOOSE_SOURCE')} style={{ marginTop: '16px', fontSize: '12px' }}>Back to Origins</button>
                </div>
              </div>
            )}

            {stage === 'UPLOAD' && (
              <div className="upload-zone ripple" style={{ border: '2px dashed var(--gold)', borderRadius: '12px', padding: '60px 40px', textAlign: 'center', cursor: 'pointer', position: 'relative', background: 'rgba(200, 169, 110, 0.02)' }}>
                <input type="file" accept=".json,.csv" onChange={handleFileUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                <div style={{ fontSize: '48px', marginBottom: '20px', filter: 'sepia(0.5)' }}>⚜️</div>
                <h3 className="serif" style={{ color: 'var(--navy)', marginBottom: '12px' }}>Ingest Dataset</h3>
                <p style={{ fontSize: '13px', opacity: 0.7, maxWidth: '400px', margin: '0 auto' }}>
                  Deploy inventory exports from professional portals as structured JSON or CSV protocols.
                </p>
                <div className="btn btn-primary" style={{ marginTop: '24px' }}>Select Source File</div>
                <div style={{ marginTop: '16px' }}>
                  <button className="btn-ghost" onClick={() => setStage('CHOOSE_SOURCE')} style={{ fontSize: '12px' }}>Back to Origins</button>
                </div>
              </div>
            )}


            {stage === 'MAPPING' && (
              <div className="mapping-engine animate-fade-in">
                <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--surface-2)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '12px', opacity: 0.5, textTransform: 'uppercase' }}>Active Dataset:</strong> 
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{fileName}</div>
                  </div>
                  <div className="badge badge-navy">{rawData.length} Entries Detected</div>
                </div>
                <div className="mapping-grid" style={{ display: 'grid', gap: '16px' }}>
                  {REQUIRED_FIELDS.map(field => (
                    <div key={field.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--navy)' }}>{field.label}</div>
                        <div style={{ fontSize: '11px', opacity: 0.5 }}>Target Parameter</div>
                      </div>
                      <div className="source-select" style={{ flex: 1.5 }}>
                        <select 
                          className="form-select" 
                          value={mappings[field.key] || ''} 
                          onChange={e => setMappings({ ...mappings, [field.key]: e.target.value })}
                          style={{ width: '100%', borderColor: mappings[field.key] ? 'var(--gold)' : 'var(--border)' }}
                        >
                          <option value="">-- Connect Source Parameter --</option>
                          {Object.keys(rawData[0] || {}).map(sk => <option key={sk} value={sk}>{sk}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary" onClick={startMapping} style={{ marginTop: '30px', width: '100%', padding: '14px' }} disabled={Object.keys(mappings).length < 4}>
                  Validated Data Structure →
                </button>
              </div>
            )}

            {stage === 'PREVIEW' && (
              <div className="sync-preview animate-fade-in">
                <div style={{ fontSize: '13px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontWeight: 600 }}>Verification Phase: {mappedData.length} records staged</span>
                   <button className="btn-ghost btn-sm" onClick={() => setStage('MAPPING')}>Modify Alignment</button>
                </div>
                <div className="table-wrap" style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>{syncType === 'portfolio' ? 'Reference Title' : 'Stakeholder Identity'}</th>
                        <th>{syncType === 'portfolio' ? 'Valuation' : 'Origin'}</th>
                        <th>{syncType === 'portfolio' ? 'Sector' : 'Contact'}</th>
                        <th>State</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mappedData.slice(0, 10).map((row, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 500 }}>{syncType === 'portfolio' ? row.title : row.name}</td>
                          <td style={{ color: 'var(--gold)', fontWeight: 700 }}>{syncType === 'portfolio' ? row.price : row.originChannel}</td>
                          <td>{syncType === 'portfolio' ? row.location : row.phone}</td>
                          <td style={{ textAlign: 'center' }}><span style={{ color: 'var(--success)' }}>Ready</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {mappedData.length > 10 && <div style={{ textAlign: 'center', padding: '12px', fontSize: '11px', opacity: 0.5, letterSpacing: '1px' }}>+ {mappedData.length - 10} ADDITIONAL ASSETS DETECTED</div>}
                <button className="btn btn-gold" onClick={handleSync} style={{ marginTop: '24px', width: '100%', padding: '14px' }}>
                  Execute Global Portfolio Integration
                </button>
              </div>
            )}

            {stage === 'SYNCING' && (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div className="pulse-shimmer" style={{ fontSize: '64px', marginBottom: '24px' }}>🕊️</div>
                <h3 className="serif" style={{ fontSize: '24px', color: 'var(--navy)' }}>Integrating Portfolio Assets</h3>
                <p style={{ fontSize: '14px', opacity: 0.6, marginTop: '8px' }}>Optimizing data structures and establishing permanent cloud records...</p>
                <div className="sync-progress" style={{ marginTop: '40px', height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden', maxWidth: '300px', margin: '40px auto 0' }}>
                    <div className="sync-progress-bar active" style={{ height: '100%', width: '100%', background: 'var(--gold)' }}></div>
                </div>
              </div>
            )}

            {stage === 'COMPLETE' && (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>👑</div>
                <h3 className="serif gold-text" style={{ fontSize: '28px' }}>Integration Successful</h3>
                <p style={{ fontSize: '14px', opacity: 0.6, marginTop: '8px' }}>
                  The {syncType === 'portfolio' ? 'Signature Portfolio' : 'Strategic Pipeline'} has been expanded with {mappedData.length} premium records.
                </p>
                <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '32px', minWidth: '160px' }}>Dashboard Access</button>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center', borderTop: 'none', background: 'rgba(0,0,0,0.02)', padding: '16px' }}>
          <div style={{ opacity: 0.5, fontSize: '11px', letterSpacing: '1px', fontWeight: 600 }}>SIERRA BLU REALTY OPERATIONAL INTELLIGENCE</div>
        </div>
      </div>

      <style>{`
        .sync-steps { display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 10px; }
        .sync-step { display: flex; flex-direction: column; align-items: center; opacity: 0.3; transition: all 0.4s ease; transform: scale(0.9); }
        .sync-step.active { opacity: 1; color: var(--navy); transform: scale(1); }
        .sync-step.active .step-num { border-color: var(--gold); color: var(--gold); background: var(--navy); }
        .step-num { width: 28px; height: 28px; border: 1px solid currentColor; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; margin-bottom: 8px; font-weight: 700; transition: all 0.3s; }
        .step-name { font-size: 9px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
      `}</style>
    </div>
  );
}
