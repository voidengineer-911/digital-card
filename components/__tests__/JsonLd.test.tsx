import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { JsonLdPerson } from '../JsonLd';
import { ahmad } from '@/data/cards/ahmad';
import { ahmadFm } from '@/data/cards/ahmad-fm';

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
