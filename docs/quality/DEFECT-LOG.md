# Inkwell Defect Log

| ID | Found During | Cause Category | Description | Remediation |
|----|--------------|----------------|-------------|-------------|
| D-001 | Lecture 10 review | Compatibility | Nullish-coalescing assignment used without a documented minimum Node version | Added engines field to package.json |
| D-002 | Lecture 10 self-review | Incomplete design | Feed.jsx has no error state: a failed /api/posts fetch leaves the page on "Loading posts…" indefinitely | Open — error state to be added alongside Lecture 12 testing work |
| D-003 | Lecture 14 E2E test | Integration gap | PostEditor never sent authorId, so every real publish from the UI failed server-side; unit/integration tests missed it because they supplied authorId directly | LoginForm stores the user; PostEditor sends getUser().id |
| D-004 | Lecture 14 E2E/axe review | Accessibility | No page had an h1 since Lecture 7's Router rewrite (WCAG heading structure) | h1 added to Feed, Write, and Log In pages |
| D-005 | Lecture 14 README verification | Build/setup | Fresh clone crashed on boot: nothing in the documented setup ran `prisma generate` | `postinstall: prisma generate` in server/package.json |
| D-006 | Lecture 14 README verification | Configuration | server/.env.test was not gitignored (`.gitignore` matched only `.env`) | `.gitignore` now ignores `.env*`, re-includes `.env.example` |
| D-007 | Lecture 15 threat model | Security (Spoofing) | POST /api/posts trusted the client-supplied authorId, letting any caller publish as any user | requireAuth middleware; author taken from the verified token |
| D-008 | Lecture 15 threat model | Security (Broken Auth) | No limit on failed logins enabled brute-force credential guessing | Account-keyed rate limiter: 5 failures / 10 min |
| D-009 | Lecture 15, Exercise 1 | Input validation | `?page=-1` produced a negative DB offset (500); paging was otherwise unbounded once exposed | Paging clamped in PostService (page ≥ 1, 1 ≤ pageSize ≤ 50) |
| D-010 | Lecture 16 OWASP review (A02) | Security (Cryptography) | No JWT secrets were configured anywhere, so tokens were signed with a hardcoded public fallback string — tokens were forgeable | Fallbacks removed (fail-fast on startup); generated 256-bit secrets in gitignored env files |
| D-011 | Lecture 16 OWASP review (A05) | Security (Misconfiguration) | Route catch-alls echoed raw error messages: a malformed tag returned Prisma's internal query dump; `X-Powered-By: Express` on every response | Central error handler (generic message in production), routes echo only ValidationError, input validated, header disabled |
| D-012 | Lecture 16 OWASP review (A06) | Security (Dependencies) | npm audit: 8 server vulnerabilities (1 critical: proxy-addr IP spoofing) and 2 high in client | `npm audit fix` (non-breaking); 0 remaining |
| D-013 | Lecture 16 OWASP review (A09) | Security (Logging) | Failed logins left no record, so brute-force attempts were invisible | pino structured `auth.login.failed` events |
