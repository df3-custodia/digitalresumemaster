import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, StyleStrategy, UserPreferences } from "../types";
import { TEMPLATE_VARIANTS, BASE_HTML_WRAPPER } from "../data/templates";
// @ts-ignore
import DOMPurify from 'dompurify';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Parses raw text or file data into structured ResumeData
 */
export const parseResumeText = async (input: string | { mimeType: string; data: string }): Promise<ResumeData> => {
  const ai = getAI();
  
  let contents;
  
  // Sanitization to prevent prompt injection from malicious resumes
  const sanitize = (str: string) => DOMPurify.sanitize(str, { ALLOWED_TAGS: [] }); // Strip all HTML

  if (typeof input === 'string') {
    contents = `
    Analyze the following resume text and extract the structured data.
    If specific fields are missing, make a reasonable guess or leave them empty/generic.
    Return the result in JSON format matching the schema.
    
    Resume Text:
    ${sanitize(input)}
    `;
  } else {
    // For binary input (PDF), we can't easily sanitize the base64, but the model interprets it as a document.
    // The strict schema response helps mitigate injection risks here.
    contents = {
      parts: [
        { 
          inlineData: { 
            mimeType: input.mimeType, 
            data: input.data 
          } 
        },
        { 
          text: `Analyze the resume in this document and extract the structured data.
                 If specific fields are missing, make a reasonable guess or leave them empty/generic.
                 Return the result in JSON format matching the schema.`
        }
      ]
    };
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
          location: { type: Type.STRING },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                company: { type: Type.STRING },
                duration: { type: Type.STRING },
                description: { type: Type.STRING },
              }
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                degree: { type: Type.STRING },
                school: { type: Type.STRING },
                year: { type: Type.STRING },
              }
            }
          },
          socials: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                url: { type: Type.STRING },
              }
            }
          }
        },
        required: ["name", "title", "summary", "skills", "experience"]
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as ResumeData;
  }
  throw new Error("Failed to parse resume");
};

/**
 * AGENT 1: The Strategist
 * Analyzes the resume AND User Preferences to determine the industry vibe, style, AND layout.
 */
export const determineStyleStrategy = async (data: ResumeData, prefs?: UserPreferences): Promise<StyleStrategy> => {
  const ai = getAI();
  
  const prefsContext = prefs ? `
    USER EXPLICIT PREFERENCES (MUST PRIORITIZE):
    - Industry: ${prefs.industry}
    - Experience Level: ${prefs.experienceLevel}
    - Requested Style ID: ${prefs.style} (Map this to the theme)
    - Requested Color Group: ${prefs.color}
  ` : '';

  const prompt = `
    Act as a Lead Design Director. Analyze this professional profile and user preferences to determine the best visual style and layout for their personal website.
    
    Profile:
    Role: ${data.title}
    Skills: ${data.skills.join(', ')}
    Summary: ${data.summary}
    
    ${prefsContext}

    Determine:
    1. Theme: 'modern' (Tech, Startup), 'minimal' (Design, Arch), 'creative' (Art, Media), 'professional' (Legal, Finance). 
       * If user selected 'Modern Tech', choose 'modern'.
       * If user selected 'Swiss Minimal', choose 'minimal'.
       * If user selected 'Bold Creative', choose 'creative'.
       * If user selected 'Executive', choose 'professional'.
       
    2. Layout Strategy:
       - Hero: 'editorial' (Big bold text, left align, good for creatives), 'centered' (Clean, classic), 'split' (Modern, dynamic).
       - Experience: 'grid' (Clean Swiss style table), 'timeline' (Classic vertical line).
       - Skills: 'minimal' (Text flow), 'badges' (Pills).
       
    3. Color Palette:
       - Based on the user's requested color group (e.g., if 'blue', use slate-900 text with blue-600 accents. If 'black', use zinc-900/white).
       - Provide specific Tailwind CSS classes.

    4. Font Pairing: Google Fonts (Inter, Playfair Display, Space Grotesk, DM Sans, etc).

    Return JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          theme: { type: Type.STRING, enum: ['modern', 'minimal', 'creative', 'professional'] },
          layout: {
            type: Type.OBJECT,
            properties: {
               hero: { type: Type.STRING, enum: ['centered', 'editorial', 'split'] },
               experience: { type: Type.STRING, enum: ['timeline', 'grid'] },
               skills: { type: Type.STRING, enum: ['badges', 'minimal'] }
            }
          },
          colorPalette: {
            type: Type.OBJECT,
            properties: {
              primary: { type: Type.STRING, description: "Main text/heading color class e.g. text-zinc-900" },
              secondary: { type: Type.STRING, description: "Subheading color class e.g. text-zinc-500" },
              background: { type: Type.STRING, description: "Main bg class e.g. bg-white" },
              surface: { type: Type.STRING, description: "Secondary bg class e.g. bg-zinc-50" },
              text: { type: Type.STRING, description: "Body text color class" }
            }
          },
          fontPairing: {
            type: Type.OBJECT,
            properties: {
              heading: { type: Type.STRING, description: "CSS font-family name" },
              body: { type: Type.STRING, description: "CSS font-family name" },
              importUrl: { type: Type.STRING, description: "Full Google Fonts URL" }
            }
          }
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as StyleStrategy;
  }
  
  // Fallback default
  return {
    theme: 'modern',
    layout: { hero: 'centered', experience: 'timeline', skills: 'badges' },
    colorPalette: { primary: 'text-zinc-900', secondary: 'text-zinc-500', background: 'bg-white', surface: 'bg-zinc-50', text: 'text-zinc-600' },
    fontPairing: { heading: 'Inter', body: 'Inter', importUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap' }
  };
};

/**
 * AGENT 2: The Builder
 * Takes the strategy + data + SELECTED templates and compiles the HTML.
 */
export const generateInitialSite = async (data: ResumeData, strategy: StyleStrategy): Promise<string> => {
  const ai = getAI();

  // Select Templates based on Strategy
  const selectedTemplates = {
    header: TEMPLATE_VARIANTS.header.default,
    hero: TEMPLATE_VARIANTS.hero[strategy.layout?.hero || 'centered'],
    experience: TEMPLATE_VARIANTS.experience[strategy.layout?.experience || 'timeline'],
    skills: TEMPLATE_VARIANTS.skills[strategy.layout?.skills || 'badges'],
    footer: TEMPLATE_VARIANTS.footer.default
  };
  
  const prompt = `
    You are an expert Frontend Engineer. 
    
    Task: Assemble a single-page personal website using the provided HTML templates, Resume Data, and Style Strategy.

    INPUTS:
    1. Resume Data: ${JSON.stringify(data)}
    2. Style Strategy: ${JSON.stringify(strategy)}
    3. Selected Templates: ${JSON.stringify(selectedTemplates)}
    4. Wrapper: ${BASE_HTML_WRAPPER}

    INSTRUCTIONS:
    1. Fill the 'wrapper' with the calculated content.
    2. Process each section (Header, Hero, Experience, Skills, Footer) in order:
       - Inject the real data from the resume.
       - Replace the placeholder Tailwind classes (like {{text_primary_class}}) with the actual classes from the Style Strategy.
       - IMPORTANT: For the 'Header', ensure the name matches the resume name.
       - For the 'Experience' and 'Skills' sections, loop through the data to generate the HTML items.
       - Ensure the Footer copyright year is current.
       - IMPORTANT: When creating links (socials, etc), ALWAYS add rel="noopener noreferrer" if target="_blank".
    3. Return ONLY the final, valid, complete HTML string. No markdown code blocks.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let html = response.text || "";
  html = html.replace(/```html/g, "").replace(/```/g, "");
  return html;
};

/**
 * AGENT 3: The Creative Director (Final Polish)
 * Adds high-end animations, typography tweaks, and visual flair.
 */
export const enhanceSiteVisuals = async (html: string, strategy: StyleStrategy): Promise<string> => {
  const ai = getAI();

  const prompt = `
    You are an Awwwards-winning Creative Developer. Your goal is to make this website look like it cost $5,000.
    
    Task: Polish this existing HTML website to make it look premium, custom, and interactive.
    
    INPUT HTML:
    ${html}
    
    THEME CONTEXT: ${strategy.theme} (Layout: ${JSON.stringify(strategy.layout)})

    MANDATORY DIRECTIVES for 5K QUALITY:
    1. **Typography**: 
       - Adjust letter-spacing (tracking-tight for headings).
       - Ensure body copy has relaxed leading (leading-relaxed) for readability.
       - Use muted colors (text-zinc-500) for secondary text to reduce visual noise.

    2. **Scroll Animations**: 
       - Inject a vanilla JS script using 'IntersectionObserver'.
       - Elements should NOT just appear; they should gracefully fade up and stagger in.
       - Add '.reveal' classes to sections.

    3. **Visual Texture & Depth**:
       - Add subtle background gradients (e.g., bg-gradient-to-b from-white to-zinc-50).
       - Add very subtle borders (border-zinc-100) to separate sections cleanly.
       - Avoid heavy drop shadows; use soft, large blurs if needed.

    4. **Micro-Interactions**:
       - Buttons should have hover states (transform, scale, or color shift).
       - Links should have underline animations or color transitions.
       - Experience cards should hover gently.

    5. **Whitespace**:
       - Increase padding between sections (py-24 or py-32) to give content room to breathe. "Luxury is space".

    6. **Output**: 
       - Return the FULL, valid, updated HTML string including the new <script> and <style> additions.
       - Do NOT remove the resume data.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let result = response.text || "";
  result = result.replace(/```html/g, "").replace(/```/g, "");
  return result;
}

/**
 * Updates the website based on user chat input
 * RETURNS: JSON object { html: string, message: string }
 */
export const updateSite = async (currentHtml: string, userInstruction: string): Promise<{ html: string; message: string }> => {
  const ai = getAI();

  // Sanitize user chat input to prevent prompt injection
  const safeInstruction = DOMPurify.sanitize(userInstruction, { ALLOWED_TAGS: [] });

  const prompt = `
    You are an expert Frontend Engineer & UX Designer specialized in building static personal portfolios.
    
    Task: Process the user's request to update the website HTML.
    
    User Request: "${safeInstruction}"
    
    Current HTML:
    ${currentHtml}
    
    STRICT GUARDRAILS & SECURITY PROTOCOLS:
    1. SCOPE RESTRICTION: You are ONLY allowed to build personal portfolios, resume sites, and landing pages for individuals.
    2. FORBIDDEN FEATURES (Do NOT implement):
       - Authentication (Login, Signup, Auth0, etc.)
       - Backend Database connections
       - Payment Processing or Checkout (Stripe, PayPal, etc.)
       - Complex Web Apps (SaaS dashboards, etc.)
       - Phishing or Malicious content
    3. If the user asks for a forbidden feature:
       - DO NOT change the HTML.
       - Return a polite refusal in the 'message' field explaining that this app is for static personal sites only.
    4. If the request is valid:
       - Implement the changes in the HTML.
       - Maintain the "Premium/5k" quality (good spacing, typography, colors).
       - Return a friendly confirmation in the 'message' field (e.g., "I've updated the accent color.").
    
    OUTPUT FORMAT:
    Return a JSON object with this schema:
    {
      "html": "The full updated HTML string (or original if refused)",
      "message": "The response message to the user"
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          html: { type: Type.STRING },
          message: { type: Type.STRING }
        },
        required: ["html", "message"]
      }
    }
  });

  if (response.text) {
    try {
      return JSON.parse(response.text) as { html: string; message: string };
    } catch (e) {
      console.error("Failed to parse JSON response", e);
    }
  }
  
  // Fallback
  return { html: currentHtml, message: "I encountered an error processing that request. Please try again." };
};

/**
 * AGENT 4: The Resume Architect
 * Generates a print-ready, high-design resume that matches the website's aesthetic.
 */
export const generateComplementaryResume = async (data: ResumeData, strategy: StyleStrategy): Promise<string> => {
  const ai = getAI();

  const prompt = `
    You are an expert Graphic Designer specialized in editorial print design.
    
    Task: Create a single-page, print-optimized HTML resume for this user.
    The resume MUST visually complement their website by using the same fonts and color palette.
    
    INPUTS:
    1. Resume Data: ${JSON.stringify(data)}
    2. Style Strategy: ${JSON.stringify(strategy)}

    REQUIREMENTS:
    1. **Structure**: 
       - Use a clean, modern layout (either single column or sidebar split) based on the amount of content.
       - Ensure it fits on a standard Letter/A4 page when printed.
       - Use proper semantic HTML (h1, h2, ul, li).
    
    2. **Styling (Tailwind CSS)**:
       - Use the 'print:' modifier where necessary to hide non-essential elements (like buttons).
       - IMPORTANT: Inject the font import URL from the strategy: <link href="${strategy.fontPairing.importUrl}" rel="stylesheet">
       - Apply the font families: ${strategy.fontPairing.heading} and ${strategy.fontPairing.body}.
       - Use the accent color: ${strategy.colorPalette.primary} for headers/accents.
       - Background should be white for printing.
    
    3. **Paper/Print Optimization**:
       - Add specific CSS for @media print { @page { margin: 0; } body { -webkit-print-color-adjust: exact; } }
       - Ensure high contrast for text (dark grey/black).
       - No massive solid background blocks that waste ink, unless it's a sidebar style.

    4. **Output**:
       - Return a FULL valid HTML document string including <html>, <head>, <style>, and <body>.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let html = response.text || "";
  html = html.replace(/```html/g, "").replace(/```/g, "");
  return html;
};

/**
 * Updates the RESUME based on user chat input
 */
export const updateResume = async (currentHtml: string, userInstruction: string): Promise<{ html: string; message: string }> => {
  const ai = getAI();
  const safeInstruction = DOMPurify.sanitize(userInstruction, { ALLOWED_TAGS: [] });

  const prompt = `
    You are a Resume Design Expert.
    
    Task: Update the existing HTML resume based on the user's request.
    
    User Request: "${safeInstruction}"
    
    Current HTML:
    ${currentHtml}
    
    Directives:
    1. Modify the HTML/Tailwind classes to fulfill the request.
    2. Keep it print-friendly (8.5x11 inch format).
    3. Do NOT lose the original data.
    4. Return JSON with 'html' and 'message'.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          html: { type: Type.STRING },
          message: { type: Type.STRING }
        },
        required: ["html", "message"]
      }
    }
  });

  if (response.text) {
    try {
      return JSON.parse(response.text) as { html: string; message: string };
    } catch (e) {
      console.error("Failed to parse JSON response", e);
    }
  }
  
  return { html: currentHtml, message: "Could not update the resume. Please try again." };
};
