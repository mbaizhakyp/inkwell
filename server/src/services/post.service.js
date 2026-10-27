// server/src/services/post.service.js

import { PostRepository } from "../repositories/post.repository.js";
import { assertNonEmpty, ValidationError } from "../utils/validation.js";
import { SubstringSearchStrategy } from "./search/substring-search.strategy.js";
import { EventBus } from "../events/event-bus.js";

const searchStrategy = SubstringSearchStrategy; // swap this line to change search behavior system-wide

// Lecture 15, Exercise 1 (STRIDE: Denial of Service on GET /api/posts):
// clamp client-controlled paging so no request can make the database load
// an unbounded page. Out-of-range values are clamped, not rejected —
// a too-large pageSize simply returns the largest allowed page.
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function clampPaging({ page, pageSize }) {
  return {
    page: Math.max(1, Math.trunc(Number(page)) || 1),
    pageSize: Math.min(MAX_PAGE_SIZE, Math.max(1, Math.trunc(Number(pageSize)) || DEFAULT_PAGE_SIZE)),
  };
}

export { MAX_PAGE_SIZE };

export const PostService = {
  async publish({ authorId, title, body, tagNames = [] }) {
    assertNonEmpty(title, "title", "MISSING_TITLE");
    assertNonEmpty(body, "body", "MISSING_BODY");
    // Lecture 16 (A05): malformed tags are rejected here as a validation
    // error instead of reaching Prisma and surfacing its internals.
    if (!Array.isArray(tagNames)) {
      throw new ValidationError("tagNames must be an array.", "INVALID_TAGS");
    }
    tagNames.forEach((name) => assertNonEmpty(name, "tag name", "INVALID_TAGS"));

    const post = await PostRepository.createWithTags({
      authorId,
      title,
      body,
      tagNames,
      status: "PUBLISHED",
      publishedAt: new Date(),
    });

    EventBus.emit("post.published", {
      postId: post.id,
      authorId,
      title: post.title,
      tags: tagNames,
    });

    return post;
  },

  async listPublished(paging = {}) {
    const { page, pageSize } = clampPaging(paging);
    const { posts, hasMore } = await PostRepository.findPublished({ page, pageSize });
    return { posts, page, hasMore };
  },

  getById(id) {
    return PostRepository.findById(id);
  },

  delete(id) {
    return PostRepository.deleteById(id);
  },

  async search({ query, ...paging }) {
    return searchStrategy.search(query, clampPaging(paging));
  },
};
