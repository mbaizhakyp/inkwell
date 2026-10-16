# Self-Review: Lecture 7–8 Client (Routing, Feed, Responsive Layout)

**Reviewer prep time:** ~20 minutes (read all client components and re-checked
the server architecture rules against the Lecture 10 checklist)
**Defects found:** 1
**Outcome:** Accept with follow-up

## Findings

1. **Feed.jsx has no error state.** The `fetch("/api/posts?page=1")` call has
   no `.catch` and no error branch: if the API is down or returns an error,
   the component shows "Loading posts…" forever. This violates the checklist
   item "New UI states (loading, empty, error) are explicitly designed" —
   loading and empty were designed (Lecture 7), error was not.
   Follow-up: add an error state alongside the automated tests in Lecture 12.

## Checked and clean

- Architecture: no module outside `repositories/` imports `@prisma/client`
  (verified by grep); route handlers contain no business logic.
- Design quality: validation lives only in `utils/validation.js`; services
  throw typed errors that routes convert to the standard error format.
- UX: form fields are labeled with `htmlFor`/`id` and error messages are
  linked via `aria-describedby`; layout verified at 375 px in Lecture 8.
