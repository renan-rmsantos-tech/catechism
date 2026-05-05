# Task Memory: task_01.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Scaffold greenfield Next.js 15 (App Router) project with Supabase, shadcn/ui, Tailwind CSS, and Vitest tests.
Workspace was empty (only dot-directories from tooling). Starting from zero.

## Important Decisions

- Using Vitest (not Jest) for unit tests — simpler ESM configuration with Next.js 15 App Router
- env var validation via a `lib/supabase/config.ts` module that throws descriptive errors at import time when vars are missing
- Three Supabase client flavors required: `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (server), `lib/supabase/middleware.ts` (middleware)
- `.env.local` created with placeholder values only — real credentials must be filled in manually; `.env.example` committed as documentation
- `middleware.ts` at root created as a placeholder pointing to `lib/supabase/middleware.ts` (task_03 will fill it)
- Integration tests that require real Supabase credentials are skipped when env vars are not set
- `SUPABASE_SERVICE_ROLE_KEY` must never appear in any client-side file — only imported in server-only modules

## Learnings

- `create-next-app@latest` with explicit flags (`--typescript --tailwind --app --no-src-dir --import-alias "@/*" --no-eslint --yes`) runs non-interactively even with existing dot-directories in the folder
- `npx shadcn@latest init --defaults -y` initializes shadcn/ui with no prompts using the New York style and default theme

## Files / Surfaces

- `package.json` — dependencies including vitest, @supabase/supabase-js, @supabase/ssr, react-hook-form, zod, dexie
- `vitest.config.ts` — test runner config
- `lib/supabase/client.ts` — browser Supabase client
- `lib/supabase/server.ts` — server Supabase client (Server Components, Server Actions)
- `lib/supabase/middleware.ts` — middleware Supabase client
- `lib/supabase/config.ts` — env var validation (throws on missing vars)
- `middleware.ts` — root middleware placeholder
- `.env.example` — documents required env vars (committed)
- `.env.local` — actual env vars with placeholders (NOT committed)
- `types/index.ts` — shared TypeScript type stubs
- `__tests__/supabase-client.test.ts` — unit tests for Supabase clients

## Errors / Corrections

(none yet)

## Ready for Next Run

- Vercel linking (subtask 1.5) requires manual action: `vercel link` and `vercel env pull`
- Supabase real credentials (subtask 1.4) must be obtained from Supabase dashboard and set in `.env.local` and Vercel env panel
- Integration test for Supabase connection is conditional on real credentials being set
