
import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { X, Mail, Lock, Loader2, ArrowRight, Github, AlertTriangle, Sparkles } from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (email: string) => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured) {
        if (isSignUp) {
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          alert('Check your email for the confirmation link!');
          onClose();
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          onClose();
        }
      } else {
        // Mock Auth for Demo Mode
        await new Promise(r => setTimeout(r, 800));
        if (onLoginSuccess) onLoginSuccess(email || "demo-user@venturebuild.ai");
        else onClose();
      }
    } catch (err: any) { 
        setError(err.message); 
    } finally { 
        setLoading(false); 
    }
  };

  const handleGithubOAuth = async () => {
    setLoading(true);
    try {
        if (isSupabaseConfigured) {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } else {
            // Demo Mode
            await new Promise(r => setTimeout(r, 1000));
            if (onLoginSuccess) onLoginSuccess("github-dev@venturebuild.ai");
            else onClose();
        }
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#030014]/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#0A0A1F] border border-white/10 rounded-[2.5rem] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Visual Decor */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="p-10 relative z-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-4">
                <Sparkles className="w-3 h-3" /> Secure Access
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                {isSignUp ? 'Join the Studio' : 'Venture Portal'}
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Access your strategic pipeline and builds.
              </p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          {!isSupabaseConfigured && (
              <div className="mb-8 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex items-start gap-3 text-[10px] text-yellow-200/80 leading-relaxed">
                 <AlertTriangle className="w-4 h-4 shrink-0" />
                 <span><strong>Demo Mode:</strong> Any credentials will grant access to the builder interface.</span>
              </div>
          )}

          <div className="space-y-4">
            <button
                type="button"
                onClick={handleGithubOAuth}
                disabled={loading}
                className="w-full bg-white text-slate-950 font-black py-4 rounded-2xl transition hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 group disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Github className="w-5 h-5" />}
                <span className="text-xs uppercase tracking-widest">Connect with GitHub</span>
            </button>

            <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-slate-600 text-[9px] font-black uppercase tracking-widest">Or email access</span>
                <div className="flex-grow border-t border-white/5"></div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition placeholder:text-slate-700 text-sm"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition" />
                <input
                  type="password"
                  placeholder="Secret passphrase"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition placeholder:text-slate-700 text-sm"
                  required
                />
              </div>

              {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl transition shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isSignUp ? 'Create Profile' : 'Authenticate'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            {isSignUp ? 'Member already?' : "Don't have an ID?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-indigo-400 hover:text-indigo-300 transition px-2"
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDialog;
