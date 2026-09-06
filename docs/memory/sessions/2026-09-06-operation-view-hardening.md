---
id: session-2026-09-06-operation-view-hardening
type: session
title: Operation-view (3004) app hardening
status: active
created: 2026-09-06
updated: 2026-09-06
source: user request "make the 3004 production ready"
confidence: confirmed
supersedes: null
---

## Context

The team app (`apps/team`, operation-view :3004) was functionally complete against
the Operations API but not production ready: no auth redirect, admin-only actions
unguarded in UI, a PATCH-per-keystroke admin note field, stale prototype copy, no
security headers, no error/404 pages, and zero tests.

## Record

Scope chosen by the user: app hardening only. The Domains view keeps its
browser-local editing as a planning scratchpad; no domains backend was built and no
deployment/HTTPS changes were made.

Changes in `apps/team`:

- `src/app/api.ts`: `ApiError` with status, 15s timeout with abort, network vs
  timeout errors, rejection on empty responses.
- `src/app/operations-dashboard.tsx`: 401 redirects to `/login`, mounted-guard on
  async state, approve/decline disabled for non-admins with a read-only notice,
  engine links from `NEXT_PUBLIC_SERVICE/ASSET/MEDIA_URL` with localhost fallback.
- `src/app/operations-helpers.ts` (new): extracted `money`, `dateLabel`,
  `filterOperationsData` plus shared operation types.
- `src/app/operations-helpers.test.ts` (new): 5 passing `node:test` assertions.
- `src/app/admin-queue.tsx`: debounced (600ms) admin-note saves, loading state,
  admin access-denied panel, corrected PostgreSQL-backed footnote.
- `src/app/layout.tsx`: Operations Engine metadata plus viewport.
- `next.config.ts`: `poweredByHeader: false`, compression, security headers.
- `src/app/error.tsx`, `src/app/not-found.tsx` (new): error boundary and 404 page.
- `ops.css`, `globals.css`: styles for decline button, notices, denied/loading states.
- `tsconfig.json`: `allowImportingTsExtensions` so the `.test.ts` file resolves
  under native `node --test` type stripping.

## Evidence

- `corepack pnpm --filter @virtus/team lint|typecheck|test|build`: all pass.
- Repo `pnpm lint` passes; `pnpm format:check` fails only on pre-existing
  `pnpm-lock.yaml` drift (untouched by this change).
- Live dev server (:3004): security headers present, custom 404 renders, updated
  title served. API (:4040): unauthenticated overview returns 401, member approval
  PATCH and application list return 403, matching the new client behavior.

## Related

- `docs/DESIGN.md` unchanged: no paths, ports, or module boundaries changed; the
  Domains view remains browser-local as already documented.

## Next Action

Remaining production work is outside this scope: domains backend API, `WEB_ORIGINS`
for production hosts, and HTTPS/DNS cutover per `infrastructure/DEPLOYMENT.md`.
