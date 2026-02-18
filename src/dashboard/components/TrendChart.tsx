import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ScanRecord } from '../../types'

interface TrendChartProps {
  scans: ScanRecord[]
}

export function TrendChart({ scans }: TrendChartProps) {
  const data = [...scans]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((s) => ({
      date: new Date(s.timestamp).toLocaleDateString(),
      score: s.score,
      perfScore: s.perfScore,
    }))

  if (data.length === 0) {
    return <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No scan history yet</div>
  }

  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
          <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text)',
              fontSize: '0.8rem',
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={{ fill: 'var(--accent)', r: 4 }}
            name="SEO Score"
          />
          {data.some((d) => d.perfScore !== null) && (
            <Line
              type="monotone"
              dataKey="perfScore"
              stroke="var(--green)"
              strokeWidth={2}
              dot={{ fill: 'var(--green)', r: 4 }}
              name="Perf Score"
              connectNulls
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
