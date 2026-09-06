---
id: session-2026-09-06-service-visual-refresh
type: session
title: Visual animated service detail pages plus global reveal fix
status: active
created: 2026-09-06
updated: 2026-09-06
source: user request "why its using api make it visual less text and animated use tools or library"
confidence: confirmed
supersedes: null
---

## Context

The `/services/[slug]` pages read as flat text. Verified the pages make zero
API calls (no `fetch` in `apps/web/src`) — they are fully static. The real
defect: `.reveal` sections stayed invisible off the homepage because the
scroll observer only ran there.

## Record

- `components/reveal-manager.tsx` (new, mounted in `app/layout.tsx`):
  IntersectionObserver plus MutationObserver so every route animates; removed
  the homepage-local observer.
- Added `framer-motion` to `apps/web` (`pnpm-lock.yaml` updated).
- `components/entrance.tsx` (new): staggered hero rise-in, instant under
  reduced motion.
- `components/service-visual.tsx` (new): generative animated hero backdrop —
  drifting gold blobs, slow orbit arc, faint grid mask; deterministic palette
  per service, static under reduced motion.
- `app/services/[slug]/page.tsx`: visual-first hero (ghost index numeral,
  giant title, one-line offer, chips, CTAs) plus deliverables marquee; dropped
  the side info panel and repeated description so the page carries less text.

## Evidence

- `corepack pnpm lint`, `typecheck` (4/4), `test` (4/4; web 12/12), `build`
  (4/4; all 6 `/services/*` routes prerendered) pass.

## Related

- `docs/memory/sessions/2026-09-06-service-detail-pages.md`
- `docs/DESIGN.md`

## Next Action

Refresh the browser at `/services/web-development`; confirm reduced-motion
still renders a complete static page.
