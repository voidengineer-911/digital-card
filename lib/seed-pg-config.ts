/**
 * Build the node-postgres client config the seed script connects with.
 *
 * Extracted from scripts/seed-from-files.ts, whose main() interleaved three
 * unrelated jobs: photo upload, connection setup, and seeding. This is the part
 * with subtle, easily-broken rules, and it could not be tested inside main().
 *
 * Two environments, two shapes:
 *  • local/CI postgres — plain TCP, no DNS work, TLS OFF. A service container
 *    has no certificate, so ssl:true would fail every CI seed.
 *  • Neon — connect by resolved IPv4 (Node 25's Happy-Eyeballs otherwise
 *    ETIMEDOUTs), which means TLS is negotiated against an IP. `servername`
 *    must then carry the ORIGINAL hostname or SNI fails and the handshake is
 *    rejected. Dropping that field is a silent, environment-specific breakage.
 */
export interface PgClientConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: false | { rejectUnauthorized: boolean; servername: string };
  connectionTimeoutMillis: number;
}

export function isLocalHostname(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

/**
 * @param rawUrl        the DIRECT_URL connection string
 * @param resolvedHost  IPv4 for Neon; ignored for local, which uses the hostname
 */
export function buildPgClientConfig(rawUrl: string, resolvedHost: string): PgClientConfig {
  const parsed = new URL(rawUrl);
  const hostname = parsed.hostname;
  const local = isLocalHostname(hostname);

  return {
    host: local ? hostname : resolvedHost,
    port: parsed.port ? Number(parsed.port) : 5432,
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.slice(1),
    ssl: local
      ? false
      : {
          rejectUnauthorized: false,
          // SNI must match the Neon host for TLS to succeed when connecting by IP.
          servername: hostname,
        },
    connectionTimeoutMillis: 15000,
  };
}
