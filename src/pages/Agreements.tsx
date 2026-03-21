import { motion } from 'framer-motion';
import { FileText, Download, Eye, ChevronRight } from 'lucide-react';
import { demoAgreements, statusLabels } from '@/data/demo';

const typeColors: Record<string, string> = {
  partnership: 'bg-brand-gold/10 text-brand-gold',
  worker: 'bg-brand-blue/10 text-brand-blue',
  employer: 'bg-primary/10 text-primary',
  service: 'bg-brand-green/10 text-brand-green',
};

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function Agreements() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-xl font-bold text-foreground">Agreements</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{demoAgreements.length} agreements on file</p>
      </motion.div>

      {/* Template Cards */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="mt-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Generate New</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {['Partnership', 'Worker', 'Employer', 'Service'].map((type) => (
            <button
              key={type}
              className="min-w-[140px] card-elevated p-4 flex flex-col items-center gap-2 hover:shadow-lifted active:scale-[0.96] transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-xl ${typeColors[type.toLowerCase()]} flex items-center justify-center`}>
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-foreground">{type}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Agreement List */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="mt-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Existing Agreements</h2>
        <div className="space-y-2">
          {demoAgreements.map((agr, i) => (
            <motion.div
              key={agr.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
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
                  <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors active:scale-95">
                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors active:scale-95">
                    <Download className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
