import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'
import { PRICING } from '@/lib/pricing'

function verifyXSignature(params: Record<string, string>, xSigKey: string, received: string): boolean {
  const source = Object.keys(params)
    .filter(k => k !== 'x_signature')
    .sort()
    .map(k => `${k}${params[k]}`)
    .join('|')
  const expected = crypto.createHmac('sha256', xSigKey).update(source).digest('hex')
  return expected === received
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const params = Object.fromEntries(new URLSearchParams(body))

  const xSigKey  = process.env.BILLPLZ_X_SIGNATURE!
  const received = params['x_signature'] ?? ''

  if (!verifyXSignature(params, xSigKey, received)) {
    console.error('Billplz callback: XSignature mismatch. Keys:', Object.keys(params), 'Received sig:', received?.slice(0, 10))
    return new NextResponse('Forbidden', { status: 403 })
  }
  console.log('Billplz callback: XSignature OK, paid:', params['paid'], 'ref:', params['reference_1'])

  if (params['paid'] !== 'true') {
    return new NextResponse('OK', { status: 200 })
  }

  const documentId = params['reference_1']
  const plan       = params['reference_2'] ?? 'single'
  const isBundle   = plan === 'bundle'

  if (!documentId) {
    console.error('Billplz callback: missing reference_1')
    return new NextResponse('Bad Request', { status: 400 })
  }

  const supabase = createAdminClient()
  const now = new Date().toISOString()

  const { data: doc } = await supabase
    .from('documents')
    .select('id, user_id, status')
    .eq('id', documentId)
    .single()

  if (!doc) {
    console.error('Billplz callback: document not found', documentId)
    return new NextResponse('OK', { status: 200 })
  }

  if (doc.status !== 'completed') {
    // Mark this document as completed
    await supabase
      .from('documents')
      .update({ status: 'completed', paid_at: now })
      .eq('id', documentId)

    const pricingPlan = isBundle ? PRICING.bundle : PRICING.single
    await supabase.from('payments').insert({
      document_id:     documentId,
      user_id:         doc.user_id,
      billplz_bill_id: params['id'],
      amount:          parseInt(params['paid_amount'] ?? String(pricingPlan.amountSen)),
      currency:        'MYR',
      status:          'paid',
      paid_at:         params['paid_at'] ?? now,
      plan:            isBundle ? 'bundle' : 'single',
    })

    // Bundle: add 1 credit for the second document
    if (isBundle) {
      await supabase.rpc('increment_bundle_credits', { user_id_input: doc.user_id })
    }
  }

  return new NextResponse('OK', { status: 200 })
}
