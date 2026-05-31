# Sierra Blu PropTech OS — Coworker Execution Handoff
**Version**: V13.0 — "The Digital Concierge"
**Date**: May 4, 2026
**Status**: Active Development — Production-Ready Shell

---

> [!IMPORTANT]
> **Single Source of Truth**: The canonical project is at `I:\5 May\my-app`. Do NOT work from any other folder. All other directories are reference/archive only.

---

## 1. System Overview

Sierra Blu is a **bilingual luxury real estate operating system** (Arabic + English) with two halves:

| Half | Purpose | Status |
|---|---|---|
| **Public Website** | Cinematic landing page, property listings, detail pages | ✅ Built (needs polish) |
| **Admin Dashboard** | Inventory management, sync center, client CRM | ❌ Not started |

**Tech Stack**:
- Framework: **Next.js 14** (App Router)
- Database: **Firebase Firestore** (1,000 units already seeded)
- Styling: **Tailwind CSS** with custom design tokens
- AI Agents: **TypeScript MCP Servers** (`mcp-servers/`)
- Maps: **React Leaflet**
- Localization: Custom `I18nContext` (AR + EN)

---

## 2. Environment Setup (Do This First — 15 Minutes)

### Step 1: Verify Node.js
```powershell
# Open PowerShell and run:
& "C:\Program Files\nodejs\node.exe" -v
# Expected: v18 or higher
```

### Step 2: Install Dependencies
```powershell
cd "I:\5 May\my-app"
& "C:\Program Files\nodejs\npm.cmd" install
```

### Step 3: Configure Environment Variables
Create a file at `I:\5 May\my-app\.env.local` and fill in these values:
```env
# Firebase (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sierra-blu
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Optional for Stage 1
STRIPE_SECRET_KEY=
DOCUSIGN_ACCOUNT_ID=
DOCUSIGN_CLIENT_ID=
DOCUSIGN_CLIENT_SECRET=
```

> [!NOTE]
> The `service-account.json` file is already in the project root. This is the Firebase Admin SDK credential. **Do not share it or commit it to Git.**

### Step 4: Start the Dev Server
```powershell
cd "I:\5 May\my-app"
& "C:\Program Files\nodejs\npm.cmd" run dev
```
Open `http://localhost:3000` — you should see the Sierra Blu landing page.

---

## 3. Project File Map (Key Files to Know)

```
I:\5 May\my-app\
│
├── app/                          # Next.js pages (App Router)
│   ├── page.tsx                  # ✅ Homepage (V13.0 done)
│   ├── listings/[id]/page.tsx    # ✅ Property detail page
│   ├── system-kit/page.tsx       # ✅ Design system showcase
│   └── layout.tsx                # Root layout (fonts, providers)
│
├── components/
│   └── Maps/LiveMap.tsx          # ✅ Leaflet map (gold markers)
│
├── lib/
│   ├── I18nContext.tsx           # ✅ AR/EN locale switching
│   ├── models/deals.ts           # ✅ Deal/stage data model
│   └── services/
│       └── InventoryService.ts   # ✅ Firestore data fetching
│
├── agents/
│   └── stage-9-closer/
│       └── CloserAgent.ts        # ✅ Deal state machine (S1→S9)
│
├── mcp-servers/                  # AI agent tool definitions
│   ├── sierra-deals.mcp.ts       # ✅ Deal CRUD operations
│   ├── whatsapp-messaging.mcp.ts # ✅ WhatsApp API stub
│   ├── docusign-signing.mcp.ts   # ✅ Contract signing stub
│   └── stripe-payments.mcp.ts    # ✅ Payment processing stub
│
├── messages/
│   ├── en.json                   # ✅ English translations
│   └── ar.json                   # ✅ Arabic translations
│
├── scripts/
│   └── seed-inventory.mjs        # ✅ Firestore seeder (Admin SDK)
│
├── service-account.json          # ✅ Firebase Admin credentials
├── app/globals.css               # ✅ Design tokens (V13.0)
└── .env.local                    # ❌ YOU MUST CREATE THIS
```

---

## 4. Design Rules (Must Follow — Non-Negotiable)

> [!WARNING]
> Breaking these rules makes the design feel "cheap". The brand target is Dubai-level luxury.

| Rule | Description |
|---|---|
| **No 1px Lines** | Never use `border` to separate sections. Use background color shifts instead |
| **Tonal Layering** | Depth = background color, not shadows. `bg-surface` → `bg-surface-container-low` → `bg-surface-container-lowest` |
| **Gold is Jewelry** | Use `text-secondary` (#C9A84C gold) ONLY for active states, CTAs, key icons |
| **Typography** | Headlines = `font-display` (Manrope). Body = `font-body` (Inter). Arabic = `font-arabic` (Tajawal). Data = `font-mono` |
| **Navy is Structure** | `bg-primary` (#031632) for navbars, footers, strong CTAs |
| **Glassmorphism** | Floating elements use class `glass` (blur + semi-transparent) |

**Color Quick Reference**:
```
Primary (Navy):     #031632
Secondary (Gold):   #C9A84C
Surface (Light bg): #f8f9fa
Surface (Dark bg):  #071422
```

---

## 5. Prioritized Task List

Work through these phases **in order**. Do not skip ahead.

---

### PHASE 1 — Fix Live Bugs (2–3 hours) 🔴 Critical

#### Task 1.1 — Fix Scroll Animations
**File**: `app/page.tsx`

The `IntersectionObserver` is incorrectly placed inside the scroll handler. Move it outside:

```typescript
useEffect(() => {
  setMounted(true);
  setTimeout(() => setIsVisible(true), 100);
  InventoryService.getFeaturedListings(3).then(setFeatured);

  // ✅ Observer outside scroll handler
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const onScroll = () => setScrolled(window.scrollY > 40);
  window.addEventListener('scroll', onScroll);
  return () => {
    window.removeEventListener('scroll', onScroll);
    observer.disconnect();
  };
}, []);
```

#### Task 1.2 — Add Missing Translation Keys
**Files**: `messages/en.json` AND `messages/ar.json`

Add a `"common"` block to both files:

**en.json**:
```json
"common": {
  "back": "Back",
  "loading": "Loading...",
  "notFound": "Asset Not Found"
}
```

**ar.json**:
```json
"common": {
  "back": "رجوع",
  "loading": "جاري التحميل...",
  "notFound": "لم يتم العثور على العقار"
}
```

#### Task 1.3 — Fix Tailwind Custom Colors
**File**: `tailwind.config.ts`

The custom CSS variable-based colors are not registered in Tailwind. Add this to your config:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary':                   'var(--primary)',
        'primary-container':         'var(--primary-container)',
        'on-primary':                'var(--on-primary)',
        'secondary':                 'var(--secondary)',
        'secondary-container':       'var(--secondary-container)',
        'on-secondary':              'var(--on-secondary)',
        'surface':                   'var(--surface)',
        'surface-container-lowest':  'var(--surface-container-lowest)',
        'surface-container-low':     'var(--surface-container-low)',
        'surface-container-high':    'var(--surface-container-high)',
        'surface-container-highest': 'var(--surface-container-highest)',
        'on-surface':                'var(--on-surface)',
        'on-surface-variant':        'var(--on-surface-variant)',
        'outline-variant':           'var(--outline-variant)',
      },
      fontFamily: {
        'display': ['var(--font-display)'],
        'body':    ['var(--font-body)'],
        'arabic':  ['var(--font-arabic)'],
        'serif':   ['var(--font-serif)'],
        'mono':    ['var(--font-mono)'],
      },
      boxShadow: {
        'ambient': 'var(--shadow-ambient)',
      }
    },
  },
  plugins: [],
};
export default config;
```

---

### PHASE 2 — Admin Dashboard Shell (1 day) 🔴 Critical

#### Task 2.1 — Create Firebase Auth Helper
**File to create**: `lib/firebase.ts`

```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

#### Task 2.2 — Admin Login Page
**File to create**: `app/admin/login/page.tsx`

Requirements:
- Full-screen dark `bg-primary` background
- Centered `glass` card with the Shield Logo at the top
- Email + password `<input>` fields (styled, no raw borders)
- "Enter Portal" `<button>` calls `signInWithEmailAndPassword(auth, email, password)`
- On success → redirect to `/admin/dashboard`
- On error → show red error message below the form

#### Task 2.3 — Admin Layout Shell
**File to create**: `app/admin/layout.tsx`

```
[ Sidebar 280px navy ] [ Main Content scrollable ]
```

Sidebar navigation items (use `lucide-react` icons):
- `LayoutDashboard` → Dashboard
- `Building2` → Units
- `Users` → Clients
- `RefreshCw` → Sync Center
- `Image` → Media
- `Settings` → Settings

Install icons first:
```powershell
& "C:\Program Files\nodejs\npm.cmd" install lucide-react
```

Active item style: `bg-white/5 text-secondary border-l-2 border-secondary`
Inactive item style: `text-white/60 hover:text-white/90`

#### Task 2.4 — Dashboard KPI Page
**File to create**: `app/admin/dashboard/page.tsx`

Four metric cards from live Firestore data:
| Card | Data Source |
|---|---|
| Total Units | `getCountFromServer(collection(db, 'listings'))` |
| Active Deals | `query(collection(db,'deals'), where('stage','!=','closed'))` → count |
| Revenue This Month | Sum of `amount` in `deals` where `closedAt` >= first of month |
| Sync Status | Last document in `sync_jobs` collection → show `status` field |

---

### PHASE 3 — Units Inventory Management (1 day) 🟠 High

#### Task 3.1 — Units List Page
**File to create**: `app/admin/units/page.tsx`

- Data table with columns: Title, Compound, Type, Area (m²), Price (EGP), Bedrooms, Status
- Pagination: 50 units per page using `limit(50)` + `startAfter()` cursor
- Status chip filters: All / Available / Reserved / Sold
- Search input (client-side filter on loaded data)
- No table grid lines — use `hover:bg-surface-container-low` row highlight only
- "Add Unit" button → `/admin/units/new`

```typescript
// Data fetching pattern
const q = query(
  collection(db, 'listings'),
  where('status', '==', filter),  // 'available' | 'reserved' | 'sold'
  orderBy('createdAt', 'desc'),
  limit(50)
);
```

#### Task 3.2 — Unit Editor (Create & Edit)
**Files to create**:
- `app/admin/units/new/page.tsx`
- `app/admin/units/[id]/page.tsx`

Both use the same `<UnitForm>` component at `components/admin/UnitForm.tsx`.

Form fields:
- Title (text)
- Property Type (select: apartment / villa / townhouse / duplex / penthouse)
- Compound (text)
- Location (text)
- City (text)
- Price in EGP (number)
- Area in m² (number)
- Bedrooms (number: 1–10)
- Finishing Type (select: fully-finished / semi-finished / core-shell)
- Status (select: available / reserved / sold)
- Valuation Score (range slider: 0–100)
- Urgency Score (range slider: 0–100)

On save: `setDoc` or `updateDoc` in `listings` collection.

Install toast notifications:
```powershell
& "C:\Program Files\nodejs\npm.cmd" install react-hot-toast
```

Success toast: `toast.success('Unit saved successfully')`

---

### PHASE 4 — Deal Management (1 day) 🟠 High

#### Task 4.1 — Deals List (Kanban Board)
**File to create**: `app/admin/deals/page.tsx`

Deal stages (columns on the board):
`draft` → `proposal` → `negotiation` → `legal` → `payment` → `closed`

The `deals` Firestore collection schema (from `lib/models/deals.ts`):
```typescript
{
  id: string;
  clientName: string;
  clientPhone: string;
  unitId: string;
  stage: 'draft' | 'proposal' | 'negotiation' | 'legal' | 'payment' | 'closed';
  amount: number;
  currency: 'EGP' | 'USD';
  createdAt: string;
  updatedAt: string;
}
```

Each Kanban card shows: client name, amount, and a "→" arrow to advance stage.

#### Task 4.2 — Deal Detail Page
**File to create**: `app/admin/deals/[id]/page.tsx`

- Full deal information
- Horizontal stage progress bar
- "Advance Stage" button → calls the `CloserAgent` from `agents/stage-9-closer/CloserAgent.ts`
- Timeline of stage changes (stored in a `history` sub-array on the deal document)

---

### PHASE 5 — Sync Center (Half day) 🟡 Medium

#### Task 5.1 — Sync Center Page
**File to create**: `app/admin/sync/page.tsx`

Three panels:

**Panel 1 — Integration Health**:
Read last document from `sync_jobs` collection. Show:
- Status badge (green = success, yellow = pending, red = failed)
- Timestamp of last sync
- Units processed count

**Panel 2 — Manual Trigger**:
A "Run Sync" button that calls `POST /api/sync/trigger`.

**File to create**: `app/api/sync/trigger/route.ts`
```typescript
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST() {
  await addDoc(collection(db, 'sync_jobs'), {
    status: 'pending',
    triggeredBy: 'manual',
    createdAt: new Date().toISOString(),
  });
  return Response.json({ ok: true });
}
```

**Panel 3 — Dedupe Queue**:
List `listings` where `syncSource == 'property-finder'` and `dedupeStatus == 'review'`.
Show count + individual rows with "Approve" / "Reject" buttons.

---

### PHASE 6 — Public Site Polish (Half day) 🟡 Medium

#### Task 6.1 — Listings Index Page
**File to create**: `app/listings/page.tsx`

- Full-page grid of property cards (reuse from homepage)
- Search bar at top
- Filter bar: Area, Type, Price Range, Bedrooms
- "Load More" button using Firestore cursor pagination

#### Task 6.2 — 3D Hero Background
**File**: `app/page.tsx` — Hero section

The file `/public/hero-bg-3d.png` exists. Add it as a background:
```tsx
<section className="relative min-h-[90vh] ...">
  <img
    src="/hero-bg-3d.png"
    alt=""
    aria-hidden="true"
    className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
  />
  <div className="absolute inset-0 bg-gradient-to-b from-surface/90 via-surface/70 to-surface pointer-events-none" />
  {/* ... hero content */}
```

#### Task 6.3 — Verify Dark Mode Persistence
**File**: `app/layout.tsx`

Ensure the root layout wraps in ThemeProvider:
```tsx
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 6. Acceptance Criteria Checklist

### Phase 1 ✅
- [ ] Scroll animations work smoothly on homepage
- [ ] "Back" / "رجوع" shows correctly on detail page (not "undefined")
- [ ] No Tailwind CSS warnings in console
- [ ] `http://localhost:3000/listings/[id]` loads without hydration error in console

### Phase 2 ✅
- [ ] `/admin/login` shows dark branded login screen
- [ ] Wrong password shows red error message
- [ ] Correct login redirects to `/admin/dashboard`
- [ ] Dashboard shows 4 metric cards with live Firestore data
- [ ] Sidebar present on desktop, bottom nav on mobile

### Phase 3 ✅
- [ ] `/admin/units` shows table of 50 units from Firestore
- [ ] Status filter chips update the table
- [ ] Saving a unit writes to Firestore and shows success toast

### Phase 4 ✅
- [ ] `/admin/deals` shows a Kanban board with at least one column per stage
- [ ] "Advance Stage" button updates the deal's `stage` field in Firestore

---

## 7. Known Issues & Do NOT Touch

> [!CAUTION]
> These are intentionally left as stubs. Do not try to activate them without proper credentials.

| Item | Location | Status |
|---|---|---|
| WhatsApp API | `mcp-servers/whatsapp-messaging.mcp.ts` | Stub — needs `WHATSAPP_TOKEN` |
| DocuSign | `mcp-servers/docusign-signing.mcp.ts` | Stub — needs OAuth credentials |
| Stripe | `mcp-servers/stripe-payments.mcp.ts` | Stub — needs `STRIPE_SECRET_KEY` |
| Firestore Security Rules | Firebase Console | Currently open — lock before production |

---

## 8. Git Workflow

```powershell
cd "I:\5 May\my-app"

# Create a branch per phase
git checkout -b feature/phase-1-ui-fixes
git checkout -b feature/phase-2-admin-shell
git checkout -b feature/phase-3-units-crud

# Commit often with clear messages
git add .
git commit -m "feat(admin): add sidebar layout with lucide icons"

# Push when done
git push origin feature/phase-2-admin-shell
```

---

## 9. Key Reference Documents

| Document | Location |
|---|---|
| Design Rules | `I:\5 May\Frontend\DESIGN.md` |
| Master Project Brief | `I:\5 May\Frontend\sierra_blu_realty_master_handoff_no_references.txt` |
| UI Kit Components (JSX) | `I:\5 May\Frontend\ui_kits\website\` |
| CSS Design Tokens | `I:\5 May\Frontend\colors_and_type.css` |
| Agent Roles | `AGENTS.md` (project root) |

---

*End of Handoff — Sierra Blu Realty V13.0 · Digital Concierge*
