import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Loader2, AlertCircle, ShieldCheck, Fingerprint, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, roleHomePath } from '@/contexts/AuthContext';
import DigitalBackdrop from '@/components/DigitalBackdrop';
import { toast } from 'sonner';

const VALID_PASSPORT = '666085';
const SLOTS = VALID_PASSPORT.length; // 6

export default function Login() {
  const navigate = useNavigate();
  const { enterDemo } = useAuth();
  const [digits, setDigits] = useState<string[]>(Array(SLOTS).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [scanning, setScanning] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  const passport = digits.join('');
  const filled = passport.length === SLOTS;

  const setDigit = (i: number, v: string) => {
    const clean = v.replace(/\D/g, '').slice(-1);
    setError('');
    setDigits((prev) => {
      const next = [...prev];
      next[i] = clean;
      return next;
    });
    if (clean && i < SLOTS - 1) inputs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
      setDigits((prev) => { const n = [...prev]; n[i - 1] = ''; return n; });
    } else if (e.key === 'ArrowLeft' && i > 0) inputs.current[i - 1]?.focus();
    else if (e.key === 'ArrowRight' && i < SLOTS - 1) inputs.current[i + 1]?.focus();
    else if (e.key === 'Enter' && filled) handleVerify();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, SLOTS);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(SLOTS).fill('');
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    inputs.current[Math.min(pasted.length, SLOTS - 1)]?.focus();
  };

  const handleVerify = async () => {
    if (!filled || loading) return;
    setLoading(true);
    setScanning(true);
    setError('');
    // simulated biometric scan
    await new Promise((r) => setTimeout(r, 1100));
    if (passport !== VALID_PASSPORT) {
      setLoading(false);
      setScanning(false);
      setError('Passport not recognized. Use demo passport 666085.');
      toast.error('Invalid passport');
      // shake + clear
      setDigits(Array(SLOTS).fill(''));
      inputs.current[0]?.focus();
      return;
    }
    enterDemo(passport);
    toast.success('Identity verified');
    setTimeout(() => navigate(roleHomePath('owner'), { replace: true }), 250);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-navy px-4 overflow-hidden relative">
      <DigitalBackdrop />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-gold shadow-glow mb-4"
          >
            <Globe className="w-8 h-8 text-primary" aria-hidden="true" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white tracking-tight">VisaMOTion</h1>
          <p className="text-white/50 text-sm mt-1">Recruitment System · Passport Entry</p>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          {/* Animated scan line over the card while verifying */}
          <AnimatePresence>
            {scanning && (
              <motion.div
                initial={{ top: '-2%', opacity: 0 }}
                animate={{ top: '102%', opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: 'linear' }}
                className="pointer-events-none absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent shadow-[0_0_18px_hsl(var(--brand-gold))]"
              />
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2 mb-4">
            <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-brand-blue/10 text-brand-blue">
              <Fingerprint className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <h2 className="text-sm font-semibold text-foreground">Scan passport</h2>
              <p className="text-[11px] text-muted-foreground">Enter the 6-digit demo passport</p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3" /> Secured
            </span>
          </div>

          <motion.div
            key={error || 'idle'}
            animate={error ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between gap-2"
            role="group"
            aria-labelledby="passport-label"
            aria-describedby="passport-status"
          >
            <span id="passport-label" className="sr-only">Enter 6-digit demo passport number</span>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => handleKey(i, e)}
                onPaste={handlePaste}
                tabIndex={0}
                autoComplete="one-time-code"
                aria-label={`Passport digit ${i + 1} of ${SLOTS}`}
                aria-invalid={!!error}
                aria-describedby="passport-status"
                className={`w-11 h-14 text-center text-xl font-bold rounded-xl bg-muted/40 border-2 transition-all
                  focus:outline-none focus:bg-card focus:border-brand-gold focus:shadow-[0_0_0_4px_hsl(var(--brand-gold)/0.18)]
                  ${error ? 'border-destructive/60 text-destructive' : d ? 'border-brand-blue/60 text-foreground' : 'border-transparent text-foreground'}`}
              />
            ))}
          </motion.div>

          {/* Live status / error feedback */}
          <div id="passport-status" className="min-h-[1.25rem] mt-3">
            {error ? (
              <div role="alert" aria-live="assertive" className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-2.5 py-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[11px] text-destructive leading-snug">{error}</p>
              </div>
            ) : (
              <p role="status" aria-live="polite" className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <ScanLine className="w-3 h-3" aria-hidden="true" /> Demo passport: <span className="font-mono font-semibold text-foreground">666085</span>
              </p>
            )}
          </div>

          <Button
            type="button"
            onClick={handleVerify}
            disabled={!filled || loading}
            className="w-full mt-5 h-11 rounded-xl bg-primary text-primary-foreground hover:bg-navy-light font-semibold text-sm active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
            ) : (
              <>Enter system</>
            )}
          </Button>

          <p className="text-[10px] text-muted-foreground text-center mt-3">
            By entering you acknowledge this is a secured demo environment.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
