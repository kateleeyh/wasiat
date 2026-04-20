import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { DownloadButton } from '@/components/payment/DownloadButton'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PaymentSuccessPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const cookieStore = await cookies()
  const ms = (cookieStore.get('locale')?.value ?? 'ms') === 'ms'

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: doc } = await supabase
    .from('documents')
    .select('id, type, status, paid_at, pdf_url')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!doc) redirect('/dashboard/documents')
  if (doc.status !== 'completed') redirect(`/payment/${id}`)

  const isWasiat = doc.type === 'wasiat'
  const paidAt   = doc.paid_at
    ? new Date(doc.paid_at).toLocaleDateString('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">

        {/* Success icon */}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Message */}
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {ms ? 'Pembayaran Berjaya!' : 'Payment Successful!'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {ms
              ? `Dokumen ${isWasiat ? 'Wasiat' : 'Surat Wasiat Am'} anda telah dibuka.`
              : `Your ${isWasiat ? 'Wasiat' : 'General Will'} document has been unlocked.`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {ms ? `Dibayar pada ${paidAt}` : `Paid on ${paidAt}`}
          </p>
        </div>

        {/* PDF download */}
        <DownloadButton documentId={id} existingPdfUrl={doc.pdf_url} />

        {/* Legal basis note */}
        {isWasiat && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left space-y-1">
            <p className="text-xs font-semibold text-emerald-800">
              {ms ? '✓ Asas Perundangan Wasiat Ini' : '✓ Legal Basis of This Wasiat'}
            </p>
            <p className="text-xs text-emerald-700 leading-relaxed">
              {ms
                ? 'Dokumen ini disediakan berdasarkan prinsip Fiqh mazhab Syafi\'i yang diterima pakai secara universal di Malaysia. Ia selaras dengan Undang-Undang Keluarga Islam yang berkuat kuasa di semua negeri Malaysia.'
                : "This document follows Shafi'i fiqh principles universally accepted across all Malaysian states, consistent with the Islamic Family Law enactments in force throughout Malaysia."}
            </p>
          </div>
        )}

        {/* Next steps */}
        <div className="bg-muted/40 border border-border rounded-xl p-5 text-left space-y-3">
          <p className="text-sm font-semibold">
            {ms ? 'Langkah Seterusnya' : 'Next Steps'}
          </p>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
            {isWasiat ? (
              ms ? (
                <>
                  <li>Cetak dokumen Wasiat PDF</li>
                  <li>Tandatangan di hadapan <strong className="text-foreground">2 orang saksi Muslim yang layak</strong> secara serentak</li>
                  <li>Kesemua pihak menandatangani pada baris yang disediakan</li>
                  <li>Daftarkan di <strong className="text-foreground">Jabatan Agama Islam negeri anda</strong> — prosedur pendaftaran berbeza mengikut negeri (amat disyorkan)</li>
                  <li>Simpan dokumen asal di tempat selamat dan maklumkan Wasi anda</li>
                </>
              ) : (
                <>
                  <li>Print the Wasiat PDF</li>
                  <li>Sign in front of <strong className="text-foreground">2 qualified Muslim witnesses</strong> simultaneously</li>
                  <li>All parties sign on the designated lines</li>
                  <li>Register at your <strong className="text-foreground">State Islamic Religious Department</strong> — registration procedures vary by state (highly recommended)</li>
                  <li>Store the original safely and inform your Wasi (executor)</li>
                </>
              )
            ) : (
              ms ? (
                <>
                  <li>Cetak dokumen Surat Wasiat PDF</li>
                  <li>Tandatangan di hadapan <strong className="text-foreground">2 orang saksi</strong> (bukan penerima manfaat) secara serentak</li>
                  <li>Ketiga-tiga pihak menandatangani pada masa yang sama</li>
                  <li>Simpan dokumen asal di tempat selamat dan maklumkan pelaksana anda</li>
                </>
              ) : (
                <>
                  <li>Print the Will PDF</li>
                  <li>Sign in front of <strong className="text-foreground">2 witnesses</strong> (not beneficiaries) simultaneously</li>
                  <li>All 3 parties sign at the same time</li>
                  <li>Store the original safely and inform your executor</li>
                </>
              )
            )}
          </ol>

          {/* State disclaimer */}
          <p className="text-xs text-muted-foreground border-t border-border pt-3 leading-relaxed italic">
            {ms
              ? 'WasiatHub tidak memberikan nasihat guaman. Sila rujuk Peguam Syarie yang bertauliah jika anda memerlukan panduan undang-undang khusus berkaitan negeri anda.'
              : 'WasiatHub does not provide legal advice. Please consult a qualified Peguam Syarie (Syariah lawyer) for state-specific legal guidance.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/dashboard/documents"
            className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted/50 transition text-center"
          >
            {ms ? 'Dokumen Saya' : 'My Documents'}
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition text-center"
          >
            {ms ? 'Papan Pemuka' : 'Dashboard'}
          </Link>
        </div>

      </div>
    </div>
  )
}
