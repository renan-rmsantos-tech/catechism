import { db } from './db'

export async function syncPendingSessions(): Promise<void> {
  const pending = await db.pending_sessions.toArray()
  if (!pending.length) return

  const res = await fetch('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessions: pending }),
  })

  if (!res.ok) return

  await db.pending_sessions.bulkDelete(pending.map((s) => s.id))
}

export function registerBackgroundSync(): void {
  if (typeof window === 'undefined') return

  // iOS/Safari fallback — always register the online event listener
  window.addEventListener('online', () => {
    syncPendingSessions()
  })

  // Background Sync API for Chrome/Android (works even when tab is closed)
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready
      .then((reg) => {
        // SyncManager is not in standard lib — cast to access Background Sync API
        const syncReg = reg as ServiceWorkerRegistration & { sync: { register(tag: string): Promise<void> } }
        return syncReg.sync.register('sync-attendance')
      })
      .catch(() => {
        // Registration failure is non-fatal; the online event listener already covers sync
      })
  }
}
