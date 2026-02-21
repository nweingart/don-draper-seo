import { Hono } from 'hono'
import { getSiteById, insertScan } from '../db.js'
import { scan } from 'don-draper-seo'
import type { CompareResult } from 'don-draper-seo'

const app = new Hono()

app.post('/', async (c) => {
  const body = await c.req.json<{ siteId: number; competitorId: number; perf?: boolean }>()

  const site = getSiteById(body.siteId)
  const competitor = getSiteById(body.competitorId)
  if (!site) return c.json({ error: 'Site not found' }, 404)
  if (!competitor) return c.json({ error: 'Competitor not found' }, 404)

  const [primary, competitorResult] = await Promise.all([
    scan(site.url, { perf: body.perf }),
    scan(competitor.url, { perf: body.perf }),
  ])

  // Store both scans
  insertScan(
    site.id, primary.url, primary.score,
    primary.perf?.perfScore ?? null, primary.checks, primary.perf ?? null, primary.timestamp
  )
  insertScan(
    competitor.id, competitorResult.url, competitorResult.score,
    competitorResult.perf?.perfScore ?? null, competitorResult.checks,
    competitorResult.perf ?? null, competitorResult.timestamp
  )

  const result: CompareResult = {
    primary,
    competitor: competitorResult,
    scoreDelta: primary.score - competitorResult.score,
  }

  if (primary.perf && competitorResult.perf) {
    result.perfScoreDelta = primary.perf.perfScore - competitorResult.perf.perfScore
  }

  return c.json(result)
})

export default app
