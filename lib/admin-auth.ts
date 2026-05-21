import { scrypt as scryptCb, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { SignJWT } from 'jose';
import { jwtSecret, verifySession } from './admin-session';

export { verifySession } from './admin-session';

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;
const SCRYPT_KEYLEN = 64;
const JWT_TTL_HOURS = 8;

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(plain, salt, SCRYPT_KEYLEN);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  if (!stored || !stored.includes(':')) return false;
  const [saltHex, hashHex] = stored.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  if (expected.length !== SCRYPT_KEYLEN) return false;
  const actual = await scrypt(plain, salt, SCRYPT_KEYLEN);
  return timingSafeEqual(actual, expected);
}

export async function signSession(): Promise<string> {
  return new SignJWT({ adm: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${JWT_TTL_HOURS}h`)
    .sign(jwtSecret());
}

import { cookies } from 'next/headers';

export async function requireAdmin(): Promise<void> {
  const token = (await cookies()).get('admin_session')?.value;
  if (!await verifySession(token)) {
    throw new Error('UNAUTHORIZED');
  }
}
