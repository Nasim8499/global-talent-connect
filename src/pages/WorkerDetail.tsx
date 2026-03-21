import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Phone, Calendar, FileText,
  CreditCard, Clock, CheckCircle2, Circle, Briefcase,
  Flag, Hash,
} from 'lucide-react';
import { demoWorkers, demoPayments, statusLabels, countryFlags } from '@/data/demo';

const tabs = ['Overview', 'Documents', 'Payments', 'Timeline'] as const;
type Tab = typeof tabs[number];

const timelineStages = [
  { key: 'registered', label: 'Registered', icon: Circle },
  { key: 'documents_pending', label: 'Documents Submitted', icon: FileText },
  { key: 'visa_processing', label: 'Visa Processing', icon: Clock },
  { key: 'approved', label: 'Approved', icon: CheckCircle2 },
  { key: 'deployed', label: 'Deployed', icon: MapPin },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
];

const stageOrder = ['registered', 'documents_pending', 'visa_processing', 'approved', 'deployed', 'completed'];

const demoDocuments = [
  { name: 'Passport Copy', status: 'uploaded', date: '2026-01-15' },
  { name: 'Medical Certificate', status: 'pending', date: null },
  { name: 'Education Certificate', status: 'uploaded', date: '2026-01-16' },
  { name: 'Police Clearance', status: 'uploaded', date: '2026-01-18' },
  { name: 'Employment Contract', status: 'uploaded', date: '2026-01-20' },
  { name: 'Photo (Passport Size)', status: 'uploaded', date: '2026-01-15' },
  { name: 'Visa Application Form', status: 'pending', date: null },
];

export default function WorkerDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  const worker = demoWorkers.find(w => w.id === id);
  if (!worker) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground">Worker not found</p>
        <Link to="/workers" className="text-brand-blue text-sm mt-2 inline-block">← Back to workers</Link>
      </div>
    );
  }

  const currentStageIdx = stageOrder.indexOf(worker.status);
  const workerPayments = demoPayments.filter(p => p.workerId === worker.id);

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
      </div>

      {/* Tabs */}
      <div className="sticky top-14 md:top-0 z-20 bg-background border-b border-border/50">
        <div className="flex gap-0 overflow-x-auto px-4 md:px-8">
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
      <div className="px-4 md:px-8 py-6">
        {activeTab === 'Overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="card-elevated p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Personal Info</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Hash, label: 'Passport', value: worker.passport },
                  { icon: Flag, label: 'Nationality', value: worker.nationality },
                  { icon: Phone, label: 'Phone', value: worker.phone || 'N/A' },
                  { icon: Calendar, label: 'Registered', value: worker.createdAt },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2">
                    <item.icon className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">{item.label}</p>
                      <p className="text-sm text-foreground font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-elevated p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Job Assignment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Job Title</p>
                    <p className="text-sm text-foreground font-medium">{worker.jobTitle}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Destination</p>
                    <p className="text-sm text-foreground font-medium">{worker.destinationCountry}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Project</p>
                    <p className="text-sm text-foreground font-medium">{worker.projectId || 'Unassigned'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Documents' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {demoDocuments.map((doc) => (
              <div key={doc.name} className="card-elevated flex items-center gap-3 p-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${doc.status === 'uploaded' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                  <FileText className={`w-4 h-4 ${doc.status === 'uploaded' ? 'text-emerald-600' : 'text-amber-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.date || 'Not uploaded'}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${doc.status === 'uploaded' ? 'status-active' : 'status-pending'}`}>
                  {doc.status === 'uploaded' ? 'Uploaded' : 'Pending'}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'Payments' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {workerPayments.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No payments recorded</p>
              </div>
            ) : (
              workerPayments.map((pay) => (
                <div key={pay.id} className="card-elevated flex items-center gap-3 p-4">
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
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'Timeline' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-4">
            {timelineStages.map((stage, i) => {
              const isPast = i <= currentStageIdx;
              const isCurrent = stageOrder[i] === worker.status;
              return (
                <div key={stage.key} className="flex gap-4 relative">
                  {i < timelineStages.length - 1 && (
                    <div className={`absolute left-[11px] top-8 w-0.5 h-[calc(100%-16px)] ${isPast ? 'bg-brand-blue' : 'bg-border'}`} />
                  )}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    isCurrent ? 'bg-brand-blue shadow-glow' : isPast ? 'bg-brand-blue' : 'bg-muted border border-border'
                  }`}>
                    <stage.icon className={`w-3 h-3 ${isPast || isCurrent ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="pb-6">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-brand-blue' : isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {stage.label}
                    </p>
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue font-medium mt-1 inline-block">
                        Current Stage
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
