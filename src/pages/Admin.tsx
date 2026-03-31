import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Shield, Activity, Archive, Search,
  ChevronRight, CheckCircle2, Clock, XCircle,
  UserPlus, MoreHorizontal,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { demoActivityLogs } from '@/data/demo';
import { toast } from 'sonner';
import SwipeableCards, { SwipeCard } from '@/components/SwipeableCards';

const tabs = ['Users', 'Roles', 'Logs', 'Archive'] as const;
type Tab = typeof tabs[number];

const demoUsers = [
  { id: 'u1', name: 'Shariyar Nasim', email: 'admin@visahobe.com', role: 'super_admin', status: 'active', lastLogin: '2 hours ago' },
  { id: 'u2', name: 'MD Hasan Raja', email: 'hasan@visahobe.com', role: 'partner', status: 'active', lastLogin: '5 hours ago' },
  { id: 'u3', name: 'Fatima Akter', email: 'fatima@visahobe.com', role: 'staff', status: 'active', lastLogin: '1 day ago' },
  { id: 'u4', name: 'Kamal Ahmed', email: 'kamal@visahobe.com', role: 'viewer', status: 'inactive', lastLogin: '3 weeks ago' },
];

const roleColors: Record<string, string> = {
  super_admin: 'bg-brand-gold/10 text-brand-gold',
  owner: 'bg-primary/10 text-primary',
  partner: 'bg-brand-blue/10 text-brand-blue',
  staff: 'bg-brand-green/10 text-brand-green',
  viewer: 'bg-muted text-muted-foreground',
};

const rolePerms: Record<string, string[]> = {
  super_admin: ['Full system access', 'Manage users & roles', 'View analytics', 'Archive/restore'],
  owner: ['Business controls', 'Manage workers', 'View finance', 'Generate agreements'],
  partner: ['View shared data', 'Partner dashboard', 'Profit reports'],
  staff: ['Manage workers', 'Upload documents', 'View projects'],
  viewer: ['Read-only access', 'View dashboards'],
};

const archivedItems = [
  { name: 'Worker — Farhan Ali', archivedOn: '2026-02-15', reason: 'Contract completed' },
  { name: 'Project — Oman Batch 2025', archivedOn: '2025-12-31', reason: 'Project closed' },
];

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('Users');
  const [searchUsers, setSearchUsers] = useState('');

  const filteredUsers = demoUsers.filter(u =>
    `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(searchUsers.toLowerCase())
  );

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-0.5">System administration and controls</p>
      </motion.div>

      {/* Stats — Swipeable */}
      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.08 }} className="mt-4">
        <SwipeableCards>
          {[
            { label: 'Users', value: demoUsers.length, icon: Users, color: 'bg-brand-blue/10 text-brand-blue' },
            { label: 'Roles', value: 5, icon: Shield, color: 'bg-brand-gold/10 text-brand-gold' },
            { label: 'Logs', value: demoActivityLogs.length, icon: Activity, color: 'bg-brand-green/10 text-brand-green' },
            { label: 'Archived', value: archivedItems.length, icon: Archive, color: 'bg-muted text-muted-foreground' },
          ].map((stat, i) => (
            <SwipeCard key={stat.label} minWidth="100px">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                className="card-elevated p-3 text-center"
              >
                <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color.split(' ')[1]}`} />
                <p className="text-xl font-bold text-foreground tabular-nums">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
              </motion.div>
            </SwipeCard>
          ))}
        </SwipeableCards>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border/50 mt-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'Users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="space-y-3"
            >
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchUsers}
                    onChange={(e) => setSearchUsers(e.target.value)}
                    className="pl-10 h-10 rounded-xl bg-card border-border/50"
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => toast.info('Add user — connect Lovable Cloud for auth')}
                  className="h-10 px-4 rounded-xl gradient-navy text-white text-sm font-medium flex items-center gap-1.5 active:scale-95"
                >
                  <UserPlus className="w-4 h-4" /> Add
                </motion.button>
              </div>
              {filteredUsers.map((u, i) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="card-elevated flex items-center gap-3 p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{u.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">Last login: {u.lastLogin}</p>
                  </div>
                  <span className={`${roleColors[u.role]} text-[10px] px-2 py-0.5 rounded-full font-medium`}>
                    {u.role.replace('_', ' ')}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-brand-green' : 'bg-muted-foreground/40'}`} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'Roles' && (
            <motion.div
              key="roles"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="space-y-2"
            >
              {['super_admin', 'owner', 'partner', 'staff', 'viewer'].map((role, i) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="card-elevated p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
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
                    <span className="text-[10px] text-muted-foreground">{demoUsers.filter(u => u.role === role).length} users</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 ml-[52px]">
                    {(rolePerms[role] || []).map(perm => (
                      <span key={perm} className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{perm}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'Logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="card-elevated divide-y divide-border"
            >
              {demoActivityLogs.map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.04 * i }}
                  className="flex items-start gap-3 px-4 py-3"
                >
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.details} — {log.user}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'Archive' && (
            <motion.div
              key="archive"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="space-y-2"
            >
              {archivedItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="card-elevated flex items-center gap-3 p-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Archive className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.reason} — {item.archivedOn}</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toast.success(`${item.name} restored`)}
                    className="text-xs text-brand-blue font-medium px-3 py-1.5 rounded-lg hover:bg-brand-blue/10 transition-colors"
                  >
                    Restore
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
