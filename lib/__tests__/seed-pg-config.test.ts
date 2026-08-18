import { describe, it, expect } from 'vitest';
import { buildPgClientConfig, isLocalHostname } from '../seed-pg-config';

describe('isLocalHostname', () => {
  it('recognises the two local forms and nothing else', () => {
    expect(isLocalHostname('localhost')).toBe(true);
    expect(isLocalHostname('127.0.0.1')).toBe(true);
    expect(isLocalHostname('ep-x.eu-central-1.aws.neon.tech')).toBe(false);
  });
});

describe('buildPgClientConfig', () => {
  it('uses the hostname and DISABLES tls for a local/CI postgres', () => {
    // A CI service container has no certificate — ssl:true fails every seed.
    const c = buildPgClientConfig('postgresql://u:p@localhost:5432/db', '10.0.0.1');
    expect(c.host).toBe('localhost');
    expect(c.ssl).toBe(false);
  });

  it('connects to Neon by RESOLVED IPv4, not the hostname', () => {
    // Node 25 Happy-Eyeballs otherwise ETIMEDOUTs against Neon.
    const c = buildPgClientConfig('postgresql://u:p@ep-x.neon.tech/db', '203.0.113.9');
    expect(c.host).toBe('203.0.113.9');
  });

  it('keeps the ORIGINAL hostname as the TLS servername for Neon', () => {
    // Connecting by IP means SNI must still name the host, or the handshake is
    // rejected. Losing this field breaks only in production.
    const c = buildPgClientConfig('postgresql://u:p@ep-x.neon.tech/db', '203.0.113.9');
    expect(c.ssl).toEqual({ rejectUnauthorized: false, servername: 'ep-x.neon.tech' });
  });

  it('carries credentials, database and an explicit port', () => {
    const c = buildPgClientConfig('postgresql://user:pass@ep-x.neon.tech:6543/mydb', '1.2.3.4');
    expect(c.user).toBe('user');
    expect(c.password).toBe('pass');
    expect(c.database).toBe('mydb');
    expect(c.port).toBe(6543);
  });

  it('defaults the port to 5432 when the URL omits it', () => {
    expect(buildPgClientConfig('postgresql://u:p@ep-x.neon.tech/db', '1.2.3.4').port).toBe(5432);
  });
});
