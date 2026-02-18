import { Command } from 'commander'
import ora from 'ora'
import chalk from 'chalk'
import { scan } from './scanner.js'
import { formatReport } from './reporter.js'
import { formatCompareReport } from './compare-reporter.js'
import type { CompareResult } from './types.js'

function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`
  }
  return url
}

function validateUrl(url: string): void {
  try {
    new URL(url)
  } catch {
    console.error(chalk.red(`Invalid URL: ${url}`))
    process.exit(1)
  }
}

const program = new Command()

program
  .name('don-draper-seo')
  .description('Scan any website for common SEO issues')
  .version('1.0.0')

program
  .command('scan', { isDefault: true })
  .description('Scan a website for SEO issues')
  .argument('<url>', 'URL to scan')
  .option('--json', 'Output results as JSON')
  .option('--verbose', 'Show info-level messages')
  .option('--perf', 'Measure Core Web Vitals via headless Chromium')
  .action(async (url: string, options: { json?: boolean; verbose?: boolean; perf?: boolean }) => {
    url = normalizeUrl(url)
    validateUrl(url)

    const label = options.perf ? `Scanning ${url} (with performance)` : `Scanning ${url}`
    const spinner = ora(label).start()

    try {
      const result = await scan(url, { perf: options.perf })
      spinner.stop()

      if (options.json) {
        console.log(JSON.stringify(result, null, 2))
      } else {
        console.log(formatReport(result, options.verbose ?? false))
      }

      // Exit with code 1 if there are errors
      if (result.checks.some((c) => c.severity === 'error')) {
        process.exit(1)
      }
    } catch (err) {
      spinner.fail(`Failed to scan ${url}`)
      console.error(chalk.red(err instanceof Error ? err.message : String(err)))
      process.exit(1)
    }
  })

program
  .command('compare')
  .description('Compare SEO of two websites head-to-head')
  .argument('<your-url>', 'Your website URL')
  .argument('<competitor-url>', 'Competitor website URL')
  .option('--json', 'Output results as JSON')
  .option('--verbose', 'Show info-level messages')
  .option('--perf', 'Measure Core Web Vitals via headless Chromium')
  .action(async (yourUrl: string, competitorUrl: string, options: { json?: boolean; verbose?: boolean; perf?: boolean }) => {
    yourUrl = normalizeUrl(yourUrl)
    competitorUrl = normalizeUrl(competitorUrl)
    validateUrl(yourUrl)
    validateUrl(competitorUrl)

    const spinner = ora(`Comparing ${yourUrl} vs ${competitorUrl}`).start()

    try {
      const [primary, competitor] = await Promise.all([
        scan(yourUrl, { perf: options.perf }),
        scan(competitorUrl, { perf: options.perf }),
      ])

      spinner.stop()

      const compareResult: CompareResult = {
        primary,
        competitor,
        scoreDelta: primary.score - competitor.score,
      }

      if (primary.perf && competitor.perf) {
        compareResult.perfScoreDelta = primary.perf.perfScore - competitor.perf.perfScore
      }

      if (options.json) {
        console.log(JSON.stringify(compareResult, null, 2))
      } else {
        console.log(formatCompareReport(compareResult))
      }
    } catch (err) {
      spinner.fail('Comparison failed')
      console.error(chalk.red(err instanceof Error ? err.message : String(err)))
      process.exit(1)
    }
  })

program
  .command('dashboard')
  .description('Launch the web dashboard')
  .option('--port <port>', 'Port number', '3749')
  .option('--no-open', "Don't open browser automatically")
  .action(async (options: { port: string; open: boolean }) => {
    const port = parseInt(options.port)
    const { startServer } = await import('./server/index.js')
    await startServer(port)

    if (options.open) {
      const url = `http://localhost:${port}`
      const { exec } = await import('child_process')
      const cmd = process.platform === 'darwin' ? 'open' :
                  process.platform === 'win32' ? 'start' : 'xdg-open'
      exec(`${cmd} ${url}`)
    }

    // Keep process alive
    process.on('SIGINT', () => process.exit(0))
  })

program.parse()
