
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
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-w-3xl mx-auto transform transition-all">
      {/* Header */}
      <div className="bg-slate-950 px-10 py-10 flex justify-between items-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black flex items-center gap-4 tracking-tighter">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-500/30">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            Venture Blueprint
          </h2>
          <p className="text-slate-300 font-bold mt-2 uppercase text-[10px] tracking-[0.2em] px-1">
            Phase {step}: {
              step === 1 ? 'Identity' : step === 2 ? 'Strategy & Moat' : step === 3 ? 'Economics' : 'Final Build'
            }
          </p>
        </div>
        <button
          type="button"
          onClick={handleSmartFill}
          disabled={isAutoFilling}
          className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest py-3 px-6 rounded-2xl border border-white/20 flex items-center gap-2 transition-all backdrop-blur-md active:scale-95"
        >
          {isAutoFilling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          Smart Fill
        </button>
      </div>

      <div className="p-10">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-12 px-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-700 transform ${
                step >= i ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-slate-100 text-slate-400'
              }`}>
                {i}
              </div>
              {i < 4 && (
                <div className={`h-1 flex-1 mx-4 rounded-full transition-all duration-1000 ${step > i ? 'bg-indigo-600' : 'bg-slate-100'}`}></div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (step === 4) onSubmit(formData); else nextStep(); }}>
          
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Product Name" name="projectName" value={formData.projectName} onChange={handleInputChange} placeholder="e.g. Clarity AI" required />
                <InputGroup label="Brand Name" name="brandName" value={formData.brandName} onChange={handleInputChange} placeholder="e.g. Clarity" required />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Select Brand Voice</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {brandVoices.map(voice => (
                    <button
                      key={voice}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, brandVoice: voice }))}
                      className={`p-4 text-[10px] font-black rounded-2xl border-2 transition-all text-center leading-tight uppercase tracking-wider ${
                        formData.brandVoice === voice ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md transform -translate-y-1' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-white'
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
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <TextAreaGroup label="The Problem" name="problemStatement" value={formData.problemStatement} onChange={handleInputChange} placeholder="Describe the core pain point..." onImprove={() => handleImproveField('problemStatement', 'Problem Statement')} isImproving={isImprovingField === 'problemStatement'} />
              <TextAreaGroup label="The Solution" name="coreConcept" value={formData.coreConcept} onChange={handleInputChange} placeholder="How does your product solve it?" onImprove={() => handleImproveField('coreConcept', 'Core Concept')} isImproving={isImprovingField === 'coreConcept'} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <TextAreaGroup label="Target Audience" name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} placeholder="Who are you selling to?" onImprove={() => handleImproveField('targetAudience', 'Target Audience')} isImproving={isImprovingField === 'targetAudience'} />
                <TextAreaGroup label="Unfair Advantage" name="unfairAdvantage" value={formData.unfairAdvantage} onChange={handleInputChange} placeholder="Your unique moat..." onImprove={() => handleImproveField('unfairAdvantage', 'Unfair Advantage')} isImproving={isImprovingField === 'unfairAdvantage'} />
              </div>
            </div>
          )}

          {/* STEP 3: ECONOMICS */}
          {step === 3 && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { id: 'FREE', icon: Zap, color: 'text-yellow-500', desc: 'Acquisition First' },
                  { id: 'FREEMIUM', icon: Sparkles, color: 'text-purple-500', desc: 'Scale Ready' },
                  { id: 'SUBSCRIPTION', icon: CreditCard, color: 'text-indigo-500', desc: 'Revenue First' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, monetization: opt.id as MonetizationType }))}
                    className={`p-8 rounded-[2rem] border-2 transition-all group flex flex-col items-center justify-center gap-2 ${
                      formData.monetization === opt.id ? 'border-indigo-600 bg-indigo-50 shadow-xl transform -translate-y-1' : 'border-slate-100 bg-slate-50 opacity-60 hover:opacity-100 hover:border-slate-200'
                    }`}
                  >
                    <opt.icon className={`w-10 h-10 ${opt.color} mb-2 transition-transform group-hover:scale-110`} />
                    <div className="text-center text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none">{opt.id}</div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>

              {formData.monetization === 'SUBSCRIPTION' && (
                <div className="bg-indigo-50/30 p-10 rounded-[2.5rem] border border-indigo-100/50 space-y-8 animate-in zoom-in-95 duration-300">
                   <div className="flex gap-4">
                    {['SINGLE', 'TIERED'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, subscriptionType: t as SubscriptionType }))}
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black border-2 transition-all uppercase tracking-widest ${
                          formData.subscriptionType === t ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        {t === 'SINGLE' ? 'Standard Plan' : 'Tiered Pricing'}
                      </button>
                    ))}
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Price Point ($)</label>
                        <input 
                          type="number" 
                          name="price" 
                          value={formData.price} 
                          onChange={handleInputChange} 
                          className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 bg-white focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none text-2xl font-black text-slate-900 transition-all shadow-inner" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 px-1">Billing Cycle</label>
                        <select 
                          name="billingCycle" 
                          value={formData.billingCycle} 
                          onChange={handleInputChange} 
                          className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 bg-white font-black text-slate-700 uppercase tracking-widest text-xs outline-none focus:border-indigo-500 transition-all cursor-pointer"
                        >
                          {['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ONE-TIME'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: FINAL BUILD */}
          {step === 4 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Build Goal</label>
                   <select 
                     name="goal" 
                     value={formData.goal} 
                     onChange={handleInputChange} 
                     className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 bg-white font-black text-slate-700 text-xs uppercase tracking-widest outline-none focus:border-indigo-500 transition-all cursor-pointer"
                   >
                      <option value="GENERATE_CODE">Complete Application</option>
                      <option value="GENERATE_COPY">Copy & Branding Pack</option>
                      <option value="PROVIDE_ADVISORY">Strategic Advisory</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Project Theme</label>
                   <select 
                     name="theme" 
                     value={formData.theme} 
                     onChange={handleInputChange} 
                     className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 bg-white font-black text-slate-700 text-xs uppercase tracking-widest outline-none focus:border-indigo-500 transition-all cursor-pointer"
                   >
                      <option value="SAAS_DASHBOARD">SaaS Dashboard</option>
                      <option value="AGENCY">Agency Portfolio</option>
                      <option value="MARKETPLACE">Product Marketplace</option>
                      <option value="AI_TOOL_CATALOG">AI Tool Catalog</option>
                      <option value="FUNNEL_LANDER">Conversion Funnel</option>
                      <option value="CONTENT_MEMBERSHIP">Content & Membership</option>
                      <option value="LINK_IN_BIO">Link-in-Bio Card</option>
                      <option value="ECOMMERCE">E-Commerce Store</option>
                      <option value="PORTFOLIO">Personal Portfolio</option>
                   </select>
                </div>
                <div className="md:col-span-2">
                   <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Tech Stack</label>
                   <select 
                     name="techStack" 
                     value={formData.techStack} 
                     onChange={handleInputChange} 
                     className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 bg-white font-black text-slate-700 text-xs uppercase tracking-widest outline-none focus:border-indigo-500 transition-all cursor-pointer"
                   >
                      <option value="STATIC_WEBSITE">Static HTML / CSS / JS</option>
                      <option value="NEXT_JS">Next.js (React & Tailwind)</option>
                      <option value="EMBED_WIDGET">Self-Contained Embed Widget</option>
                   </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-16 flex gap-4 pt-10 border-t border-slate-100">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 px-8 py-5 rounded-[1.5rem] border-2 border-slate-200 font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-[0.2em] text-[10px] active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 mr-2 inline-block" /> Back
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-[2] px-8 py-5 rounded-[1.5rem] font-black text-white transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[10px] active:scale-95 ${
                step === 4 ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-300' : 'bg-slate-950 hover:bg-black shadow-slate-300'
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
    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">{label}</label>
    <input 
      type="text" 
      name={name} 
      value={value} 
      onChange={onChange} 
      className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 bg-white focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 shadow-inner placeholder:text-slate-300" 
      placeholder={placeholder} 
      required={required} 
    />
  </div>
);

const TextAreaGroup: React.FC<{ label: string; name: string; value: string; onChange: any; placeholder?: string; onImprove?: () => void; isImproving?: boolean }> = ({ label, name, value, onChange, placeholder, onImprove, isImproving }) => (
  <div>
    <div className="flex justify-between items-end mb-3 px-1">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
      {onImprove && (
        <button type="button" onClick={onImprove} disabled={isImproving} className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all uppercase tracking-widest flex items-center gap-2 active:scale-95">
          {isImproving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} AI Polish
        </button>
      )}
    </div>
    <textarea 
      name={name} 
      value={value} 
      onChange={onChange} 
      rows={3} 
      className="w-full px-6 py-5 rounded-[1.8rem] border-2 border-slate-200 bg-white focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-900 leading-relaxed shadow-inner placeholder:text-slate-300" 
      placeholder={placeholder} 
      required 
    />
  </div>
);

export default InputForm;
