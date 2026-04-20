'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const dob = formData.get('dob') as string
  const gender = formData.get('gender') as string
  const maritalStatus = formData.get('maritalStatus') as string

  const { error } = await supabase
    .from('users')
    .update({
      full_name:           formData.get('fullName') as string,
      ic_number:           formData.get('icNumber') as string,
      phone:               formData.get('phone') as string,
      dob:                 dob || null,
      gender:              (gender || null) as 'male' | 'female' | null,
      marital_status:      (maritalStatus || null) as 'single' | 'married' | 'widowed' | 'divorced' | null,
      address:             formData.get('address') as string || null,
      language_preference: formData.get('language') as 'ms' | 'en',
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/profile')
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const newPassword = formData.get('newPassword') as string
  const confirm = formData.get('confirmPassword') as string

  if (newPassword !== confirm) return { error: 'Passwords do not match' }

  const { error } = await supabase.auth.updateUser({ password: newPassword })

  if (error) return { error: error.message }

  return { success: true }
}
