# FreeQRStudio — Deployment

## Current architecture
This ZIP is a static single-page application. It contains no package manager metadata,
server API, database, authentication layer, or dynamic-QR backend.

## GitHub
1. Create a repository.
2. Upload the project files.
3. Do not commit real credentials.
4. Keep `.env.example` as the configuration template.

## Vercel
Import the GitHub repository into Vercel as a static project.

- Framework preset: Other / static
- Build command: none
- Output directory: `.`
- Production branch: your chosen release branch

The included `vercel.json` provides SPA routing and basic response headers.

## Custom domain
Add the domain in Vercel, then follow the DNS records Vercel provides. Do not claim
DNS or HTTPS is configured until the live deployment has been verified.

## Google Search Console
After the production domain is live:
1. Verify the property.
2. Submit `/sitemap.xml`.
3. Inspect the homepage.
4. Request indexing.
5. Review coverage and Core Web Vitals.

These are user/account actions and are not verified by this local package audit.
