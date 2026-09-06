---
id: decision-0002
type: decision
title: Site-first execution with the public website as first production surface
status: active
created: 2026-09-06
updated: 2026-09-06
source: docs/Virtus_Site_Build_Plan_v2.pdf
confidence: confirmed
supersedes: null
---

## Context

`docs/Virtus_Site_Build_Plan_v2.pdf` (Version 2.0, September 2026) narrows the
first build to one outcome: a credible public website that attracts, explains,
qualifies, and converts. The broader Virtus OS remains the destination but must
not block the site launch.

## Record

Build now in `apps/web`: brand system, service pages (Web, Creative/Graphics,
Video/Media, Automation), portfolio/case studies, inquiry flow, discovery-call
booking, content system, analytics, SEO, legal pages. Connect later: CRM, client
onboarding, task queueing, payments, project delivery, finance, asset/media
engines, AI automation.

First milestone (A): a visitor can land on Virtus, understand the offer, view
credible work, submit a project inquiry, and book a discovery call. The site
inquiry form captures CRM-mappable lead data without requiring the full CRM.

## Consequences

- `apps/service`, `apps/asset`, and `apps/media` stay removed; their engines
  remain `Proposed` until post-launch demand justifies them.
- No PostgreSQL, Redis, BullMQ, object storage, or full auth is added merely to
  make the marketing site work; existing Operations Engine infrastructure stays
  as the future operating layer, not a site dependency.
- Site pages follow the v2 production checklist (brief → content → structure →
  design system → build → data → SEO → accessibility → performance → QA →
  analytics → approval).

## Evidence

- `docs/Virtus_Site_Build_Plan_v2.pdf`, §§01, 12–13, 16, 18–20.
- `docs/DESIGN.md` Accepted section and `docs/PLAN.md` Site-First section
  record this direction.

## Related

- `docs/decisions/0001-phase-0-foundation.md`
- `docs/PLAN.md`
- `docs/DESIGN.md`
- `docs/memory/sessions/2026-09-06-remove-engines.md`

## Next Action

Founder-owned inputs before homepage build: positioning, 4-offer service
hierarchy, proof inventory, sitemap (§19 actions 01–04).
