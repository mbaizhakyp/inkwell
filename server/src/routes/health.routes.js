// server/src/routes/health.routes.js
//
// Routes are boundary classes (Lecture 4): they translate
// HTTP requests into calls against Services, and Service results back
// into HTTP responses. This route currently has no Service to call —
// health-check logic is trivial enough to stay in the route itself,
// a deliberate, documented exception, not an oversight.

import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "inkwell-api" });
});

// /api/version predates this refactor (Lecture 1 increment); kept here so
// the refactor does not change externally observable behavior.
router.get("/version", (req, res) => {
  res.status(200).json({ version: "0.1.0" });
});

export default router;
