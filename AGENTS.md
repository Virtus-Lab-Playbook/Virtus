# Repository Guidance

- Phase 0 now provides the initial pnpm/Turborepo scaffold; use `README.md`, package manifests, and CI as the executable source for commands.
- The PDF and `docs/PLAN.md` describe recommendations; when code or configuration disagrees with them, treat executable sources as authoritative and record intentional changes.
- Treat `docs/DESIGN.md` as the living architecture contract; update it when paths, ports, boundaries, runtime behavior, or implementation status changes.
- Use Corepack for pnpm: install with `corepack pnpm install --frozen-lockfile`, then verify with `corepack pnpm format:check`, `corepack pnpm lint`, `corepack pnpm typecheck`, `corepack pnpm test`, and `corepack pnpm build`.
- Start local PostgreSQL and Redis with `corepack pnpm infra:up`; copy `.env.example` to `.env` before migrations or local app startup.
- Start all persistent development tasks with `corepack pnpm dev`; do not reintroduce the deprecated `turbo run dev --parallel` flag.
- Future subdomain plan: main web `3004`, Service `3005`, Asset `3006`, Media `3007`, and shared API `4040`; route subdomains through a reverse proxy while keeping one modular-monolith backend, database, and shared permission model.
- Durable project memory is documented in `docs/MEMORY.md` and indexed from `docs/memory/INDEX.md`; update those records when a decision, constraint, workflow, or unresolved question would otherwise be lost between sessions.
- Keep one durable fact or decision per memory record, include its source and update date, and link related records instead of duplicating content.
- Never store secrets, credentials, private customer data, or unverified speculation in repository memory; operational records belong in the future application data model, not markdown notes.
- For conflicting notes, prefer executable code/configuration, then approved decisions, then the master plan, then session notes; mark superseded records rather than silently rewriting history.
