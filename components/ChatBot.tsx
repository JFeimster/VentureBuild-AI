
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MessageSquare, Send, X, Loader2, Bot, Sparkles, Target, Zap } from 'lucide-react';
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
    { role: 'assistant', content: "I'm your Venture AI partner. How can I help you build your sizzlng venture today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Memoize session based on context to avoid recreating it on every render, 
  // but recreate it when context changes significantly
  const chatSession = useMemo(() => {
    const contextStr = context ? JSON.stringify(context) : undefined;
    return getChatSession(contextStr);
  }, [context]);

  // Reset messages when a new context (build result) arrives
  useEffect(() => {
    if (context && projectName) {
      setMessages([
        { 
          role: 'assistant', 
          content: `I've analyzed your new project: **${projectName}**. I'm ready to discuss marketing strategies, technical challenges, or feature roadmaps for it. What's on your mind?` 
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
      const result = await chatSession.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', content: result.text || "I'm sorry, I couldn't process that response." }]);
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
        <div className="mb-4 w-[350px] sm:w-[420px] h-[550px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-slate-900 px-6 py-5 flex items-center justify-between text-white relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-base block">Venture Partner</span>
                {context ? (
                  <span className="text-[10px] text-indigo-400 flex items-center gap-1.5 uppercase tracking-widest font-black">
                    <Target className="w-2.5 h-2.5" /> Analyzing {projectName}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 flex items-center gap-1.5 uppercase tracking-widest font-black">
                    <Zap className="w-2.5 h-2.5" /> Idea Lab Active
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition relative z-10"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none prose prose-slate prose-sm'
                }`}>
                  <div dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 rounded-tl-none shadow-sm flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                  </div>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Strategizing</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Ask for strategy, code, or marketing tips..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400 font-medium" 
              disabled={isLoading} 
            />
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-2xl disabled:opacity-50 transition shadow-lg shadow-indigo-200" 
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 group relative overflow-hidden ${
          isOpen ? 'bg-slate-900 text-white rotate-90' : 'bg-indigo-600 text-white'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10"></div>
        {isOpen ? <X className="w-7 h-7 relative z-10" /> : <MessageSquare className="w-7 h-7 relative z-10" />}
        {!isOpen && (
          <div className="absolute top-3 right-3 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full"></div>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
