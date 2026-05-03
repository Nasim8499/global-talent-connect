import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Filter, Receipt } from 'lucide-react';
import { demoPayments, statusLabels } from '@/data/demo';
import SwipeableCards, { SwipeCard } from '@/components/SwipeableCards';
import PdfPreviewModal from '@/components/pdf/PdfPreviewModal';
import { PaymentReceiptPages } from '@/components/pdf/templates';
import type { Payment } from '@/types';

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

type PayFilter = 'all' | 'paid' | 'pending' | 'overdue';

export default function Finance() {
  const [filter, setFilter] = useState<PayFilter>('all');
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  const totalRevenue = demoPayments.filter(p => p.type === 'revenue' || p.type === 'service_charge').reduce((s, p) => s + p.amount, 0);
  const totalExpenses = demoPayments.filter(p => p.type === 'expense').reduce((s, p) => s + p.amount, 0);
  const totalCollected = demoPayments.filter(p => p.type === 'worker_fee' && p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const overdue = demoPayments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const filteredPayments = filter === 'all' ? demoPayments : demoPayments.filter(p => p.status === filter);

  const summaryCards = [
    { label: 'Revenue', value: totalRevenue, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600', arrow: ArrowUpRight },
    { label: 'Expenses', value: totalExpenses, icon: TrendingDown, color: 'bg-red-50 text-red-600', arrow: ArrowDownRight },
    { label: 'Collected', value: totalCollected, icon: DollarSign, color: 'bg-brand-blue/10 text-brand-blue', arrow: ArrowUpRight },
    { label: 'Overdue', value: overdue, icon: DollarSign, color: 'bg-amber-100 text-amber-700', arrow: ArrowDownRight },
  ];

  const openReceipt = (pay: Payment) => {
    setReceiptPayment(pay);
    setReceiptOpen(true);
  };

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 max-w-4xl mx-auto">
      <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-xl font-bold text-foreground">Finance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Revenue, expenses, and payment tracking</p>
      </motion.div>

      {/* Summary Cards — Swipeable on mobile */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.08 }} className="mt-6">
        <div className="hidden md:grid md:grid-cols-4 gap-3">
          {summaryCards.map((card, i) => (
            <motion.div key={card.label} {...fade} transition={{ duration: 0.4, delay: 0.08 * i }} className="card-elevated p-4">
              <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-[18px] h-[18px]" />
              </div>
              <p className="text-lg font-bold text-foreground tabular-nums">SGD {card.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="md:hidden">
          <SwipeableCards>
            {summaryCards.map((card) => (
              <SwipeCard key={card.label} minWidth="150px">
                <div className="card-elevated p-4">
                  <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                    <card.icon className="w-[18px] h-[18px]" />
                  </div>
                  <p className="text-lg font-bold text-foreground tabular-nums">SGD {card.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
                </div>
              </SwipeCard>
            ))}
          </SwipeableCards>
        </div>
      </motion.div>

      {/* Profit Card */}
      <motion.div {...fade} transition={{ duration: 0.4, delay: 0.3 }} className="card-elevated p-5 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Net Profit</p>
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className={`text-2xl font-bold tabular-nums ${netProfit >= 0 ? 'text-brand-green' : 'text-destructive'}`}
            >
              SGD {netProfit.toLocaleString()}
            </motion.p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Partner Split (40%)</p>
            <p className="text-lg font-bold text-foreground tabular-nums">SGD {Math.round(netProfit * 0.4).toLocaleString()}</p>
          </div>
        </div>
        {/* Profit bar */}
        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="h-full bg-primary rounded-l-full"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '40%' }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="h-full bg-brand-blue rounded-r-full"
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
          <span>Owner 60%</span>
          <span>Partner 40%</span>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.4 }} className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Transactions</h2>
          <div className="flex gap-1.5">
            {(['all', 'paid', 'pending', 'overdue'] as PayFilter[]).map((f) => (
              <motion.button
                key={f}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
                  filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {f === 'all' ? 'All' : statusLabels[f]}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="card-elevated divide-y divide-border">
          <AnimatePresence mode="popLayout">
            {filteredPayments.map((pay, i) => (
              <motion.div
                key={pay.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => pay.status === 'paid' && openReceipt(pay)}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  pay.type === 'revenue' || pay.type === 'service_charge' ? 'bg-emerald-50' :
                  pay.type === 'expense' ? 'bg-red-50' : 'bg-brand-blue/10'
                }`}>
                  {pay.type === 'revenue' || pay.type === 'service_charge' ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  ) : pay.type === 'expense' ? (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  ) : (
                    <DollarSign className="w-4 h-4 text-brand-blue" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{pay.description}</p>
                  <p className="text-xs text-muted-foreground">{pay.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold tabular-nums ${
                    pay.type === 'revenue' || pay.type === 'service_charge' ? 'text-brand-green' : 'text-foreground'
                  }`}>
                    {pay.currency} {pay.amount.toLocaleString()}
                  </p>
                  <span className={`status-${pay.status} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                    {statusLabels[pay.status]}
                  </span>
                </div>
                {pay.status === 'paid' && (
                  <Receipt className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Receipt Preview */}
      <PdfPreviewModal
        open={receiptOpen}
        onClose={() => setReceiptOpen(false)}
        title={`Receipt — ${receiptPayment?.description || ''}`}
        pages={receiptPayment ? PaymentReceiptPages(receiptPayment) : []}
      />
    </div>
  );
}
