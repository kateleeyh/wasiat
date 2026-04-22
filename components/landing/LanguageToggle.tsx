'use client'

import { useRouter } from 'next/navigation'

export function LanguageToggle({ locale }: { locale: string }) {
  const router = useRouter()

  function toggle() {
    const next = locale === 'ms' ? 'en' : 'ms'
    document.cookie = `locale=${next};path=/;max-age=31536000`
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors"
    >
      <span className={locale === 'ms' ? 'text-emerald-400 font-bold' : 'opacity-50'}>BM</span>
      <span className="opacity-30">/</span>
      <span className={locale === 'en' ? 'text-emerald-400 font-bold' : 'opacity-50'}>EN</span>
    </button>
  )
}

export function LanguageToggleDark({ locale }: { locale: string }) {
  const router = useRouter()

  function toggle() {
    const next = locale === 'ms' ? 'en' : 'ms'
    document.cookie = `locale=${next};path=/;max-age=31536000`
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-colors"
    >
      <span className={locale === 'ms' ? 'text-emerald-600 font-bold' : 'opacity-40'}>BM</span>
      <span className="opacity-30">/</span>
      <span className={locale === 'en' ? 'text-emerald-600 font-bold' : 'opacity-40'}>EN</span>
    </button>
  )
}
