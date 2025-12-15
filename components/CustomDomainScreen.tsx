import React, { useState } from 'react';
import { ArrowLeft, Globe, Copy, Check, Server, ShieldCheck, ExternalLink, Loader2, AlertCircle, HelpCircle } from 'lucide-react';

interface CustomDomainScreenProps {
  onBack: () => void;
}

const CustomDomainScreen: React.FC<CustomDomainScreenProps> = ({ onBack }) => {
  const [domain, setDomain] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Input, 2: Instructions, 3: Success
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [copiedA, setCopiedA] = useState(false);
  const [copiedCNAME, setCopiedCNAME] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    // Basic clean up of domain input
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    setDomain(cleanDomain);
    setStep(2);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate DNS propagation check
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3);
    }, 2500);
  };

  const copyToClipboard = (text: string, type: 'A' | 'CNAME') => {
    navigator.clipboard.writeText(text);
    if (type === 'A') {
      setCopiedA(true);
      setTimeout(() => setCopiedA(false), 2000);
    } else {
      setCopiedCNAME(true);
      setTimeout(() => setCopiedCNAME(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Editor
        </button>
        <div className="font-bold text-zinc-900">Domain Setup</div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full p-6 md:p-12">
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 1 ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-400'}`}>1</div>
           <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 2 ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-400'}`}>2</div>
           <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-zinc-900' : 'bg-zinc-200'}`}></div>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 3 ? 'bg-green-500 text-white' : 'bg-zinc-200 text-zinc-400'}`}>3</div>
        </div>

        {/* STEP 1: Enter Domain */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-200 p-8 md:p-12 animate-[fadeIn_0.3s_ease-out]">
             <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7" />
             </div>
             <h1 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">Connect your custom domain</h1>
             <p className="text-zinc-500 mb-8 text-lg leading-relaxed">
               Already own a domain from GoDaddy, Namecheap, or Google? Enter it below to start the connection process.
             </p>

             <form onSubmit={handleNext}>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Domain Name</label>
                <div className="relative mb-8">
                  <input 
                    type="text" 
                    placeholder="example.com"
                    className="w-full text-xl md:text-2xl p-4 pl-6 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-zinc-900 placeholder:text-zinc-300"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    autoFocus
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={!domain}
                  className="w-full py-4 bg-zinc-900 hover:bg-black text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
             </form>
             
             <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50/50 rounded-lg text-sm text-blue-800">
                <HelpCircle className="w-5 h-5 shrink-0" />
                <p>Don't have a domain? We recommend buying one from <a href="https://godaddy.com" target="_blank" rel="noreferrer" className="underline font-bold">GoDaddy</a> first, then coming back here.</p>
             </div>
          </div>
        )}

        {/* STEP 2: DNS Records */}
        {step === 2 && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-200 overflow-hidden">
                <div className="p-8 md:p-10 pb-0">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Update DNS Records</h2>
                    <p className="text-zinc-500">
                        Log in to your domain provider (e.g., GoDaddy) and find the <strong>DNS Settings</strong> or <strong>Manage DNS</strong> section.
                    </p>
                </div>

                <div className="p-8 md:p-10 space-y-6">
                    {/* Record 1 */}
                    <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-zinc-200 rounded text-xs font-bold text-zinc-600">Type A</span>
                                <span className="text-sm font-medium text-zinc-900">Root Domain (@)</span>
                            </div>
                            <div className="text-xs text-zinc-400 uppercase tracking-wide font-bold">Value</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <code className="flex-1 bg-white border border-zinc-200 p-3 rounded-lg font-mono text-zinc-800 text-lg">
                                76.76.21.21
                            </code>
                            <button 
                                onClick={() => copyToClipboard('76.76.21.21', 'A')}
                                className="p-3 bg-white border border-zinc-200 hover:border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                                title="Copy"
                            >
                                {copiedA ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-zinc-400" />}
                            </button>
                        </div>
                    </div>

                    {/* Record 2 */}
                    <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-zinc-200 rounded text-xs font-bold text-zinc-600">CNAME</span>
                                <span className="text-sm font-medium text-zinc-900">Subdomain (www)</span>
                            </div>
                            <div className="text-xs text-zinc-400 uppercase tracking-wide font-bold">Value</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <code className="flex-1 bg-white border border-zinc-200 p-3 rounded-lg font-mono text-zinc-800 text-lg truncate">
                                cname.vercel-dns.com
                            </code>
                            <button 
                                onClick={() => copyToClipboard('cname.vercel-dns.com', 'CNAME')}
                                className="p-3 bg-white border border-zinc-200 hover:border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
                                title="Copy"
                            >
                                {copiedCNAME ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-zinc-400" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 text-sm text-amber-700 bg-amber-50 p-4 rounded-lg border border-amber-100">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>It may take up to 24 hours for these changes to propagate worldwide, though it usually happens in minutes.</p>
                    </div>
                </div>

                <div className="p-8 border-t border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                    <button onClick={() => setStep(1)} className="text-zinc-500 font-medium hover:text-zinc-900">Back</button>
                    <button 
                        onClick={handleVerify}
                        disabled={isVerifying}
                        className="px-8 py-3 bg-zinc-900 hover:bg-black text-white rounded-lg font-bold shadow-lg flex items-center gap-2 disabled:opacity-70"
                    >
                        {isVerifying ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Verifying Records...
                            </>
                        ) : (
                            'Verify Connection'
                        )}
                    </button>
                </div>
            </div>
          </div>
        )}

        {/* STEP 3: Success */}
        {step === 3 && (
            <div className="bg-white rounded-2xl shadow-xl shadow-green-500/10 border border-green-100 p-12 text-center animate-[fadeIn_0.5s_ease-out]">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-zinc-900 mb-4">Domain Connected!</h2>
                <p className="text-zinc-500 text-lg mb-8 max-w-md mx-auto">
                    Great job! <strong>{domain}</strong> is now successfully linked to your portfolio. An SSL certificate is being generated automatically.
                </p>
                
                <div className="flex justify-center gap-4">
                    <button 
                        onClick={onBack}
                        className="px-8 py-3 bg-white border border-zinc-200 text-zinc-900 rounded-lg font-bold hover:bg-zinc-50 transition-colors"
                    >
                        Back to Editor
                    </button>
                    <a 
                        href={`https://${domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold shadow-lg shadow-green-600/20 transition-all flex items-center gap-2"
                    >
                        Visit Website
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default CustomDomainScreen;