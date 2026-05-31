# ✦ SIERRA BLU REALTY — V12.0 FINAL SYSTEM HANDOVER ✦
**Date:** April 2026
**Environment:** Next.js + Firebase + Google Gemini (OpenClaw)
**Status:** Unified & Production-Ready (Merged V11.5 + V12.0 logic)

---

## 1. PROJECT PERSONA & AESTHETIC PHILOSOPHY
- **Brand Mandate:** "Beyond Brokerage"
- **Aesthetic Identity:** "Quiet Luxury" & "Cinematic Reality"
- **Color Palette:** Royal Navy (`#0A1A3A` / `#050B14`), Burnished Gold (`#C9A24A` / `#D4AF37`), Ivory/Silver text.
- **Tone of Voice:** Institutional, Levantine, Senior Strategic Partner. We do not "sell houses", we "curate strategic assets and secure capital allocation."

---

## 2. THE 10-STAGE NEURAL PIPELINE (S1 - S10)
The entire application is a 10-stage orchestration pipeline. The AI agents manage data flow while human "Curators" have final approval.

*   **S1 & S2 (Intake & Normalization) - THE SCRIBE:**
    *   Monitors WhatsApp/Telegram.
    *   Uses **Gemini** to extract data and strictly enforce the **SBR Code Algorithm**: `[Location]-[Rooms][Status]-[Price]+[Feature]` (e.g., `VS-3F-45K+G`).
    *   Runs **DQE (Data Quality Estimation)** to prevent duplicates (5% price margin check).
*   **S3, S4 & S5 (Branding & Distribution) - THE CURATOR:**
    *   Formats the asset into the "Quiet Luxury" standard.
    *   Prepares synchronization with Property Finder and social media.
*   **S6 (Profiling) - THE GATEKEEPER (Leila):**
    *   Extracts lead profiles from chat histories.
    *   **Scoring Matrix (Max 10 pts):** Nationality/Expat (3 pts) + Priority Compound (2 pts) + Budget > 10M EGP (5 pts). Leads scoring 8+ are VIPs.
*   **S7 (Matching & ROI) - THE NEURAL ENGINE:**
    *   Matches assets to leads using **Neural Memory** (negative/positive signals).
    *   **Valuation Engine (4 Axes):** Core Metrics, Yield Logic (Rental demand), Premium Add-ons (Pools, Gardens add direct ROI/Yield points), and Market CMA.
*   **S8 & S9 (Proposals & Finalization) - THE CLOSER:**
    *   Generates a Cinematic Proposal (`/proposals/[id]`).
    *   Tracks viewings and interactions.
*   **S10 (Optimization):** Feeds outcome data back into the Neural Memory to improve future S7 matches.

---

## 3. FRONTEND ARCHITECTURE (Cinematic Reality)
- **Framework:** Next.js (App Router), React, Tailwind CSS.
- **Visuals:** Uses `framer-motion` for scroll-driven parallax effects.
- **GravityWarp (`Visuals.tsx`):** A custom canvas particle engine utilizing gravitational lensing logic with Gold and Cyan elements to represent "Intelligence."
- **Pages of Note:**
    - `app/landing/page.tsx`: The public face. Live Inventory Map, Insights, and Cinematic Hero.
    - `app/proposals/[id]/page.tsx`: The VIP Concierge presentation layer, featuring the luxury polygon loader.

---

## 4. BACKEND & INFRASTRUCTURE
- **Database:** Firebase Firestore (Schema defined in `lib/models/schema.ts`).
- **Storage:** Firebase Storage (for images and media).
- **AI Integration:** Google Generative AI (`@google/generative-ai`) is the core intelligence brain for Scribe and Profiling.
- **Path structure:** The active workspace is `h:\Sierra Blue SaaS Program Locally V2\my-app`. (Drives C: and F: contain deprecated / legacy backups and should be ignored).

---

## 5. RECENT MERGES & OPTIMIZATIONS (April 2026)
1. **SBR Code Strictness:** Updated `coding-algorithm.ts` to seamlessly append features (`+G`, `+P`, `+R`, `+V`) to the strategic code.
2. **Leila's Matrix Accuracy:** Merged the V11.5 3-axis qualification logic into `profiling-service.ts` for hyper-accurate VIP detection.
3. **Valuation Enhancements:** Merged the Premium Add-ons logic into `roi-service.ts` so properties with pools/gardens calculate dynamically higher yields.
4. **WhatsApp Scribe Prompts:** Updated `WhatsAppParserService.ts` prompts to demand the new SBR coding format from Gemini.

---

## 6. PENDING TASKS & RESUMPTION GUIDE
To spin up the platform for final production deployment, the next developer must:

1. **Environment Variables:** Create `.env.local` in the `my-app` directory with:
   ```env
   GOOGLE_AI_API_KEY=your_gemini_1.5_key
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   # (Include all standard Firebase config vars)
   ```
2. **Service Account:** Place the Firebase `serviceAccountKey.json` inside the `server/` directory for `firebase-admin` to operate the WhatsApp Scribe background tasks.
3. **Run Commands:**
   ```bash
   cd "h:\Sierra Blue SaaS Program Locally V2\my-app"
   npm install
   npm run dev
   ```
4. **Initial Test:** Send a test WhatsApp string to the Scribe endpoint or simulate a lead intake to watch the Pipeline automatically transition from S1 -> S8 and generate a Proposal URL.

---
**Authority:** This document supersedes all previous handover notes, including those found in Drive F: and `TECHNICAL_HANDOVER.md`. The project is now structurally unified under V12.0