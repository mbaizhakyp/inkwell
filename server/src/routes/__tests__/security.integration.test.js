// server/src/routes/__tests__/security.integration.test.js
//
// Lecture 15: each THREAT-MODEL.md mitigation proven end to end against the
// real app and test database. Functional tests check the system CAN do what
// we expect; these check it CANNOT do what we never intended.

import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { createTestUser, resetDatabase } from "../../test-utils/fixtures.js";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

async function register(email, displayName) {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ email, displayName, password: "correcthorse" });
  return res.body; // { user, accessToken, refreshToken }
}

test("Spoofing: POST /api/posts without a token is rejected with 401", async () => {
  const res = await request(app).post("/api/posts").send({ title: "t", body: "b" });

  expect(res.status).toBe(401);
  expect(res.body.error.code).toBe("UNAUTHENTICATED");
});

test("Spoofing: a forged authorId in the body is ignored — the post belongs to the token's user", async () => {
  const alice = await register("alice@example.com", "Alice");
  const bob = await register("bob@example.com", "Bob");

  const res = await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${alice.accessToken}`)
    .send({ authorId: bob.user.id, title: "Not by Bob", body: "Forged." });

  expect(res.status).toBe(201);
  expect(res.body.authorId).toBe(alice.user.id);
});

test("Information disclosure: the feed exposes only the author's id and displayName", async () => {
  const alice = await register("alice@example.com", "Alice");
  await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${alice.accessToken}`)
    .send({ title: "Hello", body: "World" });

  const feed = await request(app).get("/api/posts");

  expect(feed.body.posts[0].author).toEqual({ id: alice.user.id, displayName: "Alice" });
});

test("Denial of service / broken auth: the 6th consecutive failed login for one account is rate limited", async () => {
  await register("victim@example.com", "Victim");

  const statuses = [];
  for (let i = 0; i < 6; i++) {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "victim@example.com", password: "wrong-guess" });
    statuses.push(res.status);
  }

  expect(statuses).toEqual([401, 401, 401, 401, 401, 429]);
});

// Lecture 15, Exercise 1: an oversized pageSize is clamped end to end.
test("Denial of service: GET /api/posts clamps an oversized pageSize to 50", async () => {
  const author = await createTestUser();
  await prisma.post.createMany({
    data: Array.from({ length: 60 }, (_, i) => ({
      authorId: author.id,
      title: `Post ${i}`,
      body: "Bulk.",
      status: "PUBLISHED",
      publishedAt: new Date(),
    })),
  });

  const res = await request(app).get("/api/posts?pageSize=1000000");

  expect(res.status).toBe(200);
  expect(res.body.posts).toHaveLength(50);
  expect(res.body.hasMore).toBe(true);
});
