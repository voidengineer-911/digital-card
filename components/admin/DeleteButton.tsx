'use client';
import { useState } from 'react';
import { useFormStatus } from 'react-dom';

type Props = { action: () => Promise<void>; slug: string };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-10 px-5 rounded-pill bg-[#b00020] text-white text-[12px] uppercase tracking-[0.12em] disabled:opacity-50"
    >{pending ? 'Deleting…' : 'Confirm delete'}</button>
  );
}

export function DeleteButton({ action, slug }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-10 px-5 rounded-pill border border-[#b00020] text-[#b00020] text-[12px] uppercase tracking-[0.12em]"
      >Delete</button>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setOpen(false)}>
          <div className="bg-white p-6 rounded-[12px] flex flex-col items-center gap-4 max-w-sm" onClick={(e) => e.stopPropagation()}>
            <p className="text-[14px] text-ink text-center">Delete <span className="font-semibold">/{slug}</span>? This is permanent.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setOpen(false)} className="h-10 px-5 rounded-pill border border-ink text-ink text-[12px] uppercase tracking-[0.12em]">Cancel</button>
              <form action={action}><Submit /></form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
