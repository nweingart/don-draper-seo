import { Hono } from 'hono'
import { getAllSites, createSite, deleteSite } from '../db.js'

const app = new Hono()

app.get('/', (c) => {
  return c.json(getAllSites())
})

app.post('/', async (c) => {
  const body = await c.req.json<{ url: string; name?: string; isCompetitor?: boolean }>()
  if (!body.url) return c.json({ error: 'url is required' }, 400)
  try {
    const site = createSite(body.url, body.name, body.isCompetitor)
    return c.json(site, 201)
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) {
      return c.json({ error: 'Site already exists' }, 409)
    }
    throw err
  }
})

app.delete('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  deleteSite(id)
  return c.json({ ok: true })
})

export default app
