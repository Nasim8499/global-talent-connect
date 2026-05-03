import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Phone, Calendar, FileText,
  CreditCard, Clock, CheckCircle2, Circle, Briefcase,
  Flag, Hash, Upload, Eye, Download, Edit,
} from 'lucide-react';
import { demoWorkers, demoPayments, statusLabels, countryFlags } from '@/data/demo';
import { toast } from 'sonner';

const tabs = ['Overview', 'Documents', 'Payments', 'Timeline'] as const;
type Tab = typeof tabs[number];

const timelineStages = [
  { key: 'registered', label: 'Registered', icon: Circle, date: 'Jan 15, 2026' },
  { key: 'documents_pending', label: 'Documents Submitted', icon: FileText, date: 'Jan 20, 2026' },
  { key: 'visa_processing', label: 'Visa Processing', icon: Clock, date: 'Feb 01, 2026' },
  { key: 'approved', label: 'Approved', icon: CheckCircle2, date: 'Feb 15, 2026' },
  { key: 'deployed', label: 'Deployed', icon: MapPin, date: 'Mar 01, 2026' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, date: '—' },
];

const stageOrder = ['registered', 'documents_pending', 'visa_processing', 'approved', 'deployed', 'completed'];

const demoDocuments = [
  { name: 'Passport Copy', status: 'uploaded', date: '2026-01-15', size: '2.4 MB' },
  { name: 'Medical Certificate', status: 'pending', date: null, size: null },
  { name: 'Education Certificate', status: 'uploaded', date: '2026-01-16', size: '1.1 MB' },
  { name: 'Police Clearance', status: 'uploaded', date: '2026-01-18', size: '890 KB' },
  { name: 'Employment Contract', status: 'uploaded', date: '2026-01-20', size: '3.2 MB' },
  { name: 'Photo (Passport Size)', status: 'uploaded', date: '2026-01-15', size: '450 KB' },
  { name: 'Visa Application Form', status: 'pending', date: null, size: null },
];

export default function WorkerDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  const worker = demoWorkers.find(w => w.id === id);
  if (!worker) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-4 py-12 text-center"
      >
        <p className="text-muted-foreground">Worker not found</p>
        <Link to="/workers" className="text-brand-blue text-sm mt-2 inline-block">← Back to workers</Link>
      </motion.div>
    );
  }

  const currentStageIdx = stageOrder.indexOf(worker.status);
  const workerPayments = demoPayments.filter(p => p.workerId === worker.id);
  const uploadedDocs = demoDocuments.filter(d => d.status === 'uploaded').length;
  const totalDocs = demoDocuments.length;
  const docProgress = (uploadedDocs / totalDocs) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="gradient-navy px-4 md:px-8 pt-4 pb-8">
        <Link to="/workers" className="inline-flex items-center gap-1.5 text-white/60 text-sm hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Workers
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
            <span className="text-xl font-bold text-white">{worker.firstName[0]}{worker.lastName[0]}</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{worker.firstName} {worker.lastName}</h1>
            <p className="text-xs text-white/50 font-mono mt-0.5">{worker.internalId}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`status-${worker.status} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                {statusLabels[worker.status]}
              </span>
              <span className="text-xs text-white/60">{countryFlags[worker.destinationCountry]} {worker.destinationCountry}</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="grid grid-cols-3 gap-3 mt-5"
        >
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-white">{uploadedDocs}/{totalDocs}</p>
            <p className="text-[10px] text-white/50">Documents</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-white">{workerPayments.length}</p>
            <p className="text-[10px] text-white/50">Payments</p>
          </div>
          <div className="glass rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-white">{currentStageIdx + 1}/6</p>
            <p className="text-[10px] text-white/50">Stage</p>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 md:top-0 z-20 bg-background border-b border-border/50">
        <div className="flex gap-0 overflow-x-auto px-4 md:px-8 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="card-elevated p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personal Info</h3>
                  <button
                    onClick={() => toast.info('Edit mode coming soon')}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Hash, label: 'Passport', value: worker.passport },
                    { icon: Flag, label: 'Nationality', value: worker.nationality },
                    { icon: Phone, label: 'Phone', value: worker.phone || 'N/A' },
                    { icon: Calendar, label: 'Registered', value: worker.createdAt },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="flex items-start gap-2"
                    >
                      <item.icon className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">{item.label}</p>
                        <p className="text-sm text-foreground font-medium">{item.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="card-elevated p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Job Assignment</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Briefcase, label: 'Job Title', value: worker.jobTitle },
                    { icon: MapPin, label: 'Destination', value: worker.destinationCountry },
                    { icon: Hash, label: 'Project', value: worker.projectId || 'Unassigned' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="flex items-start gap-2"
                    >
                      <item.icon className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-[10px] text-muted-foreground">{item.label}</p>
                        <p className="text-sm text-foreground font-medium">{item.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              {/* Doc Progress */}
              <div className="card-elevated p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Document Completion</h3>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{uploadedDocs} of {totalDocs} uploaded</span>
                  <span className="font-bold text-foreground">{Math.round(docProgress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${docProgress}%` }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full ${docProgress === 100 ? 'bg-brand-green' : 'gradient-blue'}`}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="space-y-2"
            >
              {/* Upload button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => toast.info('Upload coming soon — connect Lovable Cloud for file storage')}
                className="w-full card-elevated p-4 border-2 border-dashed border-brand-blue/20 flex items-center justify-center gap-2 text-sm font-medium text-brand-blue hover:border-brand-blue/40 transition-colors rounded-2xl mb-3"
              >
                <Upload className="w-4 h-4" /> Upload Document
              </motion.button>
              {demoDocuments.map((doc, i) => (
                <motion.div
                  key={doc.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="card-elevated flex items-center gap-3 p-4"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${doc.status === 'uploaded' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                    <FileText className={`w-4 h-4 ${doc.status === 'uploaded' ? 'text-emerald-600' : 'text-amber-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.date || 'Not uploaded'}{doc.size ? ` • ${doc.size}` : ''}</p>
                  </div>
                  {doc.status === 'uploaded' ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => toast.info('Preview coming soon')}
                        className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => toast.info('Download coming soon')}
                        className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <span className="status-pending text-[10px] px-2 py-0.5 rounded-full font-medium">Pending</span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'Payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="space-y-2"
            >
              {/* Payment Summary */}
              <div className="card-elevated p-4 mb-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Total Paid</p>
                    <p className="text-lg font-bold text-brand-green tabular-nums">
                      SGD {workerPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Outstanding</p>
                    <p className="text-lg font-bold text-amber-600 tabular-nums">
                      SGD {workerPayments.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              {workerPayments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No payments recorded</p>
                </div>
              ) : (
                workerPayments.map((pay, i) => (
                  <motion.div
                    key={pay.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="card-elevated flex items-center gap-3 p-4"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      pay.status === 'paid' ? 'bg-emerald-50' : pay.status === 'overdue' ? 'bg-red-50' : 'bg-amber-50'
                    }`}>
                      <CreditCard className={`w-4 h-4 ${
                        pay.status === 'paid' ? 'text-emerald-600' : pay.status === 'overdue' ? 'text-red-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{pay.description}</p>
                      <p className="text-xs text-muted-foreground">{pay.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground tabular-nums">{pay.currency} {pay.amount.toLocaleString()}</p>
                      <span className={`status-${pay.status} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                        {statusLabels[pay.status]}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'Timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="pl-4"
            >
              {timelineStages.map((stage, i) => {
                const isPast = i <= currentStageIdx;
                const isCurrent = stageOrder[i] === worker.status;
                return (
                  <motion.div
                    key={stage.key}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * i, duration: 0.3 }}
                    className="flex gap-4 relative"
                  >
                    {i < timelineStages.length - 1 && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'calc(100% - 16px)' }}
                        transition={{ delay: 0.1 * i, duration: 0.4 }}
                        className={`absolute left-[11px] top-8 w-0.5 ${isPast ? 'bg-brand-blue' : 'bg-border'}`}
                      />
                    )}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                      isCurrent ? 'bg-brand-blue shadow-glow scale-110' : isPast ? 'bg-brand-blue' : 'bg-muted border border-border'
                    }`}>
                      <stage.icon className={`w-3 h-3 ${isPast || isCurrent ? 'text-white' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-medium ${isCurrent ? 'text-brand-blue' : isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {stage.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{stage.date}</p>
                      {isCurrent && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue font-medium mt-1 inline-block"
                        >
                          Current Stage
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
