import { useState, useEffect } from 'react'
import { getSites, getLatestScans, getScanHistory, batchScan } from '../api'
import { SiteCard } from '../components/SiteCard'
import type { Site, ScanRecord } from '../../types'

export function FleetPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [latestMap, setLatestMap] = useState<Record<number, ScanRecord>>({})
  const [historyMap, setHistoryMap] = useState<Record<number, ScanRecord[]>>({})
  const [previousMap, setPreviousMap] = useState<Record<number, ScanRecord | undefined>>({})
  const [scanning, setScanning] = useState(false)

  const load = async () => {
    const [allSites, latestScans] = await Promise.all([getSites(), getLatestScans()])
    setSites(allSites)

    const latest: Record<number, ScanRecord> = {}
    for (const s of latestScans) {
      latest[s.siteId] = s
    }
    setLatestMap(latest)

    // Load history for sparklines and deltas
    const histories: Record<number, ScanRecord[]> = {}
    const prevs: Record<number, ScanRecord | undefined> = {}
    await Promise.all(
      allSites.map(async (site) => {
        try {
          const hist = await getScanHistory(site.id, 10)
          histories[site.id] = hist
          prevs[site.id] = hist.length >= 2 ? hist[1] : undefined
        } catch {
          histories[site.id] = []
        }
      })
    )
    setHistoryMap(histories)
    setPreviousMap(prevs)
  }

  useEffect(() => {
    load()
  }, [])

  const handleScanAll = async () => {
    setScanning(true)
    try {
      await batchScan(sites.map((s) => s.id))
      await load()
    } catch {
    } finally {
      setScanning(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Fleet Overview</h2>
        <button className="btn btn-primary" disabled={scanning || sites.length === 0} onClick={handleScanAll}>
          {scanning ? 'Scanning...' : 'Scan All'}
        </button>
      </div>

      {sites.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No sites added yet. Go to Settings to add sites.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {sites.map((site) => {
            const latest = latestMap[site.id] ?? null
            const prev = previousMap[site.id]
            const delta = latest && prev ? latest.score - prev.score : null
            return (
              <SiteCard
                key={site.id}
                site={site}
                latest={latest}
                history={historyMap[site.id] ?? []}
                delta={delta}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
