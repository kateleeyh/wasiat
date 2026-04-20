import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { login, loginWithGoogle } from '@/app/auth/actions'
import { AuthForm } from '@/components/forms/AuthForm'

interface Props {
  searchParams: Promise<{ redirectTo?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const t = await getTranslations()
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary">{t('common.appName')}</h1>
          <p className="text-muted-foreground mt-1">{t('auth.login')}</p>
        </div>

        {params.error && (
          <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            {params.error === 'oauth_failed'
              ? 'Google sign-in failed. Please try again.'
              : params.error}
          </div>
        )}

        <AuthForm
          mode="login"
          action={login}
          googleAction={loginWithGoogle}
          redirectTo={params.redirectTo}
        />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('auth.noAccount')}{' '}
          <Link href="/auth/register" className="text-primary font-medium hover:underline">
            {t('auth.register')}
          </Link>
        </p>
      </div>
    </div>
  )
}
