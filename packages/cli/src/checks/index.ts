import type { Check } from '../types.js'
import { metaCheck } from './meta.js'
import { opengraphCheck } from './opengraph.js'
import { twitterCheck } from './twitter.js'
import { headingsCheck } from './headings.js'
import { imagesCheck } from './images.js'
import { structuredDataCheck } from './structured-data.js'
import { robotsCheck } from './robots.js'
import { sitemapCheck } from './sitemap.js'
import { linksCheck } from './links.js'

export const checks: Check[] = [
  metaCheck,
  opengraphCheck,
  twitterCheck,
  headingsCheck,
  imagesCheck,
  structuredDataCheck,
  robotsCheck,
  sitemapCheck,
  linksCheck,
]
