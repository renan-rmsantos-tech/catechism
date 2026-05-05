# Task Memory: task_01.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

COMPLETE. Scaffolded Next.js 16.2.4 + Supabase SSR + shadcn/ui. 15 unit tests, 100% coverage. Build clean. Deployed to Vercel, HTTP 200 verified.

## Important Decisions

- Used Vitest (not Jest) — simpler ESM config with Next.js 16
- proxy.ts is a passthrough placeholder (not `middleware.ts`) — Next.js 16 renamed the convention
- env var validation in `lib/supabase/config.ts` via `getPublicEnv()` / `getServiceRoleKey()` — lazy validation at call time
- Excluded `lib/utils.ts` from coverage (shadcn generated)
- `cookies()` from next/headers must be awaited — Next.js 16 async API

## Learnings

- Scaffolded in /tmp to avoid directory conflict, then rsync'd to project root
- Vercel env pull overwrites .env.local — must restore placeholder values after pull
- `vercel link --yes` detects Next.js automatically and creates `.vercel/project.json`

## Files / Surfaces

- `lib/supabase/config.ts`, `client.ts`, `server.ts`, `middleware.ts`
- `proxy.ts` — root proxy (passthrough)
- `types/index.ts` — domain types
- `__tests__/supabase-client.test.ts` — 15 tests, 100% coverage
- `vitest.config.ts`, `.env.example`, `.env.local`
- `.vercel/project.json` — Vercel project link

## Errors / Corrections

- Coverage initially 51% — added tests for setAll callbacks in server.ts and middleware.ts, excluded lib/utils.ts
- proxy.ts originally imported updateSession from lib/supabase/middleware — reverted to passthrough to avoid Supabase network calls with placeholder credentials during deploy

## Ready for Next Run

Task complete. Supabase real credentials needed before task_02. See MEMORY.md for handoff notes.
