# Security Notes

- No real credentials are included.
- The application is client-side/static.
- QR generation currently depends on an external QR library CDN.
- Third-party advertising scripts are present and should be reviewed against the
  applicable network policy and privacy requirements before production use.
- The project does not contain a backend for authentication, dynamic QR records,
  scan analytics, or protected API routes.
- The current `vercel.json` enables `nosniff`, strict-origin referrer policy, and
  `SAMEORIGIN` framing protection.
