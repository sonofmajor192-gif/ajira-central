import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, addDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { JobInput } from "../../types";
import { 
  Plus, 
  Save, 
  ArrowLeft, 
  Briefcase, 
  CheckCircle2, 
  Loader2,
  Info,
  Type,
  Link as LinkIcon,
  MapPin,
  ListChecks,
  Image as ImageIcon,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminJobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<JobInput>({
    title: "",
    company: "",
    location: "Dar es Salaam",
    category: "IT & Software",
    description: "",
    requirements: "",
    deadline: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    applyUrl: "",
    featured: false,
    companyLogo: "",
  });

  useEffect(() => {
    if (id) {
      async function fetchJob() {
        try {
          const docRef = doc(db, "jobs", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as JobInput;
            setFormData(data);
          } else {
            toast.error("Resource not found");
            navigate("/admin/jobs");
          }
        } catch (error) {
          toast.error("Discovery cycle failure");
        } finally {
          setLoading(false);
        }
      }
      fetchJob();
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (id) {
        const jobRef = doc(db, "jobs", id);
        await updateDoc(jobRef, {
          ...formData,
          updatedAt: serverTimestamp(),
        });
        toast.success("Listing recalibrated successfully");
      } else {
        await addDoc(collection(db, "jobs"), {
          ...formData,
          createdAt: serverTimestamp(),
        });
        toast.success("New opportunity broadcasted");
      }
      navigate("/admin/jobs");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Operation commit failure");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <Loader2 className="w-12 h-12 text-blue-700 animate-spin" />
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Parsing Data Stream</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-4xl">
      <header className="flex items-center gap-8">
        <Link 
          to="/admin/jobs" 
          className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-700 hover:border-blue-100 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1">
            {id ? "Edit Position" : "New Position"}
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            {id ? `Inventory ID: ${id}` : "Initializing new database entry"}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12 pb-20">
        {/* Core Identity Section */}
        <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100%] border-l border-b border-slate-100"></div>
          
          <div className="flex items-center gap-3 mb-12">
             <div className="w-1.5 h-6 bg-blue-700 rounded-full"></div>
             <h3 className="text-xl font-black uppercase tracking-tighter italic">Core Identity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                   <Type size={14} className="text-blue-700" /> Job Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Senior Project Manager"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none focus:border-blue-500 font-black uppercase tracking-tight text-sm transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                   <Briefcase size={14} className="text-blue-700" /> Employer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Bank of Tanzania"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none focus:border-blue-500 font-black uppercase tracking-tight text-sm transition-all"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                    <MapPin size={14} className="text-blue-700" /> Location
                  </label>
                  <select
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none focus:border-blue-500 font-black uppercase tracking-tight text-sm transition-all appearance-none cursor-pointer"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  >
                    <option>Dar es Salaam</option>
                    <option>Arusha</option>
                    <option>Mwanza</option>
                    <option>Dodoma</option>
                    <option>Zanzibar</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                    <Zap size={14} className="text-blue-700" /> Industry
                  </label>
                  <select
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none focus:border-blue-500 font-black uppercase tracking-tight text-sm transition-all appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>IT & Software</option>
                    <option>Finance & Banking</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                    <option>Engineering</option>
                    <option>Marketing</option>
                    <option>NGO</option>
                    <option>Government</option>
                  </select>
                </div>
              </div>

               <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                  <ListChecks size={14} className="text-blue-700" /> Application Deadline
                </label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none focus:border-blue-500 font-black uppercase tracking-tight text-sm transition-all"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Technical Logistics Section */}
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-14 text-white shadow-2xl shadow-blue-900/10 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-tl-full -mr-10 -mb-10"></div>
          
          <div className="flex items-center gap-3 mb-10">
             <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
             <h3 className="text-xl font-black uppercase tracking-tighter italic">Technical Logistics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-blue-300 tracking-[0.2em] flex items-center gap-2">
                   <LinkIcon size={14} /> Official Application URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-blue-400 font-medium text-sm transition-all text-blue-100 placeholder:text-white/20"
                  value={formData.applyUrl}
                  onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-blue-300 tracking-[0.2em] flex items-center gap-2">
                   <ImageIcon size={14} /> Logo Vector Stream (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-blue-400 font-medium text-sm transition-all text-blue-100 placeholder:text-white/20"
                  value={formData.companyLogo}
                  onChange={(e) => setFormData({ ...formData, companyLogo: e.target.value })}
                />
              </div>
          </div>

          <div className="mt-10 flex items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
            <input
              type="checkbox"
              id="featured-form"
              className="w-6 h-6 rounded-lg bg-white/10 border-white/20 text-blue-500 focus:ring-blue-400 cursor-pointer"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <label htmlFor="featured-form" className="text-xs font-black uppercase tracking-widest cursor-pointer select-none">
              Prioritize this listing in featured matrices
            </label>
          </div>
        </div>

        {/* Content Matrices Section */}
        <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-200 shadow-sm">
           <div className="flex items-center gap-3 mb-12">
             <div className="w-1.5 h-6 bg-blue-700 rounded-full"></div>
             <h3 className="text-xl font-black uppercase tracking-tighter italic">Content Matrices</h3>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                 <Info size={14} className="text-blue-700" /> Primary Description (Markdown)
              </label>
              <textarea
                required
                rows={8}
                className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 outline-none focus:border-blue-500 font-medium text-sm transition-all leading-relaxed"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Declare position scope and impact..."
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                 <ListChecks size={14} className="text-blue-700" /> Required Qualifications (Markdown)
              </label>
              <textarea
                required
                rows={6}
                className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 outline-none focus:border-blue-500 font-medium text-sm transition-all leading-relaxed"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="List technical specifications and academic credentials..."
              />
            </div>
          </div>
        </div>

        {/* Action Commit */}
        <div className="pt-12 flex flex-col sm:flex-row items-center justify-end gap-6 bg-slate-100/50 p-10 rounded-[3rem] border-2 border-dashed border-slate-200">
           <Link
             to="/admin/jobs"
             className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
           >
             Abort Operation
           </Link>
           <button
             type="submit"
             disabled={submitting}
             className="w-full sm:w-auto flex items-center justify-center gap-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] py-6 px-16 rounded-3xl hover:bg-blue-700 transition-all shadow-2xl active:scale-95 disabled:opacity-50 group"
           >
             {submitting ? (
               <Loader2 className="w-5 h-5 animate-spin" />
             ) : (
               <>
                 Commit Entry
                 <Save className="w-5 h-5 group-hover:scale-125 transition-transform" />
               </>
             )}
           </button>
        </div>
      </form>
    </div>
  );
}
