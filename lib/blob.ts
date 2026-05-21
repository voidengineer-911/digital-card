import { put, del } from '@vercel/blob';

export async function uploadCardPhoto(slug: string, file: Buffer | Blob, contentType: string): Promise<string> {
  const result = await put(`photos/${slug}-${Date.now()}.jpg`, file, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
  });
  return result.url;
}

export async function deleteCardPhoto(url: string): Promise<void> {
  if (!url) return;
  try {
    await del(url);
  } catch (err) {
    console.warn('blob delete failed (continuing):', (err as Error).message);
  }
}
