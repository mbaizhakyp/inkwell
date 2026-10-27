// server/src/middleware/error-handler.js
//
// A05's fix: never expose stack traces or internal error details to the
// client in production — log them internally instead (A09). Routes map
// the errors they understand (validation, auth) to specific responses and
// pass everything else here.

import { logger } from "../lib/logger.js";

export function errorHandler(err, req, res, next) {
  logger.error({ err, method: req.method, path: req.path }, "Unhandled error");
  const isProd = process.env.NODE_ENV === "production";
  res.status(err.status || 500).json({
    error: {
      code: err.code || "INTERNAL_ERROR",
      message: isProd ? "Something went wrong." : err.message,
    },
  });
}
