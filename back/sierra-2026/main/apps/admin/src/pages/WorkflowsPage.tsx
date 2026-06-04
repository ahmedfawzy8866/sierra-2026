import { useState } from 'react';

type WFStatus = 'active' | 'warning' | 'paused';
interface Workflow { name: string; status: WFStatus; runs: number; last: string; color: string; }

const INITIAL: Workflow[] = [
  { name: 'Lead Ingestion → Firestore', status: 'active', runs: 12840, last: '2 min ago', color: '#34D399' },
  { name: 'WhatsApp Scraper Cron (30m)', status: 'active', runs: 6420, last: '28 min ago', color: '#34D399' },
  { name: 'Listing Price AVM Sync', status: 'active', runs: 3210, last: '1 hr ago', color: '#34D399' },
  { name: 'Stage-9 Contract Generator', status: 'active', runs: 421, last: '15 min ago', color: '#34D399' },
  { name: 'Broker KPI Report (Daily)', status: 'active', runs: 186, last: '6 hrs ago', color: '#1E88D9' },
  { name: 'Stale Listing Monitor', status: 'warning', runs: 890, last: '2 hrs ago', color: '#f59e0b' },
  { name: 'Email Follow-Up Sequence', status: 'paused', runs: 1240, last: '1 day ago', color: '#E63946' },
  { name: 'Telegram Alert Dispatcher', status: 'active', runs: 5640, last: '4 min ago', color: '#34D399' },
];

const FUNNEL = [
  { s: 'S1-2', label: 'Ingestion & Parsing', count: 4821, pct: 100, color: '#1E88D9' },
  { s: 'S3-5', label: 'Inventory & Pricing', count: 3102, pct: 64, color: '#C8961A' },
  { s: 'S6-8', label: 'Matching & Outreach', count: 1240, pct: 26, color: '#34D399' },
  { s: 'S9', label: 'Negotiation', count: 421, pct: 8.7, color: '#7C3AED' },
  { s: 'S10', label: 'Closed Deals', count: 97, pct: 2, color: '#E63946' },
];

function chipClass(s: WFStatus) {
  return s === 'active' ? 'os-chip-green' : s === 'warning' ? 'os-chip-amber' : 'os-chip-red';
}

export function WorkflowsPage() {
  const [wfs, setWfs] = useState<Workflow[]>(INITIAL.map(w => ({ ...w })));

  const toggle = (i: number) => setWfs(prev =>
    prev.map((w, j) => j === i ? { ...w, status: w.status === 'paused' ? 'active' : 'paused', color: w.status === 'paused' ? '#34D399' : '#E63946' } : w)
  );

  return (
    <div className="os-page">
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className="os-btn os-btn-gold">▶ Run All Active</button>
        <button className="os-btn os-btn-ghost">↻ Refresh Status</button>
        <button className="os-btn os-btn-ghost">⬡ Open n8n Editor ↗</button>
      </div>

      <div className="os-card" style={{ marginBottom: 14 }}>
        <div className="os-card-hd"><span className="os-card-title">Automation Workflows · n8n Visual Engine</span></div>
        <div style={{ padding: '8px 0' }}>
          {wfs.map((w, i) => (
            <div key={i} className="os-wf-node">
              <div className="os-wf-dot os-pulse-dot" style={{ background: w.color }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--os-tx)', marginBottom: 2 }}>{w.name}</p>
                <p style={{ fontSize: 9.5, color: 'var(--os-tx-f)', fontFamily: 'JetBrains Mono,monospace' }}>
                  {w.runs.toLocaleString()} runs · last: {w.last}
                </p>
              </div>
              <span className={`os-chip ${chipClass(w.status)}`}>{w.status}</span>
              <button onClick={() => toggle(i)} className="os-btn os-btn-ghost" style={{ padding: '4px 8px', fontSize: 10, marginLeft: 4 }}>
                {w.status === 'paused' ? '▶' : '⏸'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="os-card">
        <div className="os-card-hd"><span className="os-card-title">Lead Pipeline · Stage Funnel</span></div>
        <div className="os-card-body">
          {FUNNEL.map((row, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--os-tx)' }}>
                  <strong style={{ color: row.color, fontFamily: 'JetBrains Mono,monospace' }}>{row.s}</strong> · {row.label}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--os-tx-m)' }}>{row.count.toLocaleString()}</span>
              </div>
              <div className="os-progress-bar" style={{ height: 6 }}>
                <div className="os-progress-fill" style={{ width: `${row.pct}%`, background: `linear-gradient(90deg,${row.color},${row.color}80)` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
