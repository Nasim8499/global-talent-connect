import { motion } from 'framer-motion';

/**
 * Animated digital/tech illustration for the login screen.
 * Pure SVG + framer-motion: glowing grid, orbiting nodes, particle stream.
 */
export default function DigitalBackdrop() {
  const nodes = Array.from({ length: 6 });
  const particles = Array.from({ length: 18 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Soft color blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-blue/15 rounded-full blur-[110px]" />
      <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-brand-gold/15 rounded-full blur-[90px]" />

      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="hsl(var(--brand-gold))" strokeWidth="0.4" />
          </pattern>
          <radialGradient id="fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="gridMask">
            <rect width="100%" height="100%" fill="url(#fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)" />
      </svg>

      {/* Orbital ring with rotating nodes */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="relative w-[520px] h-[520px] sm:w-[680px] sm:h-[680px]"
        >
          <div className="absolute inset-0 rounded-full border border-brand-gold/15" />
          <div className="absolute inset-8 rounded-full border border-brand-blue/15" />
          {nodes.map((_, i) => {
            const angle = (i / nodes.length) * Math.PI * 2;
            const r = 260;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            return (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 w-2.5 h-2.5 rounded-full bg-brand-gold shadow-[0_0_18px_hsl(var(--brand-gold))]"
                style={{ x, y }}
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
              />
            );
          })}
        </motion.div>
      </div>

      {/* Reverse inner ring */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="relative w-[320px] h-[320px]"
        >
          <div className="absolute inset-0 rounded-full border border-dashed border-white/10" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />
        </motion.div>
      </div>

      {/* Particle stream */}
      {particles.map((_, i) => {
        const left = (i * 53) % 100;
        const delay = (i % 6) * 0.7;
        const duration = 6 + (i % 5);
        return (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-brand-gold/70"
            style={{ left: `${left}%`, top: '110%' }}
            animate={{ y: ['0%', '-120vh'], opacity: [0, 1, 0] }}
            transition={{ duration, repeat: Infinity, delay, ease: 'linear' }}
          />
        );
      })}

      {/* Scan line */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent"
        initial={{ top: '0%' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
