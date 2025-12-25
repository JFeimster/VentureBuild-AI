
import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { X, Mail, Lock, Loader2, ArrowRight, Github, AlertTriangle } from 'lucide-react';

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
        // Real Supabase Auth Flow
        if (isSignUp) {
          const { error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          alert('Check your email for the confirmation link!');
          onClose();
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          onClose();
        }
      } else {
        // DEMO MODE: Mock Auth Flow
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network request
        if (email.length < 5) throw new Error("Please enter a valid email.");
        
        if (onLoginSuccess) {
           onLoginSuccess(email);
        } else {
           onClose();
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    if (isSupabaseConfigured) {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    } else {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoading(false);
        if (onLoginSuccess) onLoginSuccess("github-user@venturebuild.ai");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#030014]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#0A0A1F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/20 blur-[60px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-600/20 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="p-8 relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-slate-400 text-sm">
                {isSignUp ? 'Start building your venture today.' : 'Continue where you left off.'}
              </p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSupabaseConfigured && (
              <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2 text-xs text-yellow-200">
                 <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                 <span>Demo Mode Active: Supabase is not configured. Log in with any email to test the interface.</span>
              </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#13112b] border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition placeholder:text-slate-600"
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#13112b] border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition shadow-[0_0_20px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Sign Up' : 'Sign In'} 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase">Or</span>
                <div className="flex-grow border-t border-white/10"></div>
            </div>

            <button
                type="button"
                onClick={handleGithubLogin}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
                <Github className="w-5 h-5" />
                Continue with GitHub
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-indigo-400 hover:text-indigo-300 font-bold transition"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDialog;
