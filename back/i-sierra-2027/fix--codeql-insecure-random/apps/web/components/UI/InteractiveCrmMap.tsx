'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GeometricPinNode {
  id: string;
  unit_code: string;
  compound_name: string;
  price_string: string;
  top_pct: number;
  left_pct: number;
  bua: string;
}

const NATIVE_CRM_PINS: GeometricPinNode[] = [
  { id: "pin-01", unit_code: "MVD-3F-110K", compound_name: "Mivida", price_string: "110K EGP", top_pct: 45, left_pct: 52, bua: "191m²" },
  { id: "pin-02", unit_code: "UPT-5U-48M", compound_name: "Uptown Cairo", price_string: "48M EGP", top_pct: 60, left_pct: 38, bua: "457m²" },
  { id: "pin-03", unit_code: "VIL-4F-90K", compound_name: "Villette Sodic", price_string: "90K EGP", top_pct: 35, left_pct: 65, bua: "258m²" }
];

export default function InteractiveCrmMap({ isArabic }: { isArabic: boolean }) {
  const [selectedNode, setSelectedNode] = useState<GeometricPinNode>(NATIVE_CRM_PINS[0]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);
  if (!hydrated) return <div className="h-96 flex items-center justify-center text-xs font-mono tracking-widest text-[#071422]/40 bg-[#F4F0E8]">SYNCHRONIZING CANVAS TILES...</div>;

  return (
    <div className="w-full h-[78dvh] bg-white border border-[#071422]/5 rounded-[2.5rem] flex flex-col lg:flex-row overflow-hidden shadow-xl z-20 relative">
      <aside className="w-full lg:w-[350px] bg-white border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col z-20 shrink-0">
        <div className="p-6 bg-[#F4F0E8]/40 border-b border-gray-100">
          <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#C8961A]">Sovereign Map Stream</span>
          <h3 className="font-serif text-lg font-bold text-[#071422] mt-0.5">{isArabic ? 'المخزون الموثق لايف' : 'Live Curated Inventory'}</h3>
        </div>
        <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
          {NATIVE_CRM_PINS.map((pin) => (
            <div
              key={pin.id} onClick={() => setSelectedNode(pin)}
              className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                selectedNode.id === pin.id ? 'border-[#1E88D9] bg-[#1E88D9]/5' : 'border-gray-50 bg-white'
              }`}
            >
              <div>
                <h4 className="text-xs font-bold text-[#071422]">{pin.price_string}</h4>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{pin.compound_name}</p>
              </div>
              <span className="text-[9px] font-mono font-bold bg-[#F4F0E8] px-2 py-1 rounded text-[#071422]">{pin.unit_code}</span>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 h-full bg-[#F4F0E8] relative z-10 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(#071422_1.2px,transparent_1.2px)] [background-size:24px_24px]" />
        {NATIVE_CRM_PINS.map((pin) => (
          <button
            key={pin.id} onClick={() => setSelectedNode(pin)}
            style={{ top: `${pin.top_pct}%`, left: `${pin.left_pct}%` }}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 outline-none"
          >
            <div className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shadow-md transition-all border ${
              selectedNode.id === pin.id ? 'bg-[#071422] text-white border-[#071422]' : 'bg-white text-[#071422] border-gray-200'
            }`}>
              📍 {pin.price_string.split(' ')[0]}
            </div>
          </button>
        ))}

        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white z-30"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#071422]">{selectedNode.price_string}</h4>
                  <p className="text-[10px] text-gray-400 font-medium">{selectedNode.compound_name}, East Cairo</p>
                </div>
                <span className="text-[8px] font-mono font-bold bg-[#1E88D9]/10 text-[#1E88D9] px-2 py-0.5 rounded border border-[#1E88D9]/20">{selectedNode.unit_code}</span>
              </div>
              <p className="text-[9px] font-mono text-gray-500 mb-3">Telemetry Data Scope: {selectedNode.bua} Total Area</p>
              <button className="w-full py-2 bg-[#071422] text-white text-[9px] font-bold uppercase tracking-widest rounded-lg">
                {isArabic ? 'عرض تفاصيل المستند العقاري' : 'Open Certified Record'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
