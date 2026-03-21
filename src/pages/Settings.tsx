import { motion } from 'framer-motion';
import { Building2, User, Bell, Palette, Globe, Lock, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const sections = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Profile Information', desc: 'Name, email, phone' },
      { icon: Lock, label: 'Security', desc: 'Password, 2FA' },
      { icon: Bell, label: 'Notifications', desc: 'Email and push preferences' },
    ],
  },
  {
    title: 'Company',
    items: [
      { icon: Building2, label: 'Company Details', desc: 'VisaHOBe PTE. LTD. branding' },
      { icon: Globe, label: 'Regional Settings', desc: 'Timezone, currency, language' },
      { icon: Palette, label: 'Appearance', desc: 'Theme and display options' },
    ],
  },
];

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Summary */}
      <motion.div
        {...fade}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="card-elevated p-5 mt-6 flex items-center gap-4"
      >
        <div className="w-14 h-14 rounded-2xl gradient-navy flex items-center justify-center">
          <span className="text-lg font-bold text-white">SN</span>
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">{user?.name}</h2>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </motion.div>

      {sections.map((section, si) => (
        <motion.div
          key={section.title}
          {...fade}
          transition={{ duration: 0.5, delay: 0.15 + si * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6"
        >
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{section.title}</h2>
          <div className="card-elevated divide-y divide-border">
            {section.items.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-muted/50 transition-colors text-left active:scale-[0.99]"
              >
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
              </button>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        {...fade}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-muted-foreground/60">VisaHOBe PTE. LTD. — VisaMOTion Recruitment System v1.0</p>
      </motion.div>
    </div>
  );
}
