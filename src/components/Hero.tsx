import SearchBar from "./SearchBar";
import { motion } from "motion/react";
import { Briefcase, TrendingUp, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden bg-blue-900 text-white">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1.5 px-4 mb-8 rounded-full bg-blue-500/20 text-blue-200 text-[10px] font-black uppercase tracking-[0.3em] border border-blue-400/30">
            Official Employment Portal
          </span>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-[0.9]">
            Pata Kazi <br /> <span className="text-blue-400 italic">Yako Leo</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-14 font-light italic uppercase tracking-wider">
            Connecting Tanzanian talent with top official opportunities across the nation.
          </p>

          <SearchBar />

          <div className="mt-20 flex flex-wrap justify-center gap-10 md:gap-20">
            <div className="flex flex-col items-center">
              <p className="text-5xl font-black text-white mb-2">12K+</p>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Jobs</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-5xl font-black text-white mb-2">85K+</p>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Talent Pool</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-5xl font-black text-white mb-2">2.5K+</p>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">New Weekly</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
