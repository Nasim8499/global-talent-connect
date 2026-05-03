import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Flag, Hash, Handshake, FileText, Calculator, TrendingUp, Percent } from 'lucide-react';
import { partner, owner, demoPayments } from '@/data/demo';
import SwipeableCards, { SwipeCard } from '@/components/SwipeableCards';

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function Partners() {
  const [ownerSplit, setOwnerSplit] = useState(60);
  const partnerSplit = 100 - ownerSplit;

  const totalRevenue = demoPayments.filter(p => p.type === 'revenue' || p.type === 'service_charge').reduce((s, p) => s + p.amount, 0);
  const totalExpenses = demoPayments.filter(p => p.type === 'expense').reduce((s, p) => s + p.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="gradient-navy px-3 sm:px-3 sm:px-4 md:px-8 pt-5 sm:pt-6 pb-8 sm:pb-10">
        <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center"
          >
            <span className="text-2xl font-bold text-white">HR</span>
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">{partner.name}</h1>
            <p className="text-sm text-white/60">Business Partner</p>
            <span className="inline-block mt-1.5 text-[10px] px-2.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue font-semibold uppercase tracking-wider">Partner</span>
          </div>
        </motion.div>

        {/* Summary in header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-3 mt-5">
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-white tabular-nums">SGD {Math.round(netProfit * (partnerSplit / 100)).toLocaleString()}</p>
            <p className="text-[10px] text-white/50">Partner Earnings</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-white tabular-nums">{partnerSplit}%</p>
            <p className="text-[10px] text-white/50">Profit Share</p>
          </div>
        </motion.div>
      </div>

      <div className="px-3 sm:px-4 md:px-8 -mt-4 space-y-4">
        {/* Info Card */}
        <motion.div {...fade} transition={{ duration: 0.5, delay: 0.1 }} className="card-elevated p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Partner Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: CreditCard, label: 'Passport', value: partner.passport },
              { icon: Flag, label: 'Nationality', value: partner.nationality },
              { icon: Hash, label: 'Internal ID', value: partner.internalId },
              { icon: Handshake, label: 'Partnership', value: 'Active — Nasim & Raja' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="flex items-start gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground break-all">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interactive Profit Split Calculator */}
        <motion.div {...fade} transition={{ duration: 0.5, delay: 0.2 }} className="card-elevated p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-4 h-4 text-brand-gold" />
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profit Split Calculator</h3>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
              <span>Owner: {ownerSplit}%</span>
              <span>Partner: {partnerSplit}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="80"
              value={ownerSplit}
              onChange={(e) => setOwnerSplit(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div layout className="p-4 rounded-xl bg-muted/50 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">{owner.name}</p>
              <p className="text-2xl font-bold text-foreground">{ownerSplit}%</p>
              <motion.p
                key={ownerSplit}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm font-semibold text-brand-green mt-1 tabular-nums"
              >
                SGD {Math.round(netProfit * (ownerSplit / 100)).toLocaleString()}
              </motion.p>
            </motion.div>
            <motion.div layout className="p-4 rounded-xl bg-muted/50 text-center">
              <p className="text-[10px] text-muted-foreground mb-1">{partner.name}</p>
              <p className="text-2xl font-bold text-foreground">{partnerSplit}%</p>
              <motion.p
                key={partnerSplit}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm font-semibold text-brand-green mt-1 tabular-nums"
              >
                SGD {Math.round(netProfit * (partnerSplit / 100)).toLocaleString()}
              </motion.p>
            </motion.div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">Based on net profit of SGD {netProfit.toLocaleString()}</p>
        </motion.div>

        {/* Documents */}
        <motion.div {...fade} transition={{ duration: 0.5, delay: 0.3 }} className="card-elevated p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Legal Documents</h3>
          {[
            { name: 'Partnership Agreement', ref: 'AGR-PARTNER-2025-001', status: 'Active' },
            { name: 'Profit Sharing Agreement', ref: 'AGR-PROFIT-2025-001', status: 'Active' },
            { name: 'Partner NDA', ref: 'NDA-PARTNER-2025-001', status: 'Active' },
          ].map((doc, i) => (
            <motion.div
              key={doc.ref}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0"
            >
              <FileText className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{doc.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{doc.ref}</p>
              </div>
              <span className="status-active text-[10px] px-2 py-0.5 rounded-full font-medium">{doc.status}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
