import Link from 'next/link';
import { Suspense } from 'react';
import { logoutAction } from './logout/actions';
import { Toast } from '@/components/admin/Toast';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header
        className="fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-4 z-50"
        style={{ borderBottomColor: 'rgba(104,106,108,0.25)' }}
      >
        <Link href="/admin" className="text-[12px] font-semibold uppercase tracking-wider-15 text-ink">Admin</Link>
        <form action={logoutAction}>
          <button type="submit" className="text-[12px] uppercase tracking-[0.12em]" style={{ color: '#686A6C' }}>
            Sign out
          </button>
        </form>
      </header>
      <main className="pt-24 pb-16 px-4 max-w-3xl mx-auto">
        <Suspense fallback={null}><Toast /></Suspense>
        {children}
      </main>
    </div>
  );
}
