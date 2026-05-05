import { MetadataRoute } from 'next'

const BASE = 'https://wasiathub.my'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE,               lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/insights`, lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/privacy`,  lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/terms`,    lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/disclaimer`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/contact`,  lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
