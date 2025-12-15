import React, { useEffect, useRef, useState } from 'react';
import { Smartphone, Monitor, RotateCcw, ExternalLink, Cpu, Code2, Layers, CheckCircle, Loader2, Printer } from 'lucide-react';

interface PreviewFrameProps {
  html: string;
  isGenerating?: boolean;
  loadingStep?: string;
  progress?: number;
  mode?: 'WEBSITE' | 'RESUME';
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ html, isGenerating, loadingStep, progress = 0, mode = 'WEBSITE' }) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [key, setKey] = useState(0); // To force reload
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Force reset device to desktop when switching to resume mode
    if (mode === 'RESUME') {
        setDevice('desktop');
    }
  }, [mode]);

  const handleReload = () => {
    setKey(prev => prev + 1);
  };

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.print();
    }
  };

  if (isGenerating) {
    return (
      <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden font-mono p-6">
         {/* Tech Background */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
         <div className="absolute inset-0 bg-radial-gradient from-blue-500/5 to-transparent blur-2xl pointer-events-none"></div>

         <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 relative z-10">
            <div className="flex items-center gap-3 mb-8 border-b border-zinc-800 pb-6">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 animate-pulse">
                    <Cpu className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-zinc-100 font-bold text-lg">AI Architect</h3>
                    <p className="text-zinc-500 text-xs">Building your {mode === 'RESUME' ? 'resume' : 'portfolio'}...</p>
                </div>
                <div className="ml-auto text-zinc-400 font-bold">{Math.round(progress)}%</div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-zinc-800 rounded-full mb-8 overflow-hidden">
                <div 
                    className="h-full bg-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Step List */}
            <div className="space-y-4">
                <BuildStep 
                    label="Analyzing Resume" 
                    status={progress > 15 ? 'done' : progress > 5 ? 'active' : 'waiting'} 
                />
                <BuildStep 
                    label="Determining Design Strategy" 
                    status={progress > 40 ? 'done' : progress > 20 ? 'active' : 'waiting'} 
                />
                <BuildStep 
                    label="Generating Codebase" 
                    status={progress > 75 ? 'done' : progress > 45 ? 'active' : 'waiting'} 
                />
                <BuildStep 
                    label="Enhancing Visuals" 
                    status={progress > 90 ? 'done' : progress > 80 ? 'active' : 'waiting'} 
                />
            </div>

            {/* Current Log Line */}
            <div className="mt-8 bg-black rounded-lg p-3 text-xs text-zinc-400 font-mono border border-zinc-800 flex items-center gap-2">
                <span className="text-green-500">➜</span>
                <span className="animate-pulse">{loadingStep}</span>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#FAFAFA] flex flex-col relative overflow-hidden">
       {/* Background Grid Pattern */}
       <div className="absolute inset-0 bg-grid-black/[0.02] bg-[length:24px_24px] pointer-events-none"></div>

       {/* Toolbar */}
       <div className="h-12 bg-white border-b border-zinc-200 flex items-center justify-between px-4 shadow-sm shrink-0 z-10">
          <div className="flex items-center gap-2">
             {mode === 'WEBSITE' ? (
                 <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
                    <button 
                      onClick={() => setDevice('desktop')}
                      className={`p-1.5 rounded-md transition-all ${device === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-zinc-400 hover:text-zinc-600'}`}
                      title="Desktop View"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDevice('mobile')}
                      className={`p-1.5 rounded-md transition-all ${device === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-zinc-400 hover:text-zinc-600'}`}
                      title="Mobile View"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                 </div>
             ) : (
                <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 px-3 py-1.5 items-center gap-2 text-xs font-bold text-zinc-500">
                    <Printer className="w-3.5 h-3.5" />
                    Print Mode
                </div>
             )}
             
             <div className="h-4 w-px bg-zinc-200 mx-1"></div>
             <button onClick={handleReload} className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors rounded-md hover:bg-zinc-100">
               <RotateCcw className="w-3.5 h-3.5" />
             </button>
          </div>

          <div className="flex-1 flex justify-center mx-4">
             <div className="bg-zinc-50 border border-zinc-200 px-3 py-1 rounded text-[10px] text-zinc-400 font-mono flex items-center gap-2 select-none">
               <span className={`w-1.5 h-1.5 rounded-full ${mode === 'RESUME' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
               {mode === 'RESUME' ? 'resume.pdf' : 'https://portfolio.dev'}
             </div>
          </div>

          <div className="w-20 flex justify-end">
             {mode === 'RESUME' && (
                 <button 
                    onClick={handlePrint}
                    className="p-1.5 text-zinc-500 hover:text-zinc-900 transition-colors"
                    title="Print PDF"
                 >
                    <Printer className="w-4 h-4" />
                 </button>
             )}
          </div>
       </div>

       {/* Canvas Area */}
       <div className="flex-1 overflow-hidden flex justify-center items-center relative z-0 p-4 md:p-8">
         <div 
            className={`transition-all duration-500 ease-in-out bg-white shadow-2xl shadow-zinc-200/50 rounded-xl border border-zinc-200 overflow-hidden relative flex flex-col
              ${mode === 'RESUME' 
                 ? 'w-[816px] h-[1056px] scale-[0.6] md:scale-[0.8] origin-top' 
                 : device === 'mobile' 
                    ? 'w-[375px] h-[812px]' 
                    : 'w-full h-full max-w-[1400px]'}
            `}
         >
           {/* Browser Controls (Only visible on Desktop mode for aesthetic) */}
           {device === 'desktop' && mode === 'WEBSITE' && (
             <div className="h-8 bg-white border-b border-zinc-100 flex items-center px-3 gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-200"></div>
             </div>
           )}

           <iframe
              ref={iframeRef}
              key={key}
              srcDoc={html}
              title={mode === 'RESUME' ? 'Resume Preview' : 'Website Preview'}
              className="flex-1 w-full h-full bg-white"
              // Removed allow-same-origin for better security.
              // This gives the iframe a unique origin, preventing it from accessing parent cookies/storage.
              sandbox="allow-scripts allow-popups allow-modals"
           />
         </div>
       </div>
    </div>
  );
};

// Helper component for build steps
const BuildStep = ({ label, status }: { label: string, status: 'waiting' | 'active' | 'done' }) => {
    return (
        <div className={`flex items-center gap-3 transition-colors duration-300 ${status === 'waiting' ? 'opacity-30' : 'opacity-100'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300
                ${status === 'done' ? 'bg-green-500 border-green-500' : 
                  status === 'active' ? 'border-blue-500' : 'border-zinc-700'
                }
            `}>
                {status === 'done' ? <CheckCircle className="w-3 h-3 text-white" /> : 
                 status === 'active' ? <Loader2 className="w-3 h-3 text-blue-500 animate-spin" /> : 
                 null}
            </div>
            <span className={`text-sm ${status === 'active' ? 'text-blue-400 font-medium' : 'text-zinc-300'}`}>
                {label}
            </span>
        </div>
    );
};

export default PreviewFrame;