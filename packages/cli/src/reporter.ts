import chalk from 'chalk'
import type { ScanResult, CheckResult, Severity, PerfMetric, PerfRating } from './types.js'

function severityIcon(severity: Severity): string {
  switch (severity) {
    case 'error':
      return chalk.red('✖')
    case 'warning':
      return chalk.yellow('⚠')
    case 'info':
      return chalk.blue('ℹ')
  }
}

function severityLabel(severity: Severity): string {
  switch (severity) {
    case 'error':
      return chalk.red('ERROR')
    case 'warning':
      return chalk.yellow('WARN ')
    case 'info':
      return chalk.blue('INFO ')
  }
}

function scoreColor(score: number): (text: string) => string {
  if (score >= 80) return chalk.green
  if (score >= 50) return chalk.yellow
  return chalk.red
}

function ratingDot(rating: PerfRating): string {
  switch (rating) {
    case 'good':
      return chalk.green('●')
    case 'needs-improvement':
      return chalk.yellow('●')
    case 'poor':
      return chalk.red('●')
  }
}

function ratingLabel(rating: PerfRating): string {
  switch (rating) {
    case 'good':
      return chalk.green('Good')
    case 'needs-improvement':
      return chalk.yellow('Needs Improvement')
    case 'poor':
      return chalk.red('Poor')
  }
}

function groupBySeverity(checks: CheckResult[]): Record<Severity, CheckResult[]> {
  const grouped: Record<Severity, CheckResult[]> = {
    error: [],
    warning: [],
    info: [],
  }
  for (const check of checks) {
    grouped[check.severity].push(check)
  }
  return grouped
}

export function formatReport(result: ScanResult, verbose: boolean): string {
  const lines: string[] = []

  lines.push('')
  lines.push(chalk.bold(`  SEO Report for ${chalk.underline(result.url)}`))
  lines.push(chalk.dim(`  Scanned at ${result.timestamp}`))
  lines.push('')

  // Score
  const colorFn = scoreColor(result.score)
  lines.push(colorFn(`  Score: ${result.score}/100`))
  lines.push('')

  // Performance section
  if (result.perf) {
    const perfColor = scoreColor(result.perf.perfScore)
    lines.push(perfColor(`  Performance Score: ${result.perf.perfScore}/100`))
    lines.push('')

    const perfMetrics: PerfMetric[] = [
      result.perf.lcp,
      result.perf.fcp,
      result.perf.ttfb,
      result.perf.cls,
      result.perf.loadTime,
      result.perf.domContentLoaded,
    ]

    for (const metric of perfMetrics) {
      const dot = ratingDot(metric.rating)
      const value = metric.unit === 'score' ? metric.value.toFixed(3) : `${metric.value}ms`
      const label = ratingLabel(metric.rating)
      lines.push(`  ${dot} ${metric.name.padEnd(32)}${value.padStart(8)}  ${label}`)
    }
    lines.push('')
  }

  const grouped = groupBySeverity(result.checks)

  // Filter out info unless verbose
  const severities: Severity[] = verbose
    ? ['error', 'warning', 'info']
    : ['error', 'warning']

  let issuesPrinted = 0

  for (const severity of severities) {
    const items = grouped[severity]
    if (items.length === 0) continue

    lines.push(chalk.dim(`  ── ${severity.toUpperCase()}S (${ items.length}) ──`))
    lines.push('')

    for (const item of items) {
      lines.push(`  ${severityIcon(item.severity)} ${severityLabel(item.severity)} ${chalk.dim(`[${item.rule}]`)} ${item.message}`)
      if (item.fix) {
        lines.push(`    ${chalk.dim('→')} ${chalk.dim(item.fix)}`)
      }
      issuesPrinted++
    }
    lines.push('')
  }

  if (issuesPrinted === 0) {
    lines.push(chalk.green('  No issues found! Your SEO looks great.'))
    lines.push('')
  }

  // Summary
  const errorCount = grouped.error.length
  const warnCount = grouped.warning.length
  const infoCount = grouped.info.length

  const parts: string[] = []
  if (errorCount > 0) parts.push(chalk.red(`${errorCount} error${errorCount > 1 ? 's' : ''}`))
  if (warnCount > 0) parts.push(chalk.yellow(`${warnCount} warning${warnCount > 1 ? 's' : ''}`))
  if (infoCount > 0) parts.push(chalk.blue(`${infoCount} info`))

  if (parts.length > 0) {
    lines.push(chalk.dim(`  Summary: ${parts.join(', ')}`))
    if (!verbose && infoCount > 0) {
      lines.push(chalk.dim(`  Run with --verbose to see ${infoCount} info-level message${infoCount > 1 ? 's' : ''}`))
    }
  }
  lines.push('')

  return lines.join('\n')
}
