# PRD: Sistema de Gestão de Presença para Catecismo

## Overview

Uma aplicação web/mobile para uma única paróquia gerenciar o cadastro completo de alunos de catecismo e o controle de presença por turma. O sistema resolve dois problemas centrais: a dependência de listas de presença em papel e a ausência de um cadastro centralizado com dados pessoais, pastorais e de contato dos responsáveis.

**Para quem:** coordenadores de catequese e catequistas de uma paróquia.

**Por que é valioso:** elimina papelada, centraliza informações dos alunos num único lugar e permite que os catequistas registrem a chamada no celular durante a aula — mesmo sem internet. O coordenador ganha visibilidade em tempo real sobre presença e pode gerar relatórios para arquivo e acompanhamento.

---

## Goals

1. Eliminar o uso de listas de presença em papel nas turmas de catecismo da paróquia.
2. Centralizar o cadastro de alunos com dados pessoais, pastorais e de contato dos responsáveis.
3. Permitir que catequistas marquem presença no celular em menos de 3 minutos por turma.
4. Oferecer ao coordenador relatórios de presença exportáveis em PDF e Excel.
5. Garantir que nenhum registro de presença seja perdido por falta de conexão.

---

## User Stories

### Coordenador de Catequese

- Como coordenador, quero criar turmas com nome, nível/ano de catecismo e catequista responsável, para organizar o catecismo da paróquia.
- Como coordenador, quero cadastrar alunos com todos os dados pessoais, pastorais e de contato dos responsáveis, para manter o registro completo na paróquia.
- Como coordenador, quero visualizar e editar o cadastro de qualquer aluno, para manter as informações sempre atualizadas.
- Como coordenador, quero mover um aluno de uma turma para outra, para refletir transferências ou reagrupamentos.
- Como coordenador, quero exportar o relatório de presença de uma turma em PDF ou Excel por período, para arquivo e acompanhamento pastoral.
- Como coordenador, quero ver o resumo de presenças e faltas por aluno em uma turma, para identificar quem precisa de atenção.
- Como coordenador, quero cadastrar catequistas e atribuí-los a turmas, para controlar quem tem acesso a quê.

### Catequista

- Como catequista, quero ver a lista dos meus alunos no celular ao abrir o sistema, para saber quem está na minha turma.
- Como catequista, quero marcar cada aluno como Presente ou Ausente durante a aula, para registrar a chamada rapidamente.
- Como catequista, quero que o registro de presença seja salvo mesmo sem internet, para não perder dados em caso de sinal fraco.
- Como catequista, quero que a chamada sincronize automaticamente quando a internet retornar, para não precisar me preocupar com isso.
- Como catequista, quero ver o histórico de chamadas anteriores da minha turma, para consultar registros passados se necessário.

---

## Core Features

### 1. Gestão de Turmas

O coordenador cria e gerencia turmas da paróquia. Cada turma tem nome, nível/ano de catecismo, catequista responsável e horário. Alunos são associados a uma turma. Turmas encerradas podem ser arquivadas sem perda de histórico.

### 2. Cadastro de Alunos

Formulário de registro com os seguintes campos:

**Dados pessoais:**
- Nome completo
- Data de nascimento
- Cidade onde mora

**Dados pastorais:**
- Já fez a Primeira Comunhão? (Sim / Não)
- Já recebeu o Crisma? (Sim / Não)
- Já fez algum catecismo? Qual? (campo de texto livre)
- Já leu algum livro de religião? Qual? (campo de texto livre)

**Dados dos responsáveis:**
- Nome completo do pai
- Nome completo da mãe ou responsável
- Telefone de contato dos responsáveis

O coordenador pode visualizar, editar e transferir alunos entre turmas. A busca de alunos por nome deve ser rápida.

### 3. Controle de Presença

O catequista abre a chamada da sua turma no celular. A tela exibe a lista de alunos com botões de "Presente" e "Ausente" de fácil toque. Ao finalizar, confirma o envio.

- **Offline-first:** a chamada é salva localmente no dispositivo.
- **Sincronização automática:** ao recuperar conexão, os dados sobem para o servidor sem ação manual.
- **Indicador visual:** o catequista vê se está offline e se há chamadas pendentes de sincronização.

Cada chamada registra: turma, data, catequista e status de cada aluno.

### 4. Relatórios de Presença

O coordenador seleciona uma turma e um período (mês, bimestre ou intervalo personalizado) e exporta o relatório em **PDF** ou **Excel**. O relatório inclui:

- Lista de alunos com presenças e faltas por data.
- Total de presenças e faltas por aluno no período.
- Percentual de presença por aluno.

### 5. Perfis de Acesso

- **Coordenador:** acesso total — turmas, cadastro de alunos, relatórios e gestão de catequistas.
- **Catequista:** acesso restrito à sua própria turma — visualização dos alunos e registro de chamada.

---

## User Experience

**Catequista (mobile-first):**
O catequista acessa o sistema pelo navegador do celular. A tela inicial mostra diretamente sua turma. Para fazer a chamada, toca num botão de "Iniciar Chamada", vê a lista de alunos e marca um a um com um toque. A interface é otimizada para uso com uma mão só — botões grandes, sem menus desnecessários. Ao terminar, confirma a chamada. Se estiver offline, um banner discreto informa "modo offline — será sincronizado em breve".

**Coordenador (painel web, acessível em desktop e mobile):**
O coordenador tem um painel com visão geral das turmas ativas. Cadastra alunos e turmas via formulários claros e objetivos. Para relatórios, filtra turma e período e faz download com um clique. A navegação é simples o suficiente para alguém sem treinamento técnico.

**Linguagem e tom:** Português brasileiro, vocabulário paroquial e acolhedor (ex.: "turma", "catequista", "aluno", não "grupo", "instrutor", "estudante").

---

## High-Level Technical Constraints

- O sistema deve funcionar no navegador do celular sem necessidade de instalação via loja de aplicativos.
- A marcação de presença deve funcionar sem conexão com a internet e sincronizar automaticamente quando a conexão for reestabelecida.
- Dados de menores de idade estão sujeitos à **LGPD (Lei 13.709/2018)** — os dados dos responsáveis devem ser coletados no cadastro e o sistema deve garantir que apenas usuários autorizados acessem os dados dos alunos.
- O sistema deve suportar pelo menos uma paróquia com dezenas de turmas e centenas de alunos sem degradação de desempenho perceptível.
- A exportação de relatórios deve gerar arquivos compatíveis com Microsoft Excel e Adobe Acrobat Reader.

---

## Non-Goals (Out of Scope)

**MVP — fora do escopo agora:**
- Portal ou app para pais/responsáveis acompanharem a presença dos filhos.
- Envio de notificações de faltas por WhatsApp, SMS ou e-mail.
- Progressão automática de alunos entre turmas/anos de catecismo.
- Histórico multi-ano com rastreamento de etapas do catecismo.
- Gestão financeira ou controle de mensalidades.
- Emissão de certificados de sacramentos.
- Importação de listas de alunos via planilha.
- Suporte a múltiplas paróquias.

---

## Phased Rollout Plan

### Fase 1 — MVP

**O que inclui:**
- Cadastro de alunos com todos os campos solicitados.
- Gestão de turmas e associação de catequistas.
- Chamada offline-first com sincronização automática.
- Relatório de presença por turma em PDF e Excel.
- Perfis de coordenador e catequista com controle de acesso.

**Critérios para passar à Fase 2:**
- 100% das turmas ativas fazem chamada digital.
- 0 perdas de registro por problema de sincronização.
- O coordenador consegue gerar relatórios sem suporte técnico.

### Fase 2 — Melhorias Pastorais

**O que inclui:**
- Progressão anual: associar aluno a um ano de catecismo e promovê-lo ao próximo ano ao final do ciclo.
- Histórico multi-ano: ver todo o percurso do aluno na paróquia.
- Alertas de faltas excessivas para o coordenador.
- Importação de lista de alunos via planilha (Excel/CSV).

**Critérios para passar à Fase 3:**
- Coordenador valida a progressão anual ao final do primeiro ciclo letivo.

### Fase 3 — Comunicação e Integrações (futuro)

**O que pode incluir:**
- Notificações de faltas para responsáveis.
- Portal de acompanhamento para pais.
- Suporte a múltiplas paróquias.

---

## Success Metrics

1. **Adoção:** 100% das turmas ativas registram chamada digital em até 4 semanas após o lançamento.
2. **Completude do cadastro:** ≥ 90% dos alunos cadastrados têm todos os campos preenchidos.
3. **Confiabilidade offline:** 0 registros de presença perdidos por falha de sincronização nos primeiros 3 meses.
4. **Autonomia do coordenador:** coordenador gera relatório de presença sem precisar de ajuda técnica.
5. **Velocidade da chamada:** tempo médio para registrar chamada de uma turma < 3 minutos.

---

## Risks and Mitigations

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Catequistas resistem à mudança de papel para digital | Média | Onboarding simples; interface mobile intuitiva; apoio do coordenador na transição |
| Dispositivos dos catequistas muito antigos ou sem suporte ao navegador | Baixa | Testar em Android/iOS com versões populares; PWA tem boa compatibilidade |
| Dados pastorais sensíveis preenchidos erroneamente no início | Alta | Campos de texto livre para "qual catecismo" e "qual livro" sem validação rígida; fácil edição posterior |
| Coordenador não tem tempo para cadastrar todos os alunos antes do lançamento | Média | Lançar em fases por turma; ou catequista cadastra alunos da sua turma com supervisão |
| LGPD — falta de consentimento formal dos responsáveis | Baixa | Coletar consentimento no ato do cadastro presencial; documentar no processo paroquial existente |

---

## Architecture Decision Records

- [ADR-001: Escopo do Produto — MVP Focado](adrs/adr-001.md) — Adotado MVP com cadastro completo, turmas, chamada offline e relatórios; progressão anual adiada para Fase 2.

---

## Open Questions

- **Ano letivo:** o sistema precisa suportar separação por ano letivo (2024, 2025…) para que turmas e chamadas fiquem organizadas por ciclo? Ou basta arquivar turmas manualmente?
- **Múltiplos catequistas por turma:** uma turma pode ter dois catequistas? Ambos precisam de acesso?
- **Número de turmas e alunos:** qual é o volume esperado para dimensionamento? (ex.: 10 turmas, 200 alunos?)
- **Login dos catequistas:** como os catequistas receberão o acesso? E-mail + senha, link de convite, ou outro método?
