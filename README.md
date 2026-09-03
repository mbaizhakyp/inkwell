# Inkwell

A Medium-like blog publishing platform, built incrementally in CS 415/515.

## Definition of Done

A backlog item is Done when:
- [ ] Code is committed with a descriptive message
- [ ] It runs locally per the relevant lecture's Code Walkthrough
- [ ] It does not break previously-passing verification steps
- [ ] New setup steps are documented here

## Process

Inkwell follows an incremental process: one lecture, one increment.
See docs/BACKLOG.md for the current product backlog.

## Setup

Requires Node.js 20+.

```
# terminal 1 — API server (port 4000)
cd server && npm install && npm run dev

# terminal 2 — client (port 5173)
cd client && npm install && npm run dev
```
