// test-db.js
import dns from 'node:dns';
import { MongoClient } from 'mongodb';

// Force Node.js to use reliable DNS servers for SRV record lookups
dns.setServers(['1.1.1.1', '1.0.0.1']);

async function test() {
  const uri =
    'mongodb+srv://ebenebechidera3:Chidera3ebenebe4@morphify.csiwjyt.mongodb.net/?appName=Morphify';

  if (!uri) {
    console.log('❌ MONGODB_URI is missing from .env');
    return;
  }

  console.log('🔍 Trying to connect...');

  try {
    const client = new MongoClient(uri);
    await client.connect();
    await client.db().command({ ping: 1 });
    console.log('✅ Connected successfully!');
    await client.close();
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
  }
}

test();
