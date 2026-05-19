import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { PaymentOptions } from '@/components/payment/PaymentOptions'
import { PRICING } from '@/lib/pricing'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PaymentPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const cookieStore = await cookies()
  const ms = (cookieStore.get('locale')?.value ?? 'ms') === 'ms'

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: doc } = await supabase
    .from('documents')
    .select('id, type, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!doc) redirect('/dashboard/documents')
  if (doc.status === 'completed') redirect(`/payment/${id}/success`)

  // Check if user has a bundle credit to use
  const { data: profile } = await supabase
    .from('users')
    .select('bundle_credits')
    .eq('id', user.id)
    .single()

  const bundleCredits = (profile as { bundle_credits?: number } | null)?.bundle_credits ?? 0
  const hasCredit = bundleCredits > 0

  const docLabel = doc.type === 'wasiat'
    ? (ms ? 'Wasiat Islam' : 'Islamic Will (Wasiat)')
    : (ms ? 'Surat Wasiat Am' : 'General Will')
  const reviewHref = doc.type === 'wasiat' ? `/wasiat/${id}/review` : `/will/${id}/review`

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">{ms ? 'Pembayaran' : 'Payment'}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {ms
              ? 'Lengkapkan pembayaran untuk menerima dokumen anda'
              : 'Complete your purchase to receive your document'}
          </p>
        </div>

        {/* Bundle credit banner — shown when user has a credit */}
        {hasCredit && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">🎁</span>
            <div>
              <p className="font-semibold text-emerald-800 text-sm">
                {ms ? 'Kredit Bundle Tersedia!' : 'Bundle Credit Available!'}
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                {ms
                  ? `Anda mempunyai ${bundleCredits} kredit bundle. Dokumen ini boleh dijana secara percuma.`
                  : `You have ${bundleCredits} bundle credit${bundleCredits > 1 ? 's' : ''}. This document can be generated for free.`}
              </p>
            </div>
          </div>
        )}

        {/* Order summary */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="bg-muted/40 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {ms ? 'Ringkasan Pesanan' : 'Order Summary'}
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-sm">{docLabel}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ms ? 'Jana dokumen sekali sahaja' : 'One-time document generation'}
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-0.5">
                  <li>✓ {ms ? 'Dokumen berstruktur mengikut undang-undang' : 'Legally structured document'}</li>
                  <li>✓ {ms ? 'Muat turun PDF' : 'PDF download'}</li>
                  <li>✓ {ms ? 'Penghantaran melalui e-mel' : 'Email delivery'}</li>
                </ul>
              </div>
              <p className="text-lg font-bold shrink-0">
                {hasCredit ? <span className="text-emerald-600">{ms ? 'Percuma' : 'Free'}</span> : PRICING.single.displayRM}
              </p>
            </div>
            <div className="border-t border-border pt-4 flex justify-between text-sm font-semibold">
              <span>{ms ? 'Jumlah' : 'Total'}</span>
              <span>{hasCredit ? (ms ? 'RM 0.00 (kredit)' : 'RM 0.00 (credit)') : PRICING.single.displayFull}</span>
            </div>
          </div>
        </div>

        {/* Payment method */}
        {!hasCredit && (
          <div className="border border-border rounded-xl px-5 py-4 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold shrink-0">{ms ? 'Kaedah Pembayaran' : 'Payment Method'}</p>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#003087] text-white tracking-wide">FPX</span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#00B14F] text-white tracking-wide">GrabPay</span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#1C4F9C] text-white tracking-wide">TnG</span>
            </div>
          </div>
        )}

        {/* Payment options (single / bundle / use credit) */}
        <PaymentOptions
          documentId={id}
          ms={ms}
          hasCredit={hasCredit}
          reviewHref={reviewHref}
          pricing={PRICING}
        />

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          {ms
            ? 'Dengan meneruskan, anda bersetuju dengan Terma Perkhidmatan kami. Tiada bayaran balik selepas PDF dijana. Sebarang permintaan bayaran balik hendaklah dihantar ke support@wasiathub.my. WasiatHub dikendalikan oleh WF Wealth Management Sdn. Bhd. (202101017850-M).'
            : 'By proceeding, you agree to our Terms of Service. No refunds after PDF is generated. Refund requests are handled by the WasiatHub team at support@wasiathub.my. WasiatHub is operated by WF Wealth Management Sdn. Bhd. (202101017850-M).'}
        </p>

      </div>
    </div>
  )
}
