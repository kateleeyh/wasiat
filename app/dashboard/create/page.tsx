'use client'

import { useState, useTransition } from 'react'
import { createDocument } from './actions'
import type { Locale } from '@/types/database'

type Stage = 'choose' | 'lang_select'

export default function CreateDocumentPage() {
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
            <h1 className="text-xl font-semibold">Pilih Jenis Dokumen</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Cipta dokumen baharu untuk perancangan harta pusaka anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wasiat Card */}
            <button
              type="button"
              disabled={isPending}
              onClick={submitWasiat}
              className="w-full text-left border border-border rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition group disabled:opacity-60"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                <span className="text-emerald-700 text-lg font-bold">و</span>
              </div>
              <h2 className="font-semibold text-base mb-2 group-hover:text-primary transition">
                Wasiat Islam
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Wasiat mengikut hukum Syariah dan undang-undang Islam (had 1/3 harta).
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  Syariah Law
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  Faraid
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  Muslim
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Dokumen dalam Bahasa Melayu</p>
            </button>

            {/* General Will Card */}
            <button
              type="button"
              disabled={isPending}
              onClick={() => setStage('lang_select')}
              className="w-full text-left border border-border rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition group disabled:opacity-60"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-blue-700 text-lg font-bold">W</span>
              </div>
              <h2 className="font-semibold text-base mb-2 group-hover:text-primary transition">
                Wasiat Am / General Will
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Wasiat mengikut Akta Wasiat 1959 (Malaysia). Sesuai untuk bukan Muslim.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  Wills Act 1959
                </span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  Non-Muslim
                </span>
              </div>
              <p className="text-xs text-primary font-medium mt-3">Pilih bahasa dokumen →</p>
            </button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            RM 49.00 per dokumen &nbsp;·&nbsp; Bayaran sekali sahaja selepas siap
          </p>
        </>
      )}

      {stage === 'lang_select' && (
        <>
          <div className="mb-8">
            <button
              type="button"
              onClick={() => setStage('choose')}
              className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 transition"
            >
              ← Kembali
            </button>
            <h1 className="text-xl font-semibold">Pilih Bahasa Dokumen</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Dokumen wasiat am anda akan dijana dalam bahasa yang dipilih.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bahasa Melayu */}
            <button
              type="button"
              disabled={isPending}
              onClick={() => submitWill('ms')}
              className="w-full text-left border border-border rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition group disabled:opacity-60"
            >
              <div className="text-3xl mb-4">🇲🇾</div>
              <h2 className="font-semibold text-base mb-2 group-hover:text-primary transition">
                Bahasa Melayu
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dokumen wasiat dijana sepenuhnya dalam Bahasa Melayu.
              </p>
            </button>

            {/* English */}
            <button
              type="button"
              disabled={isPending}
              onClick={() => submitWill('en')}
              className="w-full text-left border border-border rounded-xl p-6 hover:border-primary hover:bg-primary/5 transition group disabled:opacity-60"
            >
              <div className="text-3xl mb-4">🇬🇧</div>
              <h2 className="font-semibold text-base mb-2 group-hover:text-primary transition">
                English
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Will document generated entirely in English.
              </p>
            </button>
          </div>

          {isPending && (
            <p className="mt-6 text-sm text-muted-foreground text-center animate-pulse">
              Mencipta dokumen...
            </p>
          )}
        </>
      )}
    </div>
  )
}
