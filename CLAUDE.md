# CLAUDE.md — Sierra Estates (ahmedfawzy8866/sierra-2026)

Context for Claude Code / AI sessions. Keep this updated as the project evolves.

## What this is
**Sierra Estates** — luxury real-estate (PropTech) platform for the New Cairo market.
This is the **canonical master repository**. All development happens here.
pnpm + Turborepo monorepo.

## Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 (strict) · Tailwind 4 · Firebase (client SDK 12 + Admin SDK 13: Firestore, Storage, Auth) · Leaflet maps · next-intl (en/ar) · **Docker n8n Workflow Engine** (`localhost:5678`). Deploy: Vercel (web) + Firebase (Hosting + Cloud Functions). Observability: OpenTelemetry + Arize.

## Layout
- `apps/sierra-blu-realty` — PAGE 1: public **customer hub** (luxury showcase, property listings, maps, AI concierge, virtual tours). Next.js App Router. Deploys to Vercel.
- `apps/sierra-blu-admin-portal` — PAGE 2: private **master admin control panel** (full CRUD + CRM + AI workflow monitor + agents + analytics). Vite + React SPA.
- `apps/api` — Python FastAPI backend services.
- `apps/agents` — AI agents: `stage-9-closer` (sales closer with proposal generator), `whatsapp-scraper`.
- `apps/hermes-webui` — Hermes AI chat interface.
- `functions/` — Firebase Cloud Functions (collectData, processDataForApp, + transform module).
- `packages/db` — shared Firestore data layer.
- `packages/agents` — shared agent interfaces.
- `packages/agents-core` — core agent execution engine (merged from i-sierra-2027).
- `packages/obedian` — Obsidian-style memory store (merged from i-sierra-2027).
- `packages/open-memory` — OpenMemory integration.
- `packages/ui` — shared UI components + design system (navy #0A1F44 / gold #D4AF37 tokens).
- `packages/{api,auth,batch,config}` — shared utilities.
- `workflows/` — n8n automation workflows (01–05).
- `docs/obsidian-vault/` — AI agent memory and architecture notes.

## Commands (from repo root)
- `pnpm install`
- `pnpm dev` / `pnpm build` / `pnpm lint` / `pnpm type-check` / `pnpm test:ci`
- Tests: 47+ passing. `type-check` is a real CI gate (`tsc --noEmit`).

## Design System
- **Brand:** "Quiet Luxury" — navy (#0A1F44) + gold (#D4AF37)
- **Tokens:** `packages/ui/design-system/design-tokens.scss`
- **Components:** `LuxurySkeleton`, `PremiumHero` in `packages/ui/design-system/`
- **RTL:** Full Arabic/English bilingual support via next-intl

## Conventions
- ESLint flat config with `eslint-plugin-unused-imports`; unused vars/args must be `_`-prefixed.
- Privileged server work uses the **Admin SDK** (`@/lib/server/firebase-admin`) which BYPASSES Firestore rules. Client uses `@/lib/firebase`.

## Auth model
- Client role: read from Firestore `users/{uid}.role` in {admin, manager, agent}.
- Server admin check: `verifyAdminRequest` — Firebase Bearer token with `admin===true || role==='admin'` custom claim. `verifyRequest` also accepts `X-SBR-SECRET-KEY` header for service/cron calls.
- Edge middleware matches ONLY `/api/orchestrate`.
- Firestore/Storage rules are staff-gated via `users/{uid}.role`.

## Obsidian Memory Engine
- **Vault:** `docs/obsidian-vault/` — cognitive and database architecture notes.
- **Rule:** For every task, read the relevant vault node first (e.g. `Sourcing Pipeline & Lead Aggregator.md`, `WhatsApp CRM & Hand-off Pipeline.md`).
- **Graph Alignment:** Maintain `[[Links]]` when editing vault files.

## Branch Policy
- **Main branch is protected.** Never force-push or commit directly to `main`.
- All changes: create feature branch → push → open PR.
- Development branch: `claude/optimistic-hypatia-ymhdO`
