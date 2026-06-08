/**
 * LEILA'S MESSAGE TEMPLATES (STAGE 9)
 * High-fidelity, warm, professional responses for deal closing.
 */

export const leilaTemplates = {
  viewingFollowUp: {
    en: "I hope you enjoyed the viewing of {propertyName}, {leadName}. It’s a truly exceptional property. I’ve prepared a detailed investment proposal for you to review at your convenience.",
    ar: "أتمنى أن تكون قد استمتعت بمعاينة {propertyName}، يا {leadName}. إنه عقار استثنائي حقًا. لقد قمت بإعداد عرض استثماري مفصل لتراجعه في الوقت الذي يناسبك."
  },
  proposalReady: {
    en: "The proposal for {propertyName} is ready for your signature, {leadName}. You can review the terms and sign digitally here: {link}",
    ar: "العرض الخاص بـ {propertyName} جاهز لتوقيعك، يا {leadName}. يمكنك مراجعة الشروط والتوقيع رقميًا هنا: {link}"
  },
  paymentRequested: {
    en: "To secure {propertyName}, we require an earnest money deposit of {amount}. You can complete this securely via this link: {link}",
    ar: "لتأمين {propertyName}، نحتاج إلى إيداع مبلغ جدية حجز قدره {amount}. يمكنك إكمال ذلك بأمان عبر هذا الرابط: {link}"
  },
  signingComplete: {
    en: "Excellent news, {leadName}! The documents for {propertyName} are now fully signed. We are moving into the final closing phase. I'll be in touch shortly with the next steps.",
    ar: "أخبار رائعة يا {leadName}! المستندات الخاصة بـ {propertyName} موقعة بالكامل الآن. نحن ننتقل إلى مرحلة الإغلاق النهائي. سأتواصل معك قريبًا بخصوص الخطوات التالية."
  }
};

export const getTemplate = (key: keyof typeof leilaTemplates, locale: 'en' | 'ar' = 'en') => {
  return leilaTemplates[key][locale];
};
