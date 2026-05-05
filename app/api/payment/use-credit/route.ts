import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { documentId } = await request.json()
  if (!documentId) return NextResponse.json({ error: 'Missing documentId' }, { status: 400 })

  const { data: doc } = await supabase
    .from('documents')
    .select('id, user_id, status, type')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  if (doc.status === 'completed') return NextResponse.json({ error: 'Already completed' }, { status: 400 })

  const { data: profile } = await admin
    .from('users')
    .select('bundle_credits')
    .eq('id', user.id)
    .single()

  const credits = (profile as { bundle_credits?: number } | null)?.bundle_credits ?? 0
  if (credits <= 0) return NextResponse.json({ error: 'No bundle credits available' }, { status: 400 })

  const now = new Date().toISOString()

  // Use admin client for all writes to bypass RLS
  const { error: creditError } = await admin
    .from('users')
    .update({ bundle_credits: credits - 1 })
    .eq('id', user.id)

  if (creditError) return NextResponse.json({ error: 'Failed to deduct credit' }, { status: 500 })

  await admin.from('documents').update({ status: 'completed', paid_at: now }).eq('id', documentId)

  const { error: payErr } = await admin.from('payments').insert({
    document_id:     documentId,
    user_id:         user.id,
    billplz_bill_id: `BUNDLE-CREDIT-${Date.now()}`,
    amount:          0,
    currency:        'MYR',
    status:          'paid',
    paid_at:         now,
    plan:            'credit',
  })
  if (payErr) console.error('Payment insert error:', payErr.message)

  return NextResponse.json({ success: true })
}
