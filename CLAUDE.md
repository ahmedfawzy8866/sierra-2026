# CLAUDE.md — Sierra Blu (i-sierra-2027)

Context for Claude Code / AI sessions. Keep this updated as the project evolves.

## What this is
Sierra Blu / Sierra Estates — a luxury real-estate (PropTech) platform for the New Cairo market. pnpm + Turborepo monorepo.

## Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5 (strict) · Tailwind 4 · Firebase (client SDK 12 + Admin SDK 13: Firestore, Storage, Auth) · Leaflet maps · next-intl (en/ar) · **Docker n8n Workflow Engine** (`localhost:5678`). Deploy: Vercel (web) + Firebase (Hosting + Cloud Functions). Observability: OpenTelemetry + Arize.

## Layout
- `apps/web` — main Next.js app and the real codebase (~26 pages, 38 API routes, ~78 components, ~39 services).
- `apps/admin` — separate Vite + React admin SPA.
- `functions` — Firebase Cloud Functions (ingestion pipeline: collectData, processDataForApp, + pure transform module).
- `packages/db` — shared Firestore data layer (substantial). `packages/agents` is small. `packages/{api,auth,batch,config,ui}` are empty stubs.

## Commands (from repo root)
- `pnpm install`
- `pnpm dev` / `pnpm build` / `pnpm lint` / `pnpm type-check` / `pnpm test:ci`
- Tests: 47 passing (40 web + 7 functions). `type-check` is a real CI gate (`tsc --noEmit`). `apps/web/next.config.ts` has `ignoreBuildErrors: false`.

## Conventions
- ESLint flat config (`apps/web/eslint.config.mjs`) with `eslint-plugin-unused-imports`; unused vars/args/caught-errors must be `_`-prefixed.
- `apps/web/tsconfig.json` excludes `agents/**` and `public/**` from type-check.
- Privileged server work uses the **Admin SDK** (`@/lib/server/firebase-admin`) which BYPASSES Firestore rules. Client uses `@/lib/firebase`.

## Auth model (important)
- Client role: read from Firestore `users/{uid}.role` in {admin, manager, agent} (see `lib/AuthContext.tsx`).
- Server admin check: `verifyAdminRequest` (`lib/server/auth-guard.ts`) — Firebase Bearer token with `admin===true || role==='admin'` custom claim. `verifyRequest` also accepts the `X-SBR-SECRET-KEY` header for service/cron calls.
- Edge middleware (`apps/web/middleware.ts`) matches ONLY `/api/orchestrate` — it is NOT broad protection.
- Firestore/Storage security rules are staff-gated via `users/{uid}.role` (see `firestore.rules`) — pending deploy (see NEXT_STEPS.md).

## Reality check
Pre-production. Some services are mock/scaffolded (`MockAIService`, unwired i18n). Test coverage is thin. Older `STATUS.md`/`TODO.md` are aspirational/stale.

## Obsidian Memory Engine & AI Sourcing
- **Vault Location:** `docs/obsidian-vault/` contains the core cognitive and database architecture notes.
- **Rules of Engagement:** For every new task, feature, or bugfix, the AI agent MUST search and read the relevant node in the Obsidian vault (e.g. `Sourcing Pipeline & Lead Aggregator.md`, `WhatsApp CRM & Hand-off Pipeline.md`).
- **Graph Alignment:** Maintain double-bracket `[[Links]]` when editing vault files to preserve the Obsidian graph view.

## Constraints & Pull Request Policy
- **Repo Scope:** GitHub access is scoped to `ahmedfawzy8866/i-sierra-2027` only — do not touch other repos.
- **Branch Protection Active:** The `main` branch is protected on GitHub. Direct commits are blocked. Never force-push or delete `main`.
- **Workflow:** For all changes, checkout a new branch (e.g. `feature/name`), push it to remote, and open a Pull Request using `gh pr create`.
- **Do Not Deploy** without explicit approval. Never place API keys or credentials in raw code or in chat.
