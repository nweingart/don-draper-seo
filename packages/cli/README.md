# don-draper-seo

Scan any website for common SEO issues and get a scored report with actionable fixes.

## Install

```sh
npm i -g don-draper-seo
```

Or run directly:

```sh
npx don-draper-seo scan https://example.com
```

## Commands

### `scan <url>`

Scan a single website for SEO issues.

```sh
don-draper-seo scan https://example.com
```

```
  SEO Report for https://example.com
  Score: 82/100

  ── ERRORS (1) ──────────────────────────────────
  ✖ [meta-description] Meta description too short (32 chars)
    → Write a compelling description between 70–160 characters

  ── WARNINGS (2) ────────────────────────────────
  ⚠ [og-image] Missing og:image tag
    → Add an og:image meta tag for rich social previews

  ⚠ [structured-data] No JSON-LD found
    → Add structured data to help search engines understand your content

  Summary: 1 error, 2 warnings, 6 checks passed
```

### `compare <your-url> <competitor-url>`

Run a head-to-head SEO comparison.

```sh
don-draper-seo compare yoursite.com competitor.com --perf
```

```
  Head-to-Head SEO Comparison
  ─────────────────────────────
  You:         https://yoursite.com
  Competitor:  https://competitor.com

  SEO Score:    91 vs 68   +23  YOU WIN
  Perf Score:   88 vs 74   +14  YOU WIN

  ── ISSUE COUNTS ──
  Errors:      0 vs 3    +3  YOU WIN
  Warnings:    1 vs 5    +4  YOU WIN
```

## Options

| Flag | Description |
|------|-------------|
| `--json` | Output results as JSON |
| `--verbose` | Include info-level messages (default shows errors and warnings only) |
| `--perf` | Measure Core Web Vitals (LCP, CLS, FID, TTFB, FCP) via headless Chromium |

## Checks

9 checks run on every scan:

| Check | What it looks for |
|-------|-------------------|
| **Meta Tags** | Title length, meta description, viewport, canonical URL, lang attribute |
| **Open Graph** | og:title, og:description, og:image, og:url, og:type |
| **Twitter Cards** | Twitter-specific meta tags |
| **Headings** | Single h1, no skipped heading levels |
| **Images** | Alt text on all images |
| **Structured Data** | Valid JSON-LD |
| **Robots.txt** | Exists and is valid |
| **Sitemap** | Sitemap present and reachable |
| **Links** | No broken or invalid links |

## Scoring

Every issue has a severity that affects your 0–100 score:

- **Error** — deducts 10 points
- **Warning** — deducts 5 points
- **Info** — deducts 2 points

## Performance

Pass `--perf` to measure Core Web Vitals using a headless Chromium browser (requires [Playwright](https://playwright.dev/) — installed automatically as an optional dependency):

```sh
don-draper-seo scan https://example.com --perf
```

Metrics measured: LCP, CLS, FID, TTFB, and FCP — each scored and benchmarked against Google's thresholds.

## Programmatic API

```ts
import { scan, compare } from 'don-draper-seo'

const report = await scan('https://example.com')
console.log(report.score) // 82

const comparison = await compare('https://yoursite.com', 'https://competitor.com')
console.log(comparison.result) // "win" | "lose" | "tie"
```

## License

MIT
