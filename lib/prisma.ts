import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

// WebSocket constructor required for Neon serverless driver in Node.js runtime
import ws from 'ws';
neonConfig.webSocketConstructor = ws;

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrisma(): PrismaClient {
  // Prefer DIRECT_URL (standard TCP) when available — avoids Node 25 WebSocket/TLS
  // quirk that causes ETIMEDOUT with the Neon pooler WebSocket on local machines.
  // Vercel edge/serverless functions use DATABASE_URL (pooler) via the Neon adapter.
  const directUrl = process.env.DIRECT_URL;
  if (directUrl) {
    const pool = new Pool({ connectionString: directUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.__prisma ?? createPrisma();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
