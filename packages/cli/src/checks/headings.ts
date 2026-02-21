import type { Check, CheckResult } from '../types.js'

export const headingsCheck: Check = {
  name: 'headings',
  run($) {
    const results: CheckResult[] = []

    // Check for exactly one h1
    const h1Count = $('h1').length
    if (h1Count === 0) {
      results.push({
        rule: 'heading-h1-missing',
        severity: 'error',
        message: 'No <h1> tag found on the page',
        fix: 'Add exactly one <h1> tag with the primary page heading',
      })
    } else if (h1Count > 1) {
      results.push({
        rule: 'heading-h1-multiple',
        severity: 'warning',
        message: `Found ${h1Count} <h1> tags (should be exactly 1)`,
        fix: 'Use a single <h1> for the main page heading; use <h2>-<h6> for subsections',
      })
    }

    // Check for skipped heading levels
    const headings: number[] = []
    $('h1, h2, h3, h4, h5, h6').each((_, el) => {
      const tag = $(el).prop('tagName')?.toLowerCase()
      if (tag) {
        headings.push(parseInt(tag.charAt(1), 10))
      }
    })

    for (let i = 1; i < headings.length; i++) {
      const current = headings[i]
      const previous = headings[i - 1]
      if (current > previous + 1) {
        results.push({
          rule: 'heading-skip-level',
          severity: 'warning',
          message: `Heading level skipped: <h${previous}> → <h${current}>`,
          fix: `Don't skip heading levels. Use <h${previous + 1}> before <h${current}>`,
        })
        break // Report only the first skip to avoid noise
      }
    }

    return results
  },
}
