import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { register, loginWithGoogle } from '@/app/auth/actions'
import { AuthForm } from '@/components/forms/AuthForm'

export default async function RegisterPage() {
  const t = await getTranslations()

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-sm p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-primary">{t('common.appName')}</h1>
          <p className="text-muted-foreground mt-1">{t('auth.register')}</p>
        </div>

        <AuthForm
          mode="register"
          action={register}
          googleAction={loginWithGoogle}
        />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('auth.hasAccount')}{' '}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            {t('auth.login')}
          </Link>
        </p>
      </div>
    </div>
  )
}
