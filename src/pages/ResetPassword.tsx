import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Globe, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DigitalBackdrop from '@/components/DigitalBackdrop';

const schema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be under 72 characters')
    .regex(/[A-Za-z]/, 'Password must include a letter')
    .regex(/[0-9]/, 'Password must include a number'),
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase parses recovery tokens from URL hash automatically.
    const { data: sub } = supabase.auth.onAuthStateChange((evt) => {
      if (evt === 'PASSWORD_RECOVERY' || evt === 'SIGNED_IN') setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const r = schema.safeParse({ password });
    if (!r.success) return setError(r.error.issues[0].message);
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      toast.error(error.message);
      return;
    }
    toast.success('Password updated');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-navy px-4 overflow-hidden relative">
      <DigitalBackdrop />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-gold shadow-glow mb-4">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reset Password</h1>
          <p className="text-white/40 text-sm mt-1">Choose a new password for your account</p>
        </div>
        <div className="bg-card rounded-3xl p-6 shadow-2xl">
          {!ready ? (
            <p className="text-sm text-muted-foreground text-center py-6" role="status" aria-live="polite">
              Verifying reset link…
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              <div>
                <label htmlFor="new-password" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">New Password</label>
                <div className="relative mt-1">
                  <Input id="new-password" type={show ? 'text' : 'password'} autoComplete="new-password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl bg-muted/50 border-0 pr-12 focus-visible:ring-2 focus-visible:ring-brand-blue" />
                  <button type="button" onClick={() => setShow(!show)} aria-label="Toggle password"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Confirm Password</label>
                <Input id="confirm-password" type={show ? 'text' : 'password'} autoComplete="new-password"
                  value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  className="mt-1 h-11 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-brand-blue" />
              </div>
              <div role="alert" aria-live="assertive" className="min-h-[1.25rem]">
                {error && (
                  <div className="flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/30 p-2.5">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-[12px] text-destructive leading-snug">{error}</p>
                  </div>
                )}
              </div>
              <Button type="submit" disabled={loading}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-navy-light font-semibold text-sm active:scale-[0.97]">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
