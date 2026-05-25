"use client";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '../../lib/models/schema';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Bath, Bed, Maximize, Map as MapIcon, Filter, Layers, Rotate3d as Rotate3D } from 'lucide-react';
import { useI18n } from '../../lib/I18nContext';

// Fix for default Leaflet markers in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Branded Icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 15px ${color};"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

const GOLD_ICON = createCustomIcon('#C9A24A'); // Resale
const NAVY_ICON = createCustomIcon('#0A1A3A'); // Rent

// Component to handle map center changes
function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
}

export default function MapExplorer({ onViewTour }: { onViewTour?: (url: string) => void }) {
  const { t } = useI18n();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredType, setFilteredType] = useState<'all' | 'resale' | 'rent'>('all');
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState<[number, number]>([30.0131, 31.5020]); // New Cairo Center

  useEffect(() => {
    const q = query(collection(db, 'properties'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      setProperties(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredData = properties.filter(p => {
    if (!p.coordinates) return false;
    if (filteredType === 'all') return true;
    return p.status === (filteredType === 'resale' ? 'available' : 'rented'); // Simple mapping for demo
  });

  return (
    <div className="relative w-full h-[700px] rounded-[40px] overflow-hidden border border-slate-200 shadow-2xl group">
      {/* Overlay Filters */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-3">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-white/90 backdrop-blur-xl p-2 rounded-3xl border border-slate-200 shadow-xl flex gap-1"
        >
          {['all', 'resale', 'rent'].map((type) => (
            <button
              key={type}
              onClick={() => setFilteredType(type as any)}
              className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filteredType === type ? 'bg-navy text-white shadow-lg' : 'text-slate-400 hover:text-navy'
              }`}
            >
              {t(`spatial.filters.${type}`)}
            </button>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="bg-navy p-4 rounded-3xl border border-gold/20 shadow-xl text-white flex items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gold border border-white" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{t('spatial.filters.resale')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white border border-navy shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{t('spatial.filters.rent')}</span>
          </div>
        </motion.div>
      </div>

      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#F5F7FA' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {filteredData.map((property) => (
          <Marker 
            key={property.id} 
            position={[property.coordinates!.lat, property.coordinates!.lng]}
            icon={property.status === 'rented' ? NAVY_ICON : GOLD_ICON}
          >
            <Popup className="luxury-popup">
              <div className="w-64 overflow-hidden rounded-2xl bg-white p-0 shadow-none border-none">
                 <div className="h-32 bg-slate-100 relative">
                    {property.featuredImage ? (
                      <img src={property.featuredImage} alt={property.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Home size={32} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-navy/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest">
                       {property.code}
                    </div>
                 </div>
                 <div className="p-4">
                    <h3 className="text-sm font-black text-navy mb-1 uppercase tracking-tighter truncate">{property.compound || property.title}</h3>
                    <div className="flex items-center justify-between mt-3">
                       <span className="text-gold font-black text-xs">{property.price?.toLocaleString()} <span className="text-[9px] opacity-70">EGP</span></span>
                       <div className="flex items-center gap-3 text-slate-400">
                          <div className="flex items-center gap-1">
                             <Bed size={12} /> <span className="text-[10px] font-bold">{property.bedrooms}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 h-10 bg-slate-50 hover:bg-gold hover:text-navy border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        {t('spatial.viewDetails')}
                      </button>
                      {property.virtualTourUrl && (
                        <button 
                          onClick={() => onViewTour?.(property.virtualTourUrl!)}
                          className="w-10 h-10 bg-navy text-white rounded-xl flex items-center justify-center hover:bg-gold hover:text-navy transition-all border border-gold/30"
                          title={t('spatial.startTour')}
                        >
                          <Rotate3D size={16} />
                        </button>
                      )}
                    </div>
                 </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <RecenterMap coords={center} />
      </MapContainer>

      {/* Floating Map Stats */}
      <div className="absolute bottom-6 right-6 z-[1000]">
        <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[32px] border border-slate-200 shadow-2xl max-w-[200px]">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Spatial Density</p>
           <p className="text-2xl font-serif font-bold text-navy">{filteredData.length}</p>
           <div className="mt-4 pt-4 border-t border-slate-100">
             <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-gold" style={{ width: '68%' }} />
             </div>
             <p className="text-[9px] font-bold text-slate-500 mt-2">Active Area Concentration</p>
           </div>
        </div>
      </div>
    </div>
  );
}
