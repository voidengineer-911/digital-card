import { describe, it, expect } from 'vitest';
import { cardInputSchema } from '../admin-schemas';

const valid = {
  slug: 'jane',
  template: 'lux' as const,
  brand: null,
  defaultLocale: 'en' as const,
  enName: 'Jane Doe', enTitle: 'Engineer',
  arName: 'جين دو',  arTitle: 'مهندسة',
  photoUrl: 'https://x.public.blob.vercel-storage.com/photos/jane.jpg',
  phone: '+1234567890', phoneDisplay: '+1 234 567 890', whatsapp: '+1234567890',
  emails: ['jane@example.com'], websites: ['example.com'],
  instagram: null, linkedin: 'jane', x: null, github: null, youtube: null, tiktok: null,
  copyrightYear: 2026,
};

describe('cardInputSchema', () => {
  it('accepts a valid input', () => {
    expect(cardInputSchema.parse(valid)).toBeTruthy();
  });
  it('rejects slug with spaces', () => {
    expect(() => cardInputSchema.parse({ ...valid, slug: 'jane doe' })).toThrow();
  });
  it('rejects slug with uppercase', () => {
    expect(() => cardInputSchema.parse({ ...valid, slug: 'Jane' })).toThrow();
  });
  it('requires force template to have a brand', () => {
    expect(() => cardInputSchema.parse({ ...valid, template: 'force', brand: null })).toThrow();
  });
  it('rejects lux template with a brand set', () => {
    expect(() => cardInputSchema.parse({ ...valid, template: 'lux', brand: 'force-ai' })).toThrow();
  });
  it('rejects invalid email', () => {
    expect(() => cardInputSchema.parse({ ...valid, emails: ['not-an-email'] })).toThrow();
  });
  it('rejects empty enName', () => {
    expect(() => cardInputSchema.parse({ ...valid, enName: '' })).toThrow();
  });
});
