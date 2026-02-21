export default function App() {
  return (
    <>
      {/* ── HERO ── */}
      <header className="hero">
        <p className="hero-label">DON DRAPER SEO</p>
        <h1 className="hero-headline">
          Your site's SEO,<br />
          exposed.
        </h1>
        <p className="hero-sub">
          A CLI that scans any website for common SEO issues and delivers a
          scored report with actionable fixes. Compare yourself against
          competitors. No excuses.
        </p>
        <div className="install-box">
          <code>npx don-draper-seo scan https://yoursite.com</code>
        </div>

        <div className="terminal">
          <div className="terminal-bar">
            <span className="terminal-dot" />
            <span className="terminal-dot" />
            <span className="terminal-dot" />
          </div>
          <pre className="terminal-body">{`  SEO Report for https://example.com
  Score: 82/100

  ── ERRORS (1) ──────────────────────────────────
  ✖ [meta-description] Meta description too short (32 chars)
    → Write a compelling description between 70–160 characters

  ── WARNINGS (2) ────────────────────────────────
  ⚠ [og-image] Missing og:image tag
    → Add an og:image meta tag for rich social previews

  ⚠ [structured-data] No JSON-LD found
    → Add structured data to help search engines understand your content

  Summary: 1 error, 2 warnings, 6 checks passed`}</pre>
        </div>
      </header>

      {/* ── RULE ── */}
      <hr className="rule" />

      {/* ── FEATURES ── */}
      <section className="features">
        <h2 className="section-title">What it does</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Scan</h3>
            <p>
              9 checks covering meta tags, Open Graph, Twitter Cards, headings,
              images, structured data, robots.txt, sitemaps, and links. Each
              issue includes a severity and a concrete fix.
            </p>
          </div>
          <div className="feature-card">
            <h3>Compare</h3>
            <p>
              Run a head-to-head audit of your site versus a competitor. See
              exactly where you win, where you lose, and which issues are unique
              to each.
            </p>
          </div>
          <div className="feature-card">
            <h3>Measure</h3>
            <p>
              Pass <code>--perf</code> to measure Core Web Vitals via headless
              Chromium — LCP, CLS, FID, TTFB, and FCP — scored and benchmarked
              automatically.
            </p>
          </div>
        </div>
      </section>

      {/* ── RULE ── */}
      <hr className="rule" />

      {/* ── HOW IT WORKS ── */}
      <section className="how-it-works">
        <h2 className="section-title">Three steps. No setup.</h2>
        <div className="steps">
          <div className="step">
            <span className="step-num">1</span>
            <h3>Install</h3>
            <p>
              <code>npm i -g don-draper-seo</code>
              <br />
              Or run directly with <code>npx</code>.
            </p>
          </div>
          <div className="step">
            <span className="step-num">2</span>
            <h3>Scan</h3>
            <p>
              Point it at any URL. You'll get a 0–100 score and a categorized
              list of issues with fixes.
            </p>
          </div>
          <div className="step">
            <span className="step-num">3</span>
            <h3>Fix</h3>
            <p>
              Every issue comes with an actionable recommendation. Apply the
              fixes, re-scan, and watch your score climb.
            </p>
          </div>
        </div>
      </section>

      {/* ── RULE ── */}
      <hr className="rule" />

      {/* ── COMPARE PREVIEW ── */}
      <section className="compare-section">
        <h2 className="section-title">Know your competition</h2>
        <div className="terminal">
          <div className="terminal-bar">
            <span className="terminal-dot" />
            <span className="terminal-dot" />
            <span className="terminal-dot" />
          </div>
          <pre className="terminal-body">{`  $ don-draper-seo compare yoursite.com competitor.com --perf

  Head-to-Head SEO Comparison
  ─────────────────────────────
  You:         https://yoursite.com
  Competitor:  https://competitor.com

  SEO Score:    91 vs 68   +23  YOU WIN
  Perf Score:   88 vs 74   +14  YOU WIN

  ── ISSUE COUNTS ──
  Errors:      0 vs 3    +3  YOU WIN
  Warnings:    1 vs 5    +4  YOU WIN

  ── ISSUES ONLY ON COMPETITOR ──
  ✖ Missing <title> tag
  ✖ No canonical URL
  ✖ Missing robots.txt`}</pre>
        </div>
      </section>

      {/* ── RULE ── */}
      <hr className="rule" />

      {/* ── FOOTER ── */}
      <footer className="footer">
        <p className="footer-name">Don Draper SEO</p>
        <nav className="footer-links">
          <a href="https://github.com/nweingart/don-draper-seo">GitHub</a>
          <span className="footer-sep">/</span>
          <a href="https://www.npmjs.com/package/don-draper-seo">npm</a>
        </nav>
        <p className="footer-copy">
          MIT License. Built because good SEO shouldn't require a consultant.
        </p>
      </footer>
    </>
  )
}
