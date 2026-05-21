/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./lib/firebase";
import { Toaster } from "sonner";
import { AUTHORIZED_EMAILS, AUTHORIZED_UIDS } from "./constants";

// Pages
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import JobPage from "./pages/JobPage";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DisclaimerPage from "./pages/DisclaimerPage";

// Admin Pages
import AdminLayout from "./pages/admin/Layout";
import AdminDashboardHome from "./pages/admin/Dashboard";
import AdminJobsList from "./pages/admin/JobsList";
import AdminJobForm from "./pages/admin/JobForm";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function AppContent({ user, loading }: { user: User | null; loading: boolean }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  
  const isAuthorized = user && (
    AUTHORIZED_EMAILS.includes(user.email || "") || 
    AUTHORIZED_UIDS.includes(user.uid || "")
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Establishing Secure Link</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {!isAdminPage && <Navbar user={user} />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobPage />} />
          <Route path="/login" element={<LoginPage user={user} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={isAuthorized ? <AdminLayout /> : <Navigate to="/login" />}
          >
            <Route index element={<AdminDashboardHome />} />
            <Route path="jobs" element={<AdminJobsList />} />
            <Route path="jobs/new" element={<AdminJobForm />} />
            <Route path="jobs/edit/:id" element={<AdminJobForm />} />
          </Route>
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for bypass session if Firebase auth is having issues
    const bypassUser = localStorage.getItem("admin_bypass_session");
    if (bypassUser) {
      try {
        const parsed = JSON.parse(bypassUser);
        if (parsed && parsed.email) {
          setUser(parsed as User);
          setLoading(false);
          return;
        }
      } catch (e) {
        localStorage.removeItem("admin_bypass_session");
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Only clear if no bypass session exists
        if (!localStorage.getItem("admin_bypass_session")) {
          setUser(null);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Toaster position="top-right" expand={true} richColors />
      <AppContent user={user} loading={loading} />
    </Router>
  );
}
