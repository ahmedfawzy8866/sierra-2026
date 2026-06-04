'use client';

/**
 * SIERRA BLU — INVENTORY SHOWCASE
 * High-fidelity grid of exclusive properties with hover states and cinematic reveals.
 * Design: Quiet Luxury (Navy/Gold/Ivory)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Maximize, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
  category: string;
}

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'The Azure Residence',
    location: 'Marassi, North Coast',
    price: 'EGP 42,000,000',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&fit=crop',
    beds: 5,
    baths: 6,
    sqft: 4500,
    category: 'Villa',
  },
  {
    id: '2',
    title: 'Midnight Oasis Penthouse',
    location: 'Zayed, New Giza',
    price: 'EGP 18,500,000',
    image: 'https://images.unsplash.com/photo-1600607687940-4e2003e059ec?q=80&w=1200&fit=crop',
    beds: 3,
    baths: 4,
    sqft: 3200,
    category: 'Penthouse',
  },
  {
    id: '3',
    title: 'Ethereal Heights Mansion',
    location: 'Sokhna, Galala',
    price: 'EGP 25,000,000',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&fit=crop',
    beds: 6,
    baths: 7,
    sqft: 5800,
    category: 'Mansion',
  },
];

export default function InventoryShowcase() {
  return (
    <section className="py-24 px-6 md:px-12 bg-sb-navy-deep relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sb-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sb-cyan/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-sb-gold uppercase tracking-[0.3em] text-xs font-bold mb-4 block"
            >
              Curated Portfolio
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-playfair text-4xl md:text-6xl text-white mb-6"
            >
              Exquisite <span className="italic">Living</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg font-light leading-relaxed"
            >
              Discover our hand-selected inventory of properties that define the Quiet Luxury standard in modern Egyptian living.
            </motion.p>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 text-sb-gold font-semibold uppercase tracking-widest text-sm border-b border-sb-gold/30 pb-2 hover:border-sb-gold transition-all duration-300"
          >
            Explore All Units <ArrowRight size={18} />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_PROPERTIES.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PropertyCard({ property, index }: { property: Property; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
          <span className="text-[10px] uppercase tracking-widest text-white/90 font-bold">{property.category}</span>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-sb-navy-deep via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Quick actions on hover */}
        <div className="absolute bottom-6 left-6 right-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex justify-between items-center">
          <button className="px-6 py-2 bg-sb-gold text-sb-navy-deep rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
            View Details
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-playfair text-2xl text-white group-hover:text-sb-gold transition-colors duration-300">
            {property.title}
          </h3>
          <span className="text-sb-gold font-bold text-lg">{property.price.split(' ')[1]}M</span>
        </div>
        
        <div className="flex items-center gap-2 text-white/40 mb-4">
          <MapPin size={14} className="text-sb-gold/60" />
          <span className="text-xs uppercase tracking-widest font-light">{property.location}</span>
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Bed size={14} className="text-white/30" />
            <span className="text-xs text-white/60 font-light">{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath size={14} className="text-white/30" />
            <span className="text-xs text-white/60 font-light">{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize size={14} className="text-white/30" />
            <span className="text-xs text-white/60 font-light">{property.sqft} sqft</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
