import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config — runs against the local Vite dev server.
 * Install browsers once with: `bunx playwright install chromium`
 * Run with: `bunx playwright test`
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:8080',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'iphone-se', use: { ...devices['iPhone SE'] } },
    { name: 'iphone-12', use: { ...devices['iPhone 12'] } },
    { name: 'pixel-5', use: { ...devices['Pixel 5'] } },
    { name: 'galaxy-s8', use: { ...devices['Galaxy S8'] } },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'bun run dev',
        port: 8080,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
