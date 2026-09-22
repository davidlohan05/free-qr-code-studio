# FreeQRStudio — GitHub/Vercel Deployment

## 1. GitHub
Commit the project without `.env` files or real credentials.

## 2. Supabase
1. Create a Supabase project.
2. Run `supabase/schema.sql`.
3. Enable email/password authentication as required by your account policy.
4. Copy the project URL, anon key and service-role key into Vercel environment variables.

## 3. Vercel
Import the repository. Vercel will use `npm run build` and `dist` for static output while serving `/api/*` as serverless functions.

Required environment variables:
```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
IP_HASH_SALT
PUBLIC_BASE_URL
```

Optional:
```text
ADS_ENABLED=false
```

## 4. Production smoke tests
After deployment test:
- `/`
- QR generation in browser
- PNG/SVG/PDF export
- `/auth.html` signup/sign-in
- `/dashboard.html`
- create a dynamic QR
- open `/r/<id>` from a separate device/network
- confirm redirect and scan count
- confirm unauthenticated API calls are rejected
- confirm service-role key never appears in page source

## 5. Domain/SEO
Replace `YOUR_DOMAIN` in `sitemap.xml` and `robots.txt`, and confirm canonical/Open Graph URLs match the live domain.

## 6. Ads
Only enable ads after the publisher account is approved and the exact script/publisher configuration is known. Keep ads asynchronous and verify that QR generation continues when the ad network fails.

## Adsterra integration

The supplied Adsterra units are integrated in `ads.js`:
- Banner 300x250
- Banner 728x90
- Popunder
- Social Bar
- Native Banner

The codes are loaded asynchronously after the application becomes interactive. QR generation does not await or depend on ad network success. The exact `ads.txt` seller record must still be copied from the Adsterra publisher account; it is intentionally not fabricated in this repository.

## Vercel blank-page hardening (September 2026)

If a deployment previously showed a blank white page, use the current package and redeploy from the repository root.

The production bundle was syntax-validated after the Adsterra integration. The Vercel build serves `dist/`, while the server-side `api/config.js` remains outside `dist/` so Vercel can treat it as a function.

Required Vercel settings:
- Framework Preset: Other / None
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: the folder containing `package.json`

After deployment, verify:
- `/` loads the application
- `/ads.txt` returns the deployed text file (this project does not invent an Adsterra seller record)
- `/api/config` returns JSON when the Vercel function is active
- browser DevTools Console has no main-bundle syntax error
