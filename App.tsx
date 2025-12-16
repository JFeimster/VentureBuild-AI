
import React, { useState, useEffect } from 'react';
import { generateVentureBuild } from './services/geminiService';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import { FormData, ApiResponse, SavedProject } from './types';
import { Box, Layers, Zap, Clock, FolderOpen, Trash2, ChevronRight, Save } from 'lucide-react';
import { downloadProjectZip } from './services/exportService';

const App: React.FC = () => {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [currentProjectName, setCurrentProjectName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  // Load saved projects from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('venture_build_saves');
    if (saved) {
      try {
        setSavedProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved projects", e);
      }
    }
  }, []);

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
    
    let savedType: any = 'PROVIDE_ADVISORY';
    if (result.assistantOutput.outputType === 'AUTOMATED_BUILD_PACKAGE') {
      savedType = 'GENERATE_COPY';
    } else if (result.assistantOutput.outputType === 'GENERATED_CODEBASE') {
      savedType = 'GENERATE_CODE';
    }

    const project: SavedProject = {
      id: Date.now().toString(),
      name: currentProjectName || 'Untitled Project',
      date: new Date().toLocaleDateString(),
      data: result,
      type: savedType
    };
    
    saveProjectToStorage(project);
    alert('Project saved successfully!');
  };

  const handleDownload = () => {
    if (!result) return;
    downloadProjectZip(result, currentProjectName || 'Venture_Build');
  };

  const handleLoad = (project: SavedProject) => {
    setResult(project.data);
    setCurrentProjectName(project.name);
  };

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setCurrentProjectName(data.projectName);
    try {
      const response = await generateVentureBuild(data);
      setResult(response);
      
      // Auto-save logic could go here, but let's stick to manual save for now to avoid clutter
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating the build.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setCurrentProjectName('');
  };

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50">
        <OutputDisplay 
          data={result} 
          onReset={handleReset} 
          onSave={handleSave}
          onDownload={handleDownload}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
               <Layers className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Venture<span className="text-indigo-600">Build</span> AI</span>
          </div>
          <div className="text-xs font-medium bg-slate-100 text-slate-500 px-3 py-1 rounded-full border border-slate-200">
            v1.3.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 animate-slide-up">
            Turn your concept into a <span className="text-indigo-600">launch-ready asset</span>.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto animate-slide-up-delay-1">
            Our AI Venture Builder analyzes your brief and preferred template to deliver specialized copy, strategic branding, and deployment-ready codebases in seconds.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3 animate-scale-in">
             <div className="w-2 h-2 rounded-full bg-red-500"></div>
             {error}
          </div>
        )}
        
        <div className="animate-slide-up-delay-2">
           <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Saved Projects List */}
        {savedProjects.length > 0 && (
          <div className="mt-12 animate-slide-up-delay-2">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-indigo-500" />
              Saved Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedProjects.map((project) => {
                const isBuild = project.type === 'GENERATE_REPLICA' || project.type === 'GENERATE_CODE';
                return (
                  <div 
                    key={project.id} 
                    onClick={() => handleLoad(project)}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 hover-lift transition cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isBuild ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {isBuild ? <Zap className="w-5 h-5" /> : <Box className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">{project.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="w-3 h-3" />
                          {project.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => deleteProject(project.id, e)}
                        className="p-2 text-slate-300 hover:text-red-500 transition rounded-full hover:bg-red-50"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400 transition" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Features Grid */}
        {savedProjects.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center animate-slide-up-delay-2">
            <div className="p-4 hover-lift">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Instant Copywriting</h3>
              <p className="text-sm text-slate-500">Benefit-driven headers, descriptions, and CTAs tailored to your brand voice.</p>
            </div>
            <div className="p-4 hover-lift">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Box className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Tech Stack Advisory</h3>
              <p className="text-sm text-slate-500">Custom recommendations for analytics, CRMs, and payment gateways.</p>
            </div>
            <div className="p-4 hover-lift">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Template Optimized</h3>
              <p className="text-sm text-slate-500">Output specifically structured for immediate implementation in Framer, Webflow, or Wix.</p>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Venture Build AI. Built with React & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
