'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Database, ChevronDown, Search, Copy, Check } from 'lucide-react';

interface CollectionData {
  name: string;
  docCount: number;
  sample?: Record<string, any>;
}

const COLLECTIONS = ['users', 'listings', 'leads', 'deals', 'activities', 'media', 'sync_jobs'];

export default function AdminDatabasePage() {
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data: CollectionData[] = [];

        for (const collName of COLLECTIONS) {
          try {
            const q = query(collection(db, collName), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);

            data.push({
              name: collName,
              docCount: snap.size,
              sample: snap.docs[0]?.data(),
            });
          } catch (err) {
            // Collection might not exist
            data.push({
              name: collName,
              docCount: 0,
            });
          }
        }

        setCollections(data);
      } catch (err) {
        console.error('Failed to load database info:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = collections.filter(c =>
    search ? c.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  const copyJson = (obj: any, id: string) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#071422] tracking-tight mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Firestore Explorer
        </h1>
        <p className="text-[#3a5570] text-sm">Browse and inspect Firestore collections and documents</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5570]/40" />
          <input
            type="text"
            placeholder="Search collections..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
          />
        </div>
      </div>

      {/* Collections */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 h-16 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
            <Database className="mx-auto mb-3 text-[#3a5570]/30" size={32} />
            <p className="text-[#3a5570]/40 text-sm">No collections found</p>
          </div>
        ) : (
          filtered.map(coll => (
            <div key={coll.name} className="bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(3,22,50,0.06)]">
              {/* Collection Header */}
              <button
                onClick={() =>
                  setExpandedCollection(expandedCollection === coll.name ? null : coll.name)
                }
                className="w-full flex items-center justify-between p-4 hover:bg-[#f8f9fa] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Database size={16} className="text-[#031632]" />
                  <div className="text-left">
                    <div className="font-semibold text-sm text-[#071422]">{coll.name}</div>
                    <div className="text-xs text-[#3a5570]/60 mt-0.5">
                      {coll.docCount} document{coll.docCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  size={18}
                  className="text-[#3a5570]/40 transition-transform"
                  style={{
                    transform:
                      expandedCollection === coll.name
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                  }}
                />
              </button>

              {/* Collection Details */}
              {expandedCollection === coll.name && coll.sample && (
                <div className="border-t border-[#f3f4f5] p-4 bg-[#f8f9fa]">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-[#3a5570] uppercase tracking-wide">
                      Sample Document
                    </p>
                    <button
                      onClick={() => copyJson(coll.sample, coll.name)}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-mono bg-white rounded hover:bg-[#e7e8e9] text-[#3a5570]"
                    >
                      {copied === coll.name ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-[#3a5570] overflow-x-auto bg-white p-3 rounded border border-[#e7e8e9] max-h-[400px] overflow-y-auto">
                    {JSON.stringify(coll.sample, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Schema Reference */}
      <div className="mt-12 bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
        <h2 className="text-lg font-bold text-[#071422] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          Complete Schema Reference
        </h2>
        <div className="space-y-6">
          {[
            {
              name: 'users',
              description: 'Team members and authentication users',
              fields: [
                { name: 'id', type: 'string', desc: 'Auto-generated document ID' },
                { name: 'name', type: 'string', desc: 'Full name' },
                { name: 'email', type: 'string', desc: 'Email address' },
                { name: 'phone', type: 'string', desc: 'Phone number (optional)' },
                { name: 'role', type: 'enum', values: 'admin|agent|broker', desc: 'User role' },
                { name: 'status', type: 'enum', values: 'active|inactive', desc: 'Account status' },
                { name: 'commissionRate', type: 'number', desc: 'Commission percentage (agents/brokers)' },
                { name: 'createdAt', type: 'timestamp', desc: 'Document creation time' },
              ],
            },
            {
              name: 'listings',
              description: 'Property listings and units',
              fields: [
                { name: 'id', type: 'string', desc: 'Auto-generated document ID' },
                { name: 'title', type: 'string', desc: 'Property title/name' },
                { name: 'propertyType', type: 'string', desc: 'Apartment, Villa, Townhouse, etc.' },
                { name: 'price', type: 'number', desc: 'Property price in EGP' },
                { name: 'area', type: 'number', desc: 'Property area in sqm' },
                { name: 'bedrooms', type: 'number', desc: 'Number of bedrooms' },
                { name: 'bathrooms', type: 'number', desc: 'Number of bathrooms' },
                { name: 'location', type: 'string', desc: 'Location/address' },
                { name: 'compound', type: 'string', desc: 'Compound name (if applicable)' },
                { name: 'status', type: 'string', desc: 'available|sold|rented' },
                { name: 'imageUrls', type: 'array', desc: 'Array of image URLs' },
                { name: 'createdAt', type: 'timestamp', desc: 'Listing creation time' },
              ],
            },
            {
              name: 'leads',
              description: 'Prospective buyers and clients',
              fields: [
                { name: 'id', type: 'string', desc: 'Auto-generated document ID' },
                { name: 'name', type: 'string', desc: 'Lead name' },
                { name: 'email', type: 'string', desc: 'Lead email' },
                { name: 'phone', type: 'string', desc: 'Lead phone number' },
                { name: 'source', type: 'string', desc: 'Lead source (website|referral|api)' },
                { name: 'stage', type: 'string', desc: 'Pipeline stage' },
                { name: 'preferences', type: 'object', desc: 'Property preferences' },
                { name: 'notes', type: 'string', desc: 'Internal notes' },
                { name: 'createdAt', type: 'timestamp', desc: 'Lead creation time' },
              ],
            },
            {
              name: 'deals',
              description: 'Completed and ongoing transactions',
              fields: [
                { name: 'id', type: 'string', desc: 'Auto-generated document ID' },
                { name: 'clientName', type: 'string', desc: 'Client name' },
                { name: 'stage', type: 'string', desc: 'Deal stage (new|engaged|viewing|negotiation|closed)' },
                { name: 'amount', type: 'number', desc: 'Deal amount in EGP' },
                { name: 'agentId', type: 'string', desc: 'Assigned agent ID' },
                { name: 'listingId', type: 'string', desc: 'Associated listing ID' },
                { name: 'terms', type: 'object', desc: 'Deal terms and conditions' },
                { name: 'createdAt', type: 'timestamp', desc: 'Deal creation time' },
                { name: 'updatedAt', type: 'timestamp', desc: 'Last update time' },
              ],
            },
            {
              name: 'media',
              description: 'Uploaded images and assets',
              fields: [
                { name: 'id', type: 'string', desc: 'Auto-generated document ID' },
                { name: 'filename', type: 'string', desc: 'Original filename' },
                { name: 'url', type: 'string', desc: 'Firebase Storage signed URL' },
                { name: 'size', type: 'number', desc: 'File size in bytes' },
                { name: 'type', type: 'string', desc: 'MIME type (image/jpeg, etc.)' },
                { name: 'createdAt', type: 'timestamp', desc: 'Upload time' },
              ],
            },
            {
              name: 'activities',
              description: 'User actions and audit log',
              fields: [
                { name: 'id', type: 'string', desc: 'Auto-generated document ID' },
                { name: 'userId', type: 'string', desc: 'Acting user ID' },
                { name: 'action', type: 'string', desc: 'Action type (create|update|delete)' },
                { name: 'entity', type: 'string', desc: 'Affected entity type' },
                { name: 'entityId', type: 'string', desc: 'Affected entity ID' },
                { name: 'changes', type: 'object', desc: 'What changed' },
                { name: 'createdAt', type: 'timestamp', desc: 'Activity timestamp' },
              ],
            },
          ].map((schema: any) => (
            <div key={schema.name} className="border border-[#e7e8e9] rounded-lg overflow-hidden">
              <div className="bg-[#f8f9fa] p-4 border-b border-[#e7e8e9]">
                <h3 className="font-semibold text-sm text-[#071422]">{schema.name}</h3>
                <p className="text-xs text-[#3a5570]/60 mt-1">{schema.description}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#e7e8e9] bg-[#fafbfc]">
                      <th className="text-left px-4 py-2 font-semibold text-[#071422]">Field</th>
                      <th className="text-left px-4 py-2 font-semibold text-[#071422]">Type</th>
                      <th className="text-left px-4 py-2 font-semibold text-[#071422]">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schema.fields.map((field: any, i: number) => (
                      <tr key={i} className="border-b border-[#f3f4f5] hover:bg-[#f8f9fa]">
                        <td className="px-4 py-2 font-mono text-[#031632]">{field.name}</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-1 rounded text-[10px] font-semibold" style={{
                            background: field.type === 'string' ? '#DBEAFE' :
                                       field.type === 'number' ? '#DCE5F1' :
                                       field.type === 'timestamp' ? '#FEE2E2' :
                                       field.type === 'enum' ? '#FCD34D' : '#E0E7FF',
                            color: field.type === 'string' ? '#0369A1' :
                                   field.type === 'number' ? '#4338CA' :
                                   field.type === 'timestamp' ? '#991B1B' :
                                   field.type === 'enum' ? '#92400E' : '#312E81'
                          }}>
                            {field.type}{field.values ? `: ${field.values}` : ''}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-[#3a5570]">{field.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
