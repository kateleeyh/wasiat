import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PRICING } from '@/lib/pricing'
import crypto from 'crypto'

const DOKU_API      = 'https://api.doku.com'
const CHECKOUT_PATH = '/checkout/v1/payment'

function buildSignature(
  clientId: string,
  requestId: string,
  timestamp: string,
  path: string,
  body: string,
  secretKey: string,
): string {
  const digest = crypto.createHash('sha256').update(body).digest('base64')
  const component = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${path}\nDigest:${digest}`
  return 'HMACSHA256=' + crypto.createHmac('sha256', secretKey).update(component).digest('base64')
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { documentId, plan, promoCode } = await request.json()
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

  const clientId  = process.env.DOKU_CLIENT_ID!
  const secretKey = process.env.DOKU_SECRET_KEY!
  const appUrl    = process.env.NEXT_PUBLIC_APP_URL!

  const name  = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer'
  const email = user.email!

  const { data: profile } = await supabase.from('users').select('phone').eq('id', user.id).single()
  const rawPhone = (profile?.phone ?? '').replace(/[\s\-()]/g, '')
  const phone = rawPhone.startsWith('+')  ? rawPhone
              : rawPhone.startsWith('60') ? `+${rawPhone}`
              : rawPhone.startsWith('0')  ? `+6${rawPhone}`
              : '+601000000000'
  const label = doc.type === 'wasiat' ? 'Wasiat Islam' : 'General Will'

  let finalAmountSen: number = isBundle ? PRICING.bundle.amountSen : PRICING.single.amountSen
  let promoApplied = false

  if (promoCode) {
    const admin = createAdminClient()
    const { data: promo } = await admin
      .from('promo_codes')
      .select('*')
      .eq('code', promoCode.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    if (promo && !(promo.expires_at && new Date(promo.expires_at) < new Date())
        && (promo.max_uses === null || promo.used_count < promo.max_uses)) {
      finalAmountSen = Math.max(100, finalAmountSen - promo.discount_sen)
      promoApplied = true
      await admin.from('promo_codes').update({ used_count: promo.used_count + 1 }).eq('id', promo.id)
    }
  }

  // DOKU only allows: a-z A-Z 0-9 . - / * + , = _ : ' @ % and space
  const safeName = name.replace(/[^a-zA-Z0-9 .\-/*+,=_:'@%]/g, ' ').trim()
  const description = isBundle
    ? `WasiatHub Family Bundle - ${label} x2${promoApplied ? ' PROMO' : ''}`
    : `WasiatHub ${label}${promoApplied ? ' PROMO' : ''}`

  // invoice_number encodes documentId + plan so callback can look up both
  const invoiceNumber = `${documentId}_${isBundle ? 'bundle' : 'single'}`
  const requestId     = crypto.randomUUID()
  const timestamp     = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')

  const bodyObj = {
    order: {
      amount:              finalAmountSen,
      invoice_number:      invoiceNumber,
      currency:            'MYR',
      callback_url:        `${appUrl}/payment/${documentId}/success`,
      callback_url_cancel: `${appUrl}/payment/${documentId}`,
      auto_redirect:       true,
      line_items: [{ name: description, price: finalAmountSen, quantity: 1 }],
    },
    payment:  { payment_due_date: 60 },
    customer: { name: safeName, email, phone },
  }

  const bodyStr   = JSON.stringify(bodyObj)
  const signature = buildSignature(clientId, requestId, timestamp, CHECKOUT_PATH, bodyStr, secretKey)

  const res = await fetch(`${DOKU_API}${CHECKOUT_PATH}`, {
    method: 'POST',
    headers: {
      'Client-Id':        clientId,
      'Request-Id':       requestId,
      'Request-Timestamp': timestamp,
      'Signature':        signature,
      'Content-Type':     'application/json',
    },
    body: bodyStr,
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('DOKU error — status:', res.status, 'body:', JSON.stringify(data))
    console.error('DOKU request body sent:', bodyStr)
    const msg = data.error?.message ?? data.message ?? JSON.stringify(data)
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  return NextResponse.json({ billUrl: data.payment.url })
}
