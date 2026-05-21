import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { JsonLdPerson } from '../JsonLd';
import type { Card } from '@/lib/types';

const ahmad: Card = {
  slug: 'ahmad',
  template: 'lux',
  defaultLocale: 'en',
  en: { name: 'Ahmad Sharaf', title: 'Founder and CEO · Force AI' },
  ar: { name: 'احمد شرف',    title: 'المؤسس والرئيس التنفيذي · فورس إيه آي' },
  photoUrl: 'https://ltxkjmimvtdyaxgl.public.blob.vercel-storage.com/photos/ahmad-1779386602668.jpg',
  contact: {
    phone: '+96541169141', phoneDisplay: '+965 4116 9141', whatsapp: '+96541169141',
    emails: ['ahmed0montaser@gmail.com'],
    websites: ['forcemediakw.com', 'force-ai.com', 'store.forcemediakw.com'],
  },
  socials: { linkedin: 'a7xq8', github: 'ForceAI-KW' },
  copyrightYear: 2026,
};

const ahmadFm: Card = {
  slug: 'ahmad-fm',
  template: 'force',
  brand: 'force-media',
  defaultLocale: 'en',
  en: { name: 'Ahmad Sharaf', title: 'Ops Manager & AI Engineer' },
  ar: { name: 'احمد شرف',    title: 'مدير العمليات ومهندس ذكاء اصطناعي' },
  photoUrl: 'https://ltxkjmimvtdyaxgl.public.blob.vercel-storage.com/photos/ahmad-1779386602668.jpg',
  contact: {
    phone: '+96541169141', phoneDisplay: '+965 4116 9141', whatsapp: '+96541169141',
    emails: ['ahmed0montaser@gmail.com'],
    websites: ['forcemediakw.com', 'store.forcemediakw.com'],
  },
  socials: { linkedin: 'a7xq8', github: 'ForceAI-KW' },
  copyrightYear: 2026,
};

function getPayload(container: HTMLElement): Record<string, unknown> {
  const s = container.querySelector('script[type="application/ld+json"]');
  if (!s) throw new Error('no JSON-LD script tag found');
  return JSON.parse(s.textContent ?? '{}');
}

describe('JsonLdPerson', () => {
  it('emits Person schema with name + jobTitle + worksFor', () => {
    const { container } = render(<JsonLdPerson card={ahmad} url="https://x.test/ahmad" />);
    const j = getPayload(container);
    expect(j['@context']).toBe('https://schema.org');
    expect(j['@type']).toBe('Person');
    expect(j.name).toBe('Ahmad Sharaf');
    expect(j.alternateName).toBe('احمد شرف');
    expect(j.jobTitle).toBe('Founder and CEO');
    expect((j.worksFor as Record<string, string>).name).toBe('Force AI');
    expect(j.email).toBe('ahmed0montaser@gmail.com');
    expect(j.telephone).toBe('+96541169141');
  });

  it('includes websites + linkedin + github in sameAs', () => {
    const { container } = render(<JsonLdPerson card={ahmad} url="https://x.test/ahmad" />);
    const j = getPayload(container);
    const sa = j.sameAs as string[];
    expect(sa).toContain('https://forcemediakw.com');
    expect(sa).toContain('https://force-ai.com');
    expect(sa).toContain('https://linkedin.com/in/a7xq8');
    expect(sa).toContain('https://github.com/ForceAI-KW');
  });

  it('handles Force Brand card with different role', () => {
    const { container } = render(<JsonLdPerson card={ahmadFm} url="https://x.test/ahmad-fm" />);
    const j = getPayload(container);
    expect(j.jobTitle).toBe('Ops Manager & AI Engineer');
    // ahmad-fm has no " · " separator → no worksFor entry
    expect(j.worksFor).toBeUndefined();
  });

  it('escapes `<` characters in the serialized JSON to prevent script breakout', () => {
    const { container } = render(<JsonLdPerson card={ahmad} url="https://x.test/<script>alert(1)</script>" />);
    const s = container.querySelector('script[type="application/ld+json"]');
    const raw = s?.innerHTML ?? '';
    expect(raw).not.toContain('</script>');
    expect(raw).toContain('\\u003c');
  });
});
