import { test, expect, Page } from '@playwright/test';

/**
 * Horizontal-overflow contract for every key route.
 *
 * For each route + each device viewport (configured in playwright.config.ts),
 * we verify:
 *   1. document.documentElement.scrollWidth <= clientWidth (no page-level scroll)
 *   2. No descendant element extends past the right edge (with 1px tolerance)
 *
 * Offending elements are logged with tag, classes, and width.
 *
 * NOTE: These tests assume the user is authenticated. Provide a session
 * via a Playwright storage state, or seed a test login URL. By default we
 * just probe the public /login route plus the protected routes; protected
 * routes will be redirected to /login but the layout itself is still
 * exercised under the same overflow rules.
 */
const ROUTES = [
  '/login',
  '/drive',
  '/finance',
  '/admin',
  '/owners',
  '/partners',
  '/workers/w1',
];

async function assertNoHorizontalOverflow(page: Page, route: string) {
  const result = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const docScroll = document.documentElement.scrollWidth;
    const offenders: { tag: string; cls: string; w: number; right: number }[] = [];
    document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
      const rect = el.getBoundingClientRect();
      const pos = getComputedStyle(el).position;
      if (pos === 'fixed') return;
      if (rect.right > vw + 1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 80),
          w: Math.round(rect.width),
          right: Math.round(rect.right),
        });
      }
    });
    return { vw, docScroll, offenders: offenders.slice(0, 12) };
  });

  if (result.offenders.length || result.docScroll > result.vw + 1) {
    // eslint-disable-next-line no-console
    console.log(
      `[overflow] ${route} vw=${result.vw} scrollWidth=${result.docScroll}`,
      result.offenders,
    );
  }

  expect(result.docScroll, `${route} document scrollWidth should not exceed viewport`).toBeLessThanOrEqual(result.vw + 1);
  expect(result.offenders, `${route} has horizontally overflowing elements`).toEqual([]);
}

for (const route of ROUTES) {
  test(`no horizontal overflow on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });
    // Stress: also exercise the long-seed flag for the Drive route.
    if (route === '/drive') {
      await page.goto('/drive?seed=long', { waitUntil: 'networkidle' });
    }
    await page.waitForTimeout(400); // allow layout/animations to settle
    await assertNoHorizontalOverflow(page, route);
  });
}
