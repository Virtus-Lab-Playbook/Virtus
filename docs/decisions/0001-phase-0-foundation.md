# ADR 0001: Phase 0 Foundation

- Status: accepted for the initial scaffold
- Date: 2026-09-05
- Source: `Virtus_OS_Master_Planning_Document (1).pdf`, sections 02, 07, 08, 16, and 19

## Decision

Start Virtus OS as a pnpm/Turborepo monorepo with Next.js web, NestJS API,
TypeScript worker, shared packages, PostgreSQL, Redis, Prisma, Docker Compose,
and GitHub Actions.

Keep domain boundaries inside one deployable system until operational evidence
justifies service extraction.

## Consequences

- Shared types, validation, permissions, authentication, UI, and database access can be versioned together.
- PostgreSQL is the system of record; Redis is infrastructure for queues and transient state.
- Local infrastructure can be started with Docker Compose without requiring production services.
- Auth, business domains, and production backup choices remain intentionally incomplete and must be decided before those features ship.

## Verification

The Phase 0 scaffold must pass install, lint, typecheck, test, and build checks before
Phase 1 work begins. See `README.md` for the command order.
