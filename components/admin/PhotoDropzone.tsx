'use client';
import { useState } from 'react';

type Props = { slug: string; initialUrl?: string };

export function PhotoDropzone({ slug, initialUrl }: Props) {
  const [url, setUrl] = useState(initialUrl ?? '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!slug) { setErr('Enter the slug above first.'); return; }
    setBusy(true); setErr(null);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('slug', slug);
    try {
      const res = await fetch('/admin/cards/photo', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'upload failed');
      setUrl(json.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="w-16 h-16 rounded-full object-cover border border-ink" />
      ) : (
        <div className="w-16 h-16 rounded-full" style={{ backgroundColor: 'rgba(104,106,108,0.10)' }} />
      )}
      <div className="flex flex-col gap-2">
        <input type="hidden" name="photoUrl" value={url} />
        <label className="cursor-pointer h-10 px-5 rounded-pill border border-ink text-ink text-[12px] uppercase tracking-[0.12em] flex items-center w-fit">
          {busy ? 'Uploading…' : url ? 'Replace photo' : 'Upload photo'}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPick} disabled={busy} className="hidden" />
        </label>
        {err && <span className="text-[11px]" style={{ color: '#b00020' }}>{err}</span>}
      </div>
    </div>
  );
}
