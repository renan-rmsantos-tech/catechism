export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-testid="dashboard-layout"
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Mobile header — matches Paper screen 1 (Catequista: Minhas Turmas) */}
      <header
        data-testid="dashboard-header"
        className="flex items-center justify-between px-6 pt-2 pb-4 bg-white"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <h1
          className="text-xl font-extrabold"
          style={{ color: 'var(--accent)', letterSpacing: '-0.01em' }}
        >
          Catequese
        </h1>
        <div
          className="flex w-9 h-9 items-center justify-center rounded-full"
          style={{ backgroundColor: 'var(--accent-light)' }}
          aria-label="Perfil do usuário"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ stroke: 'var(--accent)' }}
            aria-hidden="true"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}
