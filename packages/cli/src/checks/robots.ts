import type { Check, CheckResult } from '../types.js'

export const robotsCheck: Check = {
  name: 'robots',
  run(_$, _url, extras) {
    const results: CheckResult[] = []

    if (!extras.robotsTxt) {
      results.push({
        rule: 'robots-missing',
        severity: 'warning',
        message: 'robots.txt not found or not accessible',
        fix: 'Create a robots.txt file at the root of your domain to guide search engine crawlers',
      })
      return results
    }

    // Check if robots.txt blocks all crawlers
    const lines = extras.robotsTxt.toLowerCase().split('\n')
    let inWildcardAgent = false
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('user-agent:') && trimmed.includes('*')) {
        inWildcardAgent = true
      } else if (trimmed.startsWith('user-agent:')) {
        inWildcardAgent = false
      }
      if (inWildcardAgent && trimmed === 'disallow: /') {
        results.push({
          rule: 'robots-blocks-all',
          severity: 'error',
          message: 'robots.txt blocks all crawlers (Disallow: /)',
          fix: 'Remove "Disallow: /" under "User-agent: *" to allow search engines to crawl your site',
        })
        break
      }
    }

    return results
  },
}
