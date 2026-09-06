# Virtus OS Implementation Plan

Source: `Virtus_OS_Master_Planning_Document (1).pdf`, version 1.0, September 2026.

## Outcome

Build one shared operating system for Virtus Holding, with modular Service, Asset,
Media, and Shared Operations engines. The first usable target is:

`authentication -> organization -> users/roles -> CRM -> client -> project -> task -> file -> invoice -> audit log -> executive dashboard`

## Site-First Execution (v2)

`docs/Virtus_Site_Build_Plan_v2.pdf` (Version 2.0, September 2026) narrows the
first build to one outcome: a credible public website that attracts, explains,
qualifies, and converts. Core decision: do not build the entire operating system
before the site can sell the business. The website becomes the first production
surface and the front door to CRM, lead generation, onboarding, projects, and
eventually the shared Virtus OS.

Build now: public website, brand system, service pages, portfolio/case studies,
inquiry flow, discovery-call booking, content system, analytics, SEO, legal pages.
Connect later: CRM, client onboarding, task queueing, payments, project delivery,
finance, asset/media engines, AI automation.

First milestone (A): a visitor can land on Virtus, understand the offer, view
credible work, submit a project inquiry, and book a discovery call. Once this
works, expand the site — not before. The Phase 1–8 sequence below remains the
operating-system destination; the site is built first and connected to it as the
acquisition front end.

## Constraints

- Start as a modular monolith; do not split domains into services without evidence.
- Keep business-engine boundaries explicit. Cross-module access goes through application/domain interfaces, not another module's tables.
- Use shared organizations, contacts, projects, files, documents, finance, and permissions across all engines.
- Enforce authorization server-side, including business-unit and resource scope.
- Treat AI as a controlled action layer, never as the system of record or an arbitrary SQL client.
- Keep secrets out of the repository; private files require authorization followed by short-lived signed URLs.
- Use migrations for every schema change, transactions for financial or multi-record changes, and safe integer/decimal currency values.

## Target Architecture

The evidence-backed current design is maintained in `docs/DESIGN.md`; update it with
structural changes rather than allowing this plan to become an implementation map.

Recommended stack from the source document:

- Web: Next.js and TypeScript
- API: NestJS and TypeScript
- Data: PostgreSQL with Prisma
- Jobs: Redis and BullMQ, with a worker application
- Storage: private S3-compatible storage such as Cloudflare R2
- UI: Tailwind CSS and shadcn/ui
- Shared tooling: pnpm and Turborepo
- Operations: Docker Compose, GitHub Actions, Pino, Sentry, and OpenAPI/Swagger

Recommended package boundaries:

```text
apps/web
apps/api
apps/worker
packages/ui
packages/database
packages/auth
packages/types
packages/validation
packages/permissions
infrastructure
docs
```

These were recommendations before implementation. Phase 0 now provides the initial
workspace, package boundaries, environment template, Compose services, migration
baseline, health endpoints, and CI verification commands. Future code and configuration
are authoritative where they intentionally narrow these recommendations.

## Delivery Sequence

### Phase 0: Foundation

- Create the monorepo and record conventions in an ADR.
- Establish local, staging, and production environment separation.
- Add Docker Compose for the initial PostgreSQL, Redis, and application dependencies.
- Define the database, migration, authentication, permission, logging, and CI approach.
- Add health checks, secret handling, backups, and restore testing to the deployment design.

### Phase 1: Virtus Core

- Implement authentication, users, organizations, business units, memberships, roles, and permissions.
- Add shared CRM objects: organizations, contacts, leads, opportunities, clients, and activities.
- Add private file metadata, access grants, and controlled attachments.
- Add audit logs for authentication, permission changes, file access, and destructive actions.

### Phase 2: Shared Operations

- Implement projects, milestones, tasks, comments, dependencies, assignments, and availability.
- Add documents, versions, templates, calendar events, reminders, and notifications.
- Build role-aware navigation and reusable tables, filters, forms, status badges, timelines, and approval panels.

### Phase 3: Basic Finance

- Implement accounts, invoices, invoice items, expenses, payments, budgets, and transactions.
- Support the operational workflows `contract -> invoice -> payment -> transaction` and `order -> payment -> fulfillment`.
- Make payment recording idempotent and audit invoice approvals and financial changes.
- Treat this as operational finance, not statutory accounting.

### Phase 4: Service Engine

- Add services, packages, contracts, retainers, campaigns, deliverables, approvals, reports, and the client portal.
- Deliver one complete agency workflow before expanding screen coverage.

### Phase 5: Asset Engine

- Add products, versions, licenses, orders, downloads, IP ownership, and product analytics.
- Ensure published products expose only authorized downloadable files.

### Phase 6: Media Engine

- Add productions, development assets, pre-production, scenes, shots, schedules, cast, crew, post-production, and distribution.
- Scope crew access by role without exposing unrelated finance or business data.

### Phase 7: Automation

- Add triggers, rules, actions, workflow runs, approvals, retries, and integrations.
- Expose controlled application commands rather than direct data access.

### Phase 8: Intelligence

- Add an assistant for summaries, recommendations, and domain-specific drafting.
- Route every AI action through tool selection, permission checks, optional approval, an application command, and an audit log.

## Quality Gates

- Unit tests cover domain rules, calculations, and permission decisions.
- Integration tests cover repositories, migrations, queues, storage, and external services.
- API tests cover authentication, validation, authorization, and lifecycle rules.
- End-to-end tests cover login-to-completion workflows and cross-business-unit isolation.
- Security tests cover private files, rate limits, injection, sessions, and revoked access.
- Every feature has validation and error states, server-side authorization, relevant audit behavior, and tests for important business rules.
- Staging verification is required before production; schema changes include migrations; no secrets are committed.

## Initial Acceptance Scenarios

- A user cannot access a client in another business unit.
- A client cannot access another client's private file.
- Invoice approval creates the expected audit trail.
- The same payment cannot be recorded twice.
- A revoked session cannot call protected API operations.
- A media crew member sees only the production data allowed by their role.

## Required Follow-up Documents

Create and maintain ADRs, schema documentation, API conventions, a permission matrix,
security checklist, backup/restore procedure, deployment runbook, incident response
procedure, data-retention policy, file-access policy, and third-party integration inventory.

## Open Before Coding

- Confirm the actual repository layout and chosen stack; the planning document gives recommendations only.
- Define local setup and verification commands once manifests and CI exist.
- Choose the authentication provider and object-storage provider.
- Define tenancy boundaries, permission semantics, retention rules, and financial/accounting requirements with appropriate review.

## Long-Term Memory

Use `docs/MEMORY.md` and `docs/memory/INDEX.md` for durable project context. Memory
records should preserve decisions, verified domain facts, workflows, operations, and
open questions; they must not become a second database for Virtus business records.
