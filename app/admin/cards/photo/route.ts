import { NextResponse } from 'next/server';
import { uploadCardPhoto } from '@/lib/blob';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const fd = await req.formData();
  const slug = (fd.get('slug') ?? '').toString();
  const file = fd.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'no file' }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: 'unsupported type' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'file too large (5MB max)' }, { status: 400 });
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const url = await uploadCardPhoto(slug, buf, file.type);
  return NextResponse.json({ url });
}
