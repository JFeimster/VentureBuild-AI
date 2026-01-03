
import React, { useState } from 'react';
import { ApiResponse } from '../types';
import BuildPackageView from './BuildPackageView';
import AdvisoryReportView from './AdvisoryReportView';
import DeployDialog from './DeployDialog';
import GitHubDialog from './GitHubDialog';
import { Download, Save, RefreshCw, CloudUpload, Github, AlertCircle } from 'lucide-react';

interface OutputDisplayProps {
  data: ApiResponse;
  projectName: string;
  onReset: () => void;
  onSave: () => void;
  onDownload: () => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ data, projectName, onReset, onSave, onDownload }) => {
  // Defensive check: ensure data and assistantOutput exist to prevent crashes
  const assistantOutput = data?.assistantOutput;
  
  const [isDeployDialogOpen, setIsDeployDialogOpen] = useState(false);
  const [isGitHubDialogOpen, setIsGitHubDialogOpen] = useState(false);

  // Helper to ensure we have a fallback name if projectName is empty
  const safeProjectName = projectName || "venture-build-project";

  if (!assistantOutput) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-4">Strategic Data Missing</h2>
        <p className="text-slate-500 mb-10 max-w-md mx-auto">The neural engine returned a malformed response. Please try refining your brief and generating again.</p>
        <button onClick={onReset} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto">
          <RefreshCw className="w-5 h-5" /> Back to Builder
        </button>
      </div>
    );
  }

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
            onClick={() => setIsGitHubDialogOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 border border-slate-900 rounded-lg text-sm font-bold text-white hover:bg-slate-700 transition shadow-sm"
          >
            <Github className="w-4 h-4" />
            Push
          </button>
          
          <button 
            onClick={() => setIsDeployDialogOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-black border border-black rounded-lg text-sm font-bold text-white hover:bg-slate-800 transition shadow-sm"
          >
            <CloudUpload className="w-4 h-4" />
            Deploy
          </button>

          <button 
            onClick={onDownload}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-bold text-white hover:bg-indigo-700 transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export
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

      <DeployDialog 
        isOpen={isDeployDialogOpen} 
        onClose={() => setIsDeployDialogOpen(false)} 
        data={data}
        projectName={safeProjectName}
      />

      <GitHubDialog 
        isOpen={isGitHubDialogOpen} 
        onClose={() => setIsGitHubDialogOpen(false)} 
        data={data}
        projectName={safeProjectName}
      />
    </div>
  );
};

export default OutputDisplay;
