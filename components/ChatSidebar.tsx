import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Download, Globe, CheckCircle, Loader2, Sparkles, Command, AlertTriangle, Plus, FileText, Printer } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatSidebarProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  isGenerating?: boolean;
  onPublish: () => void;
  isPublishing: boolean;
  publishUrl: string | null;
  onDownload: () => void;
  usageStats: {
    creationsRemaining: number;
    editsRemaining: number;
    maxEdits: number;
  };
  onPurchaseEdits: () => void;
  mode: 'WEBSITE' | 'RESUME';
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  messages, 
  onSendMessage, 
  isProcessing,
  isGenerating,
  onPublish,
  isPublishing,
  publishUrl,
  onDownload,
  usageStats,
  onPurchaseEdits,
  mode
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing && !isGenerating && usageStats.editsRemaining > 0) {
      onSendMessage(input);
      setInput('');
    }
  };

  const editPercentage = (usageStats.editsRemaining / usageStats.maxEdits) * 100;

  return (
    <div className="flex flex-col h-full bg-white w-full md:w-[400px] shrink-0 font-sans">
      {/* Header */}
      <div className="h-12 border-b border-zinc-100 flex items-center justify-between px-4 bg-white">
        <div className="flex items-center gap-2">
          {/* Edit Credit Pill */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-50 border border-zinc-200 cursor-pointer hover:border-zinc-300 transition-colors" title="AI Edits Remaining" onClick={onPurchaseEdits}>
             <div className="w-10 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${editPercentage < 20 ? 'bg-red-500' : 'bg-purple-500'}`} 
                    style={{ width: `${editPercentage}%` }}
                ></div>
             </div>
             <span className={`text-[9px] font-bold font-mono ${editPercentage < 20 ? 'text-red-500' : 'text-zinc-400'}`}>
                {usageStats.editsRemaining}
             </span>
             {usageStats.editsRemaining < 10 && (
                <div className="w-3 h-3 bg-zinc-900 rounded-full flex items-center justify-center text-white ml-0.5">
                    <Plus className="w-2 h-2" />
                </div>
             )}
          </div>
        </div>
        <button 
            onClick={onDownload}
            className="p-1.5 hover:bg-zinc-50 rounded text-zinc-400 hover:text-zinc-900 transition-colors"
            title="Export Code"
        >
            <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white scroll-smooth" ref={scrollRef}>
        {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-zinc-900 font-medium">Building your {mode === 'RESUME' ? 'resume' : 'site'}...</h3>
                    <p className="text-zinc-400 text-xs mt-1">This usually takes about 30 seconds.</p>
                </div>
            </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-50">
             <Bot className="w-8 h-8 text-zinc-300 mb-2" />
             <p className="text-sm text-zinc-400">AI is ready to refine your {mode === 'RESUME' ? 'resume' : 'site'}.</p>
          </div>
        ) : (
             messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-3 animate-[fadeIn_0.3s_ease-out] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold border border-zinc-100
                    ${msg.role === 'user' ? 'bg-zinc-900 text-white' : mode === 'RESUME' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'}`}>
                    {msg.role === 'user' ? 'You' : 'AI'}
                  </div>
                  <div 
                    className={`py-2.5 px-3.5 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-sm
                      ${msg.role === 'user' 
                        ? 'bg-zinc-900 text-white rounded-tr-sm' 
                        : 'bg-white border border-zinc-100 text-zinc-600 rounded-tl-sm'}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
        )}
        
        {isProcessing && !isGenerating && (
           <div className="flex items-start gap-3 animate-[fadeIn_0.3s_ease-out]">
             <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border 
                ${mode === 'RESUME' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
               <Loader2 className="w-3.5 h-3.5 animate-spin" />
             </div>
             <div className="bg-white border border-zinc-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce delay-150"></span>
                </div>
             </div>
           </div>
        )}
      </div>

      {/* Deployment / Download Status Area */}
      {mode === 'WEBSITE' ? (
          publishUrl ? (
              <div className="px-4 py-3 bg-white border-t border-zinc-100">
                 <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase tracking-wider mb-2">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Live
                    </div>
                    <a 
                    href={publishUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="block w-full text-center py-2 bg-white border border-green-200 rounded text-green-700 text-xs font-mono hover:bg-green-50 truncate px-2 transition-colors"
                    >
                    {publishUrl.replace('https://', '')}
                    </a>
                 </div>
              </div>
          ) : (
              <div className="p-4 bg-white border-t border-zinc-100">
                 <button
                   onClick={onPublish}
                   disabled={isPublishing || isGenerating}
                   className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow active:scale-[0.99]"
                 >
                    {isPublishing ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Building...
                        </>
                    ) : (
                        <>
                            <Globe className="w-3.5 h-3.5" />
                            Publish Site
                        </>
                    )}
                 </button>
              </div>
          )
      ) : (
          <div className="p-4 bg-white border-t border-zinc-100">
              <button
                  onClick={() => {
                      const iframe = document.querySelector('iframe');
                      if (iframe?.contentWindow) {
                          iframe.contentWindow.print();
                      }
                  }}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow"
              >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Download PDF
              </button>
          </div>
      )}

      {/* Input */}
      <div className="p-4 pt-0 bg-white">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            className="w-full pl-3 pr-10 py-3 bg-zinc-50 border border-zinc-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl text-sm transition-all text-zinc-900 placeholder-zinc-400 outline-none disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed"
            placeholder={usageStats.editsRemaining > 0 ? (mode === 'RESUME' ? "Make the header larger..." : "Change font to serif...") : "Purchase more edits to continue..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing || isGenerating || usageStats.editsRemaining <= 0}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button 
                type="submit"
                disabled={!input.trim() || isProcessing || isGenerating || usageStats.editsRemaining <= 0}
                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg disabled:text-zinc-300 disabled:hover:bg-transparent transition-colors"
            >
                <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
        <div className="flex justify-between items-center mt-2">
            <div className="text-[10px] text-zinc-300">
                AI can make mistakes.
            </div>
            {usageStats.editsRemaining > 0 && usageStats.editsRemaining <= 5 && (
                 <div className="flex items-center gap-1 text-[10px] text-orange-500 font-medium animate-pulse cursor-pointer" onClick={onPurchaseEdits}>
                    <AlertTriangle className="w-3 h-3" />
                    {usageStats.editsRemaining} edits left (Top up)
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;