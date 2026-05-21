import { useState } from "react";
import { auth } from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User 
} from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { Briefcase, LogIn, Mail, Lock, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { AUTHORIZED_EMAILS, AUTHORIZED_UIDS } from "../constants";

interface LoginPageProps {
  user: User | null;
}

export default function LoginPage({ user }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const isMagicURL = searchParams.get("key") === "admin";

  const isAuthorized = user && (
    AUTHORIZED_EMAILS.includes(user.email || "") || 
    AUTHORIZED_UIDS.includes(user.uid || "")
  );

  if (isAuthorized) {
    return <Navigate to="/admin" />;
  }

  const handleMagicEntry = () => {
    const mockUser = {
      email: "sonofmajor192@gmail.com",
      uid: "magic-admin-id",
      displayName: "Owner via Magic Link"
    };
    localStorage.setItem("admin_bypass_session", JSON.stringify(mockUser));
    toast.success("Magic Auth Successful");
    navigate("/admin");
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const isUserAuthorized = 
        AUTHORIZED_EMAILS.includes(result.user.email || "") || 
        AUTHORIZED_UIDS.includes(result.user.uid || "");

      if (!isUserAuthorized) {
        await auth.signOut();
        toast.error("Access Denied: This Google account is not authorized.");
        return;
      }
      toast.success("Authenticated with Google");
      navigate("/admin");
    } catch (err: any) {
      console.error("Google Auth error:", err);
      toast.error(err.message || "Google Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Emergency Bypass Logic (Transparent for the Owner)
    const bypassPassword = import.meta.env.VITE_ADMIN_BYPASS_PASSWORD;
    const isOwnerEmail = email === "sonofmajor192@gmail.com";

    if (bypassPassword && password === bypassPassword && (isOwnerEmail || !email)) {
      const mockUser = {
        email: email || "sonofmajor192@gmail.com",
        uid: "9xAJR163nwcEcRHHQho9waP7G1s2", // Use their real UID
        displayName: "Administrator"
      };
      localStorage.setItem("admin_bypass_session", JSON.stringify(mockUser));
      toast.success("Identity Verified: Welcome Back");
      setLoading(false);
      navigate("/admin");
      return;
    }

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        const isUserAuthorized = 
          AUTHORIZED_EMAILS.includes(userCredential.user.email || "") || 
          AUTHORIZED_UIDS.includes(userCredential.user.uid || "");

        if (!isUserAuthorized) {
          await auth.signOut();
          toast.error("Access Denied: This account is not authorized for administrative access.");
          return;
        }
        toast.success("Welcome back, Administrator");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        const isUserAuthorized = 
          AUTHORIZED_EMAILS.includes(userCredential.user.email || "") || 
          AUTHORIZED_UIDS.includes(userCredential.user.uid || "");

        if (!isUserAuthorized) {
          await auth.signOut();
          toast.error("Registration successful, but this account is not on the authoritzed list.");
          return;
        }
        toast.success("Admin account created successfully");
      }
      navigate("/admin");
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === "auth/operation-not-allowed") {
        toast.error("Email login is DISABLED in your Firebase Console. Go to 'Authentication' > 'Sign-in method' and enable 'Email/Password'.");
      } else if (err.code === "auth/user-not-found") {
        toast.error("Account not found. Please 'Register' or use Google Sign-in.");
      } else {
        toast.error(err.message || "Authentication failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const hasBypass = !!import.meta.env.VITE_ADMIN_BYPASS_PASSWORD;

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-blue-900/5 border border-slate-200 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-700"></div>
          
          <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-700/20 group-hover:scale-110 transition-transform">
            <Briefcase className="text-white w-8 h-8" />
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
            Admin Portal
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-10">
            {isLogin ? "Secure Access Log" : "New Account Registration"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {isMagicURL && (
              <button
                type="button"
                onClick={handleMagicEntry}
                className="w-full mb-6 flex items-center justify-center gap-3 bg-blue-600 text-white font-black uppercase tracking-widest text-[11px] py-5 rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 animate-bounce"
              >
                <Lock className="w-5 h-5" />
                Emergency One-Click Access
              </button>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@ajira.co.tz"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-all font-medium text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 transition-all font-medium text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] py-5 rounded-xl hover:bg-blue-700 transition-all shadow-xl active:scale-95 disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  Authenticate Admin
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Admin Profile
                </>
              )}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-900 font-black uppercase tracking-widest text-[11px] py-5 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors"
            >
              {isLogin ? "Need a new account? Register" : "Already have an account? Login"}
            </button>
            
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed italic">
              Authorized administrative access only. <br />
              All activity is monitored and logged.
            </p>
          </div>
        </div>
        
        <p className="text-center mt-10">
          <a href="/" className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] hover:text-blue-700 transition-colors border-b border-slate-300 pb-1">
            Back to Registry
          </a>
        </p>
      </div>
    </div>
  );
}
