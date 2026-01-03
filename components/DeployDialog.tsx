
import React, { useState, useEffect } from 'react';
import { X, CloudUpload, Lock, ExternalLink, Loader2, CheckCircle, AlertTriangle, Info, ShieldCheck, Zap } from 'lucide-react';
import { deployToVercel, VercelDeploymentResponse } from '../services/vercelService';
import { generateProjectFiles } from '../services/exportService';
import { ApiResponse } from '../types';

interface DeployDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: ApiResponse;
  projectName: string;
}

const DeployDialog: React.FC<DeployDialogProps> = ({ isOpen, onClose, data, projectName }) => {
  const [token, setToken] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployment, setDeployment] = useState<VercelDeploymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveToken, setSaveToken] = useState(true);

  // Load token from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('vercel_token');
    if (saved) setToken(saved);
  }, []);

  if (!isOpen) return null;

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (saveToken) {
      localStorage.setItem('vercel_token', token);
    }

    setIsDeploying(true);
    setError(null);
    setDeployment(null);

    try {
      const files = generateProjectFiles(data, projectName);
      const result = await deployToVercel(token, files, projectName);
      setDeployment(result);
    } catch (err: any) {
      setError(err.message || 'Failed to deploy to Vercel.');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#050510] px-8 py-10 flex justify-between items-center text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-xl transform rotate-3">
               <svg viewBox="0 0 1155 1000" className="w-8 h-8" fill="black">
                  <path d="M577.344 0L1154.69 1000H0L577.344 0Z" />
               </svg>
            </div>
            <div>
              <h3 className="font-black text-2xl tracking-tight leading-none">Vercel Ship</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">Deploy Venture to Production</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          {!deployment ? (
            <form onSubmit={handleDeploy} className="space-y-8">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex gap-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-indigo-600" />
                </div>
                <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                  We'll package your codebase and launch it to a global CDN. You'll get a production-ready URL in seconds.
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                      Step 1: Get Access Token
                    </label>
                    <a 
                      href="https://vercel.com/account/tokens" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 hover:underline"
                    >
                      Get Token <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-5 w-5 h-5 text-slate-300 group-focus-within:text-indigo-500 transition" />
                    <input 
                      type="password" 
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Enter Vercel Token (Bearer...)"
                      className="w-full pl-14 pr-4 py-5 bg-slate-50 border border-slate-200 rounded-[1.2rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition text-sm font-mono placeholder:font-sans"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 px-1">
                    <input 
                        type="checkbox" 
                        id="saveToken" 
                        checked={saveToken} 
                        onChange={(e) => setSaveToken(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="saveToken" className="text-xs font-bold text-slate-500">Remember token for this session</label>
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
                disabled={isDeploying || !token}
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 rounded-[1.2rem] transition shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group relative overflow-hidden"
              >
                {isDeploying ? (
                    <>
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                        <span className="text-sm uppercase tracking-[0.2em]">Deploying Assets...</span>
                    </>
                ) : (
                    <>
                        <Zap className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
                        <span className="text-sm uppercase tracking-[0.2em]">Launch Production Site</span>
                    </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">Encrypted Transfer via Vercel Deploy API</span>
              </div>
            </form>
          ) : (
            <div className="text-center py-10 animate-in zoom-in-95 duration-500">
               <div className="relative inline-block mb-10">
                  <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse"></div>
                  <div className="w-28 h-28 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center relative z-10 shadow-inner border border-emerald-100">
                    <CheckCircle className="w-14 h-14" />
                  </div>
               </div>
               
               <div className="mb-12">
                  <h4 className="font-black text-3xl text-slate-900 mb-3 tracking-tight">Venture is Live!</h4>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto text-sm">
                    Your venture has been successfully deployed and is now accessible globally.
                  </p>
               </div>
               
               <div className="flex flex-col gap-4">
                  <a 
                    href={deployment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-indigo-600 text-white font-black py-6 px-8 rounded-[1.2rem] hover:bg-indigo-700 transition flex items-center justify-center gap-4 text-sm uppercase tracking-[0.2em] shadow-xl hover:shadow-indigo-500/30"
                  >
                    Open Live Project <ExternalLink className="w-5 h-5" />
                  </a>
                  <a 
                    href={deployment.inspectorUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-slate-50 text-slate-600 font-black py-5 px-8 rounded-[1.2rem] hover:bg-slate-100 transition flex items-center justify-center gap-3 text-xs uppercase tracking-[0.15em] border border-slate-200"
                  >
                    Vercel Dashboard
                  </a>
               </div>
               
               <button 
                 onClick={() => setDeployment(null)}
                 className="mt-10 text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest underline decoration-slate-200 underline-offset-8 transition"
               >
                 Redeploy new version
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeployDialog;
