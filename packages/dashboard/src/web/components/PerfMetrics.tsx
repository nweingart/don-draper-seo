import type { PerfMetrics as PerfMetricsType } from '../../types'

interface PerfMetricsProps {
  perf: PerfMetricsType
}

const RATING_COLORS = {
  good: 'var(--green)',
  'needs-improvement': 'var(--yellow)',
  poor: 'var(--red)',
}

export function PerfMetrics({ perf }: PerfMetricsProps) {
  const metrics = [perf.lcp, perf.cls, perf.fcp, perf.ttfb, perf.loadTime, perf.domContentLoaded]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '0.75rem',
    }}>
      {metrics.map((m) => (
        <div key={m.name} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            {m.name}
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: RATING_COLORS[m.rating],
          }}>
            {m.unit === 'score' ? m.value : `${m.value}ms`}
          </div>
          <div style={{
            marginTop: '0.25rem',
            fontSize: '0.7rem',
            color: RATING_COLORS[m.rating],
            textTransform: 'capitalize',
          }}>
            {m.rating.replace('-', ' ')}
          </div>
        </div>
      ))}
    </div>
  )
}
