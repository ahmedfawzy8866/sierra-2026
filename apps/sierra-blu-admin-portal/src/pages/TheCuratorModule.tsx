import { useState } from 'react';
import { Database, Grid, List, Search, Camera, FileText, AlertCircle, MoreVertical, Zap, Globe, Share, Plus, Edit3 } from 'lucide-react';

type FilterKey = 'All Assets' | 'Raw Data' | 'Branding In Progress' | 'Ready for Distribution' | 'Archived';

const STATUS_MAP: Record<FilterKey, string[]> = {
  'All Assets':             [],
  'Raw Data':               ['Raw Data'],
  'Branding In Progress':   ['In Review'],
  'Ready for Distribution': ['Branded'],
  'Archived':               ['Archived'],
};

const MOCK_INVENTORY = [
  { id: 'SBR-1001', title: 'Skyline Penthouse · Unit 4201',  location: 'Downtown Boulevard, Dubai',  price: '$4,200,000',  beds: 3, size: '3,200 sqft', status: 'Branded',   completion: 100, lastUpdate: '2h ago'  },
  { id: 'SBR-1002', title: 'Marina Waterfront Villa',         location: 'Dubai Marina, District 4',   price: '$8,500,000',  beds: 5, size: '7,100 sqft', status: 'In Review', completion: 85,  lastUpdate: '5h ago'  },
  { id: 'SBR-1003', title: 'Emerald Hills Estate',            location: 'Dubai Hills, Sector E',      price: '$6,100,000',  beds: 4, size: '5,500 sqft', status: 'Raw Data',  completion: 40,  lastUpdate: '1d ago'  },
  { id: 'SBR-1004', title: 'Palm Jumeirah Signature',         location: 'Frond G, Palm Jumeirah',     price: '$12,000,000', beds: 6, size: '9,800 sqft', status: 'Branded',   completion: 100, lastUpdate: '3h ago'  },
];

const statusStyle = (status: string) => {
  if (status === 'Branded')   return { bg: 'rgba(34,197,94,0.12)',    color: '#22c55e',        border: 'rgba(34,197,94,0.3)' };
  if (status === 'In Review') return { bg: 'rgba(201,168,76,0.1)',    color: 'var(--gold)',     border: 'rgba(201,168,76,0.25)' };
  return                             { bg: 'rgba(255,255,255,0.04)',  color: 'var(--text-secondary)', border: 'rgba(255,255,255,0.1)' };
};

export const TheCuratorModule = () => {
  const [viewMode,     setViewMode]     = useState<'grid' | 'list'>('grid');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All Assets');

  const FILTERS: FilterKey[] = ['All Assets', 'Raw Data', 'Branding In Progress', 'Ready for Distribution', 'Archived'];

  const filtered = MOCK_INVENTORY.filter(item => {
    const q       = searchQuery.toLowerCase();
    const inSearch = item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
    const allowed  = STATUS_MAP[activeFilter];
    const inFilter = allowed.length === 0 || allowed.includes(item.status);
    return inSearch && inFilter;
  });

  return (
    <div className="animate-fade-in">
      {/* ── Header ── */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Database size={18} color="var(--gold)" />
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.7rem', fontWeight: 600, color: 'var(--gold)' }}>
              Stage 3–5 · The Curator
            </span>
          </div>
          <h1 className="page-title">Asset Branding &amp; Distribution</h1>
          <p className="page-subtitle">Managing 1,248 units with institutional precision.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search assets…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                padding: '0.6rem 1rem 0.6rem 2.4rem',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                width: '240px',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>
          <button className="btn" onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List size={15} /> : <Grid size={15} />}
            {viewMode === 'grid' ? 'List' : 'Grid'}
          </button>
          <button className="btn btn-primary">
            <Plus size={15} /> Add Asset
          </button>
        </div>
      </header>

      {/* ── Filter Tabs ── */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '4px' }}>
        {FILTERS.map(tab => {
          const count = tab === 'All Assets' ? MOCK_INVENTORY.length : MOCK_INVENTORY.filter(i => STATUS_MAP[tab].includes(i.status)).length;
          const isActive = activeFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className="btn"
              style={{
                whiteSpace: 'nowrap',
                backgroundColor: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(201,168,76,0.35)' : 'var(--border)'}`,
                color: isActive ? 'var(--gold)' : 'var(--text-secondary)',
                fontSize: '0.82rem',
              }}
            >
              {tab}
              <span style={{ marginLeft: '0.35rem', fontSize: '0.72rem', opacity: 0.55 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* ── Empty State ── */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
          <AlertCircle size={36} style={{ opacity: 0.15, marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
          <p style={{ margin: 0 }}>No assets match this filter.</p>
        </div>
      )}

      {/* ── Grid View ── */}
      {viewMode === 'grid' && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(295px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(item => {
            const sc = statusStyle(item.status);
            return (
              <div
                key={item.id}
                style={{ backgroundColor: 'var(--navy)', border: '1px solid var(--border)', borderRadius: '18px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.28)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
              >
                {/* Thumbnail */}
                <div style={{ height: '170px', background: 'linear-gradient(135deg, #0A1120, #0D1836)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Camera size={36} style={{ opacity: 0.07 }} />
                  <span style={{ position: 'absolute', top: '0.85rem', right: '0.85rem', padding: '0.22rem 0.6rem', borderRadius: '6px', fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                    {item.status}
                  </span>
                  {/* Progress strip */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ width: `${item.completion}%`, height: '100%', backgroundColor: sc.color, transition: 'width 0.6s ease' }} />
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 700 }}>{item.id}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{item.lastUpdate}</span>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.05rem', fontWeight: 500, fontFamily: 'Playfair Display, serif', lineHeight: 1.3 }}>{item.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.location}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>{item.price}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.beds} bd · {item.size}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn" style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', padding: '0.42rem' }}><Edit3 size={12} /> Edit</button>
                    <button className="btn" style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', padding: '0.42rem' }}><Zap size={12} /> Polish</button>
                    <button className="btn" style={{ padding: '0.42rem 0.55rem' }}><Globe size={12} /></button>
                    <button className="btn" style={{ padding: '0.42rem 0.55rem' }}><MoreVertical size={12} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── List View ── */}
      {viewMode === 'list' && filtered.length > 0 && (
        <div style={{ backgroundColor: 'var(--navy)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.025)', borderBottom: '1px solid var(--border)' }}>
                {['Asset', 'Status', 'Branding', 'Price', 'Specs', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.9rem 1.2rem', color: 'var(--text-secondary)', fontSize: '0.73rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const sc = statusStyle(item.status);
                return (
                  <tr key={item.id} className="table-row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{item.id} · {item.location}</div>
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <span style={{ padding: '0.22rem 0.6rem', borderRadius: '6px', fontSize: '0.74rem', backgroundColor: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{ width: '70px', height: '3px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                          <div style={{ width: `${item.completion}%`, height: '100%', backgroundColor: sc.color, borderRadius: '2px' }} />
                        </div>
                        <span style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>{item.completion}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.2rem', fontWeight: 600, fontSize: '0.875rem' }}>{item.price}</td>
                    <td style={{ padding: '1rem 1.2rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{item.beds} bd · {item.size}</td>
                    <td style={{ padding: '1rem 1.2rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button className="btn" title="Edit" style={{ padding: '0.38rem 0.48rem' }}><Edit3 size={12} /></button>
                        <button className="btn" title="Media" style={{ padding: '0.38rem 0.48rem' }}><Camera size={12} /></button>
                        <button className="btn" title="Distribute" style={{ padding: '0.38rem 0.48rem' }}><Share size={12} /></button>
                        <button className="btn" title="Logs" style={{ padding: '0.38rem 0.48rem' }}><FileText size={12} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
