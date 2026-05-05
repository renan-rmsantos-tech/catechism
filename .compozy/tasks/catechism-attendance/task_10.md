---
title: Polimento e Auditoria Final
status: pending
type: chore
complexity: medium
dependencies:
  - task_08
  - task_09
---

# Task 10: Polimento e Auditoria Final

## Overview
Realiza a validação final do sistema: verifica o fluxo offline em dispositivos reais (iOS/Safari e Android/Chrome), audita as políticas RLS no banco, aplica refinamentos de UX mobile e confirma que a implementação de cada tela está fiel às telas do Paper. É a última barreira antes do deploy em produção.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
- **OBRIGATÓRIO: Comparar screenshots reais da aplicação com as 4 telas do Paper antes de considerar qualquer tela como "concluída"**
</critical>

<requirements>
- MUST testar o fallback `online` event no iOS/Safari (sem Background Sync API)
- MUST auditar todas as políticas RLS: catequista não acessa turmas de outro catequista, não lê dados de outros alunos, não gera relatórios
- MUST comparar cada tela implementada com o artboard correspondente no Paper via MCP screenshot
- MUST garantir que todos os botões de toque tenham no mínimo 48px de altura/largura
- MUST verificar que a chamada completa é possível em menos de 3 minutos (meta do PRD)
- MUST confirmar que `npm run build` passa sem warnings críticos de TypeScript ou ESLint
- MUST validar que o arquivo Excel abre sem erros no Microsoft Excel e o PDF no Adobe Acrobat
- Corrigir quaisquer divergências visuais encontradas na comparação com o Paper
</requirements>

## Subtasks
- [ ] 10.1 Capturar screenshots de todas as telas implementadas e comparar com os 4 artboards do Paper via MCP
- [ ] 10.2 Testar fluxo offline completo em dispositivo iOS real (Safari): fazer chamada offline → reconectar → verificar sync via `online` event
- [ ] 10.3 Testar fluxo offline completo em dispositivo Android/Chrome: verificar Background Sync API
- [ ] 10.4 Executar auditoria manual de RLS: testar os 4 cenários de acesso cruzado listados no TechSpec → Testing Approach
- [ ] 10.5 Verificar tamanho mínimo de toque (48px) em todos os botões interativos das telas do catequista
- [ ] 10.6 Rodar `npm run build` e corrigir todos os warnings de TypeScript e ESLint
- [ ] 10.7 Gerar relatório PDF e Excel com dados reais e abrir em Acrobat Reader e Microsoft Excel

## Implementation Details
Consultar TechSpec → **Testing Approach** (seção Exploratório / Manual) para a lista completa de cenários de teste.

**Comparação visual com Paper — telas a validar:**
- Paper screen 1 → `/dashboard` (Catequista: Minhas Turmas)
- Paper screen 2 → `/dashboard/turmas/[id]/chamada` (Catequista: Chamada em Andamento)
- Paper screen 3 → `/admin` (Coordenador: Dashboard)
- Paper screen 4 → `/admin/alunos/novo` (Coordenador: Cadastro de Aluno)

**Cenários RLS a auditar manualmente:**
1. Catequista A tenta acessar URL de turma do catequista B → deve receber 403
2. Catequista tenta acessar `GET /api/reports/attendance` → deve receber 403
3. Catequista tenta criar turma via `POST /api/classes` → deve receber 403
4. Coordenador acessa qualquer turma e aluno → deve funcionar sem restrição

### Relevant Files
- Todas as páginas implementadas nas tasks 04–09
- `supabase/migrations/0001_initial_schema.sql` — políticas RLS a auditar
- `lib/attendance-sync.ts` — fallback `online` event a testar

### Dependent Files
- Nenhum arquivo novo — apenas validação e correções das tasks anteriores

### Related ADRs
- [ADR-003: Estratégia Offline — PWA com IndexedDB + Background Sync](adrs/adr-003.md) — Fallback iOS a validar nesta task

## Deliverables
- Relatório de divergências visuais (Paper vs. implementação) com correções aplicadas
- Confirmação escrita dos 4 cenários RLS auditados
- Build limpo sem warnings críticos
- Unit tests com 80%+ coverage **(REQUIRED)**
- Testes exploratórios manuais documentados **(REQUIRED)**

## Tests
- Unit tests:
  - [ ] `npm run build` conclui sem erros de TypeScript
  - [ ] `npm run lint` não reporta erros de ESLint
  - [ ] Todos os testes das tasks 01–09 continuam passando (regressão)
- Integration tests:
  - [ ] Catequista A não consegue ler dados da turma do catequista B (RLS)
  - [ ] Catequista não consegue acessar `/api/reports/attendance` (retorna 403)
  - [ ] Sync offline funciona no iOS/Safari via `online` event (teste em dispositivo real)
  - [ ] Sync offline funciona no Android/Chrome via Background Sync API
- Testes manuais exploratórios:
  - [ ] Chamada completa de 15 alunos em menos de 3 minutos no celular
  - [ ] PDF gerado abre no Adobe Acrobat Reader sem erros
  - [ ] Excel gerado abre no Microsoft Excel sem erros
  - [ ] PWA instalável na tela inicial no Android Chrome e iOS Safari
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Todas as 4 telas visuais aprovadas na comparação com o Paper
- 0 regressões nos testes das tasks anteriores
- Fluxo offline validado em iOS real e Android real
- Deploy em produção no Vercel funcionando sem erros
- Todos os critérios de sucesso do PRD atendidos (meta: 100% das turmas fazem chamada digital)
