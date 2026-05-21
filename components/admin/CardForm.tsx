'use client';
import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { PhotoDropzone } from './PhotoDropzone';

type Action = (prev: ActionState, fd: FormData) => Promise<ActionState>;
type ActionState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

type Props = {
  initial?: {
    id?: string;
    slug?: string; template?: 'lux' | 'force'; brand?: 'force-ai' | 'force-media' | null;
    defaultLocale?: 'en' | 'ar';
    enName?: string; enTitle?: string; arName?: string; arTitle?: string;
    photoUrl?: string;
    phone?: string | null; phoneDisplay?: string | null; whatsapp?: string | null;
    emails?: string[]; websites?: string[];
    instagram?: string | null; linkedin?: string | null; x?: string | null; github?: string | null; youtube?: string | null; tiktok?: string | null;
    copyrightYear?: number;
  };
  action: Action;
  submitLabel: string;
};

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-14 px-8 rounded-pill bg-ink text-white font-semibold uppercase tracking-wider-12 text-[14px] disabled:opacity-50"
    >{pending ? 'Saving…' : label}</button>
  );
}

function field(name: string, label: string, value: string | null | undefined, type = 'text', err?: string) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] uppercase tracking-[0.12em]" style={{ color: '#686A6C' }}>{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={value ?? ''}
        className="h-12 px-4 border border-ink rounded-pill text-ink text-[14px]"
      />
      {err && <span className="text-[11px]" style={{ color: '#b00020' }}>{err}</span>}
    </label>
  );
}

export function CardForm({ initial = {}, action, submitLabel }: Props) {
  const [state, formAction] = useFormState(action, {} as ActionState);
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {field('slug', 'Slug (URL path)', initial.slug, 'text', fe.slug)}
      <label className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.12em]" style={{ color: '#686A6C' }}>Template</span>
        <select name="template" defaultValue={initial.template ?? 'lux'} className="h-12 px-4 border border-ink rounded-pill text-ink text-[14px]">
          <option value="lux">lux — luxury (white/black/Nardo grey)</option>
          <option value="force">force — Force brand (wine/orange/cream)</option>
        </select>
        {fe.template && <span className="text-[11px]" style={{ color: '#b00020' }}>{fe.template}</span>}
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.12em]" style={{ color: '#686A6C' }}>Brand (force template only)</span>
        <select name="brand" defaultValue={initial.brand ?? ''} className="h-12 px-4 border border-ink rounded-pill text-ink text-[14px]">
          <option value="">— none (use only with lux)</option>
          <option value="force-ai">Force AI</option>
          <option value="force-media">Force Media</option>
        </select>
        {fe.brand && <span className="text-[11px]" style={{ color: '#b00020' }}>{fe.brand}</span>}
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[11px] uppercase tracking-[0.12em]" style={{ color: '#686A6C' }}>Default locale</span>
        <select name="defaultLocale" defaultValue={initial.defaultLocale ?? 'en'} className="h-12 px-4 border border-ink rounded-pill text-ink text-[14px]">
          <option value="en">English</option>
          <option value="ar">Arabic</option>
        </select>
      </label>

      <hr className="border-0 h-px" style={{ backgroundColor: 'rgba(104,106,108,0.20)' }} />
      <h2 className="text-[12px] uppercase tracking-[0.12em]" style={{ color: '#686A6C' }}>Identity</h2>
      {field('enName',  'Name (EN)',     initial.enName,  'text', fe.enName)}
      {field('enTitle', 'Title (EN)',    initial.enTitle, 'text', fe.enTitle)}
      {field('arName',  'Name (AR)',     initial.arName,  'text', fe.arName)}
      {field('arTitle', 'Title (AR)',    initial.arTitle, 'text', fe.arTitle)}

      <hr className="border-0 h-px" style={{ backgroundColor: 'rgba(104,106,108,0.20)' }} />
      <h2 className="text-[12px] uppercase tracking-[0.12em]" style={{ color: '#686A6C' }}>Photo</h2>
      <PhotoDropzone slug={initial.slug ?? ''} initialUrl={initial.photoUrl} />

      <hr className="border-0 h-px" style={{ backgroundColor: 'rgba(104,106,108,0.20)' }} />
      <h2 className="text-[12px] uppercase tracking-[0.12em]" style={{ color: '#686A6C' }}>Contact</h2>
      {field('phone',        'Phone (intl, digits only)', initial.phone,        'text', fe.phone)}
      {field('phoneDisplay', 'Phone (display)',           initial.phoneDisplay, 'text', fe.phoneDisplay)}
      {field('whatsapp',     'WhatsApp (intl)',           initial.whatsapp,     'text', fe.whatsapp)}
      {field('emails',       'Emails (comma-separated)',  initial.emails?.join(', '), 'text', fe.emails)}
      {field('websites',     'Websites (comma-separated)',initial.websites?.join(', '), 'text', fe.websites)}

      <hr className="border-0 h-px" style={{ backgroundColor: 'rgba(104,106,108,0.20)' }} />
      <h2 className="text-[12px] uppercase tracking-[0.12em]" style={{ color: '#686A6C' }}>Socials (handles only)</h2>
      {field('instagram', 'Instagram', initial.instagram, 'text', fe.instagram)}
      {field('linkedin',  'LinkedIn',  initial.linkedin,  'text', fe.linkedin)}
      {field('x',         'X (Twitter)', initial.x,       'text', fe.x)}
      {field('github',    'GitHub',    initial.github,    'text', fe.github)}
      {field('youtube',   'YouTube',   initial.youtube,   'text', fe.youtube)}
      {field('tiktok',    'TikTok',    initial.tiktok,    'text', fe.tiktok)}

      <hr className="border-0 h-px" style={{ backgroundColor: 'rgba(104,106,108,0.20)' }} />
      {field('copyrightYear', 'Copyright year', String(initial.copyrightYear ?? 2026), 'number', fe.copyrightYear)}

      {state.error && <p className="text-[12px]" style={{ color: '#b00020' }}>{state.error}</p>}

      <div className="flex gap-4 items-center mt-4">
        <Submit label={submitLabel} />
        <Link href="/admin" className="text-[12px] uppercase tracking-[0.12em]" style={{ color: '#686A6C' }}>Cancel</Link>
      </div>
    </form>
  );
}
