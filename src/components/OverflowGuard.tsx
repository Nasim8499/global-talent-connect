import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global overflow guard.
 *
 * Production: defensively forces `<html>` and `<body>` to never scroll
 * horizontally (belt-and-braces over CSS). Cheap, no DOM scan.
 *
 * Development: also scans the DOM after every route change and on resize,
 * marking offenders with `data-overflow-offender="true"` (visible via the
 * dashed outline in index.css) and logging them to the console.
 */
export default function OverflowGuard() {
  const { pathname } = useLocation();

  // Always-on hard lock against horizontal scroll.
  useEffect(() => {
    const lock = () => {
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.maxWidth = '100vw';
      document.body.style.maxWidth = '100vw';
    };
    lock();
    window.addEventListener('resize', lock);
    return () => window.removeEventListener('resize', lock);
  }, []);

  // Dev-only DOM scan to surface offenders.
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const scan = () => {
      const vw = document.documentElement.clientWidth;
      const offenders: { tag: string; w: number; cls: string }[] = [];
      // Clear previous flags
      document.querySelectorAll('[data-overflow-offender="true"]').forEach((el) => {
        el.removeAttribute('data-overflow-offender');
      });
      document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > vw + 1 || rect.left < -1) {
          const pos = getComputedStyle(el).position;
          if (pos === 'fixed' || pos === 'absolute') return;
          el.setAttribute('data-overflow-offender', 'true');
          offenders.push({
            tag: el.tagName.toLowerCase(),
            w: Math.round(rect.width),
            cls: (el.className || '').toString().slice(0, 80),
          });
        }
      });
      if (offenders.length) {
        // eslint-disable-next-line no-console
        console.warn(
          `[OverflowGuard] ${pathname} → ${offenders.length} overflowing element(s)`,
          offenders.slice(0, 10),
        );
      }
    };

    const id = window.setTimeout(scan, 350);
    const onResize = () => window.setTimeout(scan, 150);
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', onResize);
    };
  }, [pathname]);

  return null;
}
