# Sierra Estates — Session Handoff & Continuation Plan

> **Purpose:** Pick up this work in a fresh chat with zero context loss.
> **Repo:** `ahmedfawzy8866/sierra-2026` · **Date:** 2026-06-06
> **Last merged state of `main`:** commit `dd858a37` — "Two-page architecture: sierra-estates-realty + sierra-estates-admin-portal (#11)"

---

## 1. What this project is

Sierra Estates / Sierra Estates — a luxury real-estate (PropTech) platform for New Cairo.
pnpm + Turborepo monorepo. The **definitive architecture is two decoupled frontends** sharing
one Firebase Firestore backend (zero data redundancy):

| Page | App directory | Role | Stack | Deploy |
|---|---|---|---|---|
| **1 — Customer Hub** | `apps/sierra-estates-realty` | Public, **read-only** luxury showcase | Next.js 16 (App Router) | Vercel |
| **2 — Admin Control Panel** | `apps/sierra-estates-admin-portal` | Private, **full CRUD** command center | Vite + React SPA | Private Vercel route / Firebase Hosting |

Other services: `apps/api` (Python FastAPI — WhatsApp bot, Property Finder sync),
`apps/agents` (whatsapp-scraper JS + stage-9-closer TS), `apps/hermes-webui`,
`services/hermes-agent` (NousResearch Hermes, git submodule),
`functions` (Firebase Cloud Functions), `packages/db` (shared Firestore data layer — single source of truth).

---

## 2. Cause / why these changes were made

The user issued a "Definitive Two-Page Architecture Mandate" requiring the two frontends to be
explicitly named `apps/sierra-estates-realty` and `apps/sierra-estates-admin-portal`, fully wired with
zero duplication, and CI unblocked (`CI=false` to stop warning-as-error cloud compile blocks).
Previously the apps were `apps/web` and `apps/admin`. The decision (confirmed with the user) was
to **rename in place** rather than build fresh apps — lowest risk, preserves the ~26 pages / 38 API
routes / 78 components already present, and avoids duplication.

---

## 3. What is DONE (merged to `main` via PR #11) ✅

- **Renamed** `apps/web` → `apps/sierra-estates-realty`, `apps/admin` → `apps/sierra-estates-admin-portal`
  (git rename, history preserved).
- **Re-wired every active reference:**
  - root `package.json` scripts (`dev:web`, `dev:admin`, `build:web`, `build:admin`, `start`)
  - `firebase.json` hosting targets (`apps/sierra-estates-realty/.next/standalone/public`, `apps/sierra-estates-admin-portal/dist`)
  - `.github/workflows/build.yml` + `ci.yml` (build path, artifact/size paths)
  - **`CI: false`** added to both build steps (per mandate)
  - app package name `sierra-estates-platform` → `sierra-estates-realty` (de-dupes the root package name)
- **`workflows/package-lock.json`** added → unblocks the `unit-adder` external CI job.
- **`services/hermes-agent`** retained as a git submodule.
- **Verified locally:** `pnpm install` relinks · `pnpm type-check` both apps clean ·
  60/60 web tests pass · full Next.js production build passes · admin Vite build emits `dist/`.
- **CI on PR #11:** 8/9 checks green (incl. the real `Analyze (javascript-typescript)` CodeQL scan).
- **PR cleanup:** #8, #9 (competing CI fixes) and #10 (revert to renamed files) closed as superseded.
  PR #12 (auto-created, byte-identical to main) is redundant.

### Package managers
`yarn`, `bun`, `pnpm` are all installed in the environment. Per user decision we use **pnpm only**
(one lockfile — `pnpm-lock.yaml`). Do NOT generate `yarn.lock` / `bun.lockb` (they cause CI drift).

---

## 4. Known blockers / decisions still open ⚠️

1. **`i-sierra-2027` is NOT reachable** from a `sierra-2026`-scoped session. GitHub MCP scope is
   `sierra-2026` only and the repo-add tools are unavailable. To "refine + wire + rename" i-sierra-2027,
   **start a new session scoped to `ahmedfawzy8866/i-sierra-2027`** and re-run the exact flow in §6.
2. **Vercel Root Directory** must be set to `apps/sierra-estates-realty` in the Vercel dashboard
   (cannot be set from `vercel.json`).
3. **PR #7** — Copilot draft that copies 5 repos into a `back/` tree. Deliberately NOT merged: it adds
   vendored copies of whole repos (the opposite of the zero-duplication goal). Decide separately:
   merge, convert to a standalone `back` repo, or close.
4. **CodeQL duplicate** — repo has BOTH GitHub default CodeQL setup AND advanced `codeql.yml`.
   The "CodeQL" check fails in ~3s on every PR (config conflict, not a code bug). User chose to
   **leave it / ignore**. To truly fix: in GitHub → Settings → Code security, disable the *default*
   setup (keep the advanced workflow).

---

## 5. Next tasks (prioritized)

| # | Task | Where | Notes |
|---|---|---|---|
| T1 | Set Vercel Root Directory → `apps/sierra-estates-realty` | Vercel dashboard | Unblocks deploy of Page 1 |
| T2 | Enforce read-only posture on Page 1 | `apps/sierra-estates-realty` | Confirm no write API routes are reachable from the public hub; keep writes in admin/api |
| T3 | Wire admin Intelligence OS pages to live Firestore | `apps/sierra-estates-admin-portal/src/pages/*` | Overview/Agents/Workflows/OpenClaw/Reports currently use mock data; connect via `services/firestore-service.ts` |
| T4 | Connect AI Workflow Monitor to the Python loop | admin OpenClaw/Workflows + `apps/api` | Show raw WhatsApp stream ↔ Gemini JSON payloads side-by-side |
| T5 | Decide PR #7 (`back/` consolidation) | GitHub | Merge / standalone repo / close |
| T6 | Deploy Firestore security rules | `firestore.rules` | Staff-gated reads/writes; pending deploy |
| T7 | i-sierra-2027 parity pass | **new session** | Re-run §6 flow in that repo |
| T8 | (Optional) Resolve CodeQL duplicate | GitHub Settings | Disable default CodeQL setup |

---

## 6. Repeatable flow (use for i-sierra-2027, or any parity pass)

```bash
# 1. Rename the two apps (if still apps/web + apps/admin)
git mv apps/web apps/sierra-estates-realty
git mv apps/admin apps/sierra-estates-admin-portal

# 2. Update references:
#    - root package.json: cd apps/web -> cd apps/sierra-estates-realty (and admin)
#    - firebase.json hosting public paths
#    - .github/workflows/build.yml (cd path) + ci.yml (artifact/size paths)
#    - add `CI: false` to build-step env in build.yml and ci.yml
#    - apps/sierra-estates-realty/package.json "name" -> sierra-estates-realty

# 3. Reinstall + verify (pnpm only)
pnpm install
pnpm type-check                 # both apps must pass tsc --noEmit
( cd apps/sierra-estates-realty && CI=false npm run build )       # full Next build
( cd apps/sierra-estates-admin-portal && CI=false npm run build ) # Vite -> dist/

# 4. Commit on a feature branch, push, open a DRAFT PR into main, merge when green.
#    main is PROTECTED — never push to main directly; merge via PR.
```

---

## 7. Critical facts for any future session

- **Branch protection:** `main` is protected — develop on a feature branch, merge via PR.
- **Designated dev branch (this work):** `claude/focused-goldberg-afXJl` (now identical to main).
- **Firestore is the single backend** — both pages share `packages/db`; no data duplication.
- **Auth:** admin gated by Firebase roles `super_admin/manager/broker/viewer`
  (`apps/sierra-estates-admin-portal/src/context/AuthContext.tsx`).
  Server admin checks via `verifyAdminRequest` in the realty app.
- **AI scoring** lives in `roi-service.ts` / `profiling-service.ts` (rule-based + Gemini reasoning) —
  partially mock; real intelligence fields not yet seeded.
- **Do NOT deploy** without explicit approval. **Never** put secrets in code or chat.
