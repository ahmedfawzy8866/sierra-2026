import { useState, useEffect } from 'react';

const KPI_DATA = [
  { val: '1,547', lbl: 'Total Listings', delta: '+12% this week', up: true, color: '#C8961A' },
  { val: '284', lbl: 'Active Leads', delta: '+8 today', up: true, color: '#1E88D9' },
  { val: 'EGP 6.2M', lbl: 'Avg Deal Value', delta: '+5% MoM', up: true, color: '#34D399' },
  { val: '97', lbl: 'Deals Closed', delta: 'This month', up: true, color: '#7C3AED' },
  { val: '4.1s', lbl: 'Avg Response', delta: '-0.3s improved', up: true, color: '#C8961A' },
  { val: '98.2%', lbl: 'AI Match Rate', delta: '+0.4%', up: true, color: '#34D399' },
  { val: '23', lbl: 'Pending Reviews', delta: '3 urgent', up: false, color: '#E63946' },
  { val: '1,503', lbl: 'Elite Brokers', delta: '+45 this month', up: true, color: '#E9C176' },
];

const HOT_LEADS = [
  { name: 'Ahmed Al-Rashid', interest: 'Villa · Hyde Park · EGP 20M+', stage: 'Viewing', color: '#C8961A' },
  { name: 'Khalid Mansour', interest: 'Penthouse · Uptown · EGP 15M', stage: 'Contract', color: '#34D399' },
  { name: 'Omar Farouk', interest: 'Twin House · Mountain View', stage: 'Negotiating', color: '#E63946' },
];

const AGENTS_MINI = [
  { name: 'Sierra Bot', emoji: '🤖', load: 94, status: 'Online', color: '#C8961A' },
  { name: 'Leila / Lola', emoji: '🐪', load: 87, status: 'Online', color: '#1E88D9' },
  { name: 'Stage-9 Closer', emoji: '💼', load: 71, status: 'Online', color: '#34D399' },
  { name: 'The Curator', emoji: '🎨', load: 68, status: 'Online', color: '#E9C176' },
];

const PIPELINE_STAGES = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10'];
const PIPELINE_H = [95, 88, 82, 79, 74, 68, 61, 55, 42, 28];
const PIPELINE_COLORS = ['#C8961A', '#E9C176', '#1E88D9', '#34D399', '#7C3AED', '#E63946', '#C8961A', '#1E88D9', '#34D399', '#C8961A'];

export function OverviewPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  return (
    <div className="os-page">
      {/* KPI Grid */}
      <div className="os-kpi-grid">
        {KPI_DATA.map((k, i) => (
          <div key={i} className="os-kpi-card" style={{ borderLeftColor: k.color }}>
            <div className="os-kpi-val">{k.val}</div>
            <div className="os-kpi-lbl">{k.lbl}</div>
            <div className={`os-kpi-delta ${k.up ? 'up' : 'dn'}`}>{k.up ? '↑' : '↓'} {k.delta}</div>
          </div>
        ))}
      </div>

      {/* Quick panels */}
      <div className="os-panel-row">
        {/* Pipeline chart */}
        <div className="os-card">
          <div className="os-card-hd"><span className="os-card-title">Pipeline · S1→S10</span></div>
          <div className="os-card-body">
            <div className="os-bar-chart">
              {PIPELINE_STAGES.map((s, i) => (
                <div key={s} className="os-bar-col">
                  <div
                    className="os-bar-fill"
                    style={{
                      height: loaded ? `${PIPELINE_H[i]}%` : '0%',
                      background: `linear-gradient(180deg,${PIPELINE_COLORS[i]},${PIPELINE_COLORS[i]}44)`,
                      transition: `height 1s cubic-bezier(.16,1,.3,1) ${i * 60}ms`,
                    }}
                  />
                  <span className="os-bar-lbl">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hot leads */}
        <div className="os-card">
          <div className="os-card-hd">
            <span className="os-card-title">🔥 Hot Leads</span>
            <span className="os-chip os-chip-red">3 urgent</span>
          </div>
          {HOT_LEADS.map((l, i) => (
            <div key={i} className="os-lead-row">
              <div className="os-avatar" style={{ background: l.color }}>{l.name[0]}</div>
              <div className="os-lead-info">
                <p className="os-lead-name">{l.name}</p>
                <p className="os-lead-sub">{l.interest}</p>
              </div>
              <span className="os-chip os-chip-amber">{l.stage}</span>
            </div>
          ))}
        </div>

        {/* Agent status */}
        <div className="os-card">
          <div className="os-card-hd"><span className="os-card-title">Agent Status</span></div>
          <div className="os-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {AGENTS_MINI.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{a.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-tx)' }}>{a.name}</span>
                    <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: 'var(--os-emerald)' }}>{a.status}</span>
                  </div>
                  <div className="os-progress-bar">
                    <div className="os-progress-fill" style={{ width: loaded ? `${a.load}%` : '0%', background: a.color, transition: `width 1.2s ease ${i * 150}ms` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
