
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MessageSquare, Send, X, Loader2, Bot, Sparkles, Target, Zap, ChevronRight } from 'lucide-react';
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

const ChatBot: React.FC<ChatBotProps> = ({ context, projectName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "I'm your Venture AI partner. How can I help you build your venture today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatSession = useMemo(() => {
    const contextStr = context ? JSON.stringify(context) : undefined;
    return getChatSession(contextStr);
  }, [context]);

  useEffect(() => {
    if (context && projectName) {
      setMessages([
        { 
          role: 'assistant', 
          content: `I've analyzed **${projectName}**. I'm ready to discuss your go-to-market strategy, technical roadmap, or how to sharpen your competitive moat. Where shall we start?` 
        }
      ]);
    }
  }, [context, projectName]);

  useEffect(() => { 
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim(); 
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    
    try {
      // Add a placeholder assistant message for streaming
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
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to AI. Please check your connection." }]); 
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[450px] h-[600px] bg-white border border-slate-200 rounded-[2rem] shadow-[0_25px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
          
          {/* Header */}
          <div className="bg-slate-950 px-6 py-6 flex items-center justify-between text-white relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm">
              <Sparkles className="w-16 h-16 text-indigo-400" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-2xl border border-white/10">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <span className="font-black text-lg block tracking-tight">Venture Advisor</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                    {context ? `Strategy: ${projectName}` : 'Idea Lab Engine'}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2.5 hover:bg-white/10 rounded-2xl transition-all relative z-10 group"
            >
              <X className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[90%] px-5 py-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm transition-all ${
                  m.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium'
                }`}>
                  <div 
                    className="prose prose-slate prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: m.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-black">$1</strong>')
                        .replace(/\n/g, '<br/>') 
                        .replace(/- (.*?)(<br\/>|$)/g, '<li class="ml-4 mb-1">$1</li>')
                    }} 
                  />
                  {m.role === 'assistant' && m.content === '' && (
                    <div className="flex items-center gap-2 py-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Strategizing...</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Container */}
          <div className="p-6 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="relative group">
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                placeholder="Ask about marketing, code, or ROI..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 pr-16 text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium" 
                disabled={isLoading} 
              />
              <button 
                type="submit" 
                className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-black text-white px-4 rounded-xl disabled:opacity-30 transition-all flex items-center justify-center shadow-lg group-hover:scale-105" 
                disabled={!input.trim() || isLoading}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
            <div className="mt-3 text-center">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">Powered by Gemini Deep Reasoning</span>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-18 h-18 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 group relative overflow-hidden ${
          isOpen ? 'bg-slate-950 text-white rotate-180' : 'bg-indigo-600 text-white'
        }`}
        style={{ width: '70px', height: '70px' }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10"></div>
        {isOpen ? <X className="w-8 h-8 relative z-10" /> : <MessageSquare className="w-8 h-8 relative z-10" />}
        {!isOpen && (
          <div className="absolute top-4 right-4 w-4 h-4 bg-white border-4 border-indigo-600 rounded-full animate-bounce shadow-xl"></div>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
