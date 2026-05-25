'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowUpDown, House, MapPin, Bed, Bath, Maximize, ExternalLink, Diamond } from 'lucide-react';
import { getProperties, Property, PropertyFilters } from '@/lib/firebase/inventory';

export default function InventoryGrid() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInventory();
  }, [filters]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await getProperties(filters);
      setProperties(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(p => 
    p.compound_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.unit_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.unit_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Header & Search - Digital Curator Style */}
      <div className="flex items-center justify-between gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]/50" />
          <input 
            type="text" 
            placeholder="Search Global Inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#050B14]/40 border border-[#D4AF37]/10 py-4 ps-12 pe-4 text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-all font-medium rounded-xl placeholder:text-[#F4F0E8]/20"
          />
        </div>
        
        <div className="flex gap-3">
            <button className="px-6 py-4 border border-[#D4AF37]/10 flex items-center gap-2 hover:bg-[#D4AF37]/5 transition-all rounded-xl">
               <Filter className="w-4 h-4 text-[#D4AF37]" />
               <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Filters</span>
            </button>
            <button className="px-6 py-4 border border-[#D4AF37]/10 flex items-center gap-2 hover:bg-[#D4AF37]/5 transition-all rounded-xl text-[#F4F0E8]/40">
               <ArrowUpDown className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Sort</span>
            </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pe-2 scrollbar-hide">
        {loading ? (
          <div className="grid grid-cols-2 gap-8 opacity-20">
             {[1,2,3,4].map(i => (
               <div key={i} className="cinematic-surface h-[350px] animate-pulse" />
             ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center border border-dashed border-[#D4AF37]/10 rounded-3xl opacity-30">
             <House className="w-16 h-16 text-[#D4AF37] mb-6" />
             <p className="text-lg font-serif tracking-widest uppercase text-[#D4AF37]">No Active Assets Found</p>
             <p className="text-[10px] uppercase tracking-[0.4em] mt-3">Adjust your neural filters or sync portal</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredProperties.map((p) => (
                <motion.div 
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="cinematic-surface group cursor-pointer overflow-hidden relative"
                >
                  <div className="aspect-[16/10] bg-[#050B14] relative overflow-hidden">
                    {p.cover_image_url ? (
                      <img 
                        src={p.cover_image_url} 
                        alt={p.title_en} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-[3000ms] ease-out" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                         <Diamond className="w-12 h-12 text-[#D4AF37]/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-transparent opacity-80" />
                    <div className="absolute top-6 left-6 z-10 px-4 py-1.5 bg-[#050B14]/80 backdrop-blur-xl border border-[#D4AF37]/20 rounded-md">
                        <span className="text-[10px] font-black text-[#D4AF37] tracking-widest uppercase">{p.unit_code}</span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-3">
                       <MapPin className="w-3 h-3 text-[#D4AF37]" />
                       <span className="text-[10px] font-black text-[#D4AF37]/60 uppercase tracking-[0.3em]">{p.compound_name}</span>
                    </div>
                    
                    <h4 className="text-xl font-serif mb-6 group-hover:text-[#D4AF37] transition-colors line-clamp-1 text-[#F4F0E8]">{p.title_en}</h4>
                    
                    <div className="flex items-center gap-8 mb-8 py-5 border-y border-[#F4F0E8]/5">
                       <div className="flex items-center gap-2.5">
                          <Bed className="w-4.5 h-4.5 text-[#F4F0E8]/30" />
                          <span className="text-xs font-bold text-[#F4F0E8]/80">{p.bedrooms}</span>
                       </div>
                       <div className="flex items-center gap-2.5">
                          <Bath className="w-4.5 h-4.5 text-[#F4F0E8]/30" />
                          <span className="text-xs font-bold text-[#F4F0E8]/80">{p.bathrooms}</span>
                       </div>
                       <div className="flex items-center gap-2.5">
                          <Maximize className="w-4.5 h-4.5 text-[#F4F0E8]/30" />
                          <span className="text-xs font-bold text-[#F4F0E8]/80 leading-none">{p.bua_m2} <span className="text-[8px] opacity-30">SQM</span></span>
                       </div>
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black text-[#F4F0E8]/30 uppercase tracking-[0.2em] leading-none mb-1.5">Asset Valuation</span>
                          <span className="text-2xl font-bold font-serif text-[#F4F0E8]">
                            {p.currency === 'USD' ? '$' : ''}{p.price.toLocaleString()} {p.currency === 'EGP' ? 'EGP' : ''}
                          </span>
                       </div>
                       <button className="w-12 h-12 flex items-center justify-center border border-[#F4F0E8]/10 rounded-full hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050B14] transition-all duration-500 group-hover:scale-110">
                          <ExternalLink className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <style>{`
        .cinematic-surface {
          background: rgba(10, 22, 40, 0.6);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(212, 175, 55, 0.1);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
          border-radius: 1.5rem;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .cinematic-surface:hover {
          border-color: rgba(212, 175, 55, 0.3);
          transform: translateY(-8px);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.05);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
