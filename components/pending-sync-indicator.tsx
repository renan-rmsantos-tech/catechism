'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/db'

export default function PendingSyncIndicator() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const n = await db.pending_sessions.count()
        if (!cancelled) setCount(n)
      } catch {
        // IndexedDB unavailable — ignore
      }
    }

    load()

    const onOnline = () => load()
    window.addEventListener('online', onOnline)

    return () => {
      cancelled = true
      window.removeEventListener('online', onOnline)
    }
  }, [])

  if (count === 0) return null

  return (
    <p
      data-testid="pending-sync-indicator"
      className="text-xs font-medium text-center px-4 py-2"
      style={{ color: '#B45309', backgroundColor: '#FEF3C7' }}
    >
      {count} chamada{count !== 1 ? 's' : ''} aguardando sync
    </p>
  )
}
