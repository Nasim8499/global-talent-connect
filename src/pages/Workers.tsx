import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, MapPin, Briefcase, SortAsc, SortDesc, Globe, Users } from 'lucide-react';
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

const countries = [
  { code: 'all', label: 'All', flag: '🌍' },
  { code: 'Australia', label: 'Australia', flag: '🇦🇺' },
  { code: 'Singapore', label: 'Singapore', flag: '🇸🇬' },
  { code: 'Serbia', label: 'Serbia', flag: '🇷🇸' },
  { code: 'Russia', label: 'Russia', flag: '🇷🇺' },
  { code: 'Cambodia', label: 'Cambodia', flag: '🇰🇭' },
  { code: 'Moldova', label: 'Moldova', flag: '🇲🇩' },
  { code: 'Malaysia', label: 'Malaysia', flag: '🇲🇾' },
  { code: 'Qatar', label: 'Qatar', flag: '🇶🇦' },
  { code: 'Schengen', label: 'Schengen', flag: '🇪🇺' },
];

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const statusOrder: WorkerStatus[] = ['deployed', 'visa_processing', 'approved', 'documents_pending', 'registered'];

const statusColors: Record<string, string> = {
  deployed: 'bg-primary/10 text-primary',
  visa_processing: 'bg-sky-50 text-sky-700',
  approved: 'bg-emerald-50 text-emerald-700',
  documents_pending: 'bg-amber-50 text-amber-700',
  registered: 'bg-slate-100 text-slate-600',
};

export default function Workers() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<WorkerStatus | 'all'>('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [sortAsc, setSortAsc] = useState(true);
  const [showCountryMenu, setShowCountryMenu] = useState(false);

  const filtered = demoWorkers
    .filter(w => {
      const matchSearch = `${w.firstName} ${w.lastName} ${w.internalId} ${w.jobTitle}`.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || w.status === filter;
      const matchCountry = countryFilter === 'all' || w.destinationCountry === countryFilter;
      return matchSearch && matchFilter && matchCountry;
    })
    .sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`;
      const nameB = `${b.firstName} ${b.lastName}`;
      return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

  const statusSummary = statusOrder.map(s => ({
    status: s,
    label: statusLabels[s],
    count: demoWorkers.filter(w => w.status === s).length,
  }));

  const activeCountry = countries.find(c => c.code === countryFilter);

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 max-w-4xl mx-auto">
      <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Workers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{demoWorkers.length} total workers</p>
        </div>
        {/* Country Button */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowCountryMenu(!showCountryMenu)}
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl text-xs font-medium transition-all ${
              countryFilter !== 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="text-xl leading-none">{activeCountry?.flag}</span>
            <span>{activeCountry?.label}</span>
            <Globe className="w-3 h-3 opacity-60" />
          </motion.button>

          {/* Country Dropdown */}
          <AnimatePresence>
            {showCountryMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setShowCountryMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 bg-card border border-border rounded-2xl shadow-lifted z-50 min-w-[180px] overflow-hidden py-1"
                >
                  {countries.map((c) => {
                    const count = c.code === 'all' ? demoWorkers.length : demoWorkers.filter(w => w.destinationCountry === c.code).length;
                    return (
                      <motion.button
                        key={c.code}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setCountryFilter(c.code); setShowCountryMenu(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          countryFilter === c.code ? 'bg-primary/5 text-primary font-medium' : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <span className="text-2xl leading-none">{c.flag}</span>
                        <span className="flex-1 text-left">{c.label}</span>
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{count}</span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Status Overview — Swipeable */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }} className="mt-4">
        <SwipeableCards>
          {statusSummary.map((s) => (
            <SwipeCard key={s.status} minWidth="120px">
              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => setFilter(prev => prev === s.status ? 'all' : s.status)}
                className={`w-full card-elevated p-3 text-center transition-all ${
                  filter === s.status ? 'ring-2 ring-primary shadow-lifted' : ''
                }`}
              >
                <p className="text-xl font-bold text-foreground tabular-nums">{s.count}</p>
                <p className={`text-[10px] font-medium mt-0.5 ${statusColors[s.status] || ''} px-2 py-0.5 rounded-full inline-block`}>
                  {s.label}
                </p>
              </motion.button>
            </SwipeCard>
          ))}
        </SwipeableCards>
      </motion.div>

      {/* Search + Sort */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search workers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card border-border/50 focus-visible:ring-2 focus-visible:ring-brand-blue"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setSortAsc(!sortAsc)}
          className="h-11 w-11 rounded-xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {sortAsc ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="mt-3">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x snap-mandatory" style={{ WebkitOverflowScrolling: 'touch' }}>
          {filters.map((f) => {
            const count = f.value === 'all' ? demoWorkers.length : demoWorkers.filter(w => w.status === f.value).length;
            return (
              <motion.button
                key={f.value}
                whileTap={{ scale: 0.93 }}
                onClick={() => setFilter(f.value)}
                className={`flex-shrink-0 snap-start px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  filter === f.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card text-muted-foreground border border-border/50 hover:bg-muted'
                }`}
              >
                {f.label} ({count})
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Active Country Filter Badge */}
      <AnimatePresence>
        {countryFilter !== 'all' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2"
          >
            <button
              onClick={() => setCountryFilter('all')}
              className="inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-medium"
            >
              <span className="text-lg leading-none">{activeCountry?.flag}</span>
              {activeCountry?.label} • Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Worker List */}
      <div className="mt-4 space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((worker, i) => (
            <motion.div
              key={worker.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: 0.03 * Math.min(i, 10), ease: [0.16, 1, 0.3, 1] }}
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
                      <span className="text-base leading-none">{countryFlags[worker.destinationCountry] || ''}</span>
                      {worker.destinationCountry}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono">{worker.internalId}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No workers found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
