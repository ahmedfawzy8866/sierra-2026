/**
 * SIERRA BLU — FIRESTORE DATA MODEL
 * Canonical type definitions for all collections.
 * This is the single source of truth for the database schema.
 */

import { Timestamp, FieldValue } from 'firebase/firestore';

// ─── Base Types ──────────────────────────────────────────────────────

export interface BaseDocument {
  id?: string;
  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  createdBy?: string;
  
  // Orchestration Metadata
  orchestrationState?: {
    stage: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    lastTriggeredAt?: Timestamp;
    engineVersion?: string;
    errors?: string[];
  };
}

export type PropertyStatus = 'available' | 'reserved' | 'sold' | 'rented' | 'off-market';
export type PropertyType = 'apartment' | 'villa' | 'townhouse' | 'duplex' | 'penthouse' | 'studio' | 'chalet' | 'commercial' | 'land';
export type PipelineStage = 'inbound' | 'qualify' | 'engage' | 'proposal' | 'viewing' | 'negotiate' | 'reserve' | 'contract' | 'handover' | 'closed-won';
export type StakeholderAcquisitionSource = 'property-finder' | 'olx' | 'website' | 'referral' | 'walk-in' | 'social-media' | 'whatsapp' | 'other';
export type CurrencyCode = 'EGP' | 'USD';
export type FurnishingCode = 'F' | 'U' | 'K' | 'S';
export type SierraFeatureCode = 'G' | 'P' | 'R' | 'V';
export type ListingSentiment = 'positive' | 'neutral' | 'aggressive' | 'desperate';

export interface IntelligenceObject {
  code?: string;
  locationCode?: string;
  furnishingStatus?: FurnishingCode;
  normalizedPrice?: number;
  currency?: CurrencyCode;
  featureCodes?: SierraFeatureCode[];
  valuationScore?: number;
  localityScore?: number;
  standard?: 'luxury' | 'normal' | 'simple';
  condition?: 'new' | 'good' | 'fair' | 'poor';
  legalRiskLevel?: 'low' | 'medium' | 'high';
  legalFlags?: string[];
  marketVelocity?: 'fast' | 'stable' | 'slow';
  urgencyScore?: number;
  sentiment?: ListingSentiment;
  matchingKeywords?: string[];
  roi?: string;
  duplicateCandidateId?: string;
  duplicateConfidence?: number;
  parserVersion?: string;
  lastUpdatedAt?: Timestamp | FieldValue;
  
  // Urban Hub OS - Smart Coding & Protection
  building?: string;
  tower?: string;
  floor?: string;
  unitNumber?: string;
  manual_override?: boolean;

  // Financial & Finishing Intelligence
  finishingGrade?: string;
  paymentTerms?: {
    downpayment?: number;
    installmentsYears?: number;
  };
  valuation?: {
    appraisedValue: number;
    marketDifference: number;
    downpaymentRequired: number;
    installmentMonths: number;
    monthlyInstallment: number;
    valuationStatus: 'underpriced' | 'fair' | 'overpriced';
  };
}

// ─── Units (Listings) ───────────────────────────────────────────────

export interface Unit extends BaseDocument {
  // Identity
  title: string;
  titleAr?: string;
  referenceNumber?: string;
  code?: string;
  slug?: string;

  // Classification
  propertyType: PropertyType;
  category: 'residential' | 'commercial';
  status: PropertyStatus;

  // Location
  projectId?: string;       // FK to projects collection
  developerId?: string;     // FK to developers collection
  compound?: string;
  location?: string;
  city?: string;
  governorate?: string;
  coordinates?: { lat: number; lng: number };

  // Specifications
  area: number;             // in sqm
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  finishingType?: 'fully-finished' | 'semi-finished' | 'core-shell' | 'not-finished';
  view?: string;
  amenities?: string[];

  // Financial
  price: number;
  originalPrice?: number;
  pricePerSqm?: number;
  monthlyRent?: number;
  annualServiceCharge?: number;
  downPayment?: number;
  installmentYears?: number;
  monthlyInstallment?: number;

  // Media
  featuredImage?: string;
  images?: string[];        // Firebase Storage URLs
  videoUrl?: string;
  virtualTourUrl?: string;
  floorPlanUrl?: string;

  // Sync
  syncSource?: 'manual' | 'property-finder';
  pfReferenceNumber?: string;
  manualOverrides?: string[];   // Fields that should not be overwritten by sync
  lastSyncAt?: Timestamp | FieldValue | string;

  // Distribution & Automation
  automation?: {
    isBranded: boolean;
    isPublishedToPF: boolean;
    isPublishedToFB: boolean;
    whatsappAdGenerated: boolean;
    pfReference?: string;
  };

  // Lifecycle
  ownerType: 'owner' | 'broker' | 'internal';
  ownerContact?: string;
  dupeCheckHash?: string;

  // Metadata
  description?: string;
  descriptionAr?: string;
  isFeatured?: boolean;
  publishedAt?: Timestamp;
  archivedAt?: Timestamp | null;

  // Intelligence Layer
  intelligence?: IntelligenceObject;
}

export interface PortfolioAsset extends Unit {}
export type Property = PortfolioAsset;

// ─── Projects (Developments) ────────────────────────────────────────

export interface Project extends BaseDocument {
  name: string;
  nameAr?: string;
  developerId: string;      // FK to developers collection
  slug?: string;

  // Location
  location: string;
  city: string;
  governorate?: string;
  coordinates?: { lat: number; lng: number };

  // Details
  description?: string;
  descriptionAr?: string;
  totalUnits?: number;
  availableUnits?: number;
  launchDate?: Timestamp;
  deliveryDate?: Timestamp;
  completionPercent?: number;

  // Financial
  priceRangeMin?: number;
  priceRangeMax?: number;
  paymentPlan?: string;

  // Media
  logo?: string;
  heroImage?: string;
  images?: string[];
  masterPlanUrl?: string;
  brochureUrl?: string;

  // Status
  status: 'pre-launch' | 'launching' | 'under-construction' | 'delivered' | 'resale';
  isFeatured?: boolean;
}

// ─── Developers ─────────────────────────────────────────────────────

export interface Developer extends BaseDocument {
  name: string;
  nameAr?: string;
  slug?: string;

  // Details
  description?: string;
  descriptionAr?: string;
  foundedYear?: number;
  headquarters?: string;
  website?: string;

  // Reputation
  rating?: number;          // 1-5
  totalProjects?: number;
  tier?: 'premium' | 'standard' | 'emerging';

  // Media
  logo?: string;
  coverImage?: string;

  // Contact
  contactEmail?: string;
  contactPhone?: string;
}

// ─── Media Assets ───────────────────────────────────────────────────

export interface MediaAsset extends BaseDocument {
  // Identity
  filename: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;

  // Storage
  storagePath: string;      // Firebase Storage path
  downloadUrl: string;      // Public download URL
  thumbnailUrl?: string;

  // Classification
  assetType: 'photo' | 'video' | 'floorplan' | 'brochure' | 'document' | 'logo';
  category?: 'exterior' | 'interior' | 'amenity' | 'location' | 'lifestyle';

  // Relations
  unitId?: string;          // FK to units
  projectId?: string;       // FK to projects
  developerId?: string;     // FK to developers

  // Metadata
  altText?: string;
  altTextAr?: string;
  sortOrder?: number;
  isFeatured?: boolean;
  dimensions?: { width: number; height: number };

  // Moderation
  status: 'pending' | 'approved' | 'rejected';
  moderatedBy?: string;
  moderatedAt?: Timestamp;
}

// ─── Investment Stakeholders (Strategic Pipeline) ────────────────────
export interface InvestmentStakeholder extends BaseDocument {
  // Contact Info
  name: string;
  phone: string;
  email?: string;
  nationality?: string;

  // Strategic Pipeline
  stage: PipelineStage;
  source: StakeholderAcquisitionSource;
  assignedTo?: string;      // User ID

  // Interest
  interestedUnitIds?: string[];
  interestedProjectIds?: string[];
  budget?: number;
  budgetMax?: number;
  preferredPropertyType?: PropertyType;
  preferredLocations?: string[];
  preferredBedrooms?: number;
  timeline?: 'immediate' | '1-3months' | '3-6months' | '6-12months' | '12+months';
  investmentGoal?: string;
  relocating?: boolean;
  preferencedCompounds?: string[];

  // Activity
  notes?: string;
  lastContactAt?: Timestamp;
  nextFollowUpAt?: Timestamp;
  interactionCount?: number;

  // Outcome
  wonUnitId?: string;
  wonAmount?: number;
  lostReason?: string;
  closedAt?: Timestamp;

  // AI Matching & Intelligence
  aiProfiling?: {
    score: number;             // Importance score
    interests: string[];       // NLP extracted interests
    topMatches?: Array<{
      unitId: string;
      matchScore: number;
      matchReason: string;
    }>;
    lastMatchRunAt?: Timestamp;
  };

  // Interaction History for Concierge Funnel
  interactionHistory?: Array<{
    unitId: string;
    action: 'click' | 'pass' | 'interested';
    timestamp: Timestamp | FieldValue;
    reason?: string;
  }>;

  // Automation Status
  automation?: {
    botInitiated: boolean;
    scoringCompleted: boolean;
    whatsappFollowupSent: boolean;
    viewingReminderSent: boolean;
    selectionUrlSent?: boolean;
    viewingRewardActive?: boolean;
    lastIncentiveAt?: Timestamp | FieldValue;
    feedbackRequested?: boolean;
    lastFeedbackAt?: Timestamp | FieldValue;
  };

  // PF Sync
  pfLeadId?: string;

  // Intelligence Layer (Neural Memory V9.0)
  intelligence?: {
    closedAssetId?: string;
    lastFeedbackComment?: string;
    contractUrl?: string;
    profile?: {
      bedrooms?: number;
      budget?: number;
      location?: string;
      furnishingStatus?: 'furnished' | 'unfurnished' | 'any';
      moveInDate?: string;
      duration?: string;
      nationality?: string;
      familySize?: number;
    };
    
    // Neural Memory: Semantic Rejections & Patterns
    memory?: {
      negativeSignals: Array<{
        category: 'price' | 'location' | 'finishing' | 'layout' | 'view';
        description: string;
        vector?: number[];      // Embeddings for semantic matching
        importance: number;     // 0-1 weighting
      }>;
      positiveSignals: string[]; 
    };

    // Objections Historical Log
    objections?: Array<{
      unitId: string;
      reason: string;
      category: string;
      sentiment?: ListingSentiment;
      timestamp: Timestamp | FieldValue;
    }>;

    // Cognitive Decision Matrix
    matrix?: {
      lossAversionSensitivity: number; // 0-1 SCARCITY impact
      premiumTolerance: number;        // 0-1 LUXURY impact
    };

    preferences?: {
      likes?: string[];
      dislikes?: string[];
    };
  };
}

export interface Lead extends InvestmentStakeholder {}

// ─── Sales / Transactions ───────────────────────────────────────────

export interface Sale extends BaseDocument {
  unitId: string;
  leadId: string;
  agentId: string;

  // Financial
  salePrice: number;
  commissionPercent: number;
  commissionAmount: number;
  closingDate: Timestamp;

  // Status
  status: 'pending' | 'contracted' | 'completed' | 'cancelled';
  contractNumber?: string;

  // Notes
  notes?: string;
}

// ─── Inbound Asset Signals (Stage 1 & 2 Intake) ─────────────────────
export interface InboundAssetSignal extends BaseDocument {
  // Source Information
  rawMessage: string;
  sourceGroup?: string;
  sourcePlatform: 'whatsapp' | 'telegram' | 'other';
  senderInfo?: string; // Phone or Name
  coordinates?: { lat: number; lng: number };

  // NLP Extracted Data
  extractedData: {
    compound?: string;
    propertyType?: PropertyType;
    bedrooms?: number;
    price?: number;
    currency?: CurrencyCode;
    area?: number;
    finishingType?: string;
    furnishingStatus?: FurnishingCode;
    paymentPlan?: {
      downpayment: number;
      installments: number;
      deliveryDate: string;
    };
    phoneNumber?: string;
    urgencyScore?: number;
    valuationScore?: number;
    sentiment?: ListingSentiment;
    matchingKeywords?: string[];
    features?: SierraFeatureCode[];
    sierraCode?: string;
  };

  intelligence?: IntelligenceObject;

  // Processing
  status: 'new' | 'parsed' | 'validated' | 'duplicate' | 'archived';
  isVerified: boolean;
  duplicateOf?: string; // ID of existing unit

  // Link to canonical asset if converted
  portfolioAssetId?: string; 
}

export interface BrokerListing extends InboundAssetSignal {}

// ─── Vouchers / Incentives ──────────────────────────────────────────

export interface Voucher extends BaseDocument {
  code: string;
  type: 'discount' | 'commission-bonus' | 'viewing-reward';
  value: number;
  currency: string;
  leadId?: string;          // Assigned lead
  status: 'active' | 'redeemed' | 'expired';
  expiresAt: Timestamp;
  conditions?: string;
}

// ─── Proposals / Options Packages (Stage 7) ──────────────────────────

export interface Proposal extends BaseDocument {
  leadId: string;
  leadName?: string;
  
  // Selection
  unitIds: string[];
  units: Array<{
    id: string;
    title: string;
    price: number;
    matchScore: number;
    matchReason: string;
    images?: string[];
    area_name?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    financialAnalysis?: {
      projectedROI: number;
      annualYield: number;
    };
  }>;

  // AI Insights
  strategicSummary?: string;
  strategicSummaryAr?: string;
  
  // Lifecycle
  status: 'draft' | 'deployed' | 'accepted' | 'rejected';
  deployedAt?: Timestamp;
  expiresAt?: Timestamp;
  
  // Analytics
  viewCount?: number;
  lastViewedAt?: Timestamp;
  shareableUrl?: string;

  // Strategic Insights
  financialAnalysis?: {
    projectedROI: number;
    annualYield: number;
    valuationAnalysis: string; // Brief reasoning for the deal quality
    totalPortfolioCapital?: number;
  };
}

// ─── Viewings / Inspections (Stage 8) ───────────────────────────────

export interface Viewing extends BaseDocument {
  leadId: string;
  unitId: string;
  agentId: string;
  scheduledAt: Timestamp;
  status: 'scheduled' | 'completed' | 'cancelled';
  location: string;
  notes?: string;
  reminderSent: boolean;
}

// ─── Users / Staff Profiles ──────────────────────────────────────────
export interface UserProfile extends BaseDocument {
  email: string;
  displayName: string;
  role: 'admin' | 'manager' | 'agent';
  pfUsername?: string;
  pfAgentId?: string;
  phoneNumber?: string;
  status: 'active' | 'inactive';
}

// ─── Activities / Audit Log ─────────────────────────────────────────

export interface Activity extends BaseDocument {
  type: 'lead_created' | 'lead_stage_changed' | 'listing_added' | 'listing_updated' |
        'sale_closed' | 'sync_completed' | 'note_added' | 'assignment_changed';
  actorId: string;
  actorName: string;
  description: string;
  relatedId?: string;
  relatedType?: 'unit' | 'lead' | 'sale' | 'project';
  metadata?: Record<string, unknown>;
}

// ─── Collection Names (Constants) ───────────────────────────────────

export const COLLECTIONS = {
  units: 'listings',        // keeping backward compat with existing 'listings' collection
  projects: 'projects',
  developers: 'developers',
  mediaAssets: 'mediaAssets',
  stakeholders: 'leads',
  sales: 'sales',
  activities: 'activities',
  users: 'users',
  syncQueue: 'syncQueue',
  syncLog: 'syncLog',
  vouchers: 'vouchers',
  proposals: 'proposals',
  brokerListings: 'broker_listings',
  viewings: 'viewings',
  intelligence: 'intelligence', // Global Neural Memory
  conciergeSelections: 'concierge_selections', // S8 Curated Portfolios
} as const;
