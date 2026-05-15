import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'
import { PRICING } from '@/lib/pricing'

const CALLBACK_PATH = '/api/payment/callback'

function verifySignature(
  clientId: string,
  requestId: string,
  timestamp: string,
  body: string,
  secretKey: string,
  received: string,
): boolean {
  const digest    = crypto.createHash('sha256').update(body).digest('base64')
  const component = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${CALLBACK_PATH}\nDigest:${digest}`
  const expected  = 'HMACSHA256=' + crypto.createHmac('sha256', secretKey).update(component).digest('base64')
  return expected === received
}

export async function POST(request: NextRequest) {
  const body        = await request.text()
  const clientId    = request.headers.get('Client-Id') ?? ''
  const requestId   = request.headers.get('Request-Id') ?? ''
  const timestamp   = request.headers.get('Request-Timestamp') ?? ''
  const receivedSig = request.headers.get('Signature') ?? ''
  const secretKey   = process.env.DOKU_SECRET_KEY!

  if (!verifySignature(clientId, requestId, timestamp, body, secretKey, receivedSig)) {
    console.error('DOKU callback: signature mismatch')
    return new NextResponse('Forbidden', { status: 403 })
  }

  const payload = JSON.parse(body)
  console.log('DOKU callback: sig OK, status:', payload.transaction?.status, 'invoice:', payload.order?.invoice_number)

  if (payload.transaction?.status !== 'SUCCESS') {
    return new NextResponse('OK', { status: 200 })
  }

  const invoiceNumber  = (payload.order?.invoice_number as string) ?? ''
  const lastUnderscore = invoiceNumber.lastIndexOf('_')
  const documentId     = invoiceNumber.slice(0, lastUnderscore)
  const plan           = invoiceNumber.slice(lastUnderscore + 1)
  const isBundle       = plan === 'bundle'

  if (!documentId) {
    console.error('DOKU callback: invalid invoice_number', invoiceNumber)
    return new NextResponse('Bad Request', { status: 400 })
  }

  const supabase = createAdminClient()
  const now      = new Date().toISOString()

  const { data: doc } = await supabase
    .from('documents')
    .select('id, user_id, status')
    .eq('id', documentId)
    .single()

  if (!doc) {
    console.error('DOKU callback: document not found', documentId)
    return new NextResponse('OK', { status: 200 })
  }

  if (doc.status !== 'completed') {
    await supabase
      .from('documents')
      .update({ status: 'completed', paid_at: now })
      .eq('id', documentId)

    const pricingPlan = isBundle ? PRICING.bundle : PRICING.single
    await supabase.from('payments').insert({
      document_id:     documentId,
      user_id:         doc.user_id,
      billplz_bill_id: requestId,
      amount:          payload.order?.amount ?? pricingPlan.amountSen,
      currency:        'MYR',
      status:          'paid',
      paid_at:         payload.transaction?.date ?? now,
      plan:            isBundle ? 'bundle' : 'single',
    })

    if (isBundle) {
      await supabase.rpc('increment_bundle_credits', { user_id_input: doc.user_id })
    }
  }

  return new NextResponse('OK', { status: 200 })
}
