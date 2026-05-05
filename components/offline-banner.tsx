'use client'

import { useState, useEffect } from 'react'

export default function OfflineBanner() {
  const [offline, setOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  )

  useEffect(() => {
    const onOnline = () => setOffline(false)
    const onOffline = () => setOffline(true)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  if (!offline) return null

  return (
    <div
      data-testid="offline-banner"
      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium"
      style={{
        backgroundColor: '#FEF3C7',
        borderBottom: '1px solid #FDE68A',
        color: '#92400E',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path d="M1 6l9.8 9.8M16.2 9.8 23 3" />
        <path d="M5 3a19 19 0 0 1 14 0" />
        <path d="M8.5 6.5a10 10 0 0 1 7 0" />
        <path d="M12 20h.01" />
      </svg>
      Modo offline — será sincronizado em breve
    </div>
  )
}
