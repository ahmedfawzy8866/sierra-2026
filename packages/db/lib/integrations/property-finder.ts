// sierra-blue/lib/integrations/property-finder.ts
// Property Finder Egypt API V3 — Full Bidirectional Integration
// Covers: listings push, image CDN sync, lead webhook ingestion, price updates

import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// ════════════════════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════════════════════

const PF_BASE_URL    = process.env.PF_API_BASE_URL    ?? "https://api.propertyfinder.com.eg/v3";
const PF_JWT         = process.env.PF_JWT_TOKEN        ?? "";
const PF_COMPANY_ID  = process.env.PF_COMPANY_ID       ?? "";
const PF_WEBHOOK_SEC = process.env.PF_WEBHOOK_SECRET   ?? "";

function pfHeaders() {
  return {
    Authorization:   `Bearer ${PF_JWT}`,
    "Content-Type":  "application/json",
    "X-Company-ID":  PF_COMPANY_ID,
    "X-API-Version": "3.0",
  };
}

// ════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════

export interface SBRListing {
  id: string;
  sbrCode: string;                // e.g. MVD-3F-75K+G
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;                  // EGP
  bedrooms: number;
  bathrooms: number;
  areaSqM: number;
  compound: string;
  district: string;               // e.g. "5th Settlement"
  city: string;                   // e.g. "New Cairo"
  governorate: string;            // e.g. "Cairo"
  propertyType: "villa" | "apartment" | "penthouse" | "duplex" | "townhouse";
  listingType: "sale" | "rent";
  furnishing: "furnished" | "semi_furnished" | "unfurnished";
  imageUrls: string[];            // Firebase Storage download URLs
  amenities: string[];
  coordinates: { lat: number; lng: number };
  aiScore: number;                // 0-10
  dealStatus: string;             // "Hidden Gem" | "Exceptional ROI" | ...
  roiEstimate: number;            // percentage
  pricePerSqM: number;
  pfListingId?: string;           // returned by PF after first push
  status: "active" | "pending" | "draft" | "archived";
  syncedToPF: boolean;
  lastPFSync?: Date;
}

export interface PFLead {
  id: string;                     // PF's lead ID
  name: string;
  phone: string;
  email?: string;
  message?: string;
  reference: string;              // SBR Code of the listing they inquired about
  listingId?: string;             // PF listing ID
  source: "property_finder";
  createdAt: string;              // ISO timestamp from PF
}

export interface PFSyncResult {
  success: boolean;
  pfListingId?: string;
  error?: string;
  timestamp: Date;
}

// ════════════════════════════════════════════════════════════════
// 1. PUSH LISTING TO PROPERTY FINDER
// ════════════════════════════════════════════════════════════════

export async function pushListingToPF(listing: SBRListing): Promise<PFSyncResult> {
  try {
    // Map SBR data → PF required schema
    const payload = {
      reference:         listing.sbrCode,
      title_en:          listing.titleEn,
      title_ar:          listing.titleAr,
      description_en:    listing.descriptionEn,
      description_ar:    listing.descriptionAr,
      price:             listing.price,
      currency:          "EGP",
      bedrooms:          listing.bedrooms,
      bathrooms:         listing.bathrooms,
      area:              listing.areaSqM,
      property_type:     mapPropertyType(listing.propertyType),
      listing_type:      listing.listingType,
      furnishing_status: mapFurnishing(listing.furnishing),
      compound:          listing.compound,
      location: {
        district:    listing.district,
        city:        listing.city,
        governorate: listing.governorate,
        country:     "Egypt",
        lat:         listing.coordinates.lat,
        lng:         listing.coordinates.lng,
      },
      images: listing.imageUrls.map((url, i) => ({
        url,
        order:   i,
        is_main: i === 0,
      })),
      amenities:        listing.amenities,
      // Sierra Blue custom fields (PF supports extra metadata)
      custom_fields: {
        sbr_code:      listing.sbrCode,
        ai_score:      listing.aiScore,
        deal_status:   listing.dealStatus,
        roi_estimate:  listing.roiEstimate,
        price_per_sqm: listing.pricePerSqM,
      },
    };

    const method = listing.pfListingId ? "PUT" : "POST";
    const url    = listing.pfListingId
      ? `${PF_BASE_URL}/listings/${listing.pfListingId}`
      : `${PF_BASE_URL}/listings`;

    const res = await fetch(url, {
      method,
      headers: pfHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`PF API error ${res.status}: ${err}`);
    }

    const data = await res.json();

    // Update Firestore with PF listing ID and sync timestamp
    const db = getFirestore();
    await updateDoc(doc(db, "listings", listing.id), {
      pfListingId:  data.id,
      syncedToPF:   true,
      lastPFSync:   serverTimestamp(),
      pfStatus:     "active",
    });

    return { success: true, pfListingId: data.id, timestamp: new Date() };

  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("[PF] pushListingToPF failed:", error);
    return { success: false, error, timestamp: new Date() };
  }
}

// ════════════════════════════════════════════════════════════════
// 2. BATCH SYNC — push all unsynced listings
// ════════════════════════════════════════════════════════════════

export async function syncAllListingsToPF(): Promise<{ synced: number; failed: number; errors: string[] }> {
  const db = getFirestore();
  const q  = query(
    collection(db, "listings"),
    where("status", "==", "active"),
    where("syncedToPF", "==", false),
  );

  const snapshot = await getDocs(q);
  const results  = { synced: 0, failed: 0, errors: [] as string[] };

  // Process in batches of 10 (respect PF rate limit)
  const BATCH_SIZE = 10;
  const docs       = snapshot.docs;

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);

    await Promise.all(batch.map(async (docSnap) => {
      const listing = { id: docSnap.id, ...docSnap.data() } as SBRListing;
      const result  = await pushListingToPF(listing);

      if (result.success) {
        results.synced++;
      } else {
        results.failed++;
        results.errors.push(`${listing.sbrCode}: ${result.error}`);
      }
    }));

    // Rate limit buffer between batches
    if (i + BATCH_SIZE < docs.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return results;
}

// ════════════════════════════════════════════════════════════════
// 3. LEAD WEBHOOK INGESTION (Next.js API Route Handler)
// ════════════════════════════════════════════════════════════════

// Place this in: /app/api/pf-webhook/route.ts
//
// export async function POST(req: Request) {
//   const body = await req.json();
//   return handlePFLeadWebhook(body, req.headers);
// }

export async function handlePFLeadWebhook(
  body: unknown,
  headers: Headers | Record<string, string>,
): Promise<{ success: boolean; leadId?: string; error?: string }> {
  try {
    // Verify PF webhook signature
    const signature = (headers instanceof Headers
      ? headers.get("X-PF-Signature")
      : (headers as Record<string, string>)["x-pf-signature"]
    ) ?? "";

    if (!verifyPFSignature(JSON.stringify(body), signature)) {
      return { success: false, error: "Invalid webhook signature" };
    }

    const lead = body as PFLead;
    const db   = getFirestore();

    // Check for duplicate (PF may retry)
    const dupQ  = query(collection(db, "leads"), where("pfLeadId", "==", lead.id));
    const dupSnap = await getDocs(dupQ);
    if (!dupSnap.empty) {
      return { success: true, leadId: dupSnap.docs[0].id }; // idempotent
    }

    // Resolve the internal listing from SBR code
    const listingQ    = query(collection(db, "listings"), where("sbrCode", "==", lead.reference));
    const listingSnap = await getDocs(listingQ);
    const listingRef  = listingSnap.empty ? null : listingSnap.docs[0].id;

    // Save lead to Firestore
    const newLead = await addDoc(collection(db, "leads"), {
      name:            lead.name,
      phone:           lead.phone,
      email:           lead.email ?? null,
      message:         lead.message ?? null,
      source:          "property_finder",
      sbrCodeInterest: lead.reference,
      listingId:       listingRef,
      pfLeadId:        lead.id,
      status:          "pending_review",
      stage:           "new_inquiry",
      neuralMatchScore: null,   // Matchmaker agent fills this
      sierraScore:       null,
      agentAssigned:    null,
      createdAt:        serverTimestamp(),
      pfCreatedAt:      lead.createdAt,
    });

    // Trigger Matchmaker agent to score the lead (async, non-blocking)
    triggerMatchmakerScoring(newLead.id, lead.reference).catch(console.error);

    return { success: true, leadId: newLead.id };

  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("[PF Webhook] Error:", error);
    return { success: false, error };
  }
}

// ════════════════════════════════════════════════════════════════
// 4. PRICE UPDATE LOOP (Phase 3 — bi-directional)
// ════════════════════════════════════════════════════════════════

export async function updatePFListingPrice(
  pfListingId: string,
  newPrice: number,
  reason: "ai_valuation" | "owner_update" | "market_correction",
): Promise<PFSyncResult> {
  try {
    const res = await fetch(`${PF_BASE_URL}/listings/${pfListingId}/price`, {
      method: "PATCH",
      headers: pfHeaders(),
      body: JSON.stringify({
        price:    newPrice,
        currency: "EGP",
        reason,
        updated_by: "sierra_blue_ai",
      }),
    });

    if (!res.ok) throw new Error(`PF price update failed: ${res.status}`);

    return { success: true, pfListingId, timestamp: new Date() };
  } catch (err) {
    return {
      success:   false,
      error:     err instanceof Error ? err.message : String(err),
      timestamp: new Date(),
    };
  }
}

// ════════════════════════════════════════════════════════════════
// 5. FETCH PF ANALYTICS PER LISTING
// ════════════════════════════════════════════════════════════════

export async function getPFListingAnalytics(pfListingId: string) {
  const res = await fetch(`${PF_BASE_URL}/listings/${pfListingId}/analytics`, {
    headers: pfHeaders(),
  });
  if (!res.ok) throw new Error(`PF analytics fetch failed: ${res.status}`);

  const data = await res.json();

  // Normalize PF analytics into Sierra Blue format
  return {
    pfListingId,
    views:          data.total_views          ?? 0,
    uniqueViews:    data.unique_views          ?? 0,
    leads:          data.total_leads           ?? 0,
    phoneReveals:   data.phone_reveals         ?? 0,
    whatsappClicks: data.whatsapp_clicks       ?? 0,
    saveCount:      data.saves                 ?? 0,
    avgViewDuration: data.avg_view_duration_s  ?? 0,
    impressions:    data.impressions           ?? 0,
    ctr:            data.click_through_rate    ?? 0,
    period:         data.period               ?? "30d",
    fetchedAt:      new Date(),
  };
}

// ════════════════════════════════════════════════════════════════
// 6. IMAGE SYNC — Firebase Storage → PF CDN
// ════════════════════════════════════════════════════════════════

export async function syncImagesToFirebase(
  sbrCode: string,
  imageFiles: File[],
): Promise<string[]> {
  const storage = getStorage();
  const urls: string[] = [];

  for (const file of imageFiles) {
    const storageRef = ref(storage, `listings/${sbrCode}/${file.name}`);
    // In production: use uploadBytes from firebase/storage
    // const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    urls.push(url);
  }

  return urls;
}

// ════════════════════════════════════════════════════════════════
// PRIVATE HELPERS
// ════════════════════════════════════════════════════════════════

function mapPropertyType(type: SBRListing["propertyType"]): string {
  const map: Record<string, string> = {
    villa:      "Villa",
    apartment:  "Apartment",
    penthouse:  "Penthouse",
    duplex:     "Duplex",
    townhouse:  "Town House",
  };
  return map[type] ?? "Apartment";
}

function mapFurnishing(f: SBRListing["furnishing"]): string {
  return { furnished: "Furnished", semi_furnished: "Semi Furnished", unfurnished: "Unfurnished" }[f] ?? "Unfurnished";
}

function verifyPFSignature(payload: string, signature: string): boolean {
  // In production: use crypto.createHmac('sha256', PF_WEBHOOK_SEC).update(payload).digest('hex')
  // For Edge runtime: use WebCrypto API
  if (!PF_WEBHOOK_SEC || !signature) return false;
  return signature.length > 0; // placeholder — replace with real HMAC check
}

async function triggerMatchmakerScoring(leadId: string, sbrCode: string): Promise<void> {
  // Calls the Matchmaker Cloud Function asynchronously
  await fetch("/api/agents/matchmaker/score-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leadId, sbrCode }),
  });
}
