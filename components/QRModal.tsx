'use client';
import { useEffect, useRef, useState } from 'react';
import { ActionButton } from './ActionButton';
import type { Template } from '@/data/cards/_types';

type Props = { url: string; template: Template; label?: string };

function QRIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="3"  y="3"  width="7" height="7" stroke={color} strokeWidth="1.5" />
      <rect x="14" y="3"  width="7" height="7" stroke={color} strokeWidth="1.5" />
      <rect x="3"  y="14" width="7" height="7" stroke={color} strokeWidth="1.5" />
      <rect x="14" y="14" width="3" height="3" stroke={color} strokeWidth="1.5" />
      <rect x="18" y="18" width="3" height="3" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function CloseIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 6 L18 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 6 L6 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function QRModal({ url, template, label = 'QR CODE' }: Props) {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closeRef  = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // Capture the element that was focused before the modal opened, restore on close.
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => { prev?.focus?.(); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    let cancelled = false;
    import('qrcode').then((QR) => {
      if (cancelled || !canvasRef.current) return;
      QR.toCanvas(canvasRef.current, url, { width: 240, margin: 1, color: { dark: '#0A0A0B', light: '#FFFFFF' } });
    });
    return () => { cancelled = true; };
  }, [open, url]);

  return (
    <>
      <ActionButton
        variant="small"
        template={template}
        label={label}
        icon={<QRIcon />}
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="QR code for this card"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-[12px] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <canvas ref={canvasRef} />
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-ink hover:opacity-70"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
