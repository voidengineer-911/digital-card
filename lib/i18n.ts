export type Locale = 'en' | 'ar';

const STRINGS = {
  SAVE_TO_CONTACTS: { en: 'SAVE TO CONTACTS',  ar: 'احفظ في جهات الاتصال' },
  CALL:             { en: 'Call',              ar: 'اتصال' },
  WHATSAPP:         { en: 'WhatsApp',          ar: 'واتساب' },
  SEND_SMS:         { en: 'Send SMS',          ar: 'رسالة نصية' },
  SHARE:            { en: 'SHARE',             ar: 'مشاركة' },
  QR_CODE:          { en: 'QR CODE',           ar: 'رمز QR' },
  POWERED_BY_FORCE_AI: { en: 'POWERED BY FORCE AI', ar: 'مدعوم بواسطة فورس إيه آي' },
  CLOSE:            { en: 'Close',             ar: 'إغلاق' },
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(key: StringKey, locale: Locale): string {
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[locale];
}
