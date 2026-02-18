import type { Check, CheckResult } from '../types.js'

export const imagesCheck: Check = {
  name: 'images',
  run($) {
    const results: CheckResult[] = []
    let missingAlt = 0

    $('img').each((_, el) => {
      const alt = $(el).attr('alt')
      if (alt === undefined || alt === null) {
        missingAlt++
      }
    })

    if (missingAlt > 0) {
      results.push({
        rule: 'img-alt',
        severity: 'error',
        message: `${missingAlt} image${missingAlt > 1 ? 's' : ''} missing alt attribute`,
        fix: 'Add descriptive alt text to all <img> tags. Use alt="" for decorative images',
      })
    }

    return results
  },
}
