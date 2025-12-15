import React, { useState } from 'react';
import { FileText, Sparkles, Upload, FileType, X, Briefcase, Palette, ArrowRight, ArrowLeft, Check, LayoutTemplate, Loader2 } from 'lucide-react';
import { UserPreferences } from '../types';

interface ResumeInputProps {
  onSubmit: (input: string | { mimeType: string, data: string }, prefs: UserPreferences) => void;
  isLoading: boolean;
  loadingText?: string;
}

interface FileData {
  name: string;
  mimeType: string;
  data: string; // Base64
}

const INDUSTRIES = [
  "Technology & Engineering", "Design & Creative", "Marketing & Sales", "Finance & Business", "Academic & Science", "Legal", "Health", "Other"
];

const STYLES = [
  { id: 'modern', name: 'Modern Tech', desc: 'Clean, bold, startup vibe', color: 'bg-blue-50 border-blue-200' },
  { id: 'minimal', name: 'Swiss Minimal', desc: 'Whitespace, typography focus', color: 'bg-zinc-50 border-zinc-200' },
  { id: 'creative', name: 'Bold Creative', desc: 'Large type, high contrast', color: 'bg-purple-50 border-purple-200' },
  { id: 'professional', name: 'Executive', desc: 'Traditional, trustworthy', color: 'bg-slate-50 border-slate-200' },
];

const COLORS = [
  { id: 'blue', class: 'bg-blue-600' },
  { id: 'black', class: 'bg-zinc-900' },
  { id: 'emerald', class: 'bg-emerald-600' },
  { id: 'violet', class: 'bg-violet-600' },
  { id: 'orange', class: 'bg-orange-600' },
];

const ResumeInput: React.FC<ResumeInputProps> = ({ onSubmit, isLoading, loadingText }) => {
  const [step, setStep] = useState(1);
  const [text, setText] = useState('');
  const [file, setFile] = useState<FileData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);

  // User Preferences State
  const [prefs, setPrefs] = useState<UserPreferences>({
    industry: '',
    experienceLevel: 'Mid-Level',
    style: 'modern',
    color: 'black'
  });

  const handlePaste = () => {
    navigator.clipboard.readText().then(clipText => {
        setText(clipText);
        setFile(null); 
    });
  };

  const handleSample = () => {
    const sample = `ALEXANDER THORNE\nCreative Director & Design Engineer...`; 
    setText(sample); 
    setFile(null);
  };

  const processFile = async (droppedFile: File) => {
    setIsReading(true);
    if (droppedFile.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setFile({ name: droppedFile.name, mimeType: "application/pdf", data: result.split(',')[1] });
            setText('');
            setIsReading(false);
        };
        reader.readAsDataURL(droppedFile);
    } else if (droppedFile.name.endsWith(".docx")) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                // Dynamically import mammoth only when needed
                // @ts-ignore
                const mammoth = await import('mammoth');
                
                const arrayBuffer = e.target?.result as ArrayBuffer;
                const result = await mammoth.default.extractRawText({ arrayBuffer });
                setText(result.value);
                setFile(null);
            } catch (err) {
                console.error(err);
                alert("Could not read Word doc.");
            } finally { setIsReading(false); }
        };
        reader.readAsArrayBuffer(droppedFile);
    } else if (droppedFile.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => { setText(e.target?.result as string); setFile(null); setIsReading(false); };
        reader.readAsText(droppedFile);
    } else {
        alert("Unsupported file.");
        setIsReading(false);
    }
  };

  const handleSubmit = () => {
    if (file) {
        onSubmit({ mimeType: file.mimeType, data: file.data }, prefs);
    } else if (text) {
        onSubmit(text, prefs);
    }
  };

  const nextStep = () => {
      if (step === 1 && (file || text)) setStep(2);
      if (step === 2 && prefs.industry) setStep(3);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6 max-w-3xl mx-auto w-full relative z-10 font-sans">
      
      {/* Progress Indicator */}
      <div className="flex items-center gap-4 mb-10 w-full max-w-md">
          {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className={`w-full h-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${step >= i ? 'text-zinc-900' : 'text-zinc-300'}`}>
                      {i === 1 ? 'Import' : i === 2 ? 'Context' : 'Style'}
                  </span>
              </div>
          ))}
      </div>

      <div className="w-full bg-white rounded-3xl shadow-2xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden relative min-h-[500px] flex flex-col">
        
        {/* STEP 1: UPLOAD */}
        {step === 1 && (
            <div className="flex-1 flex flex-col p-8 md:p-12 animate-[fadeIn_0.3s_ease-out]">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Let's start with your resume</h2>
                    <p className="text-zinc-500">We'll extract your experience to build the foundation.</p>
                </div>

                <div 
                    className={`flex-1 border-2 border-dashed rounded-2xl transition-all relative flex flex-col items-center justify-center p-6
                        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}
                    `}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); }}
                >
                    {isReading ? (
                        <div className="flex flex-col items-center animate-pulse">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                            <p className="text-xs text-zinc-400">Reading file...</p>
                        </div>
                    ) : file ? (
                        <div className="text-center">
                             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FileType className="w-8 h-8" />
                             </div>
                             <h3 className="font-bold text-zinc-900 mb-1">{file.name}</h3>
                             <p className="text-xs text-zinc-500 mb-4">Ready to analyze</p>
                             <button onClick={() => setFile(null)} className="text-xs font-bold text-red-500 hover:underline">Remove</button>
                        </div>
                    ) : text ? (
                        <div className="w-full h-full relative">
                            <textarea 
                                value={text} 
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-full bg-transparent resize-none outline-none text-xs font-mono text-zinc-600"
                                placeholder="Paste resume text..."
                            />
                            <button onClick={() => setText('')} className="absolute top-0 right-0 p-1 bg-zinc-200 rounded-full hover:bg-zinc-300"><X className="w-3 h-3" /></button>
                        </div>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-zinc-400">
                                <Upload className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-medium text-zinc-600 mb-1">Drag & drop or paste text</p>
                            <div className="flex gap-2 text-xs text-zinc-400">
                                <label htmlFor="file-upload" className="underline cursor-pointer hover:text-zinc-900">Upload PDF</label>
                                <span>or</span>
                                <button onClick={handlePaste} className="underline hover:text-zinc-900">Paste</button>
                            </div>
                            <input type="file" id="file-upload" className="hidden" onChange={(e) => { if(e.target.files?.[0]) processFile(e.target.files[0]) }} accept=".pdf,.docx,.txt" />
                        </>
                    )}
                </div>
            </div>
        )}

        {/* STEP 2: CONTEXT */}
        {step === 2 && (
            <div className="flex-1 flex flex-col p-8 md:p-12 animate-[fadeIn_0.3s_ease-out]">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Help the AI understand you</h2>
                    <p className="text-zinc-500">This helps us tailor the structure and tone.</p>
                </div>

                <div className="space-y-8 max-w-md mx-auto w-full">
                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Primary Industry</label>
                        <div className="grid grid-cols-2 gap-3">
                            {INDUSTRIES.map(ind => (
                                <button
                                    key={ind}
                                    onClick={() => setPrefs({...prefs, industry: ind})}
                                    className={`p-3 rounded-xl text-left text-sm font-medium transition-all border
                                        ${prefs.industry === ind 
                                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                                            : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'}
                                    `}
                                >
                                    {ind}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Experience Level</label>
                        <div className="flex bg-zinc-100 p-1 rounded-xl">
                            {['Entry', 'Mid-Level', 'Senior', 'Executive'].map(level => (
                                <button
                                    key={level}
                                    onClick={() => setPrefs({...prefs, experienceLevel: level})}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all
                                        ${prefs.experienceLevel === level 
                                            ? 'bg-white text-zinc-900 shadow-sm' 
                                            : 'text-zinc-500 hover:text-zinc-700'}
                                    `}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* STEP 3: AESTHETICS */}
        {step === 3 && (
            <div className="flex-1 flex flex-col p-8 md:p-12 animate-[fadeIn_0.3s_ease-out]">
                 <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Define your aesthetic</h2>
                    <p className="text-zinc-500">Choose a starting point. You can change this later.</p>
                </div>

                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        {STYLES.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setPrefs({...prefs, style: s.id})}
                                className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group
                                    ${prefs.style === s.id 
                                        ? 'border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50' 
                                        : 'border-zinc-100 hover:border-zinc-300 bg-white'}
                                `}
                            >
                                <div className={`w-8 h-8 rounded-full mb-3 flex items-center justify-center ${s.color}`}>
                                    <LayoutTemplate className="w-4 h-4 text-zinc-700" />
                                </div>
                                <h4 className="font-bold text-zinc-900 text-sm">{s.name}</h4>
                                <p className="text-xs text-zinc-500 mt-1">{s.desc}</p>
                                {prefs.style === s.id && (
                                    <div className="absolute top-4 right-4 text-zinc-900"><Check className="w-4 h-4" /></div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 text-center">Accent Color</label>
                        <div className="flex justify-center gap-4">
                            {COLORS.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setPrefs({...prefs, color: c.id})}
                                    className={`w-10 h-10 rounded-full ${c.class} transition-transform hover:scale-110 flex items-center justify-center
                                        ${prefs.color === c.id ? 'ring-2 ring-offset-2 ring-zinc-900 scale-110' : ''}
                                    `}
                                >
                                    {prefs.color === c.id && <Check className="w-4 h-4 text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="p-6 border-t border-zinc-100 flex justify-between items-center bg-zinc-50/50">
             {step > 1 ? (
                 <button 
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 px-4 py-2"
                    disabled={isLoading}
                 >
                     <ArrowLeft className="w-4 h-4" /> Back
                 </button>
             ) : (
                 <div className="w-20"></div> // Spacer
             )}

             {step < 3 ? (
                 <button 
                    onClick={nextStep}
                    disabled={step === 1 ? (!file && !text) : (!prefs.industry)}
                    className="bg-zinc-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                 >
                     Next Step <ArrowRight className="w-4 h-4" />
                 </button>
             ) : (
                <button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-zinc-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-70 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {loadingText || 'Generating...'}
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            Generate Website
                        </>
                    )}
                </button>
             )}
        </div>
      </div>
    </div>
  );
};

export default ResumeInput;