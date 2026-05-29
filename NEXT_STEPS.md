# NEXT_STEPS — Sierra Blu (pre-deploy)

Snapshot as of 2026-05-29. Trim items as they are completed.

## URGENT — deploy security rules
Production Firestore currently allows `read, write: if request.auth != null` (ANY signed-in account can read/write ALL data). PR #10 replaces this with staff-gated rules.
1. Merge PR #10.
2. Verify every staff user has a `users/{uid}` doc with role admin|manager|agent.
3. Deploy: `firebase deploy --only firestore:rules,storage`
4. Rollback = redeploy the previous rules file.

## API auth hardening (audit done; implement next)
Helper: `import { verifyAdminRequest, unauthorizedResponse } from '@/lib/server/auth-guard'` (pattern in `app/api/proposals/route.ts`).
- LOCK with admin (no client callers, safe): `viewing-requests`, `concierge/send-whatsapp`, `telegram/setup`, `wealth/roi`.
- `admin/ingest`: use `verifyRequest` (accepts SBR secret OR Firebase token); its comment wrongly assumes middleware covers it (middleware = only `/api/orchestrate`).
- `agent/hub`: called by `components/UI/SierraTerminal.tsx` — check if that surface is admin-only; lock if yes, else add rate-limiting.
- Webhooks `telegram/webhook`, `whatsapp/webhook`, `ingest/whatsapp`: add CONDITIONAL secret verification (verify only if the secret env is set → non-breaking). Consider consolidating with `/api/webhooks/whatsapp` (already verifies a signature).
- KEEP PUBLIC (add rate-limiting): `listings`, `leads`, `leads/request-viewing`, `closer/initiate`, `concierge/[leadId]`, `wealth/portfolio`, `whatsapp/heartbeat`.

## Pre-deploy gates (all must pass before production)
1. Rules deployed (above).
2. API auth closed (above).
3. Secrets set (see "Secrets placement" below). Rotate SBR_SECRET_KEY, JWT_SECRET, ENCRYPTION_KEY, and the Firebase admin key if ever shared.

## Secrets placement (owner leans toward Firebase)
Secrets must live where the code that reads them runs:
- **Next.js web app** — currently deploys to **Vercel** (vercel.json, deploy.yml), so its server secrets must be **Vercel env vars** (encrypted). They can't be read "from Firebase" while hosted on Vercel.
- **Firebase Cloud Functions** (`functions/`) — use **Firebase Functions secrets / Google Secret Manager** (`firebase functions:secrets:set`), never committed.
- **To consolidate ALL secrets on Firebase** (owner's preference): also host the web app on **Firebase Hosting + Functions** (firebase.json already has web/admin targets) instead of Vercel, then everything uses **Google Secret Manager**. Tradeoff: Vercel is the stronger Next.js host; all-Firebase = one-platform simplicity. Decide host first, then place secrets accordingly.
- `NEXT_PUBLIC_*` vars are **not** secret (they ship in the client bundle). Only the non-prefixed ones (Firebase admin key, SBR_SECRET_KEY, JWT_SECRET, ENCRYPTION_KEY, third-party API keys) are real secrets.

## Recommendations
- Consolidate the project into THIS monorepo (scattered repos cause lost work).
- Enable branch protection on `main` (require PRs; block force-push and deletion).
- Stand up a staging Firebase/Vercel project; smoke-test before prod.
- Replace mock services (MockAIService, etc.); raise test coverage.

## Done (on main or in open PRs)
- main: real type-check CI gate, functions tests, lint 256 to 0, turbo 2.9.16 (CVEs fixed), recovered concierge backend, dependency cleanup.
- PR #10 (open draft): Firestore/Storage rules + vercel cron path fixes + `ignoreBuildErrors: false`.
