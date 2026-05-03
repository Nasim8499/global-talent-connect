import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Eye, Search, Filter } from 'lucide-react';
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
import type { Agreement } from '@/types';

const typeColors: Record<string, string> = {
  partnership: 'bg-brand-gold/10 text-brand-gold',
  worker: 'bg-brand-blue/10 text-brand-blue',
  employer: 'bg-primary/10 text-primary',
  service: 'bg-brand-green/10 text-brand-green',
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
  const [search, setSearch] = useState('');

  const openTemplate = (type: TemplateType) => {
    const t = templates.find(t => t.type === type)!;
    setPreviewTitle(`${t.label} Agreement — Preview`);
    setPreviewPages(getPagesForTemplate(type));
    setPreviewOpen(true);
  };

  const openAgreement = (agr: Agreement) => {
    setPreviewTitle(agr.title);
    setPreviewPages(getPagesForAgreement(agr));
    setPreviewOpen(true);
  };

  const filteredAgreements = demoAgreements.filter(a =>
    `${a.title} ${a.referenceNo} ${a.parties.join(' ')}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 max-w-4xl mx-auto">
      <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-xl font-bold text-foreground">Agreements</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{demoAgreements.length} agreements on file</p>
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
      />
    </div>
  );
}
