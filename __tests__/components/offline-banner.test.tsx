// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import OfflineBanner from '@/components/offline-banner'

function setOnlineStatus(online: boolean) {
  Object.defineProperty(navigator, 'onLine', {
    value: online,
    writable: true,
    configurable: true,
  })
}

beforeEach(() => {
  setOnlineStatus(true)
})

afterEach(() => {
  setOnlineStatus(true)
})

describe('OfflineBanner — when online', () => {
  it('does not render when navigator.onLine is true', () => {
    setOnlineStatus(true)
    render(<OfflineBanner />)
    expect(screen.queryByTestId('offline-banner')).not.toBeInTheDocument()
  })
})

describe('OfflineBanner — when offline', () => {
  it('renders when navigator.onLine is false', () => {
    setOnlineStatus(false)
    render(<OfflineBanner />)
    expect(screen.getByTestId('offline-banner')).toBeInTheDocument()
  })

  it('shows the correct offline message', () => {
    setOnlineStatus(false)
    render(<OfflineBanner />)
    expect(screen.getByTestId('offline-banner')).toHaveTextContent(
      'Modo offline — será sincronizado em breve'
    )
  })
})

describe('OfflineBanner — reacts to network events', () => {
  it('appears when the offline event fires', async () => {
    setOnlineStatus(true)
    render(<OfflineBanner />)
    expect(screen.queryByTestId('offline-banner')).not.toBeInTheDocument()

    await act(async () => {
      setOnlineStatus(false)
      window.dispatchEvent(new Event('offline'))
    })

    expect(screen.getByTestId('offline-banner')).toBeInTheDocument()
  })

  it('disappears when the online event fires after being offline', async () => {
    setOnlineStatus(false)
    render(<OfflineBanner />)
    expect(screen.getByTestId('offline-banner')).toBeInTheDocument()

    await act(async () => {
      setOnlineStatus(true)
      window.dispatchEvent(new Event('online'))
    })

    expect(screen.queryByTestId('offline-banner')).not.toBeInTheDocument()
  })
})
