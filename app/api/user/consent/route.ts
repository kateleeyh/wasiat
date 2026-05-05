import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { marketingConsent } = await request.json()
  const admin = createAdminClient()

  await admin.from('users').update({
    pdpa_consent:      true,
    pdpa_consent_at:   new Date().toISOString(),
    marketing_consent: !!marketingConsent,
  }).eq('id', user.id)

  return NextResponse.json({ success: true })
}
