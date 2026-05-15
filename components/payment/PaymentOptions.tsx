'use client'

import { useState } from 'react'
import { Loader2, Users, FileText, Gift, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PRICING } from '@/lib/pricing'

interface Props {
  documentId: string
  ms: boolean
  hasCredit: boolean
  reviewHref: string
  pricing: typeof PRICING
  testMode?: boolean
}

interface PromoResult {
  valid: boolean
  code: string
  description: string
  finalSen: number
  finalRM: string
  savingRM: string
}

export function PaymentOptions({ documentId, ms, hasCredit, reviewHref, pricing, testMode }: Props) {
  const [plan, setPlan]           = useState<'single' | 'bundle'>('single')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [promoInput, setPromoInput] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoResult, setPromoResult]   = useState<PromoResult | null>(null)
  const [promoError, setPromoError]     = useState('')
  const [mockLoading, setMockLoading]   = useState(false)

  async function handleUseCredit() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/payment/use-credit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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

  async function handleApplyPromo() {
    if (!promoInput.trim()) return
    setPromoLoading(true); setPromoError(''); setPromoResult(null)
    try {
      const res = await fetch('/api/payment/validate-promo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoInput.trim(), plan }),
      })
      const data = await res.json()
      if (!res.ok) { setPromoError(data.error ?? 'Invalid code'); return }
      setPromoResult(data)
    } catch {
      setPromoError(ms ? 'Ralat. Sila cuba lagi.' : 'Error. Please try again.')
    } finally {
      setPromoLoading(false)
    }
  }

  async function handleMock() {
    setMockLoading(true); setError('')
    try {
      const res = await fetch('/api/payment/mock-complete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      window.location.href = `/payment/${documentId}/success`
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setMockLoading(false)
    }
  }

  async function handlePay() {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/payment/create-bill', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, plan, promoCode: promoResult?.code }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create payment')
      window.location.href = data.billUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  const displayPrice = promoResult
    ? promoResult.finalRM
    : plan === 'bundle' ? pricing.bundle.displayRM : pricing.single.displayRM

  if (hasCredit) {
    return (
      <div className="space-y-3">
        <button onClick={handleUseCredit} disabled={loading}
          className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
          {loading ? (ms ? 'Memproses...' : 'Processing...') : (ms ? 'Guna Kredit Bundle — Percuma' : 'Use Bundle Credit — Free')}
        </button>
        {error && <p className="text-xs text-destructive text-center">{error}</p>}
        <a href={reviewHref} className="block text-center text-sm text-muted-foreground hover:text-foreground transition py-1">
          {ms ? '← Kembali ke semakan' : '← Back to review'}
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* Plan selector */}
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => { setPlan('single'); setPromoResult(null); setPromoError('') }}
          className={cn('flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition text-left',
            plan === 'single' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40')}>
          <FileText className={cn('w-5 h-5', plan === 'single' ? 'text-primary' : 'text-muted-foreground')} />
          <p className={cn('text-sm font-semibold', plan === 'single' ? 'text-primary' : 'text-foreground')}>
            {ms ? 'Satu Dokumen' : 'Single'}
          </p>
          <p className="text-lg font-bold">{pricing.single.displayRM}</p>
          <p className="text-xs text-muted-foreground text-center">{ms ? '1 dokumen sahaja' : '1 document only'}</p>
        </button>

        <button type="button" onClick={() => { setPlan('bundle'); setPromoResult(null); setPromoError('') }}
          className={cn('flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition relative text-left',
            plan === 'bundle' ? 'border-emerald-500 bg-emerald-50' : 'border-border hover:border-emerald-400')}>
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
            {ms ? `Jimat ${pricing.bundle.savingRM}` : `Save ${pricing.bundle.savingRM}`}
          </span>
          <Users className={cn('w-5 h-5', plan === 'bundle' ? 'text-emerald-600' : 'text-muted-foreground')} />
          <p className={cn('text-sm font-semibold', plan === 'bundle' ? 'text-emerald-700' : 'text-foreground')}>
            {ms ? 'Pakej Keluarga' : 'Family Bundle'}
          </p>
          <p className="text-lg font-bold">{pricing.bundle.displayRM}</p>
          <p className="text-xs text-muted-foreground text-center">{ms ? '2 dokumen' : '2 documents'}</p>
        </button>
      </div>

      {/* Bundle explanation */}
      {plan === 'bundle' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm space-y-2">
          <p className="font-semibold text-emerald-800">
            {ms ? '🎁 Macam mana Pakej Keluarga berfungsi?' : '🎁 How does the Family Bundle work?'}
          </p>
          <ol className="text-xs text-emerald-700 space-y-1.5 list-decimal list-inside">
            <li>{ms ? 'Bayar sekarang — dokumen ini terus dijana.' : 'Pay now — this document is generated immediately.'}</li>
            <li>{ms ? '1 kredit disimpan dalam akaun anda.' : '1 credit is saved in your account.'}</li>
            <li>{ms ? 'Buat dokumen kedua bila-bila masa — guna kredit, percuma!' : 'Create the 2nd document anytime — use the credit, free!'}</li>
          </ol>
        </div>
      )}

      {/* Promo code */}
      <div className="border border-border rounded-xl p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {ms ? 'Kod Promosi (jika ada)' : 'Promo Code (if any)'}
        </p>
        {promoResult ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-emerald-800">{promoResult.code}</p>
                <p className="text-[10px] text-emerald-600">{ms ? `Diskaun ${promoResult.savingRM}` : `${promoResult.savingRM} off`}</p>
              </div>
            </div>
            <button onClick={() => { setPromoResult(null); setPromoInput('') }}
              className="text-xs text-emerald-600 hover:underline">
              {ms ? 'Buang' : 'Remove'}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={promoInput}
              onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoError('') }}
              onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
              placeholder={ms ? 'Masukkan kod...' : 'Enter code...'}
              className="flex-1 border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
            />
            <button onClick={handleApplyPromo} disabled={promoLoading || !promoInput.trim()}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-700 transition disabled:opacity-50">
              {promoLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : (ms ? 'Guna' : 'Apply')}
            </button>
          </div>
        )}
        {promoError && <p className="text-xs text-destructive">{promoError}</p>}
      </div>

      {/* Test mode simulate button */}
      {testMode && (
        <div className="space-y-2">
          <div className="relative flex items-center gap-2">
            <div className="flex-1 border-t border-dashed border-amber-300" />
            <span className="text-[10px] text-amber-600 font-medium whitespace-nowrap bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {ms ? 'MOD UJIAN' : 'TEST MODE'}
            </span>
            <div className="flex-1 border-t border-dashed border-amber-300" />
          </div>
          <button onClick={handleMock} disabled={mockLoading}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition disabled:opacity-60 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white">
            {mockLoading
              ? <><Loader2 className="w-4 h-4 animate-spin" />{ms ? 'Memproses...' : 'Processing...'}</>
              : (ms ? 'Simulasi Pembayaran' : 'Simulate Payment')}
          </button>
        </div>
      )}

      {/* Pay button */}
      <button onClick={handlePay} disabled={loading}
        className={cn('w-full py-3.5 rounded-xl font-semibold text-sm transition disabled:opacity-60 flex items-center justify-center gap-2 text-white',
          plan === 'bundle' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-primary hover:opacity-90')}>
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" />{ms ? 'Menghala...' : 'Redirecting...'}</>
        ) : (
          <>{ms ? `Bayar ${displayPrice}` : `Pay ${displayPrice}`}
            {promoResult && <span className="text-xs opacity-80 line-through ml-1">
              {plan === 'bundle' ? pricing.bundle.displayRM : pricing.single.displayRM}
            </span>}
          </>
        )}
      </button>

      {error && <p className="text-xs text-destructive text-center">{error}</p>}

      <a href={reviewHref} className="block text-center text-sm text-muted-foreground hover:text-foreground transition py-1">
        {ms ? '← Kembali ke semakan' : '← Back to review'}
      </a>
    </div>
  )
}
