"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  MessageSquare,
  Globe,
  Cpu,
  Lock,
  RefreshCw,
  Database,
  CircleCheckBig,
  CircleAlert,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface IntegrationConfigState {
  pfPortalUrl: string;
  pfAgentId: string;
  waBusinessId: string;
  aiModel: string;
  matchingSensitivity: number;
  credentialStatus: {
    propertyFinder: boolean;
    telegram: boolean;
    google: boolean;
    whatsapp: boolean;
  };
}

const DEFAULT_CONFIG: IntegrationConfigState = {
  pfPortalUrl: 'https://gateway.propertyfinder.com/v2',
  pfAgentId: '',
  waBusinessId: '',
  aiModel: 'gemini-1.5-flash',
  matchingSensitivity: 85,
  credentialStatus: {
    propertyFinder: false,
    telegram: false,
    google: false,
    whatsapp: false,
  },
};

const sanitizeStoredConfig = (raw: unknown): IntegrationConfigState => {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_CONFIG;
  }

  const source = raw as Partial<Record<string, unknown>>;

  return {
    pfPortalUrl: typeof source.pfPortalUrl === 'string' && source.pfPortalUrl.trim()
      ? source.pfPortalUrl
      : DEFAULT_CONFIG.pfPortalUrl,
    pfAgentId: typeof source.pfAgentId === 'string' ? source.pfAgentId : '',
    waBusinessId: typeof source.waBusinessId === 'string' ? source.waBusinessId : '',
    aiModel: typeof source.aiModel === 'string' && source.aiModel.trim()
      ? source.aiModel
      : DEFAULT_CONFIG.aiModel,
    matchingSensitivity: typeof source.matchingSensitivity === 'number'
      ? source.matchingSensitivity
      : DEFAULT_CONFIG.matchingSensitivity,
    credentialStatus: {
      propertyFinder: Boolean(
        source.credentialStatus && typeof source.credentialStatus === 'object'
          ? (source.credentialStatus as Record<string, unknown>).propertyFinder
          : source.pfApiKey
      ),
      telegram: Boolean(
        source.credentialStatus && typeof source.credentialStatus === 'object'
          ? (source.credentialStatus as Record<string, unknown>).telegram
          : source.tgBotToken
      ),
      google: Boolean(
        source.credentialStatus && typeof source.credentialStatus === 'object'
          ? (source.credentialStatus as Record<string, unknown>).google
          : source.googleApiKey
      ),
      whatsapp: Boolean(
        source.credentialStatus && typeof source.credentialStatus === 'object'
          ? (source.credentialStatus as Record<string, unknown>).whatsapp
          : source.waVerifyToken
      ),
    },
  };
};

export default function IntegrationHub() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<IntegrationConfigState>(DEFAULT_CONFIG);
  const [activePortal, setActivePortal] = useState<'pf' | 'wa' | 'ai' | 'tg'>('pf');

  useEffect(() => {
    async function loadConfig() {
      const docRef = doc(db, 'system', 'integrations');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setConfig(sanitizeStoredConfig(snap.data().config));
      }
      setLoading(false);
    }

    void loadConfig();
  }, []);

  const vaultTips = useMemo(() => ([
    { name: 'Property Finder', env: 'PROPERTY_FINDER_CLIENT_ID / PROPERTY_FINDER_CLIENT_SECRET', ready: config.credentialStatus.propertyFinder },
    { name: 'Telegram', env: 'TELEGRAM_BOT_TOKEN', ready: config.credentialStatus.telegram },
    { name: 'Google Services', env: 'Server-side secret only', ready: config.credentialStatus.google },
    { name: 'WhatsApp', env: 'WHATSAPP_VERIFY_TOKEN / WA business secret', ready: config.credentialStatus.whatsapp },
  ]), [config.credentialStatus]);

  const saveConfig = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'system', 'integrations'), {
        config,
        updatedAt: new Date().toISOString(),
        version: '4.3.0',
      }, { merge: true });
      if (typeof window !== 'undefined') {
        alert('Nexus configuration synchronized successfully.');
      }
    } catch {
      if (typeof window !== 'undefined') {
        alert('Failed to sync configuration to vault.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-navy">
        <RefreshCw className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="p-12 max-w-7xl mx-auto min-h-screen bg-slate-50">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif font-black text-navy uppercase tracking-tighter mb-2">Integration Nexus</h1>
          <p className="text-slate-500 font-medium">Coordinate cross-platform data intelligence and API gateways.</p>
        </div>
        <button
          onClick={saveConfig}
          disabled={saving}
          className="h-14 px-8 bg-navy text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gold hover:text-navy transition-all flex items-center gap-3 shadow-xl shadow-navy/20 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="animate-spin" size={20} /> : <Database size={20} />}
          Synchronize Vault
        </button>
      </header>

      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-3 space-y-3">
          <NavItem
            active={activePortal === 'pf'}
            onClick={() => setActivePortal('pf')}
            icon={<Globe size={20} />}
            label="Property Finder"
            sublabel="Lead & Inventory Sync"
          />
          <NavItem
            active={activePortal === 'wa'}
            onClick={() => setActivePortal('wa')}
            icon={<MessageSquare size={20} />}
            label="WhatsApp Hub"
            sublabel="Neural Message Intake"
          />
          <NavItem
            active={activePortal === 'tg'}
            onClick={() => setActivePortal('tg')}
            icon={<MessageSquare size={20} />}
            label="Telegram Advisory"
            sublabel="Secure Bot Gateway"
          />
          <NavItem
            active={activePortal === 'ai'}
            onClick={() => setActivePortal('ai')}
            icon={<Cpu size={20} />}
            label="AI Processing"
            sublabel="Gemini Flash Engine"
          />
        </div>

        <div className="col-span-9 bg-white rounded-[48px] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
          {activePortal === 'pf' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-navy">
                  <Globe size={24} />
                </div>
                <h2 className="text-2xl font-bold text-navy">Property Finder Gateway</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <CredentialCard
                  title="API Credential Vault"
                  description="Property Finder secrets were removed from client code and are now expected in server environment variables."
                  envName="PROPERTY_FINDER_CLIENT_ID / PROPERTY_FINDER_CLIENT_SECRET"
                  ready={config.credentialStatus.propertyFinder}
                />
                <div className="grid grid-cols-2 gap-6">
                  <ConfigInput
                    label="Portal Endpoint"
                    value={config.pfPortalUrl}
                    onChange={(value) => setConfig((prev) => ({ ...prev, pfPortalUrl: value }))}
                  />
                  <ConfigInput
                    label="Primary Agent ID"
                    value={config.pfAgentId}
                    onChange={(value) => setConfig((prev) => ({ ...prev, pfAgentId: value }))}
                    placeholder="Your PF internal ID"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                <ShieldCheck className="text-emerald-500" size={32} />
                <div className="text-sm">
                  <p className="font-bold text-navy">Data Isolation Active</p>
                  <p className="text-slate-500 italic">Incoming leads can now be routed into the CRM through the secure Property Finder sync flow instead of staying in a read-only preview.</p>
                </div>
              </div>
            </motion.div>
          )}

          {activePortal === 'tg' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600">
                  <MessageSquare size={24} />
                </div>
                <h2 className="text-2xl font-bold text-navy">Telegram Advisory Hub</h2>
              </div>

              <CredentialCard
                title="Telegram Bot Secret"
                description="Bot tokens are managed outside the browser now, which keeps the advisory channel out of Firestore and the frontend bundle."
                envName="TELEGRAM_BOT_TOKEN"
                ready={config.credentialStatus.telegram}
              />

              <CredentialCard
                title="Google Intelligence Access"
                description="Google service keys should stay server-side only. The dashboard now tracks readiness without storing the raw value."
                envName="Server secret"
                ready={config.credentialStatus.google}
              />

              <div className="p-6 bg-sky-50 rounded-3xl border border-sky-100 flex items-center gap-4">
                <Lock className="text-sky-500" size={32} />
                <div className="text-sm text-sky-900">
                  <p className="font-bold">Neural Connectivity Established</p>
                  <p className="opacity-70">Telegram communications remain encrypted while credentials stay outside the client runtime.</p>
                </div>
              </div>
            </motion.div>
          )}

          {activePortal === 'wa' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MessageSquare size={24} />
                </div>
                <h2 className="text-2xl font-bold text-navy">WhatsApp Hub</h2>
              </div>

              <CredentialCard
                title="WhatsApp Verification"
                description="Verification and business credentials are tracked as server-vault readiness instead of being written into browser-accessible configuration docs."
                envName="WHATSAPP_VERIFY_TOKEN"
                ready={config.credentialStatus.whatsapp}
              />

              <ConfigInput
                label="Business ID"
                value={config.waBusinessId}
                onChange={(value) => setConfig((prev) => ({ ...prev, waBusinessId: value }))}
                placeholder="Meta business or account ID"
              />
            </motion.div>
          )}

          {activePortal === 'ai' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Cpu size={24} />
                </div>
                <h2 className="text-2xl font-bold text-navy">AI Processing</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <ConfigInput
                  label="Preferred Model"
                  value={config.aiModel}
                  onChange={(value) => setConfig((prev) => ({ ...prev, aiModel: value }))}
                />
                <ConfigRange
                  label="Matching Sensitivity"
                  value={config.matchingSensitivity}
                  onChange={(value) => setConfig((prev) => ({ ...prev, matchingSensitivity: value }))}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {vaultTips.map((tip) => (
                  <CredentialStatus key={tip.name} label={tip.name} envName={tip.env} ready={tip.ready} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavItem({ active, onClick, icon, label, sublabel }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; sublabel: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-6 rounded-[32px] transition-all flex items-center gap-4 ${active ? 'bg-navy text-white shadow-xl shadow-navy/20 scale-105' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-gold text-navy' : 'bg-slate-100 text-slate-400'}`}>
        {icon}
      </div>
      <div>
        <p className="font-black text-[10px] uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className={`text-[11px] ${active ? 'text-white/60' : 'text-slate-400 opacity-60'}`}>{sublabel}</p>
      </div>
    </button>
  );
}

function ConfigInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ms-4">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full h-14 px-6 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/5 transition-all text-navy font-medium"
      />
    </div>
  );
}

function ConfigRange({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
        <span className="text-sm font-bold text-navy">{value}%</span>
      </div>
      <input
        type="range"
        min={50}
        max={100}
        step={5}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[#C9A24A]"
      />
    </div>
  );
}

function CredentialCard({ title, description, envName, ready }: { title: string; description: string; envName: string; ready: boolean }) {
  return (
    <div className="rounded-[32px] border border-slate-100 bg-slate-50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-navy">{title}</p>
          <p className="mt-2 text-sm text-slate-500 leading-6">{description}</p>
          <p className="mt-3 text-[11px] font-black uppercase tracking-widest text-slate-400">Vault entry: {envName}</p>
        </div>
        <CredentialStateBadge ready={ready} />
      </div>
    </div>
  );
}

function CredentialStatus({ label, envName, ready }: { label: string; envName: string; ready: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
      <div>
        <p className="text-sm font-bold text-navy">{label}</p>
        <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">{envName}</p>
      </div>
      <CredentialStateBadge ready={ready} />
    </div>
  );
}

function CredentialStateBadge({ ready }: { ready: boolean }) {
  return ready ? (
    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-600">
      <CircleCheckBig size={14} />
      Ready
    </div>
  ) : (
    <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-600">
      <CircleAlert size={14} />
      Needs Vault
    </div>
  );
}
