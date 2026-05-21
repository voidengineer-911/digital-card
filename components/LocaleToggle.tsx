'use client';
import { useLocale } from '@/lib/locale-context';

type Props = { activeColor?: string; inactiveColor?: string };

export function LocaleToggle({ activeColor = '#0A0A0B', inactiveColor = '#686A6C' }: Props) {
  const { locale, setLocale } = useLocale();

  const cell = (l: 'en' | 'ar') => (
    <button
      key={l}
      type="button"
      onClick={() => setLocale(l)}
      data-active={locale === l}
      className="text-[12px] font-medium uppercase tracking-[0.1em] transition-colors"
      style={{ color: locale === l ? activeColor : inactiveColor }}
      aria-label={l === 'en' ? 'Switch to English' : 'Switch to Arabic'}
    >
      {l.toUpperCase()}
    </button>
  );

  return (
    <div className="flex items-center gap-2">
      {cell('en')}
      <span style={{ color: inactiveColor }}>|</span>
      {cell('ar')}
    </div>
  );
}
