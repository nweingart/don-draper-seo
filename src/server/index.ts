import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync, readFileSync } from 'fs'
import sitesRoutes from './routes/sites.js'
import scansRoutes from './routes/scans.js'
import compareRoutes from './routes/compare.js'

const app = new Hono()

// API routes
app.route('/api/sites', sitesRoutes)
app.route('/api/scans', scansRoutes)
app.route('/api/compare', compareRoutes)

// Static file serving for the dashboard
// Resolve dashboard dir relative to the file that's actually executing.
// When loaded via CLI chunk (dist/server-XXX.js), __dirname = dist/
// When loaded directly (dist/server/index.js), __dirname = dist/server/
const __dirname = dirname(fileURLToPath(import.meta.url))
const dashboardDir = existsSync(join(__dirname, 'dashboard'))
  ? join(__dirname, 'dashboard')
  : join(__dirname, '..', 'dashboard')

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

if (existsSync(dashboardDir)) {
  app.get('/*', (c) => {
    const reqPath = c.req.path === '/' ? '/index.html' : c.req.path
    const filePath = join(dashboardDir, reqPath)

    if (existsSync(filePath) && !filePath.includes('..')) {
      const ext = extname(filePath)
      const mime = MIME_TYPES[ext] || 'application/octet-stream'
      return c.body(readFileSync(filePath), 200, { 'Content-Type': mime })
    }

    // SPA fallback — serve index.html for client-side routes
    const indexPath = join(dashboardDir, 'index.html')
    if (existsSync(indexPath)) {
      return c.html(readFileSync(indexPath, 'utf-8'))
    }

    return c.text('Dashboard not built. Run: npm run build:web', 404)
  })
}

export async function startServer(port: number): Promise<void> {
  return new Promise((resolve) => {
    serve({ fetch: app.fetch, port }, () => {
      console.log(`\n  Don Draper SEO Dashboard`)
      console.log(`  → http://localhost:${port}\n`)
      resolve()
    })
  })
}

export { app }
