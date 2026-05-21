import { Link } from "react-router-dom";
import { Briefcase, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-8 py-10 bg-slate-100 border-t border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h2 className="text-xl font-black tracking-tighter text-blue-900 uppercase">
              Ajira<span className="text-blue-600">Central</span>
            </h2>
          </Link>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            © 2026 Ajira Central Tanzania. Official Jobs Portal.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          <Link to="/" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-700 transition-colors">Home</Link>
          <Link to="/jobs" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-700 transition-colors">Browse Jobs</Link>
          <Link to="/about" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-700 transition-colors">About</Link>
          <Link to="/contact" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-700 transition-colors">Contact</Link>
          <Link to="/disclaimer" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-700 transition-colors">Disclaimer</Link>
        </div>

        <div className="flex gap-4">
          <a href="#" className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
            <Twitter size={14} />
          </a>
          <a href="#" className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-700 transition-colors">
            <Linkedin size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
