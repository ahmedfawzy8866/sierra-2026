'use client';

import Map, { NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTheme } from 'next-themes';

const NEW_CAIRO_COORDS = {
  longitude: 31.4720,
  latitude: 30.0320,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

export default function DigitalLiveMap() {
  const { theme } = useTheme();
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const isDark = theme === 'dark' || !theme; // Default to dark for the cinematic look

  const mapStyle = isDark 
    ? 'mapbox://styles/mapbox/dark-v11'
    : 'mapbox://styles/mapbox/light-v11';

  // If no token is provided, show a premium placeholder
  if (!mapboxToken) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-[#0A1520] border border-[rgba(233,193,118,0.18)] rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1800&q=80')] bg-cover bg-center opacity-20 filter blur-sm mix-blend-overlay" />
        <div className="relative z-10 text-center px-6">
          <div className="w-16 h-16 mx-auto border-2 border-[#E9C176] rounded-full flex items-center justify-center mb-6">
            <span className="text-[#E9C176] text-xl font-serif">MB</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-4">Digital Live Market Map</h3>
          <p className="text-[#8899aa] max-w-md mx-auto text-sm leading-relaxed mb-6 font-sans">
            To unlock the interactive live map of New Cairo (powered by Mapbox GL), please add your <code className="text-[#E9C176]">NEXT_PUBLIC_MAPBOX_TOKEN</code> to your .env.local file.
          </p>
          <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-transparent text-[#E9C176] border border-[#E9C176] px-6 py-2.5 rounded hover:bg-[#E9C176] hover:text-[#0A1520] transition-colors text-xs tracking-[0.14em] uppercase font-medium">
            Get Free Token
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border border-[rgba(233,193,118,0.18)] relative shadow-2xl">
      <Map
        initialViewState={NEW_CAIRO_COORDS}
        mapStyle={mapStyle}
        mapboxAccessToken={mapboxToken}
      >
        <NavigationControl position="top-right" visualizePitch={false} />
      </Map>
    </div>
  );
}
