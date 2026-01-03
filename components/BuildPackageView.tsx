
import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, Palette, Type, Image as ImageIcon, MessageSquare, Tag, Check, MousePointerClick, Download, Eye, LayoutTemplate, Code, FileCode, CheckCircle2, Files, Map, Lightbulb, Target, ShieldCheck, Users, AlertCircle, Sparkles, Wand2 } from 'lucide-react';
import { AutomatedBuildPackage, GeneratedCodebase } from '../types';
import { generateHtmlSite, generateCss } from '../services/exportService';

interface BuildPackageViewProps {
  data?: AutomatedBuildPackage;
  codebase?: GeneratedCodebase;
  onExport: () => void;
}

const BuildPackageView: React.FC<BuildPackageViewProps> = ({ data, codebase, onExport }) => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'preview' | 'code' | 'blueprint'>('preview');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [copiedFile, setCopiedFile] = useState(false);

  useEffect(() => {
    if (codebase && codebase.files.length > 0 && !selectedFile) {
      const mainFile = codebase.files.find(f => f.path === 'index.html' || f.path === 'app/page.tsx');
      setSelectedFile(mainFile ? mainFile.path : codebase.files[0].path);
      setActiveTab(codebase.previewHtml || codebase.files.some(f => f.path.endsWith('.html')) ? 'preview' : 'code');
    } else if (data) {
        setActiveTab('strategy');
    }
  }, [codebase, data]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const previewContent = React.useMemo(() => {
    if (data) {
      const css = generateCss(data);
      return generateHtmlSite(data, "Live Content Preview", css);
    }
    if (!codebase) return "";
    if (codebase.previewHtml) return codebase.previewHtml;

    const indexFile = codebase.files.find(f => f.path === 'index.html');
    if (indexFile) {
      let html = indexFile.content;
      const cssFile = codebase.files.find(f => f.path === 'styles.css' || f.path === 'style.css' || f.path.endsWith('.css'));
      const jsFile = codebase.files.find(f => f.path === 'script.js' || f.path.endsWith('.js'));
      if (cssFile) html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
      if (jsFile) html = html.replace('</body>', `<script>${jsFile.content}</script></body>`);
      return html;
    }
    return "";
  }, [data, codebase]);

  const isCodeMode = !!codebase;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-950 rounded-2xl p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-indigo-400" />
            {isCodeMode ? 'Venture Codebase Ready' : 'Strategic Strategy Package'}
          </h2>
          <p className="text-slate-400 font-medium">
            {isCodeMode 
              ? `${codebase?.techStack.replace('_', ' ')} architecture for ${codebase?.theme.replace('_', ' ')}.` 
              : 'Conversion-driven copy and branding assets assembled.'}
          </p>
        </div>
        <button onClick={onExport} className="relative z-10 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-xl hover:shadow-indigo-500/20">
          <Download className="w-5 h-5" /> Download Zip
        </button>
      </div>

      <div className="flex justify-center border-b border-slate-200">
        <div className="flex gap-10 overflow-x-auto">
          {!isCodeMode && <TabButton active={activeTab === 'strategy'} onClick={() => setActiveTab('strategy')} icon={Target} label="Market Strategy" />}
          {data?.aiCraftedStrategicCopy.landingPageWireframe && (
             <TabButton active={activeTab === 'blueprint'} onClick={() => setActiveTab('blueprint')} icon={LayoutTemplate} label="Venture Blueprint" />
          )}
          {(isCodeMode || data) && <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} icon={Eye} label="Live Preview" />}
          {isCodeMode && <TabButton active={activeTab === 'code'} onClick={() => setActiveTab('code')} icon={Code} label="Source Code" />}
        </div>
      </div>

      {activeTab === 'preview' && (
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 ring-1 ring-white/10">
          <div className="bg-slate-800 px-6 py-4 flex items-center gap-4 border-b border-slate-700">
            <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
            <div className="bg-slate-900/50 text-slate-400 text-xs px-6 py-2 rounded-lg flex-1 text-center font-mono border border-slate-700/50 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> venture-builder-preview.localhost
            </div>
          </div>
          <div className="bg-white w-full h-[850px] relative">
            <iframe srcDoc={previewContent} className="w-full h-full border-0 absolute inset-0" title="Preview" />
          </div>
        </div>
      )}

      {activeTab === 'strategy' && data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><Target className="w-6 h-6 text-indigo-600" /> Venture Foundation</h3>
              <StrategyItem icon={AlertCircle} title="The Problem" content={data.aiCraftedStrategicCopy.strategicProblem || "Focusing on the high-friction points of your target audience."} />
              <StrategyItem icon={Lightbulb} title="Core Solution" content={data.aiCraftedStrategicCopy.valueProposition} />
              <StrategyItem icon={Users} title="Target Persona" content={data.aiCraftedStrategicCopy.targetPersona || "Specific high-value personas identified."} />
              <StrategyItem icon={ShieldCheck} title="Competitive Moat" content={data.aiCraftedStrategicCopy.competitiveMoat || "The unique unfair advantage for your venture."} />
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3"><Palette className="w-6 h-6 text-indigo-600" /> Visual Assets</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {data.preliminaryBrandAssetPack.generatedImages?.map((img, i) => (
                   <div key={i} className="group relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 transition hover:shadow-xl">
                      <img src={img.imageUrl} alt={img.section} className="w-full h-40 object-cover transition duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                         <span className="text-[10px] font-black text-white uppercase tracking-widest">{img.section}</span>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>
          <div className="space-y-8">
             <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3"><MessageSquare className="w-6 h-6 text-indigo-600" /> Conversion Copy</h3>
                <div className="space-y-6">
                   {data.aiCraftedStrategicCopy.featureBenefitDescriptions.map((feat, idx) => (
                     <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:bg-white transition duration-300">
                        <div className="flex items-center gap-3 mb-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div><h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">{feat.featureName}</h4></div>
                        <p className="text-sm text-slate-600 leading-relaxed pl-5">{feat.benefitCopy}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'blueprint' && data?.aiCraftedStrategicCopy.landingPageWireframe && (
        <div className="space-y-12">
            <div className="max-w-3xl">
                <h3 className="text-3xl font-black text-slate-900 mb-4 flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                    Conversion Architecture
                </h3>
                <p className="text-slate-500 text-lg">Your high-fidelity landing page blueprint, architected for psychological conversion and market authority.</p>
            </div>
            
            <div className="space-y-6">
                {data.aiCraftedStrategicCopy.landingPageWireframe.map((section, idx) => (
                    <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition duration-500 group">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-64 bg-slate-50 p-8 border-r border-slate-100 flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-2">Section {idx + 1}</span>
                                    <h4 className="text-xl font-black text-slate-900">{section.sectionName}</h4>
                                </div>
                                <div className="mt-8">
                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Conversion Goal</div>
                                    <div className="text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 leading-relaxed">
                                        {section.goal}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 p-8 md:p-12">
                                <h5 className="text-2xl font-black text-slate-900 mb-4 leading-tight">{section.headline}</h5>
                                <p className="text-slate-600 leading-relaxed text-lg mb-8 max-w-2xl">{section.copy}</p>
                                <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex items-start gap-4">
                                    <ImageIcon className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
                                    <div>
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Visual Directive</span>
                                        <p className="text-sm text-indigo-900 font-medium italic">"{section.visualSuggestion}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {activeTab === 'code' && codebase && (
        <div className="bg-slate-950 rounded-3xl overflow-hidden h-[750px] flex border border-white/5 shadow-2xl">
           <div className="w-72 bg-slate-900/50 border-r border-white/5 p-6 overflow-y-auto">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Files</p>
              {codebase.files.map(f => (
                <button key={f.path} onClick={() => setSelectedFile(f.path)} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition mb-1.5 flex items-center gap-3 ${selectedFile === f.path ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                   <FileCode className="w-3.5 h-3.5" /> <span className="truncate">{f.path}</span>
                </button>
              ))}
           </div>
           <div className="flex-1 flex flex-col bg-[#050510]">
              <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center text-xs text-slate-400 font-mono">
                 <div className="flex items-center gap-3"><Code className="w-4 h-4 text-indigo-400" /> {selectedFile}</div>
                 <button onClick={() => handleCopy(codebase.files.find(f => f.path === selectedFile)?.content || '')} className="hover:text-white flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg transition">
                    <Copy className="w-3.5 h-3.5" /> {copiedFile ? 'Copied!' : 'Copy'}
                 </button>
              </div>
              <div className="flex-1 overflow-auto p-8 font-mono text-sm text-indigo-100/90 leading-relaxed"><pre className="whitespace-pre-wrap">{codebase.files.find(f => f.path === selectedFile)?.content}</pre></div>
           </div>
        </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: any; label: string }> = ({ active, onClick, icon: Icon, label }) => (
  <button onClick={onClick} className={`pb-5 px-3 text-sm font-black flex items-center gap-3 transition-all border-b-4 uppercase tracking-widest ${active ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-700'}`}>
    <Icon className="w-4.5 h-4.5" /> {label}
  </button>
);

const StrategyItem: React.FC<{ icon: any; title: string; content: string }> = ({ icon: Icon, title, content }) => (
  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex gap-5">
    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 flex-shrink-0 shadow-sm"><Icon className="w-6 h-6" /></div>
    <div><h4 className="font-black text-xs text-slate-900 uppercase tracking-widest mb-1.5">{title}</h4><p className="text-sm text-slate-600 leading-relaxed">{content}</p></div>
  </div>
);

export default BuildPackageView;
