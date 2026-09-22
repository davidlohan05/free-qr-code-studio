# Security Notes

- No real credentials are included.
- Supabase service-role credentials are server-only.
- Dynamic QR targets accept only HTTP(S) URLs.
- Dynamic redirect responses are not cached.
- Scan IPs are salted/hashed before persistence.
- Security headers include nosniff, strict-origin referrer policy, SAMEORIGIN framing protection, Permissions-Policy and COOP.
- Authenticated dashboard/API access requires a Supabase bearer token.
- Scan events are not directly readable by anonymous/authenticated browser clients.
- Advertising is disabled by default and loaded asynchronously only when explicitly configured.
- Final legal/privacy review remains required for the actual operator, jurisdiction and third-party services.
