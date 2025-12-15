
const STORAGE_KEY = 'digital_resume_usage_v1';
const MAX_DAILY_CREATIONS = 3;
const MAX_PROJECT_EDITS = 50;
const PRO_MAX_EDITS = 10000;
const PRO_CREATIONS_REMAINING = 9999;

interface UsageData {
  lastResetDate: string;
  dailyCreations: number;
  currentProjectEdits: number;
  purchasedEdits: number;
}

const getTodayString = () => new Date().toDateString();

const getUsage = (): UsageData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const today = getTodayString();
  
  if (stored) {
    const parsed = JSON.parse(stored);
    
    // Migration for existing data without purchasedEdits
    if (typeof parsed.purchasedEdits !== 'number') {
        parsed.purchasedEdits = 0;
    }

    // Reset daily counter if it's a new day
    if (parsed.lastResetDate !== today) {
      return {
        lastResetDate: today,
        dailyCreations: 0,
        currentProjectEdits: parsed.currentProjectEdits, // Keep project edits intact
        purchasedEdits: parsed.purchasedEdits
      };
    }
    return parsed as UsageData;
  }

  return {
    lastResetDate: today,
    dailyCreations: 0,
    currentProjectEdits: 0,
    purchasedEdits: 0
  };
};

const saveUsage = (data: UsageData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

let hasActiveSubscription = false;

export const UsageService = {
  setSubscriptionActive: (isActive: boolean) => {
    hasActiveSubscription = isActive;
  },

  isSubscriptionActive: () => hasActiveSubscription,

  getStats: () => {
    if (hasActiveSubscription) {
      return {
        creationsRemaining: PRO_CREATIONS_REMAINING,
        editsRemaining: PRO_MAX_EDITS,
        maxEdits: PRO_MAX_EDITS
      };
    }

    const usage = getUsage();
    const totalLimit = MAX_PROJECT_EDITS + usage.purchasedEdits;
    return {
      creationsRemaining: Math.max(0, MAX_DAILY_CREATIONS - usage.dailyCreations),
      editsRemaining: Math.max(0, totalLimit - usage.currentProjectEdits),
      maxEdits: totalLimit
    };
  },

  canCreateNewSite: (): boolean => {
    if (hasActiveSubscription) return true;
    const usage = getUsage();
    return usage.dailyCreations < MAX_DAILY_CREATIONS;
  },

  incrementCreationCount: () => {
    if (hasActiveSubscription) return;
    const usage = getUsage();
    usage.dailyCreations += 1;
    usage.currentProjectEdits = 0; // Reset edits for the new project
    saveUsage(usage);
  },

  canEditSite: (): boolean => {
    if (hasActiveSubscription) return true;
    const usage = getUsage();
    const totalLimit = MAX_PROJECT_EDITS + usage.purchasedEdits;
    return usage.currentProjectEdits < totalLimit;
  },

  incrementEditCount: () => {
    if (hasActiveSubscription) return;
    const usage = getUsage();
    usage.currentProjectEdits += 1;
    saveUsage(usage);
  },
  
  purchaseEdits: (amount: number) => {
    if (hasActiveSubscription) return;
    const usage = getUsage();
    usage.purchasedEdits += amount;
    saveUsage(usage);
  },
  
  resetProjectEdits: () => {
    if (hasActiveSubscription) return;
    const usage = getUsage();
    usage.currentProjectEdits = 0;
    saveUsage(usage);
  }
};
