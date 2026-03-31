import { useState, useRef, useCallback } from 'react';
import { X, Download, Printer, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function PdfPreviewModal({ open, onClose, title, pages }: PdfPreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const pagesContainerRef = useRef<HTMLDivElement>(null);
  const visiblePageRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const a4W = 210;
      const a4H = 297;

      // Render each page off-screen
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();

        // Find the page element
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
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: 595,
            height: 842,
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

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/70 flex flex-col"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between px-4 py-3 bg-card border-b border-border"
        >
          <button onClick={onClose} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors active:scale-95">
            <X className="w-5 h-5 text-foreground" />
          </button>
          <div className="text-center flex-1 min-w-0 px-2">
            <p className="text-sm font-semibold text-foreground truncate">{title}</p>
            <p className="text-[10px] text-muted-foreground">Page {currentPage + 1} of {pages.length}</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg hover:bg-muted transition-colors active:scale-95"
            >
              <Printer className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="p-2 rounded-lg hover:bg-muted transition-colors active:scale-95 disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-muted/50 p-4 flex items-start justify-center">
          <div ref={pagesContainerRef}>
            {/* Hidden pages for PDF rendering */}
            <div className="hidden">
              {pages.map((page, i) => (
                <div key={`hidden-${i}`} data-pdf-page={i}>
                  {page}
                </div>
              ))}
            </div>
            {/* Visible current page */}
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              ref={visiblePageRef}
              className="bg-white shadow-2xl rounded-sm w-full max-w-[595px] min-h-[842px] relative overflow-hidden"
            >
              {pages[currentPage]}
            </motion.div>
          </div>
        </div>

        {/* Page Navigation */}
        {pages.length > 1 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-4 py-3 bg-card border-t border-border"
          >
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentPage ? 'bg-primary w-6' : 'bg-border w-2'
                  }`}
                />
              ))}
            </div>
            <button
              disabled={currentPage === pages.length - 1}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Download Banner (mobile) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="md:hidden bg-card border-t border-border px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
        >
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full h-12 rounded-xl gradient-navy text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform disabled:opacity-60"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating PDF…
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download PDF
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
