import { json } from '../_lib/http.js';
import { getUser, db } from '../_lib/supabase.js';
export default async function handler(req,res) {
  if(req.method!=='GET') return json(res,405,{error:'Method not allowed'});
  try {
    const user=await getUser(req); if(!user) return json(res,401,{error:'Authentication required'});
    const q=await db(`qr_codes?user_id=eq.${encodeURIComponent(user.id)}&select=id,name,target_url,active,created_at`);
    const ids=q.map(x=>x.id);
    let scans=[];
    if(ids.length) scans=await db(`scan_events?qr_id=in.(${ids.join(',')})&select=qr_id,scanned_at,user_agent,referrer`);
    const by={}; for(const r of scans) by[r.qr_id]=(by[r.qr_id]||0)+1;
    return json(res,200,{qr_codes:q.map(x=>({...x,scan_count:by[x.id]||0})),total_scans:scans.length});
  }catch(e){return json(res,500,{error:e.message||'Server error'});}
}
