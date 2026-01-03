
import React, { useState, useEffect } from 'react';
import { 
  Rocket, Layers, Code2, ArrowRight, ShieldCheck, Play, 
  Github, CheckCircle, Terminal, ChevronDown, 
  Zap, Globe, Cpu, MessageSquare, Star, Sparkles, Target
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#020112] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">
      
      {/* --- ELITE BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         {/* Animated Neon Blobs */}
         <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse duration-[10000ms]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-700/10 rounded-full blur-[180px] animate-pulse duration-[12000ms]" style={{animationDelay: '3s'}}></div>
         <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[140px]"></div>
         
         {/* Grid with Radial Gradient Mask */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_20%,#000_60%,transparent_100%)]"></div>
         
         {/* Noise Texture Layer */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
      </div>

      {/* --- DYNAMIC NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-1000 border-b ${scrollY > 50 ? 'bg-[#020112]/70 backdrop-blur-3xl border-white/10 py-3 shadow-2xl' : 'bg-transparent border-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-1000"></div>
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-2.5 rounded-2xl relative z-10 border border-white/20 shadow-2xl transform group-hover:rotate-12 transition-transform duration-700">
                    <Layers className="w-5 h-5 text-white" />
                </div>
            </div>
            <span className="font-bold text-2xl tracking-tighter text-white/90 group-hover:text-white transition-all duration-500">Venture<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-black italic">Build</span></span>
          </div>
          
          <div className="flex items-center gap-12">
            <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
               <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-white transition-colors relative group py-2">
                 Engine
                 <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
               </a>
               <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-white transition-colors relative group py-2">
                 Assets
                 <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
               </a>
               <a href="#testimonials" onClick={(e) => scrollToSection(e, 'testimonials')} className="hover:text-white transition-colors relative group py-2">
                 Proof
                 <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full"></span>
               </a>
            </div>
            
            <div className="flex items-center gap-6">
                <button 
                  onClick={onGetStarted}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors hidden sm:block"
                >
                  Log In
                </button>
                <button 
                  onClick={onGetStarted}
                  className="group relative px-8 py-3.5 rounded-2xl bg-white text-slate-950 font-black text-[11px] uppercase tracking-[0.2em] overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1 active:translate-y-0"
                >
                  <span className="relative z-10 flex items-center gap-3">Build Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" /></span>
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- CINEMATIC HERO --- */}
      <section className="relative pt-64 pb-40 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 text-center relative">
          
          {/* Neon Floating Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-3xl text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] mb-12 animate-fade-in shadow-[0_0_40px_rgba(79,70,229,0.2)] hover:border-indigo-500/40 transition-all cursor-default">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Gemini-Powered Venture Engine
          </div>
          
          <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter mb-12 leading-[0.85] animate-slide-up">
            Ship your <br className="hidden md:block" />
            <span className="relative inline-block mt-4">
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 to-purple-600/40 blur-[100px] transform -skew-x-12 animate-pulse"></span>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-slate-500 relative z-10">Vision. Fast.</span>
            </span>
          </h1>
          
          <p className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto mb-20 leading-relaxed animate-slide-up-delay-1 font-medium tracking-tight">
            Stop coding boilerplate. Launch full-stack codebases, high-conversion copy, and strategic branding in <span className="text-white border-b-2 border-indigo-500/50 shadow-[0_4px_20px_rgba(79,70,229,0.3)] px-2">under 60 seconds</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-slide-up-delay-2">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto relative group overflow-hidden bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.25em] px-12 py-6 rounded-[2rem] transition-all shadow-[0_20px_60px_-10px_rgba(79,70,229,0.6)] hover:shadow-[0_30px_80px_-10px_rgba(79,70,229,0.8)] hover:-translate-y-2 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-700 group-hover:scale-110 transition-transform duration-1000"></div>
              <span className="relative flex items-center justify-center gap-4">Start New Project <Rocket className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" /></span>
            </button>
            <button 
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="w-full sm:w-auto glass-panel bg-white/5 backdrop-blur-[60px] hover:bg-white/10 text-white border border-white/10 font-black text-xs uppercase tracking-[0.25em] px-12 py-6 rounded-[2rem] transition-all flex items-center justify-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:scale-110 transition-all">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              Watch Engine
            </button>
          </div>
        </div>
      </section>

      {/* --- GLASS TERMINAL PREVIEW --- */}
      <section className="py-24 relative z-10 scroll-mt-32" id="how-it-works">
        <div className="max-w-6xl mx-auto px-6">
            <div className="relative rounded-[3rem] border border-white/10 bg-[#0A0A1F]/30 backdrop-blur-[100px] shadow-[0_0_120px_-20px_rgba(79,70,229,0.4)] overflow-hidden animate-slide-up-delay-2 group hover:border-indigo-500/20 transition-all duration-1000">
                {/* Custom Scrollbar Reveal Overlay */}
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent"></div>
                
                {/* Header Bar */}
                <div className="bg-white/5 px-10 py-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex gap-3">
                        <div className="w-4 h-4 rounded-full bg-red-500/20 border border-red-500/10"></div>
                        <div className="w-4 h-4 rounded-full bg-yellow-500/20 border border-yellow-500/10"></div>
                        <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/10"></div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/5 px-5 py-2 rounded-2xl border border-white/10">
                        <Terminal className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">venture-engine.config</span>
                    </div>
                    <div className="w-12"></div>
                </div>

                <div className="grid md:grid-cols-5">
                    {/* Syntax Code Editor */}
                    <div className="md:col-span-3 p-12 font-mono text-[13px] leading-[2] border-r border-white/10 bg-black/10">
                        <div className="space-y-4">
                            <div className="flex gap-6">
                                <span className="text-slate-700 select-none">01</span>
                                <p><span className="text-purple-400">import</span> {'{ VentureEngine }'} <span className="text-purple-400">from</span> <span className="text-indigo-400">"@google/genai"</span></p>
                            </div>
                            <div className="flex gap-6">
                                <span className="text-slate-700 select-none">02</span>
                                <p><span className="text-slate-500">// Initialize strategic architecture</span></p>
                            </div>
                            <div className="flex gap-6">
                                <span className="text-slate-700 select-none">03</span>
                                <p><span className="text-indigo-500">const</span> startup = <span className="text-purple-400">await</span> engine.build(<span className="text-emerald-400">"SaaS Dashboard"</span>)</p>
                            </div>
                            <div className="flex gap-6">
                                <span className="text-slate-700 select-none">04</span>
                                <p><span className="text-indigo-500">startup</span>.setMoat(<span className="text-emerald-400">"AI-First Automation"</span>)</p>
                            </div>
                            <div className="flex gap-6">
                                <span className="text-slate-700 select-none">05</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-emerald-400 font-bold">● Deployment Ready</span>
                                    <span className="w-2 h-5 bg-indigo-500 animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Side Insight Panel */}
                    <div className="md:col-span-2 p-12 flex flex-col items-center justify-center text-center bg-gradient-to-br from-indigo-600/10 to-transparent relative group">
                        <div className="absolute top-0 left-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-1000">
                           <Cpu className="w-32 h-32" />
                        </div>
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-[0_0_60px_rgba(255,255,255,0.2)] border border-white/20 transform group-hover:scale-110 transition-transform duration-700">
                            <Zap className="w-12 h-12 text-indigo-600" />
                        </div>
                        <h3 className="text-3xl font-black mb-6 tracking-tight">Native Intelligence</h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-[260px] font-medium">
                            Our engine doesn't just write code; it architects business strategy based on live market signals.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- ASSETS & STRATEGY GRID --- */}
      <section className="py-40 relative z-10 scroll-mt-32" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none">The Builder's <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">Arsenal.</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium tracking-tight">High-fidelity output designed for immediate market entry.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <GlassCard 
                icon={Code2} 
                color="indigo" 
                title="Elite Codebase" 
                description="Next.js, Tailwind, and React architectures with clean semantic structures ready for production."
            />
            <GlassCard 
                icon={Sparkles} 
                color="purple" 
                title="Strategic Copy" 
                description="Benefit-first copywriting based on high-conversion psychological sales models and brand voice."
            />
            <GlassCard 
                icon={Target} 
                color="emerald" 
                title="Moat Advisory" 
                description="Deep analysis of your unfair advantage to ensure your venture isn't just another commodity."
            />
          </div>
        </div>
      </section>

      {/* --- SOCIAL PROOF & TESTIMONIALS --- */}
      <section className="py-40 border-t border-white/5 relative overflow-hidden" id="testimonials">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-24 text-center">Launched by <span className="text-indigo-400 underline decoration-indigo-500/20">The Visionaries.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {[
                 { name: "Julian R.", role: "CTO, NexusAI", text: "The architectural patterns provided were senior-grade. It saved our dev team weeks of foundational setup." },
                 { name: "Marc K.", role: "Indie Founder", text: "Finally, an AI that understands 'Sales Psychology'. The generated copy hit 4.5% conversion on day one." },
                 { name: "Sofia T.", role: "Growth Lead", text: "We use VentureBuild for all our landing page prototypes. It has transformed our go-to-market speed." }
               ].map((review, i) => (
                 <div key={i} className="glass-panel p-12 rounded-[3rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-700 group hover:-translate-y-2">
                    <div className="flex gap-2 mb-8 text-indigo-400">
                       {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-slate-300 mb-12 text-lg leading-relaxed italic font-medium">"{review.text}"</p>
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center font-black text-white text-lg shadow-2xl border border-white/10">
                          {review.name.charAt(0)}
                       </div>
                       <div>
                          <div className="font-black text-white text-sm uppercase tracking-[0.2em]">{review.name}</div>
                          <div className="text-[10px] text-indigo-400 uppercase font-black tracking-[0.3em] mt-1">{review.role}</div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- ELITE FOOTER --- */}
      <footer className="py-24 border-t border-white/5 bg-[#01010a] text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-16">
           <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Layers className="w-6 h-6 text-indigo-500 group-hover:text-white transition-all duration-500" />
              <span className="text-slate-300 group-hover:text-white transition-all duration-500 text-lg tracking-tighter normal-case font-bold">VentureBuild <span className="text-indigo-600 italic">AI</span></span>
           </div>
           <div className="flex gap-12">
              <a href="#" className="hover:text-white transition-colors">Strategy</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Network</a>
           </div>
           <p className="opacity-30 tracking-widest">&copy; {new Date().getFullYear()} Venture Build Global.</p>
        </div>
      </footer>
    </div>
  );
};

const GlassCard: React.FC<{ icon: any; title: string; description: string; color: string }> = ({ icon: Icon, title, description, color }) => {
    const colorClasses: Record<string, string> = {
        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    };

    return (
        <div className="glass-panel p-12 rounded-[3rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-1000 hover:-translate-y-4 group">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 border transition-all duration-1000 group-hover:scale-110 shadow-2xl ${colorClasses[color]}`}>
                <Icon className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black mb-6 group-hover:text-white transition-all duration-500 tracking-tight">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium tracking-tight">{description}</p>
        </div>
    );
};

export default LandingPage;
