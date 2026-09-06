---
id: session-2026-09-06-remove-engines
type: session
title: Remove service, asset, and media apps for clean rebuild
status: active
created: 2026-09-06
updated: 2026-09-06
source: user request "lets rebuild again remove everything in app/ media asset service"
confidence: confirmed
supersedes: null
---

## Context

The user asked to remove everything in `apps/service`, `apps/asset`, and
`apps/media` and rebuild later. Scope confirmed as "Delete entire apps" with
"Leave empty" (no replacement code).

## Record

Deleted from the filesystem:

- `apps/service/` (dashboard prototype, `:3005`)
- `apps/asset/` (services portfolio, `:3006`)
- `apps/media/` (production dashboard, `:3007`)

Cleaned references so the remaining workspace stays coherent:

- `infrastructure/docker-compose.yml`: removed `service-view`, `asset-view`,
  `media-view` services and their Nginx dependencies.
- `infrastructure/nginx/nginx.conf.template`: removed the three upstreams and
  server blocks.
- `infrastructure/DEPLOYMENT.md`: now documents two apps and two hostnames.
- `README.md`: web `:3003` and team `:3004` only.
- `docs/DESIGN.md`: removed the three apps from Implemented; Service, Asset,
  and Media engines are `Proposed` until replacements land.
- `.env.example`: dropped `SERVICE_PORT`.
- `pnpm-lock.yaml`: pruned the three importers.
- `apps/team/src/app/operations-dashboard.tsx`: added the missing
  `ShieldCheck` and `CircleDashed` imports so typecheck passes.

Left intentionally stale for the rebuild: `apps/team` still links to
`localhost:3005/3006/3007` and carries domain records for the deleted views.

## Evidence

- `corepack pnpm install --frozen-lockfile`: pass (5 workspace projects).
- `corepack pnpm lint`: pass.
- `corepack pnpm typecheck`: pass (4/4).
- `corepack pnpm test`: pass (4/4).
- `corepack pnpm build`: pass (4/4).
- `corepack pnpm format:check`: fails only on pre-existing
  `apps/web/src/app/page.tsx` and `pnpm-lock.yaml` drift.

## Related

- `docs/DESIGN.md`
- `docs/memory/sessions/2026-09-06-operation-view-hardening.md` (prior session;
  its `API (:4040)` note is superseded by the local-dev port `:3002` in
  `apps/api/src/main.ts` and `.env.example`)

## Next Action

Rebuild the three engines when scoped; first remove or repoint the stale
`apps/team` engine links and domain records.
