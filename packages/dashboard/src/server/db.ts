import Database from 'better-sqlite3'
import { join } from 'path'
import { mkdirSync } from 'fs'
import { homedir } from 'os'
import { SCHEMA } from './db-schema.js'
import type { CheckResult, PerfMetrics } from 'don-draper-seo'
import type { Site, ScanRecord } from '../types.js'

const DATA_DIR = join(homedir(), '.don-draper-seo')
const DB_PATH = join(DATA_DIR, 'data.db')

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    mkdirSync(DATA_DIR, { recursive: true })
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    db.exec(SCHEMA)
  }
  return db
}

// --- Sites ---

export function getAllSites(): Site[] {
  const rows = getDb().prepare('SELECT * FROM sites ORDER BY created_at DESC').all() as any[]
  return rows.map(rowToSite)
}

export function getSiteById(id: number): Site | undefined {
  const row = getDb().prepare('SELECT * FROM sites WHERE id = ?').get(id) as any
  return row ? rowToSite(row) : undefined
}

export function createSite(url: string, name?: string, isCompetitor?: boolean): Site {
  const stmt = getDb().prepare(
    'INSERT INTO sites (url, name, is_competitor) VALUES (?, ?, ?)'
  )
  const result = stmt.run(url, name ?? null, isCompetitor ? 1 : 0)
  return getSiteById(result.lastInsertRowid as number)!
}

export function deleteSite(id: number): void {
  getDb().prepare('DELETE FROM sites WHERE id = ?').run(id)
}

// --- Scans ---

export function insertScan(
  siteId: number,
  url: string,
  score: number,
  perfScore: number | null,
  checks: CheckResult[],
  perf: PerfMetrics | null,
  timestamp: string
): ScanRecord {
  const stmt = getDb().prepare(
    `INSERT INTO scans (site_id, url, score, perf_score, checks_json, perf_json, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
  const result = stmt.run(
    siteId,
    url,
    score,
    perfScore,
    JSON.stringify(checks),
    perf ? JSON.stringify(perf) : null,
    timestamp
  )
  return getScanById(result.lastInsertRowid as number)!
}

export function getScanById(id: number): ScanRecord | undefined {
  const row = getDb().prepare('SELECT * FROM scans WHERE id = ?').get(id) as any
  return row ? rowToScan(row) : undefined
}

export function getScansBySite(siteId: number, limit = 50): ScanRecord[] {
  const rows = getDb()
    .prepare('SELECT * FROM scans WHERE site_id = ? ORDER BY timestamp DESC LIMIT ?')
    .all(siteId, limit) as any[]
  return rows.map(rowToScan)
}

export function getLatestScans(): ScanRecord[] {
  const rows = getDb()
    .prepare(
      `SELECT s.* FROM scans s
       INNER JOIN (
         SELECT site_id, MAX(timestamp) as max_ts FROM scans GROUP BY site_id
       ) latest ON s.site_id = latest.site_id AND s.timestamp = latest.max_ts
       ORDER BY s.site_id`
    )
    .all() as any[]
  return rows.map(rowToScan)
}

export function getPreviousScan(siteId: number): ScanRecord | undefined {
  const rows = getDb()
    .prepare('SELECT * FROM scans WHERE site_id = ? ORDER BY timestamp DESC LIMIT 2')
    .all(siteId) as any[]
  return rows.length >= 2 ? rowToScan(rows[1]) : undefined
}

// --- Row mappers ---

function rowToSite(row: any): Site {
  return {
    id: row.id,
    url: row.url,
    name: row.name,
    isCompetitor: Boolean(row.is_competitor),
    createdAt: row.created_at,
  }
}

function rowToScan(row: any): ScanRecord {
  return {
    id: row.id,
    siteId: row.site_id,
    url: row.url,
    score: row.score,
    perfScore: row.perf_score,
    checks: JSON.parse(row.checks_json),
    perf: row.perf_json ? JSON.parse(row.perf_json) : null,
    timestamp: row.timestamp,
    createdAt: row.created_at,
  }
}
