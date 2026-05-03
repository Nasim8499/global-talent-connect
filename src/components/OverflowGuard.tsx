import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Dev-only guard: scans the DOM after every route change and warns about
 * any element causing horizontal overflow (scrollWidth > viewport width).
 * No-op in production builds.
 */
export default function OverflowGuard() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const id = window.setTimeout(() => {
      const vw = document.documentElement.clientWidth;
      const offenders: { tag: string; w: number; cls: string }[] = [];
      document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > vw + 1 || rect.left < -1) {
          // Skip fixed-position floating decorations
          const pos = getComputedStyle(el).position;
          if (pos === 'fixed' || pos === 'absolute') return;
          offenders.push({
            tag: el.tagName.toLowerCase(),
            w: Math.round(rect.width),
            cls: (el.className || '').toString().slice(0, 80),
          });
        }
      });
      if (offenders.length) {
        // eslint-disable-next-line no-console
        console.warn(`[OverflowGuard] ${pathname} → ${offenders.length} overflowing element(s)`, offenders.slice(0, 8));
      }
    }, 350);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
