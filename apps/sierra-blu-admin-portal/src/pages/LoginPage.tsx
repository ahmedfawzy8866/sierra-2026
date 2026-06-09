import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { LogIn, AlertCircle, Loader } from 'lucide-react';
import '../App.css';

export function LoginPage() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Email and password are required');
      return;
    }

    try {
      await login(email, password);
    } catch {
      setLocalError(error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="text-amber-400 text-4xl mb-4">🏘️</div>
          <h1 className="text-3xl font-playfair text-white mb-2">Sierra Estates Admin</h1>
          <p className="text-slate-400">Intelligence OS v12.0</p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              />
            </div>

            {/* Error Message */}
            {(localError || error) && (
              <div className="flex gap-3 p-3 bg-red-900/20 border border-red-800 rounded">
                <AlertCircle className="text-red-400 flex-shrink-0" size={18} />
                <p className="text-red-300 text-sm">{localError || error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-400 text-slate-900 font-semibold rounded hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-slate-400 text-xs mb-3">Demo Credentials (if available):</p>
            <div className="bg-slate-700/50 rounded p-3 text-slate-300 text-xs space-y-1 font-mono">
              <p>Email: admin@sierra-blu.com</p>
              <p>Password: Contact your administrator</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8">
          © 2026 Sierra Estates Realty. All rights reserved.
        </p>
      </div>
    </div>
  );
}
