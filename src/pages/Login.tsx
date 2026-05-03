import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Globe, Loader2, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth, roleHomePath } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DigitalBackdrop from '@/components/DigitalBackdrop';

type Mode = 'signin' | 'signup';

const baseSchema = {
  email: z.string().trim().toLowerCase()
    .min(1, 'Email is required')
    .email('Enter a valid email address')
    .max(255, 'Email must be under 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be under 72 characters')
    .regex(/[A-Za-z]/, 'Password must include a letter')
    .regex(/[0-9]/, 'Password must include a number'),
};

const signinSchema = z.object(baseSchema);
const signupSchema = z.object({
  ...baseSchema,
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80, 'Name must be under 80 characters'),
});

type FieldErrors = { email?: string; password?: string; name?: string; form?: string };

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean; name?: boolean }>({});

  const passwordScore = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthLabel = ['Too weak', 'Weak', 'Fair', 'Strong', 'Excellent'][passwordScore];
  const strengthColor = ['bg-destructive', 'bg-destructive', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-500'][passwordScore];

  const validate = (): FieldErrors => {
    const schema = mode === 'signup' ? signupSchema : signinSchema;
    const result = schema.safeParse({ email, password, ...(mode === 'signup' ? { name } : {}) });
    if (result.success) return {};
    const next: FieldErrors = {};
    for (const issue of result.error.issues) {
      const k = issue.path[0] as keyof FieldErrors;
      if (k && !next[k]) next[k] = issue.message;
    }
    return next;
  };

  const validateField = (field: 'email' | 'password' | 'name') => {
    const next = validate();
    setErrors((prev) => ({ ...prev, [field]: next[field], form: undefined }));
  };

  const fetchRoleAndRedirect = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return navigate('/');
    const { data } = await supabase
      .from('user_roles').select('role')
      .eq('user_id', user.id).order('role').limit(1).maybeSingle();
    navigate(roleHomePath(data?.role ?? 'viewer'), { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setTouched({ email: true, password: true, name: mode === 'signup' });
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email.trim().toLowerCase(), password);
        if (error) {
          const msg = /invalid|credentials/i.test(error) ? 'Incorrect email or password.' : error;
          setErrors({ form: msg });
          toast.error(msg);
          return;
        }
        toast.success('Welcome back');
        await fetchRoleAndRedirect();
      } else {
        const { error } = await signUp(email.trim().toLowerCase(), password, name.trim());
        if (error) {
          const msg = /registered|exists/i.test(error) ? 'An account with this email already exists.' : error;
          setErrors({ form: msg });
          toast.error(msg);
          return;
        }
        toast.success('Account created — check your email to confirm.');
        setMode('signin');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setErrors({});
    setTouched({});
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-navy px-4 overflow-hidden relative">
      <DigitalBackdrop />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-gold shadow-glow mb-4"
          >
            <Globe className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white tracking-tight">VisaHOBe</h1>
          <p className="text-white/40 text-sm mt-1">VisaMOTion Recruitment System</p>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-2xl">
          {/* Tabs */}
          <div className="relative grid grid-cols-2 mb-5 bg-muted/40 rounded-xl p-1">
            {(['signin','signup'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="relative z-10 py-2 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                {mode === m && (
                  <motion.div layoutId="auth-tab-pill"
                    className="absolute inset-0 bg-card rounded-lg shadow"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                )}
                <span className={`relative z-10 ${mode === m ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                >
                  <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)}
                    className="mt-1 h-11 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-brand-blue" />
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Email</label>
              <Input type="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-11 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-brand-blue" />
            </div>
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Password</label>
              <div className="relative mt-1">
                <Input type={showPassword ? 'text' : 'password'} required minLength={6}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl bg-muted/50 border-0 pr-12 focus-visible:ring-2 focus-visible:ring-brand-blue" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-navy-light font-semibold text-sm transition-all duration-200 active:scale-[0.97] mt-1">
              {loading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <p className="text-center text-[11px] text-muted-foreground mt-4">
            {mode === 'signin' ? 'New here? Use Sign Up.' : 'Already have an account? Use Sign In.'}
          </p>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">VisaHOBe PTE. LTD. © 2026</p>
      </motion.div>
    </div>
  );
}
