import type { Metadata } from 'next';
import { Bodoni_Moda, Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const inter  = Inter({ subsets: ['latin'], variable: '--next-font-sans' });
const bodoni = Bodoni_Moda({ subsets: ['latin'], style: ['italic', 'normal'], variable: '--next-font-serif' });

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
    <html lang="en" dir="ltr" className={`${inter.variable} ${bodoni.variable} ${tharwat.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
