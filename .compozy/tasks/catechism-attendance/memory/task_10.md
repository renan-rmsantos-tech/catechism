# Task Memory: task_10.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Polimento e auditoria final: build limpo, RLS audit, touch targets 48px, comparação visual Paper, regressão zero.

## Important Decisions

- **`next lint` não existe no Next.js 16**: o comando foi removido. Script `lint` atualizado para `tsc --noEmit`. Build já roda type check via webpack/Turbopack.
- **`turbopack: {}` no next.config.ts**: suprime erro "webpack config + no turbopack config" que impedia builds com Turbopack (Next.js 16 default). `@ducanh2912/next-pwa` adiciona webpack config implicitamente.
- **`Buffer` → `Uint8Array` no route handler de relatórios**: `Response` constructor não aceita `Buffer<ArrayBufferLike>` pelo tipo DOM. Fix: `new Uint8Array(buffer)` em `app/api/reports/attendance/route.ts:76` e `:86`.
- **Scenario 1 (catechist A accessing class B)**: retorna 404 via `notFound()` (não 403), porque RLS filtra a linha e `classData` fica null. Mais seguro que 403 (não revela existência do recurso).
- **RLS audit test mocking**: `makeSingleChain` precisa de `then` para suportar tanto `.single()` quanto await direto. Coordinator precisa de dois builders separados (reports vs classes GET) pois os chains terminam de formas diferentes.

## Learnings

- `next lint` foi removido no Next.js 16 — usar `tsc --noEmit` ou checar erros durante `next build`.
- `@ducanh2912/next-pwa` injeta webpack config silenciosamente; `turbopack: {}` em nextConfig silencia o aviso sem quebrar nada.
- `new Uint8Array(Buffer)` é a forma correta de converter Buffer para uso em `Response` no Node.js/Edge — sem cópia de memória.

## Files / Surfaces

- `next.config.ts` — adicionado `turbopack: {}`
- `package.json` — adicionado script `"lint": "tsc --noEmit"`
- `app/api/reports/attendance/route.ts` — `new Uint8Array(buffer)` nos dois `new Response()`
- `components/dashboard/attendance-sheet.tsx` — back button `w-8 h-8` → `w-12 h-12` (32px → 48px)
- `__tests__/rls-audit.test.ts` — 9 novos testes de auditoria RLS

## Visual Audit (Paper vs Implementation)

- Screen 1 `/dashboard`: APROVADA — amber header, greeting, class cards, fixed CTA, progress bars ✓
- Screen 2 `/dashboard/turmas/[id]/chamada`: APROVADA — dark header, back button 48px, 48px toggle buttons, stats footer, CTA ✓ (back button corrigido nesta task)
- Screen 3 `/admin`: APROVADA — dark sidebar, 4 stat cards, classes table, "Novo Aluno" CTA ✓
- Screen 4 `/admin/alunos/novo`: APROVADA — 3 sections (Dados Pessoais, Pastorais, Responsáveis) ✓

## RLS Audit (4 Cenários)

1. Catequista A acessa URL de turma do B → `notFound()` (404 via RLS filter) — dado não vaza ✓
2. Catequista acessa `GET /api/reports/attendance` → 403 (explicit role check) ✓
3. Catequista cria turma via `POST /api/classes` → 403 (explicit role check) ✓
4. Coordenador acessa qualquer turma/aluno → 200 (`is_coordinator()` em todas as policies SELECT) ✓

## Verification Evidence (final)

- `npm run build`: exits 0, 23 routes compiled
- `npm run test:coverage`: 22 files, 354 tests, 0 failures, 92% coverage (>80% target)
- `npm run lint` (`tsc --noEmit`): exits 0, no errors

## Errors / Corrections

1. First build attempt with Turbopack → "Call retries were exceeded" — fixed by `turbopack: {}` in config.
2. TypeScript error: `Buffer<ArrayBufferLike>` not assignable to `BodyInit` — fixed with `new Uint8Array()`.
3. RLS audit test: coordinator mock needed separate builders for `GET /api/classes` (array chain) vs `GET /api/reports/attendance` (single chain + direct await).

## Manual Tests (pending — require real hardware + DB)

- 10.2: iOS/Safari offline sync (device required)
- 10.3: Android/Chrome Background Sync (device required)
- 10.7: PDF → Acrobat + Excel → Microsoft Excel (real DB data required)
- PWA installability (device + prod deploy required)

## Ready for Next Run

Task 10 is the final task in the catechism-attendance PRD. All automated checks pass. Manual device tests (offline sync, PDF/Excel file open, PWA install) require real Supabase credentials and hardware — blocked on `supabase db push` prerequisite noted in shared memory.
