"use client";
import React, { useState, FormEvent } from 'react';
import { auth } from '../../lib/firebase';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../../lib/AuthContext';
import BrandLogo from '../UI/BrandLogo';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ChevronRight, ShieldCheck, Globe, BarChart3, Diamond } from 'lucide-react';

export default function LoginScreen({ onBack }: { onBack?: () => void }) {
  const { setGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const showSupportMessage = () => {
    setError('Contact the Sierra Blu admin team to reset or provision access.');
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      console.error(err);
      setError('Sign-in failed. Check your credentials or continue in guest mode.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      console.error(err);
      setError('Google sign-in was not completed. You can try again or continue in guest mode.');
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="screen active" style={{ flexDirection: 'row', minHeight: '100vh', background: 'var(--navy-dark)' }}>
      {/* Left side: Hero/Visuals */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ 
          flex: 1.2, 
          background: 'var(--navy)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '60px 48px', 
          position: 'relative', 
          overflow: 'hidden' 
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #0B1A3E 0%, #060C1A 100%)' }}></div>
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80") center/cover no-repeat',
            filter: 'grayscale(20%)'
          }}
        ></motion.div>
        
        {/* Abstract shapes for luxury feel */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(200,169,110,0.05) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(46,109,180,0.05) 0%, transparent 70%)', borderRadius: '50%' }}></div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          style={{ position: 'relative', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px' }}
        >
          <motion.div variants={fadeInUp} style={{ marginBottom: '24px' }}>
            <BrandLogo size="xl" themeOverride="dark" />
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            style={{ 
              color: 'var(--gold)', 
              fontSize: '18px', 
              fontFamily: 'var(--font-serif)', 
              letterSpacing: '2px', 
              textTransform: 'uppercase',
              marginBottom: '48px',
              fontWeight: 500
            }}
          >
            The Art of Precision
          </motion.div>

          <motion.div variants={staggerContainer} style={{ display: 'flex', flexDirection: 'column', gap: '32px', textAlign: 'left' }}>
            <motion.div variants={fadeInUp} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '12px', 
                background: 'rgba(200,169,110,0.1)', border: '1px solid rgba(200,169,110,0.2)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' 
              }}>
                <Globe size={20} />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600, letterSpacing: '0.5px' }}>Global Portfolio Access</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px', lineHeight: '1.5' }}>Curated Egyptian real estate for international and local elite portfolios.</div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '12px', 
                background: 'rgba(46,109,180,0.1)', border: '1px solid rgba(46,109,180,0.2)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue-light)' 
              }}>
                <BarChart3 size={20} />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600, letterSpacing: '0.5px' }}>Intelligent Analysis</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px', lineHeight: '1.5' }}>Proprietary data signals for informed, high-velocity advisory decisions.</div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '12px', 
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--silver)' 
              }}>
                <Diamond size={20} />
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600, letterSpacing: '0.5px' }}>Bespoke Experience</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px', lineHeight: '1.5' }}>A unified luxury operational framework for the modern real estate advisor.</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right side: Login Form */}
      <div style={{ 
        flex: 1, 
        background: 'var(--bg)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '60px 48px',
        position: 'relative'
      }}>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ width: '100%', maxWidth: '420px' }}
        >
          <div style={{ marginBottom: '40px' }}>
            <h1 className="serif" style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Welcome <span className="luxury-gradient-text">Home</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', letterSpacing: '0.3px' }}>Authentication Required for Sierra Blu Advisors</p>
          </div>

          <button 
            type="button"
            onClick={onBack}
            style={{ 
              marginBottom: '24px', 
              fontSize: '13px', 
              color: 'var(--gold)', 
              fontWeight: 600, 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back to Public Site
          </button>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                role="alert" 
                style={{ 
                  color: 'var(--error)', 
                  marginBottom: '24px', 
                  fontSize: '14px', 
                  padding: '12px 16px', 
                  background: 'rgba(220,38,38,0.05)', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(220,38,38,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--error)' }}></div>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={(event: FormEvent) => {
              event.preventDefault();
              void handleEmailLogin();
            }}
          >
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)', opacity: 0.8 }}>Professional Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@sierrablurealty.com"
                  style={{ paddingLeft: '40px', height: '48px', borderRadius: '12px' }}
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)', opacity: 0.8 }}>Secure Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  style={{ paddingLeft: '40px', height: '48px', borderRadius: '12px' }}
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }} /> 
                Keep me authenticated
              </label>
              <button
                type="button"
                onClick={showSupportMessage}
                style={{ fontSize: '13.5px', color: 'var(--blue)', fontWeight: 500, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Lost access?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="btn btn-primary cinematic-glow"
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                height: '52px', 
                fontSize: '16px', 
                fontWeight: 600,
                borderRadius: '14px',
                background: 'var(--navy)',
                border: '1px solid var(--gold)'
              }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Secure Sign In <ChevronRight size={18} />
                </span>
              )}
            </motion.button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, opacity: 0.5 }}>SSO</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <motion.button
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
              type="button"
              className="btn btn-outline"
              style={{ flex: 1, justifyContent: 'center', height: '48px', borderRadius: '12px', border: '1px solid var(--border)' }}
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <span style={{ fontSize: '18px', marginRight: '8px' }}>G</span> Google
            </motion.button>

            <motion.button
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
              type="button"
              className="btn btn-outline"
              style={{ flex: 1, justifyContent: 'center', height: '48px', borderRadius: '12px', border: '1px solid var(--border)' }}
              onClick={() => setGuest(true)}
              disabled={loading}
            >
              <span style={{ marginRight: '8px' }}>👥</span> Advisor
            </motion.button>
          </div>

          <div style={{ 
            marginTop: '48px', 
            padding: '16px', 
            borderRadius: '12px', 
            background: 'var(--surface-2)', 
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <ShieldCheck size={20} style={{ color: 'var(--gold)' }} />
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Systems secured by <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Sierra Blu CyberOps</span>. 
              Unauthorized access is strictly prohibited.
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .form-input::placeholder {
          color: rgba(0,0,0,0.2) !important;
        }
        [data-theme="dark"] .form-input::placeholder {
          color: rgba(255,255,255,0.2) !important;
        }
      `}</style>
    </div>
  );
}
