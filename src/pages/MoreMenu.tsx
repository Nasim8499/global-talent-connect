import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, DollarSign, Shield, Settings, UserCircle,
  Handshake, FolderOpen, Bell, HelpCircle, LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { label: 'Agreements', icon: FileText, path: '/agreements', color: 'bg-primary/10 text-primary' },
  { label: 'Finance', icon: DollarSign, path: '/finance', color: 'bg-brand-green/10 text-brand-green' },
  { label: 'Owner Profile', icon: UserCircle, path: '/owners', color: 'bg-brand-blue/10 text-brand-blue' },
  { label: 'Partners', icon: Handshake, path: '/partners', color: 'bg-brand-gold/10 text-brand-gold' },
  { label: 'File Center', icon: FolderOpen, path: '/auto', color: 'bg-amber-100 text-amber-700' },
  { label: 'Notifications', icon: Bell, path: '/', color: 'bg-sky-50 text-sky-600' },
  { label: 'Admin Panel', icon: Shield, path: '/admin', color: 'bg-red-50 text-red-600' },
  { label: 'Settings', icon: Settings, path: '/settings', color: 'bg-muted text-muted-foreground' },
  { label: 'Help & Support', icon: HelpCircle, path: '/', color: 'bg-emerald-50 text-emerald-600' },
];

export default function MoreMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="card-elevated p-5 flex items-center gap-4 mb-6"
      >
        <div className="w-14 h-14 rounded-2xl gradient-navy flex items-center justify-center">
          <span className="text-lg font-bold text-white">SN</span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-foreground">{user?.name}</h2>
          <p className="text-xs text-muted-foreground">{user?.company}</p>
          <p className="text-[10px] text-brand-gold font-medium mt-0.5 uppercase tracking-wider">{user?.role?.replace('_', ' ')}</p>
        </div>
      </motion.div>

      {/* Menu Grid */}
      <div className="grid grid-cols-3 gap-3">
        {menuItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.04 * i, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={item.path}
              className="card-elevated p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:shadow-lifted active:scale-[0.96]"
            >
              <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-foreground text-center leading-tight">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Sign Out */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={() => { logout(); navigate('/login'); }}
        className="w-full mt-6 card-elevated p-4 flex items-center justify-center gap-2 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors active:scale-[0.97]"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </motion.button>
    </div>
  );
}
