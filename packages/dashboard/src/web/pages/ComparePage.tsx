import { useState, useEffect } from 'react'
import { getSites, compareSites } from '../api'
import { ScoreGauge } from '../components/ScoreGauge'
import { CompareBar } from '../components/CompareBar'
import { CheckList } from '../components/CheckList'
import type { Site, CompareResult } from '../../types'

export function ComparePage() {
  const [sites, setSites] = useState<Site[]>([])
  const [siteId, setSiteId] = useState<number | ''>('')
  const [competitorId, setCompetitorId] = useState<number | ''>('')
  const [perf, setPerf] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<CompareResult | null>(null)

  useEffect(() => {
    getSites().then(setSites).catch(() => {})
  }, [])

  const handleCompare = async () => {
    if (!siteId || !competitorId) {
      setError('Select both sites')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await compareSites(siteId as number, competitorId as number, perf)
      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const primaryLabel = sites.find((s) => s.id === siteId)?.name || result?.primary.url || 'Your Site'
  const competitorLabel = sites.find((s) => s.id === competitorId)?.name || result?.competitor.url || 'Competitor'

  return (
    <div style={{ maxWidth: 900 }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Compare</h2>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'end' }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Your Site
            </label>
            <select className="select" style={{ width: '100%' }} value={siteId} onChange={(e) => setSiteId(Number(e.target.value))}>
              <option value="">Select...</option>
              {sites.filter((s) => !s.isCompetitor).map((s) => (
                <option key={s.id} value={s.id}>{s.name || s.url}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Competitor
            </label>
            <select className="select" style={{ width: '100%' }} value={competitorId} onChange={(e) => setCompetitorId(Number(e.target.value))}>
              <option value="">Select...</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>{s.name || s.url}</option>
              ))}
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
            <input type="checkbox" checked={perf} onChange={(e) => setPerf(e.target.checked)} />
            Performance
          </label>

          <button className="btn btn-primary" disabled={loading} onClick={handleCompare}>
            {loading ? 'Comparing...' : 'Compare'}
          </button>
        </div>
        {error && (
          <div style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: '0.75rem' }}>{error}</div>
        )}
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <ScoreGauge score={result.primary.score} size={140} label={primaryLabel} />
            <ScoreGauge score={result.competitor.score} size={140} label={competitorLabel} />
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: result.scoreDelta > 0 ? 'var(--green)' : result.scoreDelta < 0 ? 'var(--red)' : 'var(--text-muted)' }}>
              {result.scoreDelta > 0 ? '+' : ''}{result.scoreDelta} SEO score delta
            </span>
            {result.perfScoreDelta !== undefined && (
              <span style={{ marginLeft: '1.5rem', color: result.perfScoreDelta > 0 ? 'var(--green)' : result.perfScoreDelta < 0 ? 'var(--red)' : 'var(--text-muted)' }}>
                {result.perfScoreDelta > 0 ? '+' : ''}{result.perfScoreDelta} perf score delta
              </span>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Issue Comparison</h3>
            <div className="card">
              <CompareBar
                primaryChecks={result.primary.checks}
                competitorChecks={result.competitor.checks}
                primaryLabel={primaryLabel}
                competitorLabel={competitorLabel}
              />
            </div>
          </div>

          {result.primary.perf && result.competitor.perf && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Performance Comparison</h3>
              <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '0.5rem' }}>Metric</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem' }}>{primaryLabel}</th>
                      <th style={{ textAlign: 'right', padding: '0.5rem' }}>{competitorLabel}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(['lcp', 'cls', 'fcp', 'ttfb', 'loadTime', 'domContentLoaded'] as const).map((key) => {
                      const p = result.primary.perf![key]
                      const c = result.competitor.perf![key]
                      return (
                        <tr key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '0.5rem' }}>{p.name}</td>
                          <td style={{ textAlign: 'right', padding: '0.5rem', color: `var(--${p.rating === 'good' ? 'green' : p.rating === 'poor' ? 'red' : 'yellow'})` }}>
                            {p.unit === 'score' ? p.value : `${p.value}ms`}
                          </td>
                          <td style={{ textAlign: 'right', padding: '0.5rem', color: `var(--${c.rating === 'good' ? 'green' : c.rating === 'poor' ? 'red' : 'yellow'})` }}>
                            {c.unit === 'score' ? c.value : `${c.value}ms`}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                {primaryLabel} Issues
              </h3>
              <CheckList checks={result.primary.checks} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                {competitorLabel} Issues
              </h3>
              <CheckList checks={result.competitor.checks} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
