# Virtus OS Design Contract

This is the living design reference for Virtus OS. It records what the repository
actually implements, what has been intentionally accepted, and what remains a
proposal. It must be updated when the structure, runtime contracts, or boundaries
change.

## Authority

Use sources in this order when design documents disagree:

1. Executable code and configuration
2. Accepted ADRs in `docs/decisions/`
3. This document
4. `docs/PLAN.md`
5. `docs/Virtus_Site_Build_Plan_v2.pdf` (site-first execution blueprint, September 2026)
6. The master planning PDF
7. Session notes and unapproved proposals

If a lower-ranked source is still useful, update it or mark it superseded instead of
silently carrying two conflicting designs.

## Current Status

Status labels have precise meaning:

- `Implemented`: present in the repository and verified by a command or runtime check.
- `Accepted`: a deliberate design decision not necessarily fully implemented yet.
- `Proposed`: recommended by the planning source but not approved as repository behavior.
- `Open`: requires a decision before the affected feature ships.

### Implemented

- `apps/web`: Next.js application; local dev port `3003`. Phase 1 design system
  `Implemented`: header/footer shell with mobile nav, `Button`, `SectionHeader`,
  `ServiceCard` (visual header with SVG icon + generative grid, `line-clamp-2`
  copy, bento spans via `className`, hover lift/glow), `ProcessSteps` (gold number
  badges), `Faq`, `CtaSection`, `FormField`, `StatusMessage`, `ProductMockup`
  (CSS-only browser/prompt/board previews with hover lift + radial glow),
  `Entrance` (reduced-motion safe), shared site data, hardened security headers,
  custom 404/error pages. Homepage sections use hero-like depth (radial gold
  glows + 72px grid masks, rounded products container, sticky process visual with
  progress bar, mobile-only hero glow, bento services grid). `/services/[slug]` detail pages (offer, works, process,
  FAQ, inquiry CTA) are `Implemented`; service cards link to them instead of the
  removed select-and-continue inquiry flow. Detail heroes use a generative
  animated backdrop (`framer-motion`, reduced-motion safe); scroll reveals run
  through a global layout observer so every route animates. Homepage hero uses
  `three.js` `HeroCanvas` with static poster fallback, off-screen pausing via
  `IntersectionObserver` + `visibilitychange`, mobile pixel-ratio cap, foreground
  mockup stack, stat pills, and CTAs into the dedicated `/start-project` inquiry
  page (localStorage prototype leads feed the `#admin` demo view); marquee duplicates
  are `aria-hidden` with hover/focus pause. Brand system `Implemented`:
  `VirtusMark` circular V + abstract crown emblem (flat vector, `variant="dark"`
  gold-on-transparent for dark header / `"light"` matte-black `#111111` on cream
  `#F2EFE7` for light surfaces), `Wordmark` in display serif, favicon/OG/manifest
  wired in `apps/web` (`icon.svg`, `favicon-16/32.png`, `apple-touch-icon.png`,
  `virtus-mark.png`, `opengraph.png`, `manifest.webmanifest`); orphan
  `#202923` / `#C76B49` / Arial lockups removed from `apps/web/public`.
- `apps/team`: Next.js team intake and admin review prototype; local dev port `3004`.
- `apps/team /domains`: Operations Engine live-domain management presentation; records are
  currently static and edits are held in browser state until a domain API is added.
- `apps/api`: NestJS application; local dev port `3002` (Docker container listens on `4040`).
- `apps/worker`: TypeScript worker placeholder with Redis startup check; no queue or job handling yet.
- `packages/*`: shared packages (`database`, `auth`, `permissions`, `types`, `ui`,
  `validation`) are `Proposed`; no `packages/` directory exists in the repository yet.
- `infrastructure/docker-compose.yml`: Docker deployment for PostgreSQL, Redis,
  the API, both Next.js apps, and Nginx host-based routing.
- `infrastructure/DEPLOYMENT.md`: deployment and DNS contract for the two live-view
  hostnames; HTTPS certificate provisioning remains an operator step.
- `.github/workflows/ci.yml`: frozen install, formatting, lint, typecheck, test, and build checks.
- API `GET /health`: liveness response.
- API `GET /ready`: configuration readiness response for database and Redis URLs.

The database is PostgreSQL with raw-SQL migrations in `apps/api/sql/`
(`001_operations.sql` creates `users`, `sessions`, `team_applications`,
`clients`, `projects`, `files`, `approvals`, and `invoices`). There is no Prisma
schema and no `packages/database` client; queues, object storage, and production
deployment are not implemented yet.
The Operations Engine now has PostgreSQL-backed users, sessions, team applications,
clients, projects, files, approvals, and invoices.

`apps/service`, `apps/asset`, and `apps/media` were removed on 2026-09-06 to allow
a clean rebuild; Service, Asset, and Media engines are `Proposed` until replacement
apps and domain APIs land. This matches the v2 site-first deferrals (§16): asset
commerce, media production OS, full CRM UI, client portal, and finance stay out of
the initial public-site scope.

### Accepted

- Site-first execution (`docs/Virtus_Site_Build_Plan_v2.pdf`): `apps/web` is the
  first production surface — positioning, services, proof, inquiry, and
  discovery-call conversion — before further Virtus OS depth. The broader OS
  remains the destination but must not block the site launch.
- Deferred until after site launch unless a real requirement appears: full CRM UI,
  client portal, finance module, asset commerce, media production OS, AI
  assistant, advanced automation, and mobile app.
- Lead payload compatibility: the site inquiry form must capture clean,
  CRM-mappable lead data (`name`, `email`, `organization`, `service_interest`,
  `project_description`, `budget_range`, `timeline`, `source`, `created_at`)
  without requiring the full CRM to launch.

## Runtime Shape

```text
browser
  |
  +--> web :3003
  |
  +--> team :3004
  |
  +--> api :3002 (local dev; :4040 inside Docker)
          |
          +--> PostgreSQL :5432
          +--> Redis :6379

worker --> Redis :6379 (startup ping only; no jobs)
```

Local PostgreSQL and Redis are started with `corepack pnpm infra:up`. The root `.env`
is ignored and must be created from `.env.example`; package scripts explicitly load it
where pnpm changes the working directory. `corepack pnpm dev` runs the persistent
workspace tasks through `turbo run dev`; the deprecated `--parallel` flag is not used.

## Boundary Rules

- Keep the system as a modular monolith until independent scaling, reliability, ownership, or technology needs justify extraction.
- A domain module must not directly mutate another domain module's tables; use an application or domain interface.
- PostgreSQL is the system of record. Redis is for queues, cache, and transient infrastructure state.
- Shared packages contain contracts and cross-cutting capabilities, not business logic copied from domain modules.
- Server-side authorization must protect every sensitive operation; UI visibility is not an access boundary.
- Financial and multi-record state changes require transactions; currency must use integer minor units or a safe decimal representation.
- Private files require authorization before short-lived signed URLs are issued.
- AI and automation must invoke defined application operations, pass authorization, support approval for risky actions, and produce audit events.

## Planned Domain Shape

The intended domain order is shared core first, then business engines:

```text
Holding
  +-- Shared Operations: identity, organizations, CRM, projects, files, documents, finance, governance
  +-- Service: clients, contracts, retainers, campaigns, deliverables, approvals
  +-- Asset: products, versions, licenses, orders, downloads, IP
  +-- Media: productions, scripts, scenes, schedules, crew, media assets, distribution
```

This is `Proposed` until corresponding modules and executable contracts exist. The
first vertical slice remains:

```text
authentication -> organization -> user/role -> CRM -> client -> project -> task
-> file -> invoice -> audit log -> executive dashboard
```

The site-first execution order is: site → proof → lead capture → CRM →
onboarding → project delivery → finance → business engines → automation.

## Change Protocol

For every structural change:

1. Read this document, the relevant ADRs, and the executable files being changed.
2. State whether the change is `Implemented`, `Accepted`, `Proposed`, or `Open`.
3. Preserve module ownership and update contracts before adding consumers.
4. Update this document in the same change when paths, ports, dependencies, data ownership, or runtime behavior change.
5. Add or update a focused ADR for an architecture decision and a memory record for durable context.
6. Add verification evidence, including the command or runtime check used.
7. Mark superseded design text rather than leaving contradictory active guidance.

## Accuracy Checklist

Before considering a design change complete, verify:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm format:check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

For infrastructure or runtime changes, also run `corepack pnpm infra:up`, inspect
container health, apply migrations against the local database, and exercise the
affected health endpoint or application workflow.

## Open Decisions

- Lock site-launch inputs per the v2 plan (§19): positioning, 4-offer service
  hierarchy, proof inventory, and sitemap — founder-owned, before homepage build.
- Select the production authentication provider and implement the authentication boundary.
- Define business-unit tenancy and the complete permission matrix.
- Define domain module ownership and database aggregates before Phase 1 entities are added.
- Select production object storage, secret management, backup provider, and restore schedule.
- Define API versioning, OpenAPI generation, structured logging, and audit event schema.
- Decide when a queue is required and implement idempotent job handling before automation ships.
