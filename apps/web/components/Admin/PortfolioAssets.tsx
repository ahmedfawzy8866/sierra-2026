"use client";
import React, { useState } from 'react';
import { useProperties, usePropertyStats } from '../../hooks/useProperties';
import { 
  Property, 
  addProperty, 
  updateProperty, 
  deleteProperty, 
  PropertyStatus, 
  OfferType 
} from '../../lib/firebase/inventory';
import { 
  Plus, 
  MapPin, 
  DollarSign,
  Search, 
  Filter, 
  Download, 
  Import, 
  MoreHorizontal, 
  Star, 
  Globe, 
  Clock, 
  LayoutGrid, 
  List,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyForm from './PropertyForm';
import PropertyDrawer from './PropertyDrawer';
import PasteUnit from './PasteUnit';
import toast from 'react-hot-toast';

export default function PortfolioAssets() {
  const [filters, setFilters] = useState({ 
    search: '', 
    status: '' as PropertyStatus | '', 
    offer_type: '' as OfferType | '' 
  });
  
  const { properties, loading, refetch } = useProperties({
    status: filters.status || undefined,
    offer_type: filters.offer_type || undefined
  });

  const { stats, loading: statsLoading } = usePropertyStats();

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPasteOpen, setIsPasteOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | undefined>(undefined);

  // Filtered properties (local search)
  const filteredProperties = properties.filter(p => {
    const s = filters.search.toLowerCase();
    return (
      p.title_en.toLowerCase().includes(s) || 
      p.title_ar.toLowerCase().includes(s) || 
      p.unit_code.toLowerCase().includes(s) ||
      p.compound_name.toLowerCase().includes(s)
    );
  });

  const handleCreate = async (data: Partial<Property>) => {
    try {
      await addProperty(data as any);
      toast.success("Asset successfully incorporated into portfolio.");
      setIsFormOpen(false);
      setIsPasteOpen(false);
      refetch();
    } catch (err) {
      toast.error("Failed to synchronize asset data.");
    }
  };

  const handleUpdate = async (data: Partial<Property>) => {
    if (!editingProperty?.id) return;
    try {
      await updateProperty(editingProperty.id, data);
      toast.success("Asset intelligence updated.");
      setIsFormOpen(false);
      setEditingProperty(undefined);
      refetch();
    } catch (err) {
      toast.error("Update synchronization failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This action will permanently remove the asset from the strategic inventory.")) return;
    try {
      await deleteProperty(id);
      toast.success("Asset removed from portfolio.");
      setSelectedProperty(null);
      refetch();
    } catch (err) {
      toast.error("Asset termination failed.");
    }
  };

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case 'available': return '#22C55E';
      case 'reserved': return '#F59E0B';
      case 'sold': return '#EF4444';
      default: return '#64748B';
    }
  };

  return (
    <div className="portfolio-container p-8 max-w-[1600px] mx-auto space-y-10">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10"
      >
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Portfolio <span className="luxury-gradient-text">Assets</span></h1>
          <p className="text-white/40 text-lg font-medium max-w-2xl">Executive command center for luxury inventory management and strategic asset deployment.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPasteOpen(true)}
            className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-3 group"
          >
            <Import size={18} className="text-gold group-hover:scale-110 transition-transform" />
            Import Intelligence
          </button>
          <button 
            onClick={() => {
              setEditingProperty(undefined);
              setIsFormOpen(true);
            }}
            className="bg-gold text-navy px-8 py-3 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gold/20 flex items-center gap-3"
          >
            <Plus size={20} />
            Incorporate Asset
          </button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Assets', value: stats.total, icon: <Package size={20} />, color: 'blue' },
          { label: 'Currently Available', value: stats.available, icon: <CheckCircle2 size={20} />, color: 'emerald' },
          { label: 'Featured Portfolio', value: stats.featured, icon: <Star size={20} />, color: 'gold' },
          { label: 'Stale Intelligence', value: stats.stale, icon: <Clock size={20} />, color: 'orange' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.04)' }}
            className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-3xl flex items-center gap-5 transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-500`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">{stat.label}</div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="relative w-full md:w-[300px] group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" />
            <input 
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
              placeholder="Search assets, codes, or compounds..."
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 ps-12 pe-6 text-sm text-white focus:outline-none focus:border-gold/30 transition-all"
            />
          </div>
          <select 
            value={filters.status} 
            onChange={e => setFilters({...filters, status: e.target.value as any})}
            className="bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3 text-sm text-white/70 focus:outline-none focus:border-gold/30"
          >
            <option value="" className="bg-navy">All Statuses</option>
            <option value="available" className="bg-navy">Available Assets</option>
            <option value="reserved" className="bg-navy">Reserved Units</option>
            <option value="sold" className="bg-navy">Closed Sales</option>
          </select>
          <select 
            value={filters.offer_type} 
            onChange={e => setFilters({...filters, offer_type: e.target.value as any})}
            className="bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3 text-sm text-white/70 focus:outline-none focus:border-gold/30"
          >
            <option value="" className="bg-navy">All Offers</option>
            <option value="sale" className="bg-navy">Resale/Primary</option>
            <option value="rent" className="bg-navy">Rental Inventory</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-3 rounded-xl bg-gold text-navy"><List size={18} /></button>
          <button className="p-3 rounded-xl bg-white/5 text-white/30 hover:text-white transition-colors"><LayoutGrid size={18} /></button>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.03] border-bottom border-white/5">
              <th className="p-6 text-[11px] font-black text-white/30 uppercase tracking-widest">Asset Code</th>
              <th className="p-6 text-[11px] font-black text-white/30 uppercase tracking-widest">Primary Descriptor</th>
              <th className="p-6 text-[11px] font-black text-white/30 uppercase tracking-widest">Compound</th>
              <th className="p-6 text-[11px] font-black text-white/30 uppercase tracking-widest">Valuation</th>
              <th className="p-6 text-[11px] font-black text-white/30 uppercase tracking-widest">Status</th>
              <th className="p-6 text-[11px] font-black text-white/30 uppercase tracking-widest">Freshness</th>
              <th className="p-6 text-right text-[11px] font-black text-white/30 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-20 text-center text-white/20 font-black uppercase tracking-[0.4em]">Incurring intelligence data...</td></tr>
            ) : filteredProperties.length === 0 ? (
              <tr><td colSpan={7} className="p-20 text-center text-white/20 font-black uppercase tracking-[0.4em]">No matching assets found.</td></tr>
            ) : filteredProperties.map((prop, idx) => (
              <motion.tr 
                key={prop.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedProperty(prop)}
                className="group border-b border-white/[0.02] hover:bg-white/[0.03] cursor-pointer transition-colors"
              >
                <td className="p-6">
                  <div className={`
                    inline-block px-3 py-1 rounded-lg text-[10px] font-mono font-bold border
                    ${prop.is_featured ? 'bg-gold/10 border-gold/30 text-gold shadow-[0_0_10px_rgba(200,169,110,0.1)]' : 'bg-white/5 border-white/10 text-white/60'}
                  `}>
                    {prop.unit_code}
                  </div>
                </td>
                <td className="p-6">
                  <div className="font-bold text-white text-base group-hover:text-gold transition-colors">{prop.title_en}</div>
                  <div className="text-xs text-white/30 font-medium mt-1">{prop.bedrooms} BR • {prop.furnishing}</div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <MapPin size={14} className="text-gold/50" />
                    {prop.compound_name}
                  </div>
                </td>
                <td className="p-6">
                  <div className="font-black text-white text-base">{prop.price.toLocaleString()} <span className="text-[10px] text-white/30">{prop.currency}</span></div>
                  <div className="text-[10px] font-black text-gold/60 uppercase tracking-widest mt-1">{prop.offer_type}</div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: getStatusColor(prop.status), boxShadow: `0 0 10px ${getStatusColor(prop.status)}80` }} />
                    <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{prop.status}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white/40">
                      {prop.freshness_date?.toDate ? prop.freshness_date.toDate().toLocaleDateString() : 'Recent'}
                    </span>
                    {prop.stale_flag && <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                  </div>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProperty(prop);
                        setIsFormOpen(true);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-gold hover:text-navy transition-all"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals & Drawings */}
      <AnimatePresence>
        {isFormOpen && (
          <PropertyForm 
            property={editingProperty}
            onSave={editingProperty ? handleUpdate : handleCreate}
            onClose={() => setIsFormOpen(false)}
          />
        )}
        
        {isPasteOpen && (
          <PasteUnit 
            onSave={handleCreate}
            onClose={() => setIsPasteOpen(false)}
          />
        )}

        {selectedProperty && (
          <PropertyDrawer 
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
            onEdit={(p) => {
              setSelectedProperty(null);
              setEditingProperty(p);
              setIsFormOpen(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </AnimatePresence>

      <style>{`
        .luxury-gradient-text {
          background: linear-gradient(135deg, #C8A96E 0%, #F5E6C8 50%, #C8A96E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}
