import { useState, useRef, useCallback, DragEvent, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FolderOpen, Grid3X3, List, Search, MoreVertical,
  FileText, Image as ImageIcon, File, Trash2, Eye, Download,
  Plus, CloudUpload, Pencil, X, Check,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import DocumentViewer from '@/components/DocumentViewer';
import { isLongSeedActive, LONG_FILENAMES } from '@/data/longSeeds';
import { smartFilename, sanitizeBase, inferTypeFromName, typeBadgeFor } from '@/lib/smartFilename';

interface DriveFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  size: string;
  date: string;
  folder: string;
  url: string;
  thumbnail?: string;
}

const folders = [
  { id: 'all', label: 'All Files', icon: FolderOpen, color: 'bg-brand-blue/10 text-brand-blue' },
  { id: 'agreements', label: 'Agreements', icon: FileText, color: 'bg-primary/10 text-primary' },
  { id: 'passports', label: 'Passports', icon: ImageIcon, color: 'bg-brand-gold/10 text-brand-gold' },
  { id: 'visas', label: 'Visas', icon: File, color: 'bg-brand-green/10 text-brand-green' },
  { id: 'receipts', label: 'Receipts', icon: FileText, color: 'bg-amber-100 text-amber-700' },
];

const demoFiles: DriveFile[] = [
  { id: 'f1', name: 'Partnership_Agreement_2026.pdf', type: 'pdf', size: '2.4 MB', date: '2026-03-15', folder: 'agreements', url: '', thumbnail: '' },
  { id: 'f2', name: 'Worker_Contract_Rahman.pdf', type: 'pdf', size: '1.8 MB', date: '2026-03-10', folder: 'agreements', url: '', thumbnail: '' },
  { id: 'f3', name: 'Passport_Mohammad_Rahman.jpg', type: 'image', size: '3.1 MB', date: '2026-01-15', folder: 'passports', url: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800', thumbnail: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=200' },
  { id: 'f4', name: 'Visa_SG_Abdul_Karim.pdf', type: 'pdf', size: '0.9 MB', date: '2026-02-20', folder: 'visas', url: '', thumbnail: '' },
  { id: 'f5', name: 'Payment_Receipt_Jan2026.pdf', type: 'pdf', size: '0.5 MB', date: '2026-01-30', folder: 'receipts', url: '', thumbnail: '' },
  { id: 'f6', name: 'Passport_Abdul_Karim.jpg', type: 'image', size: '2.9 MB', date: '2026-01-20', folder: 'passports', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800', thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200' },
  { id: 'f7', name: 'Employer_Contract_Hyundai.pdf', type: 'pdf', size: '3.2 MB', date: '2026-01-08', folder: 'agreements', url: '', thumbnail: '' },
  { id: 'f8', name: 'Medical_Report_Batch01.pdf', type: 'pdf', size: '4.1 MB', date: '2026-02-10', folder: 'visas', url: '', thumbnail: '' },
];

const fileIcons: Record<string, typeof FileText> = { pdf: FileText, image: ImageIcon, document: File };
const fileColors: Record<string, string> = { pdf: 'bg-red-50 text-red-500', image: 'bg-brand-blue/10 text-brand-blue', document: 'bg-muted text-muted-foreground' };

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

function processFiles(fileList: FileList): DriveFile[] {
  return Array.from(fileList).map((file) => {
    const isPdf = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');
    const url = URL.createObjectURL(file);
    return {
      id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      type: isPdf ? 'pdf' : isImage ? 'image' : 'document' as const,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: new Date().toISOString().split('T')[0],
      folder: isPdf ? 'agreements' : isImage ? 'passports' : 'agreements',
      url,
      thumbnail: isImage ? url : undefined,
    };
  });
}

export default function Drive() {
  const longSeed = useMemo(() => isLongSeedActive(), []);
  const [files, setFiles] = useState<DriveFile[]>(() => {
    if (!isLongSeedActive()) return demoFiles;
    const extras: DriveFile[] = LONG_FILENAMES.map((name, idx) => ({
      id: `long-${idx}`,
      name,
      type: inferTypeFromName(name),
      size: `${(2 + idx * 0.7).toFixed(1)} MB`,
      date: '2026-04-01',
      folder: idx % 2 === 0 ? 'agreements' : 'visas',
      url: '',
    }));
    return [...extras, ...demoFiles];
  });
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [activeFolder, setActiveFolder] = useState('all');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerFile, setViewerFile] = useState<{ name: string; type: 'pdf' | 'image'; url: string } | null>(null);
  const [contextMenu, setContextMenu] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<DriveFile | null>(null);
  const [renameInput, setRenameInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (longSeed) toast.info('Long-seed mode active — stress-testing layout');
  }, [longSeed]);

  const renamePreview = useMemo(() => {
    if (!renaming) return '';
    return smartFilename({ base: renameInput || renaming.name, type: renaming.type });
  }, [renameInput, renaming]);

  const filtered = files.filter(f => {
    const matchFolder = activeFolder === 'all' || f.folder === activeFolder;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchFolder && matchSearch;
  });

  const addFiles = useCallback((fileList: FileList) => {
    const newFiles = processFiles(fileList);
    setFiles(prev => [...newFiles, ...prev]);
    toast.success(`${newFiles.length} file(s) uploaded`);
  }, []);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  }, [addFiles]);

  // Drag & drop handlers
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const openFile = useCallback((f: DriveFile) => {
    if (f.type === 'image' || f.url) {
      setViewerFile({ name: f.name, type: f.type === 'image' ? 'image' : 'pdf', url: f.url || '' });
      setViewerOpen(true);
    } else {
      toast.info('Preview not available for this file type');
    }
  }, []);

  const deleteFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setContextMenu(null);
    toast.success('File deleted');
  }, []);

  const startRename = useCallback((f: DriveFile) => {
    setRenaming(f);
    setRenameInput(sanitizeBase(f.name));
    setContextMenu(null);
  }, []);

  const commitRename = useCallback(() => {
    if (!renaming) return;
    const next = smartFilename({ base: renameInput || renaming.name, type: renaming.type });
    setFiles(prev => prev.map(f => (f.id === renaming.id ? { ...f, name: next } : f)));
    setRenaming(null);
    toast.success('File renamed');
  }, [renaming, renameInput]);

  return (
    <div
      className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 max-w-4xl mx-auto relative min-h-[80vh]"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 backdrop-blur-sm"
            style={{ pointerEvents: 'none' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-4 p-10 rounded-3xl border-2 border-dashed border-primary/40 bg-primary/5"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <CloudUpload className="w-16 h-16 text-primary/60" />
              </motion.div>
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">Drop files here</p>
                <p className="text-sm text-muted-foreground mt-1">PDF, JPG, PNG — any document</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div {...fade} transition={{ duration: 0.5 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Drive</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{files.length} files</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="p-2.5 rounded-xl bg-card border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
          >
            {view === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </motion.button>
        </div>
      </motion.div>

      {/* Folder Tabs */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.05 }} className="mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 sm:-mx-4 px-3 sm:px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory touch-pan-x" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
          {folders.map((folder) => {
            const count = folder.id === 'all' ? files.length : files.filter(f => f.folder === folder.id).length;
            return (
              <motion.button
                key={folder.id}
                whileTap={{ scale: 0.93 }}
                onClick={() => setActiveFolder(folder.id)}
                className={`flex-shrink-0 snap-start flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  activeFolder === folder.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card text-muted-foreground border border-border/50 hover:bg-muted'
                }`}
              >
                <folder.icon className="w-3.5 h-3.5" />
                {folder.label} ({count})
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Search + Upload */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.1 }} className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card border-border/50"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current?.click()}
          className="h-11 px-4 rounded-xl gradient-navy text-white text-sm font-medium flex items-center gap-2 active:scale-95 transition-transform"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span>
        </motion.button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </motion.div>

      {/* Files Grid/List */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.15 }} className="mt-5">
        {view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((file, i) => {
                const Icon = fileIcons[file.type] || File;
                return (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: 0.02 * i, duration: 0.3 }}
                    className="relative group"
                  >
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openFile(file)}
                      className="w-full card-elevated is-flush overflow-hidden text-left transition-shadow hover:shadow-lifted"
                    >
                      <div className="aspect-[4/3] bg-muted/50 flex items-center justify-center overflow-hidden relative">
                        {file.type === 'image' && file.thumbnail ? (
                          <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className={`w-12 h-12 rounded-xl ${fileColors[file.type]} flex items-center justify-center`}>
                            <Icon className="w-6 h-6" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Eye className="w-6 h-6 text-white drop-shadow-lg" />
                        </div>
                        {/* Type badge — always visible so labels never need to repeat extension */}
                        <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-sm">
                          {file.name.split('.').pop()?.slice(0, 4)}
                        </span>
                      </div>
                      <div className="p-2.5 sm:p-3 min-w-0">
                        <p
                          className="text-[11px] sm:text-xs font-medium text-foreground leading-tight break-all line-clamp-2"
                          title={file.name}
                        >
                          {file.name}
                        </p>
                        <div className="flex items-center justify-between mt-1.5 gap-1">
                          <span className="text-[10px] text-muted-foreground truncate">{file.size}</span>
                          <span className="text-[10px] text-muted-foreground truncate">{new Date(file.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </motion.button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setContextMenu(contextMenu === file.id ? null : file.id); }}
                      aria-label="File actions"
                      className="absolute top-1.5 right-1.5 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-black/55 text-white opacity-90 md:opacity-70 transition-opacity active:scale-90 flex items-center justify-center backdrop-blur-sm"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {contextMenu === file.id && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9]"
                            onClick={() => setContextMenu(null)}
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute top-10 right-2 bg-card border border-border rounded-xl shadow-lifted z-10 overflow-hidden min-w-[140px]"
                          >
                            <button onClick={() => { openFile(file); setContextMenu(null); }} className="flex items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-muted w-full transition-colors">
                              <Eye className="w-3.5 h-3.5" /> Preview
                            </button>
                            <button onClick={() => { setContextMenu(null); toast.info('Download started'); }} className="flex items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-muted w-full transition-colors">
                              <Download className="w-3.5 h-3.5" /> Download
                            </button>
                            <button onClick={() => deleteFile(file.id)} className="flex items-center gap-2 px-3 py-2.5 text-xs text-destructive hover:bg-destructive/5 w-full transition-colors">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-1.5">
            <AnimatePresence mode="popLayout">
              {filtered.map((file, i) => {
                const Icon = fileIcons[file.type] || File;
                return (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ delay: 0.02 * i, duration: 0.25 }}
                  >
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openFile(file)}
                      className="w-full card-elevated p-3.5 flex items-center gap-3 text-left hover:shadow-lifted transition-shadow active:scale-[0.99]"
                    >
                      {file.type === 'image' && file.thumbnail ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={file.thumbnail} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-lg ${fileColors[file.type]} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{file.size} • {new Date(file.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                        className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <FolderOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-medium">No files found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Upload or drag & drop PDFs and images</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-5 py-2.5 rounded-xl gradient-navy text-white text-sm font-medium inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Upload Files
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Upload FAB (mobile) */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => fileInputRef.current?.click()}
        className="md:hidden fixed bottom-28 right-4 w-14 h-14 rounded-2xl gradient-gold shadow-lifted flex items-center justify-center z-50"
      >
        <Upload className="w-6 h-6 text-primary" />
      </motion.button>

      {/* Document Viewer */}
      <DocumentViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        file={viewerFile}
      />
    </div>
  );
}
