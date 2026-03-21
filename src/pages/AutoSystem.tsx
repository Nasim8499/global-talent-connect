import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, CheckCircle2, Scan, ArrowRight,
  User, Hash, Briefcase, MapPin, Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type Stage = 'upload' | 'scanning' | 'preview' | 'done';

const extractedFields = [
  { icon: User, label: 'Full Name', value: 'AKTER MD JUBAYER' },
  { icon: Hash, label: 'Passport No.', value: 'B01234567' },
  { icon: MapPin, label: 'Nationality', value: 'Bangladeshi' },
  { icon: Briefcase, label: 'Suggested Job', value: 'General Worker' },
  { icon: Hash, label: 'Generated ID', value: 'WKR-2026-0009' },
];

export default function AutoSystem() {
  const [stage, setStage] = useState<Stage>('upload');

  const handleUpload = async () => {
    setStage('scanning');
    await new Promise(r => setTimeout(r, 2000));
    setStage('preview');
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
      <div className="flex items-center gap-2 mt-6 mb-8">
        {['Upload', 'Scan', 'Preview', 'Create'].map((step, i) => {
          const stageIdx = ['upload', 'scanning', 'preview', 'done'].indexOf(stage);
          const active = i <= stageIdx;
          return (
            <div key={step} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                active ? 'gradient-blue text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs font-medium hidden md:block ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</span>
              {i < 3 && <div className={`flex-1 h-0.5 rounded ${active ? 'bg-brand-blue' : 'bg-border'}`} />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {stage === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={handleUpload}
              className="w-full card-elevated border-2 border-dashed border-brand-blue/30 rounded-3xl p-10 flex flex-col items-center gap-4 hover:border-brand-blue/60 hover:bg-brand-blue/[0.02] transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
                <Upload className="w-7 h-7 text-brand-blue" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Upload Passport or Document</p>
                <p className="text-xs text-muted-foreground mt-1">Tap to upload or take a photo</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground">PDF</span>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground">JPG</span>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground">PNG</span>
              </div>
            </button>

            <button
              onClick={handleUpload}
              className="w-full mt-3 card-elevated p-4 flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:bg-muted transition-colors active:scale-[0.97] rounded-2xl"
            >
              <Camera className="w-4 h-4 text-brand-blue" /> Scan with Camera
            </button>
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
            <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center animate-pulse">
              <Scan className="w-8 h-8 text-brand-blue" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Scanning Document…</p>
              <p className="text-xs text-muted-foreground mt-1">Extracting fields and metadata</p>
            </div>
            <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full gradient-blue rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
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
              </div>
              <div className="space-y-3">
                {extractedFields.map((field) => (
                  <div key={field.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <field.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground">{field.label}</p>
                      <p className="text-sm font-medium text-foreground">{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-elevated p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Auto Actions</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-foreground"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> Create worker record</p>
                <p className="flex items-center gap-2 text-foreground"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> Rename file → WKR-2026-0009_PASSPORT.pdf</p>
                <p className="flex items-center gap-2 text-foreground"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> Store in Workers/WKR-2026-0009/</p>
                <p className="flex items-center gap-2 text-foreground"><CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> Generate worker agreement</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStage('upload')}
                variant="outline"
                className="flex-1 h-12 rounded-xl"
              >
                Re-scan
              </Button>
              <Button
                onClick={() => setStage('done')}
                className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground hover:bg-navy-light active:scale-[0.97]"
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
            <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-brand-green" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Record Created</h3>
            <p className="text-sm text-muted-foreground">Worker WKR-2026-0009 has been registered and all files organized.</p>
            <Button onClick={() => setStage('upload')} className="mt-2 rounded-xl bg-primary text-primary-foreground hover:bg-navy-light">
              Process Another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
