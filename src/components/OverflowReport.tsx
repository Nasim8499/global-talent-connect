import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Offender {
  tag: string;
  w: number;
  cls: string;
  text: string;
}

/**
 * Dev-only floating overflow report. Shows count + offending elements
 * across the current route. Hidden in production. Toggle with the badge.
 */
export default function OverflowReport() {
  const { pathname } = useLocation();
  const [offenders, setOffenders] = useState<Offender[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const scan = () => {
      const vw = document.documentElement.clientWidth;
      const found: Offender[] = [];
      document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
        if (el.closest('[data-overflow-report]')) return;
        const rect = el.getBoundingClientRect();
        if (rect.right > vw + 1 || rect.left < -1) {
          const pos = getComputedStyle(el).position;
          if (pos === 'fixed' || pos === 'absolute') return;
          found.push({
            tag: el.tagName.toLowerCase(),
            w: Math.round(rect.width),
            cls: (el.className || '').toString().slice(0, 60),
            text: (el.textContent || '').trim().slice(0, 40),
          });
        }
      });
      setOffenders(found.slice(0, 20));
    };

    const id = window.setTimeout(scan, 450);
    const onResize = () => window.setTimeout(scan, 200);
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', onResize);
    };
  }, [pathname]);

  if (!import.meta.env.DEV) return null;

  return (
    <div
      data-overflow-report
      className="fixed bottom-2 left-2 z-[9999] font-mono text-[10px]"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={`px-2 py-1 rounded-md shadow-lg backdrop-blur-sm ${
          offenders.length
            ? 'bg-red-600/90 text-white'
            : 'bg-emerald-600/80 text-white'
        }`}
        title="Overflow report"
      >
        ⤢ {offenders.length}
      </button>
      {open && offenders.length > 0 && (
        <div className="mt-1 max-h-64 w-72 overflow-auto rounded-md bg-black/85 p-2 text-white shadow-2xl">
          <div className="mb-1 text-[10px] opacity-70">{pathname}</div>
          {offenders.map((o, i) => (
            <div key={i} className="border-b border-white/10 py-1">
              <div className="text-amber-300">
                {o.tag} <span className="opacity-60">({o.w}px)</span>
              </div>
              <div className="opacity-70 break-all">{o.cls}</div>
              {o.text && <div className="italic opacity-50">"{o.text}"</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
