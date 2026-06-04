import { useState } from 'react';
import { Users, Phone, Mail, ChevronRight, UserCheck, Sparkles, Send } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  property: string;
  phone: string;
  status: string;
  assignedTo: string;
  source: string;
  budget: string;
  urgency: string;
}

const MOCK_LEADS: Lead[] = [
  { id: 'LD-101', name: 'James Carter', property: 'Skyline Penthouse', phone: '+971 50 123 4567', status: 'New', assignedTo: 'emp_01', source: 'Property Finder', budget: '$5M - $7M', urgency: 'High' },
  { id: 'LD-102', name: 'Sarah Al Fayed', property: 'Paramount Residences', phone: '+971 55 987 6543', status: 'Contacted', assignedTo: 'emp_01', source: 'EasyListing', budget: '$10M+', urgency: 'Medium' },
  { id: 'LD-103', name: 'Michael Chen', property: 'Marina Waterfront Villa', phone: '+971 52 333 4444', status: 'Viewing Set', assignedTo: 'emp_02', source: 'EasyListing', budget: '$3M - $4M', urgency: 'High' },
  { id: 'LD-104', name: 'Elena Rossi', property: 'Palm Jumeirah Signature Villa', phone: '+971 58 111 2222', status: 'New', assignedTo: 'emp_02', source: 'Property Finder', budget: '$15M+', urgency: 'Critical' },
  { id: 'LD-105', name: 'Ahmed Hassan', property: 'Skyline Penthouse', phone: '+971 50 555 6666', status: 'Negotiating', assignedTo: 'emp_01', source: 'EasyListing', budget: '$5M - $6M', urgency: 'High' }
];

const MOCK_MATCHES = [
  { id: 'P-001', title: 'The Royal Atlantis Penthouse', area: 'Palm Jumeirah', price: '$12.5M', score: 98 },
  { id: 'P-004', title: 'Bulgari Mansions', area: 'Jumeirah Bay', price: '$18.2M', score: 94 },
  { id: 'P-002', title: 'One Canal Residences', area: 'Dubai Canal', price: '$8.9M', score: 87 }
];

export const CRMModule = ({ currentUserRole, currentUserId }: { currentUserRole: string, currentUserId: string }) => {
  const [filter, setFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showMatcher, setShowMatcher] = useState(false);

  const myLeads = currentUserRole === 'super_admin'
    ? MOCK_LEADS
    : MOCK_LEADS.filter(lead => lead.assignedTo === currentUserId);

  const filteredLeads = filter === 'All' ? myLeads : myLeads.filter(lead => lead.status === filter);

  const handleMatch = (lead: Lead) => {
    setSelectedLead(lead);
    setShowMatcher(true);
  };

  return (
    <div className="crm-container animate-fade-in" style={{ padding: '2rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.25rem', fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            <UserCheck size={32} color="#D4AF37" />
            Matchmaker CRM
            <span style={{ fontSize: '0.75rem', verticalAlign: 'middle', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold)', padding: '0.2rem 0.6rem', borderRadius: '4px', marginLeft: '0.5rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>STAGES 6-8</span>
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            Stakeholder Profiling &amp; Neural Portfolio Synthesis.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          {['All', 'New', 'Negotiating'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className="btn"
              style={{
                backgroundColor: filter === status ? 'var(--gold)' : 'transparent',
                color: filter === status ? '#000' : 'var(--text-secondary)',
                border: 'none',
                boxShadow: filter === status ? '0 4px 12px rgba(212, 175, 55, 0.3)' : 'none',
                padding: '0.6rem 1.25rem'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {!showMatcher ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
          {filteredLeads.map((lead) => (
            <div key={lead.id} style={{
              backgroundColor: 'var(--navy)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '1.75rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }} className="card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 400, color: 'var(--text-primary)' }}>{lead.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', opacity: 0.7 }}>{lead.id}</span>
                    <span style={{ width: '3px', height: '3px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%' }}></span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>{lead.source}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="status-badge" style={{
                    backgroundColor: lead.urgency === 'Critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(212, 175, 55, 0.05)',
                    color: lead.urgency === 'Critical' ? '#ef4444' : 'var(--gold)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    border: '1px solid ' + (lead.urgency === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(212, 175, 55, 0.1)')
                  }}>
                    {lead.urgency}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Budget</p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{lead.budget}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Target</p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.property}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => handleMatch(lead)}
                  className="btn btn-primary"
                  style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', height: '48px', fontSize: '0.9rem' }}
                >
                  <Sparkles size={18} /> Neural Match
                </button>
                <button className="btn" style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', height: '48px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={18} />
                </button>
                <button className="btn" style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', height: '48px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={18} />
                </button>
              </div>
            </div>
          ))}
          {filteredLeads.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
              <Users size={48} style={{ opacity: 0.15, marginBottom: '1rem' }} />
              <p>No leads match the current filter.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="matcher-view animate-slide-up" style={{ backgroundColor: 'var(--navy)', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', minHeight: '600px' }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, rgba(212, 175, 55, 0.05), transparent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button onClick={() => setShowMatcher(false)} className="btn" style={{ padding: '0.5rem', backgroundColor: 'transparent', color: 'var(--text-secondary)' }}>
                <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
              </button>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 300 }}>Synthesis for <span style={{ color: 'var(--gold)' }}>{selectedLead?.name}</span></h2>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Matching {selectedLead?.budget} requirements against luxury inventory</p>
              </div>
            </div>
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1.5rem' }}>
              <Send size={18} /> Generate Stage 8 Portfolio
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', padding: '2rem' }}>
            <div>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 1rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold)' }}>Neural Parameters</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'Location Match', value: 94 },
                    { label: 'Budget Alignment', value: 88 },
                    { label: 'Aesthetic Preference', value: 91 },
                    { label: 'Amenities Priority', value: 85 }
                  ].map(param => (
                    <div key={param.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{param.label}</span>
                        <span style={{ color: 'var(--text-primary)' }}>{param.value}%</span>
                      </div>
                      <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: param.value + '%', backgroundColor: 'var(--gold)', borderRadius: '2px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed rgba(212, 175, 55, 0.3)', borderRadius: '12px' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>
                    "AI Analysis suggests {selectedLead?.name} prefers modern glass architecture over traditional styles. Prioritizing Skyline views."
                  </p>
                </div>
              </div>
            </div>

            <div>
               <h4 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', fontWeight: 300, color: 'var(--text-primary)' }}>High Fidelity Matches (Neural Score &gt; 85%)</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {MOCK_MATCHES.map(match => (
                   <div key={match.id} style={{
                     display: 'flex',
                     alignItems: 'center',
                     gap: '1.5rem',
                     padding: '1.25rem',
                     backgroundColor: 'rgba(255,255,255,0.02)',
                     borderRadius: '16px',
                     border: '1px solid var(--border)',
                     transition: 'all 0.2s'
                   }} className="table-row-hover">
                     <div style={{
                       width: '60px',
                       height: '60px',
                       borderRadius: '12px',
                       backgroundColor: 'rgba(212, 175, 55, 0.1)',
                       display: 'flex',
                       justifyContent: 'center',
                       alignItems: 'center',
                       fontSize: '1.2rem',
                       fontWeight: 600,
                       color: 'var(--gold)',
                       border: '1px solid rgba(212, 175, 55, 0.2)',
                       flexShrink: 0
                     }}>
                       {match.score}%
                     </div>
                     <div style={{ flex: 1 }}>
                       <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 400 }}>{match.title}</h4>
                       <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{match.area} • {match.price}</p>
                     </div>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', border: '1px solid var(--border)' }}>View Specs</button>
                        <button className="btn" style={{ padding: '0.5rem', backgroundColor: 'var(--gold)', color: '#000', border: 'none', display: 'flex', alignItems: 'center' }}>
                          <ChevronRight size={18} />
                        </button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
