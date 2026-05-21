export type Locale = 'en' | 'ar';

const STRINGS = {
  SAVE_TO_CONTACTS: { en: 'SAVE TO CONTACTS',  ar: 'احفظ في جهات الاتصال' },
  CALL:             { en: 'Call',              ar: 'اتصال' },
  WHATSAPP:         { en: 'WhatsApp',          ar: 'واتساب' },
  SEND_SMS:         { en: 'Send SMS',          ar: 'رسالة نصية' },
  SHARE:            { en: 'SHARE',             ar: 'مشاركة' },
  QR_CODE:          { en: 'QR CODE',           ar: 'رمز QR' },
  BY_FORCE_AI:      { en: 'BY FORCE AI',       ar: 'بواسطة فورس إيه آي' },
  BY_FORCE_MEDIA:   { en: 'BY FORCE MEDIA',    ar: 'بواسطة فورس ميديا' },
  CLOSE:            { en: 'Close',             ar: 'إغلاق' },
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(key: StringKey, locale: Locale): string {
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[locale];
}
