# Inkwell SQA Plan — v1

## Standards
- All code changes follow the PR checklist (docs/reviews, .github/PULL_REQUEST_TEMPLATE.md)
- Architecture conformance per ADR-001 (docs/architecture/adr-001-modular.monolith.md)
- API contract conventions per docs/design/api-contract.md

## Reviews
- Every merged change is self-reviewed (author) then peer-reviewed before merge
- Review findings logged in docs/reviews/

## Testing (expanded in Lecture 12-14)
- Unit tests: Services and Repositories (Jest) — ACTIVE (Lecture 12)
- Integration tests: Routes → Services → Repositories, real test DB (Supertest) — ACTIVE (Lecture 13)
- Component tests: React components (RTL) — ACTIVE (Lecture 13)
- End-to-end tests: critical user flows (Playwright) — starting Lecture 14

## Defect Tracking
- All discovered defects (via review, testing, or manual use) recorded in docs/quality/DEFECT-LOG.md
- Each entry records: cause category, discovery stage, and remediation

## Metrics Tracked
- Defects per lecture/increment
- Defect cause category distribution
- Review turnaround (informal, tracked qualitatively at this project's scale)

## Metrics Snapshot (as of 2026-10-16)
- Commits in repository: 15
- Logged defects: 2 (see DEFECT-LOG.md)
- Backlog items at "Requirements Defined" or later: 4 (US-01 through US-04)

## Ownership
- For this course project: the student/team implementing Inkwell owns SQA plan adherence.
