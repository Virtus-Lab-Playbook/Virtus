---
id: decision-0001
type: decision
title: Phase 0 uses a pnpm and Turborepo modular-monolith scaffold
status: active
created: 2026-09-05
updated: 2026-09-05
source: docs/decisions/0001-phase-0-foundation.md
confidence: confirmed
supersedes: null
---

## Record

The initial repository structure uses `apps/web`, `apps/api`, and `apps/worker`,
shared packages, PostgreSQL with Prisma, Redis, Docker Compose, and GitHub Actions.
Domain services remain inside one deployable system until operational evidence
justifies extraction.

## Evidence

- `corepack pnpm install --frozen-lockfile` succeeds after approved dependency builds.
- `corepack pnpm lint`, `format:check`, `typecheck`, `test`, and `build` pass.
- Docker Compose PostgreSQL and Redis containers report healthy.
- Prisma applied the `phase-0-foundation` migration successfully.
- API `/health` and `/ready` returned `status: ok` with the root `.env` loaded explicitly.
- `docker build -f infrastructure/docker/api.Dockerfile -t virtus-api:phase-0 .` succeeds.

## Related

- `docs/decisions/0001-phase-0-foundation.md`
- `docs/PLAN.md`
- `README.md`
