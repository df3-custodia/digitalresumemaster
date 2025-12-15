import React, { useState, useEffect } from 'react';
import { PricingTable, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Sparkles, Zap, ArrowRight, CheckCircle, Layout, TrendingUp, Share2, Award, Shield, Play, MousePointer2, Briefcase, ChevronRight, BarChart3, Globe, ChevronLeft, Terminal, Code2, ArrowUpRight, Send, Loader2, Upload, XCircle } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const DEMO_SLIDES = [
  {
    id: 'tech',
    url: 'alexcode.io',
    initials: '/>',
    theme: { bg: 'bg-zinc-950' },
    chat: {
        user: "Make it look like a terminal.",
        ai: "I've applied a dark monolithic theme with monospace typography and emerald accents.",
        input: "Add a project section..."
    }
  },
  {
    id: 'business',
    url: 'sarahjenkins.co',
    initials: 'SJ',
    theme: { bg: 'bg-white' },
    chat: {
        user: "I need a clean, executive look.",
        ai: "Switching to a serif font pairing with an editorial layout for maximum readability.",
        input: "Make the summary shorter..."
    }
  },
  {
    id: 'creative',
    url: 'marco.studio',
    initials: 'M.',
    theme: { bg: 'bg-[#EAE8E4]' },
    chat: {
        user: "Make it bold and artistic.",
        ai: "Applying a Swiss-style grid with large typography and high-contrast colors.",
        input: "Change the accent color..."
    }
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DEMO_SLIDES.length);
    }, 6000); // 6 seconds auto-scroll
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % DEMO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + DEMO_SLIDES.length) % DEMO_SLIDES.length);

  const slide = DEMO_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 font-sans overflow-x-hidden relative selection:bg-blue-100 selection:text-blue-900">
      
      {/* Abstract Background Gradients - Blue biased for trust */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50/80 rounded-full blur-[120px] mix-blend-multiply opacity-60"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-indigo-50/80 rounded-full blur-[120px] mix-blend-multiply opacity-60"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full pl-6 pr-2 py-2 w-full max-w-4xl flex items-center justify-between ring-1 ring-black/5 transition-all hover:ring-blue-900/5 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]">
          
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
             <div className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay"></div>
               <span className="font-bold font-serif italic text-lg pr-0.5 relative z-10">D</span>
             </div>
             <span className="font-semibold text-sm tracking-tight text-zinc-900 group-hover:text-blue-600 transition-colors">DigitalResume</span>
          </div>

          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <a href="#how-it-works" className="text-xs font-medium text-zinc-500 hover:text-blue-600 transition-colors uppercase tracking-widest">How it Works</a>
            <a href="#pricing" className="text-xs font-medium text-zinc-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Pricing</a>
          </div>

          <button 
            onClick={onStart}
            className="px-6 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-bold uppercase tracking-wide hover:bg-blue-600 transition-all hover:scale-105 shadow-lg shadow-zinc-900/20 hover:shadow-blue-600/20 active:scale-95"
          >
            Start 3-Day Free Trial
          </button>
        </div>
      </nav>

      {/* Hero Section - Full Viewport Height */}
      <section className="h-[100dvh] pt-32 pb-4 px-4 md:px-6 relative z-10 flex flex-col justify-center overflow-hidden">
        <div className="max-w-[1400px] mx-auto text-center flex flex-col items-center justify-between h-full w-full gap-4 md:gap-8">
            
          {/* Header Text Group - Compact */}
          <div className="shrink-0 flex flex-col items-center justify-end flex-1 min-h-0 pt-4 md:pt-8">
             <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-bold tracking-tighter leading-[1] text-zinc-900 mx-auto max-w-5xl">
                Turn your resume <br/>
                <span className="text-zinc-300 relative inline-block">
                into a Portfolio.
                <span className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full opacity-0 animate-[expandWidth_1s_ease-out_1s_forwards]"></span>
                </span>
            </h1>
          </div>

          {/* Demo Carousel - Main Visual */}
          <div className="w-full max-w-5xl relative perspective-1000 shrink min-h-0 flex flex-col items-center justify-center z-20">
             {/* Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/20 blur-[80px] rounded-full pointer-events-none"></div>
             
             {/* Controls */}
             <button 
               onClick={prevSlide}
               className="absolute -left-2 md:-left-12 lg:-left-16 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white shadow-xl text-zinc-900 hover:scale-110 active:scale-95 transition-all border border-zinc-100 hidden md:flex"
             >
               <ChevronLeft className="w-5 h-5" />
             </button>
             <button 
               onClick={nextSlide}
               className="absolute -right-2 md:-right-12 lg:-right-16 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white shadow-xl text-zinc-900 hover:scale-110 active:scale-95 transition-all border border-zinc-100 hidden md:flex"
             >
               <ChevronRight className="w-5 h-5" />
             </button>

             {/* Main Card - constrained by height (vh) to fit screen */}
             <div className="relative rounded-[1rem] md:rounded-[2rem] bg-zinc-900 p-1 md:p-2 shadow-2xl ring-1 ring-zinc-900/5 rotate-x-2 md:rotate-x-3 transform-gpu transition-transform hover:rotate-0 duration-1000 ease-out mx-auto w-full aspect-[16/10] md:aspect-[21/11] max-h-[40vh] md:max-h-[45vh] lg:max-h-[50vh]">
                <div className="rounded-[0.8rem] md:rounded-[1.5rem] overflow-hidden bg-white relative w-full h-full flex flex-col">
                    {/* Browser Header */}
                    <div className="h-6 md:h-8 bg-white border-b border-zinc-100 flex items-center px-3 gap-1.5 z-20 relative shrink-0">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-400/20"></div>
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-yellow-400/20"></div>
                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-400/20"></div>
                        </div>
                        <div className="flex-1 text-center">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-100 text-[8px] md:text-[10px] font-mono text-zinc-500">
                                <Shield className="w-2 h-2 md:w-3 md:h-3 text-zinc-400" />
                                {slide.url}
                            </div>
                        </div>
                    </div>
                    
                    {/* Main Split Content */}
                    <div className="flex-1 flex overflow-hidden relative">
                        
                        {/* LEFT: Website Preview Content Area */}
                        <div className="flex-1 relative overflow-hidden border-r border-zinc-200">
                            
                            {/* Slide 1: Tech / Minimal / Terminal */}
                            {slide.id === 'tech' && (
                                <div className="absolute inset-0 bg-zinc-950 text-white font-mono p-6 md:p-12 flex flex-col animate-[fadeIn_0.5s_ease-out]">
                                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                                    
                                    <nav className="relative z-10 flex justify-between items-center mb-16 opacity-80">
                                        <div className="font-bold text-lg tracking-tight">alex_chen.dev</div>
                                        <div className="flex gap-6 text-sm text-zinc-500">
                                            <span className="hover:text-emerald-400 cursor-pointer">/work</span>
                                            <span className="hover:text-emerald-400 cursor-pointer">/about</span>
                                        </div>
                                    </nav>
                                    
                                    <div className="relative z-10 flex-1 flex flex-col justify-center max-w-2xl">
                                        <div className="text-emerald-500 mb-4 text-xs md:text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                            Open for Work
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter">
                                            Full-Stack Engineer <br/>
                                            <span className="text-zinc-600">& System Architect.</span>
                                        </h2>
                                        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-md mb-8">
                                            Specialized in high-performance distributed systems. 
                                            Currently building the future of cloud infrastructure at Vercel.
                                        </p>
                                        <div className="flex gap-4">
                                            <button className="bg-white text-zinc-950 px-4 py-2 text-xs font-bold rounded hover:bg-zinc-200 transition-colors">
                                                View Projects
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Slide 2: Business / Editorial / Clean */}
                            {slide.id === 'business' && (
                                <div className="absolute inset-0 bg-white text-slate-900 font-serif p-6 md:p-12 flex flex-col animate-[fadeIn_0.5s_ease-out]">
                                    <nav className="relative z-10 flex justify-between items-center mb-12 border-b border-slate-100 pb-4">
                                        <div className="font-bold text-xl tracking-widest uppercase">Jenkins.</div>
                                        <div className="hidden md:flex gap-4 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            <span>Experience</span>
                                            <span>Press</span>
                                        </div>
                                    </nav>
                                    
                                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
                                        <span className="font-sans text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-4 bg-blue-50 px-3 py-1 rounded-full">
                                            Strategic Consulting
                                        </span>
                                        <h2 className="text-4xl md:text-6xl font-medium leading-[0.9] mb-6">
                                            Navigating <br/> 
                                            <span className="italic text-slate-400 font-light">Complexity.</span>
                                        </h2>
                                        <div className="w-12 h-0.5 bg-slate-900 mb-6"></div>
                                        <p className="font-sans text-slate-500 max-w-sm leading-relaxed text-xs md:text-base mb-8">
                                            Advising Fortune 500 leadership on digital transformation and market entry strategies.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Slide 3: Creative / Avant Garde / Bold */}
                            {slide.id === 'creative' && (
                                <div className="absolute inset-0 bg-[#EAE8E4] text-black font-sans p-0 flex overflow-hidden animate-[fadeIn_0.5s_ease-out]">
                                    <div className="absolute top-6 left-6 z-20 font-bold tracking-tighter text-xl">MARCO.</div>
                                    <div className="absolute top-6 right-6 z-20 flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                                    <div className="w-3 h-3 rounded-full bg-black"></div>
                                    </div>

                                    <div className="w-1/2 h-full flex flex-col justify-center px-6 md:px-12 relative z-10">
                                        <h2 className="text-4xl md:text-6xl font-black leading-[0.85] tracking-tighter mb-6">
                                            VISUAL <br/> NARRATIVES <br/> FOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">BRANDS.</span>
                                        </h2>
                                        <div className="flex items-center gap-4 group cursor-pointer">
                                            <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5">Selected Works</span>
                                        </div>
                                    </div>
                                    
                                    <div className="w-1/2 h-full relative overflow-hidden">
                                        <div className="absolute inset-4 bg-orange-600 rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                                            {/* Abstract Gradient Art */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 opacity-90"></div>
                                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40"></div>
                                            <div className="absolute bottom-6 left-6 text-white text-[8vw] leading-none font-black opacity-20 tracking-tighter">2025</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: AI Sidebar Simulation */}
                        <div className="hidden md:flex w-72 lg:w-80 bg-white flex-col z-20 shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.05)]">
                            {/* Chat Header */}
                            <div className="h-10 border-b border-zinc-100 flex items-center justify-between px-4 bg-white shrink-0">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                    <span className="font-semibold text-xs text-zinc-900">Design Director</span>
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            </div>
                            
                            {/* Messages Area */}
                            <div className="flex-1 p-4 space-y-4 overflow-hidden flex flex-col justify-end pb-6">
                                {/* User Message */}
                                <div className="flex items-start gap-3 flex-row-reverse animate-[fadeIn_0.3s_ease-out]">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[8px] font-bold border border-zinc-100 bg-zinc-900 text-white">
                                        You
                                    </div>
                                    <div className="py-2 px-3 rounded-2xl rounded-tr-sm text-xs leading-relaxed bg-zinc-100 text-zinc-800">
                                        {slide.chat.user}
                                    </div>
                                </div>

                                {/* AI Response */}
                                <div className="flex items-start gap-3 animate-[fadeIn_0.5s_ease-out_0.2s_forwards] opacity-0">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[8px] font-bold border border-purple-100 bg-purple-50 text-purple-600">
                                        AI
                                    </div>
                                    <div className="py-2 px-3 rounded-2xl rounded-tl-sm text-xs leading-relaxed bg-white border border-zinc-100 text-zinc-600 shadow-sm">
                                        {slide.chat.ai}
                                    </div>
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="p-3 bg-white border-t border-zinc-100 shrink-0">
                                <div className="relative">
                                    <div className="w-full pl-3 pr-8 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-400 select-none flex items-center">
                                        {slide.chat.input}
                                        <span className="w-0.5 h-3 bg-purple-400 ml-0.5 animate-pulse"></span>
                                    </div>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md bg-white border border-zinc-100 text-purple-500 shadow-sm">
                                        <Send className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
             </div>
             
             {/* Slide Indicators - Compact */}
             <div className="flex justify-center gap-2 mt-2 md:mt-4">
               {DEMO_SLIDES.map((_, i) => (
                 <button 
                   key={i}
                   onClick={() => setCurrentSlide(i)}
                   className={`h-1 md:h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 md:w-8 bg-zinc-900' : 'w-1 md:w-1.5 bg-zinc-300 hover:bg-zinc-400'}`}
                 />
               ))}
             </div>
          </div>

          {/* CTA Buttons - Bottom Anchor */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 shrink-0 flex-1 min-h-0 justify-start">
            <button 
              onClick={onStart}
              className="px-6 md:px-10 py-3 md:py-4 rounded-full bg-blue-600 text-white font-bold text-sm md:text-lg hover:bg-blue-500 transition-all hover:-translate-y-1 shadow-xl shadow-blue-600/30 flex items-center gap-2 group"
            >
              Start 3-Day Free Trial
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-500 font-medium hidden sm:flex">
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white bg-zinc-${i*100 + 200}`}></div>
                    ))}
                </div>
                <span>Used by 10,000+ candidates</span>
            </div>
          </div>
          
        </div>
      </section>

      {/* Social Proof Marquee */}
      <section className="py-10 border-y border-zinc-100 bg-white overflow-hidden relative">
          {/* Gradient masks for smooth fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div className="flex gap-24 items-center animate-[marquee_40s_linear_infinite] whitespace-nowrap px-10">
             {/* Set 1 */}
             <span className="text-2xl font-bold font-sans tracking-tight opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">Apple</span>
             <span className="text-2xl font-bold font-sans tracking-tighter opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">Microsoft</span>
             <span className="text-2xl font-bold font-serif italic opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">J.P. Morgan</span>
             <span className="text-2xl font-bold font-sans tracking-tight opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">Amazon</span>
             <span className="text-2xl font-bold font-serif opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">BERKSHIRE HATHAWAY</span>
             <span className="text-2xl font-bold font-sans tracking-tighter opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">Google</span>
             <span className="text-2xl font-bold font-serif italic opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">Goldman Sachs</span>
             <span className="text-2xl font-bold font-sans opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">VISA</span>
             <span className="text-2xl font-bold font-serif opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">Morgan Stanley</span>
             <span className="text-2xl font-bold font-sans tracking-tight opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">Tesla</span>
             <span className="text-2xl font-bold font-sans opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">NVIDIA</span>
             <span className="text-2xl font-bold font-serif opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">UnitedHealth</span>

             {/* Set 2 (Duplicate for loop) */}
             <span className="text-2xl font-bold font-sans tracking-tight opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">Apple</span>
             <span className="text-2xl font-bold font-sans tracking-tighter opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">Microsoft</span>
             <span className="text-2xl font-bold font-serif italic opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">J.P. Morgan</span>
             <span className="text-2xl font-bold font-sans tracking-tight opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">Amazon</span>
             <span className="text-2xl font-bold font-serif opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">BERKSHIRE HATHAWAY</span>
             <span className="text-2xl font-bold font-sans tracking-tighter opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">Google</span>
             <span className="text-2xl font-bold font-serif italic opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">Goldman Sachs</span>
             <span className="text-2xl font-bold font-sans opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">VISA</span>
             <span className="text-2xl font-bold font-serif opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">Morgan Stanley</span>
             <span className="text-2xl font-bold font-sans tracking-tight opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">Tesla</span>
             <span className="text-2xl font-bold font-sans opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">NVIDIA</span>
             <span className="text-2xl font-bold font-serif opacity-30 grayscale hover:opacity-100 transition-opacity cursor-default">UnitedHealth</span>
          </div>
      </section>

      {/* How It Works - Replaces Bento Grid Features */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="mb-24 md:text-center max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">It's actually this easy.</h2>
                <p className="text-xl text-zinc-500">From static PDF to interactive portfolio in three steps.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-[auto] gap-6">
                
                {/* Step 1: Upload (Dark Card, 1 col) */}
                <div className="bg-zinc-900 rounded-[2.5rem] p-10 md:p-12 text-white flex flex-col justify-between relative overflow-hidden group">
                     {/* Background glow */}
                     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors"></div>
                     
                     <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                         <Upload className="w-6 h-6 text-white" />
                     </div>
                     
                     <div>
                        <h3 className="text-xl font-bold tracking-tight mb-2 opacity-80">Step 1</h3>
                        <h4 className="text-2xl font-bold tracking-tight mb-3">Upload Resume</h4>
                        <p className="text-zinc-400 leading-relaxed">Simply drag & drop your existing PDF. We utilize advanced parsing to extract your work history, skills, and bio—zero manual data entry required.</p>
                     </div>
                </div>

                {/* Step 2: AI Design (Light Card, 2 cols) */}
                <div className="md:col-span-2 bg-[#F8FAFC] rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden group border border-zinc-100">
                     <div className="relative z-10">
                        <h3 className="text-xl font-bold tracking-tight mb-2 text-zinc-400">Step 2</h3>
                        <h3 className="text-3xl font-bold tracking-tight mb-4 text-zinc-900">AI Creative Director</h3>
                        <p className="text-zinc-500 text-lg max-w-md">Our intelligence engine analyzes your professional profile to generate a bespoke design system. It selects the optimal typography, layout, and color palette for your specific industry.</p>
                     </div>
                     {/* Abstract UI Mockup */}
                     <div className="absolute right-0 bottom-0 w-1/2 h-full">
                        <div className="absolute bottom-[-10%] right-[-10%] bg-white rounded-tl-3xl border-t border-l border-zinc-200 p-6 shadow-2xl w-full h-[80%] transition-transform group-hover:-translate-x-4 group-hover:-translate-y-4 duration-500">
                             <div className="space-y-4">
                                 <div className="flex gap-3">
                                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Sparkles className="w-4 h-4" /></div>
                                     <div className="bg-zinc-100 rounded-tr-xl rounded-bl-xl rounded-br-xl p-3 text-sm text-zinc-600">Try a serif font for the header.</div>
                                 </div>
                                 <div className="flex gap-3 flex-row-reverse">
                                     <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white"><ArrowRight className="w-4 h-4" /></div>
                                     <div className="bg-zinc-900 text-white rounded-tl-xl rounded-bl-xl rounded-br-xl p-3 text-sm">Updating styles...</div>
                                 </div>
                             </div>
                        </div>
                     </div>
                </div>

                {/* Step 3: Publish (Wide Card, 3 cols) */}
                <div className="md:col-span-3 bg-white border border-zinc-100 shadow-xl shadow-zinc-200/40 rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
                     <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wide mb-6">
                            <Globe className="w-3 h-3" />
                            Global Edge Network
                        </div>
                        <h3 className="text-xl font-bold tracking-tight mb-2 text-zinc-400">Step 3</h3>
                        <h3 className="text-3xl font-bold tracking-tight mb-4">Instant Deploy</h3>
                        <p className="text-zinc-500 text-lg">Publish to a global edge network with a single click. Your new site is automatically secured with SSL, optimized for SEO, and ready to share with recruiters instantly.</p>
                     </div>
                     <div className="flex-1 flex justify-center w-full">
                         {/* Visual: Browser Window / Live Status */}
                         <div className="w-full max-w-md bg-zinc-900 rounded-xl p-1 shadow-2xl transform group-hover:scale-[1.02] transition-transform">
                            <div className="bg-zinc-800 rounded-t-lg p-3 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 bg-red-500/20 rounded-full"></div>
                                    <div className="w-2.5 h-2.5 bg-yellow-500/20 rounded-full"></div>
                                    <div className="w-2.5 h-2.5 bg-green-500/20 rounded-full"></div>
                                </div>
                                <div className="flex-1 bg-black/20 rounded h-6 flex items-center px-3 text-[10px] text-zinc-400 font-mono">
                                   <span className="text-green-500 mr-1">🔒</span> sarahjenkins.co
                                </div>
                            </div>
                            <div className="bg-white rounded-b-lg h-32 flex items-center justify-center border-t border-zinc-700/50 relative overflow-hidden">
                                <div className="absolute inset-0 bg-grid-black/[0.05] bg-[length:16px_16px]"></div>
                                <div className="px-6 py-3 bg-green-50 text-green-600 rounded-full font-bold text-sm flex items-center gap-2 shadow-sm z-10">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    Live Deployment
                                </div>
                            </div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
      </section>

      {/* Pricing - The Black Card */}
      <section id="pricing" className="py-32 px-6 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row gap-16 items-center">
                  <div className="flex-1">
                      <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-zinc-900">Invest in <br/> your future.</h2>
                      <p className="text-xl text-zinc-500 mb-12 max-w-md">
                          Less than the cost of a coffee a week. Cancel anytime, keep your domain forever.
                      </p>
                      <div className="flex gap-4">
                          <div className="flex -space-x-3">
                              <div className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-white"></div>
                              <div className="w-10 h-10 rounded-full bg-zinc-300 border-2 border-white"></div>
                              <div className="w-10 h-10 rounded-full bg-zinc-400 border-2 border-white"></div>
                          </div>
                          <p className="text-sm text-zinc-500 py-2">Join 4,000+ Pro members</p>
                      </div>
                  </div>
                  
                  <div className="flex-1 w-full max-w-md">
                      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl border border-zinc-200">
                          {/* Clerk Billing: shows your single public plan from the Clerk dashboard */}
                          <SignedIn>
                            <PricingTable for="user" ctaPosition="bottom" newSubscriptionRedirectUrl="/" />
                          </SignedIn>
                          <SignedOut>
                            <div className="text-center py-10">
                              <div className="text-sm font-semibold text-zinc-900">See pricing after you create your account</div>
                              <div className="text-xs text-zinc-500 mt-2">We’ll show the plan and checkout securely via Clerk.</div>
                            </div>
                          </SignedOut>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={onStart}
                          className="w-full py-4 text-base bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-600/25 hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Start 3-Day Free Trial
                        </button>
                        <p className="text-xs text-zinc-400 mt-2 text-center">
                          Billing and plan management are handled securely by Clerk.
                        </p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* ROI Stats Only - Cleaned Up Section */}
      <section className="pb-32 px-6 bg-white border-t border-zinc-100 pt-20">
        <div className="max-w-7xl mx-auto">
            {/* The Money Stats */}
            <div className="bg-zinc-900 rounded-[2.5rem] p-8 md:p-16 text-white overflow-hidden relative">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wide mb-6 border border-green-500/30">
                            <TrendingUp className="w-3 h-3" />
                            Real Market Data
                        </div>
                        <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                            Get paid what you're actually worth.
                        </h3>
                        <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                            Data from 50,000+ tech offers shows a clear correlation: candidates with high-quality personal sites negotiate significantly higher compensation packages.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <div className="text-4xl font-black text-white mb-1">+45%</div>
                                <div className="text-sm text-zinc-500 font-medium uppercase tracking-wide">Callback Rate</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-green-400 mb-1">+$18k</div>
                                <div className="text-sm text-zinc-500 font-medium uppercase tracking-wide">Avg. Salary Bump</div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Graph */}
                    <div className="bg-zinc-800/50 rounded-2xl p-8 border border-white/5 relative">
                         <h4 className="text-sm font-mono text-zinc-400 mb-8 uppercase tracking-widest text-center">Starting Offer Comparison</h4>
                         
                         <div className="flex items-end justify-center gap-8 h-64">
                            {/* Bar 1 */}
                            <div className="w-24 flex flex-col items-center gap-3 group">
                                <div className="text-sm font-bold text-zinc-500">$120k</div>
                                <div className="w-full bg-zinc-600/30 h-32 rounded-t-lg relative overflow-hidden"></div>
                                <div className="text-xs text-zinc-500 font-medium">Resume Only</div>
                            </div>

                            {/* Bar 2 */}
                            <div className="w-24 flex flex-col items-center gap-3 group">
                                 <div className="text-xl font-bold text-green-400">$142k</div>
                                <div className="w-full bg-gradient-to-t from-green-900 to-green-500 h-56 rounded-t-lg relative overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                </div>
                                 <div className="text-xs text-white font-bold">With Site</div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-white border-t border-zinc-100">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
             <div className="max-w-xs">
                 <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 bg-zinc-900 text-white rounded-md flex items-center justify-center">
                        <span className="font-bold font-serif italic text-xs">D</span>
                    </div>
                    <span className="font-bold tracking-tight">DigitalResume</span>
                 </div>
                 <p className="text-zinc-500 text-sm leading-relaxed">
                     Building the new standard for professional identity on the open web.
                 </p>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
                 <div>
                     <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Product</h4>
                     <ul className="space-y-3 text-sm text-zinc-500">
                         <li><a href="#" className="hover:text-blue-600 transition-colors">Templates</a></li>
                         <li><a href="#" className="hover:text-blue-600 transition-colors">Examples</a></li>
                         <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                     </ul>
                 </div>
                 <div>
                     <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Company</h4>
                     <ul className="space-y-3 text-sm text-zinc-500">
                         <li><a href="#" className="hover:text-blue-600 transition-colors">About</a></li>
                         <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                         <li><a href="#" className="hover:text-blue-600 transition-colors">Careers</a></li>
                     </ul>
                 </div>
                 <div>
                     <h4 className="font-bold mb-4 text-sm uppercase tracking-widest">Legal</h4>
                     <ul className="space-y-3 text-sm text-zinc-500">
                         <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy</a></li>
                         <li><a href="#" className="hover:text-blue-600 transition-colors">Terms</a></li>
                     </ul>
                 </div>
             </div>
         </div>
         <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-100 text-center md:text-left text-xs text-zinc-400 flex flex-col md:flex-row justify-between items-center">
             <p>© 2025 DigitalResume Inc. All rights reserved.</p>
             <div className="flex items-center gap-2 mt-4 md:mt-0">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                 <span>All Systems Operational</span>
             </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;