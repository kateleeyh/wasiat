import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function LandingPage() {
  const t = useTranslations()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold text-primary mb-4">
        {t('common.appName')}
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl">
        {t('common.tagline')}
      </p>
      <div className="flex gap-4">
        <Link
          href="/auth/register"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition"
        >
          {t('auth.register')}
        </Link>
        <Link
          href="/auth/login"
          className="border border-primary text-primary px-6 py-3 rounded-md font-medium hover:bg-primary/5 transition"
        >
          {t('auth.login')}
        </Link>
      </div>
    </main>
  )
}
