import React from 'react';
import { Map } from 'lucide-react';

interface HubtownMapProps {
  lat?: number;
  lng?: number;
}

export function HubtownMap({ lat = 34.0522, lng = -118.2437 }: HubtownMapProps) {
  return (
    <div className="w-full h-96 bg-sierra-ivory rounded-3xl border border-sierra-navy/10 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("/grid-pattern.svg")', backgroundSize: '40px 40px' }} />
      <Map className="w-12 h-12 text-sierra-navy/40 mb-4" />
      <div className="text-sierra-navy font-bold text-lg tracking-tight uppercase">
        Hubtown Numeric Coordinates Map
      </div>
      <div className="text-sierra-navy/60 font-mono text-sm mt-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-sierra-navy/5">
        Lat: {lat.toFixed(4)} • Lng: {lng.toFixed(4)}
      </div>
      
      {/* Decorative center pin */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-12">
        <div className="w-4 h-4 bg-sierra-estatese rounded-full shadow-[0_0_0_4px_rgba(30,136,217,0.2)] animate-pulse" />
      </div>
    </div>
  );
}
