import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Job } from "../types";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  ChevronLeft, 
  Clock, 
  Building2, 
  Globe, 
  Share2,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

// Safe error boundary for markdown / children rendering
class RenderErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackText: string },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("RenderErrorBoundary caught a crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="whitespace-pre-line text-slate-600 font-medium text-sm leading-relaxed">
          {this.props.fallbackText}
        </div>
      );
    }
    return this.props.children;
  }
}

// Helper to safely format Firestore timestamp or other date values
const parseAndFormatDate = (dateVal: any, formatStr: string = "MMM dd, yyyy") => {
  if (!dateVal) return format(new Date(), formatStr);
  
  // If it's a Firestore Timestamp (has toDate method or seconds property)
  if (typeof dateVal === "object") {
    if (typeof dateVal.toDate === "function") {
      try {
        return format(dateVal.toDate(), formatStr);
      } catch (e) {
        console.error("Error formatting toDate()", e);
      }
    }
    if (typeof dateVal.seconds === "number") {
      try {
        return format(new Date(dateVal.seconds * 1000), formatStr);
      } catch (e) {
        console.error("Error formatting seconds timestamp", e);
      }
    }
  }
  
  try {
    const parsed = new Date(dateVal);
    if (!isNaN(parsed.getTime())) {
      return format(parsed, formatStr);
    }
  } catch (e) {
    console.error("Error parsing date in parseAndFormatDate:", e);
  }
  
  return format(new Date(), formatStr);
};

export default function JobPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setJob(null);
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "jobs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() } as Job);
        } else {
          setJob(null);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-3xl"></div>
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-4">
              <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-4">Job Not Found</h2>
        <p className="text-gray-500 mb-8">The job listing you are looking for may have been removed or expired.</p>
        <Link to="/jobs" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl">
          Back to Careers
        </Link>
      </div>
    );
  }

  let isDeadlinePassed = false;
  if (job && job.deadline) {
    try {
      isDeadlinePassed = new Date(job.deadline) < new Date();
    } catch (e) {
      console.error("Error setting isDeadlinePassed:", e);
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header / Banner */}
      <div className="bg-white border-b border-slate-200 pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/jobs" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-700 font-black text-[10px] uppercase tracking-widest mb-12 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to All Opportunities
          </Link>

          <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-blue-700 flex-shrink-0 border border-slate-100 shadow-sm">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company || "Employer"} className="w-full h-full object-cover rounded-3xl" />
                ) : (
                  <span className="font-black text-4xl uppercase">{(job.company || "C").charAt(0)}</span>
                )}
              </div>
              <div>
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-2">{job.category}</h3>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase leading-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap gap-y-4 gap-x-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Building2 className="w-4 h-4" />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 italic text-slate-400 font-bold">
                    <Clock className="w-4 h-4" />
                    Posted {parseAndFormatDate(job.createdAt, "MMM dd, yyyy")}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-3 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95 ${
                  isDeadlinePassed
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
                }`}
                onClick={(e) => isDeadlinePassed && e.preventDefault()}
              >
                {isDeadlinePassed ? "Deadline Passed" : "Apply on Official Website"}
                {!isDeadlinePassed && <ExternalLink className="w-5 h-5" />}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Side: Job Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100">
              <section className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Job Description</h3>
                </div>
                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium text-sm">
                  <RenderErrorBoundary fallbackText={job.description || ""}>
                    <ReactMarkdown>{job.description || ""}</ReactMarkdown>
                  </RenderErrorBoundary>
                </div>
              </section>

              <section className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Requirements</h3>
                </div>
                <div className="bg-slate-50 rounded-3xl p-8 md:p-10 border border-slate-100">
                  <div className="prose prose-slate max-w-none text-slate-700 font-medium text-sm">
                    <RenderErrorBoundary fallbackText={job.requirements || ""}>
                      <ReactMarkdown>{job.requirements || ""}</ReactMarkdown>
                    </RenderErrorBoundary>
                  </div>
                </div>
              </section>

              <div className="p-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/50 rounded-b-[2rem]">
                <div>
                  <h4 className="font-black text-slate-900 uppercase tracking-tighter text-lg mb-1">Ready for the challenge?</h4>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Submit your application today!</p>
                </div>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg ${
                    isDeadlinePassed
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-blue-700 shadow-slate-900/10"
                  }`}
                >
                  Confirm & Apply
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Sidebar */}
          <aside className="space-y-12">
            {/* Job Summary Card */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
              <h4 className="font-black text-slate-900 mb-10 uppercase tracking-[0.2em] text-[10px] p-3 bg-slate-50 rounded-lg inline-block border border-slate-100">
                Key Details
              </h4>
              <ul className="space-y-8">
                <li className="flex gap-5">
                  <div className="bg-blue-50 p-3 rounded-2xl h-fit text-blue-700 shadow-sm border border-blue-100/50 uppercase font-black text-xs">
                    Cat
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Category</p>
                    <p className="font-black text-slate-900 uppercase text-sm tracking-tight">{job.category}</p>
                  </div>
                </li>
                <li className="flex gap-5">
                  <div className="bg-red-50 p-3 rounded-2xl h-fit text-red-600 shadow-sm border border-red-100/50 uppercase font-black text-xs">
                    End
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Deadline Date</p>
                    <p className={`font-black uppercase text-sm tracking-tight ${isDeadlinePassed ? "text-red-500" : "text-slate-900"}`}>
                      {parseAndFormatDate(job.deadline, "MMMM dd")}
                    </p>
                  </div>
                </li>
                <li className="flex gap-5">
                  <div className="bg-emerald-50 p-3 rounded-2xl h-fit text-emerald-600 shadow-sm border border-emerald-100/50 uppercase font-black text-xs">
                    Loc
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Position Base</p>
                    <p className="font-black text-slate-900 uppercase text-sm tracking-tight">{job.location}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Company Info */}
            <div className="bg-blue-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-900/20">
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-6 underline decoration-blue-500 underline-offset-8">Employer</h4>
              <p className="text-blue-200 text-sm leading-relaxed mb-10 font-medium italic">
                Learn more about {job.company} and their official operations within the Tanzanian economic landscape.
              </p>
              <div className="space-y-5">
                <a href="#" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-blue-300 hover:text-white transition-colors border-b border-white/10 pb-3">
                  <Globe className="w-4 h-4" />
                  Official Site
                </a>
                <a href="#" className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-blue-300 hover:text-white transition-colors border-b border-white/10 pb-3">
                  <Briefcase className="w-4 h-4" />
                  Career Profile
                </a>
              </div>
            </div>

            {/* Application Disclaimer */}
            <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-200/50">
              <p className="text-[10px] font-black text-amber-800 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Info size={14} className="mb-0.5" />
                Wait!
              </p>
              <p className="text-xs text-amber-700 leading-relaxed font-bold italic">
                Ajira Central is an information portal only. Stay vigilant and never pay any fees for job applications or interviews.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Info({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
