
export const TEMPLATE_VARIANTS = {
  header: {
    default: `
    <nav class="fixed top-0 w-full z-50 mix-blend-difference text-white transition-all duration-300">
      <div class="max-w-[1400px] mx-auto px-6 md:px-12 h-24 flex items-center justify-between">
        <a href="#" class="text-xl font-bold tracking-tighter hover:opacity-70 transition-opacity">{{name}}</a>
        <div class="hidden md:flex gap-8 text-sm font-medium tracking-wide">
          <a href="#hero" class="hover:underline underline-offset-4 transition-all">Index</a>
          <a href="#experience" class="hover:underline underline-offset-4 transition-all">Work</a>
          <a href="#skills" class="hover:underline underline-offset-4 transition-all">About</a>
        </div>
        <a href="mailto:{{email}}" class="hidden md:block px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 hover:bg-white hover:text-black transition-all">
          Contact
        </a>
      </div>
    </nav>
    `
  },
  hero: {
    centered: `
    <section id="hero" class="min-h-screen pt-20 flex flex-col justify-center px-6 py-20 {{bg_class}} transition-colors duration-500 relative overflow-hidden">
      <!-- Gradient Orb -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div class="max-w-5xl mx-auto w-full text-center relative z-10">
        <div class="mb-12 opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
            <span class="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase {{accent_bg_class}} {{accent_text_class}} rounded-full border {{border_class}}">
              Available for new projects
            </span>
        </div>
        <h1 class="text-7xl md:text-9xl font-black {{text_primary_class}} mb-8 leading-[0.9] tracking-tighter opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards]">
          {{name}}
        </h1>
        <p class="text-2xl md:text-3xl {{text_secondary_class}} mb-12 font-light opacity-0 animate-[fadeIn_0.8s_ease-out_0.4s_forwards] max-w-2xl mx-auto leading-normal">
          {{title}}
        </p>
        <div class="flex justify-center gap-6 opacity-0 animate-[fadeIn_0.8s_ease-out_0.6s_forwards]">
           <a href="#experience" class="px-8 py-4 rounded-full text-sm font-bold tracking-wide transition-all transform hover:-translate-y-1 {{button_primary_class}} shadow-xl hover:shadow-2xl">
             Explore Portfolio
           </a>
        </div>
      </div>
    </section>
    `,
    editorial: `
    <section id="hero" class="min-h-screen pt-32 flex flex-col justify-end pb-24 px-6 md:px-12 {{bg_class}} transition-colors duration-500 relative">
      <div class="max-w-[1400px] mx-auto w-full">
         <div class="w-full h-px {{bg_secondary_class}} mb-12 opacity-0 animate-[fadeIn_1.2s_ease-out_forwards] opacity-20 origin-left scale-x-0 animate-[expandWidth_1s_ease-out_forwards]"></div>
         
         <div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
            <div class="md:col-span-8">
                <h1 class="text-[12vw] md:text-[10rem] leading-[0.8] font-black {{text_primary_class}} tracking-tighter opacity-0 animate-[fadeIn_1s_ease-out_0.2s_forwards] -ml-1 md:-ml-2">
                {{name}}
                </h1>
            </div>
            <div class="md:col-span-4 pb-4 opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
               <h2 class="text-2xl md:text-4xl {{text_primary_class}} font-medium leading-tight tracking-tight mb-6">
                 {{title}}
               </h2>
               <p class="text-lg {{text_body_class}} leading-relaxed font-light opacity-80 mb-8">
                 {{summary}}
               </p>
               <a href="#experience" class="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest {{text_primary_class}}">
                  View Selected Works
                  <span class="block transition-transform group-hover:translate-x-1">→</span>
               </a>
            </div>
         </div>
      </div>
    </section>
    <style>
      @keyframes expandWidth { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    </style>
    `,
    split: `
    <section id="hero" class="min-h-screen flex flex-col md:flex-row {{bg_class}} overflow-hidden">
      <div class="flex-1 flex flex-col justify-center px-8 md:px-20 py-20 pt-32 relative z-10">
        <h1 class="text-7xl md:text-9xl font-bold {{text_primary_class}} mb-8 leading-[0.85] tracking-tighter opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
          {{name}}
        </h1>
        <p class="text-2xl {{text_secondary_class}} mb-12 max-w-lg opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards] font-light">
          {{title}}
        </p>
        <div class="opacity-0 animate-[fadeIn_0.8s_ease-out_0.4s_forwards]">
           <a href="#contact" class="inline-flex items-center gap-3 px-8 py-4 rounded-full {{button_primary_class}} font-medium text-sm hover:scale-105 transition-transform shadow-lg">
             Let's Talk
             <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-current"><path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
           </a>
        </div>
      </div>
      <div class="flex-1 {{bg_surface_class}} min-h-[40vh] md:min-h-screen relative">
         <div class="absolute inset-0 bg-grid-black/[0.05] bg-[length:40px_40px]"></div>
         <!-- Abstract typography decoration -->
         <div class="absolute bottom-10 right-10 text-[20rem] font-black {{text_primary_class}} opacity-5 leading-none select-none pointer-events-none">
            {{name_initial}}
         </div>
      </div>
    </section>
    `
  },

  experience: {
    timeline: `
    <section id="experience" class="py-32 px-6 md:px-12 {{bg_surface_class}}">
      <div class="max-w-[1400px] mx-auto">
        <div class="flex items-end justify-between mb-24 border-b {{border_class}} pb-8">
           <h3 class="text-8xl md:text-9xl font-black tracking-tighter {{text_primary_class}} opacity-10">Work</h3>
           <span class="hidden md:block text-sm font-mono uppercase tracking-widest {{text_muted_class}} pb-4">Selected Projects</span>
        </div>
        <div class="max-w-4xl mx-auto space-y-32">
          {{experience_items}}
          <!-- AI Loop Template:
          <div class="group relative reveal">
             <div class="md:grid md:grid-cols-12 md:gap-16">
               <div class="md:col-span-3 pt-2">
                 <span class="text-xs font-bold font-mono {{text_muted_class}} block py-1 tracking-widest uppercase border-b {{border_class}} inline-block mb-4 md:mb-0">{{duration}}</span>
               </div>
               <div class="md:col-span-9">
                  <h4 class="text-4xl md:text-5xl font-bold {{text_primary_class}} mb-2 tracking-tighter group-hover:translate-x-2 transition-transform duration-300">{{role}}</h4>
                  <div class="text-xl {{text_secondary_class}} mb-8 font-medium italic">{{company}}</div>
                  <p class="{{text_body_class}} leading-relaxed text-lg opacity-80 font-light">
                    {{description}}
                  </p>
               </div>
             </div>
          </div>
          -->
        </div>
      </div>
    </section>
    `,
    grid: `
    <section id="experience" class="py-32 px-6 md:px-12 {{bg_surface_class}}">
      <div class="max-w-[1400px] mx-auto">
        <h3 class="text-6xl md:text-8xl font-black {{text_primary_class}} mb-24 tracking-tighter">Experience</h3>
        <div class="grid grid-cols-1 gap-4">
          {{experience_items}}
          <!-- AI Loop Template:
          <div class="group bg-white p-8 md:p-12 rounded-3xl border border-transparent hover:border-zinc-200 transition-all duration-500 hover:shadow-2xl">
            <div class="flex flex-col md:flex-row justify-between md:items-start gap-8 mb-8">
                <div>
                    <h4 class="text-3xl md:text-4xl font-bold {{text_primary_class}} tracking-tight mb-2">{{role}}</h4>
                    <div class="text-xl {{text_secondary_class}}">{{company}}</div>
                </div>
                <span class="px-4 py-2 rounded-full {{bg_surface_class}} text-xs font-mono font-bold uppercase tracking-widest {{text_muted_class}}">{{duration}}</span>
            </div>
            <p class="{{text_body_class}} text-lg leading-relaxed font-light opacity-80 max-w-4xl">
                {{description}}
            </p>
          </div>
          -->
        </div>
      </div>
    </section>
    `
  },

  skills: {
    badges: `
    <section id="skills" class="py-32 px-6 {{bg_class}}">
      <div class="max-w-4xl mx-auto text-center">
         <h3 class="text-sm font-bold tracking-[0.2em] uppercase {{text_muted_class}} mb-20 relative inline-block">
            Expertise
            <span class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-px bg-current opacity-50"></span>
         </h3>
         <div class="flex flex-wrap justify-center gap-4">
          {{skills_items}}
          <!-- AI Loop Template:
          <span class="px-8 py-4 rounded-full bg-white border {{border_class}} {{text_primary_class}} text-base font-medium hover:-translate-y-1 transition-transform cursor-default shadow-sm hover:shadow-lg">
            {{skill}}
          </span>
          -->
        </div>
      </div>
    </section>
    `,
    minimal: `
    <section id="skills" class="py-40 px-6 md:px-12 {{bg_class}} border-t {{border_class}}">
      <div class="max-w-[1400px] mx-auto">
         <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div class="md:col-span-1">
               <h3 class="text-xs font-bold tracking-[0.2em] uppercase {{text_muted_class}} sticky top-32">Stack</h3>
            </div>
            <div class="md:col-span-3">
               <div class="flex flex-wrap gap-x-12 gap-y-8">
                 {{skills_items}}
                 <!-- AI Loop Template:
                 <span class="text-3xl md:text-5xl font-light tracking-tight {{text_primary_class}} opacity-40 hover:opacity-100 transition-opacity cursor-default">{{skill}}</span>
                 -->
               </div>
            </div>
         </div>
      </div>
    </section>
    `
  },

  footer: {
    default: `
    <section id="contact" class="py-32 px-6 md:px-12 {{footer_bg_class}} min-h-[80vh] flex flex-col justify-between">
      <div class="max-w-[1400px] mx-auto w-full">
        <h2 class="text-[12vw] leading-[0.8] font-black {{text_primary_class}} mb-12 tracking-tighter uppercase break-words">
          Let's Talk
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
            <div>
                <a href="mailto:{{email}}" class="text-2xl md:text-4xl font-light {{text_primary_class}} hover:underline underline-offset-8 decoration-1">
                {{email}}
                </a>
            </div>
            <div class="flex flex-wrap gap-8 md:justify-end">
                {{social_links}}
                <!-- AI Loop Template:
                <a href="{{url}}" target="_blank" rel="noopener noreferrer" class="{{text_primary_class}} text-sm font-bold uppercase tracking-widest border border-current px-6 py-3 rounded-full hover:bg-current hover:text-white transition-colors">
                    {{platform}}
                </a>
                -->
            </div>
        </div>
      </div>

      <div class="max-w-[1400px] mx-auto w-full border-t {{border_class}} pt-8 flex justify-between items-end text-xs font-mono uppercase tracking-widest {{text_muted_class}}">
          <div class="flex flex-col">
            <span>{{name}}</span>
            <span class="opacity-50">© {{year}}</span>
          </div>
          <div>
             <a href="#" class="hover:opacity-100 opacity-50 transition-opacity">Built with DigitalResume</a>
          </div>
      </div>
    </section>
    `
  }
};

export const BASE_HTML_WRAPPER = `
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{name}} - Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="{{font_import}}" rel="stylesheet">
  <style>
    body { font-family: {{font_family_body}}; }
    h1, h2, h3, h4, nav { font-family: {{font_family_heading}}; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .reveal { opacity: 0; transform: translateY(40px); transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal.active { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body class="{{body_bg_class}} antialiased selection:bg-black selection:text-white">
  {{content}}
  <script>
    // Intersection Observer for scroll reveal animations
    document.addEventListener('DOMContentLoaded', () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    });
  </script>
</body>
</html>
`;