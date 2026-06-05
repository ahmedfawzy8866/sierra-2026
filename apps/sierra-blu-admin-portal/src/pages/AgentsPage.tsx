import { useState } from 'react';

const AGENTS = [
  { name: 'Sierra Bot', desc: 'Primary AI concierge — handles client queries, property recommendations and virtual tour scheduling.', emoji: '🤖', color: '#C8961A', status: 'Online', load: 94, tasks: 1203 },
  { name: 'Leila / Lola', desc: 'Bilingual Arabic specialist — translates listings, handles Gulf Arabic negotiations and cultural context.', emoji: '🐪', color: '#1E88D9', status: 'Online', load: 87, tasks: 889 },
  { name: 'Stage-9 Closer', desc: 'Automated deal engine — drafts contracts, DocuSign integration, Stripe payment links for deposits.', emoji: '💼', color: '#34D399', status: 'Online', load: 71, tasks: 421 },
  { name: 'WhatsApp Scraper', desc: 'Monitors Property Finder, OLX and WhatsApp groups. Pushes structured leads to Firestore.', emoji: '🕵️', color: '#7C3AED', status: 'Running', load: 55, tasks: 2847 },
  { name: 'The Scribe', desc: 'S1-S2 ingestion pipeline — parses raw listing data and normalizes to Sierra schema.', emoji: '✍️', color: '#E63946', status: 'Idle', load: 12, tasks: 4821 },
  { name: 'The Curator', desc: 'S3-S5 inventory management — deduplication, quality scoring and AVM pricing engine.', emoji: '🎨', color: '#E9C176', status: 'Online', load: 68, tasks: 3102 },
];

const CHAT_MSGS = [
  { role: 'ai', text: 'مرحباً! أنا ليلى — مساعدتك العقارية. كيف أقدر أساعدك اليوم؟' },
  { role: 'user', text: 'عندي عميل يبحث عن فيلا في هايد بارك فوق 15 مليون' },
  { role: 'ai', text: 'ممتاز! لدينا 3 فيلل متاحة في هايد بارك من 18.5 مليون. أبرزها فيلا إيميريتس — 6 غرف، حمام سباحة، مفروشة بالكامل. هل تريد أرسل له الملف الكامل على واتساب؟' },
];

function statusChip(status: string) {
  if (status === 'Online' || status === 'Running') return 'os-chip-green';
  if (status === 'Idle') return 'os-chip-amber';
  return 'os-chip-blue';
}

export function AgentsPage() {
  const [active, setActive] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  return (
    <div className="os-page">
      <div className="os-agent-grid">
        {AGENTS.map((a, i) => (
          <div
            key={i}
            className="os-agent-card"
            style={{ borderColor: active === i ? `${a.color}60` : 'var(--os-bd)', cursor: 'pointer' }}
            onClick={() => setActive(active === i ? null : i)}
          >
            <div className="os-agent-icon" style={{ background: `${a.color}18`, border: `1px solid ${a.color}30` }}>{a.emoji}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <div className="os-agent-name">{a.name}</div>
              <span className={`os-chip ${statusChip(a.status)}`}>
                <span className="os-pulse-dot">●</span> {a.status}
              </span>
            </div>
            <div className="os-agent-desc">{a.desc}</div>
            <div className="os-agent-stat">
              <span style={{ color: 'var(--os-tx-f)' }}>Load</span>
              <span style={{ color: a.color, fontWeight: 700 }}>{a.load}%</span>
            </div>
            <div className="os-progress-bar">
              <div className="os-progress-fill" style={{ width: `${a.load}%`, background: a.color }} />
            </div>
            <div className="os-agent-stat" style={{ marginTop: 8 }}>
              <span style={{ color: 'var(--os-tx-f)' }}>Total tasks</span>
              <span style={{ color: 'var(--os-tx)', fontWeight: 700 }}>{a.tasks.toLocaleString()}</span>
            </div>
            {active === i && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--os-bd)', display: 'flex', gap: 6 }}>
                <button className="os-btn os-btn-ghost" style={{ fontSize: 10 }}>⚙ Config</button>
                <button className="os-btn os-btn-ghost" style={{ fontSize: 10 }}>📋 Logs</button>
                <button className="os-btn os-btn-green" style={{ fontSize: 10 }}>▶ Restart</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lola live chat */}
      <div className="os-card" style={{ marginTop: 14 }}>
        <div className="os-card-hd">
          <span className="os-card-title">🐪 Lola Hub · Live Chat Preview</span>
          <span className="os-chip os-chip-green"><span className="os-pulse-dot">●</span> Online</span>
        </div>
        <div className="os-card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto', marginBottom: 10 }}>
            {CHAT_MSGS.map((m, i) => (
              <div key={i} className={`os-chat-msg ${m.role}`}>{m.text}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="os-input"
              style={{ flex: 1 }}
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder="Test Lola/Leila…"
            />
            <button className="os-btn os-btn-gold" onClick={() => setMsg('')}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
