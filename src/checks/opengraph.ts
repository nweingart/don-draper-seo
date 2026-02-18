import type { Check, CheckResult } from '../types.js'

const requiredOgTags = [
  { property: 'og:title', label: 'Open Graph title' },
  { property: 'og:description', label: 'Open Graph description' },
  { property: 'og:image', label: 'Open Graph image' },
  { property: 'og:url', label: 'Open Graph URL' },
  { property: 'og:type', label: 'Open Graph type' },
]

export const opengraphCheck: Check = {
  name: 'opengraph',
  run($) {
    const results: CheckResult[] = []

    for (const tag of requiredOgTags) {
      const content = $(`meta[property="${tag.property}"]`).attr('content')?.trim()
      if (!content) {
        results.push({
          rule: `og-${tag.property.replace('og:', '')}`,
          severity: 'warning',
          message: `Missing ${tag.label} (${tag.property})`,
          fix: `Add <meta property="${tag.property}" content="..."> for better social media sharing`,
        })
      }
    }

    return results
  },
}
