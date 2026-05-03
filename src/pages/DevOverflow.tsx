import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, RefreshCw, Crosshair } from 'lucide-react';

/**
 * Dev-only overflow report page.
 *
 * Routes through the app are sampled in an iframe. For each one we:
 *   - measure document.scrollWidth vs. clientWidth
 *   - find every element whose right edge exceeds the viewport
 *   - let the user tap an offender to scroll-and-flash it inside the iframe
 *
 * Mounted at /dev/overflow only when import.meta.env.DEV is true.
 */

interface Offender {
  index: number;
  tag: string;
  cls: string;
  text: string;
  width: number;
  right: number;
  selector: string;
}

interface RouteReport {
  path: string;
  vw: number;
  scrollWidth: number;
  offenders: Offender[];
  scannedAt: number;
}

const ROUTES = [
  '/',
  '/workers',
  '/workers/w1',
  '/projects',
  '/auto',
  '/finance',
  '/agreements',
  '/admin',
  '/settings',
  '/owners',
  '/partners',
  '/drive',
  '/drive?seed=long',
  '/more',
];

const VIEWPORTS = [
  { label: '320', w: 320 },
  { label: '360', w: 360 },
  { label: '390', w: 390 },
  { label: '414', w: 414 },
  { label: '768', w: 768 },
];

function buildSelector(el: Element): string {
  const parts: string[] = [];
  let cur: Element | null = el;
  let depth = 0;
  while (cur && cur.nodeType === 1 && depth < 4) {
    let part = cur.tagName.toLowerCase();
    if (cur.id) {
      part += `#${cur.id}`;
      parts.unshift(part);
      break;
    }
    const cls = (cur.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
    if (cls) part += `.${cls}`;
    const parent = cur.parentElement;
    if (parent) {
      const idx = Array.from(parent.children).indexOf(cur);
      part += `:nth-child(${idx + 1})`;
    }
    parts.unshift(part);
    cur = cur.parentElement;
    depth++;
  }
  return parts.join(' > ');
}

function scanIframe(iframe: HTMLIFrameElement, path: string): RouteReport | null {
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) return null;
  const vw = doc.documentElement.clientWidth;
  const scrollWidth = doc.documentElement.scrollWidth;
  const offenders: Offender[] = [];
  doc.querySelectorAll<HTMLElement>('body *').forEach((el, i) => {
    if (win.getComputedStyle(el).position === 'fixed') return;
    const rect = el.getBoundingClientRect();
    if (rect.right > vw + 1) {
      offenders.push({
        index: i,
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 100),
        text: (el.textContent || '').trim().slice(0, 60),
        width: Math.round(rect.width),
        right: Math.round(rect.right),
        selector: buildSelector(el),
      });
    }
  });
  return {
    path,
    vw,
    scrollWidth,
    offenders: offenders.slice(0, 50),
    scannedAt: Date.now(),
  };
}

export default function DevOverflow() {
  const { pathname } = useLocation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [vw, setVw] = useState(390);
  const [reports, setReports] = useState<Record<string, RouteReport>>({});
  const [active, setActive] = useState<string>(ROUTES[0]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!import.meta.env.DEV) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        This page is only available in development.
      </div>
    );
  }

  const totalOffenders = useMemo(
    () => Object.values(reports).reduce((n, r) => n + r.offenders.length, 0),
    [reports],
  );
  const overflowingRoutes = useMemo(
    () => Object.values(reports).filter((r) => r.offenders.length > 0 || r.scrollWidth > r.vw + 1),
    [reports],
  );
  const current = reports[active];

  const loadInIframe = (path: string) =>
    new Promise<void>((resolve) => {
      const iframe = iframeRef.current;
      if (!iframe) return resolve();
      const onLoad = () => {
        iframe.removeEventListener('load', onLoad);
        // give the route a moment to settle
        setTimeout(resolve, 450);
      };
      iframe.addEventListener('load', onLoad);
      iframe.src = path;
    });

  const scanAll = async () => {
    setScanning(true);
    setProgress(0);
    const next: Record<string, RouteReport> = {};
    for (let i = 0; i < ROUTES.length; i++) {
      const r = ROUTES[i];
      await loadInIframe(r);
      const report = iframeRef.current ? scanIframe(iframeRef.current, r) : null;
      if (report) next[r] = report;
      setProgress(Math.round(((i + 1) / ROUTES.length) * 100));
    }
    setReports(next);
    setScanning(false);
    setActive(ROUTES[0]);
    await loadInIframe(ROUTES[0]);
  };

  const rescanCurrent = async () => {
    await loadInIframe(active);
    const report = iframeRef.current ? scanIframe(iframeRef.current, active) : null;
    if (report) setReports((p) => ({ ...p, [active]: report }));
  };

  const focusOffender = (o: Offender) => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc) return;
    const all = doc.querySelectorAll<HTMLElement>('body *');
    const el = all[o.index];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const prevOutline = el.style.outline;
    const prevBg = el.style.backgroundColor;
    el.style.outline = '3px dashed #ef4444';
    el.style.backgroundColor = 'rgba(239,68,68,0.18)';
    setTimeout(() => {
      el.style.outline = prevOutline;
      el.style.backgroundColor = prevBg;
    }, 2200);
  };

  return (
    <div className="px-3 py-4 sm:p-6 max-w-7xl mx-auto" key={pathname}>
      <header className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">Overflow Report (dev)</h1>
          <p className="text-xs text-muted-foreground">
            Scans every route in an embedded preview. {Object.keys(reports).length}/{ROUTES.length} scanned ·{' '}
            <span className={overflowingRoutes.length ? 'text-destructive' : 'text-emerald-500'}>
              {overflowingRoutes.length} route(s) overflow
            </span>{' '}
            · {totalOffenders} offending element(s)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={vw}
            onChange={(e) => setVw(Number(e.target.value))}
            className="form-control h-9 w-auto text-xs"
          >
            {VIEWPORTS.map((v) => (
              <option key={v.label} value={v.w}>
                {v.label}px
              </option>
            ))}
          </select>
          <button
            onClick={scanAll}
            disabled={scanning}
            className="h-9 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-medium inline-flex items-center gap-1.5 disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? `Scanning ${progress}%` : 'Scan all routes'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_360px] gap-3">
        {/* Route list */}
        <aside className="card-elevated p-2 max-h-[70vh] overflow-y-auto">
          <ul className="space-y-1">
            {ROUTES.map((r) => {
              const rep = reports[r];
              const bad = rep && (rep.offenders.length > 0 || rep.scrollWidth > rep.vw + 1);
              return (
                <li key={r}>
                  <button
                    onClick={async () => {
                      setActive(r);
                      await loadInIframe(r);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between gap-2 ${
                      active === r ? 'bg-primary/10 text-primary' : 'hover:bg-muted/40'
                    }`}
                  >
                    <span className="truncate">{r}</span>
                    {rep ? (
                      bad ? (
                        <span className="inline-flex items-center gap-1 text-destructive">
                          <AlertTriangle className="w-3 h-3" />
                          {rep.offenders.length}
                        </span>
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      )
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Preview */}
        <section className="card-elevated p-2">
          <div className="flex items-center justify-between px-1 pb-2">
            <div className="text-[11px] text-muted-foreground font-mono truncate">{active}</div>
            <button
              onClick={rescanCurrent}
              className="text-[11px] text-primary inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Rescan
            </button>
          </div>
          <div className="bg-background/40 rounded-xl p-2 overflow-auto">
            <iframe
              ref={iframeRef}
              title="overflow-preview"
              src={active}
              style={{ width: vw, height: 720, border: '1px solid hsl(var(--border))', borderRadius: 12, background: 'white' }}
            />
          </div>
        </section>

        {/* Offender list */}
        <aside className="card-elevated p-3 max-h-[70vh] overflow-y-auto">
          <h2 className="text-sm font-semibold mb-2">Offenders</h2>
          {!current && <p className="text-xs text-muted-foreground">Run a scan to populate this route.</p>}
          {current && (
            <>
              <div className="text-[11px] text-muted-foreground mb-2 font-mono">
                vw={current.vw} · scrollW={current.scrollWidth}
                {current.scrollWidth > current.vw + 1 && (
                  <span className="text-destructive"> · page scrolls horizontally</span>
                )}
              </div>
              {current.offenders.length === 0 ? (
                <p className="text-xs text-emerald-500 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> No offenders.
                </p>
              ) : (
                <ul className="space-y-2">
                  {current.offenders.map((o) => (
                    <li key={o.index}>
                      <button
                        onClick={() => focusOffender(o)}
                        className="w-full text-left p-2 rounded-lg bg-destructive/10 hover:bg-destructive/15 text-[11px] font-mono break-all"
                      >
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="text-destructive font-semibold">{o.tag}</span>
                          <span className="text-muted-foreground">{o.width}px → {o.right}</span>
                        </div>
                        <div className="opacity-70">{o.cls}</div>
                        {o.text && <div className="italic opacity-60 mt-0.5">"{o.text}"</div>}
                        <div className="mt-1 inline-flex items-center gap-1 text-primary">
                          <Crosshair className="w-3 h-3" /> tap to highlight
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          <div className="mt-3 pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
            <Link to="/" className="text-primary">← Back to app</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
