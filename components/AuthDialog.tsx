
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
        if (isSignUp) {
          const { error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          alert('Check email for confirmation link!');
          onClose();
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          onClose();
        }
      } else {
        await new Promise(r => setTimeout(r, 800));
        if (onLoginSuccess) onLoginSuccess(email);
        else onClose();
      }
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#030014]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#0A0A1F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-slate-400 text-sm">Start building your venture today.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X className="w-5 h-5" /></button>
        </div>
        {!isSupabaseConfigured && <div className="mb-4 text-xs text-yellow-200 bg-yellow-500/10 p-2 rounded flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Demo Mode Active</div>}
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
          {error && <div className="text-red-400 text-xs">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isSignUp ? 'Sign Up' : 'Sign In'} <ArrowRight className="w-4 h-4"/></>}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-400">
          {isSignUp ? 'Already have an account?' : "New here?"}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-indigo-400 font-bold">{isSignUp ? 'Sign In' : 'Sign Up'}</button>
        </div>
      </div>
    </div>
  );
};

export default AuthDialog;
