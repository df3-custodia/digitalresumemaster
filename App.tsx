import React, { useEffect, useState } from 'react';
import { PricingTable, SignedIn, SignedOut, UserButton, useClerk, useUser } from '@clerk/clerk-react';
import ResumeInput from './components/ResumeInput';
import PreviewFrame from './components/PreviewFrame';
import ChatSidebar from './components/ChatSidebar';
import LandingPage from './components/LandingPage';
import CustomDomainScreen from './components/CustomDomainScreen';
import { parseResumeText, generateInitialSite, enhanceSiteVisuals, updateSite, determineStyleStrategy, generateComplementaryResume, updateResume } from './services/geminiService';
import { UsageService } from './services/usageService';
import { AppState, ChatMessage, ResumeData, UserPreferences, StyleStrategy } from './types';
import { Layers, Sparkles, Menu, X, Shield, FileText, Mail, Globe, ExternalLink, RotateCcw, AlertCircle, LogOut, User, Server } from 'lucide-react';

const PRO_PLAN_SLUG = 'digitalresumepro';

const App = () => {
  const [view, setView] = useState<'APP' | 'DOMAIN_SETUP'>('APP');
  const { isLoaded, user: clerkUser } = useUser();
  const clerk = useClerk();
  const [state, setState] = useState<AppState>(AppState.INPUT);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  
  // Website State
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [currentStrategy, setCurrentStrategy] = useState<StyleStrategy | null>(null);
  
  // Resume State
  const [resumeHtml, setResumeHtml] = useState<string>('');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // New State for Building Process
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState<string>('');
  
  // Usage Limits
  const [usageStats, setUsageStats] = useState(UsageService.getStats());

  // Publishing state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishUrl, setPublishUrl] = useState<string | null>(null);

  // Menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [subdomain, setSubdomain] = useState('');

  // Billing (best-effort; Clerk Billing APIs are currently marked experimental)
  const [planLabel, setPlanLabel] = useState<string>('Free');
  const [planStatus, setPlanStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [hasProAccess, setHasProAccess] = useState(false);

  const handleLogout = () => {
    setGeneratedHtml('');
    setResumeHtml('');
    setCurrentStrategy(null);
    setMessages([]);
    setState(AppState.INPUT);
    setIsMenuOpen(false);
    // Clerk will handle redirect + session clearing
    clerk.signOut({ redirectUrl: '/' });
  };

  const handleResumeSubmit = async (input: string | { mimeType: string, data: string }, prefs: UserPreferences) => {
    if (!UsageService.canCreateNewSite()) {
      alert(`Daily limit reached. You can generate ${usageStats.creationsRemaining} more sites today. Please try again tomorrow.`);
      return;
    }

    try {
      // 1. IMMEDIATE TRANSITION: Switch view and start loading state
      setIsLoading(true); // Keeps ResumeInput disabled for the split second before unmount
      setIsGenerating(true);
      setState(AppState.PREVIEW);
      
      // Initial Progress
      setProgress(5);
      setLoadingStep('Initializing AI workspace...');
      
      // Step 2: Parse Resume (10-30%)
      setProgress(15);
      setLoadingStep('Reading resume document...');
      const data = await parseResumeText(input);
      setResumeData(data);
      setProgress(30);
      setLoadingStep('Extracting skills & experience...');
      
      // Step 3: Strategy (30-50%)
      setProgress(40);
      setLoadingStep(`Analyzing ${prefs.industry} design patterns...`);
      const strategy = await determineStyleStrategy(data, prefs);
      setCurrentStrategy(strategy);
      
      setProgress(50);
      setLoadingStep(`Generating ${strategy.theme} layout system...`);
      
      // Step 4: Build Base HTML (50-80%)
      const baseHtml = await generateInitialSite(data, strategy);
      setProgress(75);
      setLoadingStep('Compiling components & writing code...');
      
      // Step 5: Polish (80-95%)
      setProgress(85);
      setLoadingStep('Enhancing typography & animations...');
      const polishedHtml = await enhanceSiteVisuals(baseHtml, strategy);
      setProgress(95);
      setLoadingStep('Finalizing build...');
      
      setGeneratedHtml(polishedHtml);
      
      // Add initial bot message
      setMessages([{
        role: 'model',
        text: `I've designed a custom ${strategy.theme} portfolio for you based on your ${prefs.industry} background. I've applied the ${prefs.style} aesthetic with your preferred colors. How does it look?`,
        timestamp: Date.now()
      }]);

      // Update Usage Limits
      UsageService.incrementCreationCount();
      setUsageStats(UsageService.getStats());

      // Final completion delay for UX
      setProgress(100);
      setTimeout(() => {
        setIsGenerating(false);
        setIsLoading(false);
      }, 800);

    } catch (error) {
      console.error(error);
      alert("Something went wrong processing your resume. Please try again.");
      setState(AppState.INPUT); // Revert on error
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!UsageService.canEditSite()) {
        const errorMsg: ChatMessage = { 
            role: 'model', 
            text: `You've reached the maximum number of AI edits for this project. To continue, please publish your site or purchase more edits.`, 
            timestamp: Date.now() 
        };
        setMessages(prev => [...prev, { role: 'user', text, timestamp: Date.now() }, errorMsg]);
        return;
    }

    const userMsg: ChatMessage = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setLoadingStep('Updating design...');

    try {
      let result;
      if (state === AppState.RESUME_BUILDER && resumeHtml) {
        result = await updateResume(resumeHtml, text);
        setResumeHtml(result.html);
      } else {
        result = await updateSite(generatedHtml, text);
        setGeneratedHtml(result.html);
      }
      
      const botMsg: ChatMessage = { 
        role: 'model', 
        text: result.message, 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, botMsg]);

      // Increment Usage
      UsageService.incrementEditCount();
      setUsageStats(UsageService.getStats());

    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = { 
        role: 'model', 
        text: `Sorry, I couldn't update the design right now. Please try again.`, 
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handlePurchaseEdits = async () => {
      // Simulate Payment Processing
      const confirmed = confirm("Purchase 20 more AI edits for $10? (Simulated Payment)");
      if (confirmed) {
          setIsLoading(true);
          setLoadingStep("Processing Payment...");
          setTimeout(() => {
              UsageService.purchaseEdits(20);
              setUsageStats(UsageService.getStats());
              setIsLoading(false);
              setLoadingStep('');
              alert("Payment Successful! 20 edits added.");
          }, 1500);
      }
  };

  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate Vercel SDK Deployment Steps
    setTimeout(() => {
        setIsPublishing(false);
        // Use custom subdomain if provided, otherwise generate random
        const name = subdomain || `digitalresume-${Math.random().toString(36).substring(7)}`;
        setPublishUrl(`https://${name}.vercel.app`);
    }, 2500);
  };

  const handleDownload = () => {
    const htmlToDownload = state === AppState.RESUME_BUILDER ? resumeHtml : generatedHtml;
    const blob = new Blob([htmlToDownload], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = state === AppState.RESUME_BUILDER ? 'resume.html' : 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Enforce URL friendly characters
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(val);
  };

  const handleStartOver = () => {
    if (confirm("Are you sure? This will delete your current site. This counts towards your daily limit.")) {
        setGeneratedHtml('');
        setResumeHtml('');
        setMessages([]);
        setPublishUrl(null);
        setState(AppState.INPUT);
        setIsMenuOpen(false);
    }
  };

  // Switch to Resume Builder Mode
  const handleOpenResumeBuilder = async () => {
    setIsMenuOpen(false);
    if (state === AppState.INPUT) return; // Can't go there yet

    setState(AppState.RESUME_BUILDER);
    
    // Generate resume if not already generated
    if (!resumeHtml && resumeData && currentStrategy) {
      setIsLoading(true);
      setLoadingStep('Designing your print resume...');
      try {
        const resume = await generateComplementaryResume(resumeData, currentStrategy);
        setResumeHtml(resume);
        setMessages(prev => [...prev, {
          role: 'model',
          text: "I've created a printable resume that matches your website's style. You can edit it here or download it as a PDF.",
          timestamp: Date.now()
        }]);
      } catch (err) {
        console.error(err);
        alert("Could not generate resume.");
      } finally {
        setIsLoading(false);
        setLoadingStep('');
      }
    }
  };

  // Switch Back to Website Mode
  const handleOpenWebsiteBuilder = () => {
     setIsMenuOpen(false);
     if (state === AppState.INPUT) return;
     setState(AppState.PREVIEW);
  };

  const userEmail =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress ??
    'User';

  useEffect(() => {
    let cancelled = false;

    async function loadBilling() {
      if (!clerkUser) {
        UsageService.setSubscriptionActive(false);
        setUsageStats(UsageService.getStats());
        setPlanLabel('Free');
        setPlanStatus('unavailable');
        setHasProAccess(false);
        return;
      }

      try {
        setPlanStatus('loading');
        const subscription = await clerk.billing.getSubscription({});
        const proItem = subscription.subscriptionItems.find(
          (i) => i.status === 'active' && i.plan?.slug === PRO_PLAN_SLUG
        );
        const activeItem =
          proItem ??
          subscription.subscriptionItems.find((i) => i.status === 'active') ??
          subscription.subscriptionItems[0];
        const label = activeItem?.plan?.name || 'Free';
        const isProActive = !!proItem;
        if (!cancelled) {
          setHasProAccess(isProActive);
          UsageService.setSubscriptionActive(isProActive);
          setUsageStats(UsageService.getStats());
          setPlanLabel(label);
          setPlanStatus('ready');
        }
      } catch {
        if (!cancelled) {
          UsageService.setSubscriptionActive(false);
          setUsageStats(UsageService.getStats());
          setPlanLabel('Free');
          setPlanStatus('unavailable');
          setHasProAccess(false);
        }
      }
    }

    loadBilling();
    return () => {
      cancelled = true;
    };
  }, [clerk, clerkUser?.id]);

  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (!isLoaded) {
    if (import.meta.env.DEV && isLocalhost && publishableKey?.startsWith('pk_live_')) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900 p-6">
          <div className="max-w-lg w-full rounded-2xl border border-zinc-200 bg-white shadow-xl p-6">
            <div className="text-sm font-bold text-zinc-900">Clerk key/domain mismatch</div>
            <div className="text-sm text-zinc-600 mt-2 leading-relaxed">
              You’re running on <span className="font-mono">localhost</span> but your <span className="font-mono">VITE_CLERK_PUBLISHABLE_KEY</span> is a production key
              (<span className="font-mono">pk_live_…</span>) that’s restricted to your production domain. Clerk will return 400 and never finish loading.
            </div>
            <div className="text-sm text-zinc-600 mt-3">
              Fix: set <span className="font-mono">VITE_CLERK_PUBLISHABLE_KEY</span> to a <span className="font-mono">pk_test_…</span> key for local dev.
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900">
        <div className="text-sm font-medium text-zinc-500">Loading…</div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <LandingPage onStart={() => clerk.openSignUp({})} />
      </SignedOut>

      <SignedIn>
        {!hasProAccess ? (
          <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center p-6">
            <div className="w-full max-w-3xl">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-2xl font-bold tracking-tight">Start your 3-day trial</div>
                  <div className="text-sm text-zinc-500 mt-1">
                    You need an active subscription to use the builder.
                  </div>
                </div>
                <div className="shrink-0">
                  <UserButton />
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 shadow-xl bg-white p-6">
                {planStatus === 'unavailable' ? (
                  <div className="text-sm text-zinc-600">
                    Billing isn’t available yet (or failed to load). Enable Clerk Billing and make your plan public, then refresh.
                  </div>
                ) : (
                  <PricingTable for="user" ctaPosition="bottom" newSubscriptionRedirectUrl="/" />
                )}
              </div>
            </div>
          </div>
        ) : view === 'DOMAIN_SETUP' ? (
          <CustomDomainScreen onBack={() => setView('APP')} />
        ) : (
          <div className="flex flex-col h-screen w-full overflow-hidden bg-white text-zinc-900 font-sans">
            {/* Global Header */}
            <header className="h-14 bg-white/80 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-30 relative">
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => (state !== AppState.INPUT ? setState(AppState.PREVIEW) : null)}
              >
                <div className="w-7 h-7 bg-black text-white rounded-md flex items-center justify-center shadow-lg shadow-black/20">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm tracking-tight text-zinc-900">
                  DigitalResume {state === AppState.RESUME_BUILDER && <span className="text-zinc-400 font-normal">/ Print</span>}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {state !== AppState.INPUT && (
                  <button
                    onClick={handleStartOver}
                    className="text-xs font-medium text-zinc-500 hover:text-black md:hidden bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full"
                  >
                    New Project
                  </button>
                )}
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-200">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-zinc-500">{userEmail}</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`p-2 rounded-lg transition-colors ${isMenuOpen ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}
                    aria-label="Menu"
                  >
                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Dropdown Menu Overlay */}
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsMenuOpen(false)}></div>
                  <div className="absolute top-16 right-4 md:right-6 w-80 bg-white rounded-xl shadow-2xl border border-zinc-200 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0">
                          <UserButton />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-zinc-900 truncate max-w-[180px]">{userEmail}</span>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wide">
                            {planStatus === 'loading' ? 'Checking plan…' : `${planLabel} Plan`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Only show site options if not in Input mode */}
                      {state !== AppState.INPUT && (
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Project Tools</label>
                          <nav className="space-y-1">
                            <button
                              onClick={handleOpenWebsiteBuilder}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors group mb-1 ${state === AppState.PREVIEW ? 'bg-zinc-100 text-zinc-900 font-bold' : 'text-zinc-600 hover:bg-zinc-50'}`}
                            >
                              <Layers className="w-4 h-4" />
                              <span>Website Editor</span>
                              {state === AppState.PREVIEW && <span className="ml-auto text-xs bg-white border border-zinc-200 px-1.5 rounded text-zinc-400">Active</span>}
                            </button>

                            <button
                              onClick={handleOpenResumeBuilder}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors group mb-1 ${state === AppState.RESUME_BUILDER ? 'bg-zinc-100 text-zinc-900 font-bold' : 'text-zinc-600 hover:bg-zinc-50'}`}
                            >
                              <FileText className="w-4 h-4" />
                              <span>Resume Builder</span>
                              {state === AppState.RESUME_BUILDER && <span className="ml-auto text-xs bg-white border border-zinc-200 px-1.5 rounded text-zinc-400">Active</span>}
                            </button>
                          </nav>

                          <div className="mt-4">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Custom Address</label>
                            <div className="flex items-center group">
                              <input
                                value={subdomain}
                                onChange={handleSubdomainChange}
                                placeholder="your-name"
                                className="bg-zinc-50 border border-zinc-200 border-r-0 rounded-l-lg py-2.5 pl-3 pr-1 text-sm w-full outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-300 font-mono text-zinc-800"
                                disabled={!!publishUrl}
                              />
                              <div className="bg-zinc-100 border border-zinc-200 border-l-0 rounded-r-lg py-2.5 px-3 text-sm text-zinc-400 select-none font-mono">
                                .vercel.app
                              </div>
                            </div>
                            <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">
                              {publishUrl ? 'Site is live. Changes require re-deployment.' : 'Choose a unique subdomain for your portfolio.'}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="h-px bg-zinc-100 w-full"></div>

                      <nav className="space-y-1">
                        {/* CONNECT CUSTOM DOMAIN BUTTON */}
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            setView('DOMAIN_SETUP');
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors group mb-2 font-medium"
                        >
                          <Globe className="w-4 h-4 text-blue-500" />
                          <span>Connect Custom Domain</span>
                        </button>

                        {state !== AppState.INPUT && (
                          <button
                            onClick={handleStartOver}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group mb-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Start Over</span>
                            <span className="ml-auto text-xs opacity-60 font-mono border border-red-200 px-1.5 rounded">{usageStats.creationsRemaining} left</span>
                          </button>
                        )}

                        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors group">
                          <Mail className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600" />
                          <span>Contact Support</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors group">
                          <Shield className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600" />
                          <span>Privacy Policy</span>
                        </a>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors group"
                        >
                          <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600" />
                          <span>Log Out</span>
                        </button>

                        <button
                          onClick={() => clerk.openUserProfile({ __experimental_startPath: '/billing' })}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors group"
                        >
                          <Server className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600" />
                          <span>Manage Billing</span>
                        </button>
                      </nav>

                      <div className="h-px bg-zinc-100 w-full"></div>

                      <div className="flex items-center justify-between text-[10px] text-zinc-400 px-1">
                        <span>Version 1.3.0</span>
                        <div className="flex items-center gap-2">
                          {usageStats.creationsRemaining <= 1 && <AlertCircle className="w-3 h-3 text-orange-500" />}
                          <span>{usageStats.creationsRemaining} gens left today</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative flex flex-col">
              {state === AppState.INPUT ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto bg-zinc-50/50">
                  <ResumeInput onSubmit={handleResumeSubmit} isLoading={isLoading} loadingText={loadingStep} />
                </div>
              ) : (
                <div className="flex h-full w-full overflow-hidden flex-col md:flex-row">
                  {/* Main Preview Area */}
                  <div className="flex-1 h-full relative z-0 bg-[#FAFAFA]">
                    <PreviewFrame
                      html={state === AppState.RESUME_BUILDER ? resumeHtml : generatedHtml}
                      isGenerating={isGenerating}
                      loadingStep={loadingStep}
                      progress={progress}
                      mode={state === AppState.RESUME_BUILDER ? 'RESUME' : 'WEBSITE'}
                    />
                  </div>

                  {/* Right Sidebar (Chat) */}
                  <div className="h-[40vh] md:h-full md:w-[380px] shrink-0 border-t md:border-t-0 md:border-l border-zinc-200 z-10 shadow-xl shadow-zinc-200/50 bg-white">
                    <ChatSidebar
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      isProcessing={isLoading}
                      isGenerating={isGenerating}
                      onPublish={handlePublish}
                      isPublishing={isPublishing}
                      publishUrl={publishUrl}
                      onDownload={handleDownload}
                      usageStats={usageStats}
                      onPurchaseEdits={handlePurchaseEdits}
                      mode={state === AppState.RESUME_BUILDER ? 'RESUME' : 'WEBSITE'}
                    />
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </SignedIn>
    </>
  );
};

export default App;