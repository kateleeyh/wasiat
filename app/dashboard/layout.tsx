import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLocale } from 'next-intl/server'
import { DashboardNav } from '@/components/layout/DashboardNav'
import { DashboardHeader } from '@/components/layout/DashboardHeader'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, language_preference')
    .eq('id', user.id)
    .single() as { data: { full_name: string | null; language_preference: 'ms' | 'en' } | null }

  const locale = await getLocale() as 'ms' | 'en'

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader
        userName={profile?.full_name ?? user.email ?? ''}
        currentLocale={locale}
      />
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  )
}
