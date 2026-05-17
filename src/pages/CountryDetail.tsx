import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, ShieldCheck, FileText, MapPin, Phone, Mail, CheckCircle2, Newspaper, HelpCircle, TrendingUp } from "lucide-react";
import { getCountryBySlug, COUNTRIES } from "@/data/countries";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const catColor: Record<string, string> = {
  "Tourist": "from-[#177BBB] to-[#003B73]",
  "Work": "from-[#E63946] to-[#F1573D]",
  "Work Permit": "from-[#E63946] to-[#F1573D]",
  "Residency": "from-[#F1573D] to-[#E63946]",
  "Student": "from-[#177BBB] to-[#003B73]",
  "Family": "from-[#003B73] to-[#177BBB]",
  "Investor": "from-[#F1573D] to-[#177BBB]",
};

export default function CountryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const country = slug ? getCountryBySlug(slug) : undefined;
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeVisa, setActiveVisa] = useState(0);

  if (!country) return <Navigate to="/landing" replace />;

  const related = COUNTRIES.filter((c) => c.slug !== country.slug && c.region === country.region).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#03142b] text-white overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#03142b]/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <Link to="/landing" className="flex items-center gap-2 text-sm text-white/80 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> All countries
          </Link>
          <Link to="/login">
            <Button className="h-9 px-4 text-sm bg-gradient-to-r from-[#E63946] to-[#F1573D] hover:opacity-90 border-0">Apply now <ArrowRight className="w-4 h-4" /></Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${country.heroGradient} opacity-85`} />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.25),transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row sm:items-end gap-6">
            <div className="text-7xl sm:text-8xl">{country.flag}</div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-white/80 font-semibold">{country.region}</div>
              <h1 className="font-bold text-4xl sm:text-6xl tracking-tight mt-1">{country.name}</h1>
              <p className="mt-3 text-white/90 text-base sm:text-lg max-w-2xl">{country.tagline}</p>
            </div>
          </motion.div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { l: "Capital", v: country.capital },
              { l: "Currency", v: country.currency },
              { l: "Avg processing", v: country.avgProcessing },
              { l: "Risk score", v: `${country.riskScore}/10` },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl p-4 bg-black/30 backdrop-blur-md border border-white/15">
                <div className="text-[10px] uppercase tracking-wider text-white/70">{s.l}</div>
                <div className="font-semibold mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          <section>
            <div className="text-xs uppercase tracking-widest text-[#F1573D] font-semibold">Overview</div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">About {country.name} immigration</h2>
            <p className="mt-3 text-white/70 leading-relaxed">{country.overview}</p>
          </section>

          {/* Visa Types */}
          <section>
            <div className="text-xs uppercase tracking-widest text-[#F1573D] font-semibold">Visa categories</div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">Choose your pathway</h2>

            <div className="mt-5 flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {country.visaTypes.map((v, i) => (
                <button key={v.name} onClick={() => setActiveVisa(i)} className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs border transition ${activeVisa === i ? "bg-white text-[#03142b] border-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>
                  {v.name}
                </button>
              ))}
            </div>

            {country.visaTypes[activeVisa] && (
              <motion.div key={activeVisa} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-gradient-to-r ${catColor[country.visaTypes[activeVisa].category] || "from-white/20 to-white/10"} text-white`}>{country.visaTypes[activeVisa].category}</div>
                    <h3 className="text-xl sm:text-2xl font-bold mt-2">{country.visaTypes[activeVisa].name}</h3>
                    {country.visaTypes[activeVisa].summary && <p className="text-sm text-white/60 mt-1.5 max-w-xl">{country.visaTypes[activeVisa].summary}</p>}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <TrendingUp className="w-4 h-4 text-[#F1573D]" />
                    <span className="font-semibold">{country.visaTypes[activeVisa].successRate}% success rate</span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { l: "Processing", v: country.visaTypes[activeVisa].processingDays },
                    { l: "Govt fee", v: country.visaTypes[activeVisa].govtFee },
                    { l: "Service fee", v: country.visaTypes[activeVisa].serviceFee },
                    { l: "Validity", v: country.visaTypes[activeVisa].validity },
                  ].map((s) => (
                    <div key={s.l} className="rounded-2xl p-3 bg-black/30 border border-white/10">
                      <div className="text-[10px] uppercase tracking-wider text-white/50">{s.l}</div>
                      <div className="font-semibold text-sm mt-1">{s.v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <Link to="/login" className="flex-1">
                    <Button className="w-full h-11 bg-gradient-to-r from-[#E63946] to-[#F1573D] hover:opacity-90 border-0">Start application <ArrowRight className="w-4 h-4" /></Button>
                  </Link>
                  <Button variant="outline" className="h-11 bg-white/5 border-white/15 text-white hover:bg-white/10">Download checklist (PDF)</Button>
                </div>
              </motion.div>
            )}
          </section>

          {/* Required documents */}
          <section>
            <div className="text-xs uppercase tracking-widest text-[#F1573D] font-semibold">Required documents</div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">What you'll need</h2>
            <ul className="mt-5 grid sm:grid-cols-2 gap-2">
              {country.requiredDocs.map((d) => (
                <li key={d} className="flex items-start gap-2.5 rounded-xl p-3 bg-white/[0.03] border border-white/10">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#F1573D] shrink-0" />
                  <span className="text-sm text-white/80">{d}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Steps */}
          <section>
            <div className="text-xs uppercase tracking-widest text-[#F1573D] font-semibold">How it works</div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">Your application journey</h2>
            <ol className="mt-5 space-y-3">
              {country.steps.map((s, i) => (
                <li key={s.title} className="flex gap-4 rounded-2xl p-4 bg-white/[0.03] border border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E63946] to-[#F1573D] grid place-items-center font-bold text-sm shrink-0">{i + 1}</div>
                  <div>
                    <div className="font-semibold text-sm">{s.title}</div>
                    <div className="text-xs text-white/60 mt-0.5 leading-relaxed">{s.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* FAQ */}
          {country.faqs.length > 0 && (
            <section>
              <div className="text-xs uppercase tracking-widest text-[#F1573D] font-semibold flex items-center gap-2"><HelpCircle className="w-3.5 h-3.5" /> FAQ</div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">Frequently asked</h2>
              <div className="mt-5 space-y-2">
                {country.faqs.map((f, i) => (
                  <button key={f.q} onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left rounded-2xl p-4 bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-sm">{f.q}</span>
                      <ArrowRight className={`w-4 h-4 transition shrink-0 ${openFaq === i ? "rotate-90" : ""}`} />
                    </div>
                    {openFaq === i && <p className="text-xs text-white/65 mt-2 leading-relaxed">{f.a}</p>}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* News */}
          {country.news.length > 0 && (
            <section>
              <div className="text-xs uppercase tracking-widest text-[#F1573D] font-semibold flex items-center gap-2"><Newspaper className="w-3.5 h-3.5" /> Live updates</div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">Immigration intelligence</h2>
              <div className="mt-5 space-y-2">
                {country.news.map((n) => (
                  <div key={n.title} className="rounded-2xl p-4 bg-white/[0.03] border border-white/10">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-sm">{n.title}</div>
                      <div className="text-[10px] text-white/45 shrink-0">{n.date}</div>
                    </div>
                    <p className="text-xs text-white/60 mt-1.5 leading-relaxed">{n.summary}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-20 self-start">
          {/* CTA */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-[#E63946]/90 to-[#F1573D]/90 border border-white/15">
            <div className="text-xs uppercase tracking-wider text-white/85">Ready to start?</div>
            <div className="text-xl font-bold mt-1">Apply for {country.name}</div>
            <p className="text-sm text-white/85 mt-2">Begin your application with a free eligibility check from our AI assistant.</p>
            <Link to="/login"><Button className="w-full mt-4 h-11 bg-white text-[#03142b] hover:bg-white/90 border-0 font-semibold">Get started <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>

          {/* Embassy */}
          <div className="rounded-3xl p-6 bg-white/[0.04] border border-white/10">
            <div className="text-xs uppercase tracking-wider text-[#F1573D] font-semibold flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Embassy contact</div>
            <div className="mt-3 space-y-2.5 text-sm">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-white/50" /> {country.embassy.city}</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-white/50" /> {country.embassy.phone}</div>
              <div className="flex items-center gap-2 break-all"><Mail className="w-4 h-4 text-white/50 shrink-0" /> {country.embassy.email}</div>
            </div>
          </div>

          {/* Quick facts */}
          <div className="rounded-3xl p-6 bg-white/[0.04] border border-white/10">
            <div className="text-xs uppercase tracking-wider text-[#F1573D] font-semibold flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Quick facts</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div><div className="text-white/45">Language</div><div className="font-medium text-sm">{country.language}</div></div>
              <div><div className="text-white/45">Region</div><div className="font-medium text-sm">{country.region}</div></div>
              <div><div className="text-white/45">Avg time</div><div className="font-medium text-sm">{country.avgProcessing}</div></div>
              <div><div className="text-white/45">Visa types</div><div className="font-medium text-sm">{country.visaTypes.length}</div></div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="rounded-3xl p-6 bg-white/[0.04] border border-white/10">
              <div className="text-xs uppercase tracking-wider text-[#F1573D] font-semibold">More in {country.region}</div>
              <div className="mt-3 space-y-1.5">
                {related.map((c) => (
                  <Link key={c.slug} to={`/visa/${c.slug}`} className="flex items-center justify-between rounded-xl p-2.5 hover:bg-white/5 transition">
                    <span className="flex items-center gap-2.5 text-sm"><span className="text-xl">{c.flag}</span> {c.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/50" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <footer className="py-8 border-t border-white/5 text-xs text-white/45 text-center">
        © 2026 VisaHOBe PTE. LTD. · <Link to="/landing" className="hover:text-white">All countries</Link>
      </footer>
    </div>
  );
}
