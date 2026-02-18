import type { Check, CheckResult } from '../types.js'

export const linksCheck: Check = {
  name: 'links',
  run($, url) {
    const results: CheckResult[] = []
    const pageHost = new URL(url).hostname
    let emptyLinks = 0
    let unsafeExternalLinks = 0

    $('a').each((_, el) => {
      const href = $(el).attr('href')?.trim()

      // Empty or missing href
      if (!href || href === '#' || href === 'javascript:void(0)') {
        emptyLinks++
        return
      }

      // Check external links for rel="noopener"
      try {
        const linkUrl = new URL(href, url)
        if (linkUrl.hostname !== pageHost) {
          const rel = $(el).attr('rel') || ''
          if (!rel.includes('noopener')) {
            unsafeExternalLinks++
          }
        }
      } catch {
        // Ignore malformed URLs
      }
    })

    if (emptyLinks > 0) {
      results.push({
        rule: 'link-empty',
        severity: 'warning',
        message: `${emptyLinks} link${emptyLinks > 1 ? 's' : ''} with empty or placeholder href`,
        fix: 'Replace empty href values with valid URLs or use <button> for non-navigation actions',
      })
    }

    if (unsafeExternalLinks > 0) {
      results.push({
        rule: 'link-noopener',
        severity: 'info',
        message: `${unsafeExternalLinks} external link${unsafeExternalLinks > 1 ? 's' : ''} missing rel="noopener"`,
        fix: 'Add rel="noopener" (or rel="noopener noreferrer") to external links for security',
      })
    }

    return results
  },
}
