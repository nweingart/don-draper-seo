import { type ReactNode } from 'react'

export type Page = 'scan' | 'compare' | 'fleet' | 'settings'

const NAV_ITEMS: { page: Page; label: string; icon: string }[] = [
  { page: 'scan', label: 'Scan', icon: '🔍' },
  { page: 'compare', label: 'Compare', icon: '⚖️' },
  { page: 'fleet', label: 'Fleet', icon: '📊' },
  { page: 'settings', label: 'Settings', icon: '⚙️' },
]

interface LayoutProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  children: ReactNode
}

export function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{
        width: 220,
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        padding: '1.5rem 0',
        flexShrink: 0,
      }}>
        <div style={{
          padding: '0 1.25rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          marginBottom: '1rem',
        }}>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Don Draper</h1>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SEO Dashboard</span>
        </div>
        {NAV_ITEMS.map(({ page, label, icon }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.625rem 1.25rem',
              background: currentPage === page ? 'var(--bg-hover)' : 'transparent',
              border: 'none',
              color: currentPage === page ? 'var(--text)' : 'var(--text-muted)',
              fontSize: '0.875rem',
              textAlign: 'left',
              cursor: 'pointer',
              borderLeft: currentPage === page ? '2px solid var(--accent)' : '2px solid transparent',
            }}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </nav>
      <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
