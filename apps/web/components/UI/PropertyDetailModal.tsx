"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Home, DollarSign, ChevronRight, Phone, MessageSquare } from 'lucide-react';

interface Property {
  name: string;
  loc: string;
  type: string;
  price: string;
  img: string;
  description?: string;
  features?: string[];
}

interface PropertyDetailModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  isAr: boolean;
}

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, isOpen, onClose, isAr }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-5xl bg-[#0A1628] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Media Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
          <img 
            src={property.img} 
            alt={property.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="mb-8">
            <span className="text-gold text-xs font-black uppercase tracking-widest mb-2 block">
              {property.type}
            </span>
            <h2 className="serif text-4xl md:text-5xl text-white mb-4 leading-tight">
              {property.name}
            </h2>
            <div className="flex items-center gap-2 text-white/60 mb-6">
              <MapPin size={18} className="text-gold" />
              <span className="text-lg font-medium">{property.loc}</span>
            </div>
            <div className="text-3xl font-bold text-gold mb-8 flex items-center gap-1">
              {isAr ? '' : <DollarSign size={24} />}
              <span>{property.price}</span>
              {isAr ? ' ج.م' : ''}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-4 opacity-50">
                {isAr ? 'عن العقار' : 'About Property'}
              </h4>
              <p className="text-white/80 leading-relaxed text-lg font-light">
                {isAr 
                  ? 'هذا العقار الفاخر يجسد معايير الرقي والرفاهية في قلب التجمع الخامس. يتميز بتصميم عصري فريد، وإطلالات خلابة، ومساحات معيشة واسعة تلبي تطلعات النخبة.'
                  : 'This premium property embodies the standards of sophistication and luxury in the heart of New Cairo. Featuring unique modern design, breathtaking views, and spacious living areas that meet the aspirations of the elite.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Home, label: isAr ? 'مساحة واسعة' : 'Spacious Area' },
                { icon: ChevronRight, label: isAr ? 'تشطيب فاخر' : 'Luxury Finishing' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                  <feature.icon size={20} className="text-gold" />
                  <span className="text-white/90 text-sm font-medium">{feature.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10">
              <button className="flex-1 btn btn-gold flex items-center justify-center gap-2 py-4 rounded-xl font-bold tracking-widest uppercase text-xs">
                <Phone size={18} />
                {isAr ? 'اتصل الآن' : 'Call Now'}
              </button>
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 py-4 rounded-xl font-bold tracking-widest uppercase text-xs transition-colors">
                <MessageSquare size={18} />
                {isAr ? 'واتساب' : 'WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PropertyDetailModal;
