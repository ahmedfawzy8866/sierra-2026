"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  TrendingUp, 
  Award,
  CircleDot,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { UserProfile, COLLECTIONS } from '../../lib/models/schema';
import AddAdvisorModal from './AddAdvisorModal';
import { useI18n } from '../../lib/I18nContext';

export default function TeamCRM() {
  const { locale, t } = useI18n();
  const [team, setTeam] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.users), orderBy('displayName', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData: UserProfile[] = [];
      snapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() } as UserProfile);
      });
      setTeam(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredTeam = team.filter(member => 
    member.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  return (
    <div 
      className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        });
      }}
    >
      <AddAdvisorModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* ── Header ── */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[1px] w-8 bg-gold/50" />
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">
              {t('admin.humanCapital')}
            </span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
            Team <span className="luxury-gradient-text">CRM</span>
          </h1>
          <p className="text-white/40 mt-1 font-medium max-w-md">
            {t('admin.crmDescription')}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-gold transition-colors" />
            <input 
              type="text" 
              placeholder={t('admin.searchAdvisors')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/[0.03] border border-white/5 rounded-2xl py-3 ps-12 pe-6 text-sm text-white focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all w-[300px]"
            />
          </div>
          <button className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white/50 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gold text-navy px-8 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-gold/20 flex items-center gap-2"
          >
            {t('admin.addAdvisor')}
          </button>
        </div>
      </motion.div>

      {/* ── Team Grid ── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8"
      >
        {loading ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
            <span className="text-white/20 font-black uppercase tracking-[0.4em]">{t('admin.initializing')}</span>
          </div>
        ) : filteredTeam.length === 0 ? (
          <div className="col-span-full py-20 text-center text-white/20 font-black uppercase tracking-[0.4em] border border-white/5 rounded-[3rem] bg-white/[0.01]">
            {t('admin.noAdvisors')}
          </div>
        ) : filteredTeam.map((member, idx) => {
          const initials = member.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          return (
            <motion.div
              key={member.id}
              variants={itemVariants}
              whileHover={{ 
                y: -12, 
                rotateX: mousePos.y * 15,
                rotateY: mousePos.x * 15,
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderColor: 'rgba(200,169,110,0.3)',
                transition: { duration: 0.3 }
              }}
              style={{ perspective: 1000 }}
              className="group bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8 transition-all duration-500 relative overflow-hidden flex flex-col"
            >
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={16} className="text-gold" />
              </div>
              
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-gold text-xl font-black shadow-lg">
                  {initials}
                </div>
                <div className="flex flex-col items-end gap-1">
                   <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.2em] border ${
                     member.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/10 text-white/30'
                   }`}>
                     {t(`admin.${member.status}`) || member.status}
                   </div>
                   <button className="p-2 text-white/10 hover:text-white transition-colors">
                     <MoreVertical size={20} />
                   </button>
                </div>
              </div>
  
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white group-hover:text-gold transition-colors tracking-tight">
                  {member.displayName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <ShieldCheck size={12} className="text-gold/60" />
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{member.role}</p>
                </div>
              </div>
  
              <div className="mt-8 space-y-4">
                 <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30">
                       <Mail size={14} />
                     </div>
                     <span className="text-[11px] font-bold text-white/60 truncate max-w-[120px]">{member.email}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30">
                       <Phone size={14} />
                     </div>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{t('admin.performance')}</span>
                      <span className="text-sm font-bold text-white">Top 5%</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{t('admin.portfolio')}</span>
                      <span className="text-sm font-bold text-gold">$12M</span>
                    </div>
                 </div>
              </div>
  
              {/* Quick Actions Hover Surface */}
              <div className="mt-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <button className="flex-1 bg-white/5 hover:bg-gold hover:text-navy text-white/70 py-3 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest">
                  {t('admin.connect')}
                </button>
                <button className="flex-1 bg-gold/10 hover:bg-gold/20 text-gold py-3 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest">
                  {t('admin.intelligence')}
                </button>
              </div>

              {/* Background Glow */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gold/5 blur-[60px] rounded-full group-hover:bg-gold/10 transition-all duration-700" />
            </motion.div>
          );
        })}
      </motion.div>

      <style>{`
        .luxury-gradient-text {
          background: linear-gradient(135deg, #C8A96E 0%, #F5E6C8 50%, #C8A96E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}

