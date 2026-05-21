import { describe, it, expect } from 'vitest';
import { buildVCard } from '../vcard';
import { ahmad } from '@/data/cards/ahmad';

describe('buildVCard', () => {
  it('emits VERSION 3.0', () => {
    expect(buildVCard(ahmad)).toContain('VERSION:3.0');
  });
  it('emits FN with English name', () => {
    expect(buildVCard(ahmad)).toContain('FN:Ahmad Sharaf');
  });
  it('emits N with family;given form', () => {
    expect(buildVCard(ahmad)).toMatch(/^N:Sharaf;Ahmad;;;$/m);
  });
  it('emits TEL with intl phone', () => {
    expect(buildVCard(ahmad)).toContain('TEL;TYPE=CELL,VOICE:+96541169141');
  });
  it('emits each EMAIL', () => {
    expect(buildVCard(ahmad)).toContain('EMAIL;TYPE=INTERNET:ahmed0montaser@gmail.com');
  });
  it('emits a URL line per website', () => {
    const v = buildVCard(ahmad);
    expect(v).toContain('URL:https://forcemediakw.com');
    expect(v).toContain('URL:https://force-ai.com');
    expect(v).toContain('URL:https://store.forcemediakw.com');
  });
  it('emits NOTE with bilingual name + title', () => {
    expect(buildVCard(ahmad)).toMatch(/NOTE:Ahmad Sharaf · احمد شرف/);
  });
  it('emits ORG and TITLE split from " · " separator', () => {
    const v = buildVCard(ahmad);
    expect(v).toContain('ORG:Force AI');
    expect(v).toContain('TITLE:Founder and CEO');
  });
  it('uses CRLF line endings', () => {
    expect(buildVCard(ahmad)).toContain('\r\n');
  });
  it('starts with BEGIN:VCARD and ends with END:VCARD', () => {
    const v = buildVCard(ahmad);
    expect(v.startsWith('BEGIN:VCARD\r\n')).toBe(true);
    expect(v.trimEnd().endsWith('END:VCARD')).toBe(true);
  });
});
