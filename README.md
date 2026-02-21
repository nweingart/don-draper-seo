# don-draper-seo

Scan any website for common SEO issues and get a scored report with actionable fixes. Compare yourself head-to-head against competitors.

**[Website](https://nweingart.github.io/don-draper-seo/)** · **[npm](https://www.npmjs.com/package/don-draper-seo)**

## Quick start

```sh
npx don-draper-seo scan https://example.com
```

## What it does

- **9 SEO checks** — meta tags, Open Graph, Twitter Cards, headings, images, structured data, robots.txt, sitemaps, links
- **0–100 scoring** — every issue has a severity and an actionable fix
- **Competitor comparison** — head-to-head audit showing where you win and lose
- **Core Web Vitals** — LCP, CLS, FID, TTFB, FCP via headless Chromium with `--perf`

## Usage

```sh
# Install globally
npm i -g don-draper-seo

# Scan a site
don-draper-seo scan https://example.com

# Compare two sites with performance metrics
don-draper-seo compare yoursite.com competitor.com --perf

# JSON output for CI pipelines
don-draper-seo scan https://example.com --json
```

See the [full CLI documentation](packages/cli/README.md) for all options and the programmatic API.

## Packages

| Package | Description |
|---------|-------------|
| [`don-draper-seo`](packages/cli) | CLI & Node.js API |
| [`don-draper-seo-dashboard`](packages/dashboard) | Web dashboard |
| [`don-draper-seo-site`](packages/site) | Landing page ([live](https://nweingart.github.io/don-draper-seo/)) |

## License

MIT
