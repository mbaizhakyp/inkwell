// server/src/events/listeners/post-stats.listener.js
//
// Second listener (Lecture 9, Exercise 1): counts posts published
// since the server started. Registering it required NO change to
// PostService.publish() — the Observer pattern's payoff.
// ponytail: in-memory counter resets on restart; persist it in the DB
// if stats must survive restarts.

import { EventBus } from "../event-bus.js";

let totalPostsPublished = 0;

EventBus.on("post.published", () => {
  totalPostsPublished += 1;
});

export function getStats() {
  return { totalPostsPublished };
}
