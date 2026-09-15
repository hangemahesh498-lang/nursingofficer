/**
 * Keep Supabase Project Active (Prevent 7-Day Free Tier Inactivity Pause)
 * 
 * Usage:
 * 1. Using environment variables:
 *    SUPABASE_URL=https://your-id.supabase.co SUPABASE_ANON_KEY=your-key node scripts/keep-supabase-alive.js
 * 
 * 2. Using command line arguments:
 *    node scripts/keep-supabase-alive.js https://your-id.supabase.co your-anon-key
 */

const urlArg = process.argv[2];
const keyArg = process.argv[3];

const supabaseUrl = (urlArg || process.env.SUPABASE_URL || '').trim();
const supabaseKey = (keyArg || process.env.SUPABASE_ANON_KEY || '').trim();

if (!supabaseUrl) {
  console.error('\x1b[31m[ERROR] SUPABASE_URL is missing!\x1b[0m');
  console.log('\nUsage:');
  console.log('  node scripts/keep-supabase-alive.js <SUPABASE_URL> [SUPABASE_ANON_KEY]');
  console.log('Or set environment variables:');
  console.log('  SUPABASE_URL=https://your-project.supabase.co');
  console.log('  SUPABASE_ANON_KEY=eyJhbGciOi...');
  process.exit(1);
}

const cleanBaseUrl = supabaseUrl.replace(/\/+$/, '');
const pingEndpoint = `${cleanBaseUrl}/rest/v1/`;

console.log(`\x1b[36m[PING] Sending keep-alive request to Supabase REST API:\x1b[0m ${pingEndpoint}`);

const headers = {
  'User-Agent': 'SupabaseKeepAlive/1.0',
  'Accept': 'application/json'
};

if (supabaseKey) {
  headers['apikey'] = supabaseKey;
  headers['Authorization'] = `Bearer ${supabaseKey}`;
}

const startTime = Date.now();

try {
  const resp = await fetch(pingEndpoint, {
    method: 'GET',
    headers: headers,
    signal: AbortSignal.timeout(20000)
  });

  const duration = Date.now() - startTime;
  console.log(`\x1b[33m[RESPONSE] HTTP Status: ${resp.status} ${resp.statusText} (${duration}ms)\x1b[0m`);

  if (resp.status >= 200 && resp.status < 500) {
    console.log('\x1b[32m✅ SUCCESS: Supabase project is active, awake, and received database traffic!\x1b[0m');
    process.exit(0);
  } else {
    console.warn(`\x1b[33m⚠️ Warning: Supabase returned status ${resp.status}. Verify your credentials.\x1b[0m`);
    process.exit(0);
  }
} catch (err) {
  console.error('\x1b[31m[FAILED] Error connecting to Supabase:\x1b[0m', err.message);
  process.exit(1);
}
