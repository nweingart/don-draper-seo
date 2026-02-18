import { load } from 'cheerio'
import { fetchPage } from './fetcher.js'
import { checks } from './checks/index.js'
import type { CheckResult, ScanResult } from './types.js'

export interface ScanOptions {
  perf?: boolean
}

function computeScore(results: CheckResult[]): number {
  let score = 100
  for (const result of results) {
    switch (result.severity) {
      case 'error':
        score -= 10
        break
      case 'warning':
        score -= 5
        break
      case 'info':
        score -= 2
        break
    }
  }
  return Math.max(0, Math.min(100, score))
}

export async function scan(url: string, options: ScanOptions = {}): Promise<ScanResult> {
  const { html, extras } = await fetchPage(url)
  const $ = load(html)

  const results: CheckResult[] = []
  for (const check of checks) {
    results.push(...check.run($, url, extras))
  }

  const result: ScanResult = {
    url,
    score: computeScore(results),
    checks: results,
    timestamp: new Date().toISOString(),
  }

  if (options.perf) {
    const { measurePerformance, perfToCheckResults } = await import('./perf.js')
    const perf = await measurePerformance(url)
    result.perf = perf

    const perfChecks = perfToCheckResults(perf)
    result.checks = [...results, ...perfChecks]
    result.score = computeScore(result.checks)
  }

  return result
}
