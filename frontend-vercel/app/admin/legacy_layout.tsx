'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  LayoutDashboard, Building2, Users, RefreshCw,
  ImageIcon, Settings, LogOut, Menu, X, Shield
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/dashboard',  label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/admin/units',      label: 'Units',        icon: Building2 },
  { href: '/admin/deals',      label: 'Deals',        icon: Users },
  { href: '/admin/sync',       label: 'Sync Center',  icon: RefreshCw },
  { href: '/admin/media',      label: 'Media',        icon: ImageIcon },
  { href: '/admin/settings',   label: 'Settings',     icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  // Auth guard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user && pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
      setChecking(false);
    });
    return unsub;
  }, [pathname, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/admin/login');
  };

  // Don't wrap login page
  if (pathname === '/admin/login') return <>{children}</>;

  if (checking) {
    return (
      <div className="min-h-screen bg-[#031632] flex items-center justify-center">
        <div className="text-[#C9A84C] text-xs tracking-widest uppercase animate-pulse font-mono">
          Authenticating...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8f9fa]" style={{ fontFamily: 'var(--font-body)' }}>

      {/* ══ SIDEBAR (Desktop) ══ */}
      <aside className="hidden lg:flex flex-col w-[280px] shrink-0 bg-[#031632] min-h-screen fixed top-0 left-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-3 px-8 py-8 border-b border-white/5">
          <Shield className="text-[#C9A84C]" size={28} />
          <div>
            <div className="text-white font-bold text-base tracking-tight uppercase"
              style={{ fontFamily: 'var(--font-display)' }}>
              Sierra Estates
            </div>
            <div className="text-white/30 text-[9px] tracking-widest uppercase font-mono">
              Admin Nexus
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-white/6 text-[#C9A84C] border-l-2 border-[#C9A84C] pl-[14px]'
                    : 'text-white/55 hover:text-white/90 hover:bg-white/4 border-l-2 border-transparent pl-[14px]'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="px-4 pb-8">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 text-white/40 hover:text-white/80 text-sm transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ══ MOBILE SIDEBAR ══ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#031632] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Shield className="text-[#C9A84C]" size={24} />
                <span className="text-white font-bold uppercase tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}>Sierra Estates</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-white/6 text-[#C9A84C]'
                        : 'text-white/55 hover:text-white/90'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* ══ MAIN CONTENT ══ */}
      <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-[68px] flex items-center justify-between px-6 md:px-10 bg-white/80 backdrop-blur-xl border-b border-black/5">
          <button
            className="lg:hidden text-[#071422]/60 hover:text-[#071422]"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="hidden lg:block text-sm font-semibold text-[#071422]/40 capitalize tracking-wide">
            {NAV_ITEMS.find(n => pathname.startsWith(n.href))?.label ?? 'Admin'}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
            <span className="text-[9px] text-[#071422]/30 tracking-widest uppercase font-mono">
              Nexus V13
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-10">
          {children}
        </main>
      </div>

      {/* ══ MOBILE BOTTOM NAV ══ */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#031632] border-t border-white/5 flex justify-around py-2">
        {NAV_ITEMS.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-2 ${
                active ? 'text-[#C9A84C]' : 'text-white/40'
              }`}
            >
              <Icon size={18} />
              <span className="text-[8px] tracking-wide uppercase">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
