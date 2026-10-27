// server/src/repositories/post.repository.js

import { prisma } from "../db/client.js";
import { toPublicUser } from "../dto/user.dto.js";

export const PostRepository = {
  create({ authorId, title, body, status, publishedAt }) {
    return prisma.post.create({
      data: { authorId, title, body, status, publishedAt },
    });
  },

  createWithTags({ authorId, title, body, tagNames, status, publishedAt }) {
    return prisma.post.create({
      data: {
        authorId,
        title,
        body,
        status,
        publishedAt,
        tags: {
          create: tagNames.map((name) => ({
            tag: { connectOrCreate: { where: { name }, create: { name } } },
          })),
        },
      },
      include: { tags: { include: { tag: true } } },
    });
  },

  searchPublished({ query, page, pageSize }) {
    return findPublishedPage(
      {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { body: { contains: query, mode: "insensitive" } },
        ],
      },
      { page, pageSize }
    );
  },

  findById(id) {
    return prisma.post.findUnique({ where: { id } });
  },

  deleteById(id) {
    return prisma.post.delete({ where: { id } });
  },

  findPublished({ page, pageSize }) {
    return findPublishedPage({ status: "PUBLISHED" }, { page, pageSize });
  },
};

// Shared by the feed and search (Lecture 15): includes each post's author
// and passes it through the allowlist DTO, so neither query can leak an
// author's email or passwordHash.
async function findPublishedPage(where, { page, pageSize }) {
  const rows = await prisma.post.findMany({
    where,
    include: { author: true },
    orderBy: { publishedAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize + 1, // fetch one extra row to compute hasMore
  });
  const hasMore = rows.length > pageSize;
  return {
    posts: rows.slice(0, pageSize).map((post) => ({ ...post, author: toPublicUser(post.author) })),
    hasMore,
  };
}
