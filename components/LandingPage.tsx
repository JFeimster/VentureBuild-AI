
import React, { useState, useEffect } from 'react';
import { Rocket, Zap, Layers, Code2, ArrowRight, ShieldCheck, Cpu, Play, Github, CheckCircle, Sparkles, Globe, Terminal } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-700/20 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
         <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 20 ? 'bg-[#030014]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={onGetStarted}>
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 group-hover:opacity-60 transition"></div>
                <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2.5 rounded-xl relative z-10">
                    <Layers className="w-5 h-5 text-white" />
                </div>
            </div>
            <span className="font-bold text-xl tracking-tight">Venture<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Build</span> AI</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
               <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-white transition hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Features</a>
               <a href="#demo" onClick={(e) => scrollToSection(e, 'demo')} className="hover:text-white transition hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">How it works</a>
               <a href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="hover:text-white transition hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
                <button 
                  onClick={onGetStarted}
                  className="text-sm font-medium text-slate-300 hover:text-white transition hidden sm:block"
                >
                  Sign In
                </button>
                <button 
                  onClick={onGetStarted}
                  className="group relative px-6 py-2.5 rounded-full bg-white text-slate-950 font-bold text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  <span className="relative z-10 flex items-center gap-2">Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 text-center relative">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-indigo-300 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in shadow-lg hover:border-indigo-500/50 transition cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Generative UI v2.5
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1] animate-slide-up">
            Build your <br className="hidden md:block" />
            <span className="relative inline-block">
                <span className="absolute -inset-2 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 blur-2xl opacity-50"></span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300 relative z-10">Startup Vision</span>
            </span>
            <br /> in Seconds.
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up-delay-1 font-light">
            Stop coding boilerplate. Let our <span className="text-white font-medium">Gemini-powered engine</span> generate your landing page, strategic copy, and full codebase instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up-delay-2">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg px-8 py-4 rounded-xl transition shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_20px_60px_-10px_rgba(79,70,229,0.6)] flex items-center justify-center gap-2 transform hover:-translate-y-1"
            >
              Start Building Free <Rocket className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => scrollToSection(e, 'demo')}
              className="w-full sm:w-auto bg-[#0F0B29] hover:bg-[#1A1635] text-white border border-white/10 font-bold text-lg px-8 py-4 rounded-xl transition flex items-center justify-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
                 <Play className="w-3 h-3 fill-current" />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Stats / Social Proof */}
          <div className="mt-24 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in opacity-70">
              <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">10k+</div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">Projects Built</div>
              </div>
              <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">2.5s</div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">Avg. Generation</div>
              </div>
               <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">Next.js</div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">Native Export</div>
              </div>
               <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">4.9/5</div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">User Rating</div>
              </div>
          </div>
        </div>
      </section>

      {/* Code Preview / Floating UI */}
      <section className="py-20 relative z-10 scroll-mt-24" id="demo">
        <div className="max-w-7xl mx-auto px-6">
            <div className="relative rounded-2xl border border-white/10 bg-[#0A0A1F]/80 backdrop-blur-xl shadow-2xl overflow-hidden animate-slide-up-delay-2 group">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-50 pointer-events-none"></div>
                
                {/* Window Controls */}
                <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="text-xs font-mono text-slate-500">generate_startup.tsx</div>
                    <div className="w-10"></div>
                </div>

                <div className="grid md:grid-cols-2">
                    <div className="p-8 border-r border-white/5 hidden md:block">
                        <div className="space-y-4 font-mono text-sm">
                            <div className="text-slate-500">// 1. Define your vision</div>
                            <div className="flex items-center gap-2 text-purple-400">
                                <span className="text-indigo-400">const</span> 
                                <span className="text-yellow-200">idea</span> 
                                <span className="text-white">=</span> 
                                <span className="text-green-400">"SaaS for dog walkers"</span>;
                            </div>
                            
                            <div className="text-slate-500 mt-4">// 2. Select stack</div>
                            <div className="flex items-center gap-2 text-purple-400">
                                <span className="text-indigo-400">const</span> 
                                <span className="text-yellow-200">stack</span> 
                                <span className="text-white">=</span> 
                                <span className="text-blue-400">"Next.js"</span>;
                            </div>

                            <div className="text-slate-500 mt-4">// 3. Generate</div>
                            <div className="flex items-center gap-2">
                                <span className="text-purple-400">await</span>
                                <span className="text-indigo-300">VentureBuild</span>.<span className="text-yellow-200">launch</span>(idea, stack);
                            </div>

                            <div className="mt-8 p-4 rounded bg-black/30 border border-white/5 text-slate-400">
                                <span className="text-green-400">✔</span> Analyzing market trends...<br/>
                                <span className="text-green-400">✔</span> Generating copy...<br/>
                                <span className="text-green-400">✔</span> Compiling React components...<br/>
                                <span className="text-white animate-pulse">_ Ready to deploy.</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-[#0F0B29] to-[#0A0A1F] flex items-center justify-center min-h-[400px]">
                         <div className="text-center relative">
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-40 animate-pulse"></div>
                             <Rocket className="w-16 h-16 text-indigo-400 mx-auto mb-6 relative z-10" />
                             <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Production Ready</h3>
                             <p className="text-slate-400 max-w-xs mx-auto text-sm relative z-10">Full Tailwind CSS code, responsive components, and strategic copy generated in one click.</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 relative z-10 scroll-mt-24" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for speed, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">designed for growth</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Stop wasting weeks on boilerplate. Focus on your business logic while we handle the foundation.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-indigo-500/50 transition duration-500">
               <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-30 transition duration-500 rounded-2xl"></div>
               <div className="relative h-full bg-[#0A0A1F] rounded-xl p-8 border border-white/5 hover:border-white/10 transition overflow-hidden">
                   <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition group-hover:bg-indigo-500/20 group-hover:text-white">
                      <Code2 className="w-7 h-7" />
                   </div>
                   <h3 className="text-xl font-bold mb-3 text-white">Instant Code Generation</h3>
                   <p className="text-slate-400 leading-relaxed text-sm">
                     Generate clean, responsive HTML/CSS or Next.js codebases tailored to specific niches (SaaS, Agency, E-commerce) instantly.
                   </p>
               </div>
            </div>

            {/* Card 2 */}
            <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-purple-500/50 transition duration-500">
               <div className="absolute inset-0 bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-30 transition duration-500 rounded-2xl"></div>
               <div className="relative h-full bg-[#0A0A1F] rounded-xl p-8 border border-white/5 hover:border-white/10 transition overflow-hidden">
                   <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition group-hover:bg-purple-500/20 group-hover:text-white">
                      <Sparkles className="w-7 h-7" />
                   </div>
                   <h3 className="text-xl font-bold mb-3 text-white">Strategic Copywriting</h3>
                   <p className="text-slate-400 leading-relaxed text-sm">
                     Don't just get lorem ipsum. Get benefit-driven headlines, value propositions, and CTAs that actually convert, written by AI.
                   </p>
               </div>
            </div>

            {/* Card 3 */}
            <div className="group relative p-1 rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-emerald-500/50 transition duration-500">
               <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-30 transition duration-500 rounded-2xl"></div>
               <div className="relative h-full bg-[#0A0A1F] rounded-xl p-8 border border-white/5 hover:border-white/10 transition overflow-hidden">
                   <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition group-hover:bg-emerald-500/20 group-hover:text-white">
                      <Terminal className="w-7 h-7" />
                   </div>
                   <h3 className="text-xl font-bold mb-3 text-white">One-Click Deployment</h3>
                   <p className="text-slate-400 leading-relaxed text-sm">
                     Push your generated code directly to GitHub or deploy live to Vercel. From idea to live URL in under 5 minutes.
                   </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid / Tech Stack */}
      <section className="py-20 relative z-10 border-t border-white/5 bg-[#050510]">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[500px]">
               {/* Large Card */}
               <div className="md:col-span-2 md:row-span-2 rounded-2xl bg-[#0F0B29] border border-white/5 p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition transform group-hover:scale-110 duration-700">
                     <Layers className="w-64 h-64 text-indigo-500" />
                  </div>
                  <div className="relative z-10 h-full flex flex-col justify-end">
                     <h3 className="text-2xl font-bold text-white mb-2">Full Stack Architecture</h3>
                     <p className="text-slate-400">We don't just dump HTML. We provide specialized architectures for SaaS, marketplaces, and portfolios including authentication stubs and database schemas.</p>
                  </div>
               </div>

               {/* Tall Card */}
               <div className="md:col-span-1 md:row-span-2 rounded-2xl bg-[#0A0A1F] border border-white/5 p-6 flex flex-col items-center justify-center text-center group hover:bg-[#10102a] transition">
                  <div className="w-20 h-20 rounded-full bg-white/5 mb-6 flex items-center justify-center group-hover:scale-110 transition">
                     <Github className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="font-bold text-lg text-white mb-2">GitHub Native</h4>
                  <p className="text-sm text-slate-400">Creates private repos and pushes code automatically.</p>
               </div>

               {/* Wide Card */}
               <div className="md:col-span-1 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-[#0A0A1F] border border-white/5 p-6 flex flex-col justify-center">
                   <Globe className="w-8 h-8 text-indigo-400 mb-3" />
                   <h4 className="font-bold text-white">Global CDN Ready</h4>
               </div>

               {/* Small Card */}
               <div className="md:col-span-1 rounded-2xl bg-[#0A0A1F] border border-white/5 p-6 flex flex-col justify-center">
                   <ShieldCheck className="w-8 h-8 text-emerald-400 mb-3" />
                   <h4 className="font-bold text-white">Secure Defaults</h4>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden scroll-mt-24" id="pricing">
         <div className="absolute inset-0 bg-gradient-to-b from-[#030014] to-indigo-950/20"></div>
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to ship your next big idea?</h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">Join thousands of founders building faster with AI. No credit card required to start generating.</p>
            <button 
              onClick={onGetStarted}
              className="bg-white text-indigo-950 font-black text-xl px-10 py-5 rounded-2xl hover:scale-105 transition shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 mx-auto"
            >
              Start Building Now <ArrowRight className="w-6 h-6" />
            </button>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500 font-medium">
               <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Free Forever Plan</span>
               <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> No Lock-in</span>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#02000d] text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2 cursor-pointer" onClick={scrollToTop}>
              <div className="bg-indigo-600/20 p-1.5 rounded-lg">
                 <Layers className="w-4 h-4 text-indigo-500" />
              </div>
              <span className="font-bold text-slate-300">VentureBuild AI</span>
           </div>
           <div className="flex gap-8">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition">Terms</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition">Privacy</a>
              <a href="https://twitter.com/search?q=venture+build+ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Twitter</a>
           </div>
           <p>&copy; {new Date().getFullYear()} Venture Build AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
