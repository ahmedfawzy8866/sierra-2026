# TODO — Sierra Blu Feature & Fix Backlog

Aligned with STATUS.md. Sorted by deployment-readiness (pre-deploy → post-deploy).

## 🚨 Pre-Deployment (blocking)
- [ ] **Deploy Firestore rules** to production: `firebase deploy --only firestore:rules,storage` (requires local Firebase credentials; user action)
- [ ] **Set environment secrets** in Vercel + Google Secret Manager (never in chat/git)
  - [ ] NEXT_PUBLIC_FIREBASE_* (public; safe to commit)
  - [ ] SBR_SECRET_KEY (rotate from current value)
  - [ ] JWT_SECRET, ENCRYPTION_KEY (rotate if ever shared)
  - [ ] Firebase admin JSON key (keep in Secret Manager, never in code)
  - [ ] Third-party API keys: Google Sheets, Airtable, Telegram, WhatsApp, etc.
- [ ] **Verify staff users exist** in Firestore: every staff member needs `users/{uid}` doc with role ∈ {admin, manager, agent}
- [ ] **Smoke-test on staging** (or skip if confidence is high)
- [ ] **CI green**: type-check, lint (including config validation), tests all pass

## 📦 Post-Deployment (operational)
- [ ] **Monitor**: Set up alerts in OpenTelemetry/Arize for error rates, latency, custom metrics
- [ ] **Rate-limit tuning**: Monitor public endpoints for false-positives; adjust windowMs/maxRequests if needed
- [ ] **Log retention**: Set Firestore/Storage backup cadence; archive old logs
- [ ] **Rotate credentials**: Quarterly rotation of SBR_SECRET_KEY, JWT_SECRET, Firebase admin key

## 💡 Enhancement Candidates (safe, high-value, not blocking)
- [ ] **Edge rate-limiting**: Move from in-memory to Upstash Redis for multi-instance consistency
- [ ] **Request/response validation**: Add zod schemas to public endpoints (leads, listings, concierge) to prevent API contract drift
- [ ] **Refresh stale docs**: Audit issue/PR descriptions for outdated TODO/STATUS refs
- [ ] **Real AI service**: Replace MockAIService with actual implementation (or switch to LLM vendor)
- [ ] **Consolidate secrets**: Move web app from Vercel to Firebase Hosting + Functions for unified secrets/deployment (lower priority)

## 🐛 Known Issues (low-priority)
- Mock services: MockAIService, MockMatchingService (should be replaced when real service is ready)
- i18n: next-intl wired but underutilized in some flows
- Test coverage: 47 tests passing, but overall coverage ~45%; expand for critical paths

## 📚 Documentation
- [ ] Update CLAUDE.md if stack/conventions change
- [ ] Keep STATUS.md + TODO.md in sync with actual state
- [ ] Archive closed issues/PRs if their TODO/STATUS refs become confusing

## 🐍 Python
- [ ] Schedule analytics-report.py via GitHub Actions cron
- [ ] Add unit tests for LeadScorer class
- [ ] Connect lead-scorer.py to live Firestore in production
- [ ] WhatsApp template message approval workflow

## 🎨 Frontend
- [ ] Wire LeadScoreBadge into CRM dashboard
- [ ] Add StatsCard to admin analytics page
- [ ] Mobile responsive pass for PremiumHero
