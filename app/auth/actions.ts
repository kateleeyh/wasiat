'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) return { error: error.message }

  const redirectTo = formData.get('redirectTo') as string
  redirect(redirectTo || '/dashboard')
}

export async function register(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirm = formData.get('confirmPassword') as string
  const pdpaConsent = formData.get('pdpaConsent') === 'on'
  const marketingConsent = formData.get('marketingConsent') === 'on'

  if (password !== confirm) return { error: 'Passwords do not match' }
  if (!pdpaConsent) return { error: 'You must agree to the data processing terms to register.' }

  const email = formData.get('email') as string
  const fullName = formData.get('fullName') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) return { error: error.message }

  // Store consent flags in users table
  if (data.user) {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const admin = createAdminClient()
    await admin.from('users').upsert({
      id:                 data.user.id,
      email,
      full_name:          fullName,
      pdpa_consent:       true,
      pdpa_consent_at:    new Date().toISOString(),
      marketing_consent:  marketingConsent,
    }, { onConflict: 'id' })
  }

  redirect('/dashboard')
}

export async function loginWithGoogle(): Promise<void> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })

  if (error) throw new Error(error.message)
  if (data.url) redirect(data.url)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
