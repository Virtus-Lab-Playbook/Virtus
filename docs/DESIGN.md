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
5. The master planning PDF
6. Session notes and unapproved proposals

If a lower-ranked source is still useful, update it or mark it superseded instead of
silently carrying two conflicting designs.

## Current Status

Status labels have precise meaning:

- `Implemented`: present in the repository and verified by a command or runtime check.
- `Accepted`: a deliberate design decision not necessarily fully implemented yet.
- `Proposed`: recommended by the planning source but not approved as repository behavior.
- `Open`: requires a decision before the affected feature ships.

### Implemented

- `apps/web`: Next.js application; local dev port `3003`.
- `apps/team`: Next.js team intake and admin review prototype; local dev port `3004`.
- `apps/team /domains`: Operations Engine live-domain management presentation; records are
  currently static and edits are held in browser state until a domain API is added.
- `apps/service`: Next.js Service Engine operations dashboard prototype; local dev port `3005`.
- `apps/asset`: Next.js Asset Engine catalog and licensing dashboard prototype; local dev port `3006`.
- `apps/media`: Next.js Media Engine production dashboard prototype; local dev port `3007`.
- `apps/api`: NestJS application; local dev port `4040`.
- `apps/worker`: TypeScript worker process with Redis startup check.
- `packages/database`: Prisma schema, generated client, and migration baseline.
- `packages/auth`: shared identity and authorization context types.
- `packages/permissions`: permission type and baseline check helper.
- `packages/types`: shared health response types.
- `packages/ui`: initial shared UI package boundary.
- `packages/validation`: Zod environment schema.
- `infrastructure/docker-compose.yml`: Docker deployment for PostgreSQL, Redis,
  the API, all five Next.js apps, and Nginx host-based routing.
- `infrastructure/DEPLOYMENT.md`: deployment and DNS contract for the five live-view
  hostnames; HTTPS certificate provisioning remains an operator step.
- `.github/workflows/ci.yml`: frozen install, formatting, lint, typecheck, test, and build checks.
- API `GET /health`: liveness response.
- API `GET /ready`: configuration readiness response for database and Redis URLs.

The database currently contains only the Phase 0 `SystemMetadata` model. Business
entities, queues, object storage, and production deployment are not implemented yet.
The Operations Engine now has PostgreSQL-backed users, sessions, team applications,
clients, projects, files, approvals, and invoices. The Service, Asset, and Media
Engine records remain static presentation data until their domain APIs are added.

## Runtime Shape

```text
browser
  |
  +--> web :3003
  |
  +--> team :3004
  |
  +--> service :3005
  |
  +--> asset :3006
  |
  +--> media :3007
  |
  +--> api :4040
          |
          +--> PostgreSQL :5432
          +--> Redis :6379

worker --> Redis :6379
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

- Select the production authentication provider and implement the authentication boundary.
- Define business-unit tenancy and the complete permission matrix.
- Define domain module ownership and database aggregates before Phase 1 entities are added.
- Select production object storage, secret management, backup provider, and restore schedule.
- Define API versioning, OpenAPI generation, structured logging, and audit event schema.
- Decide when a queue is required and implement idempotent job handling before automation ships.
