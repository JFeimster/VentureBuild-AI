
import React, { useState } from 'react';
import { X, CloudUpload, Lock, ExternalLink, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
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

  if (!isOpen) return null;

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsDeploying(true);
    setError(null);
    setDeployment(null);

    try {
      const files = generateProjectFiles(data, projectName);
      const result = await deployToVercel(token, files, projectName);
      setDeployment(result);
      
      // Save token for convenience in this session (optional, avoiding localStorage for security in this demo)
    } catch (err: any) {
      setError(err.message || 'Failed to deploy to Vercel.');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <svg viewBox="0 0 1155 1000" className="w-5 h-5" fill="black">
                <path d="M577.344 0L1154.69 1000H0L577.344 0Z" />
            </svg>
            Deploy to Vercel
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!deployment ? (
            <form onSubmit={handleDeploy} className="space-y-4">
              <p className="text-sm text-slate-600">
                Instantly deploy your project to a live URL using your Vercel account.
              </p>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Vercel Access Token
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                        type="password" 
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="ey..."
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition text-sm font-mono"
                        required
                    />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                   Don't have one? <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-0.5">Create Token <ExternalLink className="w-3 h-3"/></a>
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2 border border-red-100">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={isDeploying || !token}
                className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
                {isDeploying ? 'Deploying...' : 'Deploy Now'}
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle className="w-8 h-8" />
               </div>
               <div>
                  <h4 className="font-bold text-xl text-slate-900 mb-1">Deployment Successful!</h4>
                  <p className="text-sm text-slate-500">Your site is live and ready to view.</p>
               </div>
               
               <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col gap-2">
                  <a 
                    href={deployment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-slate-800 transition flex items-center justify-center gap-2 text-sm"
                  >
                    View Live Site <ExternalLink className="w-4 h-4" />
                  </a>
                  <a 
                    href={deployment.inspectorUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-800 text-xs font-medium py-1"
                  >
                    Inspect in Dashboard
                  </a>
               </div>
               
               <button 
                 onClick={() => setDeployment(null)}
                 className="text-sm text-slate-400 hover:text-slate-600 underline"
               >
                 Deploy another version
               </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        {!deployment && (
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
            Your token is never stored and is sent directly to Vercel API.
            </div>
        )}
      </div>
    </div>
  );
};

export default DeployDialog;
