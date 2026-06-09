import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Terminal, FileText, User, Bot } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'user' | 'lola';
  text: string;
  time: string;
  propertyCard?: {
    code: string;
    title: string;
    price: string;
    location: string;
    owner: string;
  };
}

export const LolaAssistantModule = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'lola',
      text: 'Good day. I am Lola, your AI executive assistant for Sierra Estates. I am connected to the Obsidian Vault Truth Engine and the active New Cairo inventory. How can I help you secure owner properties or coordinate viewings today?',
      time: '11:14 PM'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const obsidianNodes = [
    { name: 'Sierra Estates Memory Engine', size: '3.0 KB', type: 'System Core' },
    { name: 'Sourcing Pipeline & Lead Aggregator', size: '2.5 KB', type: 'Scrapers' },
    { name: 'Sales Scripts & Outreach', size: '2.8 KB', type: 'Outreach' },
    { name: 'WhatsApp CRM & Hand-off Pipeline', size: '3.2 KB', type: 'Automation' },
    { name: 'Forecasting Engine', size: '1.8 KB', type: 'Analytics' }
  ];

  const quickActions = [
    { label: 'Verify Owner Ratio', desc: 'Scan inventory for >=40% owner listings' },
    { label: 'Check 6h Handoffs', desc: 'Alerts if agents miss viewing slots' },
    { label: 'Sync Google Calendar', desc: 'Check viewings for a.fawzy8866@gmail.com' }
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputVal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate Lola's response based on real Egypt/New Cairo features
    setTimeout(() => {
      let lolaReply = "I have scanned your New Cairo inventory. Everything is running perfectly!";
      let propertyCard = undefined;

      const query = inputVal.toLowerCase();

      if (query.includes('owner') || query.includes('مالك') || query.includes('sourcing')) {
        lolaReply = "Master Sierra, I have scanned your sourcing sheets and active WhatsApp aggregators. We currently have 3 direct-from-owner listings, giving us a perfect 60% Owner Direct Ratio (exceeding your 40% target!). Here is the top investment asset matched from the Lake View compound:";
        propertyCard = {
          code: 'LV-3B-125K-F',
          title: 'Lake View Residence Furnished Apartment',
          price: 'EGP 12,500,000',
          location: 'Golden Square, New Cairo',
          owner: 'Mohamed Aly (Direct Owner)'
        };
      } else if (query.includes('script') || query.includes('whatsapp') || query.includes('رسالة')) {
        lolaReply = "I have extracted the official Arabic WhatsApp scripts from your Obsidian brain (`Sales Scripts & Outreach.md`). I can deploy Script 1 (Initial Vetting for Owner Listings) or Script 3 (Co-Broke coordination 50/50 for broker listings) immediately when new units are ingested!";
      } else if (query.includes('calendar') || query.includes('appointment') || query.includes('viewing')) {
        lolaReply = "Checked your schedule, Master! Leila and I have synced the viewing appointment on Google Calendar for your Lake View Residence apartment. The notification email containing client details and the co-broke broker script has been successfully sent to a.fawzy8866@gmail.com!";
      } else {
        lolaReply = `Understood, Master Sierra! I have updated my local state. I will continue to monitor your WhatsApp broker groups and OLX/Dubizzle scrapers. If a sales agent fails to reply to a lead within 6 hours, I will step in, contact the owner/broker, book the viewing on your Google Calendar, and email your summary directly to a.fawzy8866@gmail.com!`;
      }

      const lolaMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'lola',
        text: lolaReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        propertyCard
      };

      setMessages(prev => [...prev, lolaMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="lola-container animate-fade-in" style={{ padding: '2rem', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.25rem', fontWeight: 300 }}>
            <Sparkles size={32} color="var(--gold)" />
            Lola: AI Executive Assistant Hub
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Your lovely real estate intelligence assistant, connected directly to your New Cairo Obsidian Vault.
          </p>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', flex: 1, overflow: 'hidden' }}>
        {/* Chat Area */}
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--navy)', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden' }}>
          {/* Chat Messages */}
          <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map(msg => (
              <div 
                key={msg.id} 
                style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  maxWidth: '75%', 
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                }}
              >
                {/* Avatar */}
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px', 
                  backgroundColor: msg.sender === 'user' ? 'rgba(212,175,55,0.1)' : 'rgba(56,189,248,0.1)', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  flexShrink: 0,
                  border: `1px solid ${msg.sender === 'user' ? 'rgba(212,175,55,0.2)' : 'rgba(56,189,248,0.2)'}`
                }}>
                  {msg.sender === 'user' ? <User size={18} color="var(--gold)" /> : <Bot size={18} color="#38bdf8" />}
                </div>

                {/* Message Box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ 
                    padding: '1rem 1.25rem', 
                    borderRadius: '16px', 
                    backgroundColor: msg.sender === 'user' ? 'var(--gold)' : 'rgba(255,255,255,0.02)',
                    color: msg.sender === 'user' ? '#000' : 'var(--text-primary)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--border)',
                    fontSize: '0.95rem',
                    lineHeight: 1.5
                  }}>
                    {msg.text}

                    {/* Extracted Property Card */}
                    {msg.propertyCard && (
                      <div style={{ 
                        marginTop: '1.25rem', 
                        padding: '1.25rem', 
                        backgroundColor: 'rgba(0,0,0,0.25)', 
                        borderRadius: '12px', 
                        border: '1px solid rgba(212,175,55,0.2)',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.05em' }}>{msg.propertyCard.code}</span>
                          <span className="status-badge" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: '0.65rem' }}>Owner Vetted</span>
                        </div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>{msg.propertyCard.title}</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📍 {msg.propertyCard.location}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{msg.propertyCard.price}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>👤 {msg.propertyCard.owner}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', margin: '0 0.25rem' }}>{msg.time}</span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(56,189,248,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(56,189,248,0.2)' }}>
                  <Bot size={18} color="#38bdf8" />
                </div>
                <div style={{ padding: '1rem 1.5rem', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span className="animate-pulse" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%' }} />
                  <span className="animate-pulse" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animationDelay: '0.2s' }} />
                  <span className="animate-pulse" style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-secondary)', borderRadius: '50%', animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem', backgroundColor: 'rgba(255,255,255,0.01)', flexShrink: 0 }}>
            <input 
              type="text" 
              placeholder="Ask Lola to check properties, scripts, or schedule viewings..." 
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              style={{
                flex: 1,
                padding: '0.85rem 1.25rem',
                backgroundColor: 'rgba(0,0,0,0.3)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
            <button className="btn btn-primary" type="submit" style={{ width: '50px', height: '50px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Sidebar Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Obsidian Vault Sync */}
          <div style={{ backgroundColor: 'var(--navy)', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--gold)" />
              Obsidian Brain Nodes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {obsidianNodes.map(node => (
                <div key={node.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ fontWeight: 500, display: 'block', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>{node.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{node.type}</span>
                  </div>
                  <span className="status-badge" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: '0.65rem' }}>Active</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ backgroundColor: 'var(--navy)', border: '1px solid var(--border)', borderRadius: '24px', padding: '1.5rem', flex: 1 }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={18} color="var(--gold)" />
              Lola Executive Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {quickActions.map(action => (
                <button 
                  key={action.label} 
                  onClick={() => {
                    setInputVal(action.label);
                  }}
                  className="btn table-row-hover" 
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '0.8rem 1rem', textAlign: 'left', display: 'block', height: 'auto', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}
                >
                  <span style={{ fontWeight: 500, display: 'block', color: 'var(--gold)', fontSize: '0.85rem' }}>{action.label}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.15rem' }}>{action.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LolaAssistantModule;
