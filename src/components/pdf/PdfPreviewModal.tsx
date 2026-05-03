import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { X, Download, Printer, ChevronLeft, ChevronRight, Loader2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
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
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

export default function PdfPreviewModal({ open, onClose, title, pages }: PdfPreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [userZoom, setUserZoom] = useState(1);
  const [fitScale, setFitScale] = useState(1);
  const pagesContainerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pinchRef = useRef<{ active: boolean; startDist: number; startZoom: number }>({
    active: false, startDist: 0, startZoom: 1,
  });

  // Page-ready + faux progress for polish
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

  useEffect(() => {
    if (!open) return;
    setCurrentPage(0);
    setUserZoom(1);
  }, [open]);

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

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
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

  // Swipe with momentum
  const onSwipeEnd = useCallback((_: unknown, info: PanInfo) => {
    if (userZoom > 1.05) return;
    const dx = info.offset.x;
    const vx = info.velocity.x;
    // Momentum: distance + velocity threshold
    if (dx < -50 || vx < -350) goNext();
    else if (dx > 50 || vx > 350) goPrev();
  }, [userZoom, goNext, goPrev]);

  // Preload neighbours (render hidden)
  const preloadIndexes = useMemo(() => {
    const set = new Set<number>([currentPage]);
    if (currentPage - 1 >= 0) set.add(currentPage - 1);
    if (currentPage + 1 < pages.length) set.add(currentPage + 1);
    return set;
  }, [currentPage, pages.length]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const a4W = 210;
      const a4H = 297;

      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

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
      document.body.removeChild(container);
      const safeName = title.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '_');
      pdf.save(`${safeName}.pdf`);
      toast.success('PDF downloaded successfully');
    } catch (err) {
      console.error('PDF download failed:', err);
      toast.error('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  }, [pages, title]);

  const handlePrint = useCallback(() => window.print(), []);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 flex flex-col overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {/* Header */}
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between px-3 py-2.5 bg-card/95 backdrop-blur-md border-b border-border min-w-0 relative"
        >
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="p-2 rounded-lg hover:bg-muted transition-colors active:scale-95 flex-shrink-0"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          <div className="text-center flex-1 min-w-0 px-2">
            <p className="text-sm font-semibold text-foreground truncate">{title}</p>
            <p className="text-[10px] text-muted-foreground">
              Page {currentPage + 1} of {pages.length} · {Math.round(effectiveScale * 100)}%
            </p>
          </div>
          <div className="flex gap-0.5 flex-shrink-0">
            <button
              onClick={handlePrint}
              aria-label="Print"
              className="hidden sm:inline-flex p-2 rounded-lg hover:bg-muted transition-colors active:scale-95"
            >
              <Printer className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              aria-label="Download PDF"
              className="p-2 rounded-lg hover:bg-muted transition-colors active:scale-95 disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
          {/* Top progress bar */}
          <AnimatePresence>
            {!pageReady && (
              <motion.div
                key="topbar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 right-0 bottom-0 h-0.5 bg-border/40 overflow-hidden"
              >
                <motion.div
                  className="h-full bg-primary"
                  animate={{ width: `${renderProgress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.25 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Floating Zoom Toolbar — always visible, doesn't intercept gestures */}
        <div className="pointer-events-none absolute z-30 right-3 top-16 sm:top-20">
          <div className="pointer-events-auto frosted rounded-2xl px-2 py-2 flex flex-col items-center gap-1.5 shadow-lifted">
            <button
              onClick={() => setUserZoom(z => Math.min(MAX_ZOOM, +(z + 0.25).toFixed(2)))}
              aria-label="Zoom in"
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
            >
              <ZoomIn className="w-4 h-4 text-foreground" />
            </button>
            <input
              type="range"
              min={MIN_ZOOM * 100}
              max={MAX_ZOOM * 100}
              step={5}
              value={Math.round(userZoom * 100)}
              onChange={(e) => setUserZoom(+(Number(e.target.value) / 100).toFixed(2))}
              aria-label="Zoom level"
              className="h-24 accent-primary cursor-pointer"
              style={{ writingMode: 'vertical-lr' as React.CSSProperties['writingMode'], direction: 'rtl' }}
            />
            <button
              onClick={() => setUserZoom(z => Math.max(MIN_ZOOM, +(z - 0.25).toFixed(2)))}
              aria-label="Zoom out"
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
            >
              <ZoomOut className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={() => setUserZoom(1)}
              aria-label="Reset zoom"
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors active:scale-95"
              title="Reset"
            >
              <Maximize2 className="w-4 h-4 text-foreground" />
            </button>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {Math.round(userZoom * 100)}%
            </span>
          </div>
        </div>

        {/* Page Content */}
        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-auto bg-muted/40 p-2 sm:p-4 flex items-start justify-center min-w-0"
          style={{ touchAction: userZoom > 1.05 ? 'auto' : 'pan-y' }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div ref={pagesContainerRef} className="w-full max-w-[820px] flex justify-center min-w-0">
            {/* Hidden pages for PDF rendering + neighbour preload */}
            <div className="hidden" aria-hidden="true">
              {pages.map((page, i) => (
                <div key={`hidden-${i}`} data-pdf-page={i}>
                  {page}
                </div>
              ))}
            </div>
            {/* Off-screen preload for neighbour pages so swipe-in feels instant */}
            <div
              aria-hidden="true"
              style={{ position: 'absolute', left: -99999, top: 0, width: 595, opacity: 0, pointerEvents: 'none' }}
            >
              {pages.map((p, i) => (preloadIndexes.has(i) && i !== currentPage ? (
                <div key={`preload-${i}`} style={{ width: 595, minHeight: 842 }}>{p}</div>
              ) : null))}
            </div>

            <div
              className="relative w-full"
              style={{
                maxWidth: `${595 * userZoom}px`,
                aspectRatio: '595 / 842',
              }}
            >
              {/* Stronger skeleton */}
              <AnimatePresence>
                {!pageReady && (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 rounded-md skeleton overflow-hidden bg-white/5"
                  >
                    <div className="p-6 sm:p-8 space-y-3 opacity-70">
                      <div className="h-4 w-2/5 bg-background/40 rounded" />
                      <div className="h-2.5 w-1/4 bg-background/30 rounded" />
                      <div className="mt-6 space-y-2">
                        <div className="h-2.5 w-full bg-background/30 rounded" />
                        <div className="h-2.5 w-11/12 bg-background/30 rounded" />
                        <div className="h-2.5 w-5/6 bg-background/30 rounded" />
                        <div className="h-2.5 w-3/4 bg-background/30 rounded" />
                      </div>
                      <div className="mt-8 grid grid-cols-2 gap-3">
                        <div className="h-16 bg-background/25 rounded" />
                        <div className="h-16 bg-background/25 rounded" />
                      </div>
                      <div className="mt-6 space-y-2">
                        <div className="h-2.5 w-full bg-background/30 rounded" />
                        <div className="h-2.5 w-10/12 bg-background/30 rounded" />
                        <div className="h-2.5 w-9/12 bg-background/30 rounded" />
                      </div>
                    </div>
                    {/* Centre progress badge */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="frosted rounded-full px-3 py-1.5 flex items-center gap-2 text-[11px] text-foreground">
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
                  className="absolute inset-0 bg-white rounded-md shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
                >
                  <div
                    className="origin-top-left bg-white"
                    style={{
                      width: '595px',
                      height: '842px',
                      transform: `scale(${effectiveScale})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    {pages[currentPage]}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Controls — page navigation only (zoom moved to floating toolbar) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card/95 backdrop-blur-md border-t border-border px-3 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]"
        >
          <div className="flex items-center justify-center gap-3">
            <button
              disabled={currentPage === 0}
              onClick={goPrev}
              aria-label="Previous page"
              className="h-9 w-9 rounded-xl bg-muted hover:bg-muted/70 transition-colors disabled:opacity-30 active:scale-95 flex items-center justify-center flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {pages.length > 1 && pages.length <= 12 && (
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide max-w-[60vw]">
                {pages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    aria-label={`Go to page ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                      i === currentPage ? 'bg-primary w-6' : 'bg-border w-2'
                    }`}
                  />
                ))}
              </div>
            )}
            {pages.length > 12 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {currentPage + 1} / {pages.length}
              </span>
            )}
            <button
              disabled={currentPage === pages.length - 1}
              onClick={goNext}
              aria-label="Next page"
              className="h-9 w-9 rounded-xl bg-muted hover:bg-muted/70 transition-colors disabled:opacity-30 active:scale-95 flex items-center justify-center flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
