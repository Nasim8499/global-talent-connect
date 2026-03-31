import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, User, Bell, Palette, Globe, Lock, ChevronRight, Check, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function Settings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false });
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections = [
    {
      title: 'Account',
      items: [
        {
          icon: User, label: 'Profile Information', desc: 'Name, email, phone', id: 'profile',
          content: (
            <div className="space-y-3 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Name</span>
                <span className="text-sm font-medium text-foreground">{user?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Email</span>
                <span className="text-sm font-medium text-foreground">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Role</span>
                <span className="text-sm font-medium text-foreground capitalize">{user?.role?.replace('_', ' ')}</span>
              </div>
            </div>
          ),
        },
        {
          icon: Lock, label: 'Security', desc: 'Password, 2FA', id: 'security',
          content: (
            <div className="space-y-3 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Password</span>
                <span className="text-sm text-foreground">••••••••</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Two-Factor Auth</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium">Not Enabled</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => toast.info('2FA setup — connect Lovable Cloud for auth')}
                className="w-full h-10 rounded-xl bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
              >
                Enable 2FA
              </motion.button>
            </div>
          ),
        },
        {
          icon: Bell, label: 'Notifications', desc: 'Email and push preferences', id: 'notifications',
          content: (
            <div className="space-y-3 pt-3">
              {[
                { key: 'email' as const, label: 'Email Notifications' },
                { key: 'push' as const, label: 'Push Notifications' },
                { key: 'sms' as const, label: 'SMS Alerts' },
              ].map((n) => (
                <div key={n.key} className="flex justify-between items-center">
                  <span className="text-sm text-foreground">{n.label}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }));
                      toast.success(`${n.label} ${notifications[n.key] ? 'disabled' : 'enabled'}`);
                    }}
                    className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${
                      notifications[n.key] ? 'bg-brand-green' : 'bg-muted'
                    }`}
                  >
                    <motion.div
                      animate={{ x: notifications[n.key] ? 20 : 2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-1"
                    />
                  </motion.button>
                </div>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: 'Company',
      items: [
        {
          icon: Building2, label: 'Company Details', desc: 'VisaHOBe PTE. LTD. branding', id: 'company',
          content: (
            <div className="space-y-3 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Company</span>
                <span className="text-sm font-medium text-foreground">VisaHOBe PTE. LTD.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">System</span>
                <span className="text-sm font-medium text-foreground">VisaMOTion v1.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Registration</span>
                <span className="text-sm font-medium text-foreground">Singapore</span>
              </div>
            </div>
          ),
        },
        {
          icon: Globe, label: 'Regional Settings', desc: 'Timezone, currency, language', id: 'regional',
          content: (
            <div className="space-y-3 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Timezone</span>
                <span className="text-sm font-medium text-foreground">Asia/Singapore (GMT+8)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Currency</span>
                <span className="text-sm font-medium text-foreground">SGD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Language</span>
                <span className="text-sm font-medium text-foreground">English</span>
              </div>
            </div>
          ),
        },
        {
          icon: Palette, label: 'Appearance', desc: 'Theme and display options', id: 'appearance',
          content: (
            <div className="space-y-3 pt-3">
              <p className="text-xs text-muted-foreground">Theme</p>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-muted border-2 border-primary flex items-center gap-2 text-sm font-medium"
                >
                  <Sun className="w-4 h-4" /> Light
                  <Check className="w-3.5 h-3.5 ml-auto text-primary" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toast.info('Dark mode coming soon')}
                  className="p-3 rounded-xl bg-muted border-2 border-transparent flex items-center gap-2 text-sm font-medium text-muted-foreground"
                >
                  <Moon className="w-4 h-4" /> Dark
                </motion.button>
              </div>
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Summary */}
      <motion.div
        {...fade}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card-elevated p-5 mt-6 flex items-center gap-4"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          className="w-14 h-14 rounded-2xl gradient-navy flex items-center justify-center"
        >
          <span className="text-lg font-bold text-white">SN</span>
        </motion.div>
        <div>
          <h2 className="text-base font-bold text-foreground">{user?.name}</h2>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <span className="text-[10px] text-brand-gold font-medium uppercase tracking-wider">{user?.role?.replace('_', ' ')}</span>
        </div>
      </motion.div>

      {sections.map((section, si) => (
        <motion.div
          key={section.title}
          {...fade}
          transition={{ duration: 0.5, delay: 0.15 + si * 0.1 }}
          className="mt-6"
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{section.title}</h2>
          <div className="card-elevated divide-y divide-border">
            {section.items.map((item) => {
              const isExpanded = expandedSection === item.id;
              return (
                <div key={item.id}>
                  <motion.button
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setExpandedSection(isExpanded ? null : item.id)}
                    className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4">
                          {item.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

      <motion.div {...fade} transition={{ duration: 0.5, delay: 0.4 }} className="mt-8 text-center">
        <p className="text-xs text-muted-foreground/60">VisaHOBe PTE. LTD. — VisaMOTion Recruitment System v1.0</p>
      </motion.div>
    </div>
  );
}
