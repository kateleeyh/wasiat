import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { CreateDocumentClient } from './CreateDocumentClient'
import { ConsentGate } from './ConsentGate'

export default async function CreateDocumentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const cookieStore = await cookies()
  const ms = (cookieStore.get('locale')?.value ?? 'ms') === 'ms'

  // Check if user has given PDPA consent
  const { data: profile } = await supabase
    .from('users')
    .select('pdpa_consent')
    .eq('id', user.id)
    .single()

  const hasConsented = (profile as { pdpa_consent?: boolean } | null)?.pdpa_consent ?? false

  if (!hasConsented) {
    return <ConsentGate ms={ms} />
  }

  return <CreateDocumentClient />
}
