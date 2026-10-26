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

Requires Node.js 22+ (see server/package.json engines) and Docker.

```
# PostgreSQL (one-time; later just: docker start inkwell-postgres)
docker run --name inkwell-postgres \
  -e POSTGRES_USER=inkwell -e POSTGRES_PASSWORD=inkwell \
  -e POSTGRES_DB=inkwell_dev -p 5432:5432 -d postgres:16
# "port is already allocated"? Another Postgres owns 5432 — publish on a
# free port instead (e.g. -p 5433:5432) and use that port in every
# DATABASE_URL below.

# server environment (gitignored; copy the example and set your DB URL)
cp server/.env.example server/.env
# e.g. DATABASE_URL="postgresql://inkwell:inkwell@localhost:5432/inkwell_dev"

# install (postinstall runs `prisma generate`) and apply migrations
cd server && npm install && npx prisma migrate dev

# terminal 1 — API server (port 4000)
cd server && npm run dev

# terminal 2 — client (port 5173)
cd client && npm install && npm run dev
```

## Running the tests

The server's integration tests (Lecture 13) use a dedicated database,
`inkwell_test`, so test runs never touch development data. One-time setup:

```
# create the test database
docker exec inkwell-postgres psql -U inkwell -d inkwell_dev \
  -c "CREATE DATABASE inkwell_test"

# create server/.env.test (gitignored, same rule as .env) pointing at it:
#   DATABASE_URL="postgresql://inkwell:inkwell@localhost:5432/inkwell_test"

# apply migrations to the test database (the explicit DATABASE_URL matters —
# without it, prisma reads .env and migrates inkwell_dev instead)
cd server && DATABASE_URL="postgresql://inkwell:inkwell@localhost:5432/inkwell_test" \
  npx prisma migrate deploy --schema=prisma/schema.prisma
```

Then:

```
cd server && npm test         # unit + integration (Jest/Supertest, loads .env.test)
cd client && npx vitest run   # component tests (RTL)
```

End-to-end and accessibility tests (Lecture 14) run from the repo root
with Playwright. They start both dev servers automatically (or reuse
running ones) and use the dev database. One-time setup:

```
npm install                          # repo root: Playwright + axe-core
npx playwright install chromium
npx playwright test                  # mobile/tablet/desktop publish flow + axe scan
```
