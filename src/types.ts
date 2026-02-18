import type { CheerioAPI } from 'cheerio'

export type Severity = 'error' | 'warning' | 'info'

export interface CheckResult {
  rule: string
  severity: Severity
  message: string
  fix?: string
}

export type PerfRating = 'good' | 'needs-improvement' | 'poor'

export interface PerfMetric {
  name: string
  value: number
  unit: 'ms' | 'score'
  rating: PerfRating
  thresholds: { good: number; poor: number }
}

export interface PerfMetrics {
  lcp: PerfMetric
  cls: PerfMetric
  ttfb: PerfMetric
  fcp: PerfMetric
  loadTime: PerfMetric
  domContentLoaded: PerfMetric
  perfScore: number
}

export interface ScanResult {
  url: string
  score: number
  checks: CheckResult[]
  timestamp: string
  perf?: PerfMetrics
}

export interface CompareResult {
  primary: ScanResult
  competitor: ScanResult
  scoreDelta: number
  perfScoreDelta?: number
}

export interface FetchExtras {
  robotsTxt: string | null
  sitemapXml: string | null
}

export interface Check {
  name: string
  run: (html: CheerioAPI, url: string, extras: FetchExtras) => CheckResult[]
}

// Dashboard types

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
