import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, Download, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface DocumentViewerProps {
  open: boolean;
  onClose: () => void;
  file: {
    name: string;
    type: 'pdf' | 'image';
    url: string;
    pages?: string[]; // for multi-page, array of image URLs
  } | null;
}

export default function DocumentViewer({ open, onClose, file }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const pages = file?.pages?.length ? file.pages : file ? [file.url] : [];
  const totalPages = pages.length;

  const handleZoomIn = useCallback(() => setZoom(z => Math.min(z + 0.25, 3)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(z - 0.25, 0.5)), []);
  const handleRotate = useCallback(() => setRotation(r => (r + 90) % 360), []);

  const handleSwipe = useCallback((_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 60) {
      if (info.offset.x < 0 && currentPage < totalPages - 1) {
        setCurrentPage(p => p + 1);
      } else if (info.offset.x > 0 && currentPage > 0) {
        setCurrentPage(p => p - 1);
      }
    }
  }, [currentPage, totalPages]);

  const handleDownload = useCallback(() => {
    if (!file) return;
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    a.click();
  }, [file]);

  if (!open || !file) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 flex flex-col"
      >
        {/* Top Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="flex items-center justify-between px-3 py-2.5 bg-black/60 backdrop-blur-md border-b border-white/10"
        >
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors active:scale-95">
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="text-center flex-1 min-w-0 px-2">
            <p className="text-sm font-medium text-white truncate">{file.name}</p>
            {totalPages > 1 && (
              <p className="text-[10px] text-white/50">Page {currentPage + 1} of {totalPages}</p>
            )}
          </div>
          <div className="flex gap-0.5">
            <button onClick={handleDownload} className="p-2 rounded-lg hover:bg-white/10 transition-colors active:scale-95">
              <Download className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </motion.div>

        {/* Canvas Area */}
        <div ref={containerRef} className="flex-1 overflow-auto flex items-center justify-center p-4 touch-pan-y">
          <motion.div
            key={currentPage}
            drag={totalPages > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleSwipe}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="cursor-grab active:cursor-grabbing"
          >
            {file.type === 'image' ? (
              <img
                src={pages[currentPage]}
                alt={file.name}
                className="max-w-full max-h-[calc(100vh-180px)] object-contain rounded-lg shadow-2xl select-none"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease',
                }}
                draggable={false}
              />
            ) : (
              <div
                className="bg-white rounded-lg shadow-2xl overflow-hidden"
                style={{
                  width: `${Math.min(595 * zoom, window.innerWidth - 32)}px`,
                  minHeight: '400px',
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease',
                }}
              >
                <img
                  src={pages[currentPage]}
                  alt={`${file.name} page ${currentPage + 1}`}
                  className="w-full h-auto select-none"
                  draggable={false}
                />
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-black/60 backdrop-blur-md border-t border-white/10 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
        >
          <div className="flex items-center justify-center gap-3 max-w-sm mx-auto">
            {/* Zoom Controls */}
            <button onClick={handleZoomOut} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors active:scale-95">
              <ZoomOut className="w-4 h-4 text-white" />
            </button>
            <span className="text-xs text-white/60 w-12 text-center font-mono">{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors active:scale-95">
              <ZoomIn className="w-4 h-4 text-white" />
            </button>

            <div className="w-px h-6 bg-white/20" />

            {/* Rotate */}
            <button onClick={handleRotate} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors active:scale-95">
              <RotateCw className="w-4 h-4 text-white" />
            </button>

            {/* Page nav */}
            {totalPages > 1 && (
              <>
                <div className="w-px h-6 bg-white/20" />
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Page dots */}
          {totalPages > 1 && (
            <div className="flex gap-1.5 justify-center mt-2.5">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentPage ? 'bg-white w-5' : 'bg-white/30 w-1.5'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
