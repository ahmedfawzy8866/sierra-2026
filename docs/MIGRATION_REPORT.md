# Migration Report

## Summary

This branch finalizes the missing low-risk migration pieces that were still absent from `i-sierra-2027` after earlier consolidation work. The repository already contained major donor assets such as the consolidated marketing landing page, archived donor landing snapshots, the Sierra Estatese DSL parser, and the Property Finder integration logic under `apps/web` and `packages/db`.

## What was migrated

### From `ahmedfawzy8866/68e6464b99f91883e5fc1c2c2d41e34852b59d5460a7233cb507631612785c27`

- `sierra-estatese-dsl-parser.ts` → exposed via `packages/agents/src/dsl-parser.ts` by re-exporting the canonical implementation in `packages/db/lib/dsl/parser.ts`
- `sierra-estatese-use-dsl-view.ts` → migrated to `packages/agents/src/hooks/use-dsl-view.ts`
- `sierra-estatese-view-configs.ts` → exposed via `packages/agents/src/view-configs.ts`
- `sierra-estatese-property-finder.ts` → exposed via `packages/agents/src/property-finder.ts`
- `sierra-estatese-pf-hooks-and-routes.ts` → migrated to `packages/agents/src/pf-hooks-routes.ts`
- Handoff and audit docs → copied into `docs/`
- `sierra-estates-mcp.json` → copied to `docs/mcp/sierra-estates-mcp.json`
- `sierra_blue_api_integration.py` → `scripts/python/api-integration.py`
- `sierra_blue_bot_implementation.py` → `scripts/python/bot-implementation.py`
- `system_prompt_and_deployment.py` → `scripts/python/system-prompt-deployment.py`
- `install.sh` → `scripts/install.sh`

### From `ahmedfawzy8866/New-folder`

- `CODEX.md` → `docs/CODEX.md`
- `NEXUS_REGISTRY.md` → `docs/NEXUS_REGISTRY.md`
- `implementation_plan.md` → `docs/implementation_plan.md`

### Existing donor material already present before this change

- `landing-page-final.tsx` and `sierra-estates-landing.jsx` were already preserved in `apps/web/docs/archive/frontend-experiments/`
- `tweaks-panel.jsx` was already preserved in `apps/web/public/assets/tweaks-panel.jsx`
- The Sierra Estatese DSL parser and Property Finder integration already existed under `packages/db/lib/`
- The main marketing landing page was already consolidated into `apps/web/app/page.tsx`

## Workflow changes

- Repaired `.github/workflows/deploy.yml` by replacing the invalid `vercel/action@master` reference with the supported Vercel CLI flow using `pnpm dlx vercel@latest`

## What was skipped and why

- `.log`, `.txt`, build-output, and transient report files were intentionally skipped
- Session-state agent folders were not copied wholesale because they are not durable repository assets
- `ahmedfawzy8866/28-5-Si` could not be fetched through the available GitHub API during this session, so no files were migrated from it here
- Large app/backend trees from donor repos were not re-copied where equivalent or richer implementations already existed in `apps/web`, `packages/db`, or the archived donor snapshots

## Issues found and resolutions

- The latest failed GitHub Actions run was a deploy failure caused by `vercel/action` not resolving; this was fixed in the workflow
- `packages/agents` declared `src/index.ts` as its entry point but did not contain a `src/` tree; this migration restores that package surface

## Post-migration checklist

- `pnpm install`
- `pnpm build`
- `pnpm type-check`
- `pnpm test:ci`
