import { describe, it, expect } from 'vitest';
import { t } from '../i18n';

describe('i18n', () => {
  it('returns English string by key', () => {
    expect(t('SAVE_TO_CONTACTS', 'en')).toBe('SAVE TO CONTACTS');
  });
  it('returns Arabic string by key', () => {
    expect(t('SAVE_TO_CONTACTS', 'ar')).toBe('احفظ في جهات الاتصال');
  });
  it('returns key itself if missing', () => {
    expect(t('NON_EXISTENT_KEY' as never, 'en')).toBe('NON_EXISTENT_KEY');
  });
});
