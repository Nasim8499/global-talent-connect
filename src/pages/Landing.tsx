import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Globe2, Clock, Star, ChevronRight, Plane, FileCheck2, Brain, Headphones } from "lucide-react";
import { COUNTRIES } from "@/data/countries";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

const regions = ["All", "Southeast Asia", "Middle East", "Europe", "Europe (EU)", "North America", "Oceania", "East Asia"];

export default function Landing() {
  const [region, setRegion] = useState("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return COUNTRIES.filter((c) => (region === "All" || c.region === region) && (q === "" || c.name.toLowerCase().includes(q.toLowerCase())));
  }, [region, q]);

  const popular = COUNTRIES.filter((c) => c.popular);

  return (
    <div className="min-h-screen bg-[#03142b] text-white overflow-x-hidden">
      {/* ───── Top Nav ───── */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#03142b]/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <Link to="/landing" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E63946] to-[#F1573D] grid place-items-center font-bold text-white shadow-lg shadow-[#E63946]/30">V</div>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">VisaHOBe</div>
              <div className="text-[10px] text-white/50 -mt-0.5">Global Visa OS</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
            <a href="#countries" className="hover:text-white transition">Countries</a>
            <a href="#features" className="hover:text-white transition">Platform</a>
            <a href="#how" className="hover:text-white transition">How it works</a>
            <a href="#news" className="hover:text-white transition">News</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white h-9 px-3 text-sm">Sign in</Button>
            </Link>
            <Link to="/login">
              <Button className="h-9 px-4 text-sm bg-gradient-to-r from-[#E63946] to-[#F1573D] hover:opacity-90 border-0 shadow-lg shadow-[#E63946]/30">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ───── Hero ───── */}
      <section className="relative pt-16 sm:pt-24 pb-20">
        <div className="absolute inset-0 -z-10 opacity-60" style={{ background: "radial-gradient(1000px 500px at 15% 10%, rgba(230,57,70,0.25), transparent 60%), radial-gradient(900px 500px at 110% 0%, rgba(23,123,187,0.35), transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#F1573D]" />
              AI-powered visa & recruitment operating system
            </div>
            <h1 className="font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05]">
              The fastest way to <span className="bg-gradient-to-r from-[#E63946] via-[#F1573D] to-[#177BBB] bg-clip-text text-transparent">move people</span> across borders.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
              VisaHOBe is the global immigration & recruitment OS for manpower agencies, employers and workers. From OCR to IPA to landing — automated end-to-end.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link to="/login">
                <Button className="h-12 px-6 text-sm bg-gradient-to-r from-[#E63946] to-[#F1573D] hover:opacity-90 border-0 shadow-xl shadow-[#E63946]/30 w-full sm:w-auto">
                  Open dashboard <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#countries">
                <Button variant="outline" className="h-12 px-6 text-sm bg-white/5 border-white/15 hover:bg-white/10 text-white w-full sm:w-auto">
                  Explore 17 countries
                </Button>
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-white/50">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#F1573D]" /> MOM / BMET / RA licensed partners</div>
              <div className="flex items-center gap-2"><Globe2 className="w-4 h-4 text-[#177BBB]" /> 17 countries · 60+ visa categories</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#E63946]" /> Average IPA in 14 days</div>
            </div>
          </motion.div>

          {/* Floating stat cards */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { k: "94%", l: "Visa success rate", grad: "from-[#E63946] to-[#F1573D]" },
              { k: "12,400+", l: "Workers deployed", grad: "from-[#177BBB] to-[#003B73]" },
              { k: "850+", l: "Verified employers", grad: "from-[#F1573D] to-[#E63946]" },
              { k: "14 days", l: "Avg processing", grad: "from-[#003B73] to-[#177BBB]" },
            ].map((s, i) => (
              <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.5 }} className="rounded-2xl p-4 sm:p-5 bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${s.grad} bg-clip-text text-transparent`}>{s.k}</div>
                <div className="text-[11px] sm:text-xs text-white/60 mt-1">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Popular Destinations ───── */}
      <section id="countries" className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#F1573D] font-semibold">Destinations</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">Trending visa pathways</h2>
            </div>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search country…" className="h-10 px-4 rounded-full bg-white/5 border border-white/10 text-sm outline-none focus:border-white/30 placeholder:text-white/40 w-full sm:w-64" />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {regions.map((r) => (
              <button key={r} onClick={() => setRegion(r)} className={`px-3.5 py-1.5 rounded-full text-xs border transition ${region === r ? "bg-white text-[#03142b] border-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>
                {r}
              </button>
            ))}
          </div>

          {/* Popular hero strip */}
          {region === "All" && q === "" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {popular.slice(0, 3).map((c) => (
                <Link key={c.slug} to={`/visa/${c.slug}`} className="group relative overflow-hidden rounded-3xl border border-white/10 p-6 min-h-[200px] flex flex-col justify-between">
                  <div className={`absolute inset-0 bg-gradient-to-br ${c.heroGradient} opacity-80 group-hover:opacity-100 transition`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                  <div className="relative">
                    <div className="text-5xl">{c.flag}</div>
                    <div className="mt-3 text-xl font-semibold">{c.name}</div>
                    <div className="text-xs text-white/80 mt-1">{c.tagline}</div>
                  </div>
                  <div className="relative flex items-center justify-between text-xs text-white/90 mt-4">
                    <span className="px-2.5 py-1 rounded-full bg-black/30 backdrop-blur">⚡ {c.avgProcessing}</span>
                    <span className="inline-flex items-center gap-1 font-medium">Explore <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Country grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((c) => (
              <Link key={c.slug} to={`/visa/${c.slug}`} className="group rounded-2xl p-4 bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition">
                <div className="flex items-start justify-between">
                  <div className="text-3xl">{c.flag}</div>
                  <div className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">{c.region}</div>
                </div>
                <div className="mt-3 font-semibold">{c.name}</div>
                <div className="text-[11px] text-white/50 mt-0.5 line-clamp-1">{c.tagline}</div>
                <div className="mt-3 flex items-center justify-between text-[10px] text-white/60">
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{c.avgProcessing}</span>
                  <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-[#F1573D]" />{c.riskScore}/10</span>
                </div>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12 text-white/50 text-sm">No countries match your search.</div>
            )}
          </div>
        </div>
      </section>

      {/* ───── Platform Features ───── */}
      <section id="features" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-[#F1573D] font-semibold">Platform</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">One operating system. Every step of the journey.</h2>
            <p className="mt-3 text-white/60 text-sm sm:text-base">From the first OCR scan of a passport to the final BRP collection — VisaHOBe replaces 12 disconnected tools with a single AI-powered platform.</p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Brain, t: "AI Visa Assistant", d: "Eligibility checks, document review and chat — multilingual." },
              { icon: FileCheck2, t: "Smart OCR Engine", d: "MRZ, NID, certificates — extracted, validated, auto-filed." },
              { icon: Plane, t: "Real-time Tracking", d: "Live IPA, embassy and arrival status with smart alerts." },
              { icon: Globe2, t: "Global Country Hub", d: "17 destinations, 60+ visa types, embassy intelligence." },
              { icon: ShieldCheck, t: "QR Verification", d: "Tamper-proof digital worker cards & employer badges." },
              { icon: Clock, t: "Workflow Automation", d: "Auto-WhatsApp, reminders, invoices and renewals." },
              { icon: Sparkles, t: "AI Document Generator", d: "Contracts, support letters, invoices — branded PDFs." },
              { icon: Headphones, t: "24/7 Communication", d: "WhatsApp, email, in-app and AI auto-replies." },
            ].map((f) => (
              <div key={f.t} className="rounded-2xl p-5 bg-white/[0.04] border border-white/10 hover:bg-white/[0.07] transition">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E63946] to-[#F1573D] grid place-items-center mb-3 shadow-lg shadow-[#E63946]/20">
                  <f.icon className="w-5 h-5" />
                </div>
                <div className="font-semibold text-sm">{f.t}</div>
                <div className="text-xs text-white/55 mt-1 leading-relaxed">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How it works ───── */}
      <section id="how" className="py-20 border-t border-white/5 bg-[#021022]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-xs uppercase tracking-widest text-[#F1573D] font-semibold">How it works</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-1">From profile to passport stamp in five moves.</h2>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { n: "01", t: "Upload passport", d: "Our OCR reads MRZ, photo & details in 3s." },
              { n: "02", t: "AI matches role", d: "Skills, country preference, salary — instantly matched." },
              { n: "03", t: "Employer issues offer", d: "IPA / CoS / Nulla Osta generated within the platform." },
              { n: "04", t: "Embassy & visa", d: "Real-time tracking through interview & stamping." },
              { n: "05", t: "Fly & onboard", d: "Pre-departure briefing, ticket and arrival support." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl p-5 bg-white/[0.04] border border-white/10">
                <div className="text-3xl font-bold bg-gradient-to-r from-[#E63946] to-[#F1573D] bg-clip-text text-transparent">{s.n}</div>
                <div className="mt-2 font-semibold text-sm">{s.t}</div>
                <div className="text-xs text-white/55 mt-1 leading-relaxed">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-white/10 text-center">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#E63946] via-[#F1573D] to-[#177BBB] opacity-90" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">Ready to scale your visa operation?</h3>
            <p className="mt-3 text-white/85 max-w-xl mx-auto text-sm sm:text-base">Onboard your agency, employers and workers on the only platform built for global manpower at scale.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login">
                <Button className="h-12 px-7 bg-white text-[#03142b] hover:bg-white/90 border-0 font-semibold w-full sm:w-auto">Open dashboard <ArrowRight className="w-4 h-4" /></Button>
              </Link>
              <a href="#countries">
                <Button variant="outline" className="h-12 px-7 bg-transparent border-white/40 text-white hover:bg-white/10 w-full sm:w-auto">Browse countries</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="py-10 border-t border-white/5 text-xs text-white/45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© 2026 VisaHOBe PTE. LTD. · Global Visa & Recruitment OS</div>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-white">Dashboard</Link>
            <a href="#countries" className="hover:text-white">Countries</a>
            <a href="#features" className="hover:text-white">Platform</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
