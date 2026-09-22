import { json } from '../_lib/http.js';
import { getUser, db } from '../_lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res,405,{error:'Method not allowed'});
  try {
    const user = await getUser(req);
    if (!user) return json(res,401,{error:'Authentication required'});
    const { name='Untitled QR', target_url } = req.body || {};
    let u; try { u = new URL(target_url); } catch { return json(res,400,{error:'Valid target_url is required'}); }
    if (!['http:','https:'].includes(u.protocol)) return json(res,400,{error:'Only HTTP(S) targets are allowed'});
    const rows = await db('qr_codes', {method:'POST', headers:{Prefer:'return=representation'}, body:JSON.stringify({user_id:user.id,name:String(name).slice(0,120),target_url:u.href})});
    const row = rows[0];
    const base = (process.env.PUBLIC_BASE_URL || '').replace(/\/$/,'');
    if (!base) return json(res,500,{error:'PUBLIC_BASE_URL is not configured'});
    return json(res,201,{id:row.id, redirect_url:`${base}/r/${row.id}`});
  } catch (e) { return json(res,e.status===401?401:500,{error:e.data?.message || e.message || 'Server error'}); }
}
