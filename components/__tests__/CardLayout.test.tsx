import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CardLayout } from '../CardLayout';
import type { Card } from '@/lib/types';

const ahmad: Card = {
  slug: 'ahmad',
  template: 'lux',
  defaultLocale: 'en',
  en: { name: 'Ahmad Sharaf', title: 'Founder and CEO · Force AI' },
  ar: { name: 'احمد شرف',    title: 'المؤسس والرئيس التنفيذي · فورس إيه آي' },
  photoUrl: 'https://example.invalid/p.jpg',
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
  photoUrl: 'https://example.invalid/p.jpg',
  contact: {
    phone: '+96541169141', phoneDisplay: '+965 4116 9141', whatsapp: '+96541169141',
    emails: ['ahmed0montaser@gmail.com'],
    websites: ['forcemediakw.com', 'store.forcemediakw.com'],
  },
  socials: { linkedin: 'a7xq8', github: 'ForceAI-KW' },
  copyrightYear: 2026,
};

describe('CardLayout', () => {
  it('renders Luxury layout for template=lux (white background)', () => {
    const { container } = render(<CardLayout card={ahmad} url="https://x/ahmad" />);
    expect(container.querySelector('.bg-white')).toBeTruthy();
  });
  it('renders Force layout for template=force (wine background)', () => {
    const { container } = render(<CardLayout card={ahmadFm} url="https://x/ahmad-fm" />);
    expect(container.querySelector('.bg-wine')).toBeTruthy();
  });
});
