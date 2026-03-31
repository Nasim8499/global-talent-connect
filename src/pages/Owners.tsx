import { motion } from 'framer-motion';
import { Building2, CreditCard, Flag, Hash, Globe, FileText, Users, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { owner, demoWorkers, demoProjects, demoAgreements } from '@/data/demo';
import SwipeableCards, { SwipeCard } from '@/components/SwipeableCards';

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

const uniqueCountries = [...new Set(demoWorkers.map(w => w.destinationCountry))];

export default function Owners() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="gradient-navy px-4 md:px-8 pt-6 pb-10">
        <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center"
          >
            <span className="text-2xl font-bold text-white">SN</span>
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">{owner.name}</h1>
            <p className="text-sm text-white/60">{owner.company}</p>
            <span className="inline-block mt-1.5 text-[10px] px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-semibold uppercase tracking-wider">Owner</span>
          </div>
        </motion.div>

        {/* Quick Stats in header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mt-5"
        >
          {[
            { icon: Users, label: 'Workers', value: demoWorkers.length },
            { icon: Globe, label: 'Countries', value: uniqueCountries.length },
            { icon: FileText, label: 'Agreements', value: demoAgreements.length },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="glass rounded-xl p-3 text-center"
            >
              <stat.icon className="w-4 h-4 text-white/60 mx-auto mb-1" />
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="px-4 md:px-8 -mt-4 space-y-4">
        {/* Info Card */}
        <motion.div {...fade} transition={{ duration: 0.5, delay: 0.1 }} className="card-elevated p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Personal Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: CreditCard, label: 'Passport', value: owner.passport },
              { icon: Flag, label: 'Nationality', value: owner.nationality },
              { icon: Hash, label: 'Internal ID', value: owner.internalId },
              { icon: Building2, label: 'Company', value: owner.company },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-start gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground break-all">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Active Projects */}
        <motion.div {...fade} transition={{ duration: 0.5, delay: 0.2 }}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active Projects</h3>
          <SwipeableCards>
            {demoProjects.filter(p => p.status !== 'completed').map((p) => {
              const progress = p.targetWorkers > 0 ? (p.workerCount / p.targetWorkers) * 100 : 0;
              return (
                <SwipeCard key={p.id} minWidth="220px">
                  <div className="card-elevated p-4 h-full">
                    <p className="text-xs font-bold text-foreground mb-1">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground mb-2">{p.employer}</p>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="h-full rounded-full gradient-blue"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{p.workerCount}/{p.targetWorkers} workers</p>
                  </div>
                </SwipeCard>
              );
            })}
          </SwipeableCards>
        </motion.div>

        {/* Country Operations */}
        <motion.div {...fade} transition={{ duration: 0.5, delay: 0.3 }} className="card-elevated p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Country Operations</h3>
          <div className="space-y-3">
            {uniqueCountries.map((country, i) => {
              const count = demoWorkers.filter(w => w.destinationCountry === country).length;
              return (
                <motion.div
                  key={country}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-lg">{country === 'Singapore' ? '🇸🇬' : country === 'Malaysia' ? '🇲🇾' : '🇶🇦'}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{country}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground tabular-nums">{count} workers</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
