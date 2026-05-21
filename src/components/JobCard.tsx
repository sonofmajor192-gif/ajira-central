import { Link } from "react-router-dom";
import { Job } from "../types";
import { Briefcase, MapPin, Calendar, ExternalLink, ArrowRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "motion/react";

interface JobCardProps {
  job: Job;
  compact?: boolean;
}

export default function JobCard({ job, compact = false }: JobCardProps) {
  let isDeadlinePassed = false;
  if (job.deadline) {
    try {
      const parsedDate = new Date(job.deadline);
      if (!isNaN(parsedDate.getTime())) {
        isDeadlinePassed = parsedDate < new Date();
      }
    } catch (e) {
      console.error("Error evaluating deadline passed:", e);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col justify-between ${
        compact ? "p-5" : "p-8"
      }`}
    >
      <div className="flex items-start gap-5">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.company}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              <span className="font-black text-2xl text-blue-700">{job.company.charAt(0)}</span>
            )}
          </div>
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start mb-2">
            <Link to={`/jobs/${job.id}`} className="hover:text-blue-700 transition-colors">
              <h3 className={`font-black text-slate-900 leading-tight uppercase ${compact ? "text-base" : "text-xl"}`}>
                {job.title}
              </h3>
            </Link>
          </div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-600 text-sm font-bold uppercase tracking-widest">{job.company}</p>
            {job.featured && (
              <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded italic border border-amber-200">
                Featured
              </span>
            )}
          </div>
          
          {!compact && (
            <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6 line-clamp-3">
              {job.description}
            </p>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </div>
            <div className="flex items-center gap-1.5 italic text-red-500">
              <Clock className="w-3.5 h-3.5" />
              Closing {(() => {
                try {
                  return job.deadline ? format(new Date(job.deadline), "MMM dd") : "TBA";
                } catch (e) {
                  return "TBA";
                }
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-8 pt-6 border-t border-slate-100 flex items-center justify-between ${compact ? "hidden md:flex" : ""}`}>
        <Link
          to={`/jobs/${job.id}`}
          className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-700 transition-all flex items-center gap-2"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-md ${
            isDeadlinePassed
              ? "bg-slate-100 text-slate-300 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-blue-700"
          }`}
          onClick={(e) => isDeadlinePassed && e.preventDefault()}
        >
          {isDeadlinePassed ? "Expired" : "Tuma Maombi"}
        </a>
      </div>
    </motion.div>
  );
}
