# Task Memory: task_05.md

## Objective Snapshot

Task 5 complete: CRUD de anos letivos, turmas e catequistas; dashboard do coordenador fiel ao Paper screen 3; formulário de criação/edição de turma; fluxo de convite de catequista por e-mail; 192 tests passing (98%+ coverage).

## Important Decisions

- **Zod v4 UUID validation is strict**: must use RFC 4122 variant bits (4th group first nibble must be 8/9/a/b). All-same-digit UUIDs like `11111111-1111-1111-1111-111111111111` fail. Used `550e8400-e29b-41d4-a716-446655440000` pattern in tests.
- **DashboardView extracted to `components/admin/dashboard-view.tsx`**: pure component accepting data as props, enabling jsdom tests for Server Component output without rendering the async Server Component directly.
- **ClassForm in `components/admin/class-form.tsx`**: Client Component (`'use client'`) using `useActionState`. Action prop typed as `(prev, formData) => Promise<ActionState>`.
- **archiveClassAction returns `Promise<void>`**: plain form `action` prop requires `(formData) => void | Promise<void>`. Server Actions returning error state require `useActionState` instead.
- **`createSupabaseAdminClient` added to `lib/supabase/server.ts`**: uses `@supabase/supabase-js` `createClient` with service role key for `auth.admin.inviteUserByEmail`.
- **Test mock strategy**: fluent chain where all intermediate methods return `this` via `mockReturnThis()`, and final methods (`single`, `maybeSingle`, or last in chain via `then`) resolve the value. `makeInsertChain` handles `.insert().select().single()` pattern.
- **Route Handler request typing in tests**: `new Request(...)` is not assignable to `NextRequest`. Cast with `as Parameters<typeof POST>[0]`.

## Learnings

- Next.js 16 route handler context: `params` is a Promise → `const { id } = await params`.
- Supabase `auth.admin.inviteUserByEmail` is on the admin client (service role), not the regular server client.
- `makeChain` with a `then` property makes the chain thenable (awaitable directly), needed for routes that don't end with `.single()`.

## Files / Surfaces

New files:
- `lib/classes/schemas.ts` — Zod schemas (createAcademicYear, createClass, updateClass, inviteCatechist)
- `lib/supabase/server.ts` — added `createSupabaseAdminClient`
- `app/api/academic-years/route.ts` — GET + POST
- `app/api/classes/route.ts` — GET + POST
- `app/api/classes/[id]/route.ts` — PATCH (update + archive + catechist reassignment)
- `app/api/catechists/route.ts` — GET (coordinator only)
- `app/api/catechists/invite/route.ts` — POST (admin invite)
- `components/admin/dashboard-view.tsx` — pure UI for coordinator dashboard
- `components/admin/class-form.tsx` — Client Component form for create/edit
- `app/admin/page.tsx` — replaced placeholder with Server Component dashboard
- `app/admin/turmas/page.tsx` — turmas list with archive buttons
- `app/admin/turmas/new/page.tsx` — class creation page
- `app/admin/turmas/[id]/page.tsx` — class edit page
- `app/admin/turmas/actions.ts` — Server Actions (create, update, archive)
- `__tests__/classes.test.ts` — 22 unit + integration tests
- `__tests__/components/admin/dashboard-view.test.tsx` — 12 component tests
- `__tests__/components/admin/class-form.test.tsx` — 8 component tests

## Ready for Next Run

- Task 5 complete. All 192 tests pass (98%+ coverage). TypeScript clean.
- Dashboard matches Paper screen 3 structure.
- → task_06+: API endpoints for academic-years, classes, catechists are ready for downstream tasks (attendance, students).
