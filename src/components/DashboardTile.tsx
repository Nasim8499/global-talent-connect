import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Play, FileText, Image as ImageIcon, X, Eye } from 'lucide-react';
import { tileGradient, type DashboardTile as TileType } from '@/hooks/useDashboardTiles';

interface Props {
  tile: TileType;
  onUpload: (file: File) => void | Promise<void>;
  onClear: () => void;
  onPreview: () => void;
}

export default function DashboardTile({ tile, onUpload, onClear, onPreview }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);

  const Icon = tile.kind === 'PDF' ? FileText : tile.kind === 'Image' ? ImageIcon : Play;

  const handleFile = (file?: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      // larger files are too big for localStorage; still allow but warn via caption
    }
    void onUpload(file);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="bg-muted/40 rounded-xl overflow-hidden border border-border/50 hover:border-border transition-colors group"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div
        className={`aspect-[4/3] relative flex items-center justify-center cursor-pointer overflow-hidden ${
          tile.dataUrl ? 'bg-black' : `bg-gradient-to-br ${tileGradient(tile.tone)}`
        }`}
        onClick={() => (tile.dataUrl ? onPreview() : inputRef.current?.click())}
      >
        {tile.dataUrl && tile.kind === 'Image' ? (
          <img
            src={tile.dataUrl}
            alt={tile.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : tile.dataUrl && tile.kind === 'PDF' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/90">
            <FileText className="w-12 h-12 mb-1" />
            <span className="text-[10px] font-medium opacity-80">PDF Preview</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-white/80">
            <Upload className="w-8 h-8 mb-1.5" />
            <span className="text-[10px] font-medium">Tap to upload</span>
          </div>
        )}

        {/* Hover overlay with actions */}
        {tile.dataUrl && (
          <motion.div
            initial={false}
            animate={{ opacity: hover ? 1 : 0 }}
            className="absolute inset-0 bg-black/55 flex items-center justify-center gap-2 transition"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center hover:scale-110 transition"
              aria-label="Preview"
            >
              <Eye className="w-4 h-4 text-black" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center hover:scale-110 transition"
              aria-label="Replace"
            >
              <Upload className="w-4 h-4 text-black" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="w-9 h-9 rounded-full bg-destructive flex items-center justify-center hover:scale-110 transition"
              aria-label="Remove"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </motion.div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
          <Icon className="w-3 h-3" />
          {tile.kind}
        </div>
        <p className="text-xs font-semibold text-foreground line-clamp-1">{tile.title}</p>
        {tile.caption && (
          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">{tile.caption}</p>
        )}
      </div>
    </motion.div>
  );
}
