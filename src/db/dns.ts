import dns from 'node:dns';

// System DNS on this network fails MongoDB Atlas SRV lookups (querySrv ECONNREFUSED).
dns.setServers(['1.1.1.1', '1.0.0.1']);
