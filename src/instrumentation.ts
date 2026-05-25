export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dns = await import('node:dns');
    dns.setServers(['1.1.1.1', '1.0.0.1']);
  }
}
