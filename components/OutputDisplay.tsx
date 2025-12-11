import React from 'react';
import { ApiResponse } from '../types';
import BuildPackageView from './BuildPackageView';
import AdvisoryReportView from './AdvisoryReportView';

interface OutputDisplayProps {
  data: ApiResponse;
  onReset: () => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ data, onReset }) => {
  const { assistantOutput } = data;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-400">Venture Builder Output</h1>
        <button 
          onClick={onReset}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
        >
          Start New Project
        </button>
      </div>

      {assistantOutput.outputType === 'AUTOMATED_BUILD_PACKAGE' && assistantOutput.package && (
        <BuildPackageView data={assistantOutput.package} />
      )}

      {assistantOutput.outputType === 'STRATEGIC_ADVISORY_REPORT' && assistantOutput.report && (
        <AdvisoryReportView data={assistantOutput.report} />
      )}
    </div>
  );
};

export default OutputDisplay;
