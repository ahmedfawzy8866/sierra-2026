'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseClientConfigured } from '@/lib/firebase';
import { Shield, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!isFirebaseClientConfigured) {
        console.log('[firebase] Development login bypass active.');
        router.replace('/admin/dashboard');
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.code ? `${err.code}: ${err.message}` : err?.message || 'Unknown login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#031632] flex items-center justify-center p-6"
      style={{ fontFamily: 'var(--font-body)' }}>

      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #C9A84C 0%, transparent 60%)' }} />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 shadow-2xl">
          
          {/* Logo */}
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20
                            flex items-center justify-center mb-5">
              <Shield className="text-[#C9A84C]" size={28} />
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight uppercase mb-1"
              style={{ fontFamily: 'var(--font-display)' }}>
              Sierra Estates
            </h1>
            <p className="text-white/30 text-[9px] tracking-widest uppercase font-mono">
              Admin Nexus · Secure Access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email"
                className="block text-[9px] tracking-widest uppercase text-white/40 font-mono">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="admin@sierrablurealty.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
                           text-white text-sm placeholder:text-white/20
                           focus:outline-none focus:border-[#C9A84C]/50 focus:bg-white/8
                           transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password"
                className="block text-[9px] tracking-widest uppercase text-white/40 font-mono">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3
                           text-white text-sm placeholder:text-white/20
                           focus:outline-none focus:border-[#C9A84C]/50 focus:bg-white/8
                           transition-all"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10
                              border border-red-500/20 rounded-lg px-4 py-3">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 bg-[#C9A84C] text-[#031632] rounded-lg
                         font-bold text-[10px] tracking-[0.2em] uppercase
                         hover:bg-[#E9C176] transition-all disabled:opacity-50
                         flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Authenticating...' : 'Enter Portal'}
            </button>
          </form>

          <p className="text-center text-white/20 text-[9px] tracking-widest uppercase mt-10 font-mono">
            Sierra Estates Realty · Digital Concierge V13.0
          </p>
        </div>
      </div>
    </div>
  );
}
