import type { FetchExtras } from './types.js'

export interface FetchResult {
  html: string
  extras: FetchExtras
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'don-draper-seo/1.0' },
      redirect: 'follow',
    })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

export async function fetchPage(url: string): Promise<FetchResult> {
  const parsedUrl = new URL(url)
  const origin = parsedUrl.origin

  const [html, robotsTxt, sitemapXml] = await Promise.all([
    fetchText(url),
    fetchText(`${origin}/robots.txt`),
    fetchText(`${origin}/sitemap.xml`),
  ])

  if (!html) {
    throw new Error(`Failed to fetch ${url}`)
  }

  return {
    html,
    extras: { robotsTxt, sitemapXml },
  }
}
