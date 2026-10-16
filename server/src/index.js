// server/src/index.js
//
// Process startup only — the Express app itself lives in app.js so
// tests can import it without starting a live server (Lecture 13).

import "dotenv/config";
import { app } from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Inkwell API listening on port ${PORT}`);
});
