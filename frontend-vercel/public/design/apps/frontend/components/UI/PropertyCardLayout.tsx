"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Property } from '@/lib/firebase';
import { MapPin, BedDouble, Bath, Square } from 'lucide-react';

interface PropertyCardLayoutProps {
  property: Property;
}

export function PropertyCardLayout({ property }: PropertyCardLayoutProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Peachworlds' spring configuration for smooth tilt
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-shadow duration-500 overflow-hidden cursor-pointer group border border-sierra-navy/5"
    >
      <div 
        className="w-full h-64 bg-sierra-ivory relative overflow-hidden"
        style={{ transform: "translateZ(30px)" }}
      >
        <Image 
          src={property.img_url || "/placeholder.jpg"} 
          alt={property.compound_name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 bg-sierra-estatese text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
          {property.purpose}
        </div>
        <div className="absolute top-4 right-4 bg-sierra-gold text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
          {property.unit_code}
        </div>
      </div>

      <div 
        className="p-6 bg-white"
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-sierra-navy tracking-tight">{property.compound_name}</h3>
            <div className="flex items-center text-sierra-navy/60 text-sm mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span>Unit {property.unit_code}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 my-4 py-4 border-y border-sierra-navy/10 text-sierra-navy/80 text-sm font-medium">
          <div className="flex items-center">
            <BedDouble className="w-4 h-4 mr-1.5 text-sierra-estatese" />
            <span>{property.beds || 0}</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1.5 text-sierra-estatese" />
            <span>{property.baths || 0}</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1.5 text-sierra-estatese" />
            <span>{property.bua_m2 || 0} sqm</span>
          </div>
        </div>

        <div className="flex items-end justify-between mt-2">
          <div className="text-2xl font-extrabold text-sierra-navy tracking-tight">
            ${property.price.toLocaleString()}
          </div>
          <div className="text-sierra-estatese text-sm font-semibold uppercase hover:text-sierra-gold transition-colors duration-300">
            View Details
          </div>
        </div>
      </div>
    </motion.div>
  );
}
