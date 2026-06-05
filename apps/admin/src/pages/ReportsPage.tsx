import { useEffect, useState } from 'react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const VALUES = [42, 58, 71, 65, 84, 97];

const REVENUE = [
  { l: 'Closed This Month', v: 'EGP 601M', pct: 100, color: '#34D399' },
  { l: 'Pipeline Value', v: 'EGP 2.1B', pct: 78, color: '#C8961A' },
  { l: 'Avg Deal', v: 'EGP 6.2M', pct: 55, color: '#1E88D9' },
  { l: 'Commissions Due', v: 'EGP 18.4M', pct: 30, color: '#7C3AED' },
];

const COMPOUNDS = [
  { c: 'Mountain View iCity', l: 145, v: 2840, ld: 67, d: 12, p: 'EGP 11.2M', ai: 9.4 },
  { c: 'Hyde Park', l: 98, v: 1920, ld: 54, d: 9, p: 'EGP 18.5M', ai: 9.7 },
  { c: 'Mivida', l: 112, v: 1650, ld: 48, d: 11, p: 'EGP 5.8M', ai: 9.0 },
  { c: 'Uptown Cairo', l: 187, v: 3120, ld: 89, d: 18, p: 'EGP 9.4M', ai: 9.3 },
  { c: 'Madinaty', l: 324, v: 4200, ld: 112, d: 24, p: 'EGP 4.5M', ai: 8.8 },
  { c: 'Eastown', l: 76, v: 980, ld: 31, d: 6, p: 'EGP 8.2M', ai: 9.1 },
];

export function ReportsPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="os-page">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* Bar chart */}
        <div className="os-card">
          <div className="os-card-hd"><span className="os-card-title">📊 Monthly Deals Closed</span></div>
          <div className="os-card-body">
            <div className="os-bar-chart">
              {MONTHS.map((m, i) => (
                <div key={m} className="os-bar-col">
                  <div
                    className="os-bar-fill"
                    style={{
                      height: loaded ? `${VALUES[i]}%` : '0%',
                      background: 'linear-gradient(180deg,#C8961A,#C8961A55)',
                      transition: `height 1s cubic-bezier(.16,1,.3,1) ${i * 80}ms`,
                    }}
                  />
                  <span className="os-bar-lbl">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue pipeline */}
        <div className="os-card">
          <div className="os-card-hd"><span className="os-card-title">💰 Revenue Pipeline</span></div>
          <div className="os-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {REVENUE.map((r, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11 }}>
                  <span style={{ color: 'var(--os-tx-m)' }}>{r.l}</span>
                  <span style={{ color: r.color, fontWeight: 700, fontFamily: 'JetBrains Mono,monospace' }}>{r.v}</span>
                </div>
                <div className="os-progress-bar">
                  <div className="os-progress-fill" style={{ width: loaded ? `${r.pct}%` : '0%', background: r.color, transition: `width 1.2s ease ${i * 120}ms` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compound table */}
      <div className="os-card">
        <div className="os-card-hd"><span className="os-card-title">🗺️ Performance by Compound</span></div>
        <div style={{ overflowX: 'auto' }}>
          <table className="os-table">
            <thead>
              <tr>
                {['Compound', 'Listings', 'Views', 'Leads', 'Deals', 'Avg Price', 'AI Score'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPOUNDS.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--os-tx)' }}>{r.c}</td>
                  <td style={{ fontFamily: 'JetBrains Mono,monospace' }}>{r.l}</td>
                  <td style={{ fontFamily: 'JetBrains Mono,monospace' }}>{r.v.toLocaleString()}</td>
                  <td style={{ fontFamily: 'JetBrains Mono,monospace', color: '#1E88D9' }}>{r.ld}</td>
                  <td style={{ fontFamily: 'JetBrains Mono,monospace', color: '#34D399', fontWeight: 700 }}>{r.d}</td>
                  <td style={{ fontFamily: 'JetBrains Mono,monospace', color: '#C8961A', fontWeight: 700 }}>{r.p}</td>
                  <td>
                    <span style={{
                      fontFamily: 'JetBrains Mono,monospace', fontWeight: 700,
                      color: r.ai >= 9.5 ? '#34D399' : r.ai >= 9 ? '#C8961A' : 'var(--os-tx-m)',
                    }}>{r.ai}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
