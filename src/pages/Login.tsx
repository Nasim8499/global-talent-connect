import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Globe, Loader2, AlertCircle, ArrowLeft, CheckCircle2, MailCheck, RefreshCw } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth, roleHomePath } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DigitalBackdrop from '@/components/DigitalBackdrop';

type Mode = 'signin' | 'signup' | 'forgot';

const emailField = z.string().trim().toLowerCase()
  .min(1, 'Email is required')
  .email('Enter a valid email address')
  .max(255, 'Email must be under 255 characters');

const passwordField = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be under 72 characters')
  .regex(/[A-Za-z]/, 'Password must include a letter')
  .regex(/[0-9]/, 'Password must include a number');

const signinSchema = z.object({ email: emailField, password: passwordField });
const signupSchema = z.object({
  email: emailField, password: passwordField,
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80, 'Name must be under 80 characters'),
});
const forgotSchema = z.object({ email: emailField });

type FieldErrors = { email?: string; password?: string; name?: string; form?: string };

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean; name?: boolean }>({});
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [forgotSent, setForgotSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  const maskEmail = (addr: string) => {
    const [user, domain] = addr.split('@');
    if (!user || !domain) return addr;
    const u = user.length <= 2 ? user[0] + '•' : user[0] + '•'.repeat(Math.min(user.length - 2, 6)) + user[user.length - 1];
    const [dName, ...rest] = domain.split('.');
    const d = dName.length <= 2 ? dName[0] + '•' : dName[0] + '•'.repeat(Math.min(dName.length - 2, 4)) + dName[dName.length - 1];
    return `${u}@${d}${rest.length ? '.' + rest.join('.') : ''}`;
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resendLoading || !sentToEmail) return;
    setResendLoading(true);
    setStatusMsg('Resending reset link…');
    const { error } = await supabase.auth.resetPasswordForEmail(sentToEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResendLoading(false);
    if (error) {
      setErrors({ form: error.message });
      setStatusMsg(`Could not resend: ${error.message}`);
      toast.error(error.message);
      return;
    }
    setResendCooldown(45);
    setStatusMsg(`Reset link resent to ${maskEmail(sentToEmail)}.`);
    toast.success('Reset link resent');
  };

  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);

  // Restore remembered email
  useEffect(() => {
    const saved = localStorage.getItem('visahobe.rememberedEmail');
    if (saved) { setEmail(saved); setRememberMe(true); }
  }, []);

  // Focus first relevant field when mode changes
  useEffect(() => {
    setStatusMsg('');
    setForgotSent(false);
    setSentToEmail('');
    setResendCooldown(0);
    const t = setTimeout(() => firstFieldRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [mode]);

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

  const schemaFor = (m: Mode) => m === 'signup' ? signupSchema : m === 'forgot' ? forgotSchema : signinSchema;

  const validate = (): FieldErrors => {
    const payload: Record<string, string> = { email };
    if (mode !== 'forgot') payload.password = password;
    if (mode === 'signup') payload.name = name;
    const result = schemaFor(mode).safeParse(payload);
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

  const focusFirstError = (errs: FieldErrors) => {
    const order: Array<keyof FieldErrors> = ['name', 'email', 'password'];
    for (const k of order) {
      if (errs[k]) {
        const el = document.getElementById(k as string) as HTMLInputElement | null;
        el?.focus();
        return;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setTouched({ email: true, password: mode !== 'forgot', name: mode === 'signup' });
    if (Object.keys(next).length) {
      setErrors(next);
      setStatusMsg(`Form has ${Object.keys(next).length} error${Object.keys(next).length > 1 ? 's' : ''}. Please review.`);
      focusFirstError(next);
      return;
    }
    setErrors({});
    setStatusMsg('');
    setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email.trim().toLowerCase(), password, rememberMe);
        if (error) {
          const msg = /invalid|credentials/i.test(error) ? 'Incorrect email or password.' : error;
          setErrors({ form: msg });
          toast.error(msg);
          return;
        }
        if (rememberMe) localStorage.setItem('visahobe.rememberedEmail', email.trim().toLowerCase());
        else localStorage.removeItem('visahobe.rememberedEmail');
        setStatusMsg('Signed in successfully. Redirecting…');
        toast.success('Welcome back');
        await fetchRoleAndRedirect();
      } else if (mode === 'signup') {
        const { error } = await signUp(email.trim().toLowerCase(), password, name.trim());
        if (error) {
          const msg = /registered|exists/i.test(error) ? 'An account with this email already exists.' : error;
          setErrors({ form: msg });
          toast.error(msg);
          return;
        }
        setStatusMsg('Account created. Check your email to confirm.');
        toast.success('Account created — check your email to confirm.');
        switchMode('signin');
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          setErrors({ form: error.message });
          toast.error(error.message);
          return;
        }
        const target = email.trim().toLowerCase();
        setSentToEmail(target);
        setForgotSent(true);
        setResendCooldown(45);
        setStatusMsg(`Password reset email sent to ${maskEmail(target)}. Check your inbox.`);
        toast.success('Reset email sent');
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

  const title = mode === 'forgot' ? 'Forgot Password' : 'VisaHOBe';
  const subtitle = mode === 'forgot' ? 'Enter your email to receive a reset link' : 'VisaMOTion Recruitment System';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-navy px-4 overflow-hidden relative">
      <DigitalBackdrop />

      {/* Skip link for keyboard users */}
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        Skip to form
      </a>

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
            <Globe className="w-8 h-8 text-primary" aria-hidden="true" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-white/40 text-sm mt-1">{subtitle}</p>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-2xl">
          {/* Tabs (hidden in forgot mode) */}
          {mode !== 'forgot' && (
            <div role="tablist" aria-label="Authentication mode" className="relative grid grid-cols-2 mb-5 bg-muted/40 rounded-xl p-1">
              {(['signin','signup'] as const).map(m => (
                <button
                  key={m}
                  role="tab"
                  type="button"
                  aria-selected={mode === m}
                  tabIndex={mode === m ? 0 : -1}
                  onClick={() => switchMode(m)}
                  className="relative z-10 py-2 text-xs font-semibold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg"
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
          )}

          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </button>
          )}

          {/* Polite live region for status announcements */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">{statusMsg}</div>

          {mode === 'forgot' && forgotSent ? (
            <div className="space-y-4" aria-labelledby="forgot-confirm-title">
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-3"
                >
                  <MailCheck className="w-7 h-7 text-emerald-500" aria-hidden="true" />
                </motion.div>
                <h2 id="forgot-confirm-title" className="text-lg font-semibold text-foreground">Check your inbox</h2>
                <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
                  If an account exists for this address, we sent a password reset link to:
                </p>
                <p className="mt-2 px-3 py-2 rounded-lg bg-muted/60 text-[13px] font-medium text-foreground break-all max-w-full">
                  {maskEmail(sentToEmail)}
                </p>
                <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                  The link expires in 60 minutes. Check your spam folder if you don't see it.
                </p>
              </div>

              <div role="alert" aria-live="assertive" className="min-h-[1rem]">
                {errors.form && (
                  <div className="flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/30 p-2.5">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-[12px] text-destructive leading-snug">{errors.form}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || resendLoading}
                  aria-describedby="resend-help"
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-navy-light font-semibold text-sm active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
                >
                  {resendLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  ) : resendCooldown > 0 ? (
                    <>Resend in {resendCooldown}s</>
                  ) : (
                    <><RefreshCw className="w-4 h-4" aria-hidden="true" /> Resend reset link</>
                  )}
                </Button>
                <p id="resend-help" className="text-[10px] text-muted-foreground text-center">
                  {resendCooldown > 0
                    ? `You can request another link in ${resendCooldown} second${resendCooldown === 1 ? '' : 's'}.`
                    : 'Didn\u2019t get the email? Tap resend.'}
                </p>
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-[12px] text-brand-blue hover:underline mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded"
                >
                  Return to sign in
                </button>
              </div>
            </div>
          ) : (

          <form id="login-form" onSubmit={handleSubmit} noValidate className="space-y-3.5"
            aria-busy={loading} aria-describedby={errors.form ? 'form-error' : undefined}>
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                >
                  <label htmlFor="name" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Name</label>
                  <Input
                    id="name"
                    ref={mode === 'signup' ? firstFieldRef : undefined}
                    autoComplete="name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (touched.name) validateField('name'); }}
                    onBlur={() => { setTouched((t) => ({ ...t, name: true })); validateField('name'); }}
                    aria-invalid={!!errors.name}
                    aria-required="true"
                    aria-describedby={errors.name ? 'name-err' : undefined}
                    className={`mt-1 h-11 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 ${errors.name ? 'ring-2 ring-destructive focus-visible:ring-destructive' : 'focus-visible:ring-brand-blue'}`}
                  />
                  <p id="name-err" role="alert" aria-live="assertive" className="min-h-[1rem] mt-1 text-[11px] text-destructive flex items-center gap-1">
                    {errors.name && (<><AlertCircle className="w-3 h-3" aria-hidden="true" /> {errors.name}</>)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label htmlFor="email" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Email</label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                ref={mode !== 'signup' ? firstFieldRef : undefined}
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (touched.email) validateField('email'); }}
                onBlur={() => { setTouched((t) => ({ ...t, email: true })); validateField('email'); }}
                aria-invalid={!!errors.email}
                aria-required="true"
                aria-describedby={errors.email ? 'email-err' : undefined}
                className={`mt-1 h-11 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 ${errors.email ? 'ring-2 ring-destructive focus-visible:ring-destructive' : 'focus-visible:ring-brand-blue'}`}
              />
              <p id="email-err" role="alert" aria-live="assertive" className="min-h-[1rem] mt-1 text-[11px] text-destructive flex items-center gap-1">
                {errors.email && (<><AlertCircle className="w-3 h-3" aria-hidden="true" /> {errors.email}</>)}
              </p>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Password</label>
                  {mode === 'signin' && (
                    <button type="button" onClick={() => switchMode('forgot')}
                      className="text-[10px] font-medium text-brand-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (touched.password) validateField('password'); }}
                    onBlur={() => { setTouched((t) => ({ ...t, password: true })); validateField('password'); }}
                    aria-invalid={!!errors.password}
                    aria-required="true"
                    aria-describedby={errors.password ? 'password-err' : 'password-help'}
                    className={`h-11 rounded-xl bg-muted/50 border-0 pr-12 focus-visible:ring-2 ${errors.password ? 'ring-2 ring-destructive focus-visible:ring-destructive' : 'focus-visible:ring-brand-blue'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p id="password-err" role="alert" aria-live="assertive" className="min-h-[1rem] mt-1 text-[11px] text-destructive flex items-center gap-1">
                  {errors.password && (<><AlertCircle className="w-3 h-3" aria-hidden="true" /> {errors.password}</>)}
                </p>
                {!errors.password && mode === 'signup' && password.length > 0 && (
                  <div id="password-help" className="mt-1">
                    <div className="flex gap-1" aria-hidden="true">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < passwordScore ? strengthColor : 'bg-muted'}`} />
                      ))}
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Strength: <span className="text-foreground font-medium">{strengthLabel}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(v) => setRememberMe(v === true)}
                  className="focus-visible:ring-brand-blue"
                />
                <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer select-none">
                  Remember me on this device
                </label>
              </div>
            )}

            {errors.form && (
              <div id="form-error" role="alert" aria-live="assertive"
                className="flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/30 p-2.5">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[12px] text-destructive leading-snug">{errors.form}</p>
              </div>
            )}

            {mode === 'forgot' && forgotSent && (
              <div role="status" aria-live="polite"
                className="flex items-start gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[12px] text-emerald-700 dark:text-emerald-400 leading-snug">
                  If an account exists for <strong>{email}</strong>, a reset link is on its way.
                </p>
              </div>
            )}

            <Button
              ref={submitRef}
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-navy-light font-semibold text-sm transition-all duration-200 active:scale-[0.97] mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
            >
              {loading
                ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                : (mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link')}
              <span className="sr-only">{loading ? 'Submitting' : ''}</span>
            </Button>
          </form>

          {mode !== 'forgot' && (
            <p className="text-center text-[11px] text-muted-foreground mt-4">
              {mode === 'signin' ? 'New here? Use Sign Up.' : 'Already have an account? Use Sign In.'}
            </p>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6">VisaHOBe PTE. LTD. © 2026</p>
      </motion.div>
    </div>
  );
}
