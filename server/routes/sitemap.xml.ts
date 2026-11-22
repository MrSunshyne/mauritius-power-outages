import { API_URLS, fetchJson } from '~/utils/api'

interface DailyIndex {
  available: { date: string }[]
}

interface LocalitiesIndex {
  localities: { slug: string }[]
}

// The home and statistics pages, every locality and every day that has outages,
// read from the dataset's two small index files. Single outage pages are left out:
// there are over 10,000, each relevant for a day or two, and the day and locality
// pages link to them.
export default defineEventHandler(async (event) => {
  const [daily, localities] = await Promise.all([
    fetchJson<DailyIndex>(API_URLS.dailyIndex),
    fetchJson<LocalitiesIndex>(API_URLS.localitiesIndex),
  ])
  const site = getSiteConfig(event).url
  const paths = [
    '/',
    '/statistics',
    ...localities.localities.map(({ slug }) => `/locality/${slug}`),
    ...daily.available.map(({ date }) => `/day/${date}`),
  ]

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <url><loc>${site}${encodeURI(path)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n')
})
