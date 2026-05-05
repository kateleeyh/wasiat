import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PRICING } from '@/lib/pricing'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { documentId, plan } = await request.json()
  if (!documentId) return NextResponse.json({ error: 'Missing documentId' }, { status: 400 })
  const isBundle = plan === 'bundle'

  const { data: doc } = await supabase
    .from('documents')
    .select('id, type, status')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  if (doc.status === 'completed') return NextResponse.json({ error: 'Already paid' }, { status: 400 })

  const apiKey    = process.env.BILLPLZ_API_KEY!
  const colId     = process.env.BILLPLZ_COLLECTION_ID!
  const baseUrl   = process.env.BILLPLZ_BASE_URL!
  const appUrl    = process.env.NEXT_PUBLIC_APP_URL!

  const name  = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer'
  const email = user.email!
  const label = doc.type === 'wasiat' ? 'Wasiat Islam' : 'General Will'

  const pricing = isBundle ? PRICING.bundle : PRICING.single
  const description = isBundle
    ? `WasiatHub — Family Bundle (${label} × 2)`
    : `WasiatHub — ${label}`

  const body = new URLSearchParams({
    collection_id:     colId,
    email,
    name,
    amount:            String(pricing.amountSen),
    description,
    callback_url:      `${appUrl}/api/payment/callback`,
    redirect_url:      `${appUrl}/payment/${documentId}/success`,
    reference_1:       documentId,
    reference_1_label: 'documentId',
    reference_2:       isBundle ? 'bundle' : 'single',
    reference_2_label: 'plan',
  })

  const res = await fetch(`${baseUrl}/bills`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${apiKey}:`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  const bill = await res.json()
  if (!res.ok) {
    console.error('Billplz create bill error:', JSON.stringify(bill))
    const msg = bill.error?.description
      ?? bill.error?.message
      ?? (typeof bill.error === 'string' ? bill.error : null)
      ?? JSON.stringify(bill)
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  return NextResponse.json({ billUrl: bill.url, billId: bill.id })
}
