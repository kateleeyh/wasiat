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

  if (password !== confirm) return { error: 'Passwords do not match' }

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password,
    options: {
      data: { full_name: formData.get('fullName') as string },
    },
  })

  if (error) return { error: error.message }

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
