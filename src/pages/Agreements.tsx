import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Eye, Search, History, Trash2, RefreshCw, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { demoAgreements, demoWorkers, demoProjects, demoPayments, statusLabels } from '@/data/demo';
import PdfPreviewModal from '@/components/pdf/PdfPreviewModal';
import {
  PartnershipAgreementPages,
  WorkerAgreementPages,
  EmployerContractPages,
  PaymentReceiptPages,
} from '@/components/pdf/templates';
import SwipeableCards, { SwipeCard } from '@/components/SwipeableCards';
import { Input } from '@/components/ui/input';
import {
  type AgreementDraft,
  type DraftKind,
  listDrafts,
  saveDraft,
  regenerateDraft,
  updateDraftNotes,
  deleteDraft,
  getDraft,
  formatTimestamp,
  nextVersionFor,
} from '@/lib/agreementDrafts';
import type { Agreement } from '@/types';

const typeColors: Record<string, string> = {
  partnership: 'bg-brand-gold/10 text-brand-gold',
  worker: 'bg-brand-blue/10 text-brand-blue',
  employer: 'bg-primary/10 text-primary',
  service: 'bg-brand-green/10 text-brand-green',
  receipt: 'bg-brand-green/10 text-brand-green',
};

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

type TemplateType = 'partnership' | 'worker' | 'employer' | 'receipt';

function getPagesForTemplate(type: TemplateType): React.ReactNode[] {
  switch (type) {
    case 'partnership': return PartnershipAgreementPages();
    case 'worker': return WorkerAgreementPages(demoWorkers[0]);
    case 'employer': return EmployerContractPages(demoProjects[0]);
    case 'receipt': return PaymentReceiptPages(demoPayments[0]);
  }
}

function getPagesForAgreement(agr: Agreement): React.ReactNode[] {
  switch (agr.type) {
    case 'partnership': return PartnershipAgreementPages(agr);
    case 'worker': {
      const worker = demoWorkers.find(w => agr.parties.includes(`${w.firstName} ${w.lastName}`));
      return WorkerAgreementPages(worker);
    }
    case 'employer': {
      const project = demoProjects.find(p => agr.parties.some(party => party.includes(p.employer.split(' ')[0])));
      return EmployerContractPages(project);
    }
    case 'service': return EmployerContractPages();
  }
}

function getPagesForKind(kind: DraftKind): React.ReactNode[] {
  if (kind === 'service') return EmployerContractPages();
  return getPagesForTemplate(kind as TemplateType);
}

const templates: { type: TemplateType; label: string; desc: string }[] = [
  { type: 'partnership', label: 'Partnership', desc: 'Owner & partner terms' },
  { type: 'worker', label: 'Worker', desc: 'Deployment agreement' },
  { type: 'employer', label: 'Employer', desc: 'Service contract' },
  { type: 'receipt', label: 'Receipt', desc: 'Payment confirmation' },
];

export default function Agreements() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewPages, setPreviewPages] = useState<React.ReactNode[]>([]);
  const [activeDraft, setActiveDraft] = useState<AgreementDraft | null>(null);
  const [pendingDraftMeta, setPendingDraftMeta] = useState<{ key: string; kind: DraftKind; title: string } | null>(null);
  const [search, setSearch] = useState('');
  const [drafts, setDrafts] = useState<AgreementDraft[]>([]);
  const [editing, setEditing] = useState<AgreementDraft | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const refreshDrafts = useCallback(() => setDrafts(listDrafts()), []);

  useEffect(() => {
    refreshDrafts();
    const h = () => refreshDrafts();
    window.addEventListener('agreement-drafts:changed', h);
    return () => window.removeEventListener('agreement-drafts:changed', h);
  }, [refreshDrafts]);

  const openTemplate = (type: TemplateType) => {
    const t = templates.find(t => t.type === type)!;
    const key = `tpl:${type}`;
    setActiveDraft(null);
    setPendingDraftMeta({ key, kind: type, title: `${t.label} Agreement` });
    setPreviewTitle(`${t.label} Agreement — Preview`);
    setPreviewPages(getPagesForTemplate(type));
    setPreviewOpen(true);
  };

  const openAgreement = (agr: Agreement) => {
    const kind: DraftKind = agr.type;
    setActiveDraft(null);
    setPendingDraftMeta({ key: `agr:${agr.id}`, kind, title: agr.title });
    setPreviewTitle(agr.title);
    setPreviewPages(getPagesForAgreement(agr));
    setPreviewOpen(true);
  };

  const openDraft = (d: AgreementDraft) => {
    setActiveDraft(d);
    setPendingDraftMeta(null);
    setPreviewTitle(`${d.title} — v${d.version}`);
    setPreviewPages(getPagesForKind(d.kind));
    setPreviewOpen(true);
  };

  const handleSaveDraft = useCallback(() => {
    if (activeDraft) {
      const fresh = regenerateDraft(activeDraft.id);
      if (fresh) {
        setActiveDraft(fresh);
        setPreviewTitle(`${fresh.title} — v${fresh.version}`);
        toast.success(`Saved as v${fresh.version}`);
      }
      return;
    }
    if (pendingDraftMeta) {
      const draft = saveDraft(pendingDraftMeta);
      setActiveDraft(draft);
      setPreviewTitle(`${draft.title} — v${draft.version}`);
      toast.success(`Draft saved (v${draft.version})`);
    }
  }, [activeDraft, pendingDraftMeta]);

  const draftBadge = activeDraft
    ? `v${activeDraft.version} · ${formatTimestamp(activeDraft.updatedAt)}`
    : pendingDraftMeta
      ? `next v${nextVersionFor(pendingDraftMeta.key)}`
      : undefined;

  const filteredAgreements = demoAgreements.filter(a =>
    `${a.title} ${a.referenceNo} ${a.parties.join(' ')}`.toLowerCase().includes(search.toLowerCase())
  );

  const startEditNotes = (d: AgreementDraft) => {
    setEditing(d);
    setEditNotes(d.notes);
  };
  const commitEditNotes = () => {
    if (!editing) return;
    updateDraftNotes(editing.id, editNotes);
    toast.success('Draft notes updated');
    setEditing(null);
  };

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 max-w-4xl mx-auto">
      <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-xl font-bold text-foreground">Agreements</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{demoAgreements.length} agreements on file · {drafts.length} draft{drafts.length === 1 ? '' : 's'}</p>
      </motion.div>

      {/* Template Cards — Swipeable */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="mt-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Generate & Preview</h2>
        <SwipeableCards>
          {templates.map((t, i) => (
            <SwipeCard key={t.type} minWidth="140px">
              <motion.button
                whileTap={{ scale: 0.94 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                onClick={() => openTemplate(t.type)}
                className="w-full card-elevated p-4 flex flex-col items-center gap-2 hover:shadow-lifted transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl ${typeColors[t.type] || typeColors.employer} flex items-center justify-center`}>
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-foreground">{t.label}</span>
                <span className="text-[9px] text-muted-foreground">{t.desc}</span>
              </motion.button>
            </SwipeCard>
          ))}
        </SwipeableCards>
      </motion.div>

      {/* Drafts */}
      {drafts.length > 0 && (
        <motion.div {...fade} transition={{ duration: 0.5, delay: 0.15 }} className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Saved Drafts
            </h2>
            <span className="text-[10px] text-muted-foreground">{drafts.length} total</span>
          </div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {drafts.map((d, i) => (
                <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: 0.02 * i }}
                  className="card-elevated p-3"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl ${typeColors[d.kind] || typeColors.employer} flex items-center justify-center flex-shrink-0`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground truncate">{d.title}</h3>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-brand-gold/15 text-brand-gold font-medium">v{d.version}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Updated {formatTimestamp(d.updatedAt)} · Created {formatTimestamp(d.createdAt)}
                      </p>
                      {editing?.id === d.id ? (
                        <div className="mt-2 space-y-1.5">
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            rows={2}
                            placeholder="Draft notes…"
                            className="w-full text-xs rounded-md bg-card border border-border/50 px-2 py-1.5 outline-none focus:ring-2 focus:ring-primary/40"
                          />
                          <div className="flex gap-1.5">
                            <button onClick={commitEditNotes} className="text-[11px] px-2.5 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90">Save</button>
                            <button onClick={() => setEditing(null)} className="text-[11px] px-2.5 py-1 rounded-md bg-muted text-foreground hover:bg-muted/80">Cancel</button>
                          </div>
                        </div>
                      ) : d.notes ? (
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{d.notes}</p>
                      ) : null}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openDraft(d)} title="Reopen / re-generate" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80">
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => startEditNotes(d)} title="Edit notes" className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80">
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => {
                          const fresh = regenerateDraft(d.id);
                          if (fresh) toast.success(`Re-generated as v${fresh.version}`);
                        }}
                        title="Re-generate as new version"
                        className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => { deleteDraft(d.id); toast.success('Draft deleted'); }}
                        title="Delete draft"
                        className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.18 }} className="mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search agreements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card border-border/50"
          />
        </div>
      </motion.div>

      {/* Agreement List */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="mt-4">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Existing Agreements</h2>
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredAgreements.map((agr, i) => (
              <motion.div
                key={agr.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: 0.03 * i, ease: [0.16, 1, 0.3, 1] }}
                className="card-elevated p-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${typeColors[agr.type]} flex items-center justify-center flex-shrink-0`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground">{agr.title}</h3>
                      <span className={`status-${agr.status} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                        {statusLabels[agr.status]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">{agr.referenceNo}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Parties: {agr.parties.join(' ↔ ')}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openAgreement(agr)}
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openAgreement(agr)}
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-muted-foreground" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={previewTitle}
        pages={previewPages}
        onSaveDraft={handleSaveDraft}
        draftBadge={draftBadge}
      />
    </div>
  );
}
