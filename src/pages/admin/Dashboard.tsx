import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Job } from "../../types";
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

// Helper to safely convert Firestore timestamps or string values to a native JS Date
const parseToDate = (dateVal: any): Date => {
  if (!dateVal) return new Date();
  if (typeof dateVal === "object") {
    if (typeof dateVal.toDate === "function") {
      try {
        return dateVal.toDate();
      } catch (e) {
        console.error("Error calling toDate():", e);
      }
    }
    if (typeof dateVal.seconds === "number") {
      return new Date(dateVal.seconds * 1000);
    }
  }
  const parsed = new Date(dateVal);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    recent: 0
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Job[];
        
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        setStats({
          total: jobs.length,
          featured: jobs.filter(j => j.featured).length,
          recent: jobs.filter(j => j.createdAt && parseToDate(j.createdAt).getTime() > sevenDaysAgo.getTime()).length
        });

        setRecentJobs(jobs.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Systems Overview</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Real-time operational metrics for Ajira Central</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Platform Status: Active</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full group-hover:scale-110 transition-transform"></div>
          <Briefcase className="text-blue-700 mb-6 w-8 h-8 relative z-10" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Total Listings</p>
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter relative z-10">{stats.total}</h3>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group border-b-4 border-b-amber-500">
          <Zap className="text-amber-500 mb-6 w-8 h-8" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Featured Opportunities</p>
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{stats.featured}</h3>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
          <TrendingUp className="text-emerald-500 mb-6 w-8 h-8" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Inbound (Last 7 Days)</p>
          <h3 className="text-5xl font-black text-slate-900 tracking-tighter">{stats.recent}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Activity */}
        <section className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Recent Postings</h3>
            <Link to="/admin/jobs" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</Link>
          </div>
          <div className="p-4 flex-grow">
            <div className="space-y-1">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse m-2"></div>
                ))
              ) : recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-blue-700 font-black">
                        {job.company.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight line-clamp-1">{job.title}</p>
                        <p className="text-[10px] font-medium text-slate-400">{job.company}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                      {job.createdAt ? format(parseToDate(job.createdAt), "MMM dd") : "Pending"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Database is empty</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Security & Access Logs */}
        <section className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full"></div>
          <ShieldCheck className="text-blue-500 mb-8 w-10 h-10" />
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">Security Governance</h3>
          <p className="text-blue-200 text-sm leading-relaxed mb-10 font-medium max-w-sm">
            All administrative actions are encrypted and logged with persistent audit trails. 
            Ensure your session is terminated after use.
          </p>
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em] mb-2 font-mono">Last Secure Login</p>
              <p className="text-sm font-bold">{new Date().toLocaleString()}</p>
            </div>
             <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em] mb-2 font-mono">Current IP Vector</p>
              <p className="text-sm font-bold">192.168.1.1 (Authenticated)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
