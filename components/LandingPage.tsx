
import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, Layers, Code2, ArrowRight, ShieldCheck, Play, 
  Github, CheckCircle, Terminal, ChevronDown, 
  Zap, Globe, Cpu, MessageSquare, Star, Sparkles, Target,
  Layout, MousePointer2, Briefcase, BarChart4, Box, Search,
  Plus, Minus, HelpCircle
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [scrollY, setScrollY] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Intersection Observer for Scroll Reveals
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // For staggered effects if data attributes exist
          const stagger = entry.target.getAttribute('data-stagger');
          if (stagger) {
            (entry.target as HTMLElement).style.transitionDelay = `${stagger}ms`;
          }
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
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

  const faqs = [
    { 
      q: "Is the generated code really production ready?", 
      a: "Absolutely. We generate senior-grade Next.js or HTML code using standardized Tailwind CSS utility patterns. The output is clean, semantic, and adheres to accessibility standards, making it ready for immediate deployment to Vercel, Netlify, or any modern hosting environment." 
    },
    { 
      q: "Do I own the intellectual property of the builds?", 
      a: "100%. Everything VentureBuild generates—from the architecture and logic to the copywriting and brand assets—is your exclusive property. We claim zero royalties and zero ownership of the generated intellectual property." 
    },
    { 
      q: "What's the difference between Code and Strategy mode?", 
      a: "Code mode generates a functional, downloadable codebase ready for deployment. Strategy mode provides a high-fidelity 'Venture Blueprint' (Wireframe) and deep-dive advisory reports to guide your manual build or strategic planning process." 
    },
    { 
      q: "Can I use my own Gemini or OpenAI API keys?", 
      a: "VentureBuild is currently an end-to-end managed experience. However, the v3.1 Roadmap includes a 'BYOK' (Bring Your Own Key) feature for enterprise users looking for infinite scaling and custom model fine-tuning." 
    },
    {
      q: "How does the GitHub and Vercel integration work?",
      a: "Our engine uses the Git Data API to provision a new repository in your account and perform an atomic commit of the entire codebase. For Vercel, we interface with their Deployments API to launch your site to a global CDN in under 30 seconds."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020112] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">
      
      {/* --- CINEMATIC BACKGROUND ENGINE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div 
           className="absolute top-[-15%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[180px] animate-pulse duration-[12000ms]"
           style={{ transform: `translate3d(0, ${scrollY * 0.25}px, 0)` }}
         ></div>
         <div 
           className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[70%] bg-purple-700/10 rounded-full blur-[200px] animate-pulse duration-[14000ms]" 
           style={{ animationDelay: '3s', transform: `translate3d(0, ${-scrollY * 0.15}px, 0)` }}
         ></div>
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_20%,#000_60%,transparent_100%)]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay"></div>
      </div>

      {/* --- GLASS NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-1000 border-b ${scrollY > 50 ? 'bg-[#020112]/50 backdrop-blur-3xl border-white/10 py-3 shadow-2xl' : 'bg-transparent border-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-2.5 rounded-2xl border border-white/20 shadow-2xl transform group-hover:rotate-12 transition-transform duration-700">
                <Layers className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white/90 group-hover:text-white transition-all duration-500">Venture<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-black italic">Build</span></span>
          </div>
          
          <div className="flex items-center gap-12">
            <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
               {['Engine', 'Features', 'Pricing', 'FAQ'].map((link) => (
                 <a 
                   key={link}
                   href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} 
                   onClick={(e) => scrollToSection(e, link.toLowerCase().replace(/\s+/g, '-'))} 
                   className="hover:text-white transition-all duration-300 relative group py-2"
                 >
                   {link}
                   <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-indigo-500 transition-all group-hover:w-full"></span>
                 </a>
               ))}
            </div>
            
            <button 
              onClick={onGetStarted}
              className="group relative px-8 py-3.5 rounded-2xl bg-white text-slate-950 font-black text-[11px] uppercase tracking-[0.2em] overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3">Build Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-64 pb-40 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em] mb-12 animate-fade-in shadow-[0_0_40px_rgba(79,70,229,0.2)]">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            Architect OS v3.1 Elite
          </div>
          
          <h1 className="text-7xl md:text-[9.5rem] font-black tracking-tighter mb-12 leading-[0.8] animate-slide-up">
            Architect. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-slate-500 drop-shadow-2xl">Deploy. Conquer.</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto mb-20 leading-relaxed animate-slide-up-delay-1 font-medium tracking-tight">
            Stop starting from scratch. Generate high-fidelity ventures with deep market strategy, production code, and conversion-ready copy in <span className="text-white">60 seconds</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-slide-up-delay-2">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto relative group overflow-hidden bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[0.25em] px-14 py-7 rounded-[2.5rem] transition-all shadow-[0_20px_60px_-10px_rgba(79,70,229,0.6)] hover:-translate-y-2 active:scale-95 hover:shadow-[0_25px_80px_-10px_rgba(79,70,229,0.7)]"
            >
              Start New Project <Rocket className="inline-block ml-3 w-5 h-5 group-hover:rotate-45 transition-transform" />
            </button>
            <button 
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="w-full sm:w-auto glass-panel bg-white/5 text-white border border-white/10 font-black text-[11px] uppercase tracking-[0.25em] px-14 py-7 rounded-[2.5rem] hover:bg-white/10 transition-all active:scale-95"
            >
              Watch The Engine
            </button>
          </div>
        </div>
      </section>

      {/* --- THE PROCESS SECTION --- */}
      <section className="py-40 relative z-10 scroll-mt-32" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-32 reveal reveal-up" ref={el => revealRefs.current[0] = el}>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none">The Engine <span className="text-indigo-500 italic">Cycle.</span></h2>
                <p className="text-slate-400 text-xl font-medium tracking-tight">Our neural co-founder guides your project through 3 critical phases.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block"></div>
                
                <ProcessStep 
                    number="01" 
                    icon={Target} 
                    title="Strategic Brief" 
                    desc="Input your vision, core concept, and target audience. Our engine analyzes market gaps and competitor moats." 
                    ref={el => revealRefs.current[1] = el}
                    direction="left"
                />
                <ProcessStep 
                    number="02" 
                    icon={Cpu} 
                    title="Neural Build" 
                    desc="Gemini 3 Pro architects the codebase, crafts strategic copy, and selects a premium brand identity in real-time." 
                    active
                    ref={el => revealRefs.current[2] = el}
                    direction="up"
                />
                <ProcessStep 
                    number="03" 
                    icon={Rocket} 
                    title="Venture Launch" 
                    desc="Export full-stack Next.js code, push to GitHub, or deploy directly to production URLs with zero friction." 
                    ref={el => revealRefs.current[3] = el}
                    direction="right"
                />
            </div>
        </div>
      </section>

      {/* --- FEATURES BENTO GRID --- */}
      <section className="py-40 relative z-10 scroll-mt-32" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32 reveal reveal-up" ref={el => revealRefs.current[4] = el}>
            <h2 className="text-5xl md:text-9xl font-black tracking-tighter mb-8 leading-none">Venture <span className="text-indigo-400">Arsenal.</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium tracking-tight">Everything you need to go from idea to revenue-generating machine.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <BentoCard 
                size="large"
                icon={Code2} 
                title="Elite Codebase" 
                desc="Production Next.js architectures with clean semantic structures, Tailwind styling, and responsive defaults."
                badge="Tech"
                ref={el => revealRefs.current[5] = el}
                direction="left"
            />
            <BentoCard 
                size="small"
                icon={Sparkles} 
                title="Conversion Copy" 
                desc="Psychologically optimized headlines and benefits."
                badge="Growth"
                ref={el => revealRefs.current[6] = el}
                direction="up"
                stagger={200}
            />
            <BentoCard 
                size="small"
                icon={Search} 
                title="SEO Core" 
                desc="Strategic metadata and ranking structures."
                badge="Search"
                ref={el => revealRefs.current[7] = el}
                direction="up"
                stagger={400}
            />
            <BentoCard 
                size="medium"
                icon={Target} 
                title="Strategic Blueprint" 
                desc="A full landing page wireframe showing exactly where every conversion element should live for maximum ROI."
                badge="Strategy"
                ref={el => revealRefs.current[8] = el}
                direction="right"
            />
            <BentoCard 
                size="medium"
                icon={Github} 
                title="Source Sync" 
                desc="One-click push to GitHub with private repository provisioning and atomic file commits."
                badge="DevOps"
                ref={el => revealRefs.current[9] = el}
                direction="up"
                stagger={300}
            />
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section className="py-40 relative z-10 scroll-mt-32 border-t border-white/5" id="pricing">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 reveal reveal-up" ref={el => revealRefs.current[10] = el}>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none">Strategic <span className="text-emerald-400 italic">Access.</span></h2>
                <p className="text-slate-400 text-xl font-medium tracking-tight">Choose your level of venture building power.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
                <PricingCard 
                    tier="Hobby"
                    price="0"
                    desc="For explorers and early ideation."
                    features={["Unlimited Previews", "Basic Strategy Reports", "Static Exports"]}
                    ref={el => revealRefs.current[11] = el}
                    direction="left"
                />
                <PricingCard 
                    tier="Venture"
                    price="49"
                    desc="For serious builders and startups."
                    features={["Elite Next.js Codebases", "GitHub Push Integration", "Vercel Direct Deploy", "Full Branding Packs"]}
                    featured
                    ref={el => revealRefs.current[12] = el}
                    direction="up"
                />
                <PricingCard 
                    tier="Enterprise"
                    price="199"
                    desc="For agencies and builders with high volume."
                    features={["Unlimited GitHub Syncs", "Custom Design Tokens", "Advanced API Access", "Priority Neural Queue"]}
                    ref={el => revealRefs.current[13] = el}
                    direction="right"
                />
            </div>
         </div>
      </section>

      {/* --- ENHANCED FAQ SECTION --- */}
      <section className="py-40 relative z-10 scroll-mt-32 border-t border-white/5 bg-gradient-to-b from-transparent to-[#050510]/50" id="faq">
        <div className="max-w-4xl mx-auto px-6">
           <div className="text-center mb-24 space-y-4 reveal reveal-up" ref={el => revealRefs.current[14] = el}>
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 shadow-xl">
                <HelpCircle className="w-4 h-4" /> Support Center
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 italic">Insights.</span></h2>
              <p className="text-slate-400 text-xl font-medium max-w-xl mx-auto">Common questions about our neural venture engine and deployment protocols.</p>
           </div>
           
           <div className="space-y-6">
              {faqs.map((item, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div 
                    key={i} 
                    className={`group relative border rounded-[3rem] transition-all duration-700 overflow-hidden reveal reveal-up ${
                      isOpen 
                      ? 'border-indigo-500/50 bg-white/[0.04] shadow-[0_30px_60px_-15px_rgba(79,70,229,0.2)] ring-1 ring-indigo-500/20 active' 
                      : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10'
                    }`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                    ref={el => revealRefs.current[15 + i] = el}
                  >
                    <button 
                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                        className="w-full flex items-center justify-between p-10 text-left transition-all duration-500 outline-none"
                    >
                        <div className="flex items-center gap-8">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border ${
                             isOpen ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl' : 'bg-white/5 text-slate-500 border-white/5 group-hover:border-white/10 group-hover:text-slate-300'
                           }`}>
                              <span className="text-xs font-black uppercase tracking-widest">{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                           </div>
                           <span className={`font-black text-xl md:text-2xl tracking-tighter transition-colors duration-500 ${isOpen ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                              {item.q}
                           </span>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ${isOpen ? 'bg-indigo-500/20 text-indigo-400 rotate-180' : 'bg-white/5 text-slate-500 group-hover:bg-white/10'}`}>
                           <ChevronDown className="w-6 h-6" />
                        </div>
                    </button>
                    
                    <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-12' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="px-32 text-slate-400 leading-relaxed font-medium text-lg border-t border-white/5 pt-10 max-w-3xl">
                               {item.a}
                            </div>
                        </div>
                    </div>
                  </div>
                );
              })}
           </div>
           
           <div className="mt-20 p-12 rounded-[4rem] bg-indigo-600/5 border border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left reveal reveal-up" ref={el => revealRefs.current[revealRefs.current.length - 1] = el}>
              <div className="flex items-center gap-8">
                 <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-2xl animate-float">
                    <MessageSquare className="w-10 h-10 text-white" />
                 </div>
                 <div>
                    <h4 className="text-3xl font-black text-white mb-2 tracking-tighter">Still have questions?</h4>
                    <p className="text-slate-400 text-lg font-medium">Our strategic advisors are ready to help launch your vision.</p>
                 </div>
              </div>
              <button 
                onClick={onGetStarted}
                className="px-12 py-6 rounded-[2rem] bg-white text-slate-950 font-black text-xs uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1 active:scale-95"
              >
                Contact Support
              </button>
           </div>
        </div>
      </section>

      {/* --- FINAL CALL TO ACTION --- */}
      <section className="py-64 relative z-10 overflow-hidden">
         <div className="absolute inset-0 bg-indigo-600/10 blur-[180px] rounded-full pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-6 text-center relative">
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-12 reveal reveal-up" ref={el => revealRefs.current.push(el)}>Built for the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 italic">Fastest 1%.</span></h2>
            <p className="text-2xl md:text-4xl text-slate-400 mb-20 max-w-3xl mx-auto font-medium tracking-tight reveal reveal-up" ref={el => revealRefs.current.push(el)}>Join the network of elite builders launching their vision with AI speed.</p>
            <button 
              onClick={onGetStarted}
              className="bg-white text-slate-950 font-black text-xl px-20 py-8 rounded-[3rem] hover:scale-105 transition-all shadow-[0_0_80px_rgba(255,255,255,0.4)] flex items-center justify-center gap-6 mx-auto group active:scale-95"
            >
              Get Started Now <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
            </button>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-24 border-t border-white/5 bg-[#01010a] text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-20">
           <div className="flex items-center gap-6 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Layers className="w-8 h-8 text-indigo-500 group-hover:text-white transition-all duration-500" />
              <span className="text-slate-300 group-hover:text-white transition-all duration-500 text-2xl tracking-tighter normal-case font-black italic">VentureBuild <span className="text-indigo-600">AI</span></span>
           </div>
           <div className="flex gap-16">
              <a href="#" className="hover:text-white transition-all duration-300">Strategy</a>
              <a href="#" className="hover:text-white transition-all duration-300">Privacy</a>
              <a href="#" className="hover:text-white transition-all duration-300">Network</a>
           </div>
           <p className="opacity-30 tracking-widest">&copy; {new Date().getFullYear()} Venture Build Global.</p>
        </div>
      </footer>
    </div>
  );
};

// --- REFINED SUB-COMPONENTS WITH ADVANCED UI ---

const ProcessStep = React.forwardRef<HTMLDivElement, { number: string; icon: any; title: string; desc: string; active?: boolean; direction?: 'up' | 'left' | 'right' }>(
  ({ number, icon: Icon, title, desc, active, direction = 'up' }, ref) => (
    <div 
      ref={ref}
      className={`reveal reveal-${direction} relative p-12 rounded-[4rem] border transition-all duration-700 hover:-translate-y-5 group overflow-hidden ${
        active 
        ? 'bg-white/[0.04] border-indigo-500/40 shadow-[0_40px_100px_-20px_rgba(79,70,229,0.3)] active' 
        : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/10'
      }`}
    >
        <div className="text-[120px] font-black text-white/[0.02] absolute -top-10 -left-6 select-none group-hover:text-indigo-500/10 transition-colors pointer-events-none tracking-tighter italic">{number}</div>
        <div className={`relative w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-2xl transition-all duration-700 ${
          active ? 'bg-indigo-600 text-white animate-float' : 'bg-white/5 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'
        }`}>
            <Icon className="w-10 h-10" />
        </div>
        <h3 className="relative text-3xl font-black mb-6 text-white tracking-tighter">{title}</h3>
        <p className="relative text-slate-400 text-lg leading-relaxed font-medium">{desc}</p>
    </div>
  )
);

const BentoCard = React.forwardRef<HTMLDivElement, { size: 'large' | 'medium' | 'small'; icon: any; title: string; desc: string; badge: string; direction?: 'up' | 'left' | 'right'; stagger?: number }>(
  ({ size, icon: Icon, title, desc, badge, direction = 'up', stagger = 0 }, ref) => (
    <div 
      ref={ref}
      data-stagger={stagger}
      className={`reveal reveal-${direction} glass-card p-12 rounded-[4rem] border border-white/5 flex flex-col justify-between group overflow-hidden ${
        size === 'large' ? 'md:col-span-2 md:row-span-2' : size === 'medium' ? 'md:col-span-2' : ''
    }`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="relative">
            <div className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-10 shadow-xl">{badge}</div>
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-8 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-700 group-hover:rotate-12">
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black mb-6 group-hover:text-white transition-colors duration-500 tracking-tighter leading-none">{title}</h3>
            <p className="text-slate-400 text-lg leading-relaxed font-medium tracking-tight opacity-80 group-hover:opacity-100 transition-opacity">{desc}</p>
        </div>
    </div>
  )
);

const PricingCard = React.forwardRef<HTMLDivElement, { tier: string; price: string; desc: string; features: string[]; featured?: boolean; direction?: 'up' | 'left' | 'right' }>(
  ({ tier, price, desc, features, featured, direction = 'up' }, ref) => (
    <div 
      ref={ref}
      className={`reveal reveal-${direction} p-14 rounded-[4.5rem] border transition-all duration-1000 flex flex-col justify-between group overflow-hidden ${
        featured 
        ? 'bg-white text-slate-950 border-white shadow-[0_50px_100px_-20px_rgba(255,255,255,0.4)] scale-105 z-10 active' 
        : 'bg-white/[0.02] border-white/5 hover:border-white/20 active hover:bg-white/[0.04]'
    }`}>
        <div className="relative">
            <div className="flex justify-between items-start mb-12">
                <h3 className="text-2xl font-black uppercase tracking-widest italic">{tier}</h3>
                {featured && <span className="bg-indigo-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-2xl animate-pulse">Standard Pack</span>}
            </div>
            <div className="flex items-baseline gap-2 mb-8">
                <span className="text-6xl font-black tracking-tighter">$</span>
                <span className="text-9xl font-black tracking-tighter">{price}</span>
                <span className={`text-xl font-black uppercase tracking-widest opacity-40 italic`}>/mo</span>
            </div>
            <p className={`text-lg mb-16 font-medium leading-relaxed ${featured ? 'text-slate-600' : 'text-slate-400'}`}>{desc}</p>
            <ul className="space-y-6 mb-20">
                {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest">
                        <CheckCircle className={`w-7 h-7 ${featured ? 'text-indigo-600' : 'text-slate-500'}`} /> {f}
                    </li>
                ))}
            </ul>
        </div>
        <button className={`relative z-10 w-full py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.25em] transition-all duration-500 ${
            featured 
            ? 'bg-slate-950 text-white hover:bg-indigo-600 shadow-2xl hover:scale-105' 
            : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
        }`}>
            {price === "0" ? 'Start Exploring' : 'Build Venture'}
        </button>
    </div>
  )
);

export default LandingPage;
