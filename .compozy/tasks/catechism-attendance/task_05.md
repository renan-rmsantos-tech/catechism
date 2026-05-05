---
title: Gestão de Turmas e Catequistas
status: completed
type: frontend
complexity: medium
dependencies:
  - task_02
  - task_04
---

# Task 5: Gestão de Turmas e Catequistas

## Overview
Implementa o CRUD completo de anos letivos, turmas e catequistas no painel do coordenador. Inclui o dashboard com visão geral das turmas, associação N:N catequista-turma, arquivamento de turmas e convite de catequistas por e-mail. A tela do Paper "3 — Coordenador: Dashboard" é a referência visual obrigatória para o dashboard.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
- **OBRIGATÓRIO: Consultar Paper screen 3 (Coordenador: Dashboard) antes de implementar qualquer UI desta task**
</critical>

<requirements>
- MUST implementar CRUD de anos letivos (`/api/academic-years`)
- MUST implementar CRUD de turmas com arquivamento (`/api/classes`, `/api/classes/[id]`)
- MUST implementar listagem de catequistas e convite por e-mail (`/api/catechists`, `/api/catechists/invite`)
- MUST implementar associação N:N catequista-turma via `class_catechists`
- MUST implementar a página de dashboard do coordenador com a tabela de turmas (Paper screen 3)
- A tabela de turmas DEVE mostrar: nome, catequista(s), nº de alunos, progresso de presenças, badge de status
- Turmas arquivadas NÃO devem aparecer no dashboard principal (filtrar `is_archived = false`)
- MUST validar todos os inputs com Zod nos endpoints de API
</requirements>

## Subtasks
- [x] 5.1 Consultar Paper screen 3 via MCP e extrair estrutura da tabela de turmas e cards de estatísticas
- [x] 5.2 Implementar Route Handlers para anos letivos: `GET /api/academic-years`, `POST /api/academic-years`
- [x] 5.3 Implementar Route Handlers para turmas: `GET /api/classes`, `POST /api/classes`, `PATCH /api/classes/[id]`
- [x] 5.4 Implementar Route Handlers para catequistas: `GET /api/catechists`, `POST /api/catechists/invite`
- [x] 5.5 Implementar página dashboard `/admin` com cards de estatísticas e tabela de turmas ativas
- [x] 5.6 Implementar formulário de criação/edição de turma com seleção de catequista(s) e ano letivo
- [x] 5.7 Implementar ação de arquivamento de turma (soft delete via `is_archived`)

## Implementation Details
Consultar TechSpec → **API Endpoints** para os contratos completos dos endpoints desta task.

A página de dashboard deve ser implementada como Server Component para buscar os dados diretamente. Use Server Actions para as mutações (criar, editar, arquivar turma).

**Paper screen 3 mostra:**
- 4 cards de estatísticas no topo (total turmas, alunos, presenças do mês, catequistas)
- Tabela de turmas com colunas: Turma, Catequista, Alunos, Progresso (barra âmbar), Status
- Botão "Novo Aluno" em âmbar no canto superior direito

### Relevant Files
- `app/admin/page.tsx` — página dashboard do coordenador
- `app/admin/turmas/page.tsx` — listagem e gestão de turmas
- `app/admin/turmas/[id]/page.tsx` — detalhe/edição de turma
- `app/api/academic-years/route.ts` — Route Handler de anos letivos
- `app/api/classes/route.ts` — Route Handler de turmas
- `app/api/classes/[id]/route.ts` — Route Handler de turma individual
- `app/api/catechists/route.ts` — Route Handler de catequistas
- `app/api/catechists/invite/route.ts` — Route Handler de convite

### Dependent Files
- `app/admin/layout.tsx` (task_04) — layout com sidebar
- `supabase/migrations/0001_initial_schema.sql` (task_02) — tabelas `classes`, `class_catechists`, `academic_years`

### Related ADRs
- [ADR-001: Escopo do Produto — MVP Focado](adrs/adr-001.md) — Gestão de turmas faz parte do MVP
- [ADR-002: Stack Técnica — Next.js + Supabase + Vercel](adrs/adr-002.md) — Route Handlers + Supabase

## Deliverables
- Route Handlers para academic-years, classes e catechists
- Dashboard do coordenador com tabela de turmas (fiel ao Paper screen 3)
- Formulário de criação/edição de turma
- Fluxo de convite de catequista por e-mail
- Unit tests com 80%+ coverage **(REQUIRED)**
- Integration tests para CRUD de turmas e RLS **(REQUIRED)**

## Tests
- Unit tests:
  - [x] Validação Zod: nome de turma obrigatório
  - [x] Validação Zod: ano letivo deve ser número inteiro positivo
  - [x] `PATCH /api/classes/[id]` com `is_archived: true` arquiva a turma sem deletar
- Integration tests:
  - [x] `GET /api/classes` para catequista retorna apenas suas turmas (RLS)
  - [x] `GET /api/classes` para coordenador retorna todas as turmas
  - [x] `POST /api/classes` por catequista retorna 403
  - [x] Dashboard do coordenador renderiza turmas ativas com dados corretos
  - [x] Turma arquivada não aparece no dashboard
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Dashboard visual corresponde ao Paper screen 3
- Fluxo completo criação → edição → arquivamento de turma funciona
- Catequistas convidados recebem e-mail e podem fazer login
