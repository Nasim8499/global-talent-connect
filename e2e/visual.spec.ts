import { test, expect, Page } from '@playwright/test';

/**
 * Visual regression + overflow contract.
 *
 * For each route + device project we:
 *   1. Take a full-page screenshot and diff it against the saved baseline
 *      (per project, stored under e2e/__screenshots__/visual.spec.ts/...).
 *   2. Re-assert no horizontal overflow at the document or element level.
 *
 * Update baselines after intentional changes:
 *   bunx playwright test e2e/visual.spec.ts --update-snapshots
 */
const ROUTES = [
  { name: 'drive', path: '/drive' },
  { name: 'finance', path: '/finance' },
  { name: 'admin', path: '/admin' },
  { name: 'owners', path: '/owners' },
  { name: 'partners', path: '/partners' },
  { name: 'worker-detail', path: '/workers/w1' },
];

async function assertNoOverflow(page: Page, label: string) {
  const result = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const docScroll = document.documentElement.scrollWidth;
    const offenders: { tag: string; cls: string; right: number }[] = [];
    document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
      if (getComputedStyle(el).position === 'fixed') return;
      const rect = el.getBoundingClientRect();
      if (rect.right > vw + 1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 80),
          right: Math.round(rect.right),
        });
      }
    });
    return { vw, docScroll, offenders: offenders.slice(0, 10) };
  });
  expect(result.docScroll, `${label} scrollWidth ≤ viewport`).toBeLessThanOrEqual(result.vw + 1);
  expect(result.offenders, `${label} no overflowing elements`).toEqual([]);
}

for (const route of ROUTES) {
  test(`visual + overflow — ${route.name}`, async ({ page }, testInfo) => {
    await page.goto(route.path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500); // settle layout/animations
    await assertNoOverflow(page, route.name);
    await expect(page).toHaveScreenshot(`${route.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
    testInfo.annotations.push({ type: 'route', description: route.path });
  });
}
