
import React, { useState } from 'react';
import { 
  Plus, Trash2, Rocket, Sparkles, Wand2, Loader2, AlertCircle, 
  DollarSign, CreditCard, Zap, ChevronRight, ChevronLeft,
  Target, Users, ShieldCheck, Search, Lightbulb, Briefcase,
  Monitor, Code, Palette, MousePointer2
} from 'lucide-react';
import { FormData, TechStack, ProjectTheme, MonetizationType, SubscriptionType, BillingCycle, OutputType } from '../types';
import { generateProjectBrief, improveCoreConcept } from '../services/geminiService';

interface InputFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [isImprovingField, setIsImprovingField] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    brandName: '',
    brandVoice: 'Professional & Authoritative',
    problemStatement: '',
    coreConcept: '',
    targetAudience: '',
    unfairAdvantage: '',
    competitors: '',
    keyFeatures: ['Automated workflow integration'],
    primaryCTA: 'Start Free Trial',
    templateUrl: '',
    techStack: 'STATIC_WEBSITE',
    theme: 'AGENCY',
    goal: 'GENERATE_CODE',
    monetization: 'FREE',
    subscriptionType: 'SINGLE',
    price: '0',
    tierPrices: { starter: '29', pro: '79', expert: '199' },
    billingCycle: 'MONTHLY'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImproveField = async (field: keyof FormData, label: string) => {
    const currentValue = formData[field];
    if (typeof currentValue !== 'string' || (!currentValue && !formData.projectName)) return;
    
    setIsImprovingField(field);
    try {
      const polished = await improveCoreConcept(currentValue, formData.projectName, label);
      setFormData(prev => ({ ...prev, [field]: polished }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsImprovingField(null);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSmartFill = async () => {
    setIsAutoFilling(true);
    try {
      const seed = formData.coreConcept || formData.projectName;
      const generatedData = await generateProjectBrief(seed);
      setFormData((prev) => ({ ...prev, ...generatedData }));
    } catch (error: any) {
      console.error("Smart-fill failed", error);
    } finally {
      setIsAutoFilling(false);
    }
  };

  const brandVoices = [
    'Professional & Authoritative', 'Friendly & Approachable', 'Playful & Energetic',
    'Minimalist & Clean', 'Luxury & Exclusive', 'Tech-Forward & Innovative',
    'Snarky & Bold', 'Scientific & Data-Driven'
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-w-3xl mx-auto transform transition-all">
      {/* Header */}
      <div className="bg-slate-950 px-8 py-8 flex justify-between items-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black flex items-center gap-3 tracking-tight">
            <Rocket className="w-8 h-8 text-indigo-400" />
            Venture Blueprint
          </h2>
          <p className="text-slate-400 font-medium mt-1">
            Phase {step}: {
              step === 1 ? 'Identity' : step === 2 ? 'Strategy & Moat' : step === 3 ? 'Economics' : 'Final Build'
            }
          </p>
        </div>
        <button
          type="button"
          onClick={handleSmartFill}
          disabled={isAutoFilling}
          className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold py-2.5 px-5 rounded-xl border border-indigo-500/20 flex items-center gap-2 transition backdrop-blur-md"
        >
          {isAutoFilling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
          AI Smart Fill
        </button>
      </div>

      <div className="p-8">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-10 px-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                step >= i ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-slate-100 text-slate-400'
              }`}>
                {i}
              </div>
              {i < 4 && (
                <div className={`h-1.5 flex-1 mx-3 rounded-full transition-all duration-700 ${step > i ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (step === 4) onSubmit(formData); else nextStep(); }}>
          
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Product Name" name="projectName" value={formData.projectName} onChange={handleInputChange} placeholder="e.g. Clarity AI" required />
                <InputGroup label="Brand Name" name="brandName" value={formData.brandName} onChange={handleInputChange} placeholder="e.g. Clarity" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2.5">Brand Voice</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {brandVoices.slice(0, 8).map(voice => (
                    <button
                      key={voice}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, brandVoice: voice }))}
                      className={`p-3 text-[10px] font-bold rounded-xl border-2 transition text-center leading-tight ${
                        formData.brandVoice === voice ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {voice}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: STRATEGY & MOAT */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <TextAreaGroup label="The Problem" name="problemStatement" value={formData.problemStatement} onChange={handleInputChange} placeholder="Describe the core pain point..." onImprove={() => handleImproveField('problemStatement', 'Problem Statement')} isImproving={isImprovingField === 'problemStatement'} />
              <TextAreaGroup label="The Solution" name="coreConcept" value={formData.coreConcept} onChange={handleInputChange} placeholder="How does your product solve it?" onImprove={() => handleImproveField('coreConcept', 'Core Concept')} isImproving={isImprovingField === 'coreConcept'} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextAreaGroup label="Target Audience" name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} placeholder="Who are you selling to?" onImprove={() => handleImproveField('targetAudience', 'Target Audience')} isImproving={isImprovingField === 'targetAudience'} />
                <TextAreaGroup label="Unfair Advantage" name="unfairAdvantage" value={formData.unfairAdvantage} onChange={handleInputChange} placeholder="Your unique moat..." onImprove={() => handleImproveField('unfairAdvantage', 'Unfair Advantage')} isImproving={isImprovingField === 'unfairAdvantage'} />
              </div>
            </div>
          )}

          {/* STEP 3: ECONOMICS */}
          {step === 3 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'FREE', icon: Zap, color: 'text-yellow-500' },
                  { id: 'FREEMIUM', icon: Sparkles, color: 'text-purple-500' },
                  { id: 'SUBSCRIPTION', icon: CreditCard, color: 'text-indigo-500' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, monetization: opt.id as MonetizationType }))}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      formData.monetization === opt.id ? 'border-indigo-600 bg-indigo-50 shadow-inner' : 'border-slate-100 bg-white opacity-60'
                    }`}
                  >
                    <opt.icon className={`w-8 h-8 ${opt.color} mx-auto mb-2`} />
                    <div className="text-center text-xs font-black uppercase tracking-widest text-slate-900">{opt.id}</div>
                  </button>
                ))}
              </div>

              {formData.monetization === 'SUBSCRIPTION' && (
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-8 animate-in zoom-in-95 duration-300">
                   <div className="flex gap-4">
                    {['SINGLE', 'TIERED'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, subscriptionType: t as SubscriptionType }))}
                        className={`flex-1 py-3 rounded-xl text-xs font-black border-2 transition uppercase tracking-wider ${
                          formData.subscriptionType === t ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        {t === 'SINGLE' ? 'Standard Plan' : 'Tiered Pricing'}
                      </button>
                    ))}
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Price Point</label>
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 outline-none text-xl font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Billing Cycle</label>
                        <select name="billingCycle" value={formData.billingCycle} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white font-bold text-slate-700">
                          {['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ONE-TIME'].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: FINAL BUILD */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Build Goal</label>
                   <select name="goal" value={formData.goal} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white font-medium text-slate-700">
                      <option value="GENERATE_CODE">Complete Application</option>
                      <option value="GENERATE_COPY">Copy & Branding Pack</option>
                      <option value="PROVIDE_ADVISORY">Strategic Advisory</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Theme</label>
                   <select name="theme" value={formData.theme} onChange={handleInputChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white font-medium text-slate-700">
                      <option value="SAAS_DASHBOARD">SaaS Dashboard</option>
                      <option value="AGENCY">Agency Portfolio</option>
                      <option value="MARKETPLACE">Marketplace</option>
                      <option value="AI_TOOL_CATALOG">AI Tool Catalog</option>
                      <option value="FUNNEL_LANDER">Conversion Funnel</option>
                   </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 flex gap-4 pt-8 border-t border-slate-100">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 px-8 py-5 rounded-2xl border-2 border-slate-100 font-black text-slate-500 hover:bg-slate-50 transition uppercase tracking-widest text-xs"
              >
                <ChevronLeft className="w-5 h-5 mr-2" /> Back
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-[2] px-8 py-5 rounded-2xl font-black text-white transition-all shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs ${
                step === 4 ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-300' : 'bg-slate-900 hover:bg-black shadow-slate-300'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : step === 4 ? (
                <>Launch Builder <Rocket className="w-5 h-5" /></>
              ) : (
                <>Next Phase <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputGroup: React.FC<{ label: string; name: string; value: string; onChange: any; placeholder?: string; required?: boolean }> = ({ label, name, value, onChange, placeholder, required }) => (
  <div className="flex flex-col">
    <label className="block text-sm font-bold text-slate-700 mb-2.5">{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition font-medium text-slate-700" placeholder={placeholder} required={required} />
  </div>
);

const TextAreaGroup: React.FC<{ label: string; name: string; value: string; onChange: any; placeholder?: string; onImprove?: () => void; isImproving?: boolean }> = ({ label, name, value, onChange, placeholder, onImprove, isImproving }) => (
  <div>
    <div className="flex justify-between items-end mb-2.5">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      {onImprove && (
        <button type="button" onClick={onImprove} disabled={isImproving} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition uppercase tracking-widest flex items-center gap-1.5">
          {isImproving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} AI Polish
        </button>
      )}
    </div>
    <textarea name={name} value={value} onChange={onChange} rows={3} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition text-sm font-medium text-slate-700 leading-relaxed" placeholder={placeholder} required />
  </div>
);

export default InputForm;
