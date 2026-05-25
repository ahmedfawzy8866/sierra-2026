"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '../../lib/I18nContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, 
  Copy, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Home, 
  DollarSign, 
  Bed, 
  Image as ImageIcon,
  Save,
  FileSpreadsheet,
  Search,
  ExternalLink,
  Trash2,
  TrendingUp,
  History
} from 'lucide-react';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import BrokerFeed from './BrokerFeed';
import dynamic from 'next/dynamic';
import { COLLECTIONS, PropertyType } from '../../lib/models/schema';
const MapExplorer = dynamic(() => import('./MapExplorer'), { ssr: false });
const VirtualTourViewer = dynamic(() => import('../Shared/VirtualTourViewer'), { ssr: false });
import { Layers, Map as MapIcon, Rotate3d as Rotate3D } from 'lucide-react';

// --- Configuration & Dictionaries ---
const COMPOUND_DICT: Record<string, string> = {
  'Mivida': 'MI', 'ميفيدا': 'MI',
  'Mountain View': 'MV', 'ماونتن فيو': 'MV',
  'Hyde Park': 'HP', 'هايد بارك': 'HP',
  'Lake View': 'LV', 'ليك فيو': 'LV',
  'Cairo Festival': 'CFC', 'كايرو فيستيفال': 'CFC',
  'Gardenia': 'GC', 'جاردينيا': 'GC',
  'Rehab': 'RH', 'الرحاب': 'RH',
  'El Shorouk': 'ES', 'الشروق': 'ES'
};

const FURNISHED_DICT: Record<string, string> = {
  'Fully furnished': 'F', 'مفروش': 'F',
  'Semi-furnished': 'S', 'نصف مفروش': 'S',
  'Kitchen only': 'K', 'مطبخ فقط': 'K',
  'Unfurnished': 'U', 'غير مفروش': 'U'
};

const PRICE_MULTIPLIERS: Record<string, number> = {
  'k': 1000,
  'm': 1000000,
  'M': 1000000,
  'ألف': 1000,
  'مليون': 1000000
};

// --- Interfaces ---
interface Property {
  id?: string;
  code: string;
  compound: string;
  bedrooms: number;
  price: number;
  currency: string;
  furnished: string;
  phone: string;
  whatsappContent?: string;
  facebookContent?: string;
  images?: string[];
  views?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  virtualTourUrl?: string;
  coordinates?: { lat: number; lng: number };
  type?: string;
}

const normalizeText = (value: string | undefined) => value?.trim().toLowerCase() || '';

const sanitizeFileName = (value: string) => value.replace(/[^a-zA-Z0-9._-]/g, '-');

const inferPropertyType = (value: string): PropertyType => {
  const text = normalizeText(value);

  if (text.includes('villa')) return 'villa';
  if (text.includes('townhouse')) return 'townhouse';
  if (text.includes('duplex')) return 'duplex';
  if (text.includes('penthouse')) return 'penthouse';
  if (text.includes('studio')) return 'studio';
  if (text.includes('chalet')) return 'chalet';
  if (text.includes('office') || text.includes('shop') || text.includes('clinic')) return 'commercial';
  if (text.includes('land')) return 'land';

  return 'apartment';
};

export default function EasyListing() {
  const { t, locale } = useI18n();
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Extraction Result
  const [extractedData, setExtractedData] = useState<Partial<Property> | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  
  // Inventory & UI State
  const [inventory, setInventory] = useState<Property[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'forge' | 'nexus' | 'spatial'>('forge');
  const [activeTour, setActiveTour] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isArabic = locale === 'ar';

  // --- Real-time Inventory ---
  useEffect(() => {
    const q = query(collection(db, COLLECTIONS.units), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      setInventory(items);
    });

    if (typeof window !== 'undefined') {
      const history = localStorage.getItem('sb_search_history');
      if (history) setSearchHistory(JSON.parse(history));
    }

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // --- Image Preview ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setImageFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // --- Logic: Data Extraction & Code Generation ---
  const processListing = (sourceText = description) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const normalizedSource = sourceText.trim();
      const text = normalizedSource.toLowerCase();
      if (!normalizedSource) {
        throw new Error('Missing listing description');
      }
      setDescription(normalizedSource);
      
      // 1. Identify Compound
      let compound = '';
      let compoundCode = '??';
      for (const [key, code] of Object.entries(COMPOUND_DICT)) {
        if (text.includes(key.toLowerCase())) {
          compound = key;
          compoundCode = code;
          break;
        }
      }

      // 2. Identify Bedrooms
      let bedrooms = 0;
      const bedMatch = text.match(/(\d+)\s*(beds|غرف|غرفه|br)/i);
      if (bedMatch) bedrooms = parseInt(bedMatch[1]);

      // 3. Identify Price & Currency
      let price = 0;
      let currency = 'EGP';
      if (text.includes('$') || text.includes('usd')) currency = 'USD';
      
      const priceMatch = text.match(/([\d.,]+)\s*(k|m|ألف|مليون)/i);
      if (priceMatch) {
        const value = parseFloat(priceMatch[1].replace(/,/g, ''));
        const multiplier = PRICE_MULTIPLIERS[priceMatch[2]] || 1;
        price = value * multiplier;
      } else {
        const rawPriceMatch = text.match(/[\d.,]{4,}/);
        if (rawPriceMatch) price = parseFloat(rawPriceMatch[0].replace(/,/g, ''));
      }

      // 4. Identify Furnishing
      let furnished = 'U';
      for (const [key, code] of Object.entries(FURNISHED_DICT)) {
        if (text.includes(key.toLowerCase())) {
          furnished = code;
          break;
        }
      }

      // Format Price for Code
      let priceSuffix = '';
      if (price >= 1000000) priceSuffix = (price / 1000000).toFixed(1).replace('.0', '') + 'M';
      else if (price >= 1000) priceSuffix = (price / 1000).toFixed(0) + 'K';
      else priceSuffix = price.toString();

      const pricePart = (currency === 'USD' ? '$' : '') + priceSuffix;
      const code = `${compoundCode}-${bedrooms}${furnished}-${pricePart}`;
      
      // Social Templates
      const whatsapp = `✦ SIERRA BLU REALTY ✦\n\nUnit Code: ${code}\nLocation: ${compound || 'Custom'}\nDetails: ${bedrooms} BR | ${furnished === 'F' ? 'Fully Furnished' : 'Luxury Finish'}\nPrice: ${price.toLocaleString()} ${currency}\n\nContact: ${phone || 'Available Upon Request'}\n#SierraBlu #BeyondBrokerage`;
      
      const facebook = `✨ LUXURY PORTFOLIO UPDATE ✨\n\nWe are pleased to present this exclusive listing in ${compound || 'New Cairo'}.\n\n💎 Code: ${code}\n🛏️ Bedrooms: ${bedrooms}\n💰 Price: ${price.toLocaleString()} ${currency}\n\nOur AI-driven platform ensures this is the highest value available today. Experience the Sierra Blu standard.\n\n📞 Call us: ${phone}\n\n#RealEstateEgypt #SierraBlu #Investment`;

      setExtractedData({
        compound,
        bedrooms,
        price,
        currency,
        furnished,
        phone,
        whatsappContent: whatsapp,
        facebookContent: facebook,
        code
      });
      setGeneratedCode(code);
      
      // Update Canvas
      setTimeout(() => generateBrandedImage(), 100);

    } catch (err) {
      setErrorMessage("Failed to analyze text logic.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Logic: Save to Firebase ---
  const saveToFirebase = async () => {
    if (!extractedData || !generatedCode) return;
    
    // Validation
    if (!extractedData.compound) return setErrorMessage(t('easyListing.validation.errorCompound'));
    if (extractedData.bedrooms === undefined) return setErrorMessage(t('easyListing.validation.errorBeds'));
    if (!extractedData.price) return setErrorMessage(t('easyListing.validation.errorPrice'));
    if (!phone) return setErrorMessage(t('easyListing.validation.errorPhone'));

    setIsSaving(true);
    try {
      let uploadedImageUrl = '';
      if (imageFile) {
        const imageRef = storageRef(
          storage,
          `listings/${Date.now()}-${sanitizeFileName(imageFile.name)}`
        );
        await uploadBytes(imageRef, imageFile);
        uploadedImageUrl = await getDownloadURL(imageRef);
      }

      const propertyType = inferPropertyType(description || extractedData.type || '');

      await addDoc(collection(db, COLLECTIONS.units), {
        ...extractedData,
        title: `${extractedData.compound || 'Custom'} ${extractedData.bedrooms}BR ${extractedData.type || 'Unit'}`,
        compound: extractedData.compound || 'New Cairo',
        location: extractedData.compound || 'New Cairo',
        city: 'New Cairo',
        area: 150,
        type: extractedData.type || 'Apartment',
        propertyType,
        category: propertyType === 'commercial' ? 'commercial' : 'residential',
        beds: extractedData.bedrooms,
        bedrooms: extractedData.bedrooms,
        baths: 2, // Default
        bathrooms: 2,
        sqm: 150, // Default
        price: extractedData.price,
        phone,
        code: generatedCode,
        referenceNumber: generatedCode,
        images: uploadedImageUrl ? [uploadedImageUrl] : [],
        featuredImage: uploadedImageUrl || '',
        imageUrl: uploadedImageUrl || '',
        views: Math.floor(Math.random() * 50),
        status: 'available',
        syncSource: 'manual',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        
        // Orchestration (Stage 3 Complete)
        orchestrationState: {
          stage: 'S3',
          status: 'completed',
          engineVersion: '4.0.0',
          lastTriggeredAt: serverTimestamp()
        },
        
        // Automation Flags
        automation: {
          isBranded: !!previewUrl,
          isPublishedToPF: false,
          isPublishedToFB: false,
          whatsappAdGenerated: true,
          brandingReady: true,
          publishingReady: false,
          whatsappReady: true
        },
        
        // Unit Identity
        ownerType: 'internal',
        ownerContact: phone,
        description,
        // Added Spatial & Virtual
        coordinates: extractedData.coordinates || { lat: 30.015, lng: 31.490 },
        virtualTourUrl: extractedData.virtualTourUrl || ''
      });
      
      setSuccessMessage(t('common.success'));
      // Reset Form Partially
      setDescription('');
      setPhone('');
      setExtractedData(null);
      setGeneratedCode('');
      setImageFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    } catch (err) {
      setErrorMessage("Firebase save error.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Canvas Branded Image ---
  const generateBrandedImage = () => {
    if (!canvasRef.current || !previewUrl) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.src = previewUrl;
    img.onload = () => {
      canvas.width = 1080;
      canvas.height = 1350; // Instagram Portrait

      // Draw Main Image
      ctx.drawImage(img, 0, 0, 1080, 1080);

      // Dark Footer
      ctx.fillStyle = "#0A1A3A";
      ctx.fillRect(0, 1080, 1080, 270);

      // Gold Accent Line
      ctx.fillStyle = "#C9A24A";
      ctx.fillRect(0, 1075, 1080, 5);

      // Brand Name
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 42px serif";
      ctx.textAlign = "center";
      ctx.fillText("✦ SIERRA BLU ✦", 540, 1160);

      ctx.fillStyle = "#C9A24A";
      ctx.font = "italic 24px sans-serif";
      ctx.fillText("Beyond Brokerage", 540, 1200);

      // Code & Price
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 64px sans-serif";
      ctx.fillText(generatedCode, 540, 1290);
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const simulateRealWebhook = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage("Operational Intelligence: Webhook Signal Captured.");
    
    // Simulate a slight delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Logic to simulate an automated extraction from a theoretical incoming message
    const mockDescription = "Hyde Park 3BR fully furnished for 5.5M cash. Call 0122334455";
    setDescription(mockDescription);
    processListing(mockDescription);
  };

  const removeInventoryItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.units, itemId));
      setSuccessMessage('Listing removed from inventory.');
    } catch {
      setErrorMessage('Unable to remove listing.');
    }
  };

  const exportToExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Code,Compound,Bedrooms,Price,Currency,Furnished,Phone\n"
      + inventory.map(p => `${p.code},${p.compound},${p.bedrooms},${p.price},${p.currency},${p.furnished},${p.phone}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sierra_blu_inventory_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  // --- Filtering ---
  const filteredInventory = inventory.filter(p => 
    (p.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.compound || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.price || '').includes(searchTerm.trim())
  );

  const stats = {
    total: inventory.length,
    totalValue: inventory.reduce((acc, p) => acc + (p.price || 0), 0),
    topCompound: Object.entries(
      inventory.reduce<Record<string, number>>((acc, p) => {
        const key = p.compound || 'Unassigned';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
      <header className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-5xl font-serif font-bold text-navy mb-3 flex items-center gap-4">
            <div className="bg-gold/10 p-3 rounded-2xl">
              <Wand2 className="text-gold" size={32} />
            </div>
            {t('easyListing.title')}
          </h1>
          <p className="text-slate-400 font-medium tracking-tight max-w-xl">
             Luxury portfolio management powered by Sierra Blu Artificial Intelligence. 
             Forge specific listings or tap into the global broker nexus.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100/50 p-1.5 rounded-3xl backdrop-blur-md border border-slate-200">
             <button 
               onClick={() => setActiveTab('forge')}
               className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                 activeTab === 'forge' ? 'bg-navy text-white shadow-xl' : 'text-slate-400 hover:text-navy'
               }`}
             >
               Manual Forge
             </button>
             <button 
               onClick={() => setActiveTab('nexus')}
               className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                 activeTab === 'nexus' ? 'bg-navy text-white shadow-xl' : 'text-slate-400 hover:text-navy'
               }`}
             >
               Nexus Stream
             </button>
             <button 
               onClick={() => setActiveTab('spatial')}
               className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                 activeTab === 'spatial' ? 'bg-navy text-white shadow-xl' : 'text-slate-400 hover:text-navy'
               }`}
             >
               <MapIcon size={14} />
               Spatial Grid
             </button>
          </div>

          <button 
            onClick={exportToExcel}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-gold hover:border-gold/50 transition-all shadow-sm group"
            title="Export Inventory (Excel)"
          >
            <FileSpreadsheet size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'forge' ? (
          <motion.div 
            key="forge-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12"
          >
            {/* --- Phase 1: Ingestion --- */}
            <section className="lg:col-span-4 glass-panel p-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ImageIcon size={20} className="text-gold" />
                Inventory Ingestion
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('easyListing.placeholder')}</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="AI Analysis: Paste raw listing text here..."
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-[32px] p-6 focus:ring-2 focus:ring-gold outline-none transition-all resize-none font-sans text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('easyListing.form.phone')}</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+20 123 456 7890"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-full h-14 ps-14 pe-6 outline-none focus:ring-2 focus:ring-gold text-sm font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('easyListing.form.uploadImages')}</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden" 
                    id="listing-image" 
                  />
                  <label 
                    htmlFor="listing-image"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[32px] p-12 hover:border-gold hover:bg-gold/5 cursor-pointer transition-all group overflow-hidden"
                  >
                    {previewUrl ? (
                      <div className="relative group">
                        <img src={previewUrl} alt="Preview" className="h-40 w-auto rounded-2xl shadow-2xl transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                          <ImageIcon className="text-white" size={32} />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 group-hover:scale-110 transition-all">
                          <ImageIcon className="text-slate-300 group-hover:text-gold" size={28} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{t('easyListing.waiting')}</span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <button
                    onClick={() => processListing()}
                    disabled={isProcessing || !description}
                    className="flex-1 h-14 bg-navy text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gold hover:text-navy transition-all flex items-center justify-center gap-3 disabled:opacity-50 group border border-gold/30 shadow-xl"
                  >
                    {isProcessing ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Wand2 size={24} /></motion.div> : <Wand2 size={24} className="group-hover:scale-125 transition-transform" />}
                    <span>Manifest Code</span>
                  </button>

                  <button
                    onClick={simulateRealWebhook}
                    disabled={isProcessing}
                    className="h-14 px-8 bg-slate-900 text-gold rounded-2xl font-black uppercase tracking-widest hover:bg-gold hover:text-navy transition-all flex items-center justify-center gap-3 disabled:opacity-50 border border-gold/20 shadow-xl"
                    title="Test Real-Time Neural Bridge"
                  >
                    <Layers size={24} />
                    <span>Signal Bridge</span>
                  </button>
                </div>
              </div>
            </section>

            {/* --- Phase 2: Results & Ad --- */}
            <section className="lg:col-span-5 glass-panel p-8 flex flex-col">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-gold" />
                {t('easyListing.outputTitle')}
              </h2>

              <AnimatePresence mode="wait">
                {!extractedData ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                      <History size={40} className="text-slate-200" />
                    </div>
                    <p className="font-serif italic text-lg">{t('easyListing.waiting')}</p>
                    <p className="text-[10px] uppercase tracking-widest mt-2">Awaiting Intelligence Feed</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="space-y-8 flex-1"
                  >
                    {/* Internal Code Display */}
                    <div className="bg-navy rounded-[40px] p-8 text-center shadow-2xl border-2 border-gold/30 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-gold font-black text-[10px] tracking-[0.4em] uppercase mb-3 block">{t('easyListing.internalCode')}</span>
                      <div className="text-5xl font-mono font-black text-white tracking-[0.2em] relative z-10">{generatedCode}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/80 border border-slate-100 rounded-[32px] p-6 shadow-sm">
                        <span className="text-[10px] font-black text-gold block mb-2 uppercase tracking-tighter">{t('easyListing.compound')}</span>
                        <span className="text-lg font-bold text-navy truncate block">
                           {extractedData.compound || "Custom Asset"}
                        </span>
                      </div>
                      <div className="bg-white/80 border border-slate-100 rounded-[32px] p-6 shadow-sm">
                        <span className="text-[10px] font-black text-gold block mb-2 uppercase tracking-tighter">{t('easyListing.price')}</span>
                        <span className="text-lg font-bold text-navy">
                          {extractedData.price?.toLocaleString()} <span className="text-xs font-medium text-slate-400">{extractedData.currency}</span>
                        </span>
                      </div>
                    </div>

                    {/* Templates */}
                    <div className="space-y-6">
                      <div className="group relative">
                        <button 
                          onClick={() => copyToClipboard(extractedData.whatsappContent || '')}
                          className="absolute right-6 top-10 p-3 bg-white rounded-2xl shadow-lg border border-slate-100 hover:text-gold hover:scale-110 active:scale-90 transition-all z-10"
                        >
                          <Copy size={16} />
                        </button>
                        <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">{t('easyListing.content.whatsapp')}</label>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 text-slate-600 text-sm p-6 rounded-[32px] whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed">
                          {extractedData.whatsappContent}
                        </div>
                      </div>

                      <div className="group relative">
                        <button 
                          onClick={() => copyToClipboard(extractedData.facebookContent || '')}
                          className="absolute right-6 top-10 p-3 bg-white rounded-2xl shadow-lg border border-slate-100 hover:text-gold hover:scale-110 active:scale-90 transition-all z-10"
                        >
                          <Copy size={16} />
                        </button>
                        <label className="text-[10px] font-black text-slate-400 mb-2 block uppercase tracking-widest">{t('easyListing.content.facebook')}</label>
                        <div className="bg-blue-500/5 border border-blue-500/10 text-slate-600 text-sm p-6 rounded-[32px] whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed">
                          {extractedData.facebookContent}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-auto flex gap-4">
                      <button 
                        onClick={saveToFirebase}
                        disabled={isSaving}
                        className="flex-1 h-16 bg-gold text-navy rounded-full font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 disabled:opacity-50 transition-all shadow-xl shadow-gold/20"
                      >
                        {isSaving ? "Synchronizing..." : t('easyListing.btnGenerateSave')}
                        <Save size={20} />
                      </button>
                      
                      {(extractedData.virtualTourUrl || previewUrl) && (
                        <button 
                          onClick={() => setActiveTour(extractedData.virtualTourUrl || 'https://pannellum.org/images/alma.jpg')}
                          className="w-16 h-16 bg-navy text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-all shadow-xl border border-gold/30"
                          title="Neural 360 View"
                        >
                          <Rotate3D size={24} className="text-gold" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* --- Phase 3: Analytics Sidebar --- */}
            <section className="lg:col-span-3 space-y-6">
              <div className="glass-panel p-8 bg-navy text-white relative overflow-hidden group">
                <div className="absolute top-0 end-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -me-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                <h3 className="text-gold font-black mb-6 text-[10px] uppercase tracking-[0.3em] relative z-10">Portfolio Pulse</h3>
                <div className="space-y-6 relative z-10">
                   <div>
                      <span className="text-5xl font-serif font-bold block mb-1">{stats.total}</span>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t('easyListing.dashboard.activeUnits')}</span>
                   </div>
                   <div className="pt-6 border-t border-white/5">
                      <span className="text-xl font-bold block text-gold truncate">{stats.topCompound}</span>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Leading District</span>
                   </div>
                </div>
              </div>

              <div className="glass-panel p-8">
                <h4 className="font-black mb-6 text-[10px] text-slate-400 uppercase tracking-widest">Market Vectors</h4>
                <div className="space-y-4">
                  {['Mivida', 'CFC', 'Hyde Park'].map((item, i) => (
                    <div key={item} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-gold/30 transition-all">
                      <span className="text-sm font-bold text-navy">{item}</span>
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black ${
                        i === 0 ? 'bg-gold/10 text-gold' : 'bg-slate-200/50 text-slate-500'
                      }`}>
                        TOP #{i+1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                 <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-4 border-white group">
                    <canvas ref={canvasRef} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
                    {!previewUrl && (
                      <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
                        <ImageIcon size={40} className="text-slate-200 mb-4" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Waiting for visual asset</p>
                      </div>
                    )}
                 </div>
                 {previewUrl && (
                   <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.download = `sierra-blu-${generatedCode}.png`;
                      link.href = canvasRef.current?.toDataURL() || '';
                      link.click();
                    }}
                    className="w-full mt-6 h-14 bg-white border border-slate-200 text-slate-600 rounded-full flex items-center justify-center gap-3 hover:bg-slate-50 transition-all text-sm font-black uppercase tracking-widest shadow-sm"
                   >
                     <Download size={18} className="text-gold" />
                     {t('easyListing.btnDownload')}
                   </button>
                 )}
              </div>
            </section>
          </motion.div>
        ) : activeTab === 'nexus' ? (
          <motion.div 
            key="nexus-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-12"
          >
            <div className="glass-panel p-10 min-h-[600px]">
              <BrokerFeed />
            </div>
          </motion.div>
        ) : activeTab === 'spatial' ? (
          <motion.div 
            key="spatial-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-12"
          >
             <MapExplorer onViewTour={setActiveTour} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {activeTour && (
          <VirtualTourViewer 
            sceneUrl={activeTour} 
            title="Sierra Blu Neural Tour" 
            onClose={() => setActiveTour(null)} 
          />
        )}
      </AnimatePresence>


      {/* --- Phase 4: Big Inventory --- */}
      <section className="glass-panel overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/30">
          <h2 className="text-2xl font-serif font-bold text-navy">Global Inventory Ledger</h2>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Filter by code, compound, or price..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/70 border border-slate-200 rounded-full py-3 ps-12 pe-6 outline-none focus:ring-2 focus:ring-gold text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                <th className="px-8 py-4">Internal ID</th>
                <th className="px-8 py-4">Placement</th>
                <th className="px-8 py-4">Beds</th>
                <th className="px-8 py-4 text-right">Valuation</th>
                <th className="px-8 py-4 text-center">Lifecycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filteredInventory.map((item) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <span className="font-mono font-bold text-navy bg-slate-100/50 border border-slate-200 px-3 py-1 rounded-lg text-xs">
                        {item.code}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-600">{item.compound}</td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-slate-400">{item.bedrooms} BR</span>
                    </td>
                    <td className="px-8 py-6 text-right font-serif font-bold text-navy">
                      {item.price.toLocaleString()} <span className="text-[10px] text-gold">{item.currency}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => item.id && removeInventoryItem(item.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </section>

      {/* Popups */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 right-12 bg-emerald-500 text-white px-8 py-4 rounded-3xl shadow-2xl z-[100] flex items-center gap-3 backdrop-blur-md border border-white/20"
          >
            <CheckCircle2 size={24} />
            <span className="font-bold text-sm tracking-wide">{successMessage}</span>
          </motion.div>
        )}
        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 right-12 bg-red-500 text-white px-8 py-4 rounded-3xl shadow-2xl z-[100] flex items-center gap-3 backdrop-blur-md border border-white/20"
          >
            <AlertCircle size={24} />
            <span className="font-bold text-sm tracking-wide">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 40px;
          box-shadow: 0 8px 32px rgba(10, 26, 58, 0.05);
        }
      `}</style>
    </div>
  );
}
