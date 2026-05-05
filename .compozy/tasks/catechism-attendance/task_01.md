---
title: Scaffold do Projeto
status: pending
type: infra
complexity: low
dependencies: []
---

# Task 1: Scaffold do Projeto

## Overview
Configura a base do projeto com Next.js 15 (App Router), Supabase client (browser e server), Tailwind CSS e shadcn/ui. Estabelece a estrutura de diretórios, variáveis de ambiente e vínculo com o Vercel — base obrigatória para todas as tarefas subsequentes.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST usar `npx create-next-app@latest` com App Router, TypeScript e Tailwind CSS
- MUST instalar e configurar `@supabase/supabase-js` v2 com helpers para App Router (`@supabase/ssr`)
- MUST configurar `shadcn/ui` (init) com o tema padrão — customização visual fica na task_04
- MUST definir as variáveis de ambiente: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- MUST vincular o repositório ao Vercel e confirmar deploy inicial funcionando
- MUST garantir que `SUPABASE_SERVICE_ROLE_KEY` seja usada apenas em contextos server-side
</requirements>

## Subtasks
- [ ] 1.1 Criar projeto Next.js 15 com App Router, TypeScript e Tailwind CSS
- [ ] 1.2 Instalar dependências do projeto: `@supabase/supabase-js`, `@supabase/ssr`, `shadcn/ui`, `react-hook-form`, `zod`, `dexie`
- [ ] 1.3 Criar utilitários de client Supabase para browser e server (Server Component / Route Handler / Server Action)
- [ ] 1.4 Configurar variáveis de ambiente no `.env.local` e no painel do Vercel
- [ ] 1.5 Vincular repositório ao Vercel e validar deploy inicial (página index em branco é suficiente)
- [ ] 1.6 Confirmar estrutura de diretórios alinhada ao App Router: `app/`, `components/`, `lib/`, `types/`

## Implementation Details
Consultar TechSpec → **System Architecture** e **Technical Dependencies** para a lista completa de dependências e variáveis de ambiente.

O client Supabase deve ter três sabores conforme a documentação do `@supabase/ssr`:
- `lib/supabase/client.ts` — uso em Client Components
- `lib/supabase/server.ts` — uso em Server Components e Server Actions
- `lib/supabase/middleware.ts` — uso no `middleware.ts` raiz

### Relevant Files
- `package.json` — dependências do projeto
- `.env.local` — variáveis de ambiente (não commitar)
- `lib/supabase/client.ts` — Supabase browser client
- `lib/supabase/server.ts` — Supabase server client
- `middleware.ts` — placeholder para task_03

### Dependent Files
- Todos os arquivos de tarefas subsequentes dependem da estrutura criada aqui

### Related ADRs
- [ADR-002: Stack Técnica — Next.js + Supabase + Vercel](adrs/adr-002.md) — Define o stack e as dependências principais

## Deliverables
- Repositório Next.js 15 com App Router configurado
- Supabase client (browser + server) funcional
- shadcn/ui inicializado
- `.env.local` documentado no `.env.example`
- Deploy inicial no Vercel respondendo 200
- Unit tests com 80%+ coverage **(REQUIRED)**
- Integration tests para conexão Supabase **(REQUIRED)**

## Tests
- Unit tests:
  - [ ] `createBrowserClient()` retorna instância válida do Supabase client
  - [ ] `createServerClient()` retorna instância válida com cookies do Next.js
  - [ ] Variáveis de ambiente obrigatórias são validadas em startup (lança erro descritivo se ausentes)
- Integration tests:
  - [ ] Conexão ao Supabase real responde sem erro (pode usar projeto de teste)
  - [ ] Deploy no Vercel retorna HTTP 200 na rota raiz
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- `npm run build` conclui sem erros
- Deploy no Vercel funcionando com preview URL acessível
- Supabase client conecta ao projeto sem erro de autenticação
