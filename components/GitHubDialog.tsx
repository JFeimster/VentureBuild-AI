
import React, { useState, useEffect } from 'react';
import { X, Github, Lock, ExternalLink, Loader2, CheckCircle, AlertTriangle, Info, ShieldCheck, Zap, FolderPlus } from 'lucide-react';
import { createGitHubRepo, pushFilesToGitHub } from '../services/githubService';
import { generateProjectFiles } from '../services/exportService';
import { ApiResponse } from '../types';

interface GitHubDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: ApiResponse;
  projectName: string;
}

const GitHubDialog: React.FC<GitHubDialogProps> = ({ isOpen, onClose, data, projectName }) => {
  const [token, setToken] = useState('');
  const [repoName, setRepoName] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setRepoName(projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50));
      const saved = localStorage.getItem('github_token');
      if (saved) setToken(saved);
    }
  }, [projectName, isOpen]);

  if (!isOpen) return null;

  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !repoName) return;

    localStorage.setItem('github_token', token);
    setIsPushing(true);
    setError(null);
    setSuccessUrl(null);
    setProgress('Authenticating...');

    try {
      setProgress('Provisioning Repository...');
      const repo = await createGitHubRepo(token, repoName);
      
      setProgress('Generating Codebase...');
      const files = generateProjectFiles(data, projectName);
      
      setProgress(`Atomic Push: ${files.length} Files...`);
      await pushFilesToGitHub(token, repo.full_name.split('/')[0], repo.name, files);
      
      setSuccessUrl(repo.html_url);
    } catch (err: any) {
      setError(err.message || 'Failed to push to GitHub.');
    } finally {
      setIsPushing(false);
      setProgress('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#050510] px-8 py-10 flex justify-between items-center text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shadow-xl border border-white/10">
               <Github className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-black text-2xl tracking-tight leading-none">GitHub Push</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">Source Code Integration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 md:p-10">
          {!successUrl ? (
            <form onSubmit={handlePush} className="space-y-8">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex gap-5">
                <Info className="w-10 h-10 text-slate-400 shrink-0" />
                <div className="text-xs text-slate-600 leading-relaxed font-medium">
                  <p className="font-black text-slate-900 mb-1">Developer Requirement</p>
                  Create a Personal Access Token (PAT) with <code className="bg-slate-200 px-1.5 py-0.5 rounded border border-slate-300 text-slate-900">repo</code> scopes to allow us to create and push code to your account.
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                      Step 1: Authorization
                    </label>
                    <a 
                      href="https://github.com/settings/tokens/new?scopes=repo&description=Venture+Build+AI+Push" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 hover:underline"
                    >
                      New PAT <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-5 w-5 h-5 text-slate-300 group-focus-within:text-slate-900 transition" />
                    <input 
                      type="password" 
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Paste token (ghp_...)"
                      className="w-full pl-14 pr-4 py-5 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:ring-8 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition text-sm font-mono placeholder:font-sans"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                    Step 2: Repository Identity
                  </label>
                  <div className="relative group">
                    <FolderPlus className="absolute left-5 top-5 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition" />
                    <input 
                      type="text" 
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      placeholder="repository-name"
                      className="w-full pl-14 pr-4 py-5 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition text-sm font-bold text-slate-700"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-5 rounded-2xl text-xs flex items-start gap-4 border border-red-100 animate-in slide-in-from-top-2">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={isPushing || !token}
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-[1.2rem] transition shadow-2xl disabled:opacity-50 flex items-center justify-center gap-4 group"
              >
                {isPushing ? (
                    <>
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                        <span className="text-sm uppercase tracking-[0.2em]">{progress}</span>
                    </>
                ) : (
                    <>
                        <Zap className="w-6 h-6 text-yellow-400" />
                        <span className="text-sm uppercase tracking-[0.2em]">Build & Push to GitHub</span>
                    </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-10 animate-in zoom-in-95 duration-500">
               <div className="relative inline-block mb-10">
                  <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
                  <div className="w-28 h-28 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-inner border border-indigo-100">
                    <CheckCircle className="w-14 h-14" />
                  </div>
               </div>
               
               <div className="mb-12">
                  <h4 className="font-black text-3xl text-slate-900 mb-3 tracking-tight">Sync Complete!</h4>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto text-sm">
                    Your venture source code is now securely hosted on GitHub.
                  </p>
               </div>
               
               <div className="flex flex-col gap-4">
                  <a 
                    href={successUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full bg-slate-900 text-white font-black py-6 px-8 rounded-[1.2rem] hover:bg-black transition flex items-center justify-center gap-4 text-sm uppercase tracking-[0.2em] shadow-xl"
                  >
                    View on GitHub <ExternalLink className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={() => setSuccessUrl(null)}
                    className="mt-6 text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest underline decoration-slate-200 underline-offset-8 transition"
                  >
                    Sync to another repository
                  </button>
               </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 text-[9px] text-slate-400 text-center font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Transmission via Git Data API
        </div>
      </div>
    </div>
  );
};

export default GitHubDialog;
