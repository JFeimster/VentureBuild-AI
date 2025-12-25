
import React, { useState, useEffect } from 'react';
import { generateVentureBuild } from './services/geminiService';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import LandingPage from './components/LandingPage';
import AuthDialog from './components/AuthDialog';
import ChatBot from './components/ChatBot';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { FormData, ApiResponse, SavedProject } from './types';
import { Box, Layers, Zap, Clock, FolderOpen, Trash2, ChevronRight, LogOut, User } from 'lucide-react';
import { downloadProjectZip } from './services/exportService';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [currentProjectName, setCurrentProjectName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
      return () => subscription.unsubscribe();
    } else {
      const demoUser = localStorage.getItem('vb_demo_user');
      if (demoUser) setSession({ user: { email: demoUser } });
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('venture_build_saves');
    if (saved) {
      try { setSavedProjects(JSON.parse(saved)); } catch (e) { console.error("Failed to parse saves", e); }
    }
  }, []);

  const handleSignOut = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    else localStorage.removeItem('vb_demo_user');
    setSession(null);
    setResult(null);
  };

  const handleLoginSuccess = (email: string) => {
    localStorage.setItem('vb_demo_user', email);
    setSession({ user: { email } });
    setIsAuthOpen(false);
  };

  const saveProjectToStorage = (project: SavedProject) => {
    const updated = [project, ...savedProjects.filter(p => p.id !== project.id)];
    setSavedProjects(updated);
    localStorage.setItem('venture_build_saves', JSON.stringify(updated));
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedProjects.filter(p => p.id !== id);
    setSavedProjects(updated);
    localStorage.setItem('venture_build_saves', JSON.stringify(updated));
  };

  const handleSave = () => {
    if (!result) return;
    const finalName = window.prompt("Project Name:", currentProjectName || 'Untitled') || 'Untitled';
    const project: SavedProject = { id: Date.now().toString(), name: finalName, date: new Date().toLocaleDateString(), data: result, type: 'GENERATE_CODE' };
    saveProjectToStorage(project);
  };

  const handleDownload = () => result && downloadProjectZip(result, currentProjectName || 'Venture_Build');
  const handleLoad = (project: SavedProject) => { setResult(project.data); setCurrentProjectName(project.name); };

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true); setError(null); setCurrentProjectName(data.projectName);
    try { const response = await generateVentureBuild(data); setResult(response); }
    catch (err: any) { setError(err.message || "Build failed."); }
    finally { setIsLoading(false); }
  };

  const handleReset = () => { setResult(null); setError(null); };

  if (!session) {
    return (
      <>
        <LandingPage onGetStarted={() => setIsAuthOpen(true)} />
        <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><Layers className="w-6 h-6" /></div>
            <span className="font-bold text-xl tracking-tight">Venture<span className="text-indigo-600">Build</span> AI</span>
          </div>
          <button onClick={handleSignOut} className="text-slate-500 hover:text-red-600 transition p-2"><LogOut className="w-5 h-5" /></button>
        </header>
        <OutputDisplay data={result} projectName={currentProjectName} onReset={handleReset} onSave={handleSave} onDownload={handleDownload} />
        <ChatBot context={result} projectName={currentProjectName} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 animate-fade-in">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><Layers className="w-6 h-6" /></div>
          <span className="font-bold text-xl tracking-tight">Venture<span className="text-indigo-600">Build</span> AI</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600"><User className="w-4 h-4" /><span>{session.user.email}</span></div>
          <button onClick={handleSignOut} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition">Sign Out</button>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 animate-slide-up">Turn your concept into a <span className="text-indigo-600">launch-ready asset</span>.</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto animate-slide-up-delay-1">Specialized copy, strategic branding, and deployment-ready codebases in seconds.</p>
        </div>
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3 animate-scale-in">{error}</div>}
        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
        {savedProjects.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><FolderOpen className="w-5 h-5 text-indigo-500" /> Saved Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedProjects.map((p) => (
                <div key={p.id} onClick={() => handleLoad(p)} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover-lift transition cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><Zap className="w-5 h-5" /></div>
                    <div><h3 className="font-bold text-slate-900">{p.name}</h3><div className="text-xs text-slate-500">{p.date}</div></div>
                  </div>
                  <button onClick={(e) => deleteProject(p.id, e)} className="p-2 text-slate-300 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <ChatBot />
    </div>
  );
};

export default App;
