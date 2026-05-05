'use client'

import { useState } from 'react'
import { Loader2, Users, FileText, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import type { PRICING } from '@/lib/pricing'

interface Props {
  documentId: string
  ms: boolean
  hasCredit: boolean
  reviewHref: string
  pricing: typeof PRICING
}

export function PaymentOptions({ documentId, ms, hasCredit, reviewHref, pricing }: Props) {
  const [plan, setPlan] = useState<'single' | 'bundle'>('single')
  const [loading, setLoading] = useState(false)
  const [mockLoading, setMockLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // ─── Use existing bundle credit ───────────────────────────────────────────
  async function handleUseCredit() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/payment/use-credit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      window.location.href = `/payment/${documentId}/success`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  // ─── Pay via Billplz ──────────────────────────────────────────────────────
  async function handlePay() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/payment/create-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create payment')
      window.location.href = data.billUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }


  // ─── Has credit — just show "Use credit" button ───────────────────────────
  if (hasCredit) {
    return (
      <div className="space-y-3">
        <button
          onClick={handleUseCredit}
          disabled={loading}
          className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
          {loading
            ? (ms ? 'Memproses...' : 'Processing...')
            : (ms ? 'Guna Kredit Bundle — Percuma' : 'Use Bundle Credit — Free')}
        </button>
        {error && <p className="text-xs text-destructive text-center">{error}</p>}
        <a href={reviewHref} className="block text-center text-sm text-muted-foreground hover:text-foreground transition py-1">
          {ms ? '← Kembali ke semakan' : '← Back to review'}
        </a>
      </div>
    )
  }

  // ─── No credit — show single / bundle toggle ──────────────────────────────
  return (
    <div className="space-y-4">

      {/* Plan selector */}
      <div className="grid grid-cols-2 gap-3">
        {/* Single */}
        <button
          type="button"
          onClick={() => setPlan('single')}
          className={cn(
            'flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition text-left',
            plan === 'single'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/40'
          )}
        >
          <FileText className={cn('w-5 h-5', plan === 'single' ? 'text-primary' : 'text-muted-foreground')} />
          <p className={cn('text-sm font-semibold', plan === 'single' ? 'text-primary' : 'text-foreground')}>
            {ms ? 'Satu Dokumen' : 'Single'}
          </p>
          <p className="text-lg font-bold">{pricing.single.displayRM}</p>
          <p className="text-xs text-muted-foreground text-center">
            {ms ? '1 dokumen sahaja' : '1 document only'}
          </p>
        </button>

        {/* Bundle */}
        <button
          type="button"
          onClick={() => setPlan('bundle')}
          className={cn(
            'flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition relative text-left',
            plan === 'bundle'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-border hover:border-emerald-400'
          )}
        >
          {/* Save badge */}
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
            {ms ? `Jimat ${pricing.bundle.savingRM}` : `Save ${pricing.bundle.savingRM}`}
          </span>
          <Users className={cn('w-5 h-5', plan === 'bundle' ? 'text-emerald-600' : 'text-muted-foreground')} />
          <p className={cn('text-sm font-semibold', plan === 'bundle' ? 'text-emerald-700' : 'text-foreground')}>
            {ms ? 'Pakej Keluarga' : 'Family Bundle'}
          </p>
          <p className="text-lg font-bold">{pricing.bundle.displayRM}</p>
          <p className="text-xs text-muted-foreground text-center">
            {ms ? '2 dokumen' : '2 documents'}
          </p>
        </button>
      </div>

      {/* Bundle explanation — shown only when bundle is selected */}
      {plan === 'bundle' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm space-y-2">
          <p className="font-semibold text-emerald-800">
            {ms ? '🎁 Macam mana Pakej Keluarga berfungsi?' : '🎁 How does the Family Bundle work?'}
          </p>
          <ol className="text-xs text-emerald-700 space-y-1.5 list-decimal list-inside">
            <li>{ms ? 'Bayar RM 79 sekarang — dokumen ini terus dijana.' : 'Pay RM 79 now — this document is generated immediately.'}</li>
            <li>{ms ? '1 kredit disimpan dalam akaun anda.' : '1 credit is saved in your account.'}</li>
            <li>{ms ? 'Buat dokumen kedua bila-bila masa — guna kredit, percuma!' : 'Create the 2nd document anytime — use the credit, it\'s free!'}</li>
          </ol>
          <p className="text-xs text-emerald-600 font-medium">
            {ms
              ? '✓ Sesuai untuk pasangan suami isteri, adik-beradik, atau sesiapa sahaja.'
              : '✓ Great for couples, siblings, or anyone who needs 2 documents.'}
          </p>
        </div>
      )}

      {/* Pay button */}
      <button
        onClick={handlePay}
        disabled={loading}
        className={cn(
          'w-full py-3.5 rounded-xl font-semibold text-sm transition disabled:opacity-60 flex items-center justify-center gap-2 text-white',
          plan === 'bundle' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:opacity-90'
        )}
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" />{ms ? 'Menghala ke Billplz...' : 'Redirecting to Billplz...'}</>
        ) : plan === 'bundle' ? (
          <>{ms ? `Bayar ${pricing.bundle.displayRM} — Pakej Keluarga` : `Pay ${pricing.bundle.displayRM} — Family Bundle`}</>
        ) : (
          <>{ms ? `Bayar ${pricing.single.displayRM}` : `Pay ${pricing.single.displayRM}`}</>
        )}
      </button>

      {error && <p className="text-xs text-destructive text-center">{error}</p>}

      <a href={reviewHref} className="block text-center text-sm text-muted-foreground hover:text-foreground transition py-1">
        {ms ? '← Kembali ke semakan' : '← Back to review'}
      </a>

    </div>
  )
}
