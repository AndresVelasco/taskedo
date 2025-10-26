# Taskedo

Taskedo is a lightweight, API-first task scheduler focused on multitenant cloud-native workflows. This repo hosts every component (API, scheduler, CLI, shared packages, Prisma schema) in a single Node.js + TypeScript workspace.

## Packages

- `packages/common` – shared Zod config loader, logger, and domain types.
- `packages/api` – Express API surface (CRUD, triggers, status).
- `packages/scheduler` – polling loop that will lock and enqueue runnable tasks.
- `packages/cloud` – Cloud Tasks adapters (currently in-memory for dev/tests).
- `packages/cli` – command-line interface for YAML provisioning and admin flows.
- `packages/db` – Prisma schema + helper to access Cloud SQL / local Postgres.

## Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional but recommended for local Postgres)

## Install dependencies

```bash
npm install
cp .env.example .env
```

## Local Postgres quickstart

1. Start Postgres via Compose (change ports if you already run Postgres locally):

   ```bash
   docker compose up -d postgres
   ```

2. Point Prisma/Taskedo at it (values already match `.env.example`):

   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskedo
   ```

3. Manage the schema from `packages/db/prisma/schema.prisma`:

   ```bash
   # format + generate types
   npm run --workspace packages/db format
   npm run --workspace packages/db generate

   # once you are ready to evolve the schema interactively
   npm run --workspace packages/db migrate -- name "init-schema"
   ```

   The schema already models tenants, tasks, runs, dependencies, and the scheduler lock so you can begin validating relationships and constraints.

## Running packages

- API dev server:

  ```bash
  npm run dev --workspace packages/api
  ```

- Scheduler loop (currently logs ticks):

  ```bash
  npm run dev --workspace packages/scheduler
  ```

- CLI entry point:

  ```bash
  npm run dev --workspace packages/cli -- status
  ```

## Config & secrets

Configuration lives in `packages/common/src/config`. Defaults come from `.env` (loaded via `dotenv`), validated with Zod, and cached for reuse. Cloud SQL vs. local Postgres is just a matter of changing `DATABASE_URL`; the Prisma client in `packages/db` consumes it directly so API, scheduler, and CLI stay consistent.

## Next steps

1. **Schema validation** – review `packages/db/prisma/schema.prisma`, adjust fields/indexes, then run `npm run --workspace packages/db migrate` against your local Postgres to verify everything works end-to-end.
2. **Local Postgres workflow** – decide whether to use Docker Compose (provided) or an existing Postgres install, then export `DATABASE_URL` accordingly before running API/scheduler/CLI processes.
3. **Fill in business logic** – wire Prisma into the API routes, teach the scheduler loop to claim locks and enqueue via `packages/cloud`, and implement the CLI commands to call the API.

With the workspace scaffolding in place, you can now focus on database modeling and local environment setup during your next session. Let me know when you’re ready to dive deeper into the schema or Postgres tooling.
