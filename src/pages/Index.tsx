import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Award, Clock, BookOpen, CheckCircle2, ChevronRight, ChevronLeft,
  Plus, MoreHorizontal, Mail, Bell, TrendingUp, Users,
} from 'lucide-react';
import { demoWorkers, demoProjects, demoPayments, owner } from '@/data/demo';
import { useState } from 'react';
import DashboardTile from '@/components/DashboardTile';
import DocumentViewer from '@/components/DocumentViewer';
import { useDashboardTiles } from '@/hooks/useDashboardTiles';
import { toast } from 'sonner';

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const totalRevenue = demoPayments
  .filter((p) => p.type === 'revenue' || p.type === 'service_charge')
  .reduce((s, p) => s + p.amount, 0);

const stats = [
  { value: demoWorkers.filter((w) => w.status === 'completed' || w.status === 'deployed').length, label: 'Completed Deployments', cta: 'View Records', icon: Award, path: '/workers' },
  { value: 180, label: 'Total Service Hours', cta: 'Service Report', icon: Clock, path: '/finance' },
  { value: demoProjects.filter((p) => p.status !== 'completed').length, label: 'Currently Active', cta: 'Go to Projects', icon: BookOpen, path: '/projects' },
  { value: demoWorkers.filter((w) => w.status === 'approved').length, label: 'Approval Success', cta: 'Review Items', icon: CheckCircle2, path: '/workers' },
];

const navTabs = [
  { label: 'Assignments', path: '/auto' },
  { label: 'Dashboard', path: '/' },
  { label: 'Workers', path: '/workers' },
  { label: 'Projects', path: '/projects' },
];

// Activity bars (Mon-Sun)
const activity = [38, 52, 28, 70, 36, 95, 88];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const today = 1;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { tiles, uploadToTile, clearTile, addTile } = useDashboardTiles();
  const [previewTile, setPreviewTile] = useState<string | null>(null);
  const previewing = tiles.find((t) => t.id === previewTile);

  return (
    <div className="px-3 sm:px-5 lg:px-8 py-4 lg:py-6 max-w-[1500px] mx-auto">
      {/* Top bar — logo + pill nav + actions */}
      <motion.div
        {...fade}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between gap-3 mb-5"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <span className="text-white font-black text-sm">V</span>
          </div>
          <span className="hidden sm:inline font-bold text-foreground tracking-tight">VisaHOBe</span>
        </div>

        {/* Pill nav — desktop only */}
        <div className="hidden md:flex items-center gap-1 bg-card border border-border rounded-full p-1">
          {navTabs.map((t) => (
            <Link
              key={t.label}
              to={t.path}
              onClick={() => setActiveTab(t.label)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === t.label
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition">
            <Mail className="w-4 h-4 text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </button>
          <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition">
            <Bell className="w-4 h-4 text-foreground" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center text-xs font-bold text-white">
            {owner.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
        </div>
      </motion.div>

      {/* Mobile pill nav */}
      <div className="md:hidden -mx-3 px-3 mb-4 overflow-x-auto scrollbar-hide">
        <div className="inline-flex items-center gap-1 bg-card border border-border rounded-full p-1">
          {navTabs.map((t) => (
            <Link
              key={t.label}
              to={t.path}
              onClick={() => setActiveTab(t.label)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                activeTab === t.label ? 'bg-foreground text-background' : 'text-muted-foreground'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats + Activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 items-start">
        {/* Stat cards 2x2 / 4-up */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 self-start">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              {...fade}
              transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
              className="card-elevated p-4 flex flex-col justify-between min-h-[170px]"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-5 h-5 text-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-3xl font-bold text-foreground tabular-nums leading-none">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">{s.label}</p>
                </div>
              </div>
              <Link
                to={s.path}
                className="mt-3 flex items-center justify-between bg-muted/60 hover:bg-muted rounded-full pl-4 pr-1 py-1 transition group"
              >
                <span className="text-xs font-medium text-foreground">{s.cta}</span>
                <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition">
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Activity panel */}
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="card-elevated p-4 hidden lg:flex flex-col min-h-[360px]"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Activity</h3>
            <button className="text-[11px] text-muted-foreground border border-border rounded-full px-3 py-1 flex items-center gap-1">
              Weekly <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
          </div>
          <div className="flex items-end gap-3 mb-2">
            <p className="text-5xl font-bold text-foreground tabular-nums leading-none">
              ${(totalRevenue / 1000).toFixed(0)}
            </p>
            <div className="pb-1">
              <p className="text-[11px] text-muted-foreground">Revenue (K)</p>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> +5%
              </p>
            </div>
          </div>
          <div className="flex items-end gap-2 mt-4 h-[200px]">
            {activity.map((v, i) => (
              <div key={i} className="flex-1 h-full flex flex-col items-center">
                <div className="w-full flex-1 relative flex items-end overflow-hidden rounded-md">
                  <div className="absolute inset-0 ubright-stripe opacity-30" />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${v}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ minHeight: 4 }}
                    className="w-full rounded-md bg-primary relative z-10"
                  />
                </div>
                <span className="text-[10px] text-muted-foreground mt-2">{days[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main grid: schedule | recent course | (activity already on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 mt-4">
        {/* My Schedule */}
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="card-elevated p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">My Schedule</h3>
            <button className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80">
              <Plus className="w-3.5 h-3.5 text-foreground" />
            </button>
          </div>
          <div className="bg-muted/40 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-foreground">December 2026</span>
              <div className="flex gap-1">
                <button className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <span key={d} className="text-[9px] text-muted-foreground text-center">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((d) => (
                <button
                  key={d}
                  className={`aspect-square text-[10px] rounded-full flex items-center justify-center ${
                    d === today ? 'bg-primary text-white font-semibold' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>08:00 — 10:30</span>
              <span className="bg-destructive/15 text-destructive px-2 py-0.5 rounded-full font-medium">● Live</span>
            </div>
            <p className="text-sm font-semibold text-foreground">Singapore Batch Briefing</p>
            <span className="inline-block bg-emerald-500/15 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-medium">
              Beginner
            </span>
            <p className="text-[11px] text-muted-foreground mt-2">
              Mentor: <span className="text-foreground font-medium">Aiko Tanaka</span>
            </p>
          </div>

          <Link
            to="/projects"
            className="mt-4 block bg-primary hover:bg-primary/90 text-white text-center text-sm font-medium rounded-full py-2.5 transition"
          >
            View All
          </Link>
        </motion.div>

        {/* Recent Course / Documents */}
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="card-elevated p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">My Documents</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={addTile}
                className="text-[11px] text-foreground bg-muted hover:bg-muted/70 rounded-full px-3 py-1 flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" /> Add tile
              </button>
              <Link to="/drive" className="text-[11px] text-primary hover:underline">
                View All
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tiles.map((tile) => (
              <DashboardTile
                key={tile.id}
                tile={tile}
                onUpload={async (file) => {
                  await uploadToTile(tile.id, file);
                  toast.success(`Uploaded ${file.name}`);
                }}
                onClear={() => {
                  clearTile(tile.id);
                  toast('Tile cleared');
                }}
                onPreview={() => setPreviewTile(tile.id)}
              />
            ))}
          </div>

          {/* Activity panel — mobile/tablet only (below docs) */}
          <div className="lg:hidden mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">Activity</h3>
              <span className="text-[11px] text-muted-foreground">Weekly</span>
            </div>
            <div className="flex items-end gap-2 h-[140px]">
              {activity.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full h-full flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${v}%` }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                      className="w-full rounded-md bg-primary"
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground">{days[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom row — Ongoing Project / Mentors / Pending + Private */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {/* Ongoing Project */}
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="card-elevated p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Ongoing Project</h3>
            <button className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/15 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-medium">Active</span>
            <span className="bg-destructive/15 text-destructive text-[10px] px-2 py-0.5 rounded-full font-medium">● Live</span>
          </div>
          <p className="text-base font-bold text-foreground">{demoProjects[0].name}</p>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            {demoProjects[0].employer} — Singapore Marina Bay deployment with full processing for {demoProjects[0].targetWorkers} skilled workers.
          </p>
          <div className="mt-3 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Batch</span>
              <span className="text-primary font-medium">{demoProjects[0].batchCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Country</span>
              <span className="text-foreground font-medium">{demoProjects[0].country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Started</span>
              <span className="text-foreground font-medium">{demoProjects[0].startDate}</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="h-2 rounded-full bg-muted overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '68%' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="bg-primary"
              />
              <div className="flex-1 ubright-stripe opacity-40" />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px]">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-3 h-3" /> {demoProjects[0].workerCount}/{demoProjects[0].targetWorkers}
              </div>
              <span className="text-foreground font-medium">68%</span>
            </div>
          </div>
        </motion.div>

        {/* My Mentors / Team */}
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="card-elevated p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">My Team</h3>
            <Link to="/partners" className="text-[11px] text-primary hover:underline">View All</Link>
          </div>
          <div className="flex items-center gap-3 text-[11px] mb-3">
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Online
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" /> Offline
            </span>
          </div>
          <div className="space-y-2.5">
            {demoWorkers.slice(0, 4).map((w, i) => (
              <div key={w.id} className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-foreground">
                    {w.firstName[0]}{w.lastName[0]}
                  </span>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${
                    i % 2 === 0 ? 'bg-emerald-400' : 'bg-destructive'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {w.firstName} {w.lastName}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{w.jobTitle}</p>
                </div>
                <button className="w-7 h-7 rounded-full bg-muted hover:bg-muted/70 flex items-center justify-center">
                  <Mail className="w-3 h-3 text-foreground" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pending + Private CTA */}
        <div className="space-y-4">
          <motion.div
            {...fade}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="card-elevated p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">Pending Tasks</h3>
              <button className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">4/8 completed</p>
                <p className="text-sm font-semibold text-foreground">Visa Documentation Review</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            {...fade}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-5 bg-primary text-white relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full border-[12px] border-white/15" />
            <div className="absolute right-4 bottom-4 w-20 h-20 rounded-full border-[8px] border-white/15" />
            <p className="text-[10px] uppercase tracking-widest font-medium opacity-80">Premium Service</p>
            <h4 className="text-lg font-bold mt-2 leading-tight">
              Elevate Your Deployments with Private Concierge
            </h4>
            <p className="text-xs opacity-85 mt-2 leading-relaxed">
              Tailored 1-on-1 visa processing, dedicated agent, and white-glove document handling.
            </p>
            <Link
              to="/agreements"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold bg-white text-primary px-4 py-2 rounded-full hover:bg-white/90 transition"
            >
              Learn More <ChevronRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </div>
      </div>

      <DocumentViewer
        open={!!previewing}
        onClose={() => setPreviewTile(null)}
        file={
          previewing && previewing.dataUrl
            ? {
                name: previewing.caption || previewing.title,
                type: previewing.kind === 'PDF' ? 'pdf' : 'image',
                url: previewing.dataUrl,
              }
            : null
        }
      />
    </div>
  );
}
