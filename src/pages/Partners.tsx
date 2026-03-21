import { motion } from 'framer-motion';
import { CreditCard, Flag, Hash, Handshake, FileText, Calculator } from 'lucide-react';
import { partner, owner } from '@/data/demo';

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function Partners() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="gradient-navy px-4 md:px-8 pt-6 pb-10">
        <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">HR</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{partner.name}</h1>
            <p className="text-sm text-white/60">Business Partner</p>
            <span className="inline-block mt-1.5 text-[10px] px-2.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue font-semibold uppercase tracking-wider">Partner</span>
          </div>
        </motion.div>
      </div>

      <div className="px-4 md:px-8 -mt-4 space-y-4">
        {/* Info Card */}
        <motion.div {...fade} transition={{ duration: 0.5, delay: 0.1 }} className="card-elevated p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Partner Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: CreditCard, label: 'Passport', value: partner.passport },
              { icon: Flag, label: 'Nationality', value: partner.nationality },
              { icon: Hash, label: 'Internal ID', value: partner.internalId },
              { icon: Handshake, label: 'Partnership', value: 'Active — Nasim & Raja' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground break-all">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Profit Split Calculator */}
        <motion.div {...fade} transition={{ duration: 0.5, delay: 0.2 }} className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-4 h-4 text-brand-gold" />
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profit Split</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">{owner.name}</p>
              <p className="text-2xl font-bold text-foreground">60%</p>
              <p className="text-sm font-semibold text-brand-green mt-1 tabular-nums">SGD 19,200</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">{partner.name}</p>
              <p className="text-2xl font-bold text-foreground">40%</p>
              <p className="text-sm font-semibold text-brand-green mt-1 tabular-nums">SGD 12,800</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">Based on net profit of SGD 32,000</p>
        </motion.div>

        {/* Documents */}
        <motion.div {...fade} transition={{ duration: 0.5, delay: 0.3 }} className="card-elevated p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Legal Documents</h3>
          {[
            { name: 'Partnership Agreement', ref: 'AGR-PARTNER-2025-001', status: 'Active' },
            { name: 'Profit Sharing Agreement', ref: 'AGR-PROFIT-2025-001', status: 'Active' },
            { name: 'Partner NDA', ref: 'NDA-PARTNER-2025-001', status: 'Active' },
          ].map((doc) => (
            <div key={doc.ref} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
              <FileText className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{doc.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{doc.ref}</p>
              </div>
              <span className="status-active text-[10px] px-2 py-0.5 rounded-full font-medium">{doc.status}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
