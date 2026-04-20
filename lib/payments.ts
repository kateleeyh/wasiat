import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export const PRICES = {
  wasiat: 49.00,
  general_will: 49.00,
  bundle: 79.00,
} as const

// ─── Create a Billplz bill ────────────────────────────────────────────────────

export async function createBillplzBill(documentId: string, amount: number, email: string, description: string) {
  const res = await fetch(`${process.env.BILLPLZ_BASE_URL}/bills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${process.env.BILLPLZ_API_KEY}:`).toString('base64')}`,
    },
    body: new URLSearchParams({
      collection_id: process.env.BILLPLZ_COLLECTION_ID!,
      email,
      name: email,
      amount: String(Math.round(amount * 100)), // Billplz uses cents
      description,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?documentId=${documentId}`,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Billplz error: ${err}`)
  }

  return res.json() as Promise<{ id: string; url: string }>
}

// ─── Create payment record ────────────────────────────────────────────────────

export async function createPaymentRecord(
  documentId: string,
  userId: string,
  billplzBillId: string,
  amount: number
) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('payments')
    .insert({
      document_id: documentId,
      user_id: userId,
      billplz_bill_id: billplzBillId,
      amount,
      currency: 'MYR',
      status: 'pending',
    })
    .select('id')
    .single()

  if (error) throw error
  return data
}

// ─── Confirm payment (called from webhook) ────────────────────────────────────

export async function confirmPayment(billplzBillId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('payments')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('billplz_bill_id', billplzBillId)

  if (error) throw error
  // Trigger in DB will auto-update documents.status to 'completed'
}

// ─── Get payments for user ────────────────────────────────────────────────────

export async function getUserPayments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('payments')
    .select('*, documents(type, language)')
    .eq('user_id', user.id)
    .eq('status', 'paid')
    .order('paid_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

// ─── Verify Billplz X-Signature ──────────────────────────────────────────────

export function verifyBillplzSignature(params: Record<string, string>, receivedSig: string): boolean {
  const crypto = require('crypto')
  const xSignatureKey = process.env.BILLPLZ_X_SIGNATURE!

  // Billplz x-signature: HMAC-SHA256 of sorted key|value pairs
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}${params[k]}`)
    .join('|')

  const expected = crypto
    .createHmac('sha256', xSignatureKey)
    .update(sorted)
    .digest('hex')

  return expected === receivedSig
}
