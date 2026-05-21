import { useState, useEffect } from "react";
import { collection, query, where, limit, getDocs, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Job } from "../types";
import Hero from "../components/Hero";
import JobCard from "../components/JobCard";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch Featured
        const featuredQ = query(
          collection(db, "jobs"),
          where("featured", "==", true),
          limit(3)
        );
        const featuredSnap = await getDocs(featuredQ);
        const featuredData = featuredSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];
        setFeaturedJobs(featuredData);

        // Fetch Recent
        const recentQ = query(
          collection(db, "jobs"),
          orderBy("createdAt", "desc"),
          limit(6)
        );
        const recentSnap = await getDocs(recentQ);
        const recentData = recentSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];
        setRecentJobs(recentData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const categories = [
    { name: "IT & Tech", count: "1,200", icon: "💻", color: "bg-blue-50" },
    { name: "Banking", count: "850", icon: "🏦", color: "bg-green-50" },
    { name: "Healthcare", count: "420", icon: "🏥", color: "bg-red-50" },
    { name: "Education", count: "310", icon: "🎓", color: "bg-purple-50" },
  ];

  return (
    <div className="pb-20">
      <Hero />

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Editor's Choice</h3>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Featured Jobs</h2>
          </div>
          <Link to="/jobs" className="text-blue-700 font-black uppercase tracking-widest text-[11px] flex items-center gap-2 group border-b-2 border-blue-700 pb-1">
            Browse All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-[2rem] animate-pulse"></div>
            ))}
          </div>
        ) : featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No featured jobs currently.</p>
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="bg-white py-32 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-20">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Industries</h3>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-6">Explore by Category</h2>
            <div className="w-20 h-1.5 bg-blue-700 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/jobs?category=${cat.name}`}
                className="bg-slate-50 p-10 rounded-[2.5rem] hover:bg-blue-900 hover:text-white transition-all text-center group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100/50 rounded-bl-[2rem] group-hover:bg-white/10"></div>
                <span className="text-5xl mb-6 block group-hover:scale-110 transition-transform">{cat.icon}</span>
                <h4 className="font-black text-slate-900 mb-2 uppercase tracking-tighter group-hover:text-white">{cat.name}</h4>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest group-hover:text-blue-300">{cat.count} listings</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Updates</h3>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Recently Posted</h2>
          </div>
          <div className="flex gap-4">
             <span className="px-4 py-2 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-widest">Latest</span>
             <span className="px-4 py-2 bg-slate-200 text-slate-600 text-[10px] font-black rounded-full uppercase tracking-widest">Verified</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-slate-100 rounded-[2rem] animate-pulse"></div>
            ))}
          </div>
        ) : recentJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentJobs.map((job) => (
              <JobCard key={job.id} job={job} compact />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-400 font-bold uppercase tracking-widest">No recent listings.</p>
          </div>
        )}
      </section>

        <div className="mt-24 text-center">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] py-5 px-12 rounded-2xl hover:bg-blue-700 transition-all shadow-2xl active:scale-95 group"
          >
            Find Your Career Path
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

      {/* Brand Message Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="bg-blue-700 rounded-[3rem] p-12 md:p-24 text-white relative overflow-hidden shadow-2xl shadow-blue-700/20">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-xs font-black text-blue-300 uppercase tracking-[0.4em] mb-6">Our Mission</h3>
            <h2 className="text-5xl md:text-6xl font-black mb-10 leading-[0.9] uppercase tracking-tighter italic">Empowering Careers, <br />Building Tanzania.</h2>
            <p className="text-blue-100 text-lg mb-12 leading-relaxed font-medium">
              Ajira Central is the bridge between Tanzanian talent and national progress. 
              We connect the spirit of individual ambition with the future of our industry.
            </p>
            <div className="flex flex-wrap gap-8">
              <Link to="/jobs" className="bg-white text-blue-700 font-black uppercase tracking-widest text-[11px] py-5 px-10 rounded-2xl hover:bg-blue-50 transition-all shadow-lg">
                Explore Listings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
