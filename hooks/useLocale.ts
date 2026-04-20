'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function useLocaleSwitch() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function switchLocale(locale: 'ms' | 'en') {
    document.cookie = `locale=${locale}; path=/; max-age=31536000`
    startTransition(() => {
      router.refresh()
    })
  }

  return { switchLocale, isPending }
}
