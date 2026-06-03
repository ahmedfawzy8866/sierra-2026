'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/I18nContext';
import { motion } from 'framer-motion';
import JobCard from '@/components/UI/JobCard';

const COPY = {
  en: {
    dir: 'ltr' as const,
    pageTitle: 'Join Our Team | Sierra Blu',
    tagline: 'Now Hiring',
    heroH: 'Build the Future of Real Estate',
    heroSub: 'Sierra Blu is looking for talented individuals passionate about excellence, intelligence, and transforming the property market.',
    openingsH: 'Open Positions',
    openings: [
      { title: 'Senior Property Advisor', location: 'Cairo', type: 'Full-time', desc: 'Lead client relationships and deliver premium advisory services across our portfolio.' },
      { title: 'AI/Data Analyst', location: 'Remote', type: 'Full-time', desc: 'Build market intelligence systems and predictive models for property insights.' },
      { title: 'Content & Marketing Manager', location: 'Cairo', type: 'Full-time', desc: 'Shape our brand voice and create compelling market narratives.' },
      { title: 'Operations Specialist', location: 'Cairo', type: 'Full-time', desc: 'Optimize our internal workflows and client experience processes.' },
    ],
    culturH: 'Why Join Sierra Blu?',
    culture: [
      'Work at the intersection of technology and luxury real estate',
      'Collaborate with a small, elite team pushing boundaries',
      'Access to continuous learning and professional development',
      'Competitive compensation and performance incentives',
      'Flexible work arrangements for top talent',
    ],
    applyBtnText: 'Apply Now',
  },
  ar: {
    dir: 'rtl' as const,
    pageTitle: 'انضم إلى فريقنا | سييرا بلو',
    tagline: 'وظائف شاغرة حالياً',
    heroH: 'ابنِ مستقبل العقارات',
    heroSub: 'تبحث سييرا بلو عن أفراد موهوبين متحمسين للتفوق والذكاء وتحويل سوق العقارات.',
    openingsH: 'الوظائف الشاغرة',
    openings: [
      { title: 'مستشار عقاري أول', location: 'القاهرة', type: 'دوام كامل', desc: 'قيادة علاقات العملاء وتقديم خدمات استشارية مميزة عبر محفظتنا.' },
      { title: 'محلل ذكاء اصطناعي/بيانات', location: 'عن بعد', type: 'دوام كامل', desc: 'بناء أنظمة ذكاء السوق والنماذج التنبؤية لرؤى العقارات.' },
      { title: 'مدير المحتوى والتسويق', location: 'القاهرة', type: 'دوام كامل', desc: 'صياغة صوت علامتنا التجارية وإنشاء سرديات سوق جذابة.' },
      { title: 'متخصص العمليات', location: 'القاهرة', type: 'دوام كامل', desc: 'تحسين سير عملنا الداخلي وعمليات تجربة العميل.' },
    ],
    culturH: 'لماذا تنضم إلى سييرا بلو؟',
    culture: [
      'العمل في تقاطع التكنولوجيا والعقارات الفاخرة',
      'التعاون مع فريق صغير نخبوي يدفع الحدود',
      'الوصول إلى التعلم المستمر والتطوير المهني',
      'تعويضات تنافسية وحوافز الأداء',
      'ترتيبات العمل المرنة للمواهب المتميزة',
    ],
    applyBtnText: 'تقديم الآن',
  },
};

export default function CareersPage() {
  const { locale } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lang = locale === 'ar' ? 'ar' : 'en';
  const T = COPY[lang];
  const isAr = lang === 'ar';

  useEffect(() => {
    document.title = T.pageTitle;
  }, [T.pageTitle]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-navy text-ivory flex items-center justify-center" dir={T.dir}>
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-gold/25" />
          <div className="absolute w-12 h-12 rounded-full border-2 border-transparent border-t-gold animate-spin" />
          <span className="sr-only">{isAr ? 'جارٍ التحميل' : 'Loading'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-ivory" dir={T.dir}>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden py-24 border-b border-white/5">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(43,90,158,0.15),transparent)] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-[11px] font-mono tracking-[0.3em] text-gold uppercase px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5"
          >
            {T.tagline}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-light tracking-tight leading-tight text-white"
          >
            {T.heroH}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`max-w-2xl mx-auto text-base text-ivory/70 leading-relaxed font-ui ${isAr ? 'font-arabic' : ''}`}
          >
            {T.heroSub}
          </motion.p>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24 max-w-5xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-display text-3xl md:text-4xl font-light text-white">
            {T.openingsH}
          </h2>
          <div className="w-12 h-0.5 bg-gold/50 mx-auto" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {T.openings.map((job, idx) => (
            <JobCard
              key={idx}
              title={job.title}
              location={job.location}
              type={job.type}
              desc={job.desc}
              isAr={isAr}
              applyText={T.applyBtnText}
            />
          ))}
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-24 bg-navy-deep/20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-2">
            <h2 className="font-display text-3xl md:text-4xl font-light text-white">
              {T.culturH}
            </h2>
            <div className="w-12 h-0.5 bg-gold/50 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {T.culture.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`flex gap-4 items-start ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}
              >
                <div className="shrink-0 w-6 h-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-mono text-xs mt-0.5">
                  {idx + 1}
                </div>
                <p className={`text-sm text-ivory/80 leading-relaxed font-ui ${isAr ? 'font-arabic' : ''}`}>
                  {benefit}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
