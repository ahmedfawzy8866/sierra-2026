/**
 * SIERRA BLU — GLOBAL CONFIGURATION
 * Centralized source of truth for contact info, social links, and site metadata.
 * Part of the "Cleanup & Unify" initiative.
 */

export const SiteConfig = {
  branding: {
    name: "Sierra Blu Realty",
    legalName: "Sierra Blu Real Estate Investment",
    tagline: "Ultra-Cinematic Asset Intelligence",
    foundedIn: "2026",
  },
  executive: {
    name: "Ahmed Fawzy",
    role: "Founding Executive & Strategic Lead",
    // These are currently flagging as 'wrong' by the user. 
    // Will update as soon as they provide the new data.
    phone: "+20 10 61399688", 
    email: "EmeraldEstatesegypt@gmail.com",
    telegramBot: "https://t.me/Sierrablurealtybot",
  },
  contact: {
    whatsapp: "https://wa.me/201061399688",
    mainOffice: "Cairo, Egypt",
  },
  links: {
    portal: "/",
    landing: "/landing",
  }
};

/**
 * OS V4.0 Intelligence Thresholds
 * Used by Matching and Ranking engines.
 */
export const SierraBluOS = {
  version: "4.0.0",
  thresholds: {
    matchingScore: 0.75,       // Minimum score to suggest a match
    highIntensityLead: 0.85,  // Threshold for hot leads
    priceDeviation: 0.15,     // Alert if price differs by >15% from project avg
  },
  stages: [
    "acquisition", "parsing", "branding", "distribution", 
    "intelligence", "matching", "sales", "viewing", 
    "closing", "feedback"
  ],
  enabledEngines: {
    geminiNLP: true,
    matchingNeuralNet: true,
    marketingAutomation: true,
    orchestrationLedger: true
  }
};
