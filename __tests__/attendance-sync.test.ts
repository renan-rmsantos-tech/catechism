import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { PendingSession } from '../lib/attendance/schemas'

// Valid UUIDs (Zod v4 enforces RFC 4122 variant bits)
const SESSION_1: PendingSession = {
  id: '550e8400-e29b-41d4-a716-446655440010',
  classId: '550e8400-e29b-41d4-a716-446655440000',
  date: '2026-05-05',
  catechistId: '550e8400-e29b-41d4-a716-446655440003',
  records: [{ studentId: '550e8400-e29b-41d4-a716-446655440001', present: true }],
  createdAt: 1000,
}

const SESSION_2: PendingSession = {
  id: '550e8400-e29b-41d4-a716-446655440011',
  classId: '550e8400-e29b-41d4-a716-446655440005',
  date: '2026-05-05',
  catechistId: '550e8400-e29b-41d4-a716-446655440003',
  records: [],
  createdAt: 2000,
}

// Mock db — vi.fn() instances created lazily inside factory to avoid hoisting issues
vi.mock('../lib/db', () => ({
  db: {
    pending_sessions: {
      toArray: vi.fn(),
      bulkDelete: vi.fn(),
    },
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

// Helper to get fresh module references after vi.resetModules()
async function freshSync() {
  vi.resetModules()
  const { db } = await import('../lib/db')
  const toArray = db.pending_sessions.toArray as ReturnType<typeof vi.fn>
  const bulkDelete = db.pending_sessions.bulkDelete as ReturnType<typeof vi.fn>
  const { syncPendingSessions } = await import('../lib/attendance-sync')
  return { syncPendingSessions, toArray, bulkDelete }
}

// ============================================================
// Unit Tests — syncPendingSessions
// ============================================================

describe('syncPendingSessions — empty IndexedDB', () => {
  it('returns without calling fetch when no pending sessions', async () => {
    const { syncPendingSessions, toArray, bulkDelete } = await freshSync()
    toArray.mockResolvedValue([])

    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)

    await syncPendingSessions()

    expect(mockFetch).not.toHaveBeenCalled()
    expect(bulkDelete).not.toHaveBeenCalled()
  })
})

describe('syncPendingSessions — with pending sessions', () => {
  it('posts all sessions to /api/attendance', async () => {
    const { syncPendingSessions, toArray } = await freshSync()
    toArray.mockResolvedValue([SESSION_1, SESSION_2])
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', mockFetch)

    await syncPendingSessions()

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/attendance',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessions: [SESSION_1, SESSION_2] }),
      })
    )
  })

  it('deletes all synced sessions from IndexedDB after successful POST', async () => {
    const { syncPendingSessions, toArray, bulkDelete } = await freshSync()
    toArray.mockResolvedValue([SESSION_1, SESSION_2])
    bulkDelete.mockResolvedValue(undefined)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    await syncPendingSessions()

    expect(bulkDelete).toHaveBeenCalledWith([SESSION_1.id, SESSION_2.id])
  })

  it('posts sessions with correct content-type header', async () => {
    const { syncPendingSessions, toArray } = await freshSync()
    toArray.mockResolvedValue([SESSION_1])
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', mockFetch)

    await syncPendingSessions()

    const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect((options.headers as Record<string, string>)['Content-Type']).toBe('application/json')
  })
})

describe('syncPendingSessions — API failure (5xx)', () => {
  it('does NOT delete sessions when API returns 500', async () => {
    const { syncPendingSessions, toArray, bulkDelete } = await freshSync()
    toArray.mockResolvedValue([SESSION_1])
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    await syncPendingSessions()

    expect(bulkDelete).not.toHaveBeenCalled()
  })

  it('does NOT delete sessions when API returns 503', async () => {
    const { syncPendingSessions, toArray, bulkDelete } = await freshSync()
    toArray.mockResolvedValue([SESSION_2])
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }))

    await syncPendingSessions()

    expect(bulkDelete).not.toHaveBeenCalled()
  })

  it('still calls the API even on 5xx (fetch is called)', async () => {
    const { syncPendingSessions, toArray } = await freshSync()
    toArray.mockResolvedValue([SESSION_1])
    const mockFetch = vi.fn().mockResolvedValue({ ok: false, status: 500 })
    vi.stubGlobal('fetch', mockFetch)

    await syncPendingSessions()

    expect(mockFetch).toHaveBeenCalledOnce()
  })
})

// ============================================================
// Integration Tests — offline → IndexedDB → sync flow
// ============================================================

describe('syncPendingSessions — integration flow', () => {
  it('posts all sessions and deletes them (full offline→sync flow)', async () => {
    const { syncPendingSessions, toArray, bulkDelete } = await freshSync()
    toArray.mockResolvedValue([SESSION_1, SESSION_2])
    bulkDelete.mockResolvedValue(undefined)
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ synced: 2, skipped: 0 }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await syncPendingSessions()

    const body = JSON.parse((mockFetch.mock.calls[0] as [string, { body: string }])[1].body)
    expect(body.sessions).toHaveLength(2)
    expect(body.sessions[0].id).toBe(SESSION_1.id)
    expect(bulkDelete).toHaveBeenCalledWith([SESSION_1.id, SESSION_2.id])
  })

  it('second call with empty DB does not call API (idempotent after sync)', async () => {
    const { syncPendingSessions, toArray } = await freshSync()
    toArray.mockResolvedValueOnce([SESSION_1]).mockResolvedValueOnce([])
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', mockFetch)

    await syncPendingSessions() // First call: syncs SESSION_1
    await syncPendingSessions() // Second call: empty DB, no-op

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})
