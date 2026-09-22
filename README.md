# FreeQRStudio — Production-Ready Full Release

FreeQRStudio is a browser-based QR generator with an optional production backend for authentication, dynamic QR redirects and scan analytics.

## Architecture

### Static QR generation
- Browser-side QR generation.
- QR engine loader uses qrcode 1.5.1 browser builds with timeout, retry and terminal error handling.
- PNG/SVG/PDF export paths remain client-side.

### Optional production backend
- Vercel serverless API routes.
- Supabase Auth for account authentication.
- Supabase Postgres for dynamic QR records and scan events.
- `/r/:id` redirect route records a scan event and redirects to the saved HTTP(S) target.
- Authenticated dashboard at `/dashboard.html` creates dynamic QR redirect URLs and displays scan counts.
- Server-only Supabase service-role key is never exposed to the browser.
- IPs are salted/hashed before being stored for scan aggregation.

## Required production configuration
Set these Vercel environment variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `IP_HASH_SALT`
- `PUBLIC_BASE_URL`

Run `supabase/schema.sql` in the Supabase SQL editor before enabling dynamic QR features.

The public browser receives only `SUPABASE_URL` and `SUPABASE_ANON_KEY` through `/api/config`. The service-role key remains server-only.

## Ads
Adsterra is integrated using the publisher snippets supplied by the site owner: 300x250 Banner, 728x90 Banner, Popunder, Social Bar, and Native Banner. Ad code loads asynchronously after the app becomes interactive and is isolated from QR generation. Replace `ads.txt` with the exact seller record supplied in the Adsterra publisher account before production monetization; no seller ID is fabricated here.

## Legal
Included:
- `privacy.html`
- `terms.html`
- `contact.html`

These are production templates, not legal advice. Replace the support placeholder and have the final policy reviewed for the operator's jurisdiction and actual data/advertising configuration.

## Build and QA
```bash
npm run build
npm run qa
```

The build outputs the static site to `dist/`; Vercel serverless functions remain under `/api`.

## Release validation
- Owner browser test: QR generation confirmed after the loader repair.
- Static build: PASS.
- Static QA: PASS.
- JavaScript syntax checks for server functions: PASS.
- Final ZIP integrity validation: required before delivery.

Live Supabase connectivity, production Vercel runtime, physical QR scanning, Lighthouse/Core Web Vitals, ad-network approval and Google indexing require external account/live-environment verification and must not be represented as completed by local artifact tests.


## Second Audit Notes

The release was re-audited after browser QR generation was tested. PNG/SVG/PDF export paths, event payload formatting, multi-URL handling, fabricated social proof, and ad placeholder code were hardened. Live Supabase, physical scan, ad-network and deployed-browser checks still require the real production environment.
