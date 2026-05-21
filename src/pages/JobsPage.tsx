import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Job } from "../types";
import JobCard from "../components/JobCard";
import FilterBar from "../components/FilterBar";
import { Search, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  const keyword = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "All Categories";
  const locationFilter = searchParams.get("location") || "All Locations";

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));

        // If category is set, add filter
        if (categoryFilter !== "All Categories") {
          q = query(q, where("category", "==", categoryFilter));
        }

        // If location is set, add filter
        if (locationFilter !== "All Locations") {
          q = query(q, where("location", "==", locationFilter));
        }

        const snapshot = await getDocs(q);
        let jobsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];

        // Keyword filter (client-side because Firestore doesn't support full-text search without outside services)
        if (keyword) {
          const lowerKeyword = keyword.toLowerCase();
          jobsData = jobsData.filter(
            (job) =>
              job.title.toLowerCase().includes(lowerKeyword) ||
              job.company.toLowerCase().includes(lowerKeyword) ||
              job.description.toLowerCase().includes(lowerKeyword)
          );
        }

        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [keyword, categoryFilter, locationFilter]);

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "All Categories" || value === "All Locations" || value === "") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Available Opportunities</h3>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">Browse All Jobs</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Showing {jobs.length} relevant official opportunities
          </p>
        </header>

        <FilterBar
          selectedCategory={categoryFilter}
          onCategoryChange={(cat) => updateFilters("category", cat)}
          selectedLocation={locationFilter}
          onLocationChange={(loc) => updateFilters("location", loc)}
        />

        {/* Active Search/Filters Info */}
        {(keyword || categoryFilter !== "All Categories" || locationFilter !== "All Locations") && (
          <div className="flex flex-wrap gap-3 mb-10">
            {keyword && (
              <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-2">
                Keyword: "{keyword}"
                <button onClick={() => updateFilters("q", "")} className="hover:text-blue-400">×</button>
              </span>
            )}
            {categoryFilter !== "All Categories" && (
              <span className="bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-2">
                Category: {categoryFilter}
                <button onClick={() => updateFilters("category", "All Categories")} className="hover:text-blue-400">×</button>
              </span>
            )}
            {locationFilter !== "All Locations" && (
              <span className="bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-2">
                Location: {locationFilter}
                <button onClick={() => updateFilters("location", "All Locations")} className="hover:text-blue-400">×</button>
              </span>
            )}
            <button 
              onClick={() => setSearchParams(new URLSearchParams())}
              className="text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-300 pb-0.5 ml-2 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-8">
            {loading ? (
              <div className="space-y-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-64 bg-white border border-slate-200 rounded-[2rem] animate-pulse"></div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </AnimatePresence>
            ) : (
              <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">No jobs found</h3>
                <p className="text-slate-400 max-w-sm mx-auto font-medium">
                  We couldn't find any listings matching your current selection.
                </p>
                <button
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="mt-10 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] px-8 py-4 rounded-xl hover:bg-blue-700 transition-all"
                >
                  View All Listings
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-10">
            <div className="bg-blue-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full"></div>
              <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">Job Alert</h4>
              <p className="text-blue-200 text-[13px] mb-8 leading-relaxed font-medium italic">
                Get the latest Tanzanian career opportunities straight to your inbox daily.
              </p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="name@example.co.tz"
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-4 px-5 text-sm placeholder:text-blue-300 focus:bg-white/20 outline-none transition-all font-medium"
                />
                <button className="w-full bg-blue-600 text-white font-black uppercase tracking-widest text-[11px] py-4 rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/50">
                  Subscribe Now
                </button>
              </form>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-blue-700">
                  <Info className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 uppercase tracking-tighter text-lg">Application Tip</h4>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                Official applications in Tanzania are rarely through side-channels. Always follow the official link provided in the listing.
              </p>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Note</p>
                <p className="text-xs text-slate-700 font-bold italic">
                  "Authenticity is your best currency. Keep your career profile honest and professional."
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
