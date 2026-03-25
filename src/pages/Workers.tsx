import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, MapPin, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { demoWorkers, statusLabels, countryFlags } from '@/data/demo';
import SwipeableCards, { SwipeCard } from '@/components/SwipeableCards';
import type { WorkerStatus } from '@/types';

const filters: { label: string; value: WorkerStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Deployed', value: 'deployed' },
  { label: 'Processing', value: 'visa_processing' },
  { label: 'Approved', value: 'approved' },
  { label: 'Pending', value: 'documents_pending' },
  { label: 'New', value: 'registered' },
  { label: 'Done', value: 'completed' },
];

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

const statusOrder: WorkerStatus[] = ['deployed', 'visa_processing', 'approved', 'documents_pending', 'registered'];

export default function Workers() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<WorkerStatus | 'all'>('all');

  const filtered = demoWorkers.filter(w => {
    const matchSearch = `${w.firstName} ${w.lastName} ${w.internalId} ${w.jobTitle}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || w.status === filter;
    return matchSearch && matchFilter;
  });

  // Get status summary for swipeable status cards
  const statusSummary = statusOrder.map(s => ({
    status: s,
    label: statusLabels[s],
    count: demoWorkers.filter(w => w.status === s).length,
  }));

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-xl font-bold text-foreground">Workers</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{demoWorkers.length} total workers</p>
      </motion.div>

      {/* Status Overview — Swipeable */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }} className="mt-4">
        <SwipeableCards>
          {statusSummary.map((s) => (
            <SwipeCard key={s.status} minWidth="120px">
              <button
                onClick={() => setFilter(s.status)}
                className={`w-full card-elevated p-3 text-center transition-all active:scale-95 ${
                  filter === s.status ? 'ring-2 ring-primary' : ''
                }`}
              >
                <p className="text-xl font-bold text-foreground tabular-nums">{s.count}</p>
                <p className={`text-[10px] font-medium mt-0.5 status-${s.status} px-2 py-0.5 rounded-full inline-block`}>
                  {s.label}
                </p>
              </button>
            </SwipeCard>
          ))}
        </SwipeableCards>
      </motion.div>

      {/* Search */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="mt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search workers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card border-border/50 focus-visible:ring-2 focus-visible:ring-brand-blue"
          />
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="mt-3">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {filters.map((f) => {
            const count = f.value === 'all' ? demoWorkers.length : demoWorkers.filter(w => w.status === f.value).length;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 ${
                  filter === f.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground border border-border/50 hover:bg-muted'
                }`}
              >
                {f.label} ({count})
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Worker List */}
      <div className="mt-4 space-y-2">
        {filtered.map((worker, i) => (
          <motion.div
            key={worker.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={`/workers/${worker.id}`}
              className="card-elevated flex items-center gap-3 p-4 transition-all duration-200 hover:shadow-lifted active:scale-[0.98] block"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">
                  {worker.firstName[0]}{worker.lastName[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {worker.firstName} {worker.lastName}
                  </p>
                  <span className={`status-${worker.status} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                    {statusLabels[worker.status]}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Briefcase className="w-3 h-3" />{worker.jobTitle}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />{countryFlags[worker.destinationCountry] || ''} {worker.destinationCountry}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono">{worker.internalId}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
            </Link>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No workers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
