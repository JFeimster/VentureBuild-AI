
import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, Palette, Type, Image as ImageIcon, MessageSquare, Tag, Check, MousePointerClick, Download, Eye, LayoutTemplate, Code, FileCode, CheckCircle2, Files, Map, Lightbulb, Target } from 'lucide-react';
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
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);

  // Set initial selected file if codebase exists
  useEffect(() => {
    if (codebase && codebase.files.length > 0 && !selectedFile) {
      // Try to find index.html or page.tsx first
      const mainFile = codebase.files.find(f => f.path === 'index.html' || f.path === 'app/page.tsx');
      setSelectedFile(mainFile ? mainFile.path : codebase.files[0].path);
      
      // Default tab logic
      if (codebase.siteSpec || codebase.wireframe) {
        setActiveTab('blueprint');
      } else if (codebase.previewHtml || codebase.files.some(f => f.path.endsWith('.html'))) {
        setActiveTab('preview');
      } else {
        setActiveTab('code');
      }
    } else if (data) {
        setActiveTab('strategy');
    }
  }, [codebase, data]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleCopyAll = () => {
    if (!codebase) return;
    const allCode = codebase.files.map(f => `// --- File: ${f.path} ---\n${f.content}`).join('\n\n');
    navigator.clipboard.writeText(allCode);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const previewContent = React.useMemo(() => {
    // Case 1: Template Content Data -> Generate HTML preview for the content
    if (data) {
      const css = generateCss(data);
      return generateHtmlSite(data, "Live Content Preview", css);
    }
    // Case 2: Codebase with explicit previewHtml
    if (codebase?.previewHtml) {
      return codebase.previewHtml;
    }
    // Case 3: Codebase with index.html in files
    const indexFile = codebase?.files.find(f => f.path === 'index.html');
    if (indexFile) {
      // In a real app, we'd need to link the CSS/JS blobs. 
      // For this demo, we assume the AI either put CSS in <style> or used CDN.
      // If there is a separated style.css, we try to inject it.
      let html = indexFile.content;
      const cssFile = codebase?.files.find(f => f.path === 'style.css' || f.path === 'styles.css');
      const jsFile = codebase?.files.find(f => f.path === 'script.js' || f.path === 'app.js');
      
      if (cssFile) {
        html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
      }
      if (jsFile) {
        html = html.replace('</body>', `<script>${jsFile.content}</script></body>`);
      }
      return html;
    }
    return "";
  }, [data, codebase]);

  // Determine if we are in Codebase mode or Content Package mode
  const isCodeMode = !!codebase;

  const getDownloadLabel = () => {
    if (data) return "Download Copy & Strategy";
    if (codebase?.techStack === 'NEXT_JS') return "Download Next.js App";
    if (codebase?.techStack === 'EMBED_WIDGET') return "Download Widget";
    return "Download Website";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {isCodeMode ? 'Application Built Successfully' : 'Template Copy Generated'}
          </h2>
          <p className="text-indigo-100">
            {isCodeMode 
              ? `${codebase?.techStack.replace('_', ' ')} generated for ${codebase?.theme.replace('_', ' ')}. Download zip to deploy.` 
              : 'Your strategic copy and assets for the selected template are ready.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onExport}
            className="bg-indigo-700/50 hover:bg-indigo-700 text-white border border-white/10 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg whitespace-nowrap backdrop-blur-sm"
          >
            <Download className="w-5 h-5" />
            {getDownloadLabel()}
          </button>
          {data && data.coreProjectFile.templateLink && (
            <a 
              href={data.coreProjectFile.templateLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg whitespace-nowrap"
            >
              <ExternalLink className="w-5 h-5" />
              Open Template
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-slate-200">
        <div className="flex gap-8 overflow-x-auto">
          {!isCodeMode && (
            <button
              onClick={() => setActiveTab('strategy')}
              className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
                activeTab === 'strategy' 
                  ? 'text-indigo-600 border-indigo-600' 
                  : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              <LayoutTemplate className="w-4 h-4" />
              Strategy & Content
            </button>
          )}

          {isCodeMode && codebase?.wireframe && (
             <button
              onClick={() => setActiveTab('blueprint')}
              className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
                activeTab === 'blueprint' 
                  ? 'text-indigo-600 border-indigo-600' 
                  : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              <Map className="w-4 h-4" />
              Blueprint & Spec
            </button>
          )}
          
          {(isCodeMode || data) && (
             <button
              onClick={() => setActiveTab('preview')}
              className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
                activeTab === 'preview' 
                  ? 'text-indigo-600 border-indigo-600' 
                  : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              <Eye className="w-4 h-4" />
              Live Preview
            </button>
          )}

          {isCodeMode && (
            <button
              onClick={() => setActiveTab('code')}
              className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition border-b-2 whitespace-nowrap ${
                activeTab === 'code' 
                  ? 'text-indigo-600 border-indigo-600' 
                  : 'text-slate-500 border-transparent hover:text-slate-800'
              }`}
            >
              <Code className="w-4 h-4" />
              Code Viewer
            </button>
          )}
        </div>
      </div>

      {/* --- BLUEPRINT TAB --- */}
      {activeTab === 'blueprint' && codebase && codebase.siteSpec && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Site Spec Column */}
          <div className="col-span-1 space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-4 text-indigo-400 font-bold uppercase text-xs tracking-wider">
                <Target className="w-4 h-4" />
                Site Specification
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-white mb-1">Positioning</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{codebase.siteSpec.positioning}</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Target Audience</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{codebase.siteSpec.targetAudience}</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Main Promise</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{codebase.siteSpec.mainPromise}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
              <h3 className="text-indigo-900 font-bold flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5" />
                Theme: {codebase.theme.replace('_', ' ')}
              </h3>
              <p className="text-sm text-indigo-700">
                This structure is optimized for high-conversion B2B and SaaS outcomes, focusing on clarity over creativity.
              </p>
            </div>
          </div>

          {/* Wireframe Column */}
          <div className="col-span-1 lg:col-span-2">
             <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    <Map className="w-5 h-5 text-indigo-500" />
                    Section-by-Section Wireframe
                  </h3>
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded font-mono">
                    {codebase.wireframe?.length || 0} Sections
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {codebase.wireframe?.map((section, idx) => (
                    <div key={idx} className="p-6 hover:bg-slate-50/50 transition">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide block mb-1">Section {idx + 1}: {section.sectionName}</span>
                          <h4 className="font-bold text-slate-900 text-lg leading-tight">{section.headline}</h4>
                        </div>
                        <div className="shrink-0 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded uppercase">
                          {section.purpose}
                        </div>
                      </div>
                      
                      {section.subheadOptions && section.subheadOptions.length > 0 && (
                        <div className="mb-3">
                           <p className="text-sm text-slate-600 italic">"{section.subheadOptions[0]}"</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                         {section.suggestedCTA && (
                           <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                             <MousePointerClick className="w-3 h-3" /> CTA: {section.suggestedCTA}
                           </span>
                         )}
                         {section.bulletPoints && section.bulletPoints.map((bp, bIdx) => (
                            <span key={bIdx} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs border border-slate-200">
                              • {bp}
                            </span>
                         ))}
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- PREVIEW TAB --- */}
      {activeTab === 'preview' && (
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 ring-1 ring-white/10">
          <div className="bg-slate-800 px-4 py-3 flex items-center gap-4 border-b border-slate-700">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition"></div>
            </div>
            <div className="bg-slate-900/50 text-slate-400 text-xs px-4 py-1.5 rounded-md flex-1 text-center font-mono border border-slate-700/50 flex items-center justify-center gap-2 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              localhost:3000
            </div>
          </div>
          <div className="bg-white w-full h-[800px] relative">
            {previewContent ? (
               <iframe 
                  srcDoc={previewContent}
                  className="w-full h-full border-0 absolute inset-0"
                  title="Site Preview"
                  sandbox="allow-scripts allow-popups allow-modals"
               />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                 <Eye className="w-12 h-12 mb-4 opacity-50" />
                 <p>Preview not available for this tech stack.</p>
                 <p className="text-sm mt-2">Please check the Code Viewer.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CODE VIEWER TAB --- */}
      {activeTab === 'code' && codebase && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[700px]">
           {/* File Tree */}
           <div className="col-span-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
              <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-600">
                Explorer
              </div>
              <div className="overflow-y-auto p-2 space-y-1 flex-1">
                 {codebase.files.map((file) => (
                   <button
                    key={file.path}
                    onClick={() => setSelectedFile(file.path)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition ${
                      selectedFile === file.path 
                        ? 'bg-indigo-50 text-indigo-700 font-medium' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                   >
                     <FileCode className="w-4 h-4" />
                     {file.path}
                   </button>
                 ))}
              </div>
           </div>

           {/* Code Editor */}
           <div className="col-span-3 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
              <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                 <span className="text-slate-400 font-mono text-xs">{selectedFile}</span>
                 <div className="flex gap-2">
                   <button 
                      onClick={handleCopyAll}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20"
                   >
                     {copiedAll ? <CheckCircle2 className="w-3 h-3" /> : <Files className="w-3 h-3" />}
                     {copiedAll ? 'Copied All' : 'Copy All'}
                   </button>
                   <button 
                      onClick={() => handleCopy(codebase.files.find(f => f.path === selectedFile)?.content || '')}
                      className="text-xs text-slate-500 hover:text-white flex items-center gap-1"
                   >
                     {copiedFile ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                     {copiedFile ? 'Copied' : 'Copy'}
                   </button>
                 </div>
              </div>
              <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                 <pre className="font-mono text-sm text-indigo-100 leading-relaxed whitespace-pre-wrap">
                   <code>
                     {codebase.files.find(f => f.path === selectedFile)?.content || 'Select a file to view code.'}
                   </code>
                 </pre>
              </div>
           </div>
        </div>
      )}

      {/* --- STRATEGY TAB (Legacy) --- */}
      {activeTab === 'strategy' && data && (
        <>
          {/* Brand Assets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colors */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-500" />
                Curated Palette
              </h3>
              <div className="space-y-3">
                {data.preliminaryBrandAssetPack.curatedColorPalette.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div 
                      className="w-12 h-12 rounded-lg shadow-inner ring-1 ring-slate-100 shrink-0" 
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <div>
                      <p className="font-semibold text-slate-800">{color.role}</p>
                      <p className="text-sm font-mono text-slate-500 group-hover:text-indigo-600 transition cursor-pointer flex items-center gap-1">
                        {color.hex}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fonts */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Type className="w-5 h-5 text-indigo-500" />
                Typography Options
              </h3>
              <div className="flex-1 space-y-4">
                {data.preliminaryBrandAssetPack.fontRecommendations.map((font, idx) => (
                  <div key={idx} className={`rounded-lg border p-4 ${idx === 0 ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Option {idx + 1}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Heading</span>
                        <p className="text-xl font-bold text-slate-900 leading-none">{font.heading}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Body</span>
                        <p className="text-lg text-slate-700 leading-none">{font.body}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 italic border-t border-slate-100 pt-2 mt-2">
                      "{font.justification}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Copy */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
                Strategic Copywriting
              </h3>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="p-6">
                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-2">Value Proposition</h4>
                <p className="text-xl text-slate-800 font-medium leading-relaxed">{data.aiCraftedStrategicCopy.valueProposition}</p>
              </div>

              {/* Calls To Action Section */}
              <div className="p-6">
                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4" />
                  Optimized Calls to Action
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {data.aiCraftedStrategicCopy.callsToAction.map((cta, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg flex flex-col items-center justify-center text-center hover:border-indigo-300 transition group h-full relative overflow-hidden">
                        <div className="absolute top-2 right-2 text-[10px] font-bold text-slate-300 group-hover:text-indigo-300 uppercase tracking-wider">{cta.location}</div>
                        <button className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition transform hover:-translate-y-0.5 w-full">
                          {cta.text}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-4">Pricing Strategy</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.aiCraftedStrategicCopy.pricingTierBreakdown.map((tier, idx) => (
                    <div key={idx} className={`border rounded-lg p-5 transition flex flex-col h-full ${idx === 1 ? 'border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500 relative' : 'border-slate-200 bg-slate-50 hover:border-indigo-300'}`}>
                      {idx === 1 && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Popular</div>}
                      <div className="flex flex-col mb-4">
                        <h5 className="font-bold text-slate-900 text-lg">{tier.tierName}</h5>
                        <span className="text-2xl font-bold text-indigo-600 mt-1">{tier.price}</span>
                      </div>
                      <ul className="space-y-3 flex-1">
                        {tier.features.map((feature, fIdx) => (
                          <li key={fIdx} className="text-sm text-slate-600 flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <span className="leading-tight">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wide mb-4">Feature Benefits</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.aiCraftedStrategicCopy.featureBenefitDescriptions.map((feat, idx) => (
                    <div key={idx}>
                      <h5 className="font-bold text-slate-900 mb-1">{feat.featureName}</h5>
                      <p className="text-slate-600 text-sm">{feat.benefitCopy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Image Briefs */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-500" />
                Image Generation Briefs
              </h3>
              <div className="space-y-4">
                {data.preliminaryBrandAssetPack.imageAndIconBriefs.map((img, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100 group relative">
                    <div className="shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1 pr-8">
                      <h5 className="font-bold text-slate-900 text-sm mb-1">{img.section}</h5>
                      <p className="text-slate-600 italic font-mono text-sm bg-white p-2 rounded border border-slate-100">"{img.brief}"</p>
                    </div>
                    <button 
                      onClick={() => handleCopy(img.brief)}
                      className="absolute top-4 right-4 text-slate-300 hover:text-indigo-600 transition"
                      title="Copy Prompt"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
        </>
      )}
    </div>
  );
};

export default BuildPackageView;
