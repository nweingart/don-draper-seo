import type { Check, CheckResult } from '../types.js'

export const metaCheck: Check = {
  name: 'meta',
  run($) {
    const results: CheckResult[] = []

    // Title
    const title = $('title').text().trim()
    if (!title) {
      results.push({
        rule: 'meta-title',
        severity: 'error',
        message: 'Missing <title> tag',
        fix: 'Add a <title> tag inside <head> with a descriptive page title (50-60 characters)',
      })
    } else if (title.length < 30) {
      results.push({
        rule: 'meta-title-length',
        severity: 'warning',
        message: `Title is too short (${title.length} chars): "${title}"`,
        fix: 'Expand your title to 50-60 characters for optimal display in search results',
      })
    } else if (title.length > 60) {
      results.push({
        rule: 'meta-title-length',
        severity: 'warning',
        message: `Title is too long (${title.length} chars): "${title.slice(0, 60)}..."`,
        fix: 'Shorten your title to 50-60 characters to avoid truncation in search results',
      })
    }

    // Meta description
    const description = $('meta[name="description"]').attr('content')?.trim()
    if (!description) {
      results.push({
        rule: 'meta-description',
        severity: 'error',
        message: 'Missing <meta name="description"> tag',
        fix: 'Add <meta name="description" content="..."> with a compelling summary (150-160 characters)',
      })
    } else if (description.length < 70) {
      results.push({
        rule: 'meta-description-length',
        severity: 'warning',
        message: `Meta description is too short (${description.length} chars)`,
        fix: 'Expand your meta description to 150-160 characters for better search result snippets',
      })
    } else if (description.length > 160) {
      results.push({
        rule: 'meta-description-length',
        severity: 'warning',
        message: `Meta description is too long (${description.length} chars)`,
        fix: 'Shorten your meta description to 150-160 characters to avoid truncation',
      })
    }

    // Viewport
    const viewport = $('meta[name="viewport"]').attr('content')
    if (!viewport) {
      results.push({
        rule: 'meta-viewport',
        severity: 'error',
        message: 'Missing <meta name="viewport"> tag',
        fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">',
      })
    }

    // Canonical
    const canonical = $('link[rel="canonical"]').attr('href')
    if (!canonical) {
      results.push({
        rule: 'meta-canonical',
        severity: 'warning',
        message: 'Missing canonical URL',
        fix: 'Add <link rel="canonical" href="https://yoursite.com/page"> to prevent duplicate content issues',
      })
    }

    // Lang attribute
    const lang = $('html').attr('lang')
    if (!lang) {
      results.push({
        rule: 'meta-lang',
        severity: 'warning',
        message: 'Missing lang attribute on <html> tag',
        fix: 'Add a lang attribute: <html lang="en"> (use appropriate language code)',
      })
    }

    return results
  },
}
