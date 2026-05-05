'use client'

import { useState, useTransition } from 'react'
import { useLocale } from 'next-intl'
import { createDocument } from './actions'
import type { Locale } from '@/types/database'
import { PRICING } from '@/lib/pricing'

type Stage = 'choose' | 'lang_select'

export function CreateDocumentClient() {
  const locale = useLocale()
  const [stage, setStage]       = useState<Stage>('choose')
  const [isPending, startTransition] = useTransition()

  function submitWasiat() {
    startTransition(() => { createDocument('wasiat', 'ms') })
  }

  function submitWill(lang: Locale) {
    startTransition(() => { createDocument('general_will', lang) })
  }

  return (
    <div className="max-w-2xl mx-auto">
      {stage === 'choose' && (
        <>
          <div className="mb-8">
            <h1 className="text-xl font-semibold">
              {locale === 'ms' ? 'Pilih Jenis Dokumen' : 'Choose Document Type'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {locale === 'ms'
                ? 'Cipta dokumen baharu untuk perancangan harta pusaka anda.'
                : 'Create a new document for your estate planning.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button type="button" disabled={isPending} onClick={submitWasiat}
              className="w-full text-left border border-border rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition group disabled:opacity-60">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                <span className="text-emerald-700 text-lg font-bold">و</span>
              </div>
              <h2 className="font-semibold text-base mb-2 group-hover:text-primary transition">Wasiat Islam</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {locale === 'ms'
                  ? 'Wasiat mengikut hukum Syariah dan undang-undang Islam (had 1/3 harta).'
                  : 'Islamic Will under Syariah law (up to 1/3 of estate).'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Syariah Law', 'Faraid', 'Muslim'].map(t => (
                  <span key={t} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">{t}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {locale === 'ms' ? 'Dokumen dalam Bahasa Melayu' : 'Document in Bahasa Melayu'}
              </p>
            </button>

            <button type="button" disabled={isPending} onClick={() => setStage('lang_select')}
              className="w-full text-left border border-border rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition group disabled:opacity-60">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-blue-700 text-lg font-bold">W</span>
              </div>
              <h2 className="font-semibold text-base mb-2 group-hover:text-primary transition">
                {locale === 'ms' ? 'Wasiat Am / General Will' : 'General Will'}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {locale === 'ms'
                  ? 'Wasiat mengikut Akta Wasiat 1959 (Malaysia). Sesuai untuk bukan Muslim.'
                  : 'Will under the Wills Act 1959 (Malaysia). For non-Muslims.'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Wills Act 1959', 'Non-Muslim'].map(t => (
                  <span key={t} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">{t}</span>
                ))}
              </div>
              <p className="text-xs text-primary font-medium mt-3">
                {locale === 'ms' ? 'Pilih bahasa dokumen →' : 'Select document language →'}
              </p>
            </button>
          </div>

          <div className="mt-6 text-center space-y-1">
            <p className="text-xs text-muted-foreground">
              {locale === 'ms'
                ? `${PRICING.single.displayFull} per dokumen · Bayaran sekali sahaja selepas siap`
                : `${PRICING.single.displayFull} per document · One-time payment after completion`}
            </p>
            <p className="text-xs text-emerald-600 font-medium">
              {locale === 'ms'
                ? `💡 Pakej Keluarga: ${PRICING.bundle.displayFull} untuk 2 dokumen — jimat ${PRICING.bundle.savingRM}`
                : `💡 Family Bundle: ${PRICING.bundle.displayFull} for 2 documents — save ${PRICING.bundle.savingRM}`}
            </p>
          </div>
        </>
      )}

      {stage === 'lang_select' && (
        <>
          <div className="mb-8">
            <button type="button" onClick={() => setStage('choose')}
              className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 transition">
              ← {locale === 'ms' ? 'Kembali' : 'Back'}
            </button>
            <h1 className="text-xl font-semibold">
              {locale === 'ms' ? 'Pilih Bahasa Dokumen' : 'Select Document Language'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {locale === 'ms'
                ? 'Dokumen wasiat am anda akan dijana dalam bahasa yang dipilih.'
                : 'Your will document will be generated in the selected language.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button type="button" disabled={isPending} onClick={() => submitWill('ms')}
              className="w-full text-left border border-border rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition group disabled:opacity-60">
              <div className="text-3xl mb-4">🇲🇾</div>
              <h2 className="font-semibold text-base mb-2 group-hover:text-primary transition">Bahasa Melayu</h2>
              <p className="text-sm text-muted-foreground">Dokumen dijana dalam Bahasa Melayu.</p>
            </button>
            <button type="button" disabled={isPending} onClick={() => submitWill('en')}
              className="w-full text-left border border-border rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition group disabled:opacity-60">
              <div className="text-3xl mb-4">🇬🇧</div>
              <h2 className="font-semibold text-base mb-2 group-hover:text-primary transition">English</h2>
              <p className="text-sm text-muted-foreground">Will document generated in English.</p>
            </button>
          </div>

          {isPending && (
            <p className="mt-6 text-sm text-muted-foreground text-center animate-pulse">
              {locale === 'ms' ? 'Mencipta dokumen...' : 'Creating document...'}
            </p>
          )}
        </>
      )}
    </div>
  )
}
