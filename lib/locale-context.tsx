'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Locale } from './i18n';

type Ctx = { locale: Locale; setLocale: (l: Locale) => void };
const LocaleCtx = createContext<Ctx | null>(null);

export function LocaleProvider({ initial, children }: { initial: Locale; children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initial);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir  = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  return <LocaleCtx.Provider value={{ locale, setLocale: setLocaleState }}>{children}</LocaleCtx.Provider>;
}

export function useLocale(): Ctx {
  const ctx = useContext(LocaleCtx);
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider');
  return ctx;
}
