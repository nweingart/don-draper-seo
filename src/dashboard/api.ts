import type { Site, ScanRecord, CompareResult } from '../types'

const BASE = '/api'

async function json<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

// Sites
export const getSites = () => json<Site[]>('/sites')
export const addSite = (url: string, name?: string, isCompetitor?: boolean) =>
  json<Site>('/sites', {
    method: 'POST',
    body: JSON.stringify({ url, name, isCompetitor }),
  })
export const deleteSite = (id: number) =>
  json<{ ok: boolean }>(`/sites/${id}`, { method: 'DELETE' })

// Scans
export const triggerScan = (siteId: number, perf?: boolean) =>
  json<ScanRecord>('/scans', {
    method: 'POST',
    body: JSON.stringify({ siteId, perf }),
  })
export const batchScan = (siteIds: number[], perf?: boolean) =>
  json<ScanRecord[]>('/scans/batch', {
    method: 'POST',
    body: JSON.stringify({ siteIds, perf }),
  })
export const getScanHistory = (siteId: number, limit = 50) =>
  json<ScanRecord[]>(`/scans?siteId=${siteId}&limit=${limit}`)
export const getLatestScans = () => json<ScanRecord[]>('/scans/latest')
export const getScan = (id: number) => json<ScanRecord>(`/scans/${id}`)

// Compare
export const compareSites = (siteId: number, competitorId: number, perf?: boolean) =>
  json<CompareResult>('/compare', {
    method: 'POST',
    body: JSON.stringify({ siteId, competitorId, perf }),
  })
