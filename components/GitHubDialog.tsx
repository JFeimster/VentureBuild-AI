
import React, { useState, useEffect } from 'react';
import { X, Github, Lock, ExternalLink, Loader2, CheckCircle, AlertTriangle, HelpCircle, Info, Copy } from 'lucide-react';
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

  // Update local state when project name changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      setRepoName(projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-').substring(0, 50));
    }
  }, [projectName, isOpen]);

  if (!isOpen) return null;

  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !repoName) return;

    setIsPushing(true);
    setError(null);
    setSuccessUrl(null);
    setProgress('Initializing...');

    try {
      // 1. Create Repo
      setProgress('Creating repository...');
      const repo = await createGitHubRepo(token, repoName);
      
      // 2. Prepare Files
      const files = generateProjectFiles(data, projectName);
      
      // 3. Push Files
      setProgress(`Pushing ${files.length} files...`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-900 flex justify-between items-center text-white">
          <h3 className="font-bold flex items-center gap-2">
            <Github className="w-5 h-5" />
            Push to GitHub
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!successUrl ? (
            <form onSubmit={handlePush} className="space-y-6">
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-bold mb-1">Why do I need a token?</p>
                    <p className="leading-relaxed text-blue-800 text-xs">
                       Since this app runs in your browser, it cannot use your active GitHub login. You must provide a temporary <strong>Personal Access Token</strong> (Classic) so it can create the repo for you.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase mb-2">
                    Step 1: Generate Token
                </label>
                <a 
                   href="https://github.com/settings/tokens/new?scopes=repo&description=Venture+Build+AI+Export" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 hover:bg-white transition group mb-2"
                >
                    <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">Click here to generate token</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </a>
                <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-600 space-y-1.5 border border-slate-100">
                    <p className="font-medium text-slate-800 mb-1">Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-1">
                        <li>Link opens "New personal access token" page.</li>
                        <li>Scroll to bottom -> click green <strong>Generate token</strong>.</li>
                        <li>Copy the code starting with <code className="bg-white px-1 rounded border border-slate-200 text-slate-800">ghp_</code>.</li>
                    </ol>
                    <p className="text-amber-700 bg-amber-50 p-2 rounded border border-amber-100 mt-2">
                       <strong>Troubleshooting:</strong> If GitHub asks for your password and redirects you to your profile/dashboard instead of the settings page, simply come back here and <strong>click the link above again</strong>.
                    </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase mb-2">
                    Step 2: Paste Token
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                        type="password" 
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition text-sm font-mono"
                        required
                    />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase mb-2">
                    Step 3: Name Repository
                </label>
                <input 
                    type="text" 
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition text-sm"
                    required
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2 border border-red-100">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={isPushing || !token}
                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-0.5 transform duration-200"
              >
                {isPushing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
                {isPushing ? progress : 'Create Repository'}
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-6">
               <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                 <CheckCircle className="w-10 h-10" />
               </div>
               <div>
                  <h4 className="font-bold text-2xl text-slate-900 mb-2">Success!</h4>
                  <p className="text-slate-500">Your repository <strong>{repoName}</strong> has been created and populated.</p>
               </div>
               
               <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                  <a 
                    href={successUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2 w-full mb-3"
                  >
                    Open Repository <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-xs text-slate-400">
                    You can now clone this repo locally or deploy it to Vercel/Netlify.
                  </p>
               </div>
               
               <button 
                 onClick={() => setSuccessUrl(null)}
                 className="text-sm text-slate-400 hover:text-slate-600 underline"
               >
                 Push to another repo
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubDialog;
