'use client'

import { useLocaleSwitch } from '@/hooks/useLocale'

interface LanguageToggleProps {
  currentLocale: 'ms' | 'en'
}

export function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const { switchLocale, isPending } = useLocaleSwitch()

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => switchLocale('ms')}
        disabled={isPending}
        className={`px-2 py-1 rounded transition ${
          currentLocale === 'ms'
            ? 'bg-primary text-primary-foreground font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        BM
      </button>
      <span className="text-muted-foreground">|</span>
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={`px-2 py-1 rounded transition ${
          currentLocale === 'en'
            ? 'bg-primary text-primary-foreground font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        EN
      </button>
    </div>
  )
}
