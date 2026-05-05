import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/insights', '/privacy', '/terms', '/disclaimer', '/contact'],
        disallow: ['/dashboard', '/wasiat', '/will', '/payment', '/auth', '/api'],
      },
    ],
    sitemap: 'https://wasiathub.my/sitemap.xml',
  }
}
