// server/src/app.js
//
// Extracted from index.js so tests (and this file) can import the
// Express app without binding a real port — index.js now only
// handles process startup (app.listen), not app construction.

import express from "express";
import { errorHandler } from "./middleware/error-handler.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import "./events/listeners/log-published-posts.listener.js";
import "./events/listeners/post-stats.listener.js";

export const app = express();
app.disable("x-powered-by"); // A05: don't advertise the server stack

app.use(express.json());
app.use("/api", healthRoutes);
app.use("/api", authRoutes);
app.use("/api", postRoutes);

// Lecture 16 (A05): the shared JSON error contract now lives in its own
// middleware, which hides internal error details in production.
app.use(errorHandler);
