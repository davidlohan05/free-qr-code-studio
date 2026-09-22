const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

function required() {
  if (!url || !anon || !service) throw new Error('Supabase environment is not configured');
}

export async function getUser(req) {
  required();
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  const r = await fetch(`${url}/auth/v1/user`, { headers: { apikey: anon, Authorization: auth } });
  if (!r.ok) return null;
  return r.json();
}

export async function db(path, options={}) {
  required();
  const r = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: service,
      Authorization: `Bearer ${service}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const text = await r.text();
  let data = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!r.ok) { const e = new Error('Supabase request failed'); e.status = r.status; e.data = data; throw e; }
  return data;
}

export function hashIp(ip='') {
  // Deterministic, non-reversible bucket identifier using Web Crypto.
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${process.env.IP_HASH_SALT || 'change-me'}:${ip}`))
    .then(buf => [...new Uint8Array(buf)].map(x=>x.toString(16).padStart(2,'0')).join(''));
}
