// server/src/middleware/rate-limit.middleware.js
import rateLimit from "express-rate-limit";

// Example security requirement, now enforced in code:
// "the system shall reject login attempts after five consecutive
// failures from the same account within ten minutes."
// Keyed by account (email) and counting only failed attempts, as the
// requirement states — a per-IP limit would also throttle legitimate
// users sharing one address (and the E2E suite, which signs in
// repeatedly from localhost).
// ponytail: in-memory store, per process; move to a shared store (e.g.
// Redis) when the API runs on more than one instance (Lecture 19-20).
export const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => String(req.body?.email ?? "").toLowerCase(),
  message: { error: { code: "TOO_MANY_ATTEMPTS", message: "Too many attempts. Try again later." } },
  standardHeaders: true,
  legacyHeaders: false,
});
