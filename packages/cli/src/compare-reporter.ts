import chalk from 'chalk'
import type { CompareResult, PerfMetric, PerfRating } from './types.js'

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

function winner(delta: number, higherIsBetter: boolean): string {
  const effective = higherIsBetter ? delta : -delta
  if (effective > 0) return chalk.green('YOU WIN')
  if (effective < 0) return chalk.red('COMPETITOR WINS')
  return chalk.dim('TIE')
}

function formatDelta(delta: number): string {
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta}`
}

function formatMetricValue(metric: PerfMetric): string {
  if (metric.unit === 'score') return metric.value.toFixed(3)
  return `${metric.value}ms`
}

export function formatCompareReport(result: CompareResult): string {
  const lines: string[] = []
  const { primary, competitor } = result

  lines.push('')
  lines.push(chalk.bold('  Head-to-Head SEO Comparison'))
  lines.push(chalk.dim('  ' + '─'.repeat(45)))
  lines.push('')
  lines.push(`  ${chalk.dim('You:')}         ${chalk.underline(primary.url)}`)
  lines.push(`  ${chalk.dim('Competitor:')}  ${chalk.underline(competitor.url)}`)
  lines.push('')

  // Score comparison (higher is better)
  const scoreDelta = result.scoreDelta
  lines.push(
    `  ${chalk.dim('SEO Score:')}   ${primary.score} vs ${competitor.score}  ` +
    `${formatDelta(scoreDelta)}  ${winner(scoreDelta, true)}`
  )

  // Perf score comparison (higher is better)
  if (primary.perf && competitor.perf && result.perfScoreDelta !== undefined) {
    lines.push(
      `  ${chalk.dim('Perf Score:')}  ${primary.perf.perfScore} vs ${competitor.perf.perfScore}  ` +
      `${formatDelta(result.perfScoreDelta)}  ${winner(result.perfScoreDelta, true)}`
    )
  }

  lines.push('')

  // Issue counts
  lines.push(chalk.dim('  ── ISSUE COUNTS ──'))
  lines.push('')

  const pErrors = primary.checks.filter(c => c.severity === 'error').length
  const cErrors = competitor.checks.filter(c => c.severity === 'error').length
  const errorDelta = cErrors - pErrors // positive means you have fewer (good)
  lines.push(
    `  ${chalk.dim('Errors:')}     ${pErrors} vs ${cErrors}  ` +
    `${formatDelta(errorDelta)}  ${winner(errorDelta, true)}`
  )

  const pWarnings = primary.checks.filter(c => c.severity === 'warning').length
  const cWarnings = competitor.checks.filter(c => c.severity === 'warning').length
  const warnDelta = cWarnings - pWarnings
  lines.push(
    `  ${chalk.dim('Warnings:')}   ${pWarnings} vs ${cWarnings}  ` +
    `${formatDelta(warnDelta)}  ${winner(warnDelta, true)}`
  )

  lines.push('')

  // Performance metrics comparison
  if (primary.perf && competitor.perf) {
    lines.push(chalk.dim('  ── PERFORMANCE METRICS ──'))
    lines.push('')

    const metricKeys = ['lcp', 'fcp', 'ttfb', 'cls', 'loadTime', 'domContentLoaded'] as const
    for (const key of metricKeys) {
      const pm = primary.perf[key]
      const cm = competitor.perf[key]
      const delta = pm.value - cm.value // positive means yours is higher (worse for these metrics)
      const winLabel = winner(delta, false) // lower is better for these metrics
      lines.push(
        `  ${ratingDot(pm.rating)} ${pm.name.padEnd(28)} ` +
        `${formatMetricValue(pm).padStart(8)} vs ${formatMetricValue(cm).padStart(8)}  ${winLabel}`
      )
    }
    lines.push('')
  }

  // Unique issues
  const primaryMessages = new Set(primary.checks.map(c => c.message))
  const competitorMessages = new Set(competitor.checks.map(c => c.message))

  const onlyYou = primary.checks.filter(c => !competitorMessages.has(c.message))
  const onlyCompetitor = competitor.checks.filter(c => !primaryMessages.has(c.message))

  if (onlyYou.length > 0) {
    lines.push(chalk.dim('  ── ISSUES ONLY ON YOUR SITE ──'))
    lines.push('')
    for (const issue of onlyYou) {
      const icon = issue.severity === 'error' ? chalk.red('✖') : chalk.yellow('⚠')
      lines.push(`  ${icon} ${issue.message}`)
    }
    lines.push('')
  }

  if (onlyCompetitor.length > 0) {
    lines.push(chalk.dim('  ── ISSUES ONLY ON COMPETITOR ──'))
    lines.push('')
    for (const issue of onlyCompetitor) {
      const icon = issue.severity === 'error' ? chalk.red('✖') : chalk.yellow('⚠')
      lines.push(`  ${icon} ${issue.message}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}
