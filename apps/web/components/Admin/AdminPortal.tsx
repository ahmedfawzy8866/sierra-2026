"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/AuthContext';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Topbar from '../UI/Topbar';
import Sidebar from '../UI/Sidebar';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../lib/I18nContext';

// Admin specific screens
const AdminDashboard = dynamic(() => import('./AdminDashboard'), { ssr: false });
const TeamCRM = dynamic(() => import('./TeamCRM'), { ssr: false });
const PortfolioAssets = dynamic(() => import('./PortfolioAssets'), { ssr: false });
const IntegrationHub = dynamic(() => import('../Operations/IntegrationHub'), { ssr: false });
const MarketIntelligence = dynamic(() => import('../Operations/MarketIntelligence'), { ssr: false });
const DatabaseExplorer = dynamic(() => import('./DatabaseExplorer'), { ssr: false });

type AdminScreen = 'dashboard' | 'team-crm' | 'listings' | 'nexus' | 'intelligence' | 'media' | 'database';

export default function AdminPortal() {
  const { user, signOut } = useAuth();
  const { locale, t } = useI18n();
  const router = useRouter();
  const [activeScreen, setActiveScreen] = useState<AdminScreen>('dashboard');
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState('Welcome');
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    const greetKey = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    setGreeting(t(`dashboard.${greetKey}`));
    setDateString(new Date().toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  if (!mounted) return null;

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Admin';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const firstName = displayName.split(' ')[0];

  const handleNavigate = (screen: AdminScreen) => {
    setActiveScreen(screen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="screen active admin-portal" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Topbar
        onHomeClick={() => setActiveScreen('dashboard')}
        onSignOut={handleSignOut}
        userInitials={initials}
        displayName={`${displayName} (${t('common.admin') || 'Admin'})`}
        isGuest={false}
      />

      <div className="app-layout">
        {/* We can use the same Sidebar but with a restricted set of items if needed, 
            but for now, we'll use a specialized version or the existing one with a prop */}
        <Sidebar 
          activeScreen={activeScreen as any} 
          onNavigate={handleNavigate as any} 
          displayName={displayName}
          userInitials={initials}
        />

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="main-content"
          >
            {activeScreen === 'dashboard' && (
              <AdminDashboard 
                greeting={greeting}
                firstName={firstName}
                dateString={dateString}
              />
            )}

            {activeScreen === 'team-crm' && <TeamCRM />}
            {activeScreen === 'listings' && <PortfolioAssets />}
            {activeScreen === 'nexus' && <IntegrationHub />}
            {activeScreen === 'intelligence' && <MarketIntelligence />}
            {activeScreen === 'database' && <DatabaseExplorer />}
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        .admin-portal {
          background: #050B14;
        }
        .luxury-accent {
          border-left: 4px solid var(--gold);
        }
      `}</style>
    </div>
  );
}
