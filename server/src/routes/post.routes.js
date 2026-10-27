// server/src/routes/post.routes.js
//
// Wires PostService's publish() and listPublished() to
// the API contract's POST /api/posts and GET /api/posts (Lecture 4).
// Same thin-route discipline as auth.routes.js: no business rules here.

import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { ValidationError } from "../utils/validation.js";

const router = Router();

router.post("/posts", requireAuth, async (req, res, next) => {
  try {
    // Never trust client-supplied identity fields — derive authorId from
    // the authenticated request (set by requireAuth from the verified JWT),
    // never the request body. Any body authorId is ignored.
    const { title, body, tagNames } = req.body;
    const post = await PostService.publish({ title, body, tagNames, authorId: req.user.id });
    res.status(201).json(post);
  } catch (err) {
    // A05: only our own validation errors are safe to echo back; anything
    // else (e.g. a Prisma error) goes to errorHandler, never to the client.
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: { code: err.code, message: err.message } });
    }
    next(err);
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

// A01 (Lecture 16): deletion is ownership-checked from day one. Being
// logged in (requireAuth) proves WHO you are; this check decides WHAT
// you may do — authentication is not authorization.
router.delete("/posts/:id", requireAuth, async (req, res, next) => {
  try {
    const post = await PostService.getById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Post not found." } });
    }
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "You can only delete your own posts." } });
    }

    await PostService.delete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
