import type { Check, CheckResult } from '../types.js'

export const sitemapCheck: Check = {
  name: 'sitemap',
  run(_$, _url, extras) {
    const results: CheckResult[] = []

    if (!extras.sitemapXml) {
      results.push({
        rule: 'sitemap-missing',
        severity: 'warning',
        message: 'sitemap.xml not found or not accessible',
        fix: 'Create a sitemap.xml at the root of your domain to help search engines discover all your pages',
      })
    }

    return results
  },
}
