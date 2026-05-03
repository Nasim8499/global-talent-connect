import { type ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Upload, FolderKanban, Menu,
  FileText, DollarSign, Shield, Settings, LogOut,
  Globe, Bell, Plus, ChevronLeft, Handshake, UserCircle,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const bottomTabs = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/workers', icon: Users, label: 'Workers' },
  { path: '/auto', icon: Upload, label: 'Auto', center: true },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
  { path: '/more', icon: Menu, label: 'More' },
];

const sidebarLinks = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/workers', icon: Users, label: 'Workers' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
  { path: '/auto', icon: Upload, label: 'Auto System' },
  { path: '/drive', icon: FolderKanban, label: 'Drive' },
  { path: '/agreements', icon: FileText, label: 'Agreements' },
  { path: '/finance', icon: DollarSign, label: 'Finance' },
  { path: '/owners', icon: UserCircle, label: 'Owner Profile' },
  { path: '/partners', icon: Handshake, label: 'Partners' },
  { path: '/admin', icon: Shield, label: 'Admin' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const fabActions = [
    { icon: Users, label: 'Add Worker', path: '/workers' },
    { icon: FolderKanban, label: 'New Project', path: '/projects' },
    { icon: Upload, label: 'Upload Doc', path: '/auto' },
    { icon: FileText, label: 'Agreement', path: '/agreements' },
  ];

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-40 gradient-navy transition-all duration-300 ${sidebarCollapsed ? 'w-[72px]' : 'w-64'}`}>
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-white tracking-tight">VisaHOBe</h1>
              <p className="text-[10px] text-white/50">VisaMOTion System</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto text-white/40 hover:text-white/80 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                isActive(link.path)
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              }`}
            >
              <link.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive(link.path) ? 'text-brand-gold' : ''}`} />
              {!sidebarCollapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 px-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-xs font-bold text-brand-gold">SN</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-white/40 truncate">{user?.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={async () => { await logout(); navigate('/login'); }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 w-full text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-[72px]' : 'md:ml-64'}`}>
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 glass-white border-b border-border/50">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-sm text-foreground tracking-tight">VisaHOBe</span>
            </div>
            <button className="relative p-2 -mr-2">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="pb-24 md:pb-6 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border shadow-lifted">
        <div className="flex items-end justify-around px-2 pt-1 pb-[env(safe-area-inset-bottom)]">
          {bottomTabs.map((tab) =>
            tab.center ? (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex flex-col items-center -mt-5"
              >
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lifted transition-all duration-300 ${
                    isActive(tab.path)
                      ? 'bg-white'
                      : 'bg-primary'
                  }`}
                >
                  <tab.icon className={`w-6 h-6 transition-colors ${isActive(tab.path) ? 'text-primary' : 'text-white'}`} />
                </motion.div>
                <span className={`text-[10px] mt-1 font-medium transition-colors ${isActive(tab.path) ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {tab.label}
                </span>
              </Link>
            ) : (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex flex-col items-center py-2 px-3 relative"
              >
                {isActive(tab.path) && (
                  <motion.div
                    layoutId="bottom-nav-pill"
                    className="absolute inset-1 bg-white rounded-2xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <tab.icon className={`w-5 h-5 relative z-10 transition-colors ${isActive(tab.path) ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className={`text-[10px] mt-1 font-medium relative z-10 transition-colors ${isActive(tab.path) ? 'text-primary' : 'text-muted-foreground'}`}>
                  {tab.label}
                </span>
              </Link>
            )
          )}
        </div>
      </nav>

      {/* FAB */}
      <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50">
        <AnimatePresence>
          {fabOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-16 right-0 space-y-2"
            >
              {fabActions.map((action, i) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => { setFabOpen(false); navigate(action.path); }}
                  className="flex items-center gap-2 bg-card rounded-xl px-4 py-2.5 shadow-lifted whitespace-nowrap text-sm font-medium text-foreground hover:bg-muted transition-colors active:scale-95"
                >
                  <action.icon className="w-4 h-4 text-brand-blue" />
                  {action.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setFabOpen(!fabOpen)}
          className={`w-14 h-14 rounded-2xl shadow-lifted flex items-center justify-center transition-all duration-300 active:scale-95 ${
            fabOpen ? 'bg-foreground rotate-45' : 'gradient-gold'
          }`}
        >
          <Plus className={`w-6 h-6 ${fabOpen ? 'text-background' : 'text-primary'}`} />
        </button>
      </div>
    </div>
  );
}
