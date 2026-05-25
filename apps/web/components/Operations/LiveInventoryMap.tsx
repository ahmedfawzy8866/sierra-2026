"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { collection, query, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Layers, RefreshCw, ExternalLink, Home, TrendingUp,
  Wifi, WifiOff, ChevronRight, X, Building2, Search, Filter, Info
} from 'lucide-react';

// ─── GEOGRAPHIC ZONES (fallback — overridden by Firestore `zones` collection) ──
const DEFAULT_ZONES = [
  {
    id: 'new_cairo',
    nameAr: 'القاهرة الجديدة',
    nameEn: 'New Cairo',
    coords: [30.0131, 31.5020] as [number, number],
    radius: 8000,
    color: '#C9A84C',
    compounds: [
      { name: 'Mivida', availability: 14, yield: '7.2%' },
      { name: 'Mountain View iCity', availability: 22, yield: '6.8%' },
      { name: 'Hyde Park', availability: 18, yield: '6.5%' },
      { name: 'Katameya Heights', availability: 5, yield: '8.1%' },
      { name: 'Palm Hills New Cairo', availability: 12, yield: '6.9%' },
    ],
  },
  {
    id: 'admin_capital',
    nameAr: 'العاصمة الإدارية',
    nameEn: 'New Admin Capital',
    coords: [30.0330, 31.7300] as [number, number],
    radius: 10000,
    color: '#8B7355',
    compounds: [
      { name: 'The Iconic Tower Area', availability: 30, yield: '9.0%' },
      { name: 'R7 District', availability: 45, yield: '7.5%' },
      { name: 'R8 District', availability: 38, yield: '7.2%' },
      { name: 'Green River', availability: 15, yield: '8.5%' },
    ],
  },
  {
    id: 'shorouk',
    nameAr: 'الشروق',
    nameEn: 'El Shorouk',
    coords: [30.1400, 31.6100] as [number, number],
    radius: 6000,
    color: '#B8960C',
    compounds: [
      { name: 'Sodic East', availability: 20, yield: '6.2%' },
      { name: 'Al Shorouk City', availability: 14, yield: '5.8%' },
    ],
  },
  {
    id: 'madinaty',
    nameAr: 'مدينتي',
    nameEn: 'Madinaty',
    coords: [30.1250, 31.6450] as [number, number],
    radius: 5000,
    color: '#D4AF37',
    compounds: [
      { name: 'Four Seasons Private Residences', availability: 3, yield: '8.8%' },
      { name: 'VGK Phase 1', availability: 12, yield: '6.5%' },
    ],
  },
];

type Zone = typeof DEFAULT_ZONES[0];

const MAP_CENTER: [number, number] = [30.0600, 31.6000];

// ─── APPLE STYLE MARKER ───────────────────────────────────────────────────────
const createAppleMarker = (count: number, active: boolean, isLight: boolean) => L.divIcon({
  className: '',
  html: `
    <div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      transform: scale(${active ? 1.2 : 1});
      z-index: ${active ? 1000 : 1};
    ">
      <div style="
        background: ${active ? '#C9A84C' : (isLight ? '#fff' : '#0A1628')};
        color: ${active ? '#fff' : (isLight ? '#0A1628' : '#C9A84C')};
        padding: 6px 14px;
        border-radius: 20px;
        font-weight: 800;
        font-size: 14px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15), 0 0 ${active ? '20px' : '0px'} rgba(201,168,76,0.4);
        border: 2px solid ${active ? '#fff' : '#C9A84C'};
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 6px;
      ">
        <span style="font-family: inherit;">${count}</span>
        <span style="font-size: 9px; opacity: 0.7; text-transform: uppercase;">Units</span>
      </div>
      <div style="
        width: 0; 
        height: 0; 
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid ${active ? '#fff' : '#C9A84C'};
        margin-top: -2px;
        filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
      "></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Component to handle map interactions
function RecenterMap({ coords, zoom }: { coords: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, zoom, { animate: true, duration: 1 });
  }, [coords, zoom, map]);
  return null;
}

interface Props {
  isLandingPage?: boolean;
}

export default function LiveInventoryMap({ isLandingPage = false }: Props) {
  const [zones, setZones] = useState<Zone[]>(DEFAULT_ZONES);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [mapZoom, setMapZoom] = useState(isLandingPage ? 11 : 12);
  const [isReady, setIsReady] = useState(false);

  // Load zones from Firestore, fall back to hardcoded defaults if empty
  useEffect(() => {
    getDocs(collection(db, 'zones')).then((snap) => {
      if (!snap.empty) {
        const fetched: Zone[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            nameAr: data.name_ar ?? d.id,
            nameEn: data.name_en ?? d.id,
            coords: [data.coordinates?.lat ?? 30.06, data.coordinates?.lng ?? 31.60] as [number, number],
            radius: data.radius ?? 6000,
            color: data.color ?? '#D4AF37',
            compounds: data.compounds ?? [],
          };
        });
        setZones(fetched);
      }
    }).catch(() => { /* keep defaults */ });
  }, []);

  useEffect(() => {
    setIsReady(true);
    // Seed default counts until Firestore properties are loaded
    setCounts({
      new_cairo: 142,
      admin_capital: 87,
      shorouk: 61,
      madinaty: 34,
    });

    const unsub = onSnapshot(collection(db, 'properties'), (snapshot) => {
      if (snapshot.empty) return;
      const newCounts: Record<string, number> = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.zoneId) {
          newCounts[data.zoneId] = (newCounts[data.zoneId] || 0) + 1;
        }
      });
      setCounts(newCounts);
    });

    return () => unsub();
  }, []);

  const handleZoneClick = (zone: Zone) => {
    setSelectedZone(zone.id === selectedZone ? null : zone.id);
    setMapZoom(zone.id === selectedZone ? 11 : 13);
  };

  const getZoneCount = (id: string) => counts[id] || 0;

  if (!isReady) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', height: '100%', width: '100%' }}>
      {/* MAP SURFACE */}
      <div style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', height: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
        <MapContainer
          center={MAP_CENTER}
          zoom={mapZoom}
          scrollWheelZoom={false}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />

          {zones.map(zone => (
            <Marker 
              key={zone.id} 
              position={zone.coords}
              icon={createAppleMarker(getZoneCount(zone.id), selectedZone === zone.id, isLandingPage)}
              eventHandlers={{ click: () => handleZoneClick(zone) }}
            >
              <Popup className="apple-popup">
                <div style={{ padding: '24px', minWidth: '280px', borderRadius: '24px', background: '#050B14', color: '#F4F0E8', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#C9A84C' }}>{zone.nameEn}</h3>
                      <p style={{ margin: 0, fontSize: '13px', opacity: 0.6 }}>{getZoneCount(zone.id)} Units Found</p>
                    </div>
                    <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '6px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 900 }}>BOS LIVE</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#C9A84C', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.8 }}>Featured Compounds</div>
                    {zone.compounds.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700 }}>{c.name}</div>
                          <div style={{ fontSize: '11px', opacity: 0.5 }}>Yield: {c.yield} / yr</div>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#C9A84C' }}>{c.availability}</div>
                      </div>
                    ))}
                  </div>

                  <button className="btn btn-gold btn-sm" style={{ 
                    marginTop: '20px', width: '100%', padding: '14px', 
                    borderRadius: '12px', fontWeight: 800, fontSize: '11px', 
                    letterSpacing: '2px', border: 'none', cursor: 'pointer'
                  }}>VIEW ALL LISTINGS</button>
                </div>
              </Popup>
            </Marker>
          ))}

          {selectedZone && (
            <RecenterMap 
              coords={zones.find(z => z.id === selectedZone)?.coords || MAP_CENTER} 
              zoom={mapZoom} 
            />
          )}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="map-glass-apple" style={{ position: 'absolute', bottom: '20px', left: '20px', zIndex: 1000, padding: '15px 25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', background: '#C9A84C', borderRadius: '50%' }}></div>
              <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.7 }}>PRIMARY ZONE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '20px', animation: 'pulse 1.5s infinite' }}></div>
              <span style={{ fontSize: '11px', fontWeight: 700, opacity: 0.7 }}>BOS LIVE SYNC</span>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE SIDEBAR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '4px', height: '20px', background: '#C9A84C', borderRadius: '2px' }}></div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#F4F0E8' }}>Zone Intelligence</h2>
        </div>

        {zones.map(zone => {
          const isActive = selectedZone === zone.id;
          return (
            <motion.div
              key={zone.id}
              onClick={() => handleZoneClick(zone)}
              whileHover={{ x: 5 }}
              style={{
                padding: '25px',
                background: isActive ? 'rgba(201, 168, 76, 0.05)' : 'rgba(255,255,255,0.03)',
                borderRadius: '24px',
                border: `1px solid ${isActive ? '#C9A84C' : 'rgba(255,255,255,0.05)'}`,
                cursor: 'pointer',
                transition: '0.3s',
                boxShadow: isActive ? '0 15px 35px rgba(201,168,76,0.1)' : 'none',
                color: '#F4F0E8'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800 }}>{zone.nameEn}</span>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#C9A84C' }}>{getZoneCount(zone.id)}</span>
              </div>
              <div style={{ fontSize: '12px', opacity: 0.5, marginBottom: '15px' }}>{zone.nameAr}</div>
              
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {zone.compounds.slice(0, 3).map((comp, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ fontWeight: 600 }}>{comp.name}</span>
                          <span style={{ opacity: 0.6 }}>{comp.availability} Avail.</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#C9A84C', fontWeight: 800, marginTop: '10px' }}>
                        SEE ALL COMPOUNDS <ChevronRight size={10} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .apple-popup .leaflet-popup-content-wrapper {
          background: #050B14;
          color: #F4F0E8;
          border-radius: 24px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
          border: 1px solid rgba(212,175,55,0.2);
        }
        .apple-popup .leaflet-popup-content { margin: 0; }
        .apple-popup .leaflet-popup-tip-container { display: none; }
        
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
