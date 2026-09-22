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
