import { readFile, access } from 'node:fs/promises';
const must = ['index.html','package.json','auth.html','dashboard.html','privacy.html','terms.html','contact.html','vercel.json','.env.example','robots.txt','sitemap.xml','api/qr/create.js','api/r/[id].js','api/analytics/summary.js','supabase/schema.sql'];
for (const f of must) { try { await access(f); } catch { throw new Error(`Missing required file: ${f}`); } }
const html = await readFile('index.html','utf8');
for (const bad of ['4 Million+ Trust','4M+ users','SOC 2 Type II','ISO 27001']) if (html.includes(bad)) throw new Error(`Unsupported claim remains: ${bad}`);
console.log('QA static checks PASS');
