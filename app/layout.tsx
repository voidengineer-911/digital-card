import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const gotham = localFont({
  src: [
    { path: './fonts/Gotham-Light.otf',  weight: '300', style: 'normal' },
    { path: './fonts/Gotham-Book.otf',   weight: '400', style: 'normal' },
    { path: './fonts/Gotham-Medium.otf', weight: '500', style: 'normal' },
    { path: './fonts/Gotham-Bold.otf',   weight: '700', style: 'normal' },
  ],
  variable: '--next-font-sans',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

const tharwat = localFont({
  src: './fonts/TharwatEmaraRuqaa.ttf',
  variable: '--next-font-arabic',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.invalid'),
  title: { default: 'Digital Card', template: '%s — Digital Card' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${gotham.variable} ${tharwat.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
