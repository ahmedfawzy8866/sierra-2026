import React from 'react';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center bg-sierra-ivory/90 backdrop-blur-md border-b border-sierra-navy/10">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-sierra-navy rounded-full flex items-center justify-center">
          <span className="text-sierra-ivory font-bold text-lg tracking-tighter">SB</span>
        </div>
        <span className="text-sierra-navy font-bold text-2xl tracking-tight uppercase">
          Sierra-Blu
        </span>
      </div>
      
      <div className="hidden md:flex items-center space-x-12">
        <Link href="/properties" className="text-sierra-navy font-medium text-sm tracking-wide uppercase hover:text-sierra-estatese transition-colors duration-300">
          Portfolio
        </Link>
        <Link href="/concierge" className="text-sierra-navy font-medium text-sm tracking-wide uppercase hover:text-sierra-estatese transition-colors duration-300">
          Concierge
        </Link>
        <Link href="/journal" className="text-sierra-navy font-medium text-sm tracking-wide uppercase hover:text-sierra-estatese transition-colors duration-300">
          Journal
        </Link>
      </div>

      <div>
        <button className="bg-sierra-navy text-sierra-ivory px-6 py-2.5 rounded-full font-semibold text-sm tracking-wide uppercase hover:bg-sierra-gold transition-colors duration-300 shadow-sm hover:shadow-md">
          Client Portal
        </button>
      </div>
    </nav>
  );
}
