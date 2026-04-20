import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { documentId } = await request.json()
  if (!documentId) return NextResponse.json({ error: 'Missing documentId' }, { status: 400 })

  // Verify document belongs to user
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .select('id, status, type')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (docError || !doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  if (doc.status === 'completed') {
    return NextResponse.json({ success: true, alreadyCompleted: true })
  }

  // Mark document as completed
  const now = new Date().toISOString()

  const { error: updateError } = await supabase
    .from('documents')
    .update({ status: 'completed', paid_at: now })
    .eq('id', documentId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Create a mock payment record
  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      document_id:      documentId,
      user_id:          user.id,
      billplz_bill_id:  `MOCK-${Date.now()}`,
      amount:           4900,   // in sen (RM 49.00)
      currency:         'MYR',
      status:           'paid',
      paid_at:          now,
    })

  if (paymentError) {
    // Payment record failure is non-fatal — document is already marked completed
    console.error('Failed to create payment record:', paymentError.message)
  }

  return NextResponse.json({ success: true })
}
