# Virtus OS

Virtus OS is planned as a modular monolith with shared operations for the Service,
Asset, and Media business engines.

## Requirements

- Node.js 22 or newer
- Corepack-enabled pnpm 11
- Docker Compose

## Phase 0 Commands

```bash
corepack pnpm install --frozen-lockfile
cp .env.example .env
corepack pnpm infra:up
corepack pnpm db:generate
corepack pnpm db:migrate
corepack pnpm format:check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

Run the API locally with `corepack pnpm --filter @virtus/api dev`. Its liveness
endpoint is `http://localhost:4040/health` and its readiness endpoint is
`http://localhost:4040/ready`. The public web app runs at `http://localhost:3003`,
the team portal at `http://localhost:3004`, and the Service Engine at
`http://localhost:3005`. The Asset Engine runs at `http://localhost:3006`, and the
Media Engine runs at `http://localhost:3007`.
Run all persistent development tasks together with `corepack pnpm dev`.

Prisma migration scripts explicitly load the root `.env` because pnpm runs package
scripts from the package directory.

The Operations Engine requires PostgreSQL. Start infrastructure with
`corepack pnpm infra:up`, apply the schema with `corepack pnpm db:migrate`, then run
the API and team app. The first registered account becomes an admin; additional
accounts are members unless their email is listed in `ADMIN_EMAILS`.

### Local Authentication & Mock Login

For local development and testing authentication in the team portal (`http://localhost:3004/login`):

- **Mock Admin Email**: `admin@virtus.local` (pre-configured in `ADMIN_EMAILS` within `.env.example`)
- **Mock Member Email**: `member@virtus.local` (or any mock address)
- **Mock Password**: `password123` (or `virtus-local-only`; minimum 8 characters)

To log in during local development, register the mock account first (e.g., using `password123`) on the portal, or sign in if already registered.

The current repository is still a Phase 0 scaffold for business modules. The
Docker/Nginx deployment for the five web applications is implemented in
`infrastructure/DEPLOYMENT.md`. See `docs/PLAN.md` and `docs/MEMORY.md` for the
planning and durable-memory rules.

The five web applications can be run behind the Docker/Nginx deployment in
`infrastructure/DEPLOYMENT.md`. The deployment maps `client-view`,
`operation-view`, `service-view`, `asset-view`, and `media-view` to the five
Next.js apps and uses `134.185.84.235` as the documented IPv4 target.
