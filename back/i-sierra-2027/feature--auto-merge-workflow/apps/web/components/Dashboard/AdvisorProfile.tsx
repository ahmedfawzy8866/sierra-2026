"use client";
import React from 'react';
import { useI18n } from '@/lib/I18nContext';

interface AdvisorProfileProps {
  advisor: {
    id: string;
    name: string;
    role: string;
    revenue: string;
    deals: number;
    initials: string;
    color: string;
  };
  onBack: () => void;
}

export default function AdvisorProfile({ advisor, onBack }: AdvisorProfileProps) {
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  return (
    <div className="advisor-profile animate-fade-in-up">
      <button onClick={onBack} className="btn btn-ghost btn-sm mb-6 flex items-center gap-2">
        {isAr ? '← العودة للقائمة' : '← Back to Executive Fleet'}
      </button>

      <div className="profile-header glass-panel p-8 mb-8 flex border-l-4" style={{ borderColor: advisor.color }}>
        <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '30px', background: advisor.color, marginRight: isAr ? 0 : '24px', marginLeft: isAr ? '24px' : 0 }}>
          {advisor.initials}
        </div>
        <div className="flex-1">
          <h1 className="serif text-4xl mb-1">{advisor.name}</h1>
          <div className="text-gold uppercase tracking-widest text-xs font-bold mb-4">{advisor.role}</div>
          <div className="flex gap-8">
            <div>
              <div className="text-[10px] opacity-40 uppercase font-bold">{isAr ? 'إجمالي المبيعات' : 'Total Liquidation'}</div>
              <div className="text-2xl font-mono">EGP {advisor.revenue}</div>
            </div>
            <div>
              <div className="text-[10px] opacity-40 uppercase font-bold">{isAr ? 'عدد الصفقات' : 'Assets Transacted'}</div>
              <div className="text-2xl">{advisor.deals}</div>
            </div>
            <div>
              <div className="text-[10px] opacity-40 uppercase font-bold">{isAr ? 'معدل النجاح' : 'Success Probability'}</div>
              <div className="text-2xl text-emerald-400">94%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <div className="glass-panel p-6">
            <h3 className="serif text-xl mb-4 border-b border-white/5 pb-2 text-gold">
              {isAr ? 'المتابعة الاستراتيجية' : 'Strategic Roadmap'}
            </h3>
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-gold"></div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{isAr ? `هدف ربع سنوي ${i}` : `Quarterly Target Objective ${i}`}</div>
                    <div className="text-xs opacity-50">{isAr ? 'توسيع المحفظة في المناطق الحيوية' : 'Expanding portfolio footprint in core strategic districts.'}</div>
                  </div>
                  <div className="text-xs font-mono">{70 + i*5}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="serif text-xl mb-4 border-b border-white/5 pb-2 text-gold">
              {isAr ? 'الأصول قيد التنفيذ' : 'Active Pipeline Assets'}
            </h3>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="opacity-40 uppercase text-[10px] font-bold">
                  <th className="pb-3">{isAr ? 'الأصل' : 'Asset'}</th>
                  <th className="pb-3">{isAr ? 'القيمة' : 'Valuation'}</th>
                  <th className="pb-3">{isAr ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="opacity-80">
                <tr><td className="py-2">Mivida Sky Residence</td><td className="py-2">8.5M</td><td className="py-2 italic text-gold">Final Stage</td></tr>
                <tr><td className="py-2">Marassi Greek Village</td><td className="py-2">12.0M</td><td className="py-2 italic">Consultation</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-panel p-6">
             <h3 className="serif text-xl mb-4 text-gold">{isAr ? 'الأداء المالي' : 'Advisor Yield'}</h3>
             <div className="w-full h-24 bg-gradient-to-t from-gold/5 to-transparent border-b-2 border-gold relative overflow-hidden">
                <svg className="absolute bottom-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,20 Q25,5 50,15 T100,5" fill="none" stroke="var(--gold)" strokeWidth="1" />
                </svg>
             </div>
             <p className="text-[10px] opacity-40 mt-4 leading-tight uppercase font-bold tracking-tighter">Yield variance against regional benchmarks: <span className="text-emerald-400">+12.4%</span></p>
          </div>

          <div className="glass-panel p-6 bg-gold/5 border-gold/20">
            <h3 className="serif text-lg mb-2 text-gold">{isAr ? 'أدوات الوصول' : 'Executive Controls'}</h3>
            <div className="flex flex-col gap-2">
              <button className="btn btn-sm btn-outline">{isAr ? 'تعديل الصلاحيات' : 'Revise Permissions'}</button>
              <button className="btn btn-sm btn-outline">{isAr ? 'سجل المكالمات' : 'Communication Logs'}</button>
              <button className="btn btn-sm btn-ghost text-red-400">{isAr ? 'تعليق الوصول' : 'Suspend Protocols'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
