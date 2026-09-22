import { db, hashIp } from '../_lib/supabase.js';

export default async function handler(req, res) {
  const id = req.query?.id;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return res.status(404).end('Not found');
  try {
    const rows = await db(`qr_codes?id=eq.${encodeURIComponent(id)}&active=eq.true&select=id,target_url`);
    if (!rows?.length) return res.status(404).end('QR code not found');
    const target = rows[0].target_url;
    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
    const ipHash = await hashIp(ip);
    await db('scan_events', {method:'POST', body:JSON.stringify({qr_id:id,user_agent:req.headers['user-agent']||null,referrer:req.headers.referer||null,ip_hash:ipHash})});
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Referrer-Policy','no-referrer');
    return res.redirect(302,target);
  } catch (e) { return res.status(503).end('Service temporarily unavailable'); }
}
