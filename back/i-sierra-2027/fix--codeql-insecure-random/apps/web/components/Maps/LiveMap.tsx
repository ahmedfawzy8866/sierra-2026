'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LiveMapProps {
  mode?: 'dark' | 'light';
}

const ZONE_COORDS = [
  { lat: 30.0071, lng: 31.4345, area: 'Fifth Settlement', stat: 'Growth +12.4%', color: '#4ECDC4' },
  { lat: 30.0972, lng: 31.6314, area: 'Madinaty', stat: 'High Demand', color: '#E9C176' },
  { lat: 30.0320, lng: 31.4720, area: 'Mountain View', stat: '8.2% Yield', color: '#7EA8B4' },
  { lat: 30.1400, lng: 31.7400, area: 'Mostakbal City', stat: 'Off-Market Signals', color: '#C084FC' },
];

export default function LiveMap({ mode = 'dark' }: LiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (leafletInstance.current) {
      leafletInstance.current.remove();
    }

    const map = L.map(mapRef.current, {
      center: [30.055, 31.530],
      zoom: 11,
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    const tileUrl = mode === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_matter/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 18,
    }).addTo(map);

    // Custom Gold Marker
    const createGoldMarker = (color: string) => L.divIcon({
      className: 'custom-gold-marker',
      html: `<div style="width:14px;height:14px;background:${color};border:2px solid rgba(255,255,255,0.8);border-radius:50%;box-shadow:0 0 12px ${color}aa,0 0 24px ${color}44;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    ZONE_COORDS.forEach((z) => {
      const marker = L.marker([z.lat, z.lng], { icon: createGoldMarker(z.color) }).addTo(map);
      
      const popupContent = `
        <div style="font-family: 'Jost', sans-serif; padding: 4px; text-align: center;">
          <div style="font-size: 12px; font-weight: 600; color: #071422; margin-bottom: 2px;">${z.area}</div>
          <div style="font-size: 10px; color: ${z.color}; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">${z.stat}</div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: false,
        className: 'sierra-popup-custom',
      });

      marker.on('mouseover', function(this: any) {
        this.openPopup();
      });
    });

    leafletInstance.current = map;

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [mode]);

  return (
    <div className="w-full h-full relative">
      <style jsx global>{`
        .sierra-popup-custom .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border-radius: 8px;
          border: 1px solid rgba(233, 193, 118, 0.4);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .sierra-popup-custom .leaflet-popup-tip {
          display: none;
        }
        .leaflet-container {
          background: transparent !important;
        }
      `}</style>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
