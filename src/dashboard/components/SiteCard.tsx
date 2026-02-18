import { ScoreGauge } from './ScoreGauge'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import type { ScanRecord, Site } from '../../types'

interface SiteCardProps {
  site: Site
  latest: ScanRecord | null
  history: ScanRecord[]
  delta: number | null
}

export function SiteCard({ site, latest, history, delta }: SiteCardProps) {
  const sparkData = [...history]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-10)
    .map((s) => ({ score: s.score }))

  const errors = latest?.checks.filter((c) => c.severity === 'error').length ?? 0
  const warnings = latest?.checks.filter((c) => c.severity === 'warning').length ?? 0

  const borderColor = latest
    ? latest.score >= 80 ? 'var(--green)' : latest.score >= 50 ? 'var(--yellow)' : 'var(--red)'
    : 'var(--border)'

  return (
    <div className="card" style={{
      borderTop: `3px solid ${borderColor}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{site.name || site.url}</div>
        {site.name && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{site.url}</div>
        )}
        {site.isCompetitor && (
          <span style={{
            fontSize: '0.65rem',
            padding: '0.125rem 0.375rem',
            background: 'var(--yellow)',
            color: '#000',
            borderRadius: '4px',
            marginTop: '0.25rem',
            display: 'inline-block',
          }}>
            Competitor
          </span>
        )}
      </div>

      {latest ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ScoreGauge score={latest.score} size={70} />
            <div>
              {delta !== null && (
                <div style={{
                  fontSize: '0.8rem',
                  color: delta > 0 ? 'var(--green)' : delta < 0 ? 'var(--red)' : 'var(--text-muted)',
                }}>
                  {delta > 0 ? '+' : ''}{delta} from last
                </div>
              )}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {errors} errors, {warnings} warnings
              </div>
            </div>
          </div>

          {sparkData.length >= 2 && (
            <div style={{ height: 40 }}>
              <ResponsiveContainer>
                <LineChart data={sparkData}>
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--accent)"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No scans yet</div>
      )}
    </div>
  )
}
