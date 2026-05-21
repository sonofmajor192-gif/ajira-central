import { ReactNode } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  LogOut, 
  ChevronRight,
  ExternalLink,
  PlusCircle,
  Menu,
  X
} from "lucide-react";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Manage Jobs", path: "/admin/jobs", icon: Briefcase },
    { name: "Post New Job", path: "/admin/jobs/new", icon: PlusCircle },
  ];

  const handleLogout = async () => {
    try {
      localStorage.removeItem("admin_bypass_session");
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-100 mb-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-700/20 group-hover:bg-blue-800 transition-colors">
              <span className="text-white font-black text-xl">A</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-blue-900 uppercase">
              Admin<span className="text-blue-600">Central</span>
            </h1>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between p-4 rounded-xl transition-all group ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 shadow-sm" 
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} className={isActive ? "text-blue-700" : "group-hover:text-slate-900"} />
                  <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-blue-700" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100 mt-auto">
          <div className="bg-slate-50 rounded-2xl p-4 mb-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
            <p className="text-xs font-bold text-slate-900 truncate">
              {auth.currentUser?.email || (JSON.parse(localStorage.getItem("admin_bypass_session") || "{}")).email || "Admin Session"}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a 
              href="/" 
              target="_blank" 
              className="flex items-center gap-3 p-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
            >
              <ExternalLink size={14} />
              View Live Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
            >
              <LogOut size={14} />
              Terminate Session
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-[100] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">A</span>
          </div>
          <span className="text-sm font-black uppercase tracking-tighter">Admin Central</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-900">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-[90]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" 
              onClick={() => setIsSidebarOpen(false)} 
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col p-8 pt-24"
            >
               <nav className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-xl ${
                      location.pathname === item.path ? "bg-blue-50 text-blue-700" : "text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                  </Link>
                ))}
              </nav>
              <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-4 p-4 text-red-500 font-black uppercase tracking-widest text-xs"
              >
                <LogOut size={20} />
                Logout
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-0 pt-20 lg:pt-0 overflow-x-hidden">
        <div className="max-w-6xl mx-auto p-6 md:p-10 lg:p-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
