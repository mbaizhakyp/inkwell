// server/src/routes/post.routes.js
//
// Wires PostService's publish() and listPublished() to
// the API contract's POST /api/posts and GET /api/posts (Lecture 4).
// Same thin-route discipline as auth.routes.js: no business rules here.

import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/posts", requireAuth, async (req, res) => {
  try {
    // Never trust client-supplied identity fields — derive authorId from
    // the authenticated request (set by requireAuth from the verified JWT),
    // never the request body. Any body authorId is ignored.
    const { title, body, tagNames } = req.body;
    const post = await PostService.publish({ title, body, tagNames, authorId: req.user.id });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({
      error: { code: err.code || "VALIDATION_ERROR", message: err.message },
    });
  }
});

router.get("/posts", async (req, res, next) => {
  try {
    const { page, pageSize, search } = req.query;
    const result = search
      ? await PostService.search({ query: search, page, pageSize })
      : await PostService.listPublished({ page, pageSize });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
