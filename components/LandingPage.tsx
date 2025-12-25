
import React, { useState, useEffect } from 'react';
import { 
  Rocket, Layers, Code2, ArrowRight, ShieldCheck, Play, 
  Github, CheckCircle, Terminal, ChevronDown, 
  Zap, Globe, Cpu, MessageSquare, Star, Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [scrollY, setScrollY] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">
      
      {/* --- PREMIUM BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Deep Glows */}
         <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse duration-[8000ms]"></div>
         <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] bg-purple-700/15 rounded-full blur-[160px] animate-pulse duration-[10000ms]" style={{animationDelay: '2s'}}></div>
         <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px]"></div>
         
         {/* Grid with Radial Mask */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
         
         {/* Moving Particles Placeholder (CSS only) */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 border-b ${scrollY > 20 ? 'bg-[#030014]/60 backdrop-blur-2xl border-white/10 py-3 shadow-2xl' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={scrollToTop}>
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-0 group-hover:opacity-40 transition duration-700"></div>
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-2xl relative z-10 border border-white/20 shadow-xl transform group-hover:rotate-12 transition-transform duration-500">
                    <Layers className="w-5 h-5 text-white" />
                </div>
            </div>
            <span className="font-bold text-2xl tracking-tighter text-white/90 group-hover:text-white transition-colors">Venture<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-black">Build</span></span>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="hidden lg:flex items-center gap-10 text-xs font-black uppercase tracking-[0.15em] text-slate-400">
               <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-white transition-colors relative group py-1">Process</a>
               <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-white transition-colors relative group py-1">Features</a>
               <a href="#testimonials" onClick={(e) => scrollToSection(e, 'testimonials')} className="hover:text-white transition-colors relative group py-1">Social Proof</a>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                  onClick={onGetStarted}
                  className="text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white transition-colors hidden sm:block"
                >
                  Log In
                </button>
                <button 
                  onClick={onGetStarted}
                  className="group relative px-6 py-3 rounded-2xl bg-white text-slate-950 font-black text-xs uppercase tracking-widest overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="relative z-10 flex items-center gap-2">Build Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-56 pb-32 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 text-center relative">
          
          {/* Neon Chip */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-fade-in shadow-2xl hover:border-indigo-500/30 transition-colors">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            AI Venture Partner v2.5
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.9] animate-slide-up">
            Architect your <br className="hidden md:block" />
            <span className="relative inline-block mt-4">
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-[60px] transform -skew-x-12"></span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-400 relative z-10">Dream Venture.</span>
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed animate-slide-up-delay-1 font-medium">
            Deploy full-stack codebases, conversion-optimized copy, <br className="hidden sm:block"/> and strategic branding in <span className="text-white border-b-2 border-indigo-500/50">under 60 seconds</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up-delay-2">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto relative group overflow-hidden bg-indigo-600 text-white font-black text-sm uppercase tracking-widest px-10 py-5 rounded-2xl transition-all shadow-[0_20px_50px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_30px_70px_-10px_rgba(79,70,229,0.7)] hover:-translate-y-1.5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 group-hover:scale-110 transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-3">Create Project <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>
            </button>
            <button 
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="w-full sm:w-auto glass-panel bg-white/5 backdrop-blur-3xl hover:bg-white/10 text-white border border-white/10 font-black text-sm uppercase tracking-widest px-10 py-5 rounded-2xl transition-all flex items-center justify-center gap-3 group"
            >
              <Play className="w-4 h-4 fill-current group-hover:scale-125 transition-transform" />
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* --- GLASS CODE PREVIEW --- */}
      <section className="py-24 relative z-10 scroll-mt-32" id="how-it-works">
        <div className="max-w-6xl mx-auto px-6">
            <div className="relative rounded-[32px] border border-white/10 bg-[#0A0A1F]/40 backdrop-blur-[40px] shadow-[0_0_100px_-20px_rgba(79,70,229,0.3)] overflow-hidden animate-slide-up-delay-2 group">
                {/* Header Bar */}
                <div className="bg-white/5 px-8 py-5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex gap-2.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-red-500/30"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/30"></div>
                        <div className="w-3.5 h-3.5 rounded-full bg-green-500/30"></div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                        <Terminal className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">venture-builder.ts</span>
                    </div>
                    <div className="w-12"></div>
                </div>

                <div className="grid md:grid-cols-5">
                    {/* Code Editor Mock */}
                    <div className="md:col-span-3 p-10 font-mono text-sm leading-[1.8] border-r border-white/10 bg-black/20">
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <span className="text-slate-600 select-none">01</span>
                                <p><span className="text-purple-400">import</span> {'{ Build }'} <span className="text-purple-400">from</span> <span className="text-emerald-400">"@venture-build/ai"</span></p>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-600 select-none">02</span>
                                <p><span className="text-indigo-400">const</span> project = <span className="text-purple-400">await</span> Build.init(<span className="text-emerald-400">"SaaS Dashboard"</span>)</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-600 select-none">03</span>
                                <p><span className="text-slate-500">// AI analyzing strategy & moat...</span></p>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-600 select-none">04</span>
                                <p><span className="text-indigo-400">project</span>.generateCode({'{'} stack: <span className="text-emerald-400">'Next.js'</span> {'}'})</p>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-slate-600 select-none">05</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-white font-bold">Build Successful</span>
                                    <span className="w-2 h-5 bg-indigo-500 animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Live Preview Side */}
                    <div className="md:col-span-2 p-10 flex flex-col items-center justify-center text-center bg-gradient-to-br from-indigo-600/10 to-transparent">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                            <Rocket className="w-10 h-10 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-black mb-4">Production Core</h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-[220px]">
                            Clean, semantic code architecture that ships to Vercel in one click.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-32 relative z-10 scroll-mt-32" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Hypergrowth</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">Everything you need to move from "Maybe" to "Launched".</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard 
                icon={Code2} 
                color="indigo" 
                title="Full-Stack Repos" 
                description="Tailwind CSS, Next.js, and clean React components ready for your first commit."
            />
            <GlassCard 
                icon={Sparkles} 
                color="emerald" 
                title="Psychological Copy" 
                description="AI-generated headlines and value props rooted in high-conversion sales models."
            />
            <GlassCard 
                icon={Zap} 
                color="purple" 
                title="Direct Deployment" 
                description="Push directly to GitHub or deploy live to Vercel without ever leaving the dashboard."
            />
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-32 border-t border-white/5 relative overflow-hidden" id="testimonials">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-20 text-center">Loved by <span className="text-indigo-400">Founders</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { name: "Sarah J.", role: "CEO, TechFlow", text: "I launched my landing page in 5 minutes. The strategic copy was significantly better than our internal drafts." },
                 { name: "David C.", role: "Indie Hacker", text: "The code quality is surprisingly clean. It's not just a bunch of div tags; it's a real foundation." },
                 { name: "Elena R.", role: "Agency Director", text: "We use this for client prototypes. It has cut our pre-sales mockup time by 90%." }
               ].map((review, i) => (
                 <div key={i} className="glass-panel p-10 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 group">
                    <div className="flex gap-1.5 mb-6 text-indigo-400">
                       {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-slate-300 mb-10 leading-relaxed italic font-medium">"{review.text}"</p>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-black text-white text-sm shadow-xl">
                          {review.name.charAt(0)}
                       </div>
                       <div>
                          <div className="font-black text-white text-sm uppercase tracking-widest">{review.name}</div>
                          <div className="text-[10px] text-indigo-400 uppercase font-black tracking-widest">{review.role}</div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-40 relative overflow-hidden text-center">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/10"></div>
         <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-10">The future of <span className="text-indigo-500">Execution.</span></h2>
            <p className="text-xl text-slate-400 mb-16 max-w-2xl mx-auto font-medium">No more excuses. Build your venture tonight.</p>
            <button 
              onClick={onGetStarted}
              className="bg-white text-indigo-950 font-black text-xl uppercase tracking-widest px-14 py-6 rounded-3xl hover:scale-105 transition-all shadow-[0_0_60px_rgba(255,255,255,0.2)] flex items-center justify-center gap-4 mx-auto group"
            >
              Get Started <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 border-t border-white/5 bg-black/40 backdrop-blur-3xl text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="flex items-center gap-3 cursor-pointer group" onClick={scrollToTop}>
              <Layers className="w-5 h-5 text-indigo-500 group-hover:text-white transition-colors" />
              <span className="text-slate-300 group-hover:text-white transition-colors">VentureBuild AI</span>
           </div>
           <div className="flex gap-10">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
           </div>
           <p className="opacity-40">&copy; {new Date().getFullYear()} Venture Build AI.</p>
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
        <div className="glass-panel p-10 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-700 hover:-translate-y-2 group">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border transition-all duration-700 group-hover:scale-110 ${colorClasses[color]}`}>
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-4 group-hover:text-white transition-colors">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">{description}</p>
        </div>
    );
};

export default LandingPage;
