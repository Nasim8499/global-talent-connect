import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, FolderKanban, AlertCircle, TrendingUp,
  FileText, Upload, DollarSign, ChevronRight,
  Clock, CheckCircle2, AlertTriangle, Zap, MapPin,
} from 'lucide-react';
import { demoWorkers, demoProjects, demoNotifications, demoActivityLogs, owner, statusLabels, countryFlags } from '@/data/demo';
import SwipeableCards, { SwipeCard } from '@/components/SwipeableCards';

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const kpis = [
  { label: 'Total Workers', value: demoWorkers.length, icon: Users, trend: '+2 this month', color: 'bg-brand-blue/10 text-brand-blue' },
  { label: 'Active Projects', value: demoProjects.filter(p => p.status !== 'completed').length, icon: FolderKanban, trend: '1 starting soon', color: 'bg-brand-green/10 text-brand-green' },
  { label: 'Pending Actions', value: demoNotifications.filter(n => !n.read).length, icon: AlertCircle, trend: '2 urgent', color: 'bg-amber-100 text-amber-700' },
  { label: 'Revenue', value: '$48K', icon: TrendingUp, trend: '+32% vs last Q', color: 'bg-emerald-50 text-emerald-600' },
];

const quickActions = [
  { label: 'Add Worker', icon: Users, path: '/workers', color: 'bg-brand-blue/10 text-brand-blue' },
  { label: 'New Project', icon: FolderKanban, path: '/projects', color: 'bg-brand-green/10 text-brand-green' },
  { label: 'Upload Doc', icon: Upload, path: '/auto', color: 'bg-amber-100 text-amber-700' },
  { label: 'Agreement', icon: FileText, path: '/agreements', color: 'bg-primary/10 text-primary' },
  { label: 'Finance', icon: DollarSign, path: '/finance', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Quick Scan', icon: Zap, path: '/auto', color: 'bg-brand-gold/10 text-brand-gold' },
];

const urgentTypeIcons: Record<string, typeof AlertCircle> = {
  urgent: AlertTriangle,
  warning: AlertCircle,
  success: CheckCircle2,
  info: Clock,
};

export default function Dashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const recentWorkers = demoWorkers.slice(0, 5);

  return (
    <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
      {/* Greeting */}
      <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
          {greeting}, {owner.name.split(' ')[0]}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">{owner.company}</p>
      </motion.div>

      {/* KPI Cards — Swipeable on mobile */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} className="mt-6">
        <div className="hidden md:grid md:grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} kpi={kpi} />
          ))}
        </div>
        <div className="md:hidden">
          <SwipeableCards>
            {kpis.map((kpi) => (
              <SwipeCard key={kpi.label} minWidth="160px">
                <KpiCard kpi={kpi} />
              </SwipeCard>
            ))}
          </SwipeableCards>
        </div>
      </motion.div>

      {/* Urgent Actions — Swipeable */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }} className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Urgent Actions</h2>
          <span className="text-xs text-muted-foreground">{demoNotifications.filter(n => !n.read).length} pending</span>
        </div>
        <SwipeableCards>
          {demoNotifications.filter(n => !n.read).map((n) => {
            const Icon = urgentTypeIcons[n.type] || Clock;
            return (
              <SwipeCard key={n.id} minWidth="260px">
                <div className="card-elevated p-4 h-full">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      n.type === 'urgent' ? 'bg-destructive/10 text-destructive' :
                      n.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                      n.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-brand-blue/10 text-brand-blue'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                </div>
              </SwipeCard>
            );
          })}
        </SwipeableCards>
      </motion.div>

      {/* Recent Workers — Swipeable on mobile */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }} className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Recent Workers</h2>
          <Link to="/workers" className="text-xs text-brand-blue flex items-center gap-0.5 hover:underline">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <SwipeableCards>
          {recentWorkers.map((w) => (
            <SwipeCard key={w.id} minWidth="200px">
              <Link to={`/workers/${w.id}`} className="card-elevated p-4 block h-full hover:shadow-lifted transition-shadow active:scale-[0.97]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{w.firstName[0]}{w.lastName[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{w.firstName} {w.lastName}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{w.internalId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`status-${w.status} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                    {statusLabels[w.status]}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" /> {countryFlags[w.destinationCountry]} {w.destinationCountry}
                  </span>
                </div>
              </Link>
            </SwipeCard>
          ))}
        </SwipeableCards>
      </motion.div>

      {/* Quick Actions */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }} className="mt-8">
        <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="card-elevated p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:shadow-lifted active:scale-[0.97]"
            >
              <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-foreground text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }} className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
          <Link to="/admin" className="text-xs text-brand-blue flex items-center gap-0.5 hover:underline">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="card-elevated divide-y divide-border">
          {demoActivityLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-start gap-3 px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium">{log.action}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function KpiCard({ kpi }: { kpi: typeof kpis[number] }) {
  return (
    <div className="card-elevated p-4 transition-shadow duration-300">
      <div className={`w-9 h-9 rounded-xl ${kpi.color} flex items-center justify-center mb-3`}>
        <kpi.icon className="w-[18px] h-[18px]" />
      </div>
      <p className="text-2xl font-bold text-foreground tabular-nums">
        {typeof kpi.value === 'number' ? kpi.value : kpi.value}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
      <p className="text-[10px] text-brand-green font-medium mt-1">{kpi.trend}</p>
    </div>
  );
}
