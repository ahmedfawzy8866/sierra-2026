"use client";

import React, { useState } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Send, CheckCircle, AlertCircle, Loader2, X, Image as ImageIcon, Plus } from 'lucide-react';

/**
 * ImageLinkHub: Strategic Asset Visualization Portal.
 * Allows advisors to link images directly to Portfolio Assets via Unit Code.
 */
export default function ImageLinkHub() {
  const [unitCode, setUnitCode] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; preview: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setFeedback(null);
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(selectedFiles[index].preview);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleStrategicUpload = async () => {
    if (!unitCode.trim()) {
      setFeedback({ type: 'error', message: 'Indicate Unit Code for asset binding.' });
      return;
    }
    if (selectedFiles.length === 0) {
      setFeedback({ type: 'error', message: 'No media selected for ingestion.' });
      return;
    }

    setIsUploading(true);
    setFeedback(null);

    try {
      // 1. Locate Asset in Portfolio
      const q = query(collection(db, 'listings'), where('code', '==', unitCode.trim()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error(`Asset code "${unitCode}" not recognized in Strategic Pipeline.`);
      }

      const assetDoc = snapshot.docs[0];
      const uploadedUrls: string[] = [];

      // 2. Sequential Upload to Storage
      for (const item of selectedFiles) {
        const storageRef = ref(storage, `portfolio/${unitCode}/${Date.now()}_${item.file.name}`);
        const uploadResult = await uploadBytes(storageRef, item.file);
        const downloadUrl = await getDownloadURL(uploadResult.ref);
        uploadedUrls.push(downloadUrl);
      }

      // 3. Atomic Update to Firestore
      await updateDoc(assetDoc.ref, {
        images: arrayUnion(...uploadedUrls),
        updatedAt: serverTimestamp(),
        hasProfessionalMedia: true
      });

      setFeedback({ 
        type: 'success', 
        message: `Strategic ingestion complete. ${uploadedUrls.length} assets linked to ${unitCode}.` 
      });
      
      // Cleanup
      selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
      setSelectedFiles([]);
      setUnitCode('');

    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Transmission failure.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="cinematic-text text-4xl mb-2 text-gold">Asset Link Hub</h1>
          <p className="text-secondary text-sm tracking-widest uppercase">Visual Portfolio Augmentation</p>
        </div>
        <div className="h-12 w-12 rounded-full border border-gold/30 flex items-center justify-center text-gold">
          <ImageIcon size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Col: Setup */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border-gold/10">
            <label className="block text-[10px] font-black uppercase text-gold/50 mb-2 tracking-tighter">
              Target Asset Code
            </label>
            <input 
              type="text" 
              value={unitCode}
              onChange={(e) => setUnitCode(e.target.value.toUpperCase())}
              placeholder="e.g. SB-DXB-001"
              className="w-full bg-navy-dark border border-gold/20 rounded-xl px-4 py-3 text-gold focus:border-gold outline-none transition-all placeholder:text-gold/20"
            />
            <p className="mt-4 text-[11px] text-secondary leading-tight italic">
              Linking images directly to Portfolio Assets improves intent-scoring for stakeholders.
            </p>
          </div>

          <button
            onClick={handleStrategicUpload}
            disabled={isUploading}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold tracking-widest uppercase text-xs transition-all ${
              isUploading ? 'bg-gold/20 text-gold/50 cursor-wait' : 'bg-gold text-navy hover:scale-[1.02] shadow-xl shadow-gold/10'
            }`}
          >
            {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            Initiate Ingestion
          </button>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-2xl flex items-start gap-3 border ${
                  feedback.type === 'success' ? 'bg-success/10 border-success/30 text-success' : 'bg-error/10 border-error/30 text-error'
                }`}
              >
                {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <p className="text-xs font-medium leading-relaxed">{feedback.message}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Col: Media Queue */}
        <div className="md:col-span-2">
          <div className="glass-panel p-8 rounded-[40px] min-h-[400px] flex flex-col border-gold/10 relative overflow-hidden">
            {/* Drop Zone Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-secondary font-bold text-xs uppercase tracking-widest">Media Queue ({selectedFiles.length})</h3>
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-[10px] font-bold transition-colors border border-white/10">
                <Plus size={14} className="inline me-1" /> ADD MEDIA
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {/* Thumbs Grid */}
            <div className="grid grid-cols-3 gap-4">
              {selectedFiles.map((item, index) => (
                <motion.div
                  layout
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-navy-dark"
                >
                  <img src={item.preview} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <button 
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              ))}

              {selectedFiles.length === 0 && (
                <label className="col-span-3 aspect-video rounded-3xl border-2 border-dashed border-gold/10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-gold/30 hover:bg-gold/5 transition-all">
                  <Camera size={40} className="text-gold/20" />
                  <div className="text-center">
                    <p className="text-gold/40 text-xs font-bold uppercase tracking-widest">Select Media for Strategic Linking</p>
                    <p className="text-secondary text-[10px] mt-1 italic">JPG, PNG, WEBP (Max 10MB per asset)</p>
                  </div>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>

            {/* Subtle Texture */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-gold/5 to-transparent blend-overlay opacity-30"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
