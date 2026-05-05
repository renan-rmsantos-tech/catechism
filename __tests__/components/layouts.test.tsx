// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdminLayout from '@/app/admin/layout'
import DashboardLayout from '@/app/dashboard/layout'

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/admin'),
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('AdminLayout', () => {
  it('renders children inside main', () => {
    render(
      <AdminLayout>
        <div>Page Content</div>
      </AdminLayout>
    )
    expect(screen.getByText('Page Content')).toBeInTheDocument()
  })

  it('renders the sidebar component (desktop layout)', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    )
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })

  it('sidebar has hidden class (hidden on mobile, shown on lg+)', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    )
    const sidebar = screen.getByTestId('sidebar')
    expect(sidebar).toHaveClass('hidden')
    expect(sidebar).toHaveClass('lg:flex')
  })

  it('admin layout does not contain dashboard-header', () => {
    render(
      <AdminLayout>
        <div>Content</div>
      </AdminLayout>
    )
    expect(screen.queryByTestId('dashboard-header')).not.toBeInTheDocument()
  })
})

describe('DashboardLayout', () => {
  it('renders children inside main', () => {
    render(
      <DashboardLayout>
        <div>Minhas Turmas</div>
      </DashboardLayout>
    )
    expect(screen.getByText('Minhas Turmas')).toBeInTheDocument()
  })

  it('renders "Catequese" header with amber color', () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    )
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    const title = screen.getByText('Catequese')
    expect(title).toHaveStyle({ color: 'var(--accent)' })
  })

  it('renders dashboard-header', () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    )
    expect(screen.getByTestId('dashboard-header')).toBeInTheDocument()
  })

  it('does not render a sidebar (mobile-first, no sidebar)', () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    )
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()
  })

  it('dashboard layout has mobile-first flex-col structure', () => {
    render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    )
    const layout = screen.getByTestId('dashboard-layout')
    expect(layout).toHaveClass('flex-col')
  })
})
