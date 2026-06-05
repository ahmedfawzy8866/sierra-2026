"use client";
import React from 'react';
import { useI18n } from '../../lib/I18nContext';
import KPIGrid from './KPIGrid';
import ActivityList from './ActivityList';
import AIPanel from './AIPanel';
import { motion, Variants } from 'framer-motion';
import { Plus, ChevronRight } from 'lucide-react';

interface DashboardScreenProps {
  greeting: string;
  firstName: string;
  dateString: string;
  onNavigate: (screen: 'dashboard' | 'listings' | 'crm' | 'reports' | 'team') => void;
}

export default function DashboardScreen({ 
  greeting, 
  firstName, 
  dateString, 
  onNavigate 
}: DashboardScreenProps) {
  const { t, locale } = useI18n();

  const greetingAr = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard', 'morning');
    if (hour < 18) return t('dashboard', 'afternoon');
    return t('dashboard', 'evening');
  })();

  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="midnight-mode min-h-screen p-10"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* ── Header ── */}
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-12">
        <div>
          <h1 className="serif text-4xl mb-1 tracking-tight text-white">
            {locale === 'ar' ? greetingAr : greeting}, {firstName}
          </h1>
          <div className="flex items-center gap-2 opacity-50 text-xs tracking-widest uppercase">
            <span>{dateString}</span>
            <span className="text-gold">•</span>
            <span className="text-emerald-400">Intelligence Matrix Active</span>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('listings')}
          className="btn btn-gold btn-glow px-10 py-4 text-navy font-bold tracking-widest flex items-center gap-3 rounded-xl shadow-2xl"
        >
          <Plus size={18} strokeWidth={3} />
          {locale === 'ar' ? 'إضافة أصل عقاري' : 'INCORPORATE ASSET'}
        </motion.button>
      </motion.div>

      {/* ── KPI Grid ── */}
      <motion.div variants={itemVariants} className="mb-12">
        <KPIGrid onNavigate={onNavigate} />
      </motion.div>

      {/* ── Center Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="serif text-2xl text-white/90">{locale === 'ar' ? 'التفاعلات الأخيرة' : 'Recent Interactions'}</h3>
            <button 
              onClick={() => onNavigate('crm')}
              className="text-[10px] uppercase tracking-[0.2em] text-gold/60 hover:text-gold transition-colors font-bold"
            >
              {locale === 'ar' ? 'مشاهدة الكل' : 'VIEW FULL FLOW'}
            </button>
          </div>
          <div className="glass-panel-luxury p-1 rounded-3xl overflow-hidden shadow-2xl">
            <ActivityList />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-col gap-8">
          <div className="glass-panel-luxury p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
               <ChevronRight size={40} className="text-gold" />
            </div>
            <AIPanel />
          </div>
          
          <div className="glass-panel-luxury p-8 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div>
              <h4 className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-2">{locale === 'ar' ? 'حالة النظام' : 'System Health'}</h4>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                <span className="text-sm text-white/60 font-semibold tracking-wide">Neural Nodes Active</span>
              </div>
            </div>
            <div className="text-right">
                <div className="text-2xl font-black text-white/20">V12.0</div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .midnight-mode {
          background: var(--bg);
          color: var(--text);
        }
        .glass-panel-luxury {
          background: rgba(10, 22, 40, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.03);
          transition: var(--sb-transition);
        }
        .glass-panel-luxury:hover {
          border-color: rgba(201, 168, 76, 0.2);
          box-shadow: 0 40px 100px rgba(0,0,0,0.5);
        }
      `}</style>
    </motion.div>
  );
}
