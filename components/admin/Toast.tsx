'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function Toast() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const status = sp.get('status');
  // Track the last dismissed status to avoid re-showing after router.replace completes.
  const [dismissedStatus, setDismissedStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!status) return;
    const id = setTimeout(() => {
      setDismissedStatus(status);
      router.replace(pathname, { scroll: false });
    }, 2000);
    return () => clearTimeout(id);
  }, [status, router, pathname]);

  if (!status || status === dismissedStatus) return null;
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 h-12 px-6 rounded-pill bg-ink text-white text-[13px] uppercase tracking-[0.08em] flex items-center z-50">
      {status === 'saved' ? 'Saved ✓' : status === 'deleted' ? 'Deleted' : status === 'created' ? 'Created' : status}
    </div>
  );
}
