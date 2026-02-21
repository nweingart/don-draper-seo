import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { CheckResult } from '../../types'

interface CompareBarProps {
  primaryChecks: CheckResult[]
  competitorChecks: CheckResult[]
  primaryLabel: string
  competitorLabel: string
}

export function CompareBar({ primaryChecks, competitorChecks, primaryLabel, competitorLabel }: CompareBarProps) {
  const count = (checks: CheckResult[], sev: string) => checks.filter((c) => c.severity === sev).length

  const data = [
    {
      name: 'Errors',
      [primaryLabel]: count(primaryChecks, 'error'),
      [competitorLabel]: count(competitorChecks, 'error'),
    },
    {
      name: 'Warnings',
      [primaryLabel]: count(primaryChecks, 'warning'),
      [competitorLabel]: count(competitorChecks, 'warning'),
    },
    {
      name: 'Info',
      [primaryLabel]: count(primaryChecks, 'info'),
      [competitorLabel]: count(competitorChecks, 'info'),
    },
  ]

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
          <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              fontSize: '0.8rem',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
          <Bar dataKey={primaryLabel} fill="var(--accent)" radius={[4, 4, 0, 0]} />
          <Bar dataKey={competitorLabel} fill="var(--yellow)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
