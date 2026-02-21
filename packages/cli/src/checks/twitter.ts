import type { Check, CheckResult } from '../types.js'

const requiredTwitterTags = [
  { name: 'twitter:card', label: 'Twitter card type' },
  { name: 'twitter:title', label: 'Twitter title' },
  { name: 'twitter:description', label: 'Twitter description' },
  { name: 'twitter:image', label: 'Twitter image' },
]

export const twitterCheck: Check = {
  name: 'twitter',
  run($) {
    const results: CheckResult[] = []

    for (const tag of requiredTwitterTags) {
      const content =
        $(`meta[name="${tag.name}"]`).attr('content')?.trim() ||
        $(`meta[property="${tag.name}"]`).attr('content')?.trim()
      if (!content) {
        results.push({
          rule: `twitter-${tag.name.replace('twitter:', '')}`,
          severity: 'warning',
          message: `Missing ${tag.label} (${tag.name})`,
          fix: `Add <meta name="${tag.name}" content="..."> for better Twitter/X card previews`,
        })
      }
    }

    return results
  },
}
