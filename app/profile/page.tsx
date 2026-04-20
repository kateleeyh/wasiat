import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/forms/ProfileForm'

export default async function ProfilePage() {
  const t = await getTranslations()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">{t('dashboard.profile')}</h1>
      <div className="bg-card border border-border rounded-xl p-6">
        <ProfileForm profile={profile} userId={user.id} />
      </div>
    </div>
  )
}
