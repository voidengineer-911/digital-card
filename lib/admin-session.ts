/**
 * Edge-safe JWT session utilities (no node:crypto).
 * Used by middleware (Edge Runtime) and admin-auth (Node Runtime).
 */
import { jwtVerify } from 'jose';

export function jwtSecret(): Uint8Array {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s || s.length < 32) throw new Error('ADMIN_JWT_SECRET must be set, ≥32 bytes');
  return new TextEncoder().encode(s);
}

export async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, jwtSecret());
    return payload.adm === true;
  } catch {
    return false;
  }
}
