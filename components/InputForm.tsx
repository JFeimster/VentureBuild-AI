import React, { useState } from 'react';
import { Plus, Trash2, Rocket, FileText, Sparkles, Wand2 } from 'lucide-react';
import { FormData } from '../types';

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    coreConcept: '',
    brandName: '',
    brandVoice: 'Professional & Authoritative',
    keyFeatures: ['Core functionality feature'],
    primaryCTA: 'Get Started',
    framerTemplateUrl: '',
    goal: 'GENERATE_REPLICA',
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

  const handleAutoFill = () => {
    setFormData({
      projectName: 'Lumina Health',
      coreConcept: 'An AI-powered mental wellness platform that provides personalized daily affirmations, mood tracking, and guided meditations tailored to your emotional state.',
      brandName: 'Lumina',
      brandVoice: 'Friendly & Approachable',
      keyFeatures: ['Daily Mood Check-ins', 'AI-Generated Meditations', 'Progress Analytics'],
      primaryCTA: 'Start Your Journey',
      framerTemplateUrl: 'https://framer.com/templates/focus',
      goal: 'GENERATE_REPLICA',
    });
  };

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
          onClick={handleAutoFill}
          className="text-xs font-medium text-indigo-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-900/50 hover:bg-white/10 transition"
        >
          <Wand2 className="w-3.5 h-3.5" />
          Auto-fill Example
        </button>
      </div>
      
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

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Framer Template URL</label>
          <input
            type="url"
            name="framerTemplateUrl"
            value={formData.framerTemplateUrl}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="https://framer.com/templates/..."
            required
          />
        </div>

        <div className="pt-4 border-t border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-3">Assistant Goal</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, goal: 'GENERATE_REPLICA' }))}
              className={`p-4 rounded-xl border-2 text-left transition relative flex flex-col gap-2 ${
                formData.goal === 'GENERATE_REPLICA'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Sparkles className={`w-5 h-5 ${formData.goal === 'GENERATE_REPLICA' ? 'text-indigo-600' : 'text-slate-400'}`} />
                Generate Site Replica
              </div>
              <p className="text-sm text-slate-600">Get a fully populated build package with strategic copy and assets.</p>
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
                Strategic Advisory Report
              </div>
              <p className="text-sm text-slate-600">Get a deep-dive strategy, tech stack blueprint, and launch checklist.</p>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 text-lg"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing Brief...
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