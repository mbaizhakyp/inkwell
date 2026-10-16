// server/src/services/__tests__/post.service.test.js

import { jest } from "@jest/globals";

const mockPostRepository = { createWithTags: jest.fn(), searchPublished: jest.fn() };
const mockEventBus = { emit: jest.fn() };

jest.unstable_mockModule("../../repositories/post.repository.js", () => ({
  PostRepository: mockPostRepository,
}));
jest.unstable_mockModule("../../events/event-bus.js", () => ({
  EventBus: mockEventBus,
}));

const { PostService } = await import("../post.service.js");

beforeEach(() => {
  jest.clearAllMocks();
});

test("publish() creates a PUBLISHED post and emits post.published", async () => {
  mockPostRepository.createWithTags.mockResolvedValue({ id: "p1", title: "Hello", status: "PUBLISHED" });

  const post = await PostService.publish({ authorId: "u1", title: "Hello", body: "World" });

  expect(post.status).toBe("PUBLISHED");
  expect(mockEventBus.emit).toHaveBeenCalledWith(
    "post.published",
    expect.objectContaining({ postId: "p1" })
  );
});

test("publish() rejects an empty title", async () => {
  await expect(
    PostService.publish({ authorId: "u1", title: "", body: "World" })
  ).rejects.toThrow();
});

// Lecture 12, Exercise 1: test cases for PostService.search()
// (table in the Workshop 12 submission report; rows referenced below).
describe("PostService.search", () => {
  test("returns matching posts for a query with results (row 1, black-box valid partition)", async () => {
    const posts = [{ id: "p1", title: "On Modularity" }];
    mockPostRepository.searchPublished.mockResolvedValue({ posts, hasMore: false });

    const result = await PostService.search({ query: "modularity" });

    expect(result.posts).toEqual(posts);
    expect(result.hasMore).toBe(false);
  });

  test("returns an empty list, not an error, when nothing matches (row 2, black-box empty partition)", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({ posts: [], hasMore: false });

    const result = await PostService.search({ query: "zzz-no-match" });

    expect(result.posts).toEqual([]);
  });

  test("defaults to page 1 and pageSize 10 when not given (row 3, boundary/defaults)", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({ posts: [], hasMore: false });

    await PostService.search({ query: "anything" });

    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({
      query: "anything",
      page: 1,
      pageSize: 10,
    });
  });

  test("passes explicit paging through to the strategy's repository call (row 4, white-box delegation)", async () => {
    mockPostRepository.searchPublished.mockResolvedValue({ posts: [], hasMore: true });

    await PostService.search({ query: "q", page: 3, pageSize: 5 });

    expect(mockPostRepository.searchPublished).toHaveBeenCalledWith({
      query: "q",
      page: 3,
      pageSize: 5,
    });
  });
});
