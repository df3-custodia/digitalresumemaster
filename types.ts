export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  email: string;
  phone?: string;
  location?: string;
  skills: string[];
  experience: {
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    school: string;
    year: string;
  }[];
  socials?: {
    platform: string;
    url: string;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppState {
  INPUT = 'INPUT',
  GENERATING = 'GENERATING',
  PREVIEW = 'PREVIEW',
  RESUME_BUILDER = 'RESUME_BUILDER',
}

export interface GeneratedSite {
  html: string;
  version: number;
}

export interface UserPreferences {
  industry: string;
  experienceLevel: string;
  style: string;
  color: string;
}

export interface StyleStrategy {
  theme: 'modern' | 'minimal' | 'creative' | 'professional';
  layout: {
    hero: 'centered' | 'editorial' | 'split';
    experience: 'timeline' | 'grid';
    skills: 'badges' | 'minimal';
  };
  colorPalette: {
    primary: string; // Tailwind class e.g., 'text-blue-600'
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
  fontPairing: {
    heading: string;
    body: string;
    importUrl: string;
  };
}