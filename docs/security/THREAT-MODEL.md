# Inkwell Threat Model

## Attack Surface
- POST /api/auth/register — unauthenticated, accepts email/displayName/password
- POST /api/auth/login — unauthenticated, accepts email/password
- POST /api/posts — authenticated, accepts title/body/tags
- GET /api/posts — unauthenticated, returns paginated feed (optional `search`, `page`, `pageSize`)
- DELETE /api/posts/:id — authenticated, owner only (Lecture 16)
- JWT access tokens — bearer, sent in Authorization header

## STRIDE Analysis, with Risk Rating

| Component | Threat | Category | Likelihood | Impact | Risk Rating | Mitigation |
|---|---|---|---|---|---|---|
| POST /api/posts | A user forges another user's `authorId` to publish as them | Spoofing | High | High | Critical | Derive author from the authenticated token, never trust client-supplied authorId (`requireAuth` + `req.user.id`) |
| GET /api/posts | Response includes fields beyond what the feed needs (e.g., email) | Information Disclosure | High | Medium | High | Explicit response shaping: allowlist `toPublicUser` DTO |
| POST /api/auth/login | Unlimited login attempts enable brute-force credential guessing | Denial of Service / Broken Auth | Medium | High | High | Rate limiting: 5 failed attempts per account per 10 minutes |
| POST /api/posts | Untrusted `body` content rendered unsanitized on the client, enabling stored XSS | Tampering / Info Disclosure | Medium | High | High | Output encoding on render (React text escaping), regression-tested |
| GET /api/posts | Client requests an unbounded `pageSize`, forcing huge queries | Denial of Service | Medium | Medium | Medium | Clamp `pageSize` to 50 (and `page`/`pageSize` to ≥ 1) in PostService (Exercise 1) |

## Security

### Hardening Log
- 2026-10-26 — Lecture 15: Fixed authorId spoofing — `requireAuth` middleware verifies the JWT; POST /api/posts takes the author from `req.user.id` and ignores any body `authorId`.
- 2026-10-26 — Lecture 15: Added allowlist user DTO (`toPublicUser`: id + displayName); feed and search now include each post's author only through it.
- 2026-10-26 — Lecture 15: Added rate limiting to login and register — keyed by account (email) and counting only failures, per the requirement's "five consecutive failures from the same account" wording.
- 2026-10-26 — Lecture 15: Verified stored-XSS resistance with a regression test (`PostCard.security.test.jsx`).
- 2026-10-26 — Lecture 15, Exercise 1: Clamped feed/search paging (`pageSize` ≤ 50, `page`/`pageSize` ≥ 1). Also fixes a latent bug: `?page=-1` previously produced a negative database offset and a 500.
- 2026-10-27 — Lecture 16: OWASP Top 10 pass — see OWASP-TOP-10-REVIEW.md (fixed A02 forgeable tokens, A05 error leaks, A06 vulnerable dependencies, A09 missing auth logging; DELETE built owner-checked).

### Security Measurement Baseline
- Live vulnerabilities found and remediated this pass: 3 — authorId spoofing (Critical), no brute-force protection on login (High), negative/unbounded paging (Medium).
- Preventive mitigations (not live vulnerabilities here): 2 — the feed did not yet return author data, so the DTO now governs the author data it newly includes; React already escaped post bodies, now locked in by a test.
- Security test coverage: 3 of 4 attack-surface endpoints have dedicated security regression tests (POST /api/posts, GET /api/posts, POST /api/auth/login — see `server/src/routes/__tests__/security.integration.test.js`), plus the client XSS test. POST /api/auth/register has the rate limiter but no dedicated test yet.
- Residual risk: account-keyed rate limiting lets an attacker deliberately lock a known account out of login for 10 minutes by sending failed attempts. Accepted for now (lockout is temporary and logins still work for every other account); revisit with per-IP limits or progressive delays.
- Maturity note: Inkwell's security practice is currently ad hoc/reactive (a single hardening pass), not yet an ongoing program — the honest, named starting point for future improvement, not a finished state.
