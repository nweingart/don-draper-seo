export { scan } from './scanner.js'
export type { ScanOptions } from './scanner.js'
export { fetchPage } from './fetcher.js'
export type { FetchResult } from './fetcher.js'
export { measurePerformance, perfToCheckResults } from './perf.js'
export { checks } from './checks/index.js'
export type {
  ScanResult,
  CheckResult,
  Severity,
  PerfMetrics,
  PerfMetric,
  PerfRating,
  CompareResult,
  Check,
  FetchExtras,
} from './types.js'
