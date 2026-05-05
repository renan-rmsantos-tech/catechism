---
title: Design System e Layouts Base
status: pending
type: frontend
complexity: medium
dependencies:
  - task_01
  - task_03
---

# Task 4: Design System e Layouts Base

## Overview
Implementa o design system completo (paleta âmbar, tipografia Inter, CSS variables) e os dois layouts base da aplicação: o layout do coordenador com sidebar escura e o layout mobile-first do catequista. Todas as telas devem ser implementadas tendo as telas do Paper como referência visual obrigatória.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
- **OBRIGATÓRIO: Abrir o arquivo "Catechism" no Paper MCP e consultar todas as 4 telas antes de escrever qualquer HTML/JSX**
</critical>

<requirements>
- MUST consultar as 4 telas do Paper antes de implementar qualquer componente visual
- MUST definir todas as CSS variables da paleta âmbar no `globals.css` conforme TechSpec → Design System
- MUST configurar fonte Inter via `next/font/google` com pesos 400/500/600/700/800
- MUST criar layout do coordenador (`app/admin/layout.tsx`) com sidebar escura (`--sidebar-bg: #1C1208`) e navegação ativa em âmbar
- MUST criar layout do catequista (`app/dashboard/layout.tsx`) mobile-first, sem sidebar, com header simples
- MUST usar o Paper screen 3 (Coordenador: Dashboard) como referência para a sidebar do coordenador
- MUST usar os Paper screens 1 e 2 (Catequista) como referência para o layout mobile
- Componentes de layout DEVEM ser responsivos: sidebar esconde em mobile para o layout do coordenador
</requirements>

## Subtasks
- [ ] 4.1 Abrir o Paper MCP, capturar screenshot das 4 telas e extrair valores exatos (cores, espaçamentos, fontes) via `get_computed_styles` e `get_jsx`
- [ ] 4.2 Definir CSS variables no `globals.css` com todos os tokens da paleta âmbar do TechSpec
- [ ] 4.3 Configurar Inter via `next/font/google` e aplicar ao `layout.tsx` raiz
- [ ] 4.4 Criar componente `Sidebar` para o painel do coordenador (Paper screen 3 como referência)
- [ ] 4.5 Criar `app/admin/layout.tsx` com sidebar + área de conteúdo
- [ ] 4.6 Criar `app/dashboard/layout.tsx` com header mobile e área de conteúdo
- [ ] 4.7 Criar componentes base reutilizáveis: `Button` (primário âmbar), `Card`, `Badge` (Feita/Pendente)

## Implementation Details
Consultar TechSpec → **Design System** para todos os tokens de cor e referências de artboard no Paper.

**Tokens obrigatórios a definir:**
- `--accent: #B45309` | `--accent-light: #FEF3C7` | `--accent-track: #FDE68A` | `--accent-dark: #78350F`
- `--bg: #FFFDF7` | `--surface: #FFFFFF` | `--border: #F5E6C0`
- `--text-primary: #1C1208` | `--text-secondary: #78716C`
- `--sidebar-bg: #1C1208` | `--success: #16A34A` | `--error: #DC2626`

**Telas Paper a consultar:**
- Artboard "1 — Catequista: Minhas Turmas" → layout mobile do catequista
- Artboard "2 — Catequista: Chamada em Andamento" → header âmbar mobile
- Artboard "3 — Coordenador: Dashboard" → sidebar escura + estrutura do painel
- Artboard "4 — Coordenador: Cadastro de Aluno" → sidebar com item "Alunos" ativo

### Relevant Files
- `app/globals.css` — CSS variables e estilos base
- `app/layout.tsx` — root layout com fonte Inter
- `app/admin/layout.tsx` — layout do coordenador
- `app/dashboard/layout.tsx` — layout do catequista
- `components/sidebar.tsx` — componente de sidebar
- `components/ui/` — componentes base (shadcn/ui customizados)

### Dependent Files
- `app/(auth)/login/page.tsx` — herda o root layout
- Todas as páginas de feature (task_05, task_06, task_07) usam esses layouts

### Related ADRs
- [ADR-002: Stack Técnica — Next.js + Supabase + Vercel](adrs/adr-002.md) — shadcn/ui + Tailwind CSS para UI

## Deliverables
- CSS variables da paleta âmbar definidas em `globals.css`
- Inter configurada via `next/font/google`
- Layout do coordenador com sidebar responsiva
- Layout mobile-first do catequista
- Componentes base: Button primário, Card, Badge de status
- Unit tests com 80%+ coverage **(REQUIRED)**
- Testes visuais de snapshot para layouts **(REQUIRED)**

## Tests
- Unit tests:
  - [ ] Sidebar renderiza item ativo com cor âmbar (`--accent`)
  - [ ] Badge "Feita" renderiza com cor de sucesso; Badge "Pendente" com cor de texto secundário
  - [ ] Layout do coordenador renderiza sidebar em viewport desktop (≥1024px)
  - [ ] Layout do catequista renderiza sem sidebar em viewport mobile (390px)
  - [ ] Componente Button primário aplica `--accent` como background
- Integration tests:
  - [ ] Rota `/admin/dashboard` renderiza layout com sidebar visível
  - [ ] Rota `/dashboard` renderiza layout mobile sem sidebar
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Layout visual corresponde às telas do Paper (validação por screenshot comparison)
- Todos os tokens de cor definidos e aplicados corretamente
- Sidebar do coordenador colapsa corretamente em mobile
