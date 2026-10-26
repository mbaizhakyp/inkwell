// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
  },

  // Chromium only: the viewport matrix lives in publish-flow.spec.js.
  // ponytail: add firefox/webkit projects (and `npx playwright install`)
  // when cross-engine coverage matters — Lecture 18's CI is the natural point.
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Start both dev servers before the tests (reused if already running) */
  webServer: [
    {
      command: "npm run dev",
      cwd: "./server",
      port: 4000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run dev",
      cwd: "./client",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
