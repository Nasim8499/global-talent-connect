import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Shield, Activity, Archive, Settings,
  Search, ChevronRight, CheckCircle2, Clock,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { demoActivityLogs } from '@/data/demo';

const tabs = ['Users', 'Roles', 'Logs', 'Archive'] as const;
type Tab = typeof tabs[number];
const tabIcons = { Users, Roles: Shield, Logs: Activity, Archive };

const demoUsers = [
  { id: 'u1', name: 'Shariyar Nasim', email: 'admin@visahobe.com', role: 'super_admin', status: 'active' },
  { id: 'u2', name: 'MD Hasan Raja', email: 'hasan@visahobe.com', role: 'partner', status: 'active' },
  { id: 'u3', name: 'Fatima Akter', email: 'fatima@visahobe.com', role: 'staff', status: 'active' },
  { id: 'u4', name: 'Kamal Ahmed', email: 'kamal@visahobe.com', role: 'viewer', status: 'inactive' },
];

const roleColors: Record<string, string> = {
  super_admin: 'bg-brand-gold/10 text-brand-gold',
  owner: 'bg-primary/10 text-primary',
  partner: 'bg-brand-blue/10 text-brand-blue',
  staff: 'bg-brand-green/10 text-brand-green',
  viewer: 'bg-muted text-muted-foreground',
};

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('Users');

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-0.5">System administration and controls</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mt-6">
        {[
          { label: 'Users', value: demoUsers.length, color: 'bg-brand-blue/10 text-brand-blue' },
          { label: 'Roles', value: 5, color: 'bg-brand-gold/10 text-brand-gold' },
          { label: 'Logs', value: demoActivityLogs.length, color: 'bg-brand-green/10 text-brand-green' },
          { label: 'Archived', value: 2, color: 'bg-muted text-muted-foreground' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            {...fade}
            transition={{ duration: 0.4, delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
            className="card-elevated p-3 text-center"
          >
            <p className="text-xl font-bold text-foreground tabular-nums">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border/50 mt-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === 'Users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {demoUsers.map((u) => (
              <div key={u.id} className="card-elevated flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{u.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <span className={`${roleColors[u.role]} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                  {u.role.replace('_', ' ')}
                </span>
                <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-brand-green' : 'bg-muted-foreground/40'}`} />
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'Roles' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {['super_admin', 'owner', 'partner', 'staff', 'viewer'].map((role) => (
              <div key={role} className="card-elevated flex items-center gap-3 p-4">
                <div className={`w-10 h-10 rounded-xl ${roleColors[role]} flex items-center justify-center`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground capitalize">{role.replace('_', ' ')}</p>
                  <p className="text-xs text-muted-foreground">{
                    role === 'super_admin' ? 'Full system access' :
                    role === 'owner' ? 'Business owner controls' :
                    role === 'partner' ? 'Partner-level access' :
                    role === 'staff' ? 'Operational access' : 'Read-only access'
                  }</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'Logs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-elevated divide-y divide-border">
            {demoActivityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 px-4 py-3">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium">{log.action}</p>
                  <p className="text-xs text-muted-foreground">{log.details} — {log.user}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'Archive' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Archive className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">2 archived records</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Archived items can be restored from here</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
