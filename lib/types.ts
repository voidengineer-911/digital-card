import type { Locale } from './i18n';

export type Template = 'lux' | 'force';
export type Brand = 'force-ai' | 'force-media';

export interface CardContact {
  phone?: string | null;
  phoneDisplay?: string | null;
  whatsapp?: string | null;
  emails: string[];
  websites?: string[];
}

export interface CardSocials {
  instagram?: string | null;
  linkedin?: string | null;
  x?: string | null;
  github?: string | null;
  youtube?: string | null;
  tiktok?: string | null;
}

export interface CardI18n {
  name: string;
  title: string;
}

export interface Card {
  slug: string;
  template: Template;
  brand?: Brand | null;
  defaultLocale: Locale;
  en: CardI18n;
  ar: CardI18n;
  photoUrl: string;
  contact: CardContact;
  socials: CardSocials;
  copyrightYear: number;
}

type PrismaCard = {
  slug: string;
  template: 'lux' | 'force';
  brand: 'force_ai' | 'force_media' | null;
  defaultLocale: 'en' | 'ar';
  enName: string; enTitle: string; arName: string; arTitle: string;
  photoUrl: string;
  phone: string | null; phoneDisplay: string | null; whatsapp: string | null;
  emails: string[]; websites: string[];
  instagram: string | null; linkedin: string | null; x: string | null; github: string | null; youtube: string | null; tiktok: string | null;
  copyrightYear: number;
};

export function fromPrisma(row: PrismaCard): Card {
  return {
    slug: row.slug,
    template: row.template,
    brand: row.brand === 'force_ai' ? 'force-ai' : row.brand === 'force_media' ? 'force-media' : null,
    defaultLocale: row.defaultLocale,
    en: { name: row.enName, title: row.enTitle },
    ar: { name: row.arName, title: row.arTitle },
    photoUrl: row.photoUrl,
    contact: {
      phone: row.phone, phoneDisplay: row.phoneDisplay, whatsapp: row.whatsapp,
      emails: row.emails, websites: row.websites,
    },
    socials: {
      instagram: row.instagram, linkedin: row.linkedin, x: row.x,
      github: row.github, youtube: row.youtube, tiktok: row.tiktok,
    },
    copyrightYear: row.copyrightYear,
  };
}
