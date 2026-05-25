/**
 * SIERRA BLU — STAGE 8: PORTFOLIO ENGINE
 * Curates top 3-5 matches into a VIP "Concierge Selection"
 * and generates shareable mobile-first gallery links.
 * 
 * The "Sierra" persona: Warm, editorial, luxury-focused.
 */

import { db } from '../firebase';
import {
  doc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { COLLECTIONS, type Lead, type Unit, type Proposal } from '../models/schema';
import { GoogleAIService } from '../server/google-ai';
import { analyzeAssetFinancials } from './roi-service';
import { TelegramAlertService } from './telegram-alert-service';

export interface ConciergeSelection {
  id: string;
  leadId: string;
  leadName: string;
  createdAt: Timestamp;
  units: ConciergeUnit[];
  personalNote: string; // AI-written message from "Sierra"
  whatsappLink: string;
  matchingScore: number; // Overall portfolio fit
  estimatedPortfolioROI: number;
}

export interface ConciergeUnit {
  id: string;
  title: string;
  price: number;
  matchScore: number;
  estimatedYield: number;
  estimatedROI: number;
  imageUrl?: string;
  description: string; // 2-3 sentence luxury description
  reason: string; // Why this unit matches the client
}

/**
 * Curate the top 3-5 matches into a Concierge Selection Portfolio.
 * This is the "Sierra" magic moment — personal, editorial, exclusive.
 */
export async function curateConciergePortfolio(leadId: string): Promise<ConciergeSelection> {
  // 1. Fetch Lead profile
  const leadSnap = await getDoc(doc(db, COLLECTIONS.stakeholders, leadId));
  if (!leadSnap.exists()) throw new Error('Lead not found');
  const lead = { id: leadSnap.id, ...leadSnap.data() } as Lead;

  if (!lead.aiProfiling?.topMatches || lead.aiProfiling.topMatches.length === 0) {
    throw new Error('No matches found. Run Stage 6 (Matching) first.');
  }

  // 2. Select top 3-5 matches (based on score + diversity)
  const selectedMatches = lead.aiProfiling.topMatches
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5); // Get top 5, we'll filter to 3-5

  // 3. Fetch unit details and financials
  const conciergeUnits: ConciergeUnit[] = [];
  let totalROI = 0;
  let matchSum = 0;

  for (const match of selectedMatches) {
    const unitSnap = await getDoc(doc(db, COLLECTIONS.units, match.unitId));
    if (!unitSnap.exists()) continue;

    const unit = { id: unitSnap.id, ...unitSnap.data() } as Unit;
    const financials = await analyzeAssetFinancials(unit);

    // Generate luxury property description
    const description = await generateLuxuryDescription(lead, unit);

    conciergeUnits.push({
      id: unit.id ?? unitSnap.id,
      title: unit.title,
      price: unit.price,
      matchScore: match.matchScore,
      estimatedYield: financials.annualYield,
      estimatedROI: financials.projectedROI,
      imageUrl: unit.featuredImage ?? undefined,
      description,
      reason: match.matchReason,
    });

    totalROI += financials.projectedROI;
    matchSum += match.matchScore;
  }

  // Filter to 3 units minimum, 5 maximum (quality over quantity)
  if (conciergeUnits.length > 5) {
    conciergeUnits.splice(5); // Keep only top 5
  }
  if (conciergeUnits.length === 0) {
    throw new Error('No valid units found for portfolio curation.');
  }

  // 4. Generate personalized "Sierra" note
  const personalNote = await generateSierraNoteFromTemplate(lead, conciergeUnits);

  // 5. Create Concierge Selection document
  const portfolioRef = await addDoc(collection(db, COLLECTIONS.conciergeSelections), {
    leadId,
    leadName: lead.name,
    units: conciergeUnits,
    personalNote,
    matchingScore: matchSum / conciergeUnits.length,
    estimatedPortfolioROI: totalROI / conciergeUnits.length,
    createdAt: serverTimestamp(),
    status: 'generated',
    whatsappLink: `https://sierra-blu.web.app/concierge/${leadId}?gallery=true`,
  });

  const portfolio: ConciergeSelection = {
    id: portfolioRef.id,
    leadId,
    leadName: lead.name,
    createdAt: Timestamp.now(),
    units: conciergeUnits,
    personalNote,
    whatsappLink: `https://sierra-blu.web.app/concierge/${leadId}?gallery=true`,
    matchingScore: matchSum / conciergeUnits.length,
    estimatedPortfolioROI: totalROI / conciergeUnits.length,
  };

  // 6. Update Lead record
  await updateDoc(doc(db, COLLECTIONS.stakeholders, leadId), {
    'stage': 'S8_CONCIERGE_SELECTION',
    'conciergePortfolioId': portfolioRef.id,
    'lastCuratedAt': serverTimestamp(),
  });

  console.log(`✅ Concierge Portfolio curated for ${lead.name}: ${conciergeUnits.length} units selected`);

  return portfolio;
}

/**
 * Generate a luxury property description in Sierra's voice.
 */
async function generateLuxuryDescription(lead: Lead, unit: Unit): Promise<string> {
  const prompt = `You are Sierra, a luxury property concierge for Sierra Blu Realty. 
Generate a 2-3 sentence description of this property for a high-net-worth client.
The tone should be warm, editorial, and exclusive. Emphasize lifestyle and investment potential.

Property: ${unit.title}
Price: ${unit.price} EGP
Compound: ${unit.compound}
Bedrooms: ${unit.bedrooms ?? 'N/A'}
Client Budget: ${lead.budget ?? lead.budgetMax} EGP

Write ONLY the description. No extra text.`;

  const response = await GoogleAIService.generateContent('portfolio-engine', 'S8:description', { user: prompt });
  return (response as string).trim();
}

/**
 * Generate personalized "Sierra" welcome note for the Concierge Selection.
 */
async function generateSierraNoteFromTemplate(lead: Lead, units: ConciergeUnit[]): Promise<string> {
  const unitTitles = units.map(u => u.title).join(', ');
  
  const prompt = `You are Sierra, the personal concierge at Sierra Blu Realty.
Write a warm, 3-4 sentence welcome message for a VIP client about their curated portfolio selection.

Client Name: ${lead.name}
Selected Units: ${unitTitles}
Budget: ${lead.budget || lead.budgetMax} EGP
Investment Goal: Long-term wealth creation

The tone should be:
- Warm and professional
- Celebratory (they've been pre-selected for VIP access)
- Exclusive (emphasize the curated, personalized nature)
- Action-oriented (gently guide them to request viewings)

Write ONLY the message. No extra text.`;

  const response = await GoogleAIService.generateContent('portfolio-engine', 'S8:note', { user: prompt });
  return (response as string).trim();
}

/**
 * Send Concierge Portfolio to client via WhatsApp.
 * Includes shareable gallery link + personal note.
 */
export async function sendPortfolioViaWhatsApp(
  leadId: string,
  portfolio: ConciergeSelection,
  phoneNumber: string
): Promise<void> {
  const message = `
👋 *${portfolio.leadName}*, Laila here!

I've curated 3 exclusive properties just for you:

${portfolio.units
  .map(
    (u) => `
📍 *${u.title}*
💰 ${u.price.toLocaleString()} EGP | ${u.matchScore}% Match
🏠 ${u.reason}
`
  )
  .join('')}

*Portfolio ROI*: ${portfolio.estimatedPortfolioROI.toFixed(1)}% annually

👉 *View Full Gallery:* ${portfolio.whatsappLink}

${portfolio.personalNote}

Ready to explore? Reply "VIEWING" or click the gallery link above! ✨
`;

  // Send via WhatsApp API (integration with WhatsApp service)
  // This is a placeholder for actual WhatsApp integration
  console.log(`📱 Sending WhatsApp to ${phoneNumber}:\n${message}`);
  
  // Update lead status
  await updateDoc(doc(db, COLLECTIONS.stakeholders, leadId), {
    'conciergePortfolioSentAt': serverTimestamp(),
    'conciergePortfolioSentVia': 'whatsapp',
  });
}

/**
 * Track portfolio view metrics (analytics for S10 Feedback Loop).
 */
export async function trackPortfolioEngagement(
  portfolioId: string,
  leadId: string,
  action: 'viewed' | 'unit_clicked' | 'requested_viewing'
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.conciergeSelections, portfolioId), {
    [`engagement.${action}`]: serverTimestamp(),
  });

  console.log(`📊 Engagement tracked: ${action} for portfolio ${portfolioId}`);
}
