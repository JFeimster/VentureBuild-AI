import React, { useState } from 'react';
import { Copy, ExternalLink, Palette, Type, Image as ImageIcon, MessageSquare, Tag, Check, MousePointerClick, Download, Eye, LayoutTemplate } from 'lucide-react';
import { AutomatedBuildPackage } from '../types';
import { generateHtmlSite, generateCss } from '../services/exportService';

interface BuildPackageViewProps {
  data: AutomatedBuildPackage;
  onExport: () => void;
}

const BuildPackageView: React.FC<BuildPackageViewProps> = ({ data, onExport }) => {
  const [activeTab, setActiveTab] = useState<'strategy' | 'preview'>('strategy');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const previewHtml = React.useMemo(() => {
    const css = generateCss(data);
    return generateHtmlSite(data, "Live Preview", css);
  }, [data]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Action */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Automated Build Package Ready</h2>
          <p className="text-indigo-100">Your site replica strategy and assets have been generated.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onExport}
            className="bg-indigo-700/50 hover:bg-indigo-700 text-white border border-white/10 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg whitespace-nowrap backdrop-blur-sm"
          >
            <Download className="w-5 h-5" />
            Download Code
          </button>
          <a 
            href={data.coreProjectFile.framerRemixLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg whitespace-nowrap"
          >
            <ExternalLink className="w-5 h-5" />
            Open Remix Link
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-slate-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('strategy')}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition border-b-2 ${
              activeTab === 'strategy' 
                ? 'text-indigo-600 border-indigo-600' 
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            Strategy & Assets
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-4 px-2 text-sm font-bold flex items-center gap-2 transition border-b-2 ${
              activeTab === 'preview' 
                ? 'text-indigo-600 border-indigo-600' 
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            Live Site Preview
          </button>
        </div>
      </div>

      {activeTab === 'preview' ? (
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800">
          <div className="bg-slate-800 px-4 py-3 flex items-center gap-4 border-b border-slate-700">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="bg-slate-900/50 text-slate-400 text-xs px-4 py-1.5 rounded-md flex-1 text-center font-mono border border-slate-700/50 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              localhost:3000
            </div>
          </div>
          <div className="bg-white w-full h-[800px]">
             <iframe 
                srcDoc={previewHtml}
                className="w-full h-full border-0"
                title="Site Preview"
             />
          </div>
        </div>
      ) : (
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