import { useState } from 'react';
import { MessageSquare, Terminal, FileJson, CheckCircle, AlertCircle, RefreshCw, Database } from 'lucide-react';

interface RawMessage {
  id: number;
  source: string;
  text: string;
  time: string;
}

const MOCK_RAW_MESSAGES: RawMessage[] = [
  { id: 1, source: 'WhatsApp', text: 'Villa for sale in Palm Jumeirah. 5 beds, 6000 sqft. Asking 25M AED. Contact 0501234567', time: '10:45 AM' },
  { id: 2, source: 'Telegram', text: 'Downtown Apartment, Skyline view. 2BR, 1400 sqft. 4.5M AED. Ready to move.', time: '11:02 AM' },
  { id: 3, source: 'WhatsApp', text: 'URGENT: Penthouse in Marina. 3BR. 12M AED. Cash buyer only.', time: '11:15 AM' }
];

export const TheScribeModule = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages] = useState(MOCK_RAW_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState<RawMessage | null>(null);

  const handleNormalize = (msg: RawMessage) => {
    setIsProcessing(true);
    setSelectedMessage(msg);
    setTimeout(() => {
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="scribe-container animate-fade-in" style={{ padding: '2rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.25rem', fontWeight: 300, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            <MessageSquare size={32} color="#D4AF37" />
            The Scribe Module
            <span style={{ fontSize: '0.75rem', verticalAlign: 'middle', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.2rem 0.6rem', borderRadius: '4px', marginLeft: '0.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>STAGES 1-2</span>
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            Raw Data Intake &amp; Neural SBR Normalization.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={18} /> Sync Feed
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Raw Intake Feed */}
        <div style={{ backgroundColor: 'var(--navy)', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={18} color="var(--gold)" /> Raw Ingestion Feed
            </h3>
          </div>
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '600px', overflowY: 'auto' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                style={{
                  padding: '1.25rem',
                  backgroundColor: selectedMessage?.id === msg.id ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255,255,255,0.01)',
                  borderRadius: '16px',
                  border: '1px solid ' + (selectedMessage?.id === msg.id ? 'var(--gold)' : 'var(--border)'),
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase' }}>{msg.source}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{msg.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{msg.text}</p>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                   <button
                    onClick={(e) => { e.stopPropagation(); handleNormalize(msg); }}
                    className="btn"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.05)' }}
                   >
                    Process
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Normalization Engine */}
        <div style={{ backgroundColor: 'var(--navy)', border: '1px solid var(--border)', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileJson size={18} color="var(--gold)" /> SBR Normalizer (S2)
            </h3>
          </div>

          <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {!selectedMessage ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center' }}>
                <AlertCircle size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                <p>Select a message to begin logical normalization.</p>
              </div>
            ) : (
              <>
                <div style={{ position: 'relative' }}>
                  <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '1rem' }}>Current Extraction</h4>
                  {isProcessing ? (
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                       <RefreshCw className="animate-spin" size={32} color="var(--gold)" />
                    </div>
                  ) : (
                    <pre style={{
                      margin: 0,
                      padding: '1.5rem',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderRadius: '12px',
                      color: '#38bdf8',
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                      border: '1px solid rgba(56, 189, 248, 0.2)'
                    }}>
{`{
  "stage": "S2",
  "source": "${selectedMessage.source}",
  "type": "Property Listing",
  "normalized": {
    "title": "Extracted Luxury Asset",
    "location": "Palm Jumeirah",
    "price": "25,000,000 AED",
    "specs": {
      "beds": 5,
      "size": "6000 sqft"
    }
  },
  "scribe_confidence": 0.98
}`}
                    </pre>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.05)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                    <CheckCircle size={20} color="#22c55e" />
                    <span style={{ fontSize: '0.9rem', color: '#22c55e' }}>Normalization Complete. Asset Ready for The Curator (S3).</span>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', height: '54px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <Database size={18} /> Push to Global Inventory
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
