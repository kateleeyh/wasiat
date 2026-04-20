'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  documentId: string
}

export function MockPaymentButton({ documentId }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const router                = useRouter()

  async function handlePay() {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/payment/mock-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Payment failed')
      }

      router.push(`/payment/${documentId}/success`)
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
        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Processing...
          </span>
        ) : (
          'Simulate Payment — RM 49.00'
        )}
      </button>
      {error && (
        <p className="text-xs text-destructive text-center">{error}</p>
      )}
    </div>
  )
}
