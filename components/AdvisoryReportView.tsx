import React from 'react';
import { Target, Puzzle, Settings, CheckCircle, Search, Lightbulb } from 'lucide-react';
import { StrategicAdvisoryReport } from '../types';

interface AdvisoryReportViewProps {
  data: StrategicAdvisoryReport;
}

const AdvisoryReportView: React.FC<AdvisoryReportViewProps> = ({ data }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          Strategic Advisory Report
        </h2>
        <p className="text-slate-400 max-w-2xl">
          A comprehensive blueprint to build, optimize, and launch your venture with precision.
        </p>
      </div>

      {/* Content Strategy */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Target className="w-6 h-6 text-indigo-600" />
          Section-by-Section Strategy
        </h3>
        <div className="grid grid-cols-1 gap-6">
          {data.sectionBySectionContentStrategy.map((section, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                <h4 className="text-lg font-bold text-slate-900">{section.sectionName} Section</h4>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full uppercase">Priority</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-slate-500 uppercase mb-1">Purpose & Goal</h5>
                  <p className="text-slate-700">{section.purposeAndGoalAnalysis}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h5 className="text-xs font-bold text-indigo-600 uppercase mb-2">Copywriting Prompt</h5>
                  <ul className="list-disc list-inside space-y-2">
                    {section.personalizedCopywritingPrompts.map((prompt, pIdx) => (
                      <li key={pIdx} className="text-sm text-slate-800 italic">"{prompt}"</li>
                    ))}
                  </ul>
                </div>

                {section.abTestingSuggestions.length > 0 && (
                   <div>
                    <h5 className="text-xs font-bold text-slate-500 uppercase mb-1">A/B Testing Ideas</h5>
                    <ul className="space-y-1">
                      {section.abTestingSuggestions.map((test, tIdx) => (
                        <li key={tIdx} className="text-sm text-slate-600 flex items-start gap-2">
                           <span className="text-indigo-400 text-xs mt-1">●</span> {test}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-indigo-600" />
          Integration Blueprint
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.integrationAndTechStackBlueprint.essentialIntegrations.map((item, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-5 hover:border-indigo-300 transition">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900">{item.tool}</h4>
              </div>
              <p className="text-sm text-slate-600 mb-3">{item.purpose}</p>
              <div className="bg-slate-50 p-3 rounded text-xs text-slate-500 font-mono border border-slate-100">
                 {item.implementationGuidance}
              </div>
            </div>
          ))}
        </div>
      </div>

       {/* Customization Guide */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600" />
          Customization Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div>
             <h4 className="font-bold text-slate-900 mb-2">Visual Tips</h4>
             <p className="text-sm text-slate-600 leading-relaxed">{data.customizationAndBrandingGuide.visualEnhancementTips}</p>
           </div>
           <div>
             <h4 className="font-bold text-slate-900 mb-2">Section Optimization</h4>
             <p className="text-sm text-slate-600 leading-relaxed">{data.customizationAndBrandingGuide.sectionOptimization}</p>
           </div>
           <div>
             <h4 className="font-bold text-slate-900 mb-2">CMS Strategy</h4>
             <p className="text-sm text-slate-600 leading-relaxed">{data.customizationAndBrandingGuide.cmsAdaptationPlan}</p>
           </div>
        </div>
      </div>

      {/* SEO & Launch */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          Pre-Launch Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-slate-300 mb-4 flex items-center gap-2">
               <Search className="w-4 h-4" /> SEO Metadata
            </h4>
            <div className="space-y-4">
              {data.seoAndPreLaunchChecklist.generatedSeoMetatags.map((tag, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/10">
                   <div className="text-xs text-indigo-300 uppercase font-bold mb-1">{tag.page}</div>
                   <div className="font-medium text-white mb-1 truncate">{tag.metaTitle}</div>
                   <div className="text-xs text-slate-400">{tag.metaDescription}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-300 mb-4">Technical Go-Live</h4>
            <ul className="space-y-3">
              {data.seoAndPreLaunchChecklist.technicalGoLiveChecklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <div className="mt-0.5 w-4 h-4 rounded-full border border-green-500 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdvisoryReportView;
