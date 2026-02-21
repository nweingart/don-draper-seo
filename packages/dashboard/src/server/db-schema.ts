export const SCHEMA = `
CREATE TABLE IF NOT EXISTS sites (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  url           TEXT NOT NULL UNIQUE,
  name          TEXT,
  is_competitor BOOLEAN DEFAULT 0,
  created_at    TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS scans (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id       INTEGER NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,
  score         INTEGER NOT NULL,
  perf_score    INTEGER,
  checks_json   TEXT NOT NULL,
  perf_json     TEXT,
  timestamp     TEXT NOT NULL,
  created_at    TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_scans_site_timestamp ON scans(site_id, timestamp DESC);
`
