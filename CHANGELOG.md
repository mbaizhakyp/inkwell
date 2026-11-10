# Changelog

All notable changes to Inkwell are documented here. Versions follow
Semantic Versioning; each version is an annotated Git tag (see
docs/process/SCM-POLICY.md).

## [0.5.0] - 2026-11-10

First baselined release.

### Added

- User registration and login (JWT access and refresh tokens)
- Post publishing (with tags), public feed with pagination, and search
- Post deletion by its owner
- React client: feed, write, and login pages; mobile-first responsive layout
- Unit, integration, component, end-to-end, and accessibility test suites
- Project docs: requirements, design, architecture (ADR-001), SQA plan,
  threat model, OWASP Top 10 review

### Fixed

- Broken access control: posts could be published as any user (author
  spoofing); deletion is now owner-only
- Forgeable tokens from hardcoded fallback JWT secrets
- Misconfigured error handling that leaked internal error details
- Vulnerable dependencies (npm audit: 0 remaining), missing failed-login
  logging, and unbounded feed paging
