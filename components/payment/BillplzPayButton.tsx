'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface Props {
  documentId: string
  amountLabel: string
}

export function BillplzPayButton({ documentId, amountLabel }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handlePay() {
    setLoading(true)
    setError('')

    try {
      const res  = await fetch('/api/payment/create-bill', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ documentId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create payment')
      window.location.href = data.billUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting to Billplz...
          </>
        ) : (
          <>Pay with FPX (Online Banking) — {amountLabel}</>
        )}
      </button>
      {error && <p className="text-xs text-destructive text-center">{error}</p>}
    </div>
  )
}
