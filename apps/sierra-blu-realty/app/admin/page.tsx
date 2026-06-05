'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Phase 1: Redirect old /admin root to new /admin/dashboard
 *
 * Migration: Old AdminPortal (SPA-style) → New App Router pages
 * This page serves as a transitional redirect to the unified admin dashboard.
 */
export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new unified dashboard
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#031632] flex items-center justify-center">
      <div className="text-[#C9A84C] text-xs tracking-widest uppercase animate-pulse font-mono">
        Redirecting to dashboard...
      </div>
    </div>
  );
}
