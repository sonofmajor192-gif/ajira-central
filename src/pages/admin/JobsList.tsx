import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Job } from "../../types";
import { 
  Search, 
  Edit2, 
  Trash2, 
  Briefcase, 
  MapPin, 
  ChevronRight,
  Plus,
  Loader2,
  Calendar,
  AlertTriangle,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

// Helper to safely format dates
const safeFormatDeadline = (dateStr: string, formatStr: string = "MMM dd") => {
  if (!dateStr) return "N/A";
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return format(parsed, formatStr);
    }
  } catch (e) {
    console.error("Error formatting deadline:", e);
  }
  return dateStr || "N/A";
};

import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function AdminJobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Job[];
      setJobs(jobsData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "jobs", id));
      setJobs(jobs.filter(j => j.id !== id));
      toast.success("Listing expunged from database");
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error("Deletion lifecycle failure");
    }
  };

  const filteredJobs = jobs.filter(
    job => job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
       <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Job Inventory</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Manage existing employment opportunities</p>
        </div>
        <Link
          to="/admin/jobs/new"
          className="flex items-center gap-3 bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] py-4 px-8 rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-700/20 active:scale-95"
        >
          <Plus size={18} />
          Create New Listing
        </Link>
      </header>

      {/* Filter / Search Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title, company..."
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-blue-500 transition-all font-bold uppercase tracking-tight text-xs placeholder:lowercase placeholder:font-normal placeholder:italic placeholder:tracking-normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-4">
          <span>Active Registry:</span>
          <span className="text-blue-700">{filteredJobs.length} Positions</span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Position & Entity</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Meta & Region</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility</th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-8 py-8">
                       <div className="h-12 bg-slate-50 rounded-2xl"></div>
                    </td>
                  </tr>
                ))
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-blue-700 font-black text-xl border border-slate-200 group-hover:bg-blue-50 transition-colors">
                          {job.company.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-1 line-clamp-1">{job.title}</p>
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{job.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="space-y-1.5 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                         <div className="flex items-center gap-1.5 text-slate-700">
                            <MapPin size={12} />
                            {job.location}
                         </div>
                         <div className="flex items-center gap-1.5 italic text-red-500">
                            <Calendar size={12} />
                            End: {safeFormatDeadline(job.deadline, "MMM dd")}
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      {job.featured ? (
                        <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-3 py-1 rounded italic uppercase tracking-wider border border-amber-200">
                          Featured
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-3 py-1 rounded uppercase tracking-wider border border-slate-200">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/admin/jobs/edit/${job.id}`}
                          className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirmId(job.id)}
                          className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Operational database returned zero matches.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-slate-200 text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-red-600 border border-red-100">
                 <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">Confirm Deletion</h3>
              <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">
                This action is irreversible. The job listing and all associated data will be purged from the production database.
              </p>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="w-full bg-red-600 text-white font-black uppercase tracking-widest text-[11px] py-5 rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 active:scale-95"
                >
                  Confirm Expungement
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="w-full bg-slate-100 text-slate-500 font-black uppercase tracking-widest text-[11px] py-5 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                >
                  Abort Action
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
