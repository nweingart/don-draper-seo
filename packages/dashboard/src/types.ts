import type { CheckResult, PerfMetrics } from 'don-draper-seo'

// Re-export scanner types for convenience
export type { CheckResult, Severity, PerfMetrics, PerfMetric, PerfRating, CompareResult } from 'don-draper-seo'

export interface Site {
  id: number
  url: string
  name: string | null
  isCompetitor: boolean
  createdAt: string
}

export interface ScanRecord {
  id: number
  siteId: number
  url: string
  score: number
  perfScore: number | null
  checks: CheckResult[]
  perf: PerfMetrics | null
  timestamp: string
  createdAt: string
}

export interface FleetOverview {
  site: Site
  latest: ScanRecord | null
  previous: ScanRecord | null
  delta: number | null
}
