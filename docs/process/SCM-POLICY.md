# Inkwell SCM Policy

## Branching Strategy

Inkwell uses GitHub Flow:

- `main` is always deployable.
- All work happens on short-lived branches named `<type>/<short-description>`,
  such as `feature/tag-search` or `fix/author-id-spoofing`.
- Contributors merge branches through pull requests that require:
  - All automated tests to pass
  - At least one reviewer to approve the change (using `.github/PULL_REQUEST_TEMPLATE.md`)
- Contributors delete branches after merging them.

GitHub Flow over GitFlow or trunk-based development: it fits the course's
"one lecture, one increment" pace, needs no `develop`/`main` synchronization
for a project this small, and prepares the repository for Continuous
Integration.

## Commit Message Conventions

Inkwell follows Conventional Commits:

  <type>(<scope>): <short summary>

Types: feat, fix, test, docs, refactor, chore, security, build

Examples:

  feat(posts): add tag-based search
  security(auth): fix authorId spoofing vulnerability

The prefix makes history searchable, e.g. `git log --grep="^security"`
lists every security change.

## Change Control

- Unreleased work: the pull-request process above.
- Changes to anything already released and baselined (a tagged version):
  open a change request using `.github/CHANGE_REQUEST_TEMPLATE.md` first,
  so its impact is analyzed before implementation.

## Baselines and Releases

- Every release is an annotated Git tag `vMAJOR.MINOR.PATCH` (Semantic
  Versioning), created only from a `main` commit whose checks pass.
- Every tag has a matching entry in `CHANGELOG.md`.

## CI Enforcement (Lecture 20)

`main` is now a protected branch:
- Required status checks: dependency-audit, server-tests, client-tests,
  e2e-tests, docker-build
- No direct pushes to main; all changes via pull request (verified: a
  direct push is rejected with GH006)
- Branches must be up to date with main before merging
- The rule applies to administrators too
- Required approvals: 0 — a solo developer cannot approve their own pull
  request; the required checks are the gate
- This turns Lecture 17's "main is always deployable" policy from a
  documented intention into a mechanically enforced guarantee — a pull
  request cannot merge until every required check passes.
