import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const name of ['index.html','auth.html','dashboard.html','privacy.html','terms.html','contact.html','robots.txt','sitemap.xml','config.js','ads.js','ads.txt']) {
  await cp(join(root, name), join(dist, name));
}
for (const name of ['assets','legal','api','supabase']) {
  try { await cp(join(root, name), join(dist, name), { recursive: true }); } catch {}
}
const index = await readFile(join(dist, 'index.html'), 'utf8');
if (!index.includes('qrcode@1.5.1')) throw new Error('QR engine baseline missing');
if (index.includes('4 Million+ Trust') || index.includes('4M+ users')) throw new Error('Unsupported trust claim remains');
await writeFile(join(dist, 'release.txt'), `FreeQRStudio production build\nBuilt: ${new Date().toISOString()}\n`);
console.log(`Build PASS: ${dist}`);
