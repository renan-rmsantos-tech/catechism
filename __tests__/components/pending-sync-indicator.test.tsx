// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

// Mock db — vi.fn() created lazily in factory to avoid hoisting issues
vi.mock('@/lib/db', () => ({
  db: {
    pending_sessions: {
      count: vi.fn(),
    },
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

// Access the mock after module-level setup
async function getCountMock() {
  const { db } = await import('@/lib/db')
  return db.pending_sessions.count as ReturnType<typeof vi.fn>
}

async function renderIndicator() {
  const { default: PendingSyncIndicator } = await import('@/components/pending-sync-indicator')
  return render(<PendingSyncIndicator />)
}

describe('PendingSyncIndicator — zero pending', () => {
  it('renders nothing when count is 0', async () => {
    const countMock = await getCountMock()
    countMock.mockResolvedValue(0)
    await renderIndicator()
    await waitFor(() => {
      expect(screen.queryByTestId('pending-sync-indicator')).not.toBeInTheDocument()
    })
  })
})

describe('PendingSyncIndicator — with pending sessions', () => {
  it('shows "2 chamadas aguardando sync" when 2 sessions pending', async () => {
    const countMock = await getCountMock()
    countMock.mockResolvedValue(2)
    await renderIndicator()
    await waitFor(() => {
      expect(screen.getByTestId('pending-sync-indicator')).toHaveTextContent(
        '2 chamadas aguardando sync'
      )
    })
  })

  it('shows "1 chamada aguardando sync" (singular) when 1 session pending', async () => {
    const countMock = await getCountMock()
    countMock.mockResolvedValue(1)
    await renderIndicator()
    await waitFor(() => {
      expect(screen.getByTestId('pending-sync-indicator')).toHaveTextContent(
        '1 chamada aguardando sync'
      )
    })
  })

  it('shows "5 chamadas aguardando sync" for 5 pending', async () => {
    const countMock = await getCountMock()
    countMock.mockResolvedValue(5)
    await renderIndicator()
    await waitFor(() => {
      expect(screen.getByTestId('pending-sync-indicator')).toHaveTextContent(
        '5 chamadas aguardando sync'
      )
    })
  })
})

describe('PendingSyncIndicator — handles DB error gracefully', () => {
  it('renders nothing and does not throw when DB throws', async () => {
    const countMock = await getCountMock()
    countMock.mockRejectedValue(new Error('IndexedDB unavailable'))
    await renderIndicator()
    await waitFor(() => {
      expect(screen.queryByTestId('pending-sync-indicator')).not.toBeInTheDocument()
    })
  })
})
