
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MessageSquare, Send, X, Loader2, Bot, Sparkles, Target, Zap, ChevronRight, User, TrendingUp, ShieldAlert, Cpu, Maximize2, Minimize2 } from 'lucide-react';
import { getChatSession } from '../services/geminiService';
import { ApiResponse } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBotProps {
  context?: ApiResponse | null;
  projectName?: string;
}

const STRATEGY_CHIPS = [
  { icon: Target, label: "GTM Strategy", prompt: "Outline a Go-To-Market strategy for this venture." },
  { icon: ShieldAlert, label: "Moat Analysis", prompt: "How can we make this business model more defensible?" },
  { icon: TrendingUp, label: "Scale Roadmap", prompt: "What are the first 3 steps to scale this to $10k MRR?" },
  { icon: Cpu, label: "Tech Moat", prompt: "What technical architecture would give us a data advantage?" }
];

const ChatBot: React.FC<ChatBotProps> = ({ context, projectName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to the **Venture Lab**. I'm your strategic AI partner. What are we building today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Re-initialize session when context changes
  const chatSession = useMemo(() => {
    const contextStr = context ? JSON.stringify(context) : undefined;
    return getChatSession(contextStr);
  }, [context]);

  // Welcome message update when a project is generated
  useEffect(() => {
    if (context && projectName && messages.length === 1) {
      setMessages([
        { 
          role: 'assistant', 
          content: `I've analyzed the strategy for **${projectName}**. I'm ready to discuss GTM, technical moats, or unit economics. Where should we start?` 
        }
      ]);
    }
  }, [context, projectName, messages.length]);

  useEffect(() => { 
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg = text.trim(); 
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    
    try {
      // Placeholder for assistant response that will be streamed
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      const streamResponse = await chatSession.sendMessageStream({ message: userMsg });
      let fullText = '';
      
      for await (const chunk of streamResponse) {
        fullText += chunk.text || '';
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].content = fullText;
          return newMsgs;
        });
      }
    } catch (err) { 
      console.error("Venture AI Error:", err);
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: "My reasoning engine hit a strategic hurdle. Please try rephrasing." }]); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const renderContent = (content: string) => {
    // Basic Markdown-to-HTML helper for the Venture Partner
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-600 font-black">$1</strong>')
      .replace(/\n/g, '<br/>')
      .replace(/- (.*?)(<br\/>|$)/g, '<li class="ml-4 mb-1 list-disc">$1</li>');
  };

  if (isMinimized && isOpen) {
    return (
      <button 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-8 right-8 z-[999] w-20 h-20 rounded-[2rem] bg-indigo-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform animate-in fade-in zoom-in"
      >
        <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
        <Bot className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 z-[999] flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-6 w-[380px] sm:w-[500px] h-[700px] bg-white/95 border border-slate-200 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-700 backdrop-blur-xl">
          
          {/* Header */}
          <div className="bg-[#050510] px-8 py-8 flex items-center justify-between text-white relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-700 flex items-center justify-center shadow-2xl border border-white/20">
                <Bot className="w-8 h-8" />
              </div>
              <div>
                <span className="font-black text-xl block tracking-tighter">Venture Partner</span>
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-black">
                    {context ? `Deep Analysis: Active` : 'Ideation Mode'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <button 
                onClick={() => setIsMinimized(true)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
                title="Minimize"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F8F9FF]/50 scrollbar-hide">
            {messages.length === 1 && (
              <div className="grid grid-cols-2 gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                {STRATEGY_CHIPS.map((chip, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(chip.prompt)}
                    className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl text-left hover:border-indigo-500 hover:shadow-lg transition-all group active:scale-95"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <chip.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900 leading-none">{chip.label}</span>
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                    m.role === 'user' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-indigo-600'
                  }`}>
                    {m.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>
                  
                  <div className={`px-6 py-4 rounded-[2rem] text-[15px] leading-relaxed shadow-sm transition-all border ${
                    m.role === 'user' 
                      ? 'bg-slate-900 border-slate-800 text-white rounded-tr-none' 
                      : 'bg-white border-slate-100 text-slate-700 rounded-tl-none font-medium'
                  }`}>
                    <div 
                      className="prose prose-slate prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: renderContent(m.content) }} 
                    />
                    {m.role === 'assistant' && m.content === '' && (
                      <div className="flex items-center gap-3 py-2">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce delay-100"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce delay-200"></div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Processing Strategy...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-8 bg-white border-t border-slate-100">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="relative group">
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                placeholder="Ask your co-founder..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-5 pr-16 text-[15px] outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium" 
                disabled={isLoading} 
              />
              <button 
                type="submit" 
                className="absolute right-3 top-3 bottom-3 w-12 bg-slate-900 hover:bg-black text-white rounded-full disabled:opacity-30 transition-all flex items-center justify-center shadow-xl hover:scale-105 active:scale-95" 
                disabled={!input.trim() || isLoading}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAB */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="w-20 h-20 rounded-[2.2rem] bg-indigo-600 text-white flex items-center justify-center shadow-[0_20px_80px_rgba(79,70,229,0.5)] transition-all duration-500 transform hover:scale-110 active:scale-90 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
          <MessageSquare className="w-9 h-9 relative z-10 group-hover:rotate-12 transition-transform" />
          <div className="absolute top-5 right-5 w-3.5 h-3.5 bg-white rounded-full animate-pulse shadow-lg"></div>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
