import React, { useState } from 'react';
import { generateVentureBuild } from './services/geminiService';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import { FormData, ApiResponse } from './types';
import { Box, Layers, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await generateVentureBuild(data);
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating the build.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50">
        <OutputDisplay data={result} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
               <Layers className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Venture<span className="text-indigo-600">Build</span> AI</span>
          </div>
          <div className="text-xs font-medium bg-slate-100 text-slate-500 px-3 py-1 rounded-full border border-slate-200">
            v1.0.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Turn your concept into a <span className="text-indigo-600">launch-ready asset</span>.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our AI Venture Builder analyzes your brief and Framer template to deliver specialized copy, branding strategies, and tech blueprints in seconds.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-500"></div>
             {error}
          </div>
        )}
        
        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center">
          <div className="p-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Instant Copywriting</h3>
            <p className="text-sm text-slate-500">Benefit-driven headers, descriptions, and CTAs tailored to your brand voice.</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Tech Stack Advisory</h3>
            <p className="text-sm text-slate-500">Custom recommendations for analytics, CRMs, and payment gateways.</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Framer Optimized</h3>
            <p className="text-sm text-slate-500">Output specifically structured for immediate implementation in Framer.</p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Venture Build AI. Built with React & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
