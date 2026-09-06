---
id: session-2026-09-06-start-project-page
type: session
title: Dedicated start-project inquiry page replaces homepage modal
status: active
created: 2026-09-06
updated: 2026-09-06
source: user request "replace the homepage inquiry modal with a dedicated inquiry page, and improve the client form"
confidence: confirmed
supersedes: null
---

## Context

The homepage carried a focus-trapped inquiry modal opened via local state, the
`virtus:open-inquiry` custom event, and `?inquiry=1` deep links. The user wants
a dedicated inquiry page with an improved client form instead.

## Record

- `app/start-project/page.tsx` (new, statically prerendered): metadata plus a
  `<Suspense>` boundary around the client form (`useSearchParams` requires it).
- `app/start-project/inquiry-form.tsx` (new client component): reuses
  `SectionHeader`, `FormField`, `Button`, `StatusMessage`; removable service
  chips, required Name / Email / brief, optional Company, Budget select
  (`Not sure yet / Starter / Growth / Custom / Enterprise`), required consent
  checkbox, native validation, and a success `StatusMessage` listing submitted
  service names. Same `Lead` shape and `virtusLabsDemoLeads` key, so the
  homepage `#admin` demo view keeps working.
- `data/site.ts`: new pure `parseServicesQuery(value)` (split on comma,
  normalize, dedupe, drop unknowns); `INQUIRY_EVENT` / `requestInquiry`
  deleted with no listeners left.
- `app/page.tsx`: modal markup, modal state/effects, `submitInquiry`, and
  `openInquiry` removed; About CTA navigates to `/start-project` carrying
  `?services=` when a selection is known; `?services=` still hydrates chip
  state via `parseServicesQuery`; legacy `?inquiry=1` links redirect to
  `/start-project` preserving the services param.
- `components/site-header.tsx`: no longer pathname-branches on an event —
  links to `/start-project`, carrying `?services=` when on a service detail
  page; the form also falls back to persisted `virtusLabsSelectedServices`.
- `app/services/[slug]/page.tsx`: CTAs now point to
  `/start-project?services=<slug>`.
- `app/globals.css`: dead `.modal-backdrop` / `.modal-panel` rules removed.

## Evidence

- `corepack pnpm --filter @virtus/web lint`, `typecheck`, `test` (16/16),
  `build` (9/9 routes incl. `/start-project`) pass; repo-wide `lint` and
  `typecheck` (4/4) pass.

## Related

- `docs/memory/sessions/2026-09-06-service-detail-pages.md`
- `docs/memory/sessions/2026-09-06-site-phase-1.md`
- `docs/DESIGN.md`

## Next Action

Wire the form to a real lead API with authenticated admin tooling when the
CRM slice lands; the localStorage inbox stays an honest prototype until then.
