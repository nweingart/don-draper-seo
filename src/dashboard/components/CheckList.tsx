import { useState } from 'react'
import type { CheckResult, Severity } from '../../types'

interface CheckListProps {
  checks: CheckResult[]
}

const SEVERITY_ORDER: Severity[] = ['error', 'warning', 'info']

const SEVERITY_STYLE: Record<Severity, { color: string; label: string }> = {
  error: { color: 'var(--red)', label: 'Errors' },
  warning: { color: 'var(--yellow)', label: 'Warnings' },
  info: { color: 'var(--text-muted)', label: 'Info' },
}

export function CheckList({ checks }: CheckListProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const grouped = SEVERITY_ORDER.map((sev) => ({
    severity: sev,
    items: checks.filter((c) => c.severity === sev),
  })).filter((g) => g.items.length > 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {grouped.map(({ severity, items }) => {
        const { color, label } = SEVERITY_STYLE[severity]
        const isCollapsed = collapsed[severity] ?? false
        return (
          <div key={severity} className="card" style={{ padding: '1rem' }}>
            <button
              onClick={() => setCollapsed((p) => ({ ...p, [severity]: !p[severity] }))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                background: 'none',
                border: 'none',
                color: 'var(--text)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: color,
              }} />
              {label} ({items.length})
              <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                {isCollapsed ? '▸' : '▾'}
              </span>
            </button>
            {!isCollapsed && (
              <ul style={{
                listStyle: 'none',
                marginTop: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}>
                {items.map((check, i) => (
                  <li key={i} style={{
                    fontSize: '0.8125rem',
                    padding: '0.5rem 0.75rem',
                    background: 'var(--bg)',
                    borderRadius: 'var(--radius)',
                  }}>
                    <div style={{ fontWeight: 500 }}>{check.message}</div>
                    {check.fix && (
                      <div style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '0.75rem' }}>
                        Fix: {check.fix}
                      </div>
                    )}
                    <div style={{ color: 'var(--text-muted)', marginTop: '0.125rem', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                      {check.rule}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
