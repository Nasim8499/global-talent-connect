import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Users, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { demoProjects, statusLabels, countryFlags } from '@/data/demo';

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function Projects() {
  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-xl font-bold text-foreground">Projects & Batches</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{demoProjects.length} active batches</p>
      </motion.div>

      <div className="mt-6 space-y-3">
        {demoProjects.map((project, i) => {
          const progress = project.targetWorkers > 0 ? (project.workerCount / project.targetWorkers) * 100 : 0;
          const profit = project.revenue - project.expenses;
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
              className="card-elevated p-5 transition-shadow duration-300 hover:shadow-lifted"
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
                <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
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
                  <div
                    className="h-full rounded-full gradient-blue transition-all duration-500"
                    style={{ width: `${progress}%` }}
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
