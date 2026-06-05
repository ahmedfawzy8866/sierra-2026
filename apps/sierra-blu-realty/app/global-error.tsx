'use client';

import React, { useEffect } from 'react';

/**
 * Global Error Boundary for Sierra Blu Realty
 * Optimized for Codex v4.0 Cinematic Aesthetics.
 * Provides a high-fidelity recovery node for systemic failures.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Systemic Anomaly Detected:', error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Strategic Anomaly | Sierra Blu Realty</title>
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            margin: 0;
            background-color: #0A1628;
            color: #F8FAFC;
            font-family: 'Inter', system-ui, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            overflow: hidden;
          }
          .recovery-hub {
            background: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(200, 169, 110, 0.2);
            padding: 60px;
            max-width: 700px;
            text-align: center;
            border-radius: 4px; /* Classic luxury sharp edges or slight rounding */
            position: relative;
            box-shadow: 0 40px 100px rgba(0,0,0,0.5);
          }
          .logo {
            font-size: 2rem;
            color: #C8A96E;
            margin-bottom: 2rem;
            border: 1px solid #C8A96E;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: auto;
            margin-right: auto;
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          }
          h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #C8A96E;
            letter-spacing: -0.02em;
          }
          .subtitle {
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.4em;
            color: #94A3B8;
            margin-bottom: 3rem;
            display: block;
          }
          .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            text-align: left;
            margin-bottom: 4rem;
          }
          .content-ar {
            text-align: right;
            direction: rtl;
          }
          p {
            color: #94A3B8;
            line-height: 1.6;
            font-size: 0.95rem;
          }
          .action-btn {
            background: none;
            border: 1px solid #C8A96E;
            color: #C8A96E;
            padding: 16px 40px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            font-size: 0.75rem;
            transition: all 0.3s ease;
          }
          .action-btn:hover {
            background: #C8A96E;
            color: #0A1628;
          }
          .id-badge {
            font-family: monospace;
            font-size: 0.7rem;
            color: #475569;
            margin-top: 2rem;
          }
        ` }} />
      </head>
      <body>
        <div className="recovery-hub">
          <div className="logo">SB</div>
          <span className="subtitle">Systemic Resilience Hub</span>
          <h1>Strategic Anomaly</h1>
          
          <div className="content-grid">
            <div className="content-en">
              <p>
                The intelligence relay has encountered an unexpected interruption. 
                Your session remains secure, but the architectural synchronization requires reinitialization.
              </p>
            </div>
          </div>

          <button className="action-btn" onClick={() => reset()}>
            Restore Integration
          </button>

          {error.digest && (
            <div className="id-badge">
              TRACE_ID: {error.digest}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
