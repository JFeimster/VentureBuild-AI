
import React, { useState, useEffect } from 'react';
import { generateVentureBuild } from './services/geminiService';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import LandingPage from './components/LandingPage';
import AuthDialog from './components/AuthDialog';
import ChatBot from './components/ChatBot';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { FormData, ApiResponse, SavedProject } from './types';
import { Box, Layers, Zap, Clock, FolderOpen, Trash2, ChevronRight, LogOut, User, LayoutDashboard, Sparkles } from 'lucide-react';
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

  // Common UI Wrapper for consistent ChatBot presence
  const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen relative">
      {children}
      <ChatBot context={result} projectName={currentProjectName} />
    </div>
  );

  if (!session) {
    return (
      <AppWrapper>
        <LandingPage onGetStarted={() => setIsAuthOpen(true)} />
        <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLoginSuccess={handleLoginSuccess} />
      </AppWrapper>
    );
  }

  if (result) {
    return (
      <AppWrapper>
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
          <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[50] px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
              <div className="bg-slate-900 p-2 rounded-xl text-white group-hover:scale-110 transition-transform"><Layers className="w-6 h-6" /></div>
              <span className="font-black text-2xl tracking-tighter text-slate-900">Venture<span className="text-indigo-600 italic">Build</span></span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition bg-slate-100 px-5 py-2.5 rounded-xl border border-slate-200"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <div className="h-8 w-px bg-slate-200 mx-2"></div>
              <button onClick={handleSignOut} className="text-slate-400 hover:text-red-600 transition p-2"><LogOut className="w-5 h-5" /></button>
            </div>
          </header>
          <OutputDisplay data={result} projectName={currentProjectName} onReset={handleReset} onSave={handleSave} onDownload={handleDownload} />
        </div>
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 animate-fade-in relative overflow-x-hidden">
        {/* Abstract Background Engine Decor */}
        <div className="fixed top-0 right-0 w-[50vw] h-[50vh] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-[50] px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="bg-slate-900 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform"><Layers className="w-6 h-6" /></div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">Venture<span className="text-indigo-600 italic">Build</span></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">{session.user.email?.charAt(0).toUpperCase()}</div>
              <span className="text-xs font-bold text-slate-600">{session.user.email}</span>
            </div>
            <button onClick={handleSignOut} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition">Sign Out</button>
          </div>
        </header>

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 md:py-20 relative z-10">
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-6">
              <Sparkles className="w-3 h-3" /> AI Strategic Builder v3.0
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter animate-slide-up leading-tight">
              Turn your concept into a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">launch-ready asset</span>.
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto animate-slide-up-delay-1 font-medium">
              Next-gen codebase generation, strategic branding, and deep market analysis in seconds.
            </p>
          </div>

          {error && <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-2xl text-red-700 flex items-center gap-4 animate-scale-in shadow-sm"><Zap className="w-6 h-6" /> {error}</div>}
          
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} />

          {savedProjects.length > 0 && (
            <div className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                  <FolderOpen className="w-7 h-7 text-indigo-500" /> 
                  Venture Archive
                </h2>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{savedProjects.length} Projects Saved</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProjects.map((p) => (
                  <div key={p.id} onClick={() => handleLoad(p)} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-indigo-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner border border-slate-100">
                        <Zap className="w-7 h-7" />
                      </div>
                      <button onClick={(e) => deleteProject(p.id, e)} className="p-2 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-slate-900 mb-1 group-hover:text-indigo-600 transition">{p.name}</h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3" /> {p.date}
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-all transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className="py-12 text-center text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
          <p>&copy; {new Date().getFullYear()} Venture Build Global. Built with Gemini 3 Pro.</p>
        </footer>
      </div>
    </AppWrapper>
  );
};

export default App;
