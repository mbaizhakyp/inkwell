# OWASP Top 10 Review — Lecture 16 (2026-10-27)

Each category was checked against the actual codebase (grep, live requests,
`npm audit`), not assumed. "Found" means a live issue reproduced in this repo.

| # | Category | Status in Inkwell | Action |
|---|---|---|---|
| A01 | Broken Access Control | No edit/delete endpoints existed yet (POST was already owner-bound by Lecture 15's `requireAuth`). Built `DELETE /api/posts/:id` ownership-checked from day one: 401 without a token, 403 for non-owners, 404 if missing. | Preventive — new endpoint + 4 regression tests (`posts.access-control.test.js`) |
| A02 | Cryptographic Failures | Passwords hashed with bcrypt since Lecture 6. **Found:** neither `.env` nor `.env.test` set any JWT secret, so every token was signed with the hardcoded public fallback `"dev-access-secret"` — anyone could forge a token for any user. | Fixed — fallbacks removed; the server refuses to start without `ACCESS_TOKEN_SECRET`/`REFRESH_TOKEN_SECRET` (verified: exits with an error); 256-bit secrets generated with `openssl rand -hex 32` into the gitignored env files; `.env.example` documents both |
| A03 | Injection | All queries go through Prisma's parameterized API; `grep` found no `$queryRaw`/`$executeRaw` anywhere in `server/src`. | Verified, no action needed |
| A04 | Insecure Design | Covered by Lecture 15's STRIDE threat model; no new design gap found this pass. | No action needed |
| A05 | Security Misconfiguration | **Found (2):** (1) every route catch-all echoed raw `err.message` to the client — `POST /api/posts` with `tagNames: [123]` returned Prisma's full internal query dump (user ids, schema shape) labelled as a 400 "validation error"; (2) every response sent `X-Powered-By: Express`. | Fixed — dedicated `error-handler.js` hides details in production and logs them; routes only echo our own `ValidationError`s; tags and login input validated at the service boundary; `x-powered-by` disabled. Regression tests for each |
| A06 | Vulnerable/Outdated Components | **Found:** `npm audit` reported 8 vulnerabilities in server (1 critical — `proxy-addr` IP spoofing, used by Express; 5 high; 2 moderate) and 2 high in client (Vite dev server). | Fixed — `npm audit fix` (non-breaking; Prisma only moved 7.10.0 → 7.10.1); now 0 in server, client, and root; all test suites re-run green. Automated audit in CI deferred to Lecture 20 |
| A07 | Authentication Failures | Account-keyed rate limiting already added (Lecture 15). Login now also validates input (missing email → 400, not a DB error). | No new action needed |
| A08 | Software/Data Integrity | Deferred — full treatment in Lecture 20/21's pipeline integrity discussion. | Deferred, flagged |
| A09 | Logging/Monitoring Failures | **Found:** failed logins were not logged at all; unhandled errors went to unstructured `console.error`. | Fixed — `pino` structured logger; failed logins emit `{ event: "auth.login.failed", email }` (never the password — unit-tested); unhandled errors logged with method/path |
| A10 | SSRF | Not yet applicable — no feature fetches a user-supplied URL. | Flagged for when avatar-by-URL is built |

**Summary:** 4 categories had live issues (A02, A05, A06, A09), all fixed and
regression-tested; A01 was built secure-by-default; A03, A04, A07 verified;
A08 deferred; A10 not applicable. Confirming a category does not apply —
and recording why — is as useful as a fix: future reviewers start from this
record instead of from scratch.
