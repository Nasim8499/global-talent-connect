import { motion } from 'framer-motion';
import { Building2, CreditCard, Flag, Hash, Globe, FileText, Users } from 'lucide-react';
import { owner } from '@/data/demo';

const fade = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function Owners() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="gradient-navy px-4 md:px-8 pt-6 pb-10">
        <motion.div {...fade} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">SN</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{owner.name}</h1>
            <p className="text-sm text-white/60">{owner.company}</p>
            <span className="inline-block mt-1.5 text-[10px] px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold font-semibold uppercase tracking-wider">Owner</span>
          </div>
        </motion.div>
      </div>

      <div className="px-4 md:px-8 -mt-4 space-y-4">
        {/* Info Card */}
        <motion.div {...fade} transition={{ duration: 0.5, delay: 0.1 }} className="card-elevated p-5">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Personal Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Passport, label: 'Passport', value: owner.passport },
              { icon: Flag, label: 'Nationality', value: owner.nationality },
              { icon: Hash, label: 'Internal ID', value: owner.internalId },
              { icon: Building2, label: 'Company', value: owner.company },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground break-all">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div {...fade} transition={{ duration: 0.5, delay: 0.2 }} className="grid grid-cols-3 gap-3">
          {[
            { icon: Users, label: 'Workers', value: '8' },
            { icon: Globe, label: 'Countries', value: '3' },
            { icon: FileText, label: 'Agreements', value: '5' },
          ].map((stat) => (
            <div key={stat.label} className="card-elevated p-4 text-center">
              <stat.icon className="w-5 h-5 text-brand-blue mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
