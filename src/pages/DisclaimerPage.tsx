import { motion } from "motion/react";
import { Scale, AlertTriangle, Building2, ShieldCheck } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100 text-xs font-bold uppercase tracking-widest mb-4">
          <Scale className="w-3.5 h-3.5" />
          Legal Notice & Guidelines
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase leading-none">
          Job Board<span className="text-blue-700">Disclaimer</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 font-medium max-w-2xl mx-auto">
          Please review the following legal warnings and user terms before engaging with job opportunities.
        </p>
      </div>

      {/* Critical payment warning banner */}
      <div className="bg-amber-50 rounded-3xl p-8 border border-amber-200/65 shadow-sm mb-12 flex flex-col md:flex-row gap-6 items-start">
        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-700 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-amber-900 uppercase tracking-tight mb-2">CRITICAL CANDIDATE SECURITY WARNING</h3>
          <p className="text-amber-800 text-sm leading-relaxed font-semibold">
            Under absolutely NO circumstances should you pay a recruiter, service agent, third party, or employer any fee for job applications, screening, training materials, interviews, or hiring processing. Genuine employers in Tanzania never demand payment or financial guarantees during recruitment.
          </p>
        </div>
      </div>

      <div className="space-y-8 mb-16">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
          <div className="flex gap-4 items-center mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-105">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">No Liability for External Employers</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            Ajira Central acts strictly as an informational indexing repository and search engine for third-party job listings. We possess zero authority, regulatory ownership, or operating responsibility regarding prospective employers, nor do we manage the interview or physical hiring cycles. Any engagement, communication, or legal agreement entered into exists solely between the candidate and the employer.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
          <div className="flex gap-4 items-center mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-105">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Listing Accuracy and Validation</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            While our platform makes dedicated attempts to ensure all listed roles represent legitimate, currently active opportunities, we cannot guarantee absolute or chronological accuracy. Candidates are urged to conduct independent inquiries, confirm business registrations, and exercise strict diligence prior to transferring personal documentation.
          </p>
        </div>
      </div>

      <div className="text-center text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] pt-8 border-t border-slate-200">
        Ajira Central Tanzania • Last Modified: May 20, 2026
      </div>
    </motion.div>
  );
}
