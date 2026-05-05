import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const APP_URL = 'https://wasiathub.my'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'WasiatHub — Wasiat & Surat Wasiat Online Malaysia',
    template: '%s | WasiatHub',
  },
  description:
    'Jana Wasiat Islam & Surat Wasiat Am secara online dalam 15 minit. Berpandukan undang-undang Malaysia — Akta Wasiat 1959 & Enakmen Wasiat Orang Islam. Satu harga. Tiada had.',
  keywords: [
    'wasiat online malaysia',
    'surat wasiat online',
    'wasiat islam malaysia',
    'cara buat wasiat',
    'online will writing malaysia',
    'general will malaysia',
    'wasiat digital',
    'faraid malaysia',
    'akta wasiat 1959',
    'wasiat murah malaysia',
    'WasiatHub',
  ],
  authors: [{ name: 'WasiatHub', url: APP_URL }],
  creator: 'WasiatHub',
  publisher: 'WasiatHub',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'ms_MY',
    alternateLocale: 'en_MY',
    url: APP_URL,
    siteName: 'WasiatHub',
    title: 'WasiatHub — Wasiat & Surat Wasiat Online Malaysia',
    description:
      'Jana Wasiat Islam & Surat Wasiat Am secara online dalam 15 minit. Satu harga. Tiada had.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WasiatHub — Wasiat & Will Online Malaysia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WasiatHub — Wasiat & Surat Wasiat Online Malaysia',
    description: 'Jana Wasiat Islam & Surat Wasiat Am dalam 15 minit. Satu harga. Tiada had.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: APP_URL,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        {/* Schema.org structured data — LegalService */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LegalService',
              name: 'WasiatHub',
              url: APP_URL,
              description: 'Platform digital untuk menjana Wasiat Islam dan Surat Wasiat Am mengikut undang-undang Malaysia.',
              areaServed: { '@type': 'Country', name: 'Malaysia' },
              serviceType: ['Will Writing', 'Wasiat', 'Estate Planning'],
              priceRange: 'RM79 - RM129',
              availableLanguage: ['Malay', 'English'],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Will Writing Services',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    name: 'Wasiat Islam',
                    price: '79',
                    priceCurrency: 'MYR',
                    description: 'Wasiat Islam mengikut hukum Syariah Malaysia',
                  },
                  {
                    '@type': 'Offer',
                    name: 'General Will / Surat Wasiat Am',
                    price: '79',
                    priceCurrency: 'MYR',
                    description: 'General Will under the Wills Act 1959 Malaysia',
                  },
                  {
                    '@type': 'Offer',
                    name: 'Family Bundle',
                    price: '129',
                    priceCurrency: 'MYR',
                    description: '2 documents for couples or family members',
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
