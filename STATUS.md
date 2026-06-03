# Project Status — Sierra Blu (as of 2026-06-02)

**Last Updated:** 2026-06-02

## 🚀 Shipped in `3df6c79`
- Split-Hero with Virtual Tour
- AI Smart Filter
- CRM Leads API
- Property Finder Sync API
- Careers Page (Framer Motion)
- Design System (`frontend-vercel/app/styles/design.css`)

## ✅ Complete
- **Security**: Firestore/Storage rules deployed with staff-gating via `users/{uid}.role` (admin|manager|agent)
- **API Auth**: 5 high-risk routes locked with `verifyAdminRequest` (viewing-requests, concierge/send-whatsapp, telegram/setup, wealth/roi, admin/ingest)
- **Webhooks**: Conditional secret verification on telegram/webhook, whatsapp/webhook, ingest/whatsapp
- **Dependencies**: Cleaned (removed ffmpeg suite, deprecated react-beautiful-dnd); upgraded key packages
- **Build Gates**: Type-check enforced (`ignoreBuildErrors: false`); ESLint integrated with unused-imports detection
- **Tests**: 47 passing (40 web + 7 functions), functions test infrastructure complete
- **Tooling**: Turbo 2.9.16 migrated to v2 task schema; OpenTelemetry observability wired
- **Config Validation**: CI now validates JSON syntax on vercel.json, tsconfig.json, turbo.json, package.json
- **Rate-Limiting**: 7 public endpoints protected (listings, leads, request-viewing, closer/initiate, concierge, wealth/portfolio, whatsapp/heartbeat)

## 🔄 In Progress / Manual
- **Firebase Rules Deployment**: User must run `firebase deploy --only firestore:rules,storage` with local credentials
- **Environment Secrets**: ~45 vars must be set in Vercel + Firebase Secret Manager (never in chat/git)
  - Vercel: NEXT_PUBLIC_FIREBASE_*, SBR_SECRET_KEY, JWT_SECRET, ENCRYPTION_KEY, third-party API keys
  - Firebase: Firebase admin JSON key + Google Secret Manager for functions

## 📋 Optional / Future
- **Rate-limiting at edge**: Current implementation is in-memory per-instance; consider Upstash Redis for multi-instance consistency
- **Refresh public endpoint schema validation**: Add request/response validation (zod, etc.) to prevent API contract drift
- **Consolidate to Firebase Hosting**: Move web app from Vercel to Firebase Hosting + Functions for unified secrets/deployment
- **Staging environment**: Stand up separate Firebase/Vercel projects for smoke-testing before production

## Pre-Deployment Checklist
- [ ] Firestore rules deployed to production
- [ ] All 45 environment secrets set in Vercel/Firebase
- [ ] Every staff user has `users/{uid}` doc with role in {admin, manager, agent}
- [ ] Staging environment tested (or skip if confidence is high)
- [ ] CI green on main (type-check, lint, tests)
- [ ] vercel.json valid JSON (CI validation confirms)

## Known Gaps / Tech Debt
- Mock services: MockAIService, MockMatchingService (should be replaced with real/stub implementations)
- i18n: next-intl wired but not fully used
- Older docs: Orphaned TODO/STATUS refs in PR descriptions and closed issues (audit when needed)

## Architecture Notes
- **Monorepo**: pnpm + Turborepo; web (Vercel), admin (Vite SPA), functions (Firebase)
- **Auth**: Firebase (client + admin SDKs); custom role model via Firestore docs
- **Data**: Firestore (schema in `packages/db`); Airtable + Google Sheets ingestion (functions)
- **Observability**: OpenTelemetry → Arize; Telegram alerts (high-priority events)
- **Maps**: Leaflet + Mapbox GL (real-estate-specific viewports)
- **i18n**: en/ar via next-intl
