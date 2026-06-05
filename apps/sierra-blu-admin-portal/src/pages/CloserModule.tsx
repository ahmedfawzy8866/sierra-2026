import { useState } from 'react';
import { Target, TrendingUp, Award, MessageSquare, BarChart3, DollarSign, PieChart, CheckCircle2 } from 'lucide-react';

const MOCK_CLOSINGS = [
  { id: 'CL-501', client: 'James Carter', property: 'Skyline Penthouse', value: '$5.2M', comm: '$156k', status: 'Closed', date: '2024-03-15' },
  { id: 'CL-502', client: 'Elena Rossi', property: 'Palm Jumeirah Villa', value: '$14.8M', comm: '$444k', status: 'Finalizing', date: '2024-03-22' },
  { id: 'CL-503', client: 'Ahmed Hassan', property: 'Skyline Penthouse', value: '$5.1M', comm: '$153k', status: 'Closed', date: '2024-03-10' }
];

export const CloserModule = () => {
  const [activeTab, setActiveTab] = useState('Performance');

  return (
    <div className="closer-container animate-fade-in" style={{ padding: '2rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.25rem', fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            <Target size={32} color="#D4AF37" />
            The Closer Module
            <span style={{ fontSize: '0.75rem', verticalAlign: 'middle', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '0.2rem 0.6rem', borderRadius: '4px', marginLeft: '0.5rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}>STAGES 9-10</span>
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            Strategic Asset Finalization &amp; Intelligence Optimization.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ textAlign: 'right' }}>
             <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Quarterly Revenue</p>
             <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 500, color: 'var(--gold)' }}>$25.1M</p>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Closing Rate', value: '68%', icon: <Award size={20} />, trend: '+12%' },
          { label: 'Avg Deal Value', value: '$8.4M', icon: <DollarSign size={20} />, trend: '+5%' },
          { label: 'Pipeline Velocity', value: '14 Days', icon: <TrendingUp size={20} />, trend: '-2 Days' },
          { label: 'System Feedback', value: '94%', icon: <MessageSquare size={20} />, trend: 'Optimal' }
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: 'var(--navy)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ color: 'var(--gold)', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.5rem', borderRadius: '10px' }}>{stat.icon}</div>
              <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>{stat.trend}</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{stat.label}</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '1.75rem', fontWeight: 300, color: 'var(--text-primary)' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'var(--navy)', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '2rem' }}>
          {['Performance', 'Finalization Log', 'Optimization AI'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: activeTab === tab ? 'var(--gold)' : 'var(--text-secondary)',
                fontSize: '1rem',
                fontWeight: activeTab === tab ? 500 : 400,
                cursor: 'pointer',
                paddingBottom: '1rem',
                position: 'relative',
                transition: 'all 0.3s'
              }}
            >
              {tab}
              {activeTab === tab && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '2px', backgroundColor: 'var(--gold)', borderRadius: '2px' }}></div>
              )}
            </button>
          ))}
        </div>

        <div style={{ padding: '2rem' }}>
          {activeTab === 'Performance' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
               <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--border)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                   <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 300 }}>Revenue Distribution</h3>
                   <PieChart size={20} color="var(--text-secondary)" />
                 </div>
                 <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                   <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>[Cinematic Chart Component Placeholder]</span>
                 </div>
               </div>
               <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '2rem', border: '1px solid var(--border)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                   <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 300 }}>Closing Velocity (Days)</h3>
                   <BarChart3 size={20} color="var(--text-secondary)" />
                 </div>
                 <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '0 1rem' }}>
                   {[65, 80, 45, 90, 70, 85].map((h, i) => (
                     <div key={i} style={{ flex: 1, height: h + '%', backgroundColor: i === 3 ? 'var(--gold)' : 'rgba(212, 175, 55, 0.2)', borderRadius: '4px 4px 0 0' }}></div>
                   ))}
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'Finalization Log' && (
            <div className="table-container">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.9rem' }}>Transaction ID</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.9rem' }}>Client</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.9rem' }}>Property</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.9rem' }}>Value</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.9rem' }}>Status</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.9rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CLOSINGS.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="table-row-hover">
                      <td style={{ padding: '1.25rem 1rem', color: 'var(--gold)', fontWeight: 500 }}>{c.id}</td>
                      <td style={{ padding: '1.25rem 1rem' }}>{c.client}</td>
                      <td style={{ padding: '1.25rem 1rem' }}>{c.property}</td>
                      <td style={{ padding: '1.25rem 1rem' }}>{c.value}</td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <span style={{
                          backgroundColor: c.status === 'Closed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(212, 175, 55, 0.1)',
                          color: c.status === 'Closed' ? '#22c55e' : 'var(--gold)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem'
                        }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.05)' }}>Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'Optimization AI' && (
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <CheckCircle2 size={64} color="var(--gold)" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
                <h3 style={{ fontSize: '1.75rem', fontWeight: 300, marginBottom: '1rem' }}>Intelligence Optimization Ready</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.1rem' }}>
                  The Closer has analyzed recent conversions. We recommend updating the <strong>Matchmaker Neural Weights</strong> for the Downtown area to prioritize &quot;High Floor&quot; amenities over &quot;Balcony Space&quot; based on the last 5 successful deals.
                </p>
              </div>
              <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem', letterSpacing: '0.05em' }}>
                DEPLOY SYSTEM OPTIMIZATION
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
