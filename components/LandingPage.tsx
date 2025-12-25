
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
      const offset = 80; // offset for fixed header
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
      
      {/* --- BACKGROUND FX --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-800/20 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-800/20 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '4s'}}></div>
         <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrollY > 20 ? 'bg-[#030014]/70 backdrop-blur-xl border-white/10 py-3 shadow-lg shadow-indigo-500/5' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={scrollToTop}>
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl relative z-10 border border-white/10 shadow-inner">
                    <Layers className="w-5 h-5 text-white" />
                </div>
            </div>
            <span className="font-bold text-xl tracking-tight text-white/90 group-hover:text-white transition">Venture<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-extrabold">Build</span></span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
               <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-white transition relative group py-1">Process</a>
               <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-white transition relative group py-1">Features</a>
               <a href="#testimonials" onClick={(e) => scrollToSection(e, 'testimonials')} className="hover:text-white transition relative group py-1">Reviews</a>
            </div>
            
            <div className="flex items-center gap-4">
                <button 
                  onClick={onGetStarted}
                  className="text-sm font-medium text-slate-300 hover:text-white transition hidden sm:block"
                >
                  Log In
                </button>
                <button 
                  onClick={onGetStarted}
                  className="group relative px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-sm overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-2">Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-48 pb-24 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-indigo-300 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-white/10 transition cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Generative UI v2.5 Live
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1] animate-slide-up">
            Build your <br className="hidden md:block" />
            <span className="relative inline-block px-2">
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl transform -skew-y-3"></span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-purple-200 relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Startup Vision</span>
            </span>
            <br /> in Seconds.
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up-delay-1 font-light">
            Stop coding boilerplate. Let our <span className="text-indigo-200 font-medium">Gemini-powered engine</span> generate your landing page, strategic copy, and full codebase instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up-delay-2">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto relative group overflow-hidden bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_20px_60px_-10px_rgba(79,70,229,0.6)] hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center justify-center gap-2">Start Building Free <Rocket className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" /></span>
            </button>
            <button 
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="w-full sm:w-auto bg-[#0F0B29]/50 backdrop-blur-sm hover:bg-white/5 text-white border border-white/10 font-bold text-lg px-8 py-4 rounded-xl transition flex items-center justify-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:scale-110 transition duration-300 shadow-inner">
                 <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              See it in Action
            </button>
          </div>
        </div>
      </section>

      {/* --- TRUSTED BY --- */}
      <section className="py-10 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">Trusted by 10,000+ Founders</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="flex items-center gap-2 font-bold text-xl text-white hover:text-indigo-300 transition-colors cursor-default"><Globe className="w-6 h-6" /> Atlas</div>
               <div className="flex items-center gap-2 font-bold text-xl text-white hover:text-purple-300 transition-colors cursor-default"><Cpu className="w-6 h-6" /> Vertex</div>
               <div className="flex items-center gap-2 font-bold text-xl text-white hover:text-yellow-300 transition-colors cursor-default"><Zap className="w-6 h-6" /> BoltShift</div>
               <div className="flex items-center gap-2 font-bold text-xl text-white hover:text-cyan-300 transition-colors cursor-default"><Layers className="w-6 h-6" /> LayerUI</div>
               <div className="flex items-center gap-2 font-bold text-xl text-white hover:text-green-300 transition-colors cursor-default"><Terminal className="w-6 h-6" /> CodeFlow</div>
            </div>
        </div>
      </section>

      {/* --- CODE PREVIEW (GLASS WINDOW) --- */}
      <section className="py-32 relative z-10 scroll-mt-24" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">From <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Prompt</span> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Product</span></h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">Describe your idea in plain English. Our AI architects the database, writes the copy, and generates the Next.js code.</p>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-[#0A0A1F]/60 backdrop-blur-2xl shadow-[0_0_50px_-10px_rgba(79,70,229,0.2)] overflow-hidden animate-slide-up-delay-2 group hover:shadow-[0_0_70px_-10px_rgba(79,70,229,0.3)] transition duration-500">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50 hover:bg-red-500 transition-colors shadow-inner"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50 hover:bg-yellow-500 transition-colors shadow-inner"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50 hover:bg-green-500 transition-colors shadow-inner"></div>
                    </div>
                    <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
                        <Terminal className="w-3 h-3" /> generate_startup.tsx
                    </div>
                    <div className="w-10"></div>
                </div>

                <div className="grid md:grid-cols-2">
                    <div className="p-8 border-r border-white/5 hidden md:block font-mono text-sm leading-relaxed relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
                        <div className="space-y-6 relative z-10">
                            <div>
                                <div className="text-slate-500 mb-1">// 1. Define your vision</div>
                                <div className="flex items-center gap-2 text-purple-300">
                                    <span className="text-indigo-400">const</span> <span className="text-yellow-200">idea</span> <span className="text-white">=</span> <span className="text-green-400">"SaaS for dog walkers"</span>;
                                </div>
                            </div>
                            <div>
                                <div className="text-slate-500 mb-1">// 2. Select stack</div>
                                <div className="flex items-center gap-2 text-purple-300">
                                    <span className="text-indigo-400">const</span> <span className="text-yellow-200">stack</span> <span className="text-white">=</span> <span className="text-blue-400">"Next.js"</span>;
                                </div>
                            </div>
                            <div>
                                <div className="text-slate-500 mb-1">// 3. Generate</div>
                                <div className="flex items-center gap-2">
                                    <span className="text-purple-300">await</span> <span className="text-indigo-300">VentureBuild</span>.<span className="text-yellow-200">launch</span>(idea, stack);
                                </div>
                            </div>
                            <div className="mt-8 p-4 rounded-lg bg-black/40 border border-white/5 text-slate-400 shadow-inner">
                                <div className="flex items-center gap-3 mb-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span>Analyzing market...</span></div>
                                <div className="flex items-center gap-3 mb-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div><span>Generating copy...</span></div>
                                <div className="flex items-center gap-3 mb-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div><span>Compiling components...</span></div>
                                <div className="text-green-400 mt-4 font-bold">_ Ready to deploy.</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-[#0F0B29] to-[#050510] flex items-center justify-center min-h-[400px] relative overflow-hidden">
                         <div className="text-center relative z-10 group-hover:scale-105 transition duration-500">
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
                             <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-8 relative border border-white/20">
                                <Rocket className="w-12 h-12 text-white" />
                             </div>
                             <h3 className="text-2xl font-bold text-white mb-2">Production Ready</h3>
                             <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">Full Tailwind CSS code, responsive components, and strategic copy generated in one click.</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- FEATURE GRID --- */}
      <section className="py-24 relative z-10 scroll-mt-24" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for speed, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">designed for growth</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Stop wasting weeks on boilerplate. Focus on your business logic while we handle the foundation.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative h-full bg-[#0A0A1F] rounded-xl p-8 border border-white/5 hover:border-indigo-500/30 transition overflow-hidden shadow-2xl">
                <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition group-hover:bg-indigo-500/20 group-hover:text-white">
                    <Code2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Instant Codebase</h3>
                <p className="text-slate-400 leading-relaxed text-sm">Generate clean, responsive Next.js or React codebases tailored to specific niches instantly.</p>
            </div>
            <div className="group relative h-full bg-[#0A0A1F] rounded-xl p-8 border border-white/5 hover:border-purple-500/30 transition overflow-hidden shadow-2xl">
                <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition group-hover:bg-purple-500/20 group-hover:text-white">
                    <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Strategic Copy</h3>
                <p className="text-slate-400 leading-relaxed text-sm">Get benefit-driven headlines, value propositions, and CTAs that actually convert, written by AI.</p>
            </div>
            <div className="group relative h-full bg-[#0A0A1F] rounded-xl p-8 border border-white/5 hover:border-emerald-500/30 transition overflow-hidden shadow-2xl">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition group-hover:bg-emerald-500/20 group-hover:text-white">
                    <Terminal className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Direct Export</h3>
                <p className="text-slate-400 leading-relaxed text-sm">Push directly to GitHub or deploy live to Vercel. From idea to live URL in under 5 minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="py-24 border-t border-white/5 bg-[#030014] relative overflow-hidden" id="testimonials">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Builders</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { name: "Sarah J.", role: "Founder, TechFlow", text: "I built my MVP landing page in 3 minutes. The copy was actually better than what I paid a freelancer for last year." },
                 { name: "David C.", role: "Indie Hacker", text: "The Next.js export is a game changer. It sets up the folder structure, components, and routing perfectly." },
                 { name: "Elena R.", role: "Agency Owner", text: "We use this to mock up client concepts during sales calls. It blows them away every time." }
               ].map((review, i) => (
                 <div key={i} className="bg-white/[0.03] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.06] transition duration-500 backdrop-blur-sm">
                    <div className="flex gap-1 mb-4 text-yellow-400">
                       {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-slate-300 mb-6 leading-relaxed italic">"{review.text}"</p>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
                          {review.name.charAt(0)}
                       </div>
                       <div>
                          <div className="font-bold text-white">{review.name}</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider">{review.role}</div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- FAQ --- */}
      <section className="py-24 bg-[#050510] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
           <h2 className="text-3xl font-bold mb-12 text-center">Common Questions</h2>
           <div className="space-y-4">
              {[
                { question: "Is the code really production-ready?", answer: "Yes. We generate clean, semantic Next.js or React code using Tailwind CSS. It is ready for deployment." },
                { question: "Can I use my own design system?", answer: "Currently, we support Tailwind utilities. Custom tokens are on the roadmap." },
                { question: "Do I own the generated IP?", answer: "Absolutely. Everything generated—code, copy, and assets—is 100% yours to use and modify." },
                { question: "Is it free to start?", answer: "Yes, you can generate previews for free. Sign in to save or export projects." }
              ].map((faq, i) => (
                <div key={i} className={`border rounded-xl bg-white/[0.02] overflow-hidden transition-all duration-300 ${openFaqIndex === i ? 'border-indigo-500/50 bg-white/[0.04]' : 'border-white/10'}`}>
                   <button 
                      onClick={() => toggleFaq(i)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition outline-none"
                   >
                      <span className="font-medium text-lg text-slate-200">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaqIndex === i ? 'rotate-180 text-indigo-400' : ''}`} />
                   </button>
                   <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5 mt-2">
                         {faq.answer}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 relative overflow-hidden" id="pricing">
         <div className="absolute inset-0 bg-gradient-to-b from-[#030014] to-indigo-950/20"></div>
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to ship your next big idea?</h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">Join thousands of founders building faster with AI. No credit card required.</p>
            <button 
              onClick={onGetStarted}
              className="bg-white text-indigo-950 font-black text-xl px-12 py-5 rounded-2xl hover:scale-105 transition shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 mx-auto group"
            >
              Start Building Now <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="mt-10 flex items-center justify-center gap-8 text-sm text-slate-500 font-medium">
               <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Free Forever Plan</span>
               <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> No Lock-in</span>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/5 bg-[#02000d] text-slate-500 text-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-3 cursor-pointer group" onClick={scrollToTop}>
              <div className="bg-white/5 p-2 rounded-lg group-hover:bg-indigo-600/20 transition-colors">
                 <Layers className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="font-bold text-slate-300 group-hover:text-white transition-colors">VentureBuild AI</span>
           </div>
           <div className="flex gap-8">
              <a href="#" className="hover:text-white transition" onClick={(e) => e.preventDefault()}>Terms</a>
              <a href="#" className="hover:text-white transition" onClick={(e) => e.preventDefault()}>Privacy</a>
              <a href="https://twitter.com/venturebuildai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Twitter</a>
           </div>
           <p className="opacity-60">&copy; {new Date().getFullYear()} Venture Build AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
