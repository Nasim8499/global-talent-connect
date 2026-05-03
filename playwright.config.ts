import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config — runs against the local Vite dev server.
 * Install browsers once with: `bunx playwright install chromium`
 * Run with: `bunx playwright test`
 *
 * Projects cover the most common phone, phablet, foldable and tablet
 * viewports we have seen real users on. Visual regression baselines are
 * stored per-project under e2e/__screenshots__.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:8080',
    trace: 'retain-on-failure',
  },
  projects: [
    // Compact phones
    { name: 'iphone-se', use: { ...devices['iPhone SE'] } },                     // 375x667
    { name: 'galaxy-s8', use: { ...devices['Galaxy S8'] } },                     // 360x740
    { name: 'android-360', use: { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, userAgent: devices['Pixel 5'].userAgent } },

    // Modern phones
    { name: 'iphone-12', use: { ...devices['iPhone 12'] } },                     // 390x844
    { name: 'iphone-14-pro-max', use: { ...devices['iPhone 14 Pro Max'] } },     // 430x932
    { name: 'pixel-5', use: { ...devices['Pixel 5'] } },                         // 393x851
    { name: 'pixel-7', use: { ...devices['Pixel 7'] } },                         // 412x915

    // Foldables
    { name: 'galaxy-fold', use: { viewport: { width: 280, height: 653 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, userAgent: devices['Pixel 5'].userAgent } },
    { name: 'galaxy-fold-unfolded', use: { viewport: { width: 717, height: 512 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, userAgent: devices['Pixel 5'].userAgent } },

    // Tablets
    { name: 'ipad-mini', use: { ...devices['iPad Mini'] } },                     // 768x1024
    { name: 'ipad-pro-11', use: { ...devices['iPad Pro 11'] } },                 // 834x1194
    { name: 'ipad-landscape', use: { ...devices['iPad (gen 7) landscape'] } },   // 1080x810
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
