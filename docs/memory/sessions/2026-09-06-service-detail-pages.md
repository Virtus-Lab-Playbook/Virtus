---
id: session-2026-09-06-service-detail-pages
type: session
title: Service detail pages replace select-and-continue flow
status: active
created: 2026-09-06
updated: 2026-09-06
source: user request "change this make this redirect to dedicated page and see the works there"
confidence: confirmed
supersedes: null
---

## Context

Homepage service cards selected services into a sticky Continue bar that opened
the inquiry modal. The user wants each card to redirect to a dedicated page
showing the works for that service instead.

## Record

- `app/services/[slug]/page.tsx` (new, statically prerendered for all 6
  services): breadcrumb, offer hero, included-deliverables panel, `#work`
  section, process, FAQ, inquiry CTA. Unknown slugs 404.
- `data/works.ts` (new): `Work` schema plus `worksForService`; empty until
  real case studies are approved — the v2 plan forbids inventing results, so
  pages render an honest forthcoming panel plus CTA while empty.
- `data/site.ts`: `serviceFaq`; nav/footer hrefs made absolute (`/#…`) so they
  resolve from detail pages.
- `components/service-card.tsx`: now a server link card to
  `/services/[slug]`; selection toggle removed.
- `components/site-header.tsx`: pathname-aware — dispatches the inquiry event
  on `/`, links to `/?inquiry=1` elsewhere; logo points to `/`.
- `app/page.tsx`: sticky Continue bar and `clearSelection` removed; modal keeps
  chip removal; `?inquiry=1` now opens the modal with or without
  `?services=` so cross-page CTAs land in the inquiry.

## Evidence

- `corepack pnpm lint`, `typecheck` (4/4), `test` (4/4; web 12/12), `build`
  (4/4; all 6 `/services/*` routes prerendered) pass.

## Related

- `docs/Virtus_Site_Build_Plan_v2.pdf`, §§04–06.
- `docs/memory/sessions/2026-09-06-site-phase-1.md`
- `docs/DESIGN.md`

## Next Action

Add real entries to `data/works.ts` once case studies are approved; continue
V2 Phase 2 (Services overview, Work/Portfolio, About, Contact, Discovery Call).
