'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ArrowLeft, Send, Bot, User, Shield, HelpCircle } from 'lucide-react';

const G = '#E9C176';
const G2 = '#C8961A';

const THEMES = {
  dark: {
    bg: '#0D2035', text: '#EFF8F7', textSub: 'rgba(239,248,247,0.78)',
    border: 'rgba(233,193,118,0.18)', card: '#122A47', bg2: '#0A1520',
  },
  light: {
    bg: '#EEF2F4', text: '#0C1B2E', textSub: 'rgba(12,27,46,0.74)',
    border: 'rgba(12,27,46,0.14)', card: '#FFFFFF', bg2: '#DCE4E8',
  },
};

interface ChatMessage {
  id: number;
  sender: 'user' | 'sierra';
  text: string;
  time: string;
}

export default function AskSierraPage() {
  const { theme } = useTheme();
  const mode = (theme === 'light' ? 'light' : 'dark') as 'light' | 'dark';
  const th = THEMES[mode];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'sierra',
      text: 'Ahlan, Master! 🐪 I am Sierra, the premier AI real estate advisor in Egypt. I am specialized in New Cairo (Tagamoa), Madinaty, and Shorouk rent & resale investments. Ask me anything about yields, comparable pricing, or compound lifestyles!',
      time: '12:04 AM'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

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

    setTimeout(() => {
      let replyText = "I have analyzed your request. As the first specialized AI broker in Egypt, I recommend Golden Square compounds (like Lake View or Mivida) for high rental yields, or Madinaty for long-term capital appreciation.";
      
      const q = inputVal.toLowerCase();
      if (q.includes('yield') || q.includes('roi') || q.includes('عائد')) {
        replyText = "For maximum rental yield in New Cairo, **Lake View Residence** and **Mivida** are currently leading at **8.7% - 9.2% gross yields** in EGP. If you seek absolute volume and occupancy, **Madinaty** apartments deliver a robust **10.4% yield** due to high demand from families.";
      } else if (q.includes('shorouk') || q.includes('شروق') || q.includes('sherouk')) {
        replyText = "Shorouk City is an exceptional residential corridor! Average prices per square meter hover around **32,000 EGP**. Compounds there (like Beverly Hills or Sodic East) offer a calmer atmosphere with **11% YoY capital growth** as the Administrative Capital corridor consolidates.";
      } else if (q.includes('owner') || q.includes('مالك')) {
        replyText = "Sierra has a strict mandate to maintain a **40%+ Direct Owner Sourcing Ratio**. This saves you from multi-agent fee loops (co-brokes) and gives you the absolute lowest market entry prices. Let me match you directly with owner-listed apartments.";
      }

      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'sierra',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const sampleQuestions = [
    "What is the average yield in Golden Square?",
    "Compare Madinaty vs Shorouk compounds",
    "How does the 40% owner direct target work?"
  ];

  return (
    <div style={{ background: th.bg, color: th.text, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Jost', sans-serif" }}>
      {/* Header */}
      <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', borderBottom: `1px solid ${th.border}`, backdropFilter: 'blur(20px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/">
            <button style={{ background: 'transparent', border: `1px solid ${th.border}`, color: th.text, width: 40, height: 40, borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.02em' }}>Ask Sierra AI Advisor</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: th.textSub }}>Egypt\'s First & Only Specialized AI Property Broker</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(233,193,118,0.1)', border: `1px solid ${G}`, borderRadius: '24px', padding: '6px 16px', fontSize: '0.8rem', color: G }}>
          <Shield size={14} />
          <span>Bilingual Advisory</span>
        </div>
      </div>

      {/* Main Chat Layout */}
      <div style={{ maxWidth: 1000, margin: '2rem auto', width: '100%', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', flex: 1, overflow: 'hidden', height: 'calc(100vh - 150px)' }}>
        
        {/* Left: Chat Pane */}
        <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Messages */}
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  maxWidth: '80%',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: msg.sender === 'user' ? 'rgba(212,175,55,0.1)' : 'rgba(56,189,248,0.1)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: `1px solid ${msg.sender === 'user' ? 'rgba(212,175,55,0.2)' : 'rgba(56,189,248,0.2)'}`,
                  flexShrink: 0
                }}>
                  {msg.sender === 'user' ? <User size={16} color="var(--gold)" /> : <Bot size={16} color={G} />}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{
                    padding: '0.85rem 1.15rem',
                    borderRadius: '16px',
                    backgroundColor: msg.sender === 'user' ? G : 'rgba(255,255,255,0.02)',
                    color: msg.sender === 'user' ? '#000' : th.text,
                    border: msg.sender === 'user' ? 'none' : `1px solid ${th.border}`,
                    fontSize: '0.9rem',
                    lineHeight: 1.5
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: th.textSub, alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', margin: '0 4px' }}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(56,189,248,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid rgba(56,189,248,0.2)' }}>
                  <Bot size={16} color={G} />
                </div>
                <div style={{ padding: '0.85rem 1.25rem', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.02)', border: `1px solid ${th.border}`, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span className="animate-pulse" style={{ width: '5px', height: '5px', backgroundColor: th.textSub, borderRadius: '50%' }} />
                  <span className="animate-pulse" style={{ width: '5px', height: '5px', backgroundColor: th.textSub, borderRadius: '50%', animationDelay: '0.2s' }} />
                  <span className="animate-pulse" style={{ width: '5px', height: '5px', backgroundColor: th.textSub, borderRadius: '50%', animationDelay: '0.4s' }} />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} style={{ padding: '1.25rem', borderTop: `1px solid ${th.border}`, display: 'flex', gap: '0.75rem', backgroundColor: 'rgba(255,255,255,0.01)' }}>
            <input
              type="text"
              placeholder="Ask Sierra about prices, ROI, compounds or booking tours..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem 1.15rem',
                backgroundColor: 'rgba(0,0,0,0.2)',
                color: '#fff',
                border: `1px solid ${th.border}`,
                borderRadius: '12px',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <button type="submit" style={{ width: '44px', height: '44px', borderRadius: '12px', background: `linear-gradient(135deg, ${G2}, ${G})`, color: '#000', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Right Pane: Suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '24px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', color: G }}>
              <HelpCircle size={16} />
              Suggested Inquiries
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sampleQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setInputVal(q)}
                  style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    background: 'rgba(255,255,255,0.01)',
                    border: `1px solid ${th.border}`,
                    borderRadius: '10px',
                    color: th.textSub,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = G; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.textSub; }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ background: th.card, border: `1px solid ${th.border}`, borderRadius: '24px', padding: '1.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: th.textSub, display: 'block', marginBottom: '0.25rem' }}>AI Broker Authority</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 600, color: G }}>#1 in Egypt</span>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: th.textSub }}>
              Directly linked to WhatsApp aggregators, OLX, Bayut, and local co-broke channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
