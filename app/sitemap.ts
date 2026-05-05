import { MetadataRoute } from 'next'

const BASE = 'https://wasiathub.my'

export const insightsArticles = [
  { slug: 'kereta-tanpa-wasiat',        publishedAt: '2026-05-01', featured: true  },
  { slug: 'akaun-bank-dibekukan',       publishedAt: '2026-05-01', featured: false },
  { slug: 'grant-of-probate-vs-loa',    publishedAt: '2026-05-01', featured: false },
  { slug: 'salah-faham-wasiat',         publishedAt: '2026-05-01', featured: false },
  { slug: 'epf-nomination-bukan-wasiat', publishedAt: '2026-04-28', featured: false },
  { slug: 'wasiat-vs-surat-wasiat',     publishedAt: '2026-04-28', featured: false },
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,               lastModified: now,                      changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/insights`, lastModified: now,                      changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/privacy`,  lastModified: new Date('2026-05-01'),   changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/terms`,    lastModified: new Date('2026-05-01'),   changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/disclaimer`, lastModified: new Date('2026-05-01'), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/contact`,  lastModified: new Date('2026-05-01'),   changeFrequency: 'yearly', priority: 0.5 },
  ]

  const articleRoutes: MetadataRoute.Sitemap = insightsArticles.map((article) => ({
    url: `${BASE}/insights/${article.slug}`,
    lastModified: new Date(`${article.publishedAt}T00:00:00+08:00`),
    changeFrequency: 'yearly',
    priority: article.featured ? 0.8 : 0.7,
  }))

  return [...staticRoutes, ...articleRoutes]
}
