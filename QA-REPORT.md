# FreeQRStudio — Production QA Report

Date: 2026-09-22

## Gate status

| Gate | Status | Evidence |
|---|---|---|
| FQS-G01 Project Access | PASS | Source project inspected |
| FQS-G02 Safe Working Copy | PASS | Dedicated production working copy |
| FQS-G03 Project Audit | PASS | Static source audit completed |
| FQS-G04 Dependency Baseline | PASS | Browser QR dependency identified and hardened |
| FQS-G05 Application Startup | PASS | Static build succeeds |
| FQS-G06 QR Engine | PASS | qrcode 1.5.1 + timeout/retry/error state; owner browser test |
| FQS-G07 QR Functionality | PASS | Owner confirmed browser QR generation |
| FQS-G08 QR Design/Scannability | CONDITIONAL | Safe QR controls remain; physical scan evidence not supplied |
| FQS-G09 QR Export | CONDITIONAL | Export implementation present; live download/file-integrity test still required |
| FQS-G10 UI/Responsive | CONDITIONAL | Responsive layout present; full viewport matrix not independently browser-tested |
| FQS-G11 Accessibility | CONDITIONAL | Semantic/interactive structure reviewed; full automated + keyboard audit requires live browser |
| FQS-G12 Security | PASS | Server-only secrets, input validation, hashed IP, security headers, no real secrets |
| FQS-G13 Performance | CONDITIONAL | Ads made opt-in/non-blocking; bundle ~211 KB raw/~65 KB gzip; Core Web Vitals require live URL |
| FQS-G14 Auth/Database/Dynamic QR | IMPLEMENTED / CONFIG REQUIRED | Supabase schema, auth UI, protected create API, dynamic redirect route and dashboard added |
| FQS-G15 Analytics Backend | IMPLEMENTED / CONFIG REQUIRED | Scan event storage + authenticated summary API added |
| FQS-G16 Technical SEO | PASS | Metadata/canonical/robots/sitemap retained; domain replacement required |
| FQS-G17 SEO Content | CONDITIONAL | Content cleaned of unsupported claims; final editorial review recommended |
| FQS-G18 Ads/Monetization | IMPLEMENTED / CONFIG REQUIRED | Direct ad-network calls removed from main app; opt-in async loader + ads.txt template added |
| FQS-G19 Legal/Trust | IMPLEMENTED / LEGAL REVIEW REQUIRED | Privacy, Terms and Contact pages added; operator/jurisdiction review required |
| FQS-G20 Deployment Readiness | PASS | Vercel build config + environment template + deployment docs |
| FQS-G21 Production Build | PASS | `npm run build` succeeds |
| FQS-G22 Production Runtime | CONDITIONAL | Local artifact/build verified; live Vercel runtime and backend connectivity require deployment |
| FQS-G23 Regression | CONDITIONAL | Static regression checks pass; full browser/device matrix requires live environment |
| FQS-G24 Final Security/SEO/Ads | CONDITIONAL | Static checks pass; live ad/privacy/header/SEO verification remains environment-dependent |
| FQS-G25 Final File Audit | PASS | Required files, secret scan and unsupported-claim scan |
| FQS-G26 Final ZIP Validation | PASS | ZIP created/re-extracted and integrity checked |
| FQS-G27 Final Delivery | PASS | Production release package generated |

## G08 — Scannability
The application retains error-correction/customization controls and the QR engine fix. A physical-camera scan is not claimed unless independently performed and recorded. Owner browser generation is evidence for generation, not physical scannability.

## G09 — Export
The source contains PNG/SVG/PDF export implementation. A live browser download test should be recorded after deployment or by the owner if it has not already been done.

## G10 — Responsive
Existing responsive layout remains in the release. The required viewport matrix (320/375/390/414/768/1024/1280/1440/1920) is a test requirement; no fabricated PASS is recorded without evidence.

## G11 — Accessibility
No claim is made for full WCAG conformance without an automated and keyboard audit. The release avoids adding inaccessible backend-only controls to the main generator.

## G12 — Security
Dynamic targets are restricted to HTTP(S). Authenticated creation uses Supabase bearer tokens. Service-role credentials stay in server environment variables. Scan IPs are salted/hashed. Security headers are configured in `vercel.json`.

## G14/G15 — Backend
Implemented components:
- `supabase/schema.sql`
- `/api/config`
- `/api/qr/create`
- `/api/r/:id`
- `/api/analytics/summary`
- `/auth.html`
- `/dashboard.html`

These require a configured Supabase project and Vercel environment variables. No fake backend is claimed.

## G18 — Ads
The previous hard-coded ad-network URLs were removed from the main application. Ads are now opt-in and asynchronous. Approval, publisher ID, exact network script and ads.txt record must be supplied by the operator before enabling monetization.

## G19 — Legal
Templates were added for Privacy, Terms and Contact. They explicitly avoid unsupported compliance guarantees. Final legal review is still required.

## Evidence / traceability
- E-FQS-QR-001: Owner browser QR generation confirmation.
- E-FQS-BUILD-001: `npm run build` PASS.
- E-FQS-QA-001: `npm run qa` PASS.
- E-FQS-SEC-001: Static secret/unsupported-claim audit PASS.
- E-FQS-ZIP-001: Final ZIP extraction/integrity PASS.
- E-FQS-LIVE-001: Reserved for live Vercel + Supabase smoke test.
- E-FQS-SCAN-001: Reserved for physical camera scan evidence.
- E-FQS-CWV-001: Reserved for live Core Web Vitals/Lighthouse evidence.

## Release rule
“Implemented / Config Required” means the production code path exists but external credentials/configuration are intentionally absent. “Conditional” means the artifact is prepared but the required live/device evidence has not been supplied. No gate is promoted to PASS merely to make the report look complete.


## Release Audit Update — 2026-09-22

A second source-level audit was performed on the packaged release after the browser QR-generation check. The audit found and corrected the following release blockers/quality issues:

- PDF export previously used PNG data with a `.pdf` filename; it has been replaced with a real PDF byte-stream generator.
- SVG export now wraps the generated QR SVG and includes the configured frame/logo presentation instead of exporting only the raw QR matrix.
- Event QR payload was corrected from an invalid VCARD/VEVENT combination to an iCalendar-style `VCALENDAR/VEVENT` payload.
- Multi-URL input no longer silently discards all but the first line; it encodes the supplied URL list as line-separated QR text. It is not a multi-destination landing page.
- Fabricated testimonial-style names/locations were removed from the marketing section.
- Hard-coded ad-network identifiers and placeholder `about:blank` ad injection were removed from the main application. Ads remain disabled until a verified network configuration is supplied.
- Marketing copy was aligned with the actual architecture; no live analytics numbers or unsupported compliance/customer claims are presented.

### Current Verification

- `npm run build`: PASS
- `npm run qa`: PASS
- JavaScript syntax checks for scripts/API handlers: PASS
- Local static HTTP smoke test for release pages and robots/sitemap: PASS (HTTP 200)
- ZIP extraction/integrity: PASS
- Browser-level automated runtime/visual test in this execution environment: BLOCKED by the available headless-browser environment.
- Real Supabase Auth/Database/Dynamic QR scan flow: NOT LIVE-VERIFIED without project credentials.
- Physical QR scanning with a phone: NOT independently verified in this execution.
- Ad-network serving/approval: NOT verified; ads are intentionally disabled by default.

Therefore the package is hardened for deployment, but these external/live checks must not be represented as completed until verified on the actual deployed site.
