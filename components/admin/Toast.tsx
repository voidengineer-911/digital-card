'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function Toast() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const status = sp.get('status');
  const [visible, setVisible] = useState(!!status);

  useEffect(() => {
    if (!status) return;
    setVisible(true);
    const id = setTimeout(() => {
      setVisible(false);
      router.replace(pathname, { scroll: false });
    }, 2000);
    return () => clearTimeout(id);
  }, [status, router, pathname]);

  if (!visible || !status) return null;
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 h-12 px-6 rounded-pill bg-ink text-white text-[13px] uppercase tracking-[0.08em] flex items-center z-50">
      {status === 'saved' ? 'Saved ✓' : status === 'deleted' ? 'Deleted' : status === 'created' ? 'Created' : status}
    </div>
  );
}
