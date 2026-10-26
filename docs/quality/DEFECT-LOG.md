# Inkwell Defect Log

| ID | Found During | Cause Category | Description | Remediation |
|----|--------------|----------------|-------------|-------------|
| D-001 | Lecture 10 review | Compatibility | Nullish-coalescing assignment used without a documented minimum Node version | Added engines field to package.json |
| D-002 | Lecture 10 self-review | Incomplete design | Feed.jsx has no error state: a failed /api/posts fetch leaves the page on "Loading posts…" indefinitely | Open — error state to be added alongside Lecture 12 testing work |
| D-003 | Lecture 14 E2E test | Integration gap | PostEditor never sent authorId, so every real publish from the UI failed server-side; unit/integration tests missed it because they supplied authorId directly | LoginForm stores the user; PostEditor sends getUser().id |
| D-004 | Lecture 14 E2E/axe review | Accessibility | No page had an h1 since Lecture 7's Router rewrite (WCAG heading structure) | h1 added to Feed, Write, and Log In pages |
| D-005 | Lecture 14 README verification | Build/setup | Fresh clone crashed on boot: nothing in the documented setup ran `prisma generate` | `postinstall: prisma generate` in server/package.json |
| D-006 | Lecture 14 README verification | Configuration | server/.env.test was not gitignored (`.gitignore` matched only `.env`) | `.gitignore` now ignores `.env*`, re-includes `.env.example` |
