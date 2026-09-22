export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  res.setHeader('Cache-Control','public, max-age=300');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  return res.end(JSON.stringify({supabaseUrl:process.env.SUPABASE_URL||'',supabaseAnonKey:process.env.SUPABASE_ANON_KEY||'',publicBaseUrl:process.env.PUBLIC_BASE_URL||'',adsEnabled:process.env.ADS_ENABLED==='true'}));
}
