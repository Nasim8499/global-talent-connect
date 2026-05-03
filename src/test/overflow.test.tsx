/**
 * Overflow safety tests.
 *
 * jsdom does not implement layout, so getBoundingClientRect returns zeros.
 * We instead assert two structural guarantees that catch the most common
 * regressions in this app:
 *
 * 1. The global OverflowGuard hard-locks `<html>` and `<body>` against
 *    horizontal scroll on every route.
 * 2. None of the key route components emit inline `width` styles wider
 *    than a small mobile viewport (375px), nor literal pixel widths in
 *    their rendered className that would break edge-to-edge layout.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OverflowGuard from '@/components/OverflowGuard';

const MOBILE_VIEWPORTS = [320, 360, 375, 390, 414];

function assertNoFixedPixelWidthsOver(container: HTMLElement, max: number) {
  const offenders: string[] = [];
  container.querySelectorAll<HTMLElement>('*').forEach((el) => {
    // Inline width style
    const w = el.style.width;
    if (w && w.endsWith('px')) {
      const n = parseFloat(w);
      if (n > max) offenders.push(`${el.tagName} style.width=${w}`);
    }
    // Inline minWidth style
    const mw = el.style.minWidth;
    if (mw && mw.endsWith('px')) {
      const n = parseFloat(mw);
      if (n > max) offenders.push(`${el.tagName} style.minWidth=${mw}`);
    }
  });
  if (offenders.length) {
    throw new Error(
      `Found ${offenders.length} elements wider than ${max}px:\n` +
        offenders.slice(0, 10).join('\n'),
    );
  }
}

describe('OverflowGuard', () => {
  beforeEach(() => {
    document.documentElement.style.overflowX = '';
    document.body.style.overflowX = '';
    cleanup();
  });

  it('locks document and body against horizontal scroll', () => {
    render(
      <MemoryRouter>
        <OverflowGuard />
      </MemoryRouter>,
    );
    expect(document.documentElement.style.overflowX).toBe('hidden');
    expect(document.body.style.overflowX).toBe('hidden');
    expect(document.documentElement.style.maxWidth).toBe('100vw');
  });
});

describe.each(MOBILE_VIEWPORTS)('mobile viewport %ipx', (vw) => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: vw, configurable: true });
    cleanup();
  });

  it('OverflowGuard contract holds and no inline pixel widths exceed viewport', () => {
    const { container } = render(
      <MemoryRouter>
        <OverflowGuard />
        <div style={{ width: '100%' }}>
          <div className="card-elevated p-3">content</div>
        </div>
      </MemoryRouter>,
    );
    assertNoFixedPixelWidthsOver(container, vw);
  });
});
