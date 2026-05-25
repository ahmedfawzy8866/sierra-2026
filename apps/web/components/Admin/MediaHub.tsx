"use client";
import React, { useState, useEffect } from 'react';
import { storage, db } from '@/lib/firebase';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  listAll, 
  deleteObject 
} from 'firebase/storage';
import { useI18n } from '@/lib/I18nContext';

export default function MediaHub() {
  const { t, locale } = useI18n();
  const [files, setFiles] = useState<{name: string, url: string, fullPath: string}[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchMedia = async () => {
    const listRef = ref(storage, 'property-media');
    try {
      const res = await listAll(listRef);
      const fileData = await Promise.all(
        res.items.map(async (item) => ({
          name: item.name,
          url: await getDownloadURL(item),
          fullPath: item.fullPath
        }))
      );
      setFiles(fileData);
    } catch (err) {
      console.error("Media retrieval failed:", err);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `property-media/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      }, 
      (error) => {
        console.error(error);
        setUploading(false);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(() => {
          setUploading(false);
          setProgress(0);
          fetchMedia();
        });
      }
    );
  };

  const handleDelete = async (fullPath: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;
    try {
      await deleteObject(ref(storage, fullPath));
      fetchMedia();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="media-hub animate-fade-in-up">
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <h1 className="serif text-3xl mb-2 gold-underline">{locale === 'ar' ? 'مكتبة الوسائط' : 'Luxury Asset Media Hub'}</h1>
        <p className="text-secondary text-sm">Secure orchestration of high-resolution architectural imagery and portfolio visualizations</p>
      </div>

      <div className="upload-dock glass-panel p-8 mb-12 border-dashed border-2 border-white/10 hover:border-gold/30 transition-all flex flex-col items-center justify-center text-center">
        <input 
          type="file" 
          id="media-upload" 
          className="hidden" 
          onChange={handleUpload}
          accept="image/*"
          disabled={uploading}
        />
        <label htmlFor="media-upload" className="cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-2xl text-gold mb-4 mx-auto">
            {uploading ? '⏳' : '📤'}
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{uploading ? `Uploading... ${Math.round(progress)}%` : (locale === 'ar' ? 'رفع أصل جديد' : 'Upload Strategic Asset')}</h3>
          <p className="text-xs text-secondary opacity-50 uppercase tracking-widest">{locale === 'ar' ? 'اسحب الملفات هنا أو انقر للإضافة' : 'Drag & Drop architectural assets or click to authorize'}</p>
        </label>
        
        {uploading && (
          <div className="w-full max-w-md bg-white/5 h-1 rounded-full mt-6 overflow-hidden">
            <div className="h-full bg-gold transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>

      <div className="media-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {files.map((file, idx) => (
          <div key={idx} className="media-card group relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-white/5 hover:border-gold/30 transition-all shadow-xl">
            <img src={file.url} alt={file.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="overlay absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
              <button 
                className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all"
                onClick={() => handleDelete(file.fullPath)}
              >
                🗑️
              </button>
              <div className="text-[10px] text-white/50 px-4 text-center truncate w-full">{file.name}</div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .gold-underline {
          position: relative;
          display: inline-block;
        }
        .gold-underline::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 40px;
          height: 2px;
          background: var(--gold);
        }
      `}</style>
    </div>
  );
}
