import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { X, Download, Printer, ChevronLeft, ChevronRight, Loader2, ZoomIn, ZoomOut, Maximize2, Sun, LayoutGrid, Save, Share2 } from 'lucide-react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface PdfPreviewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  pages: React.ReactNode[];
  onDownload?: () => void;
  onSaveDraft?: () => void;
  draftBadge?: string; // e.g. "v3 · 04 May 14:22"
  /** Stable key for persisting per-agreement view state (zoom, page, contrast). Falls back to title. */
  persistKey?: string;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const STORAGE_PREFIX = 'pdfprev:';

// Module-scoped in-memory cache for rendered page nodes (keeps React subtrees alive across reopens)
const pageCache = new Map<string, Map<number, React.ReactNode>>();
function getCacheFor(title: string) {
  let m = pageCache.get(title);
  if (!m) { m = new Map(); pageCache.set(title, m); }
  return m;
}

export default function PdfPreviewModal({ open, onClose, title, pages, onSaveDraft, draftBadge, persistKey }: PdfPreviewModalProps) {
  const storageKey = `${STORAGE_PREFIX}${persistKey ?? title}`;
  const [currentPage, setCurrentPage] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [userZoom, setUserZoom] = useState(1);
  const [fitScale, setFitScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [showThumbs, setShowThumbs] = useState(false);
  const [jumpValue, setJumpValue] = useState('1');
  const pagesContainerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef<{ active: boolean; startDist: number; startZoom: number }>({
    active: false, startDist: 0, startZoom: 1,
  });

  // Restore persisted state on open
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const s = JSON.parse(raw);
        const p = Math.min(Math.max(0, s.page ?? 0), pages.length - 1);
        const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, s.zoom ?? 1));
        const hc = !!s.highContrast;
        setCurrentPage(p);
        setUserZoom(z);
        setHighContrast(hc);
        setJumpValue(String(p + 1));
        return;
      }
    } catch { /* ignore */ }
    setCurrentPage(0);
    setUserZoom(1);
    setJumpValue('1');
  }, [open, storageKey, pages.length]);

  // Persist
  useEffect(() => {
    if (!open) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        page: currentPage, zoom: userZoom, highContrast,
      }));
    } catch { /* ignore */ }
  }, [open, storageKey, currentPage, userZoom, highContrast]);

  // Sync jump input
  useEffect(() => { setJumpValue(String(currentPage + 1)); }, [currentPage]);

  // Page-ready + faux progress
  useEffect(() => {
    if (!open) return;
    setPageReady(false);
    setRenderProgress(8);
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      setRenderProgress((p) => Math.min(92, p + Math.max(4, (95 - p) * 0.18)));
      if (frame > 20) window.clearInterval(id);
    }, 30);
    const t = window.setTimeout(() => {
      setRenderProgress(100);
      setPageReady(true);
    }, 240);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(t);
    };
  }, [open, currentPage]);

  // Fit scale
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const wrapper = pagesContainerRef.current;
      if (!wrapper) return;
      const w = wrapper.clientWidth;
      const fit = Math.min(1, Math.max(0.3, w / 595));
      setFitScale(fit);
    };
    update();
    const ro = new ResizeObserver(update);
    if (pagesContainerRef.current) ro.observe(pagesContainerRef.current);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [open]);

  const effectiveScale = fitScale * userZoom;

  const goPrev = useCallback(() => setCurrentPage(p => Math.max(0, p - 1)), []);
  const goNext = useCallback(() => setCurrentPage(p => Math.min(pages.length - 1, p + 1)), [pages.length]);
  const jumpTo = useCallback((n: number) => {
    const idx = Math.min(Math.max(0, n - 1), pages.length - 1);
    setCurrentPage(idx);
  }, [pages.length]);

  // In-memory page cache — store nodes by index
  const cache = useMemo(() => getCacheFor(title), [title]);
  const getCachedPage = useCallback((i: number) => {
    if (!cache.has(i)) cache.set(i, pages[i]);
    return cache.get(i)!;
  }, [cache, pages]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'Escape') onClose();
      else if (e.key === '+' || e.key === '=') setUserZoom(z => Math.min(MAX_ZOOM, +(z + 0.25).toFixed(2)));
      else if (e.key === '-') setUserZoom(z => Math.max(MIN_ZOOM, +(z - 0.25).toFixed(2)));
      else if (e.key === '0') setUserZoom(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, goPrev, goNext, onClose]);

  // Pinch-to-zoom
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = {
        active: true,
        startDist: Math.hypot(dx, dy),
        startZoom: userZoom,
      };
    }
  }, [userZoom]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current.active) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / pinchRef.current.startDist;
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(pinchRef.current.startZoom * ratio).toFixed(2)));
      setUserZoom(next);
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    pinchRef.current.active = false;
  }, []);

  const onSwipeEnd = useCallback((_: unknown, info: PanInfo) => {
    if (userZoom > 1.05) return;
    const dx = info.offset.x;
    const vx = info.velocity.x;
    if (dx < -50 || vx < -350) goNext();
    else if (dx > 50 || vx > 350) goPrev();
  }, [userZoom, goNext, goPrev]);

  // Preload neighbours
  const preloadIndexes = useMemo(() => {
    const set = new Set<number>([currentPage]);
    if (currentPage - 1 >= 0) set.add(currentPage - 1);
    if (currentPage + 1 < pages.length) set.add(currentPage + 1);
    return set;
  }, [currentPage, pages.length]);

  // Warm cache for preload set
  useEffect(() => {
    preloadIndexes.forEach(i => { if (!cache.has(i)) cache.set(i, pages[i]); });
  }, [preloadIndexes, cache, pages]);

  const buildPdf = useCallback(async (): Promise<jsPDF> => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const a4W = 210;
    const a4H = 297;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);
    try {
      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();
        const allPageEls = pagesContainerRef.current?.querySelectorAll('[data-pdf-page]');
        const pageEl = allPageEls?.[i] as HTMLElement | undefined;
        if (pageEl) {
          const clone = pageEl.cloneNode(true) as HTMLElement;
          clone.style.width = '595px';
          clone.style.minHeight = '842px';
          clone.style.background = 'white';
          clone.style.position = 'relative';
          container.appendChild(clone);
          const canvas = await html2canvas(clone, {
            scale: 2, useCORS: true, backgroundColor: '#ffffff',
            width: 595, height: 842,
          });
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          pdf.addImage(imgData, 'JPEG', 0, 0, a4W, a4H);
          container.removeChild(clone);
        }
      }
    } finally {
      document.body.removeChild(container);
    }
    return pdf;
  }, [pages]);

  const safeFileName = useCallback(() => {
    const safe = title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_');
    return `${safe || 'agreement'}.pdf`;
  }, [title]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const pdf = await buildPdf();
      pdf.save(safeFileName());
      toast.success('PDF downloaded');
    } catch (err) {
      console.error('PDF download failed:', err);
      toast.error('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  }, [buildPdf, safeFileName]);

  const [printing, setPrinting] = useState(false);
  const handlePrint = useCallback(async () => {
    setPrinting(true);
    try {
      const pdf = await buildPdf();
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0'; iframe.style.bottom = '0';
      iframe.style.width = '0'; iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          window.open(url, '_blank');
        }
        setTimeout(() => {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(url);
        }, 60_000);
      };
      toast.success('Opening print dialog…');
    } catch (err) {
      console.error('Print failed:', err);
      toast.error('Failed to print');
    } finally {
      setPrinting(false);
    }
  }, [buildPdf]);

  const [sharing, setSharing] = useState(false);
  const handleShare = useCallback(async () => {
    setSharing(true);
    try {
      const pdf = await buildPdf();
      const blob = pdf.output('blob');
      const file = new File([blob], safeFileName(), { type: 'application/pdf' });
      const navAny = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (navAny.canShare && navAny.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title, text: title });
        toast.success('Shared');
      } else {
        // Fallback: download + copy a URL hint
        pdf.save(safeFileName());
        try { await navigator.clipboard.writeText(title); } catch { /* ignore */ }
        toast.success('Sharing not supported — file downloaded instead');
      }
    } catch (err) {
      const aborted = (err as DOMException)?.name === 'AbortError';
      if (!aborted) {
        console.error('Share failed:', err);
        toast.error('Failed to share');
      }
    } finally {
      setSharing(false);
    }
  }, [buildPdf, safeFileName, title]);

  if (!open) return null;

  // High-contrast palette overrides
  const hc = highContrast;
  const hcChrome = hc ? 'bg-black text-white border-white/40' : 'bg-card/95 text-foreground border-border';
  const hcBtn = hc ? 'hover:bg-white/15 text-white' : 'hover:bg-muted text-foreground';
  const hcSubtle = hc ? 'text-white/80' : 'text-muted-foreground';
  const hcFloat = hc ? 'bg-black border border-white/40 text-white' : 'frosted text-foreground';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-[100] flex flex-col overflow-hidden ${hc ? 'bg-black' : 'bg-black/80'}`}
        style={{ touchAction: 'none' }}
      >
        {/* Header */}
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`flex items-center justify-between px-3 py-2.5 backdrop-blur-md border-b min-w-0 relative ${hcChrome}`}
        >
          <button onClick={onClose} aria-label="Close preview" className={`p-2 rounded-lg transition-colors active:scale-95 flex-shrink-0 ${hcBtn}`}>
            <X className="w-5 h-5" />
          </button>
          <div className="text-center flex-1 min-w-0 px-2">
            <p className="text-sm font-semibold truncate">{title}</p>
            <p className={`text-[10px] ${hcSubtle}`}>
              Page {currentPage + 1} of {pages.length} · {Math.round(effectiveScale * 100)}%
              {draftBadge ? <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-brand-gold/15 text-brand-gold font-medium">{draftBadge}</span> : null}
            </p>
          </div>
          <div className="flex gap-0.5 flex-shrink-0 items-center">
            {/* Quick jump */}
            <form
              onSubmit={(e) => { e.preventDefault(); const n = parseInt(jumpValue, 10); if (!isNaN(n)) jumpTo(n); }}
              className="hidden sm:flex items-center gap-1 mr-1"
            >
              <input
                type="number"
                min={1}
                max={pages.length}
                value={jumpValue}
                onChange={(e) => setJumpValue(e.target.value)}
                onBlur={() => { const n = parseInt(jumpValue, 10); if (!isNaN(n)) jumpTo(n); }}
                aria-label="Jump to page"
                className={`w-12 h-8 text-xs text-center rounded-md border tabular-nums outline-none ${hc ? 'bg-black border-white/40 text-white' : 'bg-background border-border text-foreground'}`}
              />
              <span className={`text-[10px] ${hcSubtle}`}>/ {pages.length}</span>
            </form>
            <button
              onClick={() => setShowThumbs(v => !v)}
              aria-label="Toggle thumbnails"
              aria-pressed={showThumbs}
              className={`p-2 rounded-lg transition-colors active:scale-95 ${hcBtn} ${showThumbs ? (hc ? 'bg-white/15' : 'bg-muted') : ''}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setHighContrast(v => !v)}
              aria-label="Toggle high contrast"
              aria-pressed={highContrast}
              className={`p-2 rounded-lg transition-colors active:scale-95 ${hcBtn} ${hc ? 'bg-white/15' : ''}`}
              title="High contrast"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button onClick={handlePrint} disabled={printing} aria-label="Print" className={`hidden sm:inline-flex p-2 rounded-lg transition-colors active:scale-95 disabled:opacity-50 ${hcBtn}`}>
              {printing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            </button>
            <button onClick={handleShare} disabled={sharing} aria-label="Share" className={`hidden sm:inline-flex p-2 rounded-lg transition-colors active:scale-95 disabled:opacity-50 ${hcBtn}`}>
              {sharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            </button>
            {onSaveDraft && (
              <button onClick={onSaveDraft} aria-label="Save as draft" title="Save as draft" className={`p-2 rounded-lg transition-colors active:scale-95 ${hcBtn}`}>
                <Save className="w-4 h-4" />
              </button>
            )}
            <button onClick={handleDownload} disabled={downloading} aria-label="Download PDF" className={`hidden sm:inline-flex p-2 rounded-lg transition-colors active:scale-95 disabled:opacity-50 ${hcBtn}`}>
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            </button>
          </div>
          <AnimatePresence>
            {!pageReady && (
              <motion.div
                key="topbar"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className={`absolute left-0 right-0 bottom-0 h-0.5 overflow-hidden ${hc ? 'bg-white/20' : 'bg-border/40'}`}
              >
                <motion.div
                  className={hc ? 'h-full bg-white' : 'h-full bg-primary'}
                  animate={{ width: `${renderProgress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.25 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Floating Zoom Toolbar */}
        <div className="pointer-events-none absolute z-30 right-3 top-16 sm:top-20">
          <div className={`pointer-events-auto rounded-2xl px-2 py-2 flex flex-col items-center gap-1.5 shadow-lifted ${hcFloat}`}>
            <button onClick={() => setUserZoom(z => Math.min(MAX_ZOOM, +(z + 0.25).toFixed(2)))} aria-label="Zoom in" className={`p-1.5 rounded-lg transition-colors active:scale-95 ${hc ? 'hover:bg-white/15' : 'hover:bg-white/10'}`}>
              <ZoomIn className="w-4 h-4" />
            </button>
            <input
              type="range" min={MIN_ZOOM * 100} max={MAX_ZOOM * 100} step={5}
              value={Math.round(userZoom * 100)}
              onChange={(e) => setUserZoom(+(Number(e.target.value) / 100).toFixed(2))}
              aria-label="Zoom level"
              className={`h-24 cursor-pointer ${hc ? 'accent-white' : 'accent-primary'}`}
              style={{ writingMode: 'vertical-lr' as React.CSSProperties['writingMode'], direction: 'rtl' }}
            />
            <button onClick={() => setUserZoom(z => Math.max(MIN_ZOOM, +(z - 0.25).toFixed(2)))} aria-label="Zoom out" className={`p-1.5 rounded-lg transition-colors active:scale-95 ${hc ? 'hover:bg-white/15' : 'hover:bg-white/10'}`}>
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={() => setUserZoom(1)} aria-label="Reset zoom" title="Reset" className={`p-1.5 rounded-lg transition-colors active:scale-95 ${hc ? 'hover:bg-white/15' : 'hover:bg-white/10'}`}>
              <Maximize2 className="w-4 h-4" />
            </button>
            <span className={`text-[10px] tabular-nums ${hcSubtle}`}>{Math.round(userZoom * 100)}%</span>
          </div>
        </div>

        {/* Page Content */}
        <div
          ref={scrollAreaRef}
          className={`flex-1 overflow-auto p-2 sm:p-4 flex items-start justify-center min-w-0 ${hc ? 'bg-black' : 'bg-muted/40'}`}
          style={{ touchAction: userZoom > 1.05 ? 'auto' : 'pan-y' }}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        >
          <div ref={pagesContainerRef} className="w-full max-w-[820px] flex justify-center min-w-0">
            <div className="hidden" aria-hidden="true">
              {pages.map((page, i) => (<div key={`hidden-${i}`} data-pdf-page={i}>{page}</div>))}
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', left: -99999, top: 0, width: 595, opacity: 0, pointerEvents: 'none' }}>
              {pages.map((p, i) => (preloadIndexes.has(i) && i !== currentPage ? (
                <div key={`preload-${i}`} style={{ width: 595, minHeight: 842 }}>{getCachedPage(i)}</div>
              ) : null))}
            </div>

            <div className="relative w-full" style={{ maxWidth: `${595 * userZoom}px`, aspectRatio: '595 / 842' }}>
              <AnimatePresence>
                {!pageReady && (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className={`absolute inset-0 rounded-md overflow-hidden ${hc ? 'bg-white/10' : 'skeleton bg-white/5'}`}
                  >
                    <div className="p-6 sm:p-8 space-y-3 opacity-70">
                      <div className={`h-4 w-2/5 rounded ${hc ? 'bg-white/40' : 'bg-background/40'}`} />
                      <div className={`h-2.5 w-1/4 rounded ${hc ? 'bg-white/30' : 'bg-background/30'}`} />
                      <div className="mt-6 space-y-2">
                        {[11,11,10,9].map((w,i) => <div key={i} className={`h-2.5 rounded ${hc ? 'bg-white/30' : 'bg-background/30'}`} style={{ width: `${w*8}%` }} />)}
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`rounded-full px-3 py-1.5 flex items-center gap-2 text-[11px] ${hcFloat}`}>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Rendering… {Math.round(renderProgress)}%
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 40, scale: 0.985 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.985 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 32, mass: 0.8 }}
                  drag={pages.length > 1 && userZoom <= 1.05 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.22}
                  dragMomentum
                  onDragEnd={onSwipeEnd}
                  className={`absolute inset-0 bg-white rounded-md overflow-hidden cursor-grab active:cursor-grabbing ${hc ? 'shadow-[0_0_0_2px_white]' : 'shadow-2xl'}`}
                >
                  <div className="origin-top-left bg-white" style={{ width: '595px', height: '842px', transform: `scale(${effectiveScale})`, transformOrigin: 'top left' }}>
                    {getCachedPage(currentPage)}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        <AnimatePresence>
          {showThumbs && pages.length > 1 && (
            <motion.div
              initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`backdrop-blur-md border-t ${hcChrome}`}
            >
              <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-2">
                {pages.map((p, i) => (
                  <button
                    key={`thumb-${i}`}
                    onClick={() => setCurrentPage(i)}
                    aria-label={`Go to page ${i + 1}`}
                    aria-current={i === currentPage}
                    className={`relative flex-shrink-0 rounded-md overflow-hidden border-2 transition-all active:scale-95 ${i === currentPage ? (hc ? 'border-white' : 'border-primary') : (hc ? 'border-white/30' : 'border-border')}`}
                    style={{ width: 64, height: Math.round(64 * 842 / 595) }}
                  >
                    <div className="absolute inset-0 bg-white overflow-hidden">
                      <div style={{ width: 595, height: 842, transform: `scale(${64 / 595})`, transformOrigin: 'top left' }}>
                        {getCachedPage(i)}
                      </div>
                    </div>
                    <span className={`absolute bottom-0 right-0 text-[9px] px-1 rounded-tl tabular-nums ${hc ? 'bg-black text-white' : 'bg-black/60 text-white'}`}>{i + 1}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`backdrop-blur-md border-t px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] ${hcChrome}`}
        >
          <div className="flex items-center justify-center gap-3">
            <button disabled={currentPage === 0} onClick={goPrev} aria-label="Previous page" className={`h-9 w-9 rounded-xl transition-colors disabled:opacity-30 active:scale-95 flex items-center justify-center flex-shrink-0 ${hc ? 'bg-white/10 hover:bg-white/20' : 'bg-muted hover:bg-muted/70'}`}>
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Mobile quick-jump input */}
            <form
              onSubmit={(e) => { e.preventDefault(); const n = parseInt(jumpValue, 10); if (!isNaN(n)) jumpTo(n); (e.currentTarget.querySelector('input') as HTMLInputElement)?.blur(); }}
              className="sm:hidden flex items-center gap-1"
            >
              <input
                type="number" min={1} max={pages.length}
                value={jumpValue}
                onChange={(e) => setJumpValue(e.target.value)}
                onBlur={() => { const n = parseInt(jumpValue, 10); if (!isNaN(n)) jumpTo(n); }}
                aria-label="Jump to page"
                className={`w-12 h-8 text-xs text-center rounded-md border tabular-nums outline-none ${hc ? 'bg-black border-white/40 text-white' : 'bg-background border-border text-foreground'}`}
              />
              <span className={`text-[10px] ${hcSubtle}`}>/ {pages.length}</span>
            </form>

            {pages.length > 1 && pages.length <= 12 && (
              <div className="hidden sm:flex gap-1.5 overflow-x-auto scrollbar-hide max-w-[60vw]">
                {pages.map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i)} aria-label={`Go to page ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 flex-shrink-0 ${i === currentPage ? (hc ? 'bg-white w-6' : 'bg-primary w-6') : (hc ? 'bg-white/30 w-2' : 'bg-border w-2')}`}
                  />
                ))}
              </div>
            )}
            {pages.length > 12 && (
              <span className={`hidden sm:inline text-xs tabular-nums ${hcSubtle}`}>{currentPage + 1} / {pages.length}</span>
            )}
            <button disabled={currentPage === pages.length - 1} onClick={goNext} aria-label="Next page" className={`h-9 w-9 rounded-xl transition-colors disabled:opacity-30 active:scale-95 flex items-center justify-center flex-shrink-0 ${hc ? 'bg-white/10 hover:bg-white/20' : 'bg-muted hover:bg-muted/70'}`}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile one-tap action bar (hidden on sm+ since header has the buttons) */}
          <div className="sm:hidden mt-2.5 grid grid-cols-3 gap-2">
            <button
              onClick={handlePrint}
              disabled={printing}
              aria-label="Print PDF"
              className={`h-11 rounded-xl flex items-center justify-center gap-1.5 text-xs font-medium active:scale-[0.97] transition-all disabled:opacity-50 ${hc ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-muted hover:bg-muted/70 text-foreground'}`}
            >
              {printing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              <span>Print</span>
            </button>
            <button
              onClick={handleShare}
              disabled={sharing}
              aria-label="Share PDF"
              className={`h-11 rounded-xl flex items-center justify-center gap-1.5 text-xs font-medium active:scale-[0.97] transition-all disabled:opacity-50 ${hc ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-muted hover:bg-muted/70 text-foreground'}`}
            >
              {sharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
              <span>Share</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              aria-label="Download PDF"
              className={`h-11 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold active:scale-[0.97] transition-all disabled:opacity-50 ${hc ? 'bg-white text-black hover:bg-white/90' : 'bg-primary text-primary-foreground hover:opacity-90'}`}
            >
              {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>Save</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
