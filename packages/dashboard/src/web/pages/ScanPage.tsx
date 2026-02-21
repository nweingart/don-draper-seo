import { useState, useEffect } from 'react'
import { getSites, triggerScan, getScanHistory } from '../api'
import { ScoreGauge } from '../components/ScoreGauge'
import { CheckList } from '../components/CheckList'
import { PerfMetrics } from '../components/PerfMetrics'
import { TrendChart } from '../components/TrendChart'
import type { Site, ScanRecord } from '../../types'

export function ScanPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [selectedSiteId, setSelectedSiteId] = useState<number | ''>('')
  const [urlInput, setUrlInput] = useState('')
  const [perf, setPerf] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<ScanRecord | null>(null)
  const [history, setHistory] = useState<ScanRecord[]>([])

  useEffect(() => {
    getSites().then(setSites).catch(() => {})
  }, [])

  const handleScan = async () => {
    setError('')
    setScanning(true)
    try {
      let siteId = selectedSiteId as number
      if (!siteId && urlInput) {
        // Use the URL input — find matching site or show error
        const match = sites.find((s) => s.url === urlInput)
        if (!match) {
          setError('Add this site in Settings first, or select an existing site')
          setScanning(false)
          return
        }
        siteId = match.id
      }
      if (!siteId) {
        setError('Select a site or enter a URL')
        setScanning(false)
        return
      }

      const record = await triggerScan(siteId, perf)
      setResult(record)

      const hist = await getScanHistory(siteId)
      setHistory(hist)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setScanning(false)
    }
  }

  const handleSiteChange = async (id: number) => {
    setSelectedSiteId(id)
    setUrlInput('')
    if (id) {
      try {
        const hist = await getScanHistory(id)
        setHistory(hist)
        if (hist.length > 0) setResult(hist[0])
      } catch {}
    }
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Scan</h2>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'end' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
              Site
            </label>
            <select
              className="select"
              style={{ width: '100%' }}
              value={selectedSiteId}
              onChange={(e) => handleSiteChange(Number(e.target.value))}
            >
              <option value="">Select a site...</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>{s.name || s.url}</option>
              ))}
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
            <input type="checkbox" checked={perf} onChange={(e) => setPerf(e.target.checked)} />
            Performance
          </label>

          <button className="btn btn-primary" disabled={scanning} onClick={handleScan}>
            {scanning ? 'Scanning...' : 'Scan'}
          </button>
        </div>
        {error && (
          <div style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: '0.75rem' }}>{error}</div>
        )}
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'start', flexWrap: 'wrap' }}>
            <ScoreGauge score={result.score} size={140} label="SEO Score" />
            {result.perf && (
              <ScoreGauge score={result.perfScore ?? result.perf.perfScore} size={140} label="Perf Score" />
            )}
          </div>

          {result.perf && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Performance</h3>
              <PerfMetrics perf={result.perf} />
            </div>
          )}

          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Issues</h3>
            <CheckList checks={result.checks} />
          </div>

          {history.length > 1 && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Trend</h3>
              <div className="card">
                <TrendChart scans={history} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
