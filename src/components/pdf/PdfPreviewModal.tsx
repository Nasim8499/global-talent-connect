import { useState } from 'react';
import { X, Download, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PdfPreviewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  pages: React.ReactNode[];
  onDownload?: () => void;
}

export default function PdfPreviewModal({ open, onClose, title, pages, onDownload }: PdfPreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

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
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <button onClick={onClose} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-foreground" />
          </button>
          <div className="text-center flex-1 min-w-0 px-2">
            <p className="text-sm font-semibold text-foreground truncate">{title}</p>
            <p className="text-[10px] text-muted-foreground">Page {currentPage + 1} of {pages.length}</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Printer className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={onDownload}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Download className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-muted/50 p-4 flex items-start justify-center">
          <div className="bg-white shadow-2xl rounded-sm w-full max-w-[595px] min-h-[842px] relative overflow-hidden">
            {pages[currentPage]}
          </div>
        </div>

        {/* Page Navigation */}
        {pages.length > 1 && (
          <div className="flex items-center justify-center gap-4 py-3 bg-card border-t border-border">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentPage ? 'bg-primary w-6' : 'bg-border'
                  }`}
                />
              ))}
            </div>
            <button
              disabled={currentPage === pages.length - 1}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
