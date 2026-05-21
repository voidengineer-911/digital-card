'use client';
import { useState } from 'react';
import { ActionButton } from './ActionButton';
import type { Template } from '@/lib/types';

type Props = { url: string; title: string; template: Template; label?: string };

function ShareIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="18" cy="5" r="3" stroke={color} strokeWidth="1.5" />
      <circle cx="6"  cy="12" r="3" stroke={color} strokeWidth="1.5" />
      <circle cx="18" cy="19" r="3" stroke={color} strokeWidth="1.5" />
      <path d="M8.59 13.51L15.42 17.49" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15.41 6.51L8.59 10.49" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ShareButton({ url, title, template, label = 'SHARE' }: Props) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    if (typeof navigator !== 'undefined' && (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share) {
      try {
        await navigator.share({ url, title });
        return;
      } catch {
        /* user cancelled — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  return (
    <ActionButton
      variant="small"
      template={template}
      label={copied ? 'COPIED' : label}
      icon={<ShareIcon />}
      onClick={onClick}
    />
  );
}
