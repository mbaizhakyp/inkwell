// server/src/routes/__tests__/posts.access-control.test.js
//
// A01 (Broken Access Control) regression tests for DELETE /api/posts/:id,
// against the real app and test database.

import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { resetDatabase, createTestUser, createTestPost, tokenFor } from "../../test-utils/fixtures.js";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("a user cannot delete another user's post (A01 regression test)", async () => {
  const owner = await createTestUser();
  const attacker = await createTestUser();
  const post = await createTestPost({ authorId: owner.id });

  const res = await request(app)
    .delete(`/api/posts/${post.id}`)
    .set("Authorization", `Bearer ${tokenFor(attacker)}`);

  expect(res.status).toBe(403);
  expect(await prisma.post.findUnique({ where: { id: post.id } })).not.toBeNull();
});

test("the owner can delete their own tagged post (cascade removes its tag links)", async () => {
  const owner = await createTestUser();
  const post = await createTestPost({ authorId: owner.id, tagNames: ["design"] });

  const res = await request(app)
    .delete(`/api/posts/${post.id}`)
    .set("Authorization", `Bearer ${tokenFor(owner)}`);

  expect(res.status).toBe(204);
  expect(await prisma.post.findUnique({ where: { id: post.id } })).toBeNull();
  expect(await prisma.postTag.count({ where: { postId: post.id } })).toBe(0);
});

test("deleting requires authentication", async () => {
  const owner = await createTestUser();
  const post = await createTestPost({ authorId: owner.id });

  const res = await request(app).delete(`/api/posts/${post.id}`);

  expect(res.status).toBe(401);
});

test("deleting a nonexistent post returns 404", async () => {
  const user = await createTestUser();

  const res = await request(app)
    .delete("/api/posts/00000000-0000-0000-0000-000000000000")
    .set("Authorization", `Bearer ${tokenFor(user)}`);

  expect(res.status).toBe(404);
});
