'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'

interface Props { ms: boolean }

export function ConsentGate({ ms }: Props) {
  const [pdpa, setPdpa]       = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const router = useRouter()

  async function handleConsent() {
    if (!pdpa) { setError(ms ? 'Sila tandakan persetujuan data untuk meneruskan.' : 'Please tick the data consent to proceed.'); return }
    setLoading(true)
    const res = await fetch('/api/user/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marketingConsent: marketing }),
    })
    if (res.ok) {
      window.location.href = '/dashboard/create'
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || (ms ? 'Ralat. Sila cuba lagi.' : 'Error. Please try again.'))
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold">
            {ms ? 'Persetujuan Data' : 'Data Consent'}
          </h1>
          <p className="text-xs text-muted-foreground">
            {ms ? 'Satu langkah sebelum mencipta dokumen' : 'One step before creating your document'}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {ms
            ? 'Untuk menjana dokumen wasiat anda, WasiatHub perlu menyimpan maklumat peribadi anda seperti nama penuh, No. IC, alamat, dan maklumat waris. Maklumat ini digunakan semata-mata untuk tujuan penjana dokumen.'
            : 'To generate your will document, WasiatHub needs to store your personal information such as full name, IC number, address, and beneficiary details. This information is used solely for document generation purposes.'}
        </p>

        {/* Mandatory PDPA consent */}
        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border-2 border-primary/20 bg-primary/5 hover:border-primary/40 transition">
          <input
            type="checkbox"
            checked={pdpa}
            onChange={e => { setPdpa(e.target.checked); setError('') }}
            className="mt-0.5 w-4 h-4 accent-primary shrink-0"
          />
          <span className="text-xs leading-relaxed">
            <span className="font-semibold text-foreground block mb-0.5">
              {ms ? '* Persetujuan Pemprosesan Data (Wajib)' : '* Data Processing Consent (Required)'}
            </span>
            {ms
              ? 'Saya bersetuju WasiatHub mengumpul dan menyimpan maklumat peribadi saya untuk tujuan menjana, menghantar dan menyimpan dokumen wasiat saya, selaras dengan '
              : 'I consent to WasiatHub collecting and storing my personal information for the purpose of generating, delivering and retaining my will document, in accordance with the '}
            <a href="/privacy" target="_blank" className="text-primary underline">{ms ? 'Dasar Privasi' : 'Privacy Policy'}</a>
            {ms ? ' dan ' : ' and '}
            <a href="/terms" target="_blank" className="text-primary underline">{ms ? 'Terma Penggunaan' : 'Terms of Use'}</a>.
          </span>
        </label>

        {/* Optional marketing consent */}
        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-border hover:bg-muted/30 transition">
          <input
            type="checkbox"
            checked={marketing}
            onChange={e => setMarketing(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-primary shrink-0"
          />
          <span className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground block mb-0.5">
              {ms ? 'Kemas Kini & Promosi (Pilihan)' : 'Updates & Promotions (Optional)'}
            </span>
            {ms
              ? 'Saya bersetuju menerima kemas kini, tips, dan tawaran promosi daripada WasiatHub melalui e-mel. Anda boleh berhenti langgan pada bila-bila masa.'
              : 'I agree to receive updates, tips, and promotional offers from WasiatHub via email. You can unsubscribe anytime.'}
          </span>
        </label>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <button
          onClick={handleConsent}
          disabled={loading}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading
            ? (ms ? 'Menyimpan...' : 'Saving...')
            : (ms ? 'Setuju & Teruskan' : 'Agree & Continue')}
        </button>

        <p className="text-[11px] text-muted-foreground text-center">
          {ms
            ? 'Persetujuan ini hanya diperlukan sekali sahaja.'
            : 'This consent is only required once.'}
        </p>
      </div>
    </div>
  )
}
