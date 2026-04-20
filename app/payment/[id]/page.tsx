import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { MockPaymentButton } from '@/components/payment/MockPaymentButton'

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

  const docLabel = doc.type === 'wasiat'
    ? (ms ? 'Wasiat (Wasiat Islam)' : 'Wasiat (Islamic Will)')
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

        {/* Dev mode notice */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-800 text-center font-medium">
          DEV MODE — Billplz integration coming in Phase 14. Use the simulate button below.
        </div>

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
                  <li>✓ {ms ? 'Muat turun PDF (selepas tandatangan)' : 'PDF download (after signing)'}</li>
                  <li>✓ {ms ? 'Penghantaran melalui e-mel' : 'Email delivery'}</li>
                </ul>
              </div>
              <p className="text-lg font-bold shrink-0">RM 49.00</p>
            </div>

            <div className="border-t border-border pt-4 flex justify-between text-sm font-semibold">
              <span>{ms ? 'Jumlah' : 'Total'}</span>
              <span>RM 49.00</span>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="border border-border rounded-xl p-5 space-y-3">
          <p className="text-sm font-semibold">{ms ? 'Kaedah Pembayaran' : 'Payment Method'}</p>
          <div className="flex items-center gap-3 p-3 border border-primary/30 bg-primary/5 rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center text-primary text-xs font-bold">FPX</div>
            <div>
              <p className="text-sm font-medium">{ms ? 'Perbankan Dalam Talian (FPX)' : 'Online Banking (FPX)'}</p>
              <p className="text-xs text-muted-foreground">
                {ms ? 'melalui Billplz — semua bank Malaysia disokong' : 'via Billplz — all Malaysian banks supported'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <MockPaymentButton documentId={id} />
          <a
            href={reviewHref}
            className="block text-center text-sm text-muted-foreground hover:text-foreground transition py-2"
          >
            {ms ? '← Kembali ke semakan' : '← Back to review'}
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          {ms
            ? 'Dengan meneruskan, anda bersetuju dengan Terma Perkhidmatan kami. Dokumen ini dijana untuk tujuan maklumat dan mesti ditandatangani di hadapan saksi untuk sah dari segi undang-undang.'
            : 'By proceeding, you agree to our Terms of Service. This document is generated for informational purposes and must be signed in the presence of witnesses to be legally valid.'}
        </p>

      </div>
    </div>
  )
}
