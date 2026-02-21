import { Hono } from 'hono'
import { getSiteById, insertScan, getScanById, getScansBySite, getLatestScans } from '../db.js'
import { scan } from 'don-draper-seo'
import type { ScanRecord } from '../../types.js'

const app = new Hono()

// Get scan history for a site
app.get('/', (c) => {
  const siteId = c.req.query('siteId')
  const limit = parseInt(c.req.query('limit') || '50')
  if (!siteId) return c.json({ error: 'siteId query param is required' }, 400)
  return c.json(getScansBySite(parseInt(siteId), limit))
})

// Get latest scan per site
app.get('/latest', (c) => {
  return c.json(getLatestScans())
})

// Get single scan
app.get('/:id', (c) => {
  const record = getScanById(parseInt(c.req.param('id')))
  if (!record) return c.json({ error: 'Scan not found' }, 404)
  return c.json(record)
})

// Trigger a scan for a site
app.post('/', async (c) => {
  const body = await c.req.json<{ siteId: number; perf?: boolean }>()
  const site = getSiteById(body.siteId)
  if (!site) return c.json({ error: 'Site not found' }, 404)

  const result = await scan(site.url, { perf: body.perf })
  const record = insertScan(
    site.id,
    result.url,
    result.score,
    result.perf?.perfScore ?? null,
    result.checks,
    result.perf ?? null,
    result.timestamp
  )
  return c.json(record, 201)
})

// Batch scan multiple sites (max 3 concurrent)
app.post('/batch', async (c) => {
  const body = await c.req.json<{ siteIds: number[]; perf?: boolean }>()
  const results: ScanRecord[] = []

  // Process in chunks of 3
  for (let i = 0; i < body.siteIds.length; i += 3) {
    const chunk = body.siteIds.slice(i, i + 3)
    const chunkResults = await Promise.all(
      chunk.map(async (siteId) => {
        const site = getSiteById(siteId)
        if (!site) return null
        const result = await scan(site.url, { perf: body.perf })
        return insertScan(
          site.id,
          result.url,
          result.score,
          result.perf?.perfScore ?? null,
          result.checks,
          result.perf ?? null,
          result.timestamp
        )
      })
    )
    results.push(...chunkResults.filter((r): r is ScanRecord => r !== null))
  }

  return c.json(results)
})

export default app
