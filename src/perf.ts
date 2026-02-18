import type { PerfMetric, PerfMetrics, PerfRating, CheckResult } from './types.js'

const THRESHOLDS = {
  lcp: { good: 2500, poor: 4000 },
  cls: { good: 0.1, poor: 0.25 },
  fcp: { good: 1800, poor: 3000 },
  ttfb: { good: 800, poor: 1800 },
  loadTime: { good: 3000, poor: 6000 },
  domContentLoaded: { good: 1500, poor: 3500 },
} as const

function rate(value: number, thresholds: { good: number; poor: number }): PerfRating {
  if (value <= thresholds.good) return 'good'
  if (value <= thresholds.poor) return 'needs-improvement'
  return 'poor'
}

function computePerfScore(metrics: Omit<PerfMetrics, 'perfScore'>): number {
  const weights = {
    lcp: 0.25,
    cls: 0.25,
    loadTime: 0.20,
    fcp: 0.10,
    ttfb: 0.10,
    domContentLoaded: 0.10,
  }

  let score = 0
  for (const [key, weight] of Object.entries(weights)) {
    const metric = metrics[key as keyof typeof weights]
    const { value, thresholds } = metric
    // Normalize: good threshold = 100, poor threshold = 0, linear interpolation
    const range = thresholds.poor - thresholds.good
    const clamped = Math.max(0, Math.min(range, thresholds.poor - value))
    const normalized = (clamped / range) * 100
    score += normalized * weight
  }

  return Math.round(Math.max(0, Math.min(100, score)))
}

export async function measurePerformance(url: string): Promise<PerfMetrics> {
  let playwright
  try {
    playwright = await import('playwright')
  } catch {
    throw new Error(
      'Playwright is required for --perf. Install it with:\n' +
      '  npm install playwright\n' +
      '  npx playwright install chromium'
    )
  }

  const browser = await playwright.chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()

    // Inject performance observers BEFORE navigation
    await page.evaluateOnNewDocument(() => {
      ;(window as any).__perfMetrics = { lcp: 0, cls: 0, fcp: 0 }

      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const last = entries[entries.length - 1]
        if (last) (window as any).__perfMetrics.lcp = last.startTime
      }).observe({ type: 'largest-contentful-paint', buffered: true })

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            ;(window as any).__perfMetrics.cls += (entry as any).value
          }
        }
      }).observe({ type: 'layout-shift', buffered: true })

      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const first = entries[0]
        if (first) (window as any).__perfMetrics.fcp = first.startTime
      }).observe({ type: 'paint', buffered: true })
    })

    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

    // Wait for CLS to settle
    await page.waitForTimeout(2000)

    // Gather metrics
    const rawMetrics = await page.evaluate(() => {
      const perf = (window as any).__perfMetrics
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

      return {
        lcp: perf.lcp as number,
        cls: perf.cls as number,
        fcp: perf.fcp as number,
        ttfb: nav ? nav.responseStart - nav.requestStart : 0,
        loadTime: nav ? nav.loadEventEnd - nav.startTime : 0,
        domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.startTime : 0,
      }
    })

    const lcp: PerfMetric = {
      name: 'Largest Contentful Paint',
      value: Math.round(rawMetrics.lcp),
      unit: 'ms',
      rating: rate(rawMetrics.lcp, THRESHOLDS.lcp),
      thresholds: THRESHOLDS.lcp,
    }

    const cls: PerfMetric = {
      name: 'Cumulative Layout Shift',
      value: Math.round(rawMetrics.cls * 1000) / 1000,
      unit: 'score',
      rating: rate(rawMetrics.cls, THRESHOLDS.cls),
      thresholds: THRESHOLDS.cls,
    }

    const fcp: PerfMetric = {
      name: 'First Contentful Paint',
      value: Math.round(rawMetrics.fcp),
      unit: 'ms',
      rating: rate(rawMetrics.fcp, THRESHOLDS.fcp),
      thresholds: THRESHOLDS.fcp,
    }

    const ttfb: PerfMetric = {
      name: 'Time to First Byte',
      value: Math.round(rawMetrics.ttfb),
      unit: 'ms',
      rating: rate(rawMetrics.ttfb, THRESHOLDS.ttfb),
      thresholds: THRESHOLDS.ttfb,
    }

    const loadTime: PerfMetric = {
      name: 'Total Page Load',
      value: Math.round(rawMetrics.loadTime),
      unit: 'ms',
      rating: rate(rawMetrics.loadTime, THRESHOLDS.loadTime),
      thresholds: THRESHOLDS.loadTime,
    }

    const domContentLoaded: PerfMetric = {
      name: 'DOM Content Loaded',
      value: Math.round(rawMetrics.domContentLoaded),
      unit: 'ms',
      rating: rate(rawMetrics.domContentLoaded, THRESHOLDS.domContentLoaded),
      thresholds: THRESHOLDS.domContentLoaded,
    }

    const metrics = { lcp, cls, ttfb, fcp, loadTime, domContentLoaded }

    return {
      ...metrics,
      perfScore: computePerfScore(metrics),
    }
  } finally {
    await browser.close()
  }
}

export function perfToCheckResults(metrics: PerfMetrics): CheckResult[] {
  const results: CheckResult[] = []
  const allMetrics: PerfMetric[] = [
    metrics.lcp,
    metrics.cls,
    metrics.fcp,
    metrics.ttfb,
    metrics.loadTime,
    metrics.domContentLoaded,
  ]

  for (const metric of allMetrics) {
    if (metric.rating === 'poor') {
      results.push({
        rule: 'perf',
        severity: 'error',
        message: `${metric.name} is poor (${formatMetricValue(metric)})`,
        fix: `Aim for under ${metric.thresholds.good}${metric.unit === 'ms' ? 'ms' : ''}`,
      })
    } else if (metric.rating === 'needs-improvement') {
      results.push({
        rule: 'perf',
        severity: 'warning',
        message: `${metric.name} needs improvement (${formatMetricValue(metric)})`,
        fix: `Aim for under ${metric.thresholds.good}${metric.unit === 'ms' ? 'ms' : ''}`,
      })
    }
  }

  return results
}

function formatMetricValue(metric: PerfMetric): string {
  if (metric.unit === 'score') return String(metric.value)
  return `${metric.value}ms`
}
