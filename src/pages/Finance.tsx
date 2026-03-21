import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { demoPayments, statusLabels } from '@/data/demo';

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function Finance() {
  const totalRevenue = demoPayments.filter(p => p.type === 'revenue' || p.type === 'service_charge').reduce((s, p) => s + p.amount, 0);
  const totalExpenses = demoPayments.filter(p => p.type === 'expense').reduce((s, p) => s + p.amount, 0);
  const totalCollected = demoPayments.filter(p => p.type === 'worker_fee' && p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const overdue = demoPayments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);

  const summaryCards = [
    { label: 'Revenue', value: totalRevenue, icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600', arrow: ArrowUpRight },
    { label: 'Expenses', value: totalExpenses, icon: TrendingDown, color: 'bg-red-50 text-red-600', arrow: ArrowDownRight },
    { label: 'Collected', value: totalCollected, icon: DollarSign, color: 'bg-brand-blue/10 text-brand-blue', arrow: ArrowUpRight },
    { label: 'Overdue', value: overdue, icon: DollarSign, color: 'bg-amber-100 text-amber-700', arrow: ArrowDownRight },
  ];

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-xl font-bold text-foreground">Finance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Revenue, expenses, and payment tracking</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            {...fade}
            transition={{ duration: 0.4, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
            className="card-elevated p-4"
          >
            <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-[18px] h-[18px]" />
            </div>
            <p className="text-lg font-bold text-foreground tabular-nums">SGD {card.value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Profit Card */}
      <motion.div
        {...fade}
        transition={{ duration: 0.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="card-elevated p-5 mt-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Net Profit</p>
            <p className="text-2xl font-bold text-brand-green tabular-nums">SGD {(totalRevenue - totalExpenses).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Partner Split (40%)</p>
            <p className="text-lg font-bold text-foreground tabular-nums">SGD {Math.round((totalRevenue - totalExpenses) * 0.4).toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Transactions */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }} className="mt-8">
        <h2 className="text-sm font-semibold text-foreground mb-3">Recent Transactions</h2>
        <div className="card-elevated divide-y divide-border">
          {demoPayments.map((pay) => (
            <div key={pay.id} className="flex items-center gap-3 px-4 py-3">
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
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
