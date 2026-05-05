import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PRICING } from '@/lib/pricing'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { documentId, plan } = await request.json()
  if (!documentId) return NextResponse.json({ error: 'Missing documentId' }, { status: 400 })
  const isBundle = plan === 'bundle'

  const { data: doc, error: docError } = await supabase
    .from('documents')
    .select('id, status, type')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (docError || !doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  if (doc.status === 'completed') return NextResponse.json({ success: true, alreadyCompleted: true })

  const now = new Date().toISOString()
  const pricing = isBundle ? PRICING.bundle : PRICING.single
  const admin = createAdminClient()

  const { error: updateError } = await supabase
    .from('documents')
    .update({ status: 'completed', paid_at: now })
    .eq('id', documentId)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  // Use admin client to bypass RLS on payments table
  const { error: payErr } = await admin.from('payments').insert({
    document_id:     documentId,
    user_id:         user.id,
    billplz_bill_id: `MOCK-${isBundle ? 'BUNDLE' : 'SINGLE'}-${Date.now()}`,
    amount:          pricing.amountSen,
    currency:        'MYR',
    status:          'paid',
    paid_at:         now,
    plan:            isBundle ? 'bundle' : 'single',
  })
  if (payErr) console.error('Payment insert error:', payErr.message)

  // Bundle: add 1 credit for the second document
  if (isBundle) {
    const { data: profile } = await admin
      .from('users')
      .select('bundle_credits')
      .eq('id', user.id)
      .single()
    const current = (profile as { bundle_credits?: number } | null)?.bundle_credits ?? 0
    await admin.from('users').update({ bundle_credits: current + 1 }).eq('id', user.id)
  }

  return NextResponse.json({ success: true, plan: isBundle ? 'bundle' : 'single' })
}
