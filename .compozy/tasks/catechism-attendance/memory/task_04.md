# Task Memory: task_04.md

Keep only task-local execution context here. Do not duplicate facts that are obvious from the repository, task file, PRD documents, or git history.

## Objective Snapshot

Design system + base layouts implemented and verified. 141 tests (all passing), 98.78% coverage.

## Important Decisions

- **`--primary: #B45309`** overrides shadcn's default gray primary — the existing `Button variant="default"` automatically becomes amber without touching button.tsx.
- **Sidebar as Client Component** with `usePathname()` for active state; `hidden lg:flex` class handles mobile hide/desktop show responsively.
- **CSS variable strategy**: overwrote shadcn's `--background`, `--primary`, `--border`, `--accent` with amber values; added custom tokens (`--bg`, `--surface`, `--sidebar-bg`, `--success`, `--error`, etc.) separately in the same `:root` block.
- **`@vitest-environment jsdom` docblock** on each `.test.tsx` file — `environmentMatchGlobs` in vitest.config.ts is not recognized by TypeScript types in this vitest version; docblock approach is the safe alternative.
- **`@testing-library/dom` was missing** — had to install it (`npm i -D @testing-library/dom`) to use `@testing-library/react`.
- **`toHaveStyle({ border: '1.5px solid var(--border)' })` fails in jsdom** — jsdom does not resolve CSS variables in shorthand border. Use `getAttribute('style')?.includes(...)` instead for CSS-variable border assertions.

## Learnings

- `vitest.config.ts` `environmentMatchGlobs` type does not exist in `InlineConfig` for this vitest version. Remove it; use per-file docblock instead.
- When `userName === userRole` by default, `getByText` will throw "multiple elements found". Use `getAllByText` or test with unique values.
- shadcn/ui coverage includes `lib/**/*.ts` only by default. Extended to `components/**/*.tsx` in vitest.config.ts for task_04 component coverage.

## Files / Surfaces

- `app/globals.css` — amber palette, shadcn token overrides, Inter font mapping
- `app/layout.tsx` — Inter font (weights 400/500/600/700/800), `--font-inter` CSS variable
- `components/sidebar.tsx` — Client Component, usePathname, nav items, `hidden lg:flex`
- `app/admin/layout.tsx` — coordinator layout (Sidebar + main)
- `app/dashboard/layout.tsx` — catechist layout (mobile header + main, no sidebar)
- `components/ui/badge.tsx` — feita (green) + pendente (amber) variants
- `components/ui/card.tsx` — Card + CardSection (amber title, bordered)
- `vitest.config.ts` — added setupFiles, coverage includes components, removed environmentMatchGlobs
- `__tests__/setup.ts` — `@testing-library/jest-dom` import
- `__tests__/components/` — 5 new test files (sidebar, badge, card, button, layouts)

## Errors / Corrections

- `environmentMatchGlobs` removed after TypeScript reported it as unknown property.
- `@testing-library/dom` installed as missing peer dep for `@testing-library/react`.

## Ready for Next Run

Task complete. Layouts and design tokens are ready for feature pages in task_05+.
