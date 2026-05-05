# TechSpec: Sistema de Gestão de Presença para Catecismo

> **PRD de referência:** `.compozy/tasks/catechism-attendance/_prd.md`

---

## Executive Summary

Sistema web/PWA fullstack construído com Next.js 15 (App Router) + Supabase + Vercel. A interface mobile-first para catequistas suporta marcação de chamada offline via Service Worker + IndexedDB (Dexie.js), com sincronização automática ao recuperar conexão. O painel do coordenador, acessível em desktop e mobile, cobre gestão de turmas, cadastro completo de alunos e exportação de relatórios. Controle de acesso por role (coordenador / catequista) é garantido via Row Level Security no Supabase.

Trade-off central: PWA entrega offline sem exigir app store, ao custo de suporte limitado ao Background Sync API no Safari/iOS — mitigado com fallback via evento `online`.

---

## Design System

Definido via Paper (MCP) antes do desenvolvimento. As 4 telas de referência estão no arquivo Paper **"Catechism"**:

| Tela | Artboard |
|---|---|
| Catequista — Minhas Turmas | 1 — Catequista: Minhas Turmas |
| Catequista — Chamada em Andamento | 2 — Catequista: Chamada em Andamento |
| Coordenador — Dashboard (Visão Geral) | 3 — Coordenador: Dashboard |
| Coordenador — Cadastro de Aluno | 4 — Coordenador: Cadastro de Aluno |

**Paleta (mood: âmbar/candlelit):**

| Token | Valor | Uso |
|---|---|---|
| `--accent` | `#B45309` | Botões primários, rótulos de seção, ativo |
| `--accent-light` | `#FEF3C7` | Fundo de toggles ativos, avatares |
| `--accent-track` | `#FDE68A` | Trilha de barras de progresso |
| `--accent-dark` | `#78350F` | Hover, estados de foco |
| `--bg` | `#FFFDF7` | Fundo da aplicação |
| `--surface` | `#FFFFFF` | Cards, modais |
| `--border` | `#F5E6C0` | Bordas de campos e cards |
| `--text-primary` | `#1C1208` | Texto principal |
| `--text-secondary` | `#78716C` | Labels, placeholders |
| `--sidebar-bg` | `#1C1208` | Fundo da sidebar do coordenador |
| `--success` | `#16A34A` | Presente |
| `--error` | `#DC2626` | Ausente |

**Tipografia:** Inter (Google Fonts), pesos 400/500/600/700/800.

---

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────┐
│           Browser / PWA                 │
│  Next.js 15 App Router (React)          │
│  Service Worker (Workbox)               │
│  Dexie.js → IndexedDB (offline queue)  │
└──────────┬──────────────────────────────┘
           │ HTTPS
┌──────────▼──────────────────────────────┐
│      Next.js API Routes /               │
│      Server Actions                     │
│  Validação (Zod) · Geração relatórios  │
│  (jsPDF, xlsx)                          │
└──────────┬──────────────────────────────┘
           │ supabase-js
┌──────────▼──────────────────────────────┐
│              Supabase                   │
│  PostgreSQL · Auth · Row Level Security │
└─────────────────────────────────────────┘
           │ deploy
┌──────────▼──────────────────────────────┐
│               Vercel                    │
│  Fluid Compute · Edge CDN              │
└─────────────────────────────────────────┘
```

**Responsabilidades por componente:**

| Componente | Responsabilidade |
|---|---|
| Next.js App Router | UI mobile-first (catequista) + painel admin (coordenador), routing, layouts por role |
| Server Actions / Route Handlers | Lógica de negócio, validação Zod, queries Supabase, geração de relatórios |
| Supabase Auth | Login e-mail+senha, sessão JWT, gestão de roles via `user_metadata` |
| Supabase PostgreSQL + RLS | Persistência e controle de acesso por role no nível do banco |
| Service Worker (Workbox) | Cache de assets estáticos, interceptação de requisições, disparo de sync |
| Dexie.js (IndexedDB) | Fila de chamadas pendentes durante modo offline |
| jsPDF + xlsx | Geração server-side de relatórios PDF e Excel |

---

## Implementation Design

### Core Interfaces

**Sync de chamada offline:**

```typescript
// lib/attendance-sync.ts
interface PendingSession {
  id: string           // uuid v4 local
  classId: string
  date: string         // YYYY-MM-DD
  catechistId: string
  records: { studentId: string; present: boolean }[]
  createdAt: number    // timestamp
}

async function syncPendingSessions(): Promise<void> {
  const db = new Dexie('catechism')
  const pending = await db.table<PendingSession>('pending_sessions').toArray()
  if (!pending.length) return
  await fetch('/api/attendance', {
    method: 'POST',
    body: JSON.stringify({ sessions: pending }),
  })
  await db.table('pending_sessions').bulkDelete(pending.map(s => s.id))
}
```

**Proteção de rotas por role:**

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.redirect('/login')
  const role = session.user.user_metadata?.role
  if (request.nextUrl.pathname.startsWith('/admin') && role !== 'coordinator') {
    return NextResponse.redirect('/dashboard')
  }
}
```

---

### Data Models

```sql
-- Perfis de usuário
CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name  TEXT NOT NULL,
  role       TEXT NOT NULL CHECK (role IN ('coordinator', 'catechist')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Anos letivos
CREATE TABLE academic_years (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year       INT UNIQUE NOT NULL,
  is_active  BOOLEAN DEFAULT FALSE
);

-- Turmas
CREATE TABLE classes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id UUID NOT NULL REFERENCES academic_years(id),
  name             TEXT NOT NULL,
  level            TEXT,
  schedule         TEXT,
  is_archived      BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Catequistas por turma (N:N)
CREATE TABLE class_catechists (
  class_id     UUID REFERENCES classes(id) ON DELETE CASCADE,
  catechist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (class_id, catechist_id)
);

-- Alunos
CREATE TABLE students (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id             UUID NOT NULL REFERENCES classes(id),
  full_name            TEXT NOT NULL,
  birth_date           DATE,
  city                 TEXT,
  first_communion      BOOLEAN DEFAULT FALSE,
  confirmation         BOOLEAN DEFAULT FALSE,
  previous_catechism   TEXT,
  religious_books      TEXT,
  guardian_father_name TEXT,
  guardian_mother_name TEXT,
  guardian_phone       TEXT,
  created_at           TIMESTAMPTZ DEFAULT now()
);

-- Sessões de chamada
CREATE TABLE attendance_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id     UUID NOT NULL REFERENCES classes(id),
  date         DATE NOT NULL,
  catechist_id UUID NOT NULL REFERENCES profiles(id),
  synced_at    TIMESTAMPTZ,
  UNIQUE (class_id, date)
);

-- Registros individuais de presença
CREATE TABLE attendance_records (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id),
  present    BOOLEAN NOT NULL,
  UNIQUE (session_id, student_id)
);
```

**Row Level Security:**

```sql
-- Catequista só acessa turmas às quais está associado
CREATE POLICY catechist_classes ON classes
  FOR SELECT USING (
    auth.uid() IN (
      SELECT catechist_id FROM class_catechists WHERE class_id = id
    ) OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'coordinator'
  );

-- Coordenador acesso total; catequista só escreve em suas turmas
CREATE POLICY catechist_attendance ON attendance_sessions
  FOR INSERT WITH CHECK (
    catechist_id = auth.uid()
    AND class_id IN (
      SELECT class_id FROM class_catechists WHERE catechist_id = auth.uid()
    )
  );
```

---

### API Endpoints

| Método | Rota | Role | Descrição |
|---|---|---|---|
| `GET` | `/api/classes` | Coord / Catequista | Lista turmas (catequista: só as suas) |
| `POST` | `/api/classes` | Coord | Cria turma |
| `PATCH` | `/api/classes/[id]` | Coord | Edita / arquiva turma |
| `GET` | `/api/classes/[id]/students` | Coord / Catequista | Lista alunos da turma |
| `POST` | `/api/students` | Coord | Cadastra aluno |
| `PATCH` | `/api/students/[id]` | Coord | Edita / transfere aluno |
| `GET` | `/api/students/[id]` | Coord | Detalhe do aluno |
| `POST` | `/api/attendance` | Catequista | Submete chamada (batch, idempotente por `session_id`) |
| `GET` | `/api/attendance` | Coord / Catequista | Histórico de chamadas (`?classId=&from=&to=`) |
| `GET` | `/api/reports/attendance` | Coord | Baixa relatório (`?classId=&from=&to=&format=pdf\|xlsx`) |
| `GET` | `/api/catechists` | Coord | Lista catequistas |
| `POST` | `/api/catechists/invite` | Coord | Envia convite por e-mail |
| `GET` | `/api/academic-years` | Coord | Lista anos letivos |
| `POST` | `/api/academic-years` | Coord | Cria ano letivo |

**Contrato do endpoint de sync:**

```
POST /api/attendance
Body: { sessions: PendingSession[] }
Response 200: { synced: number; skipped: number }
Comportamento: upsert por (class_id, date); registros individuais por (session_id, student_id)
```

---

## Integration Points

| Serviço | Propósito | Autenticação |
|---|---|---|
| Supabase Auth | Login e-mail+senha, sessão JWT, gestão de usuários | `SUPABASE_ANON_KEY` no client; `SERVICE_ROLE_KEY` no servidor |
| Supabase PostgreSQL | Persistência de todos os dados | RLS via JWT da sessão |
| Vercel Blob (opcional, Fase 2) | Armazenamento de relatórios gerados | Token Vercel |

---

## Impact Analysis

| Componente | Tipo | Descrição | Ação |
|---|---|---|---|
| Supabase DB | Novo | Schema completo criado do zero | Aplicar migrations em ordem |
| Next.js App | Novo | Projeto criado do zero | `npx create-next-app` com App Router |
| Service Worker | Novo | Offline + sync | Configurar Workbox via `next-pwa` |
| Vercel | Novo | Deploy e env vars | Vincular repo e configurar variáveis |

---

## Testing Approach

### Unit Tests

- Validação Zod dos formulários (campos obrigatórios, data, telefone)
- Cálculo de percentuais de presença para relatórios
- Função de merge de sessões offline (idempotência por `session_id`)
- Políticas RLS isoladas via `supabase test` ou queries manuais

### Integration Tests

- Fluxo completo: offline → IndexedDB → sync → Supabase (registro persistido)
- Auth: login, acesso a rota protegida, bloqueio cross-role
- Download PDF e Excel: arquivo gerado abre corretamente e contém os dados corretos

### Exploratório / Manual

- Desligar Wi-Fi do celular, fazer chamada completa, religar → verificar sync automático
- Catequista tenta acessar URL de turma alheia → recebe 403
- Coordenador exporta relatório no período com dados → arquivo abre no Excel e Acrobat
- Safari/iOS: verificar fallback do `online` event para sync (sem Background Sync API)

---

## Development Sequencing

### Build Order

1. **Supabase + Auth** — projeto, schema, migrações, RLS, login e-mail+senha, middleware de proteção de rotas
2. **Gestão de turmas** — CRUD de turmas, anos letivos, associação N:N de catequistas
3. **Cadastro de alunos** — formulário completo (todos os campos do PRD), busca por nome, transferência
4. **Chamada online** — catequista vê turma, marca presença com conexão, histórico por turma
5. **Chamada offline** — Service Worker (Workbox), IndexedDB (Dexie.js), sync automático, indicador de status
6. **Relatórios** — geração PDF (jsPDF) e Excel (xlsx), filtros por turma e período, download
7. **Polimento** — testes offline em iOS/Android real, refinamentos de UX mobile, auditoria de RLS

### Technical Dependencies

- Conta Supabase criada com projeto configurado
- Repositório vinculado ao Vercel
- Variáveis de ambiente configuradas: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

---

## Monitoring and Observability

| O quê | Como | Alerta |
|---|---|---|
| Erros de sync offline | Log no endpoint `POST /api/attendance` com `session_id` | Qualquer 5xx |
| Falha de login | Log de autenticação do Supabase | Taxa de falha > 10% |
| Tamanho de relatório | Log de duração de geração server-side | > 5 segundos |
| Sessões pendentes no IndexedDB | Indicador na UI ("X chamadas aguardando sync") | Visível para catequista |

---

## Technical Considerations

### Key Decisions

Veja os ADRs vinculados abaixo.

### Known Risks

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Background Sync sem suporte no Safari/iOS | Alta | Fallback com `window.addEventListener('online', syncPendingSessions)` |
| IndexedDB limpo pelo browser (pressão de storage) | Baixa | Indicador visual persistente de chamadas pendentes; confirmar sync antes de fechar |
| Limite do tier gratuito do Supabase | Baixa (volume pequeno) | Monitorar uso; plan pago custa ~USD 25/mês |
| Conflito de chamada duplicada no reenvio | Baixa | Constraint `UNIQUE (class_id, date)` + upsert idempotente |

---

## Architecture Decision Records

- [ADR-001: Escopo do Produto — MVP Focado](adrs/adr-001.md) — Adotado MVP com cadastro completo, turmas, chamada offline e relatórios; progressão anual adiada para Fase 2.
- [ADR-002: Stack Técnica — Next.js + Supabase + Vercel](adrs/adr-002.md) — Stack fullstack integrada escolhida sobre alternativas com menor integração; reduz tempo de setup do MVP.
- [ADR-003: Estratégia Offline — PWA com IndexedDB + Background Sync](adrs/adr-003.md) — PWA com Dexie.js e Workbox escolhida sobre app nativo; fallback via evento `online` para iOS/Safari.
