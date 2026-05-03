import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Calendar, TrendingUp, ChevronRight, Filter, Eye } from 'lucide-react';
import { demoProjects, demoWorkers, statusLabels, countryFlags } from '@/data/demo';
import SwipeableCards, { SwipeCard } from '@/components/SwipeableCards';
import type { ProjectStatus } from '@/types';

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const projectFilters: { label: string; value: ProjectStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Processing', value: 'processing' },
  { label: 'Recruiting', value: 'recruiting' },
  { label: 'Planning', value: 'planning' },
  { label: 'Deployed', value: 'deployed' },
];

export default function Projects() {
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === 'all' ? demoProjects : demoProjects.filter(p => p.status === filter);
  const totalWorkers = demoProjects.reduce((s, p) => s + p.workerCount, 0);
  const totalTarget = demoProjects.reduce((s, p) => s + p.targetWorkers, 0);
  const totalProfit = demoProjects.reduce((s, p) => s + (p.revenue - p.expenses), 0);

  return (
    <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6 max-w-4xl mx-auto">
      <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-xl font-bold text-foreground">Projects & Batches</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{demoProjects.length} active batches</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.08 }} className="mt-4">
        <SwipeableCards>
          {[
            { label: 'Total Workers', value: `${totalWorkers}/${totalTarget}`, color: 'bg-brand-blue/10 text-brand-blue' },
            { label: 'Active Projects', value: filtered.length, color: 'bg-brand-green/10 text-brand-green' },
            { label: 'Net Profit', value: `SGD ${totalProfit.toLocaleString()}`, color: 'bg-emerald-50 text-emerald-600' },
          ].map((s) => (
            <SwipeCard key={s.label} minWidth="140px">
              <div className="card-elevated p-3 text-center">
                <p className="text-lg font-bold text-foreground tabular-nums">{s.value}</p>
                <p className={`text-[10px] font-medium mt-0.5 ${s.color} px-2 py-0.5 rounded-full inline-block`}>{s.label}</p>
              </div>
            </SwipeCard>
          ))}
        </SwipeableCards>
      </motion.div>

      {/* Filters */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.12 }} className="mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          {projectFilters.map((f) => (
            <motion.button
              key={f.value}
              whileTap={{ scale: 0.93 }}
              onClick={() => setFilter(f.value)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f.value ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card text-muted-foreground border border-border/50'
              }`}
            >
              {f.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="mt-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => {
            const progress = project.targetWorkers > 0 ? (project.workerCount / project.targetWorkers) * 100 : 0;
            const profit = project.revenue - project.expenses;
            const isExpanded = expandedId === project.id;
            const assignedWorkers = demoWorkers.filter(w => w.projectId === project.id);

            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
                className="card-elevated p-5 transition-shadow duration-300 hover:shadow-lifted cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : project.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">{project.name}</h3>
                      <span className={`status-${project.status} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                        {statusLabels[project.status]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">{project.batchCode}</p>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                  </motion.div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{countryFlags[project.country]} {project.country}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{project.workerCount}/{project.targetWorkers}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{project.startDate}</span>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Worker Fill</span>
                    <span className="font-medium text-foreground tabular-nums">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ delay: 0.2 + 0.06 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full gradient-blue"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Employer</p>
                    <p className="text-xs font-medium text-foreground">{project.employer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground">Profit</p>
                    <p className={`text-sm font-bold tabular-nums ${profit >= 0 ? 'text-brand-green' : 'text-destructive'}`}>
                      <TrendingUp className="w-3 h-3 inline mr-0.5" />
                      SGD {profit.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-3 border-t border-border/50 space-y-3">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold text-foreground tabular-nums">SGD {project.revenue.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">Revenue</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className="text-lg font-bold text-foreground tabular-nums">SGD {project.expenses.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">Expenses</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted/50">
                            <p className={`text-lg font-bold tabular-nums ${profit >= 0 ? 'text-brand-green' : 'text-destructive'}`}>
                              {Math.round((profit / (project.revenue || 1)) * 100)}%
                            </p>
                            <p className="text-[10px] text-muted-foreground">Margin</p>
                          </div>
                        </div>
                        {assignedWorkers.length > 0 && (
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">Assigned Workers</p>
                            <div className="space-y-1.5">
                              {assignedWorkers.map((w) => (
                                <div key={w.id} className="flex items-center gap-2 text-xs">
                                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <span className="text-[9px] font-bold text-primary">{w.firstName[0]}{w.lastName[0]}</span>
                                  </div>
                                  <span className="text-foreground font-medium">{w.firstName} {w.lastName}</span>
                                  <span className={`status-${w.status} text-[9px] px-1.5 py-0.5 rounded-full font-medium ml-auto`}>
                                    {statusLabels[w.status]}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
