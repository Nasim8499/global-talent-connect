import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, CheckCircle2, Scan, ArrowRight,
  User, Hash, Briefcase, MapPin, Camera, RotateCcw,
  FolderOpen, FileCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Stage = 'upload' | 'scanning' | 'preview' | 'done';

const extractedFields = [
  { icon: User, label: 'Full Name', value: 'AKTER MD JUBAYER' },
  { icon: Hash, label: 'Passport No.', value: 'B01234567' },
  { icon: MapPin, label: 'Nationality', value: 'Bangladeshi' },
  { icon: Briefcase, label: 'Suggested Job', value: 'General Worker' },
  { icon: Hash, label: 'Generated ID', value: 'WKR-2026-0009' },
];

const autoActions = [
  { label: 'Create worker record', icon: User, done: true },
  { label: 'Rename file → WKR-2026-0009_PASSPORT.pdf', icon: FileCheck, done: true },
  { label: 'Store in Workers/WKR-2026-0009/', icon: FolderOpen, done: true },
  { label: 'Generate worker agreement', icon: FileText, done: true },
];

export default function AutoSystem() {
  const [stage, setStage] = useState<Stage>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (name?: string) => {
    setFileName(name || 'passport_scan.pdf');
    setStage('scanning');
    await new Promise(r => setTimeout(r, 2500));
    setStage('preview');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file.name);
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-xl font-bold text-foreground">Auto System</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Upload, extract, and create records automatically</p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 mt-6 mb-8"
      >
        {['Upload', 'Scan', 'Preview', 'Create'].map((step, i) => {
          const stageIdx = ['upload', 'scanning', 'preview', 'done'].indexOf(stage);
          const active = i <= stageIdx;
          return (
            <div key={step} className="flex items-center gap-2 flex-1">
              <motion.div
                animate={active ? { scale: [1, 1.15, 1] } : {}}
                transition={{ delay: 0.2, duration: 0.3 }}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                  active ? 'gradient-blue text-white shadow-glow' : 'bg-muted text-muted-foreground'
                }`}
              >
                {i + 1}
              </motion.div>
              <span className={`text-xs font-medium hidden md:block transition-colors ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</span>
              {i < 3 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: active ? 1 : 0.3 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`flex-1 h-0.5 rounded origin-left ${active ? 'bg-brand-blue' : 'bg-border'}`}
                />
              )}
            </div>
          );
        })}
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleFileSelect}
      />

      <AnimatePresence mode="wait">
        {stage === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`w-full card-elevated border-2 border-dashed rounded-3xl p-10 flex flex-col items-center gap-4 transition-all duration-300 cursor-pointer ${
                dragOver ? 'border-brand-blue bg-brand-blue/5 scale-[1.02]' : 'border-brand-blue/30 hover:border-brand-blue/60 hover:bg-brand-blue/[0.02]'
              }`}
            >
              <motion.div
                animate={dragOver ? { scale: 1.1, rotate: 5 } : {}}
                className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center"
              >
                <Upload className="w-7 h-7 text-brand-blue" />
              </motion.div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Upload Passport or Document</p>
                <p className="text-xs text-muted-foreground mt-1">Tap to upload, drag & drop, or take a photo</p>
              </div>
              <div className="flex gap-2">
                {['PDF', 'JPG', 'PNG'].map(fmt => (
                  <span key={fmt} className="text-[10px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{fmt}</span>
                ))}
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleUpload('camera_capture.jpg')}
              className="w-full mt-3 card-elevated p-4 flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:bg-muted transition-colors active:scale-[0.97] rounded-2xl"
            >
              <Camera className="w-4 h-4 text-brand-blue" /> Scan with Camera
            </motion.button>
          </motion.div>
        )}

        {stage === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card-elevated p-10 flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center"
            >
              <Scan className="w-8 h-8 text-brand-blue" />
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Scanning Document…</p>
              <p className="text-xs text-muted-foreground mt-1">Extracting fields from {fileName}</p>
            </div>
            <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-blue rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}

        {stage === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-4"
          >
            <div className="card-elevated p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-brand-green" />
                <h3 className="text-sm font-bold text-foreground">Extracted Fields</h3>
                <span className="ml-auto text-[10px] text-muted-foreground">from {fileName}</span>
              </div>
              <div className="space-y-3">
                {extractedFields.map((field, i) => (
                  <motion.div
                    key={field.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <field.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground">{field.label}</p>
                      <p className="text-sm font-medium text-foreground">{field.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="card-elevated p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Auto Actions</h3>
              <div className="space-y-2">
                {autoActions.map((action, i) => (
                  <motion.p
                    key={action.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                    {action.label}
                  </motion.p>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStage('upload')}
                variant="outline"
                className="flex-1 h-12 rounded-xl"
              >
                <RotateCcw className="w-4 h-4 mr-1" /> Re-scan
              </Button>
              <Button
                onClick={() => {
                  setStage('done');
                  toast.success('Worker record created successfully');
                }}
                className="flex-1 h-12 rounded-xl gradient-navy text-white hover:opacity-90 active:scale-[0.97]"
              >
                Confirm & Create <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {stage === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-elevated p-10 flex flex-col items-center gap-4 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center"
            >
              <CheckCircle2 className="w-8 h-8 text-brand-green" />
            </motion.div>
            <h3 className="text-lg font-bold text-foreground">Record Created</h3>
            <p className="text-sm text-muted-foreground">Worker WKR-2026-0009 has been registered and all files organized.</p>
            <div className="flex gap-3 mt-2">
              <Button
                onClick={() => setStage('upload')}
                variant="outline"
                className="rounded-xl"
              >
                <RotateCcw className="w-4 h-4 mr-1" /> Process Another
              </Button>
              <Button
                onClick={() => toast.info('View worker profile coming soon')}
                className="rounded-xl gradient-navy text-white hover:opacity-90"
              >
                View Worker
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
