# Sierra 2027 — System Architecture

**Platform:** Production-Grade PropTech OS  
**Tech Stack:** Next.js 16, React 19, Firebase, Tailwind CSS 4  
**Deployment:** Vercel + Firebase (Firestore, Auth, Storage, Functions)  
**Status:** Phase 1 Foundation Complete ✓

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SIERRA ESTATES REALTY 2027                   │
│              Egypt's AI-Powered Real Estate OS              │
└─────────────────────────────────────────────────────────────┘
                              ▲
                ┌─────────────┼─────────────┐
                │             │             │
         ┌──────▼──┐  ┌──────▼──┐  ┌──────▼──┐
         │   Web   │  │  Admin  │  │   API   │
         │  App    │  │ Portal  │  │ Routes  │
         │Next.js  │  │ (Vite)  │  │(Express)│
         └────┬────┘  └────┬────┘  └────┬────┘
              │             │             │
              └─────────────┼─────────────┘
                            │
         ┌──────────────────▼──────────────────┐
         │     FIREBASE INFRASTRUCTURE        │
         ├──────────────────────────────────────┤
         │ • Firestore (Real-time Database)    │
         │ • Cloud Storage (Media Assets)      │
         │ • Authentication (OAuth + Custom)   │
         │ • Cloud Functions (Cron Jobs)       │
         │ • App Check (Security)              │
         └──────────────────────────────────────┘
                            │
         ┌──────────────────▼──────────────────┐
         │  INTELLIGENCE LAYER (4-Agent)       │
         ├──────────────────────────────────────┤
         │ 1. SCRIBE 📝 (Documentation)        │
         │ 2. CURATOR 🎨 (Design QA)           │
         │ 3. MATCHMAKER 🤝 (AI Matching)      │
         │ 4. CLOSER 💼 (Deal Automation)      │
         └──────────────────────────────────────┘
```

---

## Directory Structure

```
Sierra-2027/
├── apps/
│   ├── web/                    # Next.js 16 main app
│   │   ├── app/                # App Router (pages + API routes)
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── page-unified.tsx# Unified hero with stereoscopic effects
│   │   │   ├── admin/          # Admin dashboard routes
│   │   │   ├── api/            # 22+ API endpoints
│   │   │   ├── listings/       # Property listing pages
│   │   │   ├── proposals/      # Deal proposal UI
│   │   │   └── virtual-tour/   # 360° tour pages
│   │   ├── components/         # React components
│   │   │   ├── Admin/          # Admin-specific UI
│   │   │   ├── Auth/           # Authentication UI
│   │   │   ├── CRM/            # CRM components (Kanban, etc)
│   │   │   ├── Landing/        # Marketing landing pages
│   │   │   ├── Listings/       # Property listing components
│   │   │   ├── Maps/           # Leaflet map integration
│   │   │   ├── Proposals/      # Deal proposal UI
│   │   │   ├── UI/             # Base UI primitives
│   │   │   └── System/         # System components
│   │   ├── lib/                # Business logic & utilities
│   │   │   ├── agents/         # Agent client wrappers
│   │   │   ├── auth/           # Authentication (admin.ts)
│   │   │   ├── database-protocol.ts # Firestore interface
│   │   │   ├── firebase.ts     # Client Firebase init
│   │   │   ├── server/         # SERVER-ONLY modules
│   │   │   │   ├── firebase-admin.ts # Admin SDK (hardened)
│   │   │   │   ├── auth-guard.ts # Server auth validation
│   │   │   │   ├── google-ai.ts # Google AI integration
│   │   │   │   └── gravity.ts  # Vector DB integration
│   │   │   ├── models/         # Data models (deals, schema)
│   │   │   ├── services/       # 30+ business services
│   │   │   ├── prompts/        # AI prompt templates
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── design-tokens.ts # Design system values
│   │   │   └── validation/     # Input validation schemas
│   │   ├── agents/             # Agent implementations
│   │   │   └── stage-9-closer/ # Deal closing automation
│   │   │       ├── CloserAgent.ts
│   │   │       ├── proposal-generator.ts
│   │   │       └── messaging/templates.ts
│   │   ├── documents/          # Generated documents
│   │   │   └── themes/         # PDF/proposal themes
│   │   ├── public/             # Static assets
│   │   ├── middleware.ts       # Edge middleware (auth validation)
│   │   ├── next.config.ts      # Next.js config
│   │   ├── tailwind.config.js  # Tailwind design system
│   │   ├── tsconfig.json       # TypeScript config
│   │   └── package.json        # Web app dependencies
│   │
│   └── admin/                  # Vite React admin portal (optional)
│
├── packages/                   # Monorepo shared packages
│   ├── agents/                 # Agent orchestration library
│   ├── db/                     # Database & auth shared logic
│   ├── ui/                     # Component library
│   ├── api/                    # API utilities
│   ├── config/                 # Shared configuration
│   └── auth/                   # Auth package
│
├── functions/                  # Firebase Cloud Functions
│   ├── property-sync.ts        # Sync new listings (6am daily)
│   ├── market-analysis.ts      # Price trends (8pm daily)
│   ├── lead-nurture.ts         # Auto follow-ups (9am daily)
│   └── analytics-export.ts     # Revenue reports (11:59pm)
│
├── infra/                      # Infrastructure configs
│   ├── firestore.rules         # Firestore security rules
│   ├── storage.rules           # Cloud Storage permissions
│   └── firebase.json           # Firebase config
│
├── docs/                       # Documentation
│   ├── API.md                  # Endpoint documentation
│   ├── CONTRIBUTING.md         # Development guidelines
│   ├── DEPLOYMENT.md           # Deployment procedures
│   └── SECURITY.md             # Security policies
│
├── .github/
│   └── workflows/              # CI/CD pipelines
│       ├── test.yml            # Run tests on PR
│       ├── build.yml           # Build verification
│       └── deploy.yml          # Deploy to Vercel
│
├── ARCHITECTURE.md             # This file
├── README.md                   # Project overview
├── TODO.md                     # Feature roadmap
├── DEPLOYMENT_GUIDE.md         # Step-by-step deployment
├── INTEGRATION_COMPLETE.md     # Status dashboard
└── package.json                # Root workspace config
```

---

## Core Technologies

### Frontend Stack
- **Next.js 16.2.6** — React framework with App Router, SSR, API routes
- **React 19.2.4** — UI library with latest features
- **TypeScript 5.3** — Type-safe development
- **Tailwind CSS 4** — Utility-first styling with strict design tokens
- **Framer Motion 12.38** — Cinematic animations
- **React Leaflet 5.0** — Interactive maps with geolocation

### Backend Stack
- **Firebase Firestore** — Real-time NoSQL database
- **Firebase Admin SDK 13.9** — Server-side authentication & database access
- **Firebase Cloud Functions** — Scheduled jobs & webhooks
- **Firebase Storage** — Media asset management
- **Firebase Authentication** — OAuth + custom claims

### Development Tools
- **pnpm 9.0** — Package manager (workspace support)
- **Turbo v1.13.4** — Monorepo build orchestration
- **Next.js Turbopack** — 62% faster builds
- **TypeScript Strict Mode** — Maximum type safety
- **Jest 29** — Unit testing framework
- **ESLint 9** — Code quality

---

## Data Model

### SierraProperty (Main Entity)
```typescript
{
  id: string;                          // Firestore doc ID
  sbrCode: string;                     // e.g., "MVD-3F-85K"
  compound: string;                    // e.g., "Mountain View Desert"
  name: string;                        // Display name
  specs: {
    bedrooms: number;
    bathrooms: number;
    squareMeters: number;
    furnished: 'furnished' | 'unfurnished' | 'semi-furnished';
  };
  price: number;                       // In EGP
  pricePerSqm?: number;               // Calculated
  type: 'Rent' | 'Resale' | 'Lease';
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  tags: string[];                      // e.g., ["luxury", "investment"]
  status: 'Available' | 'Sold' | 'Rented' | 'Hidden';
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;      // Custom fields
}
```

### Deal (Closing Workflow)
```typescript
{
  id: string;
  leadId: string;
  propertyCode: string;
  clientName: string;
  propertyTitle: string;
  terms: {
    offerPrice: number;
    earnestMoney: number;
    closingDate: Date;
    contingencies: string[];
  };
  documents: {
    proposalUrl: string;
    offerLetterUrl: string;
    signedContractUrl: string;
  };
  signing: {
    envelopeId: string;                // DocuSign
    status: 'pending' | 'signed' | 'completed';
    lastUpdate: Date;
  };
  payment: {
    stripeIntentId: string;
    amountPaid: number;
    status: 'pending' | 'completed' | 'failed';
  };
  status: 'draft' | 'offered' | 'signing' | 'payment_pending' | 'closed' | 'cancelled';
  orchestration: {
    currentStage: string;              // S9 stage
    nextAction: string;
    metadata: Record<string, any>;
  };
}
```

---

## API Endpoints (22+ Routes)

### Admin Routes
- `POST /api/admin/ingest` — Ingest properties from Google Sheets
- `POST /api/admin/migrate` — Run data migrations
- `GET /api/admin/reports` — Generate business reports
- `POST /api/admin/deploy` — Trigger manual deployments
- `POST /api/admin/media/upload` — Upload media assets

### Property Routes
- `GET /api/listings` — Fetch property listings
- `POST /api/listings/search` — Search properties by criteria
- `GET /api/properties/:id` — Get property details
- `POST /api/properties/:id/update` — Update property info

### Lead & Matching Routes
- `POST /api/leads/create` — Ingest new lead
- `GET /api/matching/score` — Score lead-property match
- `POST /api/matching/recommend` — Get AI recommendations

### Deal Routes
- `POST /api/closer/initiate` — Start deal closing (Stage 9)
- `POST /api/proposals/generate` — Generate proposal PDF
- `POST /api/deals/:id/sign` — Initiate e-signature

### Integration Routes
- `POST /api/whatsapp/webhook` — WhatsApp message handler
- `POST /api/telegram/notify` — Send Telegram notifications
- `GET /api/cron/sync-listings` — Sync properties (scheduled)
- `POST /api/webhooks/docusign` — DocuSign completion callback

---

## Authentication & Authorization

### Security Layers
1. **Edge Middleware** — Validates X-SBR-SECRET-KEY on all /api/* routes
2. **Firebase Auth** — OAuth + custom claims for users
3. **Admin Verification** — verifyAdminRequest() checks custom claims
4. **Firestore Rules** — Document-level read/write permissions
5. **App Check** — Firebase App Check for API protection

### Admin Roles
```typescript
User.customClaims = {
  admin: true,                         // Full system access
  role: 'admin',
  permissions: ['users', 'deals', 'reports', 'settings']
}
```

---

## Four-Agent Workflow

### 1. The Scribe 📝 (Documentation)
- Maintains API specs
- Documents breaking changes
- Generates integration guides

### 2. The Curator 🎨 (Design QA)
- Enforces Tailwind color consistency
- Reviews component hierarchies
- Validates typography standards

### 3. The Matchmaker 🤝 (Intelligence)
- Scores properties against investor profiles
- Answers Leila's 3 Gold Questions:
  - **Intent:** Investment goal
  - **Capital:** Budget & financing
  - **Timeline:** Closure speed
- Generates match reports

### 4. The Closer 💼 (Deal Automation)
- Manages proposal generation
- Tracks contract states
- Initiates e-signature workflows
- Generates revenue reports

---

## Deployment Pipeline

### Development
```
Local branch (claude/nifty-faraday-4Ha8J)
  ↓
npm run dev (Turbopack, hot reload)
  ↓
http://localhost:3000
```

### Staging
```
PR → GitHub Actions (test, build, lint)
  ↓
Vercel Preview Deployment
  ↓
https://sierra-2027-preview.vercel.app
```

### Production
```
Merge to main
  ↓
Vercel Auto-Deploy (firebase: sierra-estates-production)
  ↓
https://sierra-estates.vercel.app
```

### Scheduled Jobs (Cloud Functions)
- **6am UTC** — propertySync (ingest new listings)
- **8pm UTC** — marketAnalysis (price trend analysis)
- **9am UTC** — leadNurture (automated follow-ups)
- **11:59pm UTC** — analyticsExport (revenue reports)

---

## Performance Targets

```
Lighthouse:
  Performance:  90+
  Accessibility: 95+
  Best Practices: 95+
  SEO:          95+

API Latency (p95): <200ms
Uptime SLA: 99.9%
Error Rate: <0.1%
```

---

## Security Checklist

- [x] X-SBR-SECRET-KEY rotation policy (90 days)
- [x] Firestore security rules (read/write permissions)
- [x] Data encryption at rest & in transit
- [x] GDPR compliance (user data handling)
- [x] PII masking on client-side logs
- [x] Rate limiting on API endpoints
- [x] XSS protection (CSP headers)
- [x] CSRF tokens on forms
- [x] Quarterly security audits

---

## Monitoring & Observability

### Metrics
- User adoption (30-day, 50+ agents)
- Conversion rate (15%+ inquiries → visits)
- API latency & error rate
- Lighthouse performance scores

### Logging
- Structured JSON logs (Firestore)
- Real-time error tracking (Sentry compatible)
- Analytics events (GA4)

### Alerts
- API latency > 500ms
- Error rate > 1%
- Uptime drop below 99.5%

---

## Development Workflow

1. **Create feature branch** from main
2. **Make changes** with TypeScript strict mode
3. **Run tests** — `npm run test`
4. **Verify build** — `npm run build`
5. **Create PR** with description
6. **GitHub Actions** — Automated test & build check
7. **Code review** — Team approval
8. **Merge to main** — Auto-deploys to production

---

## References

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS 4](https://tailwindcss.com)
- [React 19](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated:** 2026-05-26  
**Status:** Foundation Complete ✓  
**Next Phase:** Intelligence Engine (Phase 2)
