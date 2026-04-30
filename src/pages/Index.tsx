import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, Plus, MoreHorizontal, Bell, Sparkles,
  ShoppingCart, Eye, ArrowUpRight, Users, FileText, TrendingUp,
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

const lastWeekDelta = 33572;

// Bar chart data — turnover vs ads cost (matches reference)
const chartDays = [12, 13, 14, 15, 16];
const turnover = [55, 80, 95, 70, 45];
const adsCost = [30, 50, 60, 42, 28];

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const today = 14;

const reports = [
  {
    id: 'orders',
    label: 'Total Orders',
    value: demoWorkers.length * 112 + 3,
    icon: ShoppingCart,
    tone: 'orange',
    path: '/workers',
  },
  {
    id: 'views',
    label: 'Product Views',
    value: '10.580',
    icon: Eye,
    tone: 'teal',
    path: '/projects',
  },
];

export default function Dashboard() {
  const { tiles, uploadToTile, clearTile, addTile } = useDashboardTiles();
  const [previewTile, setPreviewTile] = useState<string | null>(null);
  const previewing = tiles.find((t) => t.id === previewTile);

  return (
    <div className="px-3 sm:px-5 lg:px-8 py-4 lg:py-6 max-w-[1500px] mx-auto">
      {/* Header */}
      <motion.div
        {...fade}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between gap-3 mb-5"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Store Insights</h1>
          <p className="text-xs text-white/60 mt-1">Welcome back, {owner.name.split(' ')[0]}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative w-11 h-11 rounded-full frosted flex items-center justify-center hover:bg-white/20 transition">
            <Bell className="w-4 h-4 text-white" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full" />
          </button>
          <div className="w-11 h-11 rounded-full gradient-gold flex items-center justify-center text-xs font-bold text-primary-foreground">
            {owner.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
        </div>
      </motion.div>

      {/* HERO — Revenue + Chart card (reference style) */}
      <motion.div
        {...fade}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="frosted rounded-[28px] p-4 sm:p-5 mb-4"
      >
        {/* Inner white revenue card */}
        <div className="frosted-light rounded-2xl px-5 py-4 text-center">
          <p className="text-xs font-medium text-slate-500">Total Revenue</p>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight mt-1 text-slate-900 tabular-nums">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="bg-emerald-100 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">+20%</span>
            <span className="text-[11px] text-slate-500">+${lastWeekDelta.toLocaleString()} compared to last week</span>
          </div>
        </div>

        {/* Chart + legend + Analyze */}
        <div className="mt-5 flex items-end gap-4">
          <div className="flex items-end gap-2 sm:gap-3 h-[110px] flex-1">
            {chartDays.map((d, i) => (
              <div key={d} className="flex-1 flex flex-col items-center justify-end gap-1.5">
                <div className="w-full flex items-end gap-1 h-[90px]">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${turnover[i]}%` }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 rounded-t-md bg-cyan-300/90"
                    style={{ minHeight: 4 }}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${adsCost[i]}%` }}
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 rounded-t-md bg-white/30"
                    style={{ minHeight: 4 }}
                  />
                </div>
                <span className="text-[10px] text-white/60">{d}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-end gap-2 pb-5">
            <div className="space-y-1 text-right">
              <div className="flex items-center gap-1.5 text-[11px] text-white/85">
                <span className="w-2 h-2 rounded-full bg-cyan-300" /> Turnover
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-white/60">
                <span className="w-2 h-2 rounded-full bg-white/40" /> Ads cost
              </div>
            </div>
            <Link
              to="/finance"
              className="pill-dark px-4 py-2 text-xs font-semibold flex items-center gap-1.5 hover:scale-[1.03] active:scale-95 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              Analyze
            </Link>
          </div>
        </div>
      </motion.div>

      {/* REPORTS frosted card */}
      <motion.div
        {...fade}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="frosted-light rounded-[28px] p-5 mb-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Reports</h3>
          <Link to="/finance" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {reports.map((r, i) => (
            <Link
              key={r.id}
              to={r.path}
              className="relative bg-white rounded-2xl p-4 overflow-hidden border border-slate-100 hover:shadow-lg transition group"
            >
              {/* big watermark icon */}
              <r.icon
                className={`absolute -top-2 -right-3 w-24 h-24 ${
                  r.tone === 'orange' ? 'text-orange-100' : 'text-teal-100'
                }`}
              />
              <div
                className={`relative w-11 h-11 rounded-full flex items-center justify-center mb-8 ${
                  r.tone === 'orange'
                    ? 'bg-gradient-to-br from-orange-400 to-orange-500'
                    : 'bg-gradient-to-br from-teal-400 to-teal-500'
                }`}
              >
                <r.icon className="w-5 h-5 text-white" />
              </div>
              <p className="relative text-[11px] text-slate-500 font-medium">{r.label}</p>
              <p className="relative text-2xl font-bold text-slate-900 mt-0.5 tabular-nums">{r.value}</p>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* CONTENT GRID — keeps existing modules */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* My Schedule */}
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="frosted rounded-[24px] p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">My Schedule</h3>
            <button className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div className="bg-white/8 rounded-2xl p-3 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white">December 2026</span>
              <div className="flex gap-1">
                <button className="w-5 h-5 rounded text-white/60 hover:text-white"><ChevronLeft className="w-3 h-3" /></button>
                <button className="w-5 h-5 rounded text-white/60 hover:text-white"><ChevronRight className="w-3 h-3" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <span key={i} className="text-[9px] text-white/50 text-center">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((d) => (
                <button
                  key={d}
                  className={`aspect-square text-[10px] rounded-full flex items-center justify-center ${
                    d === today ? 'bg-cyan-300 text-slate-900 font-bold' : 'text-white/85 hover:bg-white/10'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-white/60">
              <span>08:00 — 10:30</span>
              <span className="bg-destructive/20 text-destructive px-2 py-0.5 rounded-full font-medium">● Live</span>
            </div>
            <p className="text-sm font-semibold text-white">Singapore Batch Briefing</p>
            <p className="text-[11px] text-white/60 mt-2">
              Mentor: <span className="text-white font-medium">Aiko Tanaka</span>
            </p>
          </div>

          <Link
            to="/projects"
            className="mt-4 block bg-cyan-300 hover:bg-cyan-200 text-slate-900 text-center text-sm font-semibold rounded-full py-2.5 transition"
          >
            View All
          </Link>
        </motion.div>

        {/* My Documents (uploadable tiles) */}
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="frosted rounded-[24px] p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">My Documents</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={addTile}
                className="text-[11px] text-white bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" /> Add tile
              </button>
              <Link to="/drive" className="text-[11px] text-cyan-300 hover:underline">View All</Link>
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
                onClear={() => { clearTile(tile.id); toast('Tile cleared'); }}
                onPreview={() => setPreviewTile(tile.id)}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* BOTTOM ROW — Ongoing project + Team + Quick stats (kept content) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {/* Ongoing Project */}
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="frosted rounded-[24px] p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white">Ongoing Project</h3>
            <button className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center">
              <MoreHorizontal className="w-4 h-4 text-white/60" />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-400/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-medium">Active</span>
            <span className="bg-destructive/20 text-destructive text-[10px] px-2 py-0.5 rounded-full font-medium">● Live</span>
          </div>
          <p className="text-base font-bold text-white">{demoProjects[0].name}</p>
          <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
            {demoProjects[0].employer} — Marina Bay deployment, {demoProjects[0].targetWorkers} skilled workers.
          </p>
          <div className="mt-3 space-y-1.5 text-[11px]">
            <div className="flex justify-between"><span className="text-white/55">Batch</span><span className="text-cyan-300 font-medium">{demoProjects[0].batchCode}</span></div>
            <div className="flex justify-between"><span className="text-white/55">Country</span><span className="text-white font-medium">{demoProjects[0].country}</span></div>
          </div>
          <div className="mt-3">
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '68%' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-cyan-300"
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[10px]">
              <div className="flex items-center gap-1 text-white/60">
                <Users className="w-3 h-3" /> {demoProjects[0].workerCount}/{demoProjects[0].targetWorkers}
              </div>
              <span className="text-white font-medium">68%</span>
            </div>
          </div>
        </motion.div>

        {/* My Team */}
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="frosted rounded-[24px] p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">My Team</h3>
            <Link to="/workers" className="text-[11px] text-cyan-300 hover:underline">View All</Link>
          </div>
          <div className="space-y-2">
            {demoWorkers.slice(0, 4).map((w) => (
              <div key={w.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/8 transition">
                <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-[11px] font-bold text-primary-foreground">
                  {w.firstName[0]}{w.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{w.firstName} {w.lastName}</p>
                  <p className="text-[10px] text-white/55 truncate">{w.jobTitle} • {w.destinationCountry}</p>
                </div>
                <span className={`status-${w.status} text-[9px] px-2 py-0.5 rounded-full font-medium`}>
                  {w.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="frosted rounded-[24px] p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Quick Stats</h3>
            <TrendingUp className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="space-y-3">
            <Link to="/agreements" className="flex items-center justify-between bg-white/8 hover:bg-white/12 rounded-2xl p-3 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyan-300/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-cyan-300" />
                </div>
                <div>
                  <p className="text-xs text-white/60">Active Agreements</p>
                  <p className="text-sm font-bold text-white">5 documents</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/60" />
            </Link>
            <Link to="/projects" className="flex items-center justify-between bg-white/8 hover:bg-white/12 rounded-2xl p-3 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-400/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-orange-300" />
                </div>
                <div>
                  <p className="text-xs text-white/60">Workers In Pipeline</p>
                  <p className="text-sm font-bold text-white">{demoWorkers.filter(w => w.status !== 'completed').length} workers</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/60" />
            </Link>
            <Link to="/finance" className="flex items-center justify-between bg-white/8 hover:bg-white/12 rounded-2xl p-3 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-400/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <p className="text-xs text-white/60">This Month</p>
                  <p className="text-sm font-bold text-white">+SGD 24,000</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/60" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Document preview modal */}
      {previewing && previewing.dataUrl && (
        <DocumentViewer
          isOpen={!!previewing}
          onClose={() => setPreviewTile(null)}
          fileName={previewing.caption || previewing.title}
          fileType={previewing.kind === 'PDF' ? 'application/pdf' : 'image/*'}
          fileUrl={previewing.dataUrl}
        />
      )}
    </div>
  );
}
