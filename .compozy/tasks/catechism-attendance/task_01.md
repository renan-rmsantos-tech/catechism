---
title: Scaffold do Projeto
status: completed
type: infra
complexity: low
dependencies: []
---

# Task 1: Scaffold do Projeto

## Overview
Configura a base do projeto com Next.js 16 (App Router), Supabase client (browser e server), Tailwind CSS e shadcn/ui. Estabelece a estrutura de diretórios, variáveis de ambiente e vínculo com o Vercel — base obrigatória para todas as tarefas subsequentes.

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
- [x] 1.1 Criar projeto Next.js 16.2.4 com App Router, TypeScript e Tailwind CSS
- [x] 1.2 Instalar dependências do projeto: `@supabase/supabase-js`, `@supabase/ssr`, `shadcn/ui`, `react-hook-form`, `zod`, `dexie`
- [x] 1.3 Criar utilitários de client Supabase para browser e server (Server Component / Route Handler / Server Action)
- [x] 1.4 Configurar variáveis de ambiente no `.env.local` (placeholder) e no painel do Vercel (placeholder — atualizar com credenciais reais do Supabase)
- [x] 1.5 Vincular repositório ao Vercel e validar deploy inicial (HTTP 200 em https://catechism-kohl.vercel.app/)
- [x] 1.6 Confirmar estrutura de diretórios alinhada ao App Router: `app/`, `components/`, `lib/`, `types/`

## Implementation Details
Consultar TechSpec → **System Architecture** e **Technical Dependencies** para a lista completa de dependências e variáveis de ambiente.

O client Supabase tem três sabores conforme a documentação do `@supabase/ssr`:
- `lib/supabase/client.ts` — uso em Client Components
- `lib/supabase/server.ts` — uso em Server Components e Server Actions (cookies() é async no Next.js 16)
- `lib/supabase/middleware.ts` — uso no proxy raiz

> **Nota Next.js 16:** `middleware.ts` foi renomeado para `proxy.ts` e a função exportada é `proxy` (não `middleware`). O `proxy.ts` atual é um passthrough — task_03 implementará a autenticação completa.

### Relevant Files
- `package.json` — dependências do projeto
- `.env.local` — variáveis de ambiente (não commitar)
- `.env.example` — documentação das variáveis requeridas
- `lib/supabase/client.ts` — Supabase browser client
- `lib/supabase/server.ts` — Supabase server client
- `lib/supabase/middleware.ts` — utilitário para proxy
- `lib/supabase/config.ts` — validação de env vars (lança erro descritivo se ausentes)
- `proxy.ts` — proxy raiz (passthrough placeholder para task_03)
- `types/index.ts` — tipos TypeScript do domínio
- `__tests__/supabase-client.test.ts` — unit tests (100% coverage)
- `vitest.config.ts` — configuração do Vitest

### Dependent Files
- Todos os arquivos de tarefas subsequentes dependem da estrutura criada aqui

### Related ADRs
- [ADR-002: Stack Técnica — Next.js + Supabase + Vercel](adrs/adr-002.md) — Define o stack e as dependências principais

## Deliverables
- [x] Repositório Next.js 16 com App Router configurado
- [x] Supabase client (browser + server) funcional
- [x] shadcn/ui inicializado
- [x] `.env.local` documentado no `.env.example`
- [x] Deploy inicial no Vercel respondendo 200 (https://catechism-kohl.vercel.app/)
- [x] Unit tests com 100% coverage (>= 80% requerido)
- [ ] Integration tests para conexão Supabase real — requer credenciais reais (seguir para task_02)

## Tests
- Unit tests:
  - [x] `createBrowserClient()` retorna instância válida do Supabase client
  - [x] `createServerClient()` retorna instância válida com cookies do Next.js
  - [x] Variáveis de ambiente obrigatórias são validadas em startup (lança erro descritivo se ausentes)
- Integration tests:
  - [ ] Conexão ao Supabase real responde sem erro — pendente: requer credenciais reais do Supabase no `.env.local`
  - [x] Deploy no Vercel retorna HTTP 200 na rota raiz (verificado via curl)
- Test coverage: 100% (statements, branches, functions, lines)
- All unit tests pass: 15/15

## Success Criteria
- [x] All tests passing (15/15)
- [x] Test coverage >=80% (100%)
- [x] `npm run build` conclui sem erros
- [x] Deploy no Vercel funcionando com preview URL acessível (https://catechism-kohl.vercel.app/)
- [ ] Supabase client conecta ao projeto sem erro de autenticação — requer credenciais reais

## Follow-up (para task_02 ou após obter credenciais Supabase)
- Substituir placeholders em `.env.local` e no painel do Vercel pelas credenciais reais do projeto Supabase
- Adicionar integration test de conexão Supabase real (`createClient().auth.getUser()` sem erro de autenticação)
- O `proxy.ts` será substituído pela implementação de autenticação em task_03
