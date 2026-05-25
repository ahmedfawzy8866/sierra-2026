'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, MapPin, Home, Edit2, Save, X, DollarSign, Ruler, Users } from 'lucide-react';

interface Unit {
  id: string;
  title: string;
  propertyType: string;
  location: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  description?: string;
  featuredImage?: string;
  images?: string[];
  status: string;
  stage?: string;
  compound?: string;
  city?: string;
  coordinates?: { lat: number; lng: number };
  finishingType?: string;
  updatedAt?: any;
  createdAt?: any;
}

export default function AdminUnitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const unitId = params?.id as string;

  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Unit>>({});

  useEffect(() => {
    async function load() {
      if (!unitId) return;
      try {
        const docRef = doc(db, 'listings', unitId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Unit;
          setUnit(data);
          setFormData(data);
        }
      } catch (err) {
        console.error('Failed to load unit:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [unitId]);

  const handleSave = async () => {
    if (!unit) return;
    try {
      await updateDoc(doc(db, 'listings', unit.id), {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      setUnit({ ...unit, ...formData });
      setEditing(false);
    } catch (err) {
      console.error('Failed to update unit:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#C9A84C] text-sm animate-pulse">Loading unit...</div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="text-center py-12">
        <p className="text-[#3a5570]/40">Unit not found</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-[#f3f4f5] rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-[#3a5570]" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#071422]" style={{ fontFamily: 'var(--font-display)' }}>
            {unit.title}
          </h1>
          <p className="text-[#3a5570] text-sm mt-1">{unit.location}</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#031632] hover:bg-[#041f3d] rounded-lg transition-colors"
          >
            <Edit2 size={16} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFormData(unit);
                setEditing(false);
              }}
              className="p-2.5 hover:bg-red-50 rounded-lg text-red-600"
            >
              <X size={18} />
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg"
            >
              <Save size={16} /> Save
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {unit.featuredImage && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
              <img
                src={unit.featuredImage}
                alt={unit.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Property Details */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
            <h2 className="text-lg font-bold text-[#071422] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Property Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <p className="text-xs text-[#3a5570]/60 uppercase tracking-wide font-semibold mb-2">
                  Price
                </p>
                {editing ? (
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-[#C9A84C]" />
                    <p className="text-lg font-bold text-[#071422]">
                      EGP {unit.price?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                )}
              </div>

              {/* Area */}
              <div>
                <p className="text-xs text-[#3a5570]/60 uppercase tracking-wide font-semibold mb-2">
                  Area
                </p>
                {editing ? (
                  <input
                    type="number"
                    value={formData.area || 0}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        area: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Ruler size={16} className="text-[#8B5CF6]" />
                    <p className="text-lg font-bold text-[#071422]">
                      {unit.area} m²
                    </p>
                  </div>
                )}
              </div>

              {/* Bedrooms */}
              <div>
                <p className="text-xs text-[#3a5570]/60 uppercase tracking-wide font-semibold mb-2">
                  Bedrooms
                </p>
                {editing ? (
                  <input
                    type="number"
                    value={formData.bedrooms || 0}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        bedrooms: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
                  />
                ) : (
                  <p className="text-lg font-bold text-[#071422]">
                    {unit.bedrooms}
                  </p>
                )}
              </div>

              {/* Bathrooms */}
              <div>
                <p className="text-xs text-[#3a5570]/60 uppercase tracking-wide font-semibold mb-2">
                  Bathrooms
                </p>
                {editing ? (
                  <input
                    type="number"
                    value={formData.bathrooms || 0}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        bathrooms: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
                  />
                ) : (
                  <p className="text-lg font-bold text-[#071422]">
                    {unit.bathrooms}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
            <h2 className="text-lg font-bold text-[#071422] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Description
            </h2>
            {editing ? (
              <textarea
                value={formData.description || ''}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
                rows={5}
              />
            ) : (
              <p className="text-sm text-[#3a5570]">
                {unit.description || 'No description available'}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
            <h3 className="text-sm font-bold text-[#071422] mb-4 uppercase tracking-wide">
              Status
            </h3>
            {editing ? (
              <select
                value={formData.status || 'available'}
                onChange={e =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </select>
            ) : (
              <span
                className="inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide"
                style={{
                  background:
                    unit.status === 'available'
                      ? '#DCFCE7'
                      : unit.status === 'sold'
                        ? '#FED7AA'
                        : '#D1FAE5',
                  color:
                    unit.status === 'available'
                      ? '#16A34A'
                      : unit.status === 'sold'
                        ? '#EA580C'
                        : '#10B981',
                }}
              >
                {unit.status}
              </span>
            )}
          </div>

          {/* Location Info */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
            <h3 className="text-sm font-bold text-[#071422] mb-4 uppercase tracking-wide">
              Location
            </h3>
            <div className="space-y-3">
              {unit.compound && (
                <div className="flex items-center gap-2">
                  <Home size={14} className="text-[#3a5570]/40" />
                  <p className="text-xs text-[#071422]">{unit.compound}</p>
                </div>
              )}
              {unit.city && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#3a5570]/40" />
                  <p className="text-xs text-[#071422]">{unit.city}</p>
                </div>
              )}
            </div>
          </div>

          {/* Property Type */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
            <h3 className="text-sm font-bold text-[#071422] mb-4 uppercase tracking-wide">
              Type
            </h3>
            <p className="text-sm text-[#071422] capitalize">
              {unit.propertyType}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
