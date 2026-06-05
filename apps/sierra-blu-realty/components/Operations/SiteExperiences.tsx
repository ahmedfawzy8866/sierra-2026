"use client";
import React, { useState } from 'react';

interface Experience {
  id: string;
  title: string;
  type: 'virtual' | 'physical' | 'digital-twin';
  status: 'scheduled' | 'active' | 'archived';
  date: string;
  location: string;
  advisor: string;
}

const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: '1',
    title: 'Marassi Skyline Villa - Virtual Walkthrough',
    type: 'virtual',
    status: 'active',
    date: 'Wednesday, April 8 - 14:00',
    location: 'OpenClaw VR Studio',
    advisor: 'A. Fawzy'
  },
  {
    id: '2',
    title: 'New Capital Corporate Hub - Digital Twin Presentation',
    type: 'digital-twin',
    status: 'scheduled',
    date: 'Friday, April 10 - 10:30',
    location: 'Executive Boardroom',
    advisor: 'B. Mansour'
  }
];

export default function SiteExperiences() {
  const [experiences] = useState<Experience[]>(INITIAL_EXPERIENCES);

  return (
    <div className="experiences-screen animate-fade-in-up stagger-1">
      <div className="page-header mb-8">
        <h1 className="serif text-3xl mb-1 gold-underline">Site Experiences</h1>
        <p className="page-sub">Managing immersive property demonstrations and digital twin simulations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="card glass-panel relative overflow-hidden">
             <div className="card-header border-b border-white/5 bg-navy/20">
                <h2 className="serif text-xl">Command Schedule</h2>
                <button className="btn btn-gold btn-sm">+ New Experience</button>
             </div>
             
             <div className="card-body p-6 space-y-6">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className={`experience-card p-6 border border-white/5 bg-white/5 rounded-2xl hover:border-gold/30 hover:bg-white/10 transition-all cursor-pointer group animate-fade-in-up stagger-${(index % 4) + 1}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="badge badge-gold uppercase tracking-widest text-[9px] px-2.5 py-1">{exp.type.replace('-', ' ')}</div>
                      <div className={`badge ${exp.status === 'active' ? 'badge-success' : 'badge-navy'} uppercase tracking-widest text-[9px] px-2.5 py-1`}>
                        {exp.status}
                      </div>
                    </div>
                    <h3 className="text-xl serif group-hover:text-gold transition-colors mb-4">{exp.title}</h3>
                    
                    <div className="grid grid-cols-2 gap-6 text-xs mt-6 border-t border-white/10 pt-5">
                      <div>
                          <div className="font-bold text-white/40 uppercase tracking-tighter mb-1.5">Timing</div>
                          <div className="text-secondary font-medium">{exp.date}</div>
                      </div>
                      <div>
                          <div className="font-bold text-white/40 uppercase tracking-tighter mb-1.5">Command Hub</div>
                          <div className="text-secondary font-medium">{exp.location}</div>
                      </div>
                      <div>
                          <div className="font-bold text-white/40 uppercase tracking-tighter mb-1.5">Strategic Advisor</div>
                          <div className="text-secondary font-medium">{exp.advisor}</div>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="vr-command-center card glass-panel border-gold/20 flex flex-col items-center justify-center p-8 text-center min-h-[460px] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
              <div className="vr-icon-glow mb-8 text-gold">
                  <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
                    <path d="M22 12l-4-4v8l4-4zM2 18V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM6 12h4"/>
                    <path d="M8 10v4"/>
                    <circle cx="9" cy="12" r="6" strokeDasharray="2 2" />
                  </svg>
              </div>
              <h3 className="serif text-2xl mb-2 text-white">Immersive Hub</h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-6 font-bold">Smarter Decisions. AI-Driven.</p>
              <p className="text-secondary text-sm max-w-[280px] mb-8 leading-relaxed mx-auto">
                Execute direct neural links to high-fidelity property reconstructions for executive demonstrations.
              </p>
              
              <div className="w-full space-y-3 max-w-[240px] mx-auto">
                  <button className="btn btn-gold w-full py-4 text-[11px] font-bold shadow-gold tracking-widest">
                    INITIALIZE NEURAL LINK
                  </button>
                  <button className="btn btn-outline w-full py-4 text-[11px] font-bold border-white/10 hover:border-gold/50 tracking-widest">
                    SYNC TWIN ASSETS
                  </button>
              </div>

              <div className="mt-10 pt-6 border-t border-white/5 w-full">
                <div className="flex justify-around items-center opacity-40 text-[9px] uppercase tracking-widest font-bold">
                  <span>Latency: 4ms</span>
                  <span>Security: AES-256</span>
                </div>
              </div>
          </div>

          <div className="card glass-panel p-6 border-gold/10">
            <h3 className="serif text-lg mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold"></span>
              Experience Protocols
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2">Mastery Standard</div>
                <ul className="space-y-2 text-[11px] text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="text-gold">/</span> 10–15 Professional Captures
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">/</span> Mandatory Natural Daylight
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold">/</span> Zero CGI / Simulated Graphics
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-white/2 border border-dashed border-white/10">
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Brand Integrity</div>
                <p className="text-[10px] text-white/30 leading-tight">Gold reserved for accents. Logo proportions must remain absolute.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .vr-icon-glow { 
            filter: drop-shadow(0 0 20px rgba(200, 169, 110, 0.4));
            animation: pulse-glow 4s infinite ease-in-out;
        }
        @keyframes pulse-glow {
            0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
            50% { transform: scale(1.05) rotate(2deg); opacity: 1; filter: drop-shadow(0 0 35px rgba(200, 169, 110, 0.6)); }
            100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

