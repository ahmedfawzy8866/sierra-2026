'use client';

import React, { useState, useRef, useEffect } from 'react';

interface LuxuryVirtualViewportProps {
  propertyId: string;
  tourUrl?: string;
  title: string;
  onClose?: () => void;
}

export default function LuxuryVirtualViewport({
  propertyId,
  tourUrl,
  title,
  onClose,
}: LuxuryVirtualViewportProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Lazy load iframe on demand
    if (isLoaded && iframeRef.current && !iframeRef.current.src) {
      const url = tourUrl || `https://matterport.com/community/${propertyId}`;
      iframeRef.current.src = url;
    }
  }, [isLoaded, tourUrl, propertyId]);

  return (
    <div className="relative w-full h-screen bg-navy-200 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-navy-300/80 to-transparent backdrop-blur-sm p-6 flex justify-between items-center">
        <h2 className="font-serif text-display-md text-ivory-100">{title}</h2>
        <button
          onClick={onClose}
          className="text-ivory-100 hover:text-gold-500 transition-colors text-3xl font-light"
        >
          ✕
        </button>
      </div>

      {/* Lazy Load Trigger Button */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-navy-300/50 backdrop-blur">
          <button
            onClick={() => setIsLoaded(true)}
            className="bg-gold-500 hover:bg-gold-600 text-navy-300 font-serif text-heading-md px-12 py-6 rounded-lg shadow-luxury transition-all hover:scale-105"
          >
            Load 360° Virtual Tour
          </button>
        </div>
      )}

      {/* Virtual Tour Iframe */}
      <iframe
        ref={iframeRef}
        className="absolute inset-0 w-full h-full border-none"
        allowFullScreen
        allow="xr-spatial-tracking"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />

      {/* Telemetry Overlay */}
      {showTelemetry && isLoaded && (
        <div className="absolute bottom-6 right-6 z-20 bg-navy-300/90 backdrop-blur-md rounded-lg p-4 font-mono text-sm text-sierra-blue-500 border border-sierra-blue-500/30 max-w-xs">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Tour Engine Online</span>
          </div>
          <div className="text-xs text-ivory-100/70 space-y-1">
            <div>Property ID: {propertyId}</div>
            <div>Rendering: 360° Panoramic</div>
            <div>Status: {isLoaded ? 'Live' : 'Loading...'}</div>
          </div>
        </div>
      )}

      {/* Telemetry Toggle */}
      <button
        onClick={() => setShowTelemetry(!showTelemetry)}
        className="absolute bottom-6 left-6 z-20 text-ivory-100/50 hover:text-sierra-blue-500 transition-colors text-xs uppercase tracking-wider font-sans"
      >
        {showTelemetry ? 'Hide' : 'Show'} Telemetry
      </button>
    </div>
  );
}
