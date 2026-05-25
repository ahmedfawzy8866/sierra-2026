'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SystemKitPage() {
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-surface text-on-surface p-8 md:p-16">
      <header className="mb-16 border-b border-outline-variant pb-8">
        <hgroup>
          <h1 className="display-lg text-primary">System Kit V13.0</h1>
          <p className="text-on-surface-variant font-light mt-2">Palpable & Interactive Content Showcase</p>
        </hgroup>
      </header>

      <main className="max-w-5xl mx-auto space-y-24">
        
        {/* ══ Text Level Semantics ══ */}
        <section>
          <h2 className="headline-sm text-secondary mb-8">Text-Level Semantics</h2>
          <div className="bg-surface-container-low p-8 rounded-xl shadow-ambient space-y-6">
            <p>This is a standard paragraph containing <b>bold</b> text, <i>italicized</i> text, and <u>underlined</u> text.</p>
            <p>Here is some <mark className="bg-secondary/20 text-secondary px-1 rounded">highlighted</mark> text, <del className="text-on-surface-variant">deleted text</del>, and <ins className="text-primary underline">inserted text</ins>.</p>
            <p>
              We also support <code>inline code</code>, keyboard input like <kbd className="border border-outline-variant px-1 rounded bg-surface-container-lowest">Ctrl</kbd> + <kbd className="border border-outline-variant px-1 rounded bg-surface-container-lowest">C</kbd>, 
              and variables like <var className="italic text-primary">x</var> = <var className="italic text-primary">y</var><sup>2</sup> + <var className="italic text-primary">z</var><sub>1</sub>.
            </p>
            <p>
              <small className="text-xs text-on-surface-variant">This is small print, usually used for legal disclaimers.</small>
            </p>
            <p>
              An abbreviation: <abbr title="Sierra Blu Realty" className="underline decoration-dotted cursor-help">SBR</abbr>. 
              A citation: <cite>The Architecture of Light</cite>. 
              A short quote: <q>Beyond Brokerage.</q>
            </p>
            <p>
              Data element: <data value="10000000">10 Million EGP</data>. 
              Time element: <time dateTime="2026-05-04 14:00">May 4, 2026, 2:00 PM</time>.
            </p>
            <p>
              Directional isolation: <bdi>User الإدارة</bdi>. 
              Directional override: <bdo dir="rtl">This text will go right-to-left.</bdo>
            </p>
            <p>
              Ruby annotations: <ruby>漢<rt>kan</rt>字<rt>ji</rt></ruby>
            </p>
            <p>
              Sample output: <samp className="font-mono bg-surface-container-lowest p-1">Status: Optimum</samp>
            </p>
          </div>
        </section>

        {/* ══ Grouping Content ══ */}
        <section>
          <h2 className="headline-sm text-secondary mb-8">Grouping Content</h2>
          <div className="bg-surface-container-low p-8 rounded-xl shadow-ambient space-y-8">
            <blockquote className="border-l-2 border-secondary pl-6 italic text-lg text-on-surface-variant">
              "True luxury is not about excess. It is about the complete absence of friction."
              <footer className="text-sm mt-2 text-primary font-bold">— Sierra Blu Intelligence</footer>
            </blockquote>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="label-sm mb-4">Unordered List</h3>
                <ul className="list-disc list-inside space-y-2 text-on-surface-variant">
                  <li>Market Analysis</li>
                  <li>Yield Optimization</li>
                  <li>Asset Acquisition</li>
                </ul>
              </div>
              <div>
                <h3 className="label-sm mb-4">Ordered List</h3>
                <ol className="list-decimal list-inside space-y-2 text-on-surface-variant">
                  <li>Initialize Request</li>
                  <li>Verify Intelligence</li>
                  <li>Execute Protocol</li>
                </ol>
              </div>
            </div>

            <div>
              <h3 className="label-sm mb-4">Description List</h3>
              <dl className="grid grid-cols-[150px_1fr] gap-4">
                <dt className="font-bold text-primary">ROI</dt>
                <dd className="text-on-surface-variant">Return on Investment. The ratio between net profit and cost of investment.</dd>
                <dt className="font-bold text-primary">Yield</dt>
                <dd className="text-on-surface-variant">The earnings generated and realized on an investment over a particular period of time.</dd>
              </dl>
            </div>

            <hr className="border-outline-variant" />

            <pre className="bg-surface-container-lowest p-4 rounded border border-outline-variant overflow-x-auto text-sm font-mono">
{`function calculateYield(rent, price) {
  return (rent * 12) / price;
}`}
            </pre>

            <figure className="bg-surface-container-lowest p-4 rounded border border-outline-variant">
              <div className="aspect-video bg-surface-container-high rounded flex items-center justify-center text-on-surface-variant">
                [Placeholder for Media]
              </div>
              <figcaption className="text-xs text-center mt-3 text-on-surface-variant">Fig 1. Market Velocity Visualization</figcaption>
            </figure>
          </div>
        </section>

        {/* ══ Interactive & Form Content ══ */}
        <section>
          <h2 className="headline-sm text-secondary mb-8">Interactive & Forms</h2>
          <div className="bg-surface-container-low p-8 rounded-xl shadow-ambient space-y-8">
            
            <details className="bg-surface-container-lowest border border-outline-variant rounded p-4 group cursor-pointer">
              <summary className="font-bold text-primary list-none flex justify-between items-center">
                Review Acquisition Terms
                <span className="text-secondary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="pt-4 mt-4 border-t border-outline-variant text-on-surface-variant text-sm">
                By proceeding, you agree to the Sierra Blu bespoke intelligence terms of service.
              </div>
            </details>

            <form className="space-y-6 max-w-md" onSubmit={(e) => e.preventDefault()}>
              <fieldset className="border border-outline-variant p-6 rounded">
                <legend className="label-sm px-2 text-secondary">Client Profile</legend>
                
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-bold text-primary">Full Name</label>
                    <input id="name" type="text" className="bg-surface-container-highest border border-outline-variant rounded p-3 outline-none focus:border-secondary transition-all" placeholder="Enter your name" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="asset" className="text-sm font-bold text-primary">Asset Type</label>
                    <select id="asset" className="bg-surface-container-highest border border-outline-variant rounded p-3 outline-none focus:border-secondary transition-all">
                      <option>Signature Villa</option>
                      <option>Penthouse</option>
                      <option>Boutique Office</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="notes" className="text-sm font-bold text-primary">Strategic Notes</label>
                    <textarea id="notes" rows={3} className="bg-surface-container-highest border border-outline-variant rounded p-3 outline-none focus:border-secondary transition-all" placeholder="Any specific requirements..."></textarea>
                  </div>
                </div>
              </fieldset>

              <div className="flex gap-4 items-center">
                <button type="submit" className="bg-primary text-on-primary px-6 py-3 rounded font-bold text-xs tracking-[0.15em] uppercase hover:bg-primary-container transition-all">
                  Submit Profile
                </button>
                <button type="reset" className="bg-transparent border border-outline-variant text-on-surface-variant px-6 py-3 rounded font-bold text-xs tracking-[0.15em] uppercase hover:border-secondary transition-all">
                  Reset
                </button>
              </div>
            </form>

            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Synchronization Progress</label>
              <progress value={65} max={100} className="w-full h-2 rounded overflow-hidden bg-outline-variant [&::-webkit-progress-value]:bg-secondary [&::-webkit-progress-bar]:bg-outline-variant"></progress>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Market Velocity Meter</label>
              <meter value={0.8} min={0} max={1} low={0.3} high={0.7} optimum={0.9} className="w-full h-4 rounded overflow-hidden"></meter>
            </div>

            <menu className="flex gap-2 p-0 m-0">
              <li><button className="bg-surface-container-highest px-4 py-2 rounded text-sm hover:bg-secondary/10 hover:text-secondary transition-colors">Action 1</button></li>
              <li><button className="bg-surface-container-highest px-4 py-2 rounded text-sm hover:bg-secondary/10 hover:text-secondary transition-colors">Action 2</button></li>
            </menu>

          </div>
        </section>

        {/* ══ Embedded Content ══ */}
        <section>
          <h2 className="headline-sm text-secondary mb-8">Embedded Content</h2>
          <div className="bg-surface-container-low p-8 rounded-xl shadow-ambient space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="label-sm mb-4">Picture / Img</h3>
                <picture>
                  <source srcSet="/villa.png" media="(min-width: 800px)" />
                  <img src="/penthouse.png" alt="Property Example" className="rounded-lg shadow-ambient w-full aspect-video object-cover" />
                </picture>
              </div>
              
              <div>
                <h3 className="label-sm mb-4">Canvas / SVG</h3>
                <div className="flex gap-4">
                  <canvas width="100" height="100" className="bg-surface-container-highest rounded"></canvas>
                  <svg width="100" height="100" className="bg-surface-container-highest rounded">
                    <circle cx="50" cy="50" r="30" fill="var(--secondary)" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <h3 className="label-sm mb-4">Iframe</h3>
              <iframe src="about:blank" className="w-full h-32 bg-surface-container-highest border border-outline-variant rounded" title="Example Iframe"></iframe>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="label-sm mb-4">Video</h3>
                <video controls className="w-full rounded bg-black aspect-video">
                  <source src="about:blank" type="video/mp4" />
                </video>
              </div>
              <div>
                <h3 className="label-sm mb-4">Audio</h3>
                <audio controls className="w-full">
                  <source src="about:blank" type="audio/mpeg" />
                </audio>
              </div>
            </div>

          </div>
        </section>

        {/* ══ Sectioning Roots ══ */}
        <section>
          <h2 className="headline-sm text-secondary mb-8">Sectioning & Roots</h2>
          <div className="bg-surface-container-low p-8 rounded-xl shadow-ambient">
            <article className="prose prose-sm md:prose-base prose-invert max-w-none">
              <header className="mb-6">
                <h1 className="text-2xl text-primary font-bold">Article Header</h1>
                <address className="not-italic text-sm text-on-surface-variant">Written by Sierra AI<br/>Fifth Settlement, Cairo</address>
              </header>
              <p className="text-on-surface-variant">This represents an independent, self-contained piece of content within the document.</p>
              <aside className="my-6 p-4 border-l-2 border-secondary bg-surface-container-lowest text-sm">
                This is an aside, typically used for related but tangential information.
              </aside>
            </article>
          </div>
        </section>

      </main>
    </div>
  );
}
