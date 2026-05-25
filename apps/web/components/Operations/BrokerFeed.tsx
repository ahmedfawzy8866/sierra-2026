"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash, ArrowRight, ShieldCheck, CheckCircle2, Zap, AlertTriangle, Smile, Meh, Angry, Flame } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, deleteDoc, doc, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { BrokerListing, COLLECTIONS } from '../../lib/models/schema';

export default function BrokerFeed() {
  const [listings, setListings] = useState<BrokerListing[]>([]);
  const [loading, setLoading] = useState(true);

  const seedTestData = async () => {
    const samples = [
      {
        rawMessage: "Apartment for sale in Mivida, 3 bedrooms, 180m, fully finished with ACs. Price: 12,000,000 EGP. Contact: 01002345678",
        status: 'parsed',
        sourceGroup: 'WhatsApp Network Luxury',
        senderInfo: '+201002345678@s.whatsapp.net',
        createdAt: serverTimestamp(),
        extractedData: {
          compound: 'Mivida',
          price: 12000000,
          bedrooms: 3,
          area: 180,
          phoneNumber: '01002345678',
          urgencyScore: 45,
          sentiment: 'neutral'
        },
        coordinates: { lat: 30.015, lng: 31.490 }
      },
      {
        rawMessage: "URGENT! Owner needs cash today! Standalone Villa in CFC, prime location. 500m area. Asking 45m. Call 01223344556",
        status: 'parsed',
        sourceGroup: 'Telegram Estate Elite',
        senderInfo: '@ahmed_broker',
        createdAt: serverTimestamp(),
        extractedData: {
          compound: 'CFC',
          price: 45000000,
          area: 500,
          phoneNumber: '01223344556',
          urgencyScore: 95,
          sentiment: 'desperate'
        },
        coordinates: { lat: 30.010, lng: 31.510 }
      }
    ];

    for (const s of samples) {
      await addDoc(collection(db, COLLECTIONS.brokerListings), s);
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.brokerListings),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BrokerListing));
      setListings(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.brokerListings, id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold flex items-center gap-3 text-navy">
           <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
             <MessageSquare className="text-gold" size={20} />
           </div>
           Broker Intelligence Hub
        </h2>
        <p className="text-slate-500 text-sm mt-1 ms-13">Automated feed from WhatsApp & Telegram networks</p>
      </div>
      
      <div className="flex-1 overflow-y-auto pe-2 space-y-4 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {listings.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/60 backdrop-blur-md rounded-[32px] p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-gold/30 transition-all group relative overflow-hidden"
            >
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    item.status === 'parsed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.status === 'parsed' ? '✅ AI Parsed' : '⏳ Raw Data'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    {item.sourceGroup}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-300">
                  {item.createdAt instanceof Timestamp ? item.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                </span>
              </div>
              
              {/* Message Content */}
              <div className="relative mb-5">
                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gold/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-sm text-slate-600 leading-relaxed font-serif italic">
                  "{item.rawMessage}"
                </p>
              </div>

              {/* Extraction Matrix & Neural Insights */}
              {item.extractedData && item.status === 'parsed' && (
                <div className="space-y-4 mb-5">
                  <div className="bg-slate-50/50 rounded-2xl p-4 grid grid-cols-2 lg:grid-cols-4 gap-4 border border-slate-100">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-tight">Compound</span>
                      <span className="text-xs font-bold text-navy block truncate">{item.extractedData.compound || 'TBD'}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-tight">Valuation</span>
                      <span className="text-xs font-bold text-gold block">
                          {item.extractedData.price ? `${(item.extractedData.price / 1000000).toFixed(2)}M EGP` : 'Negotiable'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-tight">Specifications</span>
                      <span className="text-xs font-bold text-navy block">{item.extractedData.bedrooms ? `${item.extractedData.bedrooms}BR` : 'N/A'} • {item.extractedData.area ? `${item.extractedData.area}m²` : 'N/A'}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-tight">Originator</span>
                      <span className="text-xs font-bold text-navy block truncate">{item.senderInfo?.split('@')[0] || 'Unknown'}</span>
                    </div>
                  </div>

                  {/* Neural Intelligence Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Urgency Gauge */}
                    <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                          <Zap size={10} className="text-gold" /> Urgency Detection
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${
                          (item.extractedData.urgencyScore || 0) > 70 ? 'text-red-500' : 
                          (item.extractedData.urgencyScore || 0) > 40 ? 'text-gold' : 'text-emerald-500'
                        }`}>
                          {item.extractedData.urgencyScore || 0}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full rounded-full ${
                            (item.extractedData.urgencyScore || 0) > 70 ? 'bg-red-500' : 
                            (item.extractedData.urgencyScore || 0) > 40 ? 'bg-gold' : 'bg-emerald-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.extractedData.urgencyScore || 0}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Sentiment Analysis */}
                    <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Dealer Sentiment</span>
                      {(() => {
                        const s = item.extractedData.sentiment || 'neutral';
                        const config = {
                          positive: { icon: Smile, color: 'bg-emerald-50 text-emerald-600', label: 'Positive' },
                          neutral: { icon: Meh, color: 'bg-slate-50 text-slate-500', label: 'Neutral' },
                          desperate: { icon: Flame, color: 'bg-red-50 text-red-600', label: 'Desperate' },
                          aggressive: { icon: Angry, color: 'bg-orange-50 text-orange-600', label: 'Aggressive' }
                        }[s] || { icon: Meh, color: 'bg-slate-50 text-slate-500', label: 'Neutral' };
                        
                        return (
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${config.color} border border-current/10`}>
                            <config.icon size={12} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{config.label}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Array */}
              <div className="flex gap-3 mt-auto pt-2">
                <button className="flex-1 bg-navy text-white h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-navy/5 active:scale-95">
                  <ShieldCheck size={14} className="text-gold" />
                  Convert to Inventory
                </button>
                <button 
                  onClick={() => handleDelete(item.id!)}
                  className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-sm"
                >
                  <Trash size={16} />
                </button>
              </div>
            </motion.div>
          ))}

          {!loading && listings.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200"
            >
               <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                 <div className="w-2 h-2 rounded-full bg-gold animate-ping" />
               </div>
               <p className="text-slate-400 font-bold tracking-tight">Awaiting Neural Hub Connection...</p>
               <p className="text-[10px] text-slate-300 uppercase mt-2 mb-6">Listening to WhatsApp/Telegram Streams</p>
               
               <button 
                onClick={seedTestData}
                className="px-8 py-3 bg-white border border-slate-200 text-navy font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-slate-50 transition-all shadow-sm active:scale-95"
               >
                 Simulate Network Stream
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
