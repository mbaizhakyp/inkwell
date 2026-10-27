// server/src/middleware/__tests__/error-handler.test.js
//
// A05: in production the client gets a generic message — the real error
// (which may contain query dumps, file paths, or stack traces) is only logged.

import { jest } from "@jest/globals";

const mockLogger = { error: jest.fn() };
jest.unstable_mockModule("../../lib/logger.js", () => ({ logger: mockLogger }));

const { errorHandler } = await import("../error-handler.js");

function fakeRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

const req = { method: "POST", path: "/api/posts" };
const originalEnv = process.env.NODE_ENV;

afterEach(() => {
  process.env.NODE_ENV = originalEnv;
});

test("hides internal error details from the client in production, but logs them", () => {
  process.env.NODE_ENV = "production";
  const err = new Error("Invalid `prisma.post.create()` invocation: ...");
  const res = fakeRes();

  errorHandler(err, req, res, () => {});

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    error: { code: "INTERNAL_ERROR", message: "Something went wrong." },
  });
  expect(mockLogger.error).toHaveBeenCalledWith(expect.objectContaining({ err }), "Unhandled error");
});

test("shows the message outside production, to keep local debugging easy", () => {
  process.env.NODE_ENV = "development";
  const res = fakeRes();

  errorHandler(new Error("boom"), req, res, () => {});

  expect(res.json).toHaveBeenCalledWith({ error: { code: "INTERNAL_ERROR", message: "boom" } });
});
