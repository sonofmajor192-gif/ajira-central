import { Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append("q", keyword);
    if (location) params.append("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="bg-white p-2.5 rounded-3xl shadow-2xl border border-slate-200 flex flex-col md:flex-row gap-0 max-w-4xl mx-auto w-full"
    >
      <div className="flex-grow flex items-center px-6 relative group">
        <Search className="w-5 h-5 text-slate-400 absolute left-6 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="Job title or keywords..."
          className="w-full py-5 pl-8 pr-2 outline-none text-slate-800 font-bold uppercase tracking-tight placeholder:text-slate-300 placeholder:italic placeholder:font-normal placeholder:lowercase placeholder:tracking-normal"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className="hidden md:block w-px bg-slate-100 my-4"></div>
      <div className="flex-grow flex items-center px-6 relative group">
        <MapPin className="w-5 h-5 text-slate-400 absolute left-6 group-focus-within:text-blue-500 transition-colors" />
        <select
          className="w-full py-5 pl-8 pr-2 outline-none text-slate-500 bg-transparent font-bold uppercase tracking-widest cursor-pointer appearance-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All Regions</option>
          <option value="Dar es Salaam">Dar es Salaam</option>
          <option value="Arusha">Arusha</option>
          <option value="Dodoma">Dodoma</option>
          <option value="Mwanza">Mwanza</option>
          <option value="Zanzibar">Zanzibar</option>
          <option value="Remote">Remote</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-tighter py-5 px-10 rounded-2xl transition-all shadow-xl active:scale-95"
      >
        Search Now
      </button>
    </form>
  );
}
