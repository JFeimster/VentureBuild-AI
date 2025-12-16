
import React, { useState } from 'react';
import { Plus, Trash2, Rocket, FileText, Sparkles, Wand2, Loader2, AlertCircle, Laptop, Code2, LayoutTemplate, BoxSelect, Palette, PenTool } from 'lucide-react';
import { FormData, TechStack, ProjectTheme } from '../types';
import { generateProjectBrief } from '../services/geminiService';

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillError, setAutoFillError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    coreConcept: '',
    brandName: '',
    brandVoice: 'Professional & Authoritative',
    keyFeatures: ['Core functionality feature'],
    primaryCTA: 'Get Started',
    templateUrl: '',
    techStack: 'STATIC_WEBSITE',
    theme: 'AGENCY',
    goal: 'GENERATE_CODE',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.keyFeatures];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, keyFeatures: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, keyFeatures: [...prev.keyFeatures, ''] }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.keyFeatures.filter((_, i) => i !== index);
    if (newFeatures.length === 0) {
      setFormData((prev) => ({ ...prev, keyFeatures: ['Core functionality feature'] }));
    } else {
      setFormData((prev) => ({ ...prev, keyFeatures: newFeatures }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSmartFill = async () => {
    setIsAutoFilling(true);
    setAutoFillError(null);
    try {
      const seed = formData.coreConcept.trim().length > 3 ? formData.coreConcept : undefined;
      const generatedData = await generateProjectBrief(seed);
      
      setFormData((prev) => ({
        ...prev,
        ...generatedData,
        keyFeatures: generatedData.keyFeatures && generatedData.keyFeatures.length > 0 
          ? generatedData.keyFeatures 
          : ['Core functionality feature'],
        templateUrl: prev.templateUrl,
      }));
    } catch (error: any) {
      console.error("Failed to autofill", error);
      const errorMessage = error.message || "Unknown error occurred";
      setAutoFillError(errorMessage);
    } finally {
      setIsAutoFilling(false);
    }
  };

  const selectTechStack = (stack: TechStack) => {
    setFormData(prev => ({ ...prev, techStack: stack }));
  };

  const themes: { value: ProjectTheme; label: string }[] = [
    { value: 'AGENCY', label: 'Agency' },
    { value: 'SAAS_DASHBOARD', label: 'OS / SaaS / Dashboard' },
    { value: 'MARKETPLACE', label: 'Marketplace / Directory' },
    { value: 'AI_TOOL_CATALOG', label: 'AI Tools & Catalogs' },
    { value: 'FUNNEL_LANDER', label: 'Funnels / Landers' },
    { value: 'CONTENT_MEMBERSHIP', label: 'Content / Membership' },
    { value: 'LINK_IN_BIO', label: 'Link-in-Bio' },
    { value: 'ECOMMERCE', label: 'Ecommerce' },
    { value: 'PORTFOLIO', label: 'Portfolio' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-400" />
            Project Brief
          </h2>
          <p className="text-slate-400 text-sm mt-1">Define your vision for the AI Venture Builder.</p>
        </div>
        <button
          type="button"
          onClick={handleSmartFill}
          disabled={isAutoFilling || isLoading}
          className="text-xs font-medium text-indigo-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-900/50 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title={formData.coreConcept.length > 3 ? "Generate details based on your concept" : "Generate a random startup idea"}
        >
          {isAutoFilling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
          {formData.coreConcept.length > 3 ? 'Smart Complete' : 'Magic Auto-fill'}
        </button>
      </div>

      {autoFillError && (
        <div className="bg-red-50 px-6 py-3 border-b border-red-100 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">
            <strong>Auto-fill failed:</strong> {autoFillError}
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="e.g. Atlas Content"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Brand Name</label>
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="e.g. Atlas"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Core Concept & Value Proposition</label>
          <textarea
            name="coreConcept"
            value={formData.coreConcept}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="Describe what your product does, who it's for, and why it's different..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Brand Voice</label>
            <select
              name="brandVoice"
              value={formData.brandVoice}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
            >
              <option>Professional & Authoritative</option>
              <option>Friendly & Approachable</option>
              <option>Playful & Energetic</option>
              <option>Minimalist & Clean</option>
              <option>Luxury & Exclusive</option>
              <option>Tech-Forward & Innovative</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Primary Call to Action</label>
            <input
              type="text"
              name="primaryCTA"
              value={formData.primaryCTA}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="e.g. Start Free Trial"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Key Features</label>
          <div className="space-y-3">
            {formData.keyFeatures.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder={`Feature ${index + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-2 text-slate-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-2"
            >
              <Plus className="w-4 h-4" /> Add Feature
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-3">Goal & Output Format</label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, goal: 'GENERATE_CODE' }))}
              className={`p-4 rounded-xl border-2 text-left transition relative flex flex-col gap-2 ${
                formData.goal === 'GENERATE_CODE'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Code2 className={`w-5 h-5 ${formData.goal === 'GENERATE_CODE' ? 'text-indigo-600' : 'text-slate-400'}`} />
                Build Application
              </div>
              <p className="text-xs text-slate-600">Generate a launch-ready website, app, or widget.</p>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, goal: 'GENERATE_COPY' }))}
              className={`p-4 rounded-xl border-2 text-left transition relative flex flex-col gap-2 ${
                formData.goal === 'GENERATE_COPY'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <PenTool className={`w-5 h-5 ${formData.goal === 'GENERATE_COPY' ? 'text-indigo-600' : 'text-slate-400'}`} />
                Template Copy
              </div>
              <p className="text-xs text-slate-600">Generate specific copywriting for a template (Wix, Framer, etc.).</p>
            </button>

            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, goal: 'PROVIDE_ADVISORY' }))}
              className={`p-4 rounded-xl border-2 text-left transition relative flex flex-col gap-2 ${
                formData.goal === 'PROVIDE_ADVISORY'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <FileText className={`w-5 h-5 ${formData.goal === 'PROVIDE_ADVISORY' ? 'text-indigo-600' : 'text-slate-400'}`} />
                Strategic Advisory
              </div>
              <p className="text-xs text-slate-600">Get a strategy report, tech stack plan, and checklist.</p>
            </button>
          </div>

          {/* Configuration for Code Generation */}
          {formData.goal === 'GENERATE_CODE' && (
            <div className="animate-in fade-in slide-in-from-top-2 space-y-6">
              
              {/* Theme Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Website Theme & Purpose</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, theme: theme.value }))}
                      className={`p-3 rounded-lg border text-xs font-bold text-left transition flex items-center gap-2 ${
                        formData.theme === theme.value
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                      }`}
                    >
                      <Palette className="w-4 h-4 shrink-0" />
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tech Stack Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tech Stack</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => selectTechStack('STATIC_WEBSITE')}
                    className={`p-3 rounded-lg border text-sm font-medium transition flex flex-col items-center gap-2 text-center ${
                      formData.techStack === 'STATIC_WEBSITE'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                    Static Site
                    <span className="text-[10px] text-indigo-500 font-bold bg-indigo-100 px-1.5 py-0.5 rounded">HOT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectTechStack('NEXT_JS')}
                    className={`p-3 rounded-lg border text-sm font-medium transition flex flex-col items-center gap-2 text-center ${
                      formData.techStack === 'NEXT_JS'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    <Laptop className="w-5 h-5" />
                    Next.js App
                  </button>

                  <button
                    type="button"
                    onClick={() => selectTechStack('EMBED_WIDGET')}
                    className={`p-3 rounded-lg border text-sm font-medium transition flex flex-col items-center gap-2 text-center ${
                      formData.techStack === 'EMBED_WIDGET'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    <BoxSelect className="w-5 h-5" />
                    Embed Widget
                  </button>

                  <button
                    type="button"
                    onClick={() => selectTechStack('TEMPLATE_REPLICA')}
                    className={`p-3 rounded-lg border text-sm font-medium transition flex flex-col items-center gap-2 text-center ${
                      formData.techStack === 'TEMPLATE_REPLICA'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    <LayoutTemplate className="w-5 h-5" />
                    Replica
                  </button>
                </div>

                {/* Conditional Input for Replica */}
                {formData.techStack === 'TEMPLATE_REPLICA' && (
                  <div className="mt-4 animate-in fade-in">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Template URL</label>
                    <input
                      type="url"
                      name="templateUrl"
                      value={formData.templateUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      placeholder="e.g. https://framer.com/..., https://wix.com/..."
                      required={formData.techStack === 'TEMPLATE_REPLICA'}
                    />
                    <p className="text-xs text-slate-500 mt-1">We will generate code trying to mimic this structure.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Configuration for Template Copywriting */}
          {formData.goal === 'GENERATE_COPY' && (
            <div className="animate-in fade-in slide-in-from-top-2 space-y-6">
               <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                  <h3 className="text-sm font-bold text-indigo-900 mb-1">Template Copywriting Mode</h3>
                  <p className="text-xs text-indigo-700">Provide a link to any template (Framer, Webflow, WordPress, etc.), and we will generate high-converting copy specifically structured for its sections.</p>
               </div>
               
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Template URL</label>
                <input
                  type="url"
                  name="templateUrl"
                  value={formData.templateUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="e.g. https://framer.com/templates/..."
                  required
                />
              </div>
            </div>
          )}

        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 text-lg"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Building...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              Launch Venture Builder
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
