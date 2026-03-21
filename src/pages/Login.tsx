import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@visahobe.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const ok = login(email, password);
    setLoading(false);
    if (ok) navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-navy px-4">
      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-blue/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-brand-gold/10 rounded-full blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-gold shadow-glow mb-4"
          >
            <Globe className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white tracking-tight">VisaHOBe</h1>
          <p className="text-white/40 text-sm mt-1">VisaMOTion Recruitment System</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl p-6 shadow-2xl">
          <h2 className="text-lg font-semibold text-card-foreground mb-1">Welcome back</h2>
          <p className="text-sm text-muted-foreground mb-6">Sign in to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-brand-blue"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</label>
              <div className="relative mt-1.5">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-muted/50 border-0 pr-12 focus-visible:ring-2 focus-visible:ring-brand-blue"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-navy-light font-semibold text-sm transition-all duration-200 active:scale-[0.97]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Demo credentials pre-filled
          </p>
        </div>

        <p className="text-center text-white/30 text-xs mt-8">
          VisaHOBe PTE. LTD. © 2026
        </p>
      </motion.div>
    </div>
  );
}
