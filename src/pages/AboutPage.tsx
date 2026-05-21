import { motion } from "motion/react";
import { Briefcase, ShieldCheck, Target, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold uppercase tracking-widest mb-4">
          <Briefcase className="w-3.5 h-3.5" />
          About Our Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase leading-none">
          AJIRA<span className="text-blue-700">CENTRAL</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 font-medium max-w-2xl mx-auto">
          Tanzania's premier destination for verified and transparent career opportunities.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-3">Our Dedicated Purpose</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              We are passionately committed to cataloging and presenting legitimate, verified job opportunities. Every single listing database-side is thoroughly checked to safeguard candidates from deceptive recruiters or fraudulent solicitations.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-3">The Platform Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              To reliably connect aspiring job seekers directly with employers through an elegant, barrier-free interface. We eliminate complexity so you can focus entirely on submitting high-quality applications and building your future.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-slate-950/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-black uppercase tracking-wider mb-6">
            <Users className="w-3 h-3" />
            Built For Tanzanians
          </div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">
            Helping Tanzanians discover meaningful work.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Ajira Central functions purely as an informational, high-fidelity indexing platform. We scour official company portals, public listings, and validated employer channels to present a clean, centralized workspace that streamlines your job search, absolutely free of charge.
          </p>
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </motion.div>
  );
}
