"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft, 
  Code, 
  RefreshCw,
  X,
  FileJson,
  ArrowRight
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, limit, startAfter, DocumentSnapshot, orderBy } from 'firebase/firestore';
import { COLLECTIONS } from '../../lib/models/schema';

export default function DatabaseExplorer() {
  const [selectedCollection, setSelectedCollection] = useState<string>(Object.keys(COLLECTIONS)[0]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const collectionNames = Object.entries(COLLECTIONS).map(([key, value]) => ({
    key,
    value,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
  }));

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const collName = (COLLECTIONS as any)[selectedCollection];
      const q = query(
        collection(db, collName),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocuments(docs);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedCollection]);

  const filteredDocs = documents.filter(doc => 
    JSON.stringify(doc).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Database <span className="luxury-gradient-text">Explorer</span></h1>
          <p className="text-white/40 mt-1 font-medium italic">Direct inspection of the Sierra Intelligence Fabric.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-gold transition-colors" />
            <input 
              type="text" 
              placeholder="Query across keys..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/[0.03] border border-white/5 rounded-2xl py-3 ps-12 pe-6 text-sm text-white focus:outline-none focus:border-gold/30 focus:bg-white/[0.05] transition-all w-[300px]"
            />
          </div>
          <button 
            onClick={fetchDocuments}
            className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white/50 hover:text-white transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* ── Collection Selector ── */}
        <div className="col-span-12 lg:col-span-3 space-y-2">
          <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 ms-4">Collections</div>
          {collectionNames.map((coll) => (
            <button
              key={coll.key}
              onClick={() => setSelectedCollection(coll.key)}
              className={`
                w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-500 group
                ${selectedCollection === coll.key 
                  ? 'bg-gold/10 border border-gold/20 text-gold shadow-[0_0_20px_rgba(200,169,110,0.1)]' 
                  : 'bg-white/[0.02] border border-white/[0.05] text-white/40 hover:text-white hover:bg-white/[0.05]'}
              `}
            >
              <div className="flex items-center gap-3">
                <Database size={16} className={selectedCollection === coll.key ? 'text-gold' : 'opacity-40 group-hover:opacity-100 transition-opacity'} />
                <span className="text-sm font-bold tracking-tight">{coll.label}</span>
              </div>
              <ChevronRight size={14} className={`transition-transform duration-500 ${selectedCollection === coll.key ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
            </button>
          ))}
        </div>

        {/* ── Document List ── */}
        <div className="col-span-12 lg:col-span-9 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] overflow-hidden flex flex-col h-[700px]">
          <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
            <div className="flex items-center gap-4">
               <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Viewing</div>
               <div className="px-3 py-1 rounded-lg bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest border border-gold/20">
                 {selectedCollection}
               </div>
            </div>
            <div className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">
              Showing {filteredDocs.length} Entries
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                <div className="text-[10px] font-black text-gold/40 uppercase tracking-[0.4em]">Intercepting Data...</div>
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <FileJson size={48} className="mb-4" />
                <div className="text-[10px] font-black uppercase tracking-[0.4em]">Empty Set Encountered</div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-navy z-10">
                  <tr>
                    <th className="p-6 text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/[0.05]">Document ID</th>
                    <th className="p-6 text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/[0.05]">Attributes</th>
                    <th className="p-6 text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/[0.05] text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc, idx) => (
                    <motion.tr 
                      key={doc.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="group hover:bg-white/[0.03] transition-colors border-b border-white/[0.02]"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-gold/40" />
                          <span className="font-mono text-xs text-white/60 group-hover:text-gold transition-colors">{doc.id}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2 flex-wrap">
                          {Object.keys(doc).slice(1, 4).map(key => (
                            <span key={key} className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 text-white/30 border border-white/5 uppercase tracking-tighter">
                              {key}
                            </span>
                          ))}
                          {Object.keys(doc).length > 4 && (
                            <span className="text-[9px] font-black text-gold/40">+{Object.keys(doc).length - 4} more</span>
                          )}
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <button 
                          onClick={() => setSelectedDoc(doc)}
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-navy hover:bg-gold hover:border-gold transition-all"
                        >
                          Inspect
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ── JSON Inspection Modal ── */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDoc(null)}
              className="absolute inset-0 bg-navy/95 backdrop-blur-3xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0A0F1A] border border-white/10 rounded-[3rem] shadow-2xl flex flex-col max-h-full overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Code size={18} className="text-gold" />
                    <h3 className="text-xl font-black text-white tracking-tight uppercase">Document <span className="luxury-gradient-text">Manifest</span></h3>
                  </div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Source ID: {selectedDoc.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-black/20 font-mono text-sm">
                <pre className="text-gold/80 leading-relaxed">
                  {JSON.stringify(selectedDoc, null, 2)}
                </pre>
              </div>

              <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-end gap-4">
                 <button 
                  onClick={() => setSelectedDoc(null)}
                  className="px-8 py-4 rounded-2xl bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                 >
                   Dismiss
                 </button>
                 <button 
                  className="px-8 py-4 rounded-2xl bg-gold text-navy text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(200,169,110,0.3)] flex items-center gap-2"
                 >
                   Commit Override <ArrowRight size={14} />
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .luxury-gradient-text {
          background: linear-gradient(135deg, #C8A96E 0%, #F5E6C8 50%, #C8A96E 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
