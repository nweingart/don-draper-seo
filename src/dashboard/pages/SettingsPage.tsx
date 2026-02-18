import { useState, useEffect } from 'react'
import { getSites, addSite, deleteSite } from '../api'
import type { Site } from '../../types'

export function SettingsPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [isCompetitor, setIsCompetitor] = useState(false)
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)

  const load = () => getSites().then(setSites).catch(() => {})

  useEffect(() => {
    load()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    setError('')
    setAdding(true)
    try {
      let finalUrl = url
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = `https://${finalUrl}`
      }
      await addSite(finalUrl, name || undefined, isCompetitor)
      setUrl('')
      setName('')
      setIsCompetitor(false)
      await load()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: number) => {
    await deleteSite(id)
    await load()
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Settings</h2>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Add Site</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              className="input"
              style={{ flex: 2, minWidth: 200 }}
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <input
              className="input"
              style={{ flex: 1, minWidth: 120 }}
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
              <input type="checkbox" checked={isCompetitor} onChange={(e) => setIsCompetitor(e.target.checked)} />
              Competitor
            </label>
            <button className="btn btn-primary" type="submit" disabled={adding}>
              {adding ? 'Adding...' : 'Add Site'}
            </button>
          </div>
          {error && (
            <div style={{ color: 'var(--red)', fontSize: '0.8rem' }}>{error}</div>
          )}
        </form>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Sites</h3>
        {sites.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No sites added yet</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>URL</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Name</th>
                <th style={{ textAlign: 'center', padding: '0.5rem' }}>Competitor</th>
                <th style={{ textAlign: 'right', padding: '0.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{site.url}</td>
                  <td style={{ padding: '0.5rem' }}>{site.name || '—'}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                    {site.isCompetitor ? (
                      <span style={{ color: 'var(--yellow)' }}>Yes</span>
                    ) : '—'}
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                    <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleDelete(site.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
