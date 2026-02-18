import type { Check, CheckResult } from '../types.js'

export const structuredDataCheck: Check = {
  name: 'structured-data',
  run($) {
    const results: CheckResult[] = []

    const jsonLdScripts = $('script[type="application/ld+json"]')

    if (jsonLdScripts.length === 0) {
      results.push({
        rule: 'structured-data-missing',
        severity: 'info',
        message: 'No JSON-LD structured data found',
        fix: 'Add <script type="application/ld+json"> with schema.org markup to enhance search result appearance',
      })
      return results
    }

    jsonLdScripts.each((i, el) => {
      const content = $(el).html()?.trim()
      if (!content) return

      try {
        JSON.parse(content)
      } catch {
        results.push({
          rule: 'structured-data-invalid',
          severity: 'error',
          message: `JSON-LD block #${i + 1} contains invalid JSON`,
          fix: 'Fix the JSON syntax in your structured data script tag',
        })
      }
    })

    return results
  },
}
