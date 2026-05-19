'use client'

import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

interface AuthFormProps {
  mode: 'login' | 'register'
  action: (formData: FormData) => Promise<{ error: string } | undefined>
  googleAction: () => Promise<void>
  redirectTo?: string
}

export function AuthForm({ mode, action, googleAction, redirectTo }: AuthFormProps) {
  const t = useTranslations()
  const [state, formAction, pending] = useActionState(
    async (_prev: { error: string } | undefined, formData: FormData) => {
      return action(formData)
    },
    undefined
  )

  return (
    <div className="space-y-4">
      {/* Google OAuth */}
      <form action={googleAction}>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 border border-border rounded-md px-4 py-2.5 text-sm font-medium hover:bg-muted/50 transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t('auth.loginWithGoogle')}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs text-muted-foreground">
          <span className="bg-card px-2">atau / or</span>
        </div>
      </div>

      {/* Email/Password form */}
      <form action={formAction} className="space-y-4">
        {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Nama Penuh / Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Ahmad bin Abdullah"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            {t('auth.email')}
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="nama@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t('auth.password')}
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="••••••••"
          />
        </div>

        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('auth.confirmPassword')}
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={8}
              className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>
        )}

        {/* PDPA & Marketing consent — register only */}
        {mode === 'register' && (
          <div className="space-y-3 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" name="pdpaConsent" required className="mt-0.5 w-4 h-4 accent-primary shrink-0" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">* </span>
                I consent to WasiatHub collecting and storing my personal information (name, IC, contact, document data) for the purpose of generating, delivering and retaining my will/wasiat document, in accordance with the{' '}
                <a href="/privacy" target="_blank" className="text-primary underline">Privacy Policy</a> and{' '}
                <a href="/terms" target="_blank" className="text-primary underline">Terms of Use</a>.
              </span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" name="marketingConsent" className="mt-0.5 w-4 h-4 accent-primary shrink-0" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                (Optional) I agree to receive updates, tips, and promotional offers from WasiatHub via email. You can unsubscribe anytime.
              </span>
            </label>
          </div>
        )}

        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {pending
            ? t('common.loading')
            : mode === 'login'
              ? t('auth.login')
              : t('auth.register')}
        </button>

        {mode === 'register' && (
          <p className="text-xs text-muted-foreground text-center leading-relaxed pt-1">
            📧 Selepas mendaftar, semak e-mel anda untuk mengesahkan akaun sebelum log masuk.
            <br />
            <span className="text-[11px]">After registering, check your email to verify your account before logging in.</span>
          </p>
        )}
      </form>
    </div>
  )
}
