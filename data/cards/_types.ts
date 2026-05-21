import type { Locale } from '@/lib/i18n';

export type Template = 'lux' | 'force';
export type Brand = 'force-ai' | 'force-media';

export interface CardContact {
  phone?: string;
  phoneDisplay?: string;
  whatsapp?: string;
  emails: string[];
  websites?: string[];
}

export interface CardSocials {
  instagram?: string;
  linkedin?: string;
  x?: string;
  github?: string;
  youtube?: string;
  tiktok?: string;
}

export interface CardI18n {
  name: string;
  title: string;
}

export interface Card {
  slug: string;
  template: Template;
  brand?: Brand;
  defaultLocale: Locale;
  en: CardI18n;
  ar: CardI18n;
  photo: string;
  contact: CardContact;
  socials: CardSocials;
  copyrightYear: number;
}
