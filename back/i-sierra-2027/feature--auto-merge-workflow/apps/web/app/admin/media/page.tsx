'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Upload, Image as ImageIcon, Trash2, Copy, Check, Search } from 'lucide-react';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt?: any;
  createdAt?: any;
}

interface UploadProgress {
  [key: string]: number;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load media
  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, 'media'));
        const snap = await getDocs(q);
        setMedia(snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaItem)));
      } catch (err) {
        console.error('Failed to load media:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = media.filter(m =>
    search ? m.filename.toLowerCase().includes(search.toLowerCase()) : true
  );

  const processFiles = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newProgress: UploadProgress = {};

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          console.warn(`Skipping non-image file: ${file.name}`);
          continue;
        }

        // Max 10MB per file
        if (file.size > 10 * 1024 * 1024) {
          console.warn(`Skipping oversized file: ${file.name}`);
          continue;
        }

        newProgress[file.name] = 0;
        setUploadProgress({ ...newProgress });

        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const { url, size } = await uploadRes.json();
          await addDoc(collection(db, 'media'), {
            filename: file.name,
            url,
            size,
            type: file.type,
            createdAt: serverTimestamp(),
          });
          newProgress[file.name] = 100;
          setUploadProgress({ ...newProgress });
        }
      }

      // Reload
      const q = query(collection(db, 'media'));
      const snap = await getDocs(q);
      setMedia(snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaItem)));

      // Clear progress after delay
      setTimeout(() => setUploadProgress({}), 2000);
    } catch (err) {
      console.error('Failed to upload media:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      await processFiles(e.currentTarget.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    await processFiles(e.dataTransfer.files);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this media file?')) return;
    try {
      await deleteDoc(doc(db, 'media', id));
      setMedia(media.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete media:', err);
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#071422] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Media Gallery
          </h1>
          <p className="text-[#3a5570] text-sm mt-0.5">{filtered.length} files</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                viewMode === 'grid' ? 'bg-[#031632] text-white' : 'text-[#3a5570] hover:bg-[#f3f4f5]'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                viewMode === 'list' ? 'bg-[#031632] text-white' : 'text-[#3a5570] hover:bg-[#f3f4f5]'
              }`}
            >
              List
            </button>
          </div>
          <label className="flex items-center gap-2 px-4 py-2.5 bg-[#031632] text-white rounded-lg text-sm font-semibold hover:bg-[#041f3d] transition-colors cursor-pointer">
            <Upload size={16} /> Upload
            <input type="file" multiple accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
      </div>

      {/* Drag Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`mb-8 p-8 rounded-2xl border-2 border-dashed transition-all ${
          dragActive ? 'border-[#C9A84C] bg-[#FFF8F0]' : 'border-[#e7e8e9] bg-white'
        }`}
      >
        <div className="text-center">
          <Upload className={`mx-auto mb-3 ${dragActive ? 'text-[#C9A84C]' : 'text-[#3a5570]/30'}`} size={32} />
          <p className="text-sm font-semibold text-[#071422] mb-1">Drag and drop images here</p>
          <p className="text-xs text-[#3a5570]/60">or click the Upload button. Max 10MB per file.</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a5570]/40" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e7e8e9] rounded-lg text-sm outline-none focus:border-[#C9A84C]"
          />
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mb-6 space-y-2">
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="bg-white rounded-lg p-4 shadow-[0_2px_8px_-2px_rgba(3,22,50,0.06)]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-[#071422]">{filename}</p>
                <p className="text-xs text-[#3a5570]/60">{progress}%</p>
              </div>
              <div className="w-full h-2 bg-[#f3f4f5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C9A84C] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Grid/List */}
      {loading ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-3"}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={viewMode === 'grid' ? "bg-[#f3f4f5] rounded-xl aspect-square animate-pulse" : "bg-[#f3f4f5] rounded-lg h-16 animate-pulse"} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)]">
          <ImageIcon className="mx-auto mb-3 text-[#3a5570]/30" size={40} />
          <p className="text-[#3a5570]/40 text-sm">No media files yet.</p>
          <p className="text-[9px] text-[#3a5570]/30 mt-2 uppercase tracking-widest">
            Upload images for listings and team assets.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_-2px_rgba(3,22,50,0.06)] hover:shadow-[0_4px_16px_-4px_rgba(3,22,50,0.1)] transition-shadow">
              {/* Thumbnail */}
              <div className="aspect-square bg-[#f3f4f5] flex items-center justify-center overflow-hidden">
                {item.type.startsWith('image/') && item.url ? (
                  <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={32} className="text-[#3a5570]/30" />
                )}
              </div>
              {/* Info */}
              <div className="p-4">
                <p className="text-xs font-semibold text-[#071422] truncate mb-2">{item.filename}</p>
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => copyUrl(item.url, item.id)}
                    className="flex-1 px-2 py-1.5 text-[10px] font-mono bg-[#f3f4f5] rounded hover:bg-[#e7e8e9] text-[#3a5570] transition-colors flex items-center justify-center gap-1"
                  >
                    {copied === item.id ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-2 py-1.5 text-[10px] bg-red-50 rounded hover:bg-red-100 text-red-600 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className="text-[9px] text-[#3a5570]/40">
                  {(item.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_-4px_rgba(3,22,50,0.06)] overflow-hidden divide-y divide-[#f3f4f5]">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 hover:bg-[#f8f9fa] transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-[#f3f4f5] rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.type.startsWith('image/') && item.url ? (
                    <img src={item.url} alt={item.filename} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <ImageIcon size={20} className="text-[#3a5570]/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#071422] truncate">{item.filename}</p>
                  <p className="text-xs text-[#3a5570]/60">{(item.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyUrl(item.url, item.id)}
                  className="p-2 hover:bg-[#f3f4f5] rounded-lg text-[#3a5570] transition-colors"
                >
                  {copied === item.id ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
