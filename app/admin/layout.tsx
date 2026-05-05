import Sidebar from '@/components/sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-testid="admin-layout"
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
