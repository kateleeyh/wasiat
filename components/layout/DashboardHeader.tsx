import { getTranslations } from 'next-intl/server'
import { LanguageToggle } from './LanguageToggle'
import { logout } from '@/app/auth/actions'

interface Props {
  userName: string
  currentLocale: 'ms' | 'en'
}

export async function DashboardHeader({ userName, currentLocale }: Props) {
  const t = await getTranslations()

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
      <span className="font-bold text-primary text-lg">{t('common.appName')}</span>
      <div className="flex items-center gap-4">
        <LanguageToggle currentLocale={currentLocale} />
        <span className="text-sm text-muted-foreground hidden sm:block">{userName}</span>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            {t('auth.logout')}
          </button>
        </form>
      </div>
    </header>
  )
}
