import { useState, useEffect, useRef } from 'react';

interface LogLine { t: string; l: string; }

const BOOT_LOGS: LogLine[] = [
  { t: 'dim', l: 'OpenClaw v3.2.1 · Sierra Estates Intelligence OS' },
  { t: 'dim', l: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
  { t: 'green', l: '[✓] Firebase Auth connection established' },
  { t: 'green', l: '[✓] Firestore rules validated — 4 collections active' },
  { t: 'green', l: '[✓] Sierra Bot online — 1,203 sessions this month' },
  { t: 'green', l: '[✓] Leila/Lola agent — Arabic routing active' },
  { t: 'green', l: '[✓] Stage-9 Closer — 97 deals processed this month' },
  { t: 'blue', l: '[~] WhatsApp Scraper — scanning Property Finder (ETA 2 min)' },
  { t: 'blue', l: '[~] AVM Engine — pricing 23 new listings...' },
  { t: '', l: '' },
  { t: 'prompt', l: 'sierra status --all-agents' },
  { t: '', l: '' },
  { t: '', l: '  AGENT          STATUS    LOAD    TASKS' },
  { t: '', l: '  ─────────────  ────────  ──────  ─────────' },
  { t: 'green', l: '  Sierra Bot      Online    94%     1,203' },
  { t: 'green', l: '  Leila/Lola      Online    87%     889' },
  { t: 'green', l: '  Stage-9 Closer  Online    71%     421' },
  { t: 'green', l: '  Scraper         Running   55%     2,847' },
  { t: 'blue', l: '  The Scribe      Idle      12%     4,821' },
  { t: 'green', l: '  The Curator     Online    68%     3,102' },
  { t: '', l: '' },
  { t: 'dim', l: 'Last sync: 2026-06-03 · All systems nominal' },
];

const QUICK_ACTIONS = [
  { l: 'Deploy Frontend', c: '🚀' },
  { l: 'Sync Firestore', c: '🔄' },
  { l: 'Run All Agents', c: '🤖' },
  { l: 'Backup Database', c: '💾' },
  { l: 'Clear Cache', c: '🧹' },
  { l: 'Test Webhooks', c: '⚡' },
];

function lineClass(t: string) {
  if (t === 'dim') return 'os-term-dim';
  if (t === 'green') return 'os-term-green';
  if (t === 'red') return 'os-term-red';
  if (t === 'blue') return 'os-term-blue';
  if (t === 'prompt') return 'os-term-prompt';
  return '';
}

export function OpenClawPage() {
  const [logs, setLogs] = useState<LogLine[]>(BOOT_LOGS);
  const [cmd, setCmd] = useState('');
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [logs]);

  const runCmd = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    const c = cmd.trim();
    if (!c) return;
    const newLogs: LogLine[] = [...logs, { t: 'prompt', l: c }];
    if (c === 'clear') { setLogs([]); setCmd(''); return; }
    if (c.includes('status')) newLogs.push({ t: 'green', l: '[✓] All 6 agents operational · Last check: now' });
    else if (c.includes('sync')) newLogs.push(
      { t: 'blue', l: '[~] Triggering full sync across all Firestore collections...' },
      { t: 'green', l: '[✓] Sync complete · 1,547 listings updated' }
    );
    else if (c.includes('leads')) newLogs.push({ t: '', l: '  Active leads: 284 · Hot leads: 3 · Today: +8' });
    else if (c.includes('help')) newLogs.push({ t: 'dim', l: 'Commands: status · sync · leads · agents · deploy · clear' });
    else newLogs.push({ t: 'red', l: `[!] Unknown command: ${c}. Type 'help' for available commands.` });
    setLogs(newLogs);
    setCmd('');
  };

  return (
    <div className="os-page">
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className="os-btn os-btn-ghost" onClick={() => setLogs(BOOT_LOGS)}>↻ Reset</button>
        <button className="os-btn os-btn-gold" onClick={() => setLogs(l => [...l,
          { t: 'blue', l: '[~] Connecting to Sierra Estates Cloud API...' },
          { t: 'green', l: '[✓] Connection established · API v2.4 ready' }
        ])}>⚡ Test API</button>
      </div>

      <div className="os-card" style={{ marginBottom: 14 }}>
        <div className="os-card-hd">
          <span className="os-card-title">⚙️ OpenClaw · Sierra Intelligence Terminal</span>
          <span className="os-chip os-chip-green"><span className="os-pulse-dot">●</span> Connected</span>
        </div>
        <div ref={termRef} className="os-terminal" style={{ height: 380, margin: '0 14px 14px' }}>
          {logs.map((ln, i) => (
            <div key={i} className={`os-term-line ${lineClass(ln.t)}`}>{ln.l}</div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <span style={{ color: '#C8961A' }}>sierra@intel:~$</span>
            <input
              value={cmd}
              onChange={e => setCmd(e.target.value)}
              onKeyDown={runCmd}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#E9C176' }}
              placeholder="Type a command…"
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
        {QUICK_ACTIONS.map((a, i) => (
          <button key={i} className="os-btn os-btn-ghost" style={{ flexDirection: 'column', height: 56, justifyContent: 'center', gap: 4 }}
            onClick={() => setLogs(l => [...l,
              { t: 'blue', l: `[~] Running: ${a.l}...` },
              { t: 'green', l: `[✓] ${a.l} completed successfully` }
            ])}>
            <span style={{ fontSize: 18 }}>{a.c}</span>
            <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono,monospace', letterSpacing: '.1em' }}>{a.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
