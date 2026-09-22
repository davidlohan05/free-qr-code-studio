# Free QR Studio — Production Release Checklist

## Release scope
This release is a static client-side QR generator. QR generation happens in the browser.
It does not include a production database, authentication service, dynamic-QR redirect API, or live scan analytics backend.

## Verified in this release
- Source ZIP preserved as the audit baseline.
- QR library loader repaired with deterministic timeout/retry/error handling.
- Browser QR generation was tested by the project owner in a browser after the repair.
- Static HTML/module syntax validation completed.
- Vercel configuration is valid JSON.
- No real secrets are included in the release artifact.
- Unsupported fake trust/compliance/live-analytics claims were removed or neutralized.
- Final ZIP is re-opened, integrity-tested, and re-extracted.

## Before public launch
1. Connect the repository to GitHub/Vercel.
2. Set the production domain and update `sitemap.xml`, canonical URL, and Open Graph URL if the domain differs.
3. Confirm the chosen ad network account, ownership, policy compliance, and `ads.txt` requirements.
4. Verify Privacy/Terms/Cookie/Contact pages appropriate to the actual service and jurisdiction.
5. Run a live production browser smoke test after Vercel deployment.
6. Run mobile/desktop responsive checks and Lighthouse/Core Web Vitals on the live URL.
7. Submit the sitemap in Google Search Console and verify indexing from the live domain.

## Important
“Production-ready artifact” does not mean “already deployed”. Deployment, ad approval, and Google indexing require access to external accounts and cannot be truthfully marked complete until performed.
