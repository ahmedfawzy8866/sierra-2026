"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Shield, Loader2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { COLLECTIONS, UserProfile } from '../../lib/models/schema';

interface AddAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAdvisorModal({ isOpen, onClose }: AddAdvisorModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    role: 'agent' as UserProfile['role'],
    status: 'active' as UserProfile['status']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, COLLECTIONS.users), {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      onClose();
      // Reset form
      setFormData({
        displayName: '',
        email: '',
        phoneNumber: '',
        role: 'agent',
        status: 'active'
      });
    } catch (error) {
      console.error("Error adding advisor:", error);
      alert("Failed to add advisor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Add New <span className="luxury-gradient-text">Advisor</span></h2>
                <p className="text-white/40 text-sm font-medium mt-1">Onboard a new member to the intelligence team.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ms-1">Full Name</label>
                  <div className="relative group">
                    <User size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" />
                    <input
                      required
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 ps-12 pe-6 text-white focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ms-1">Email Address</label>
                  <div className="relative group">
                    <Mail size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" />
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@sierra-blu.com"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 ps-12 pe-6 text-white focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ms-1">Phone Number</label>
                  <div className="relative group">
                    <Phone size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" />
                    <input
                      required
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+20 123 456 7890"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 ps-12 pe-6 text-white focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ms-1">System Role</label>
                  <div className="relative group">
                    <Shield size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" />
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 ps-12 pe-6 text-white appearance-none focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all"
                    >
                      <option value="agent" className="bg-navy">Agent</option>
                      <option value="manager" className="bg-navy">Manager</option>
                      <option value="admin" className="bg-navy">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/5 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="flex-[2] py-4 rounded-2xl bg-gold text-navy font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gold/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    "Confirm Onboarding"
                  )}
                </button>
              </div>
            </form>

            <style>{`
              .luxury-gradient-text {
                background: linear-gradient(135deg, #C8A96E 0%, #F5E6C8 50%, #C8A96E 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              select {
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.2)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 1.5rem center;
                background-size: 1rem;
              }
            `}</style>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
