
import React from 'react';
import { ApiResponse } from '../types';
import BuildPackageView from './BuildPackageView';
import AdvisoryReportView from './AdvisoryReportView';
import { Download, Save, RefreshCw } from 'lucide-react';

interface OutputDisplayProps {
  data: ApiResponse;
  onReset: () => void;
  onSave: () => void;
  onDownload: () => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ data, onReset, onSave, onDownload }) => {
  const { assistantOutput } = data;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-xl font-bold text-slate-400 self-start md:self-center">Venture Builder Output</h1>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
           <button 
            onClick={onSave}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          
          <button 
            onClick={onDownload}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-bold text-white hover:bg-indigo-700 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export Site
          </button>
          
          <button 
            onClick={onReset}
            className="flex-none p-2 text-slate-400 hover:text-indigo-600 transition"
            title="Start New Project"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {assistantOutput.outputType === 'AUTOMATED_BUILD_PACKAGE' && assistantOutput.package && (
        <BuildPackageView data={assistantOutput.package} onExport={onDownload} />
      )}

      {assistantOutput.outputType === 'GENERATED_CODEBASE' && assistantOutput.codebase && (
        <BuildPackageView codebase={assistantOutput.codebase} onExport={onDownload} />
      )}

      {assistantOutput.outputType === 'STRATEGIC_ADVISORY_REPORT' && assistantOutput.report && (
        <AdvisoryReportView data={assistantOutput.report} />
      )}
    </div>
  );
};

export default OutputDisplay;
