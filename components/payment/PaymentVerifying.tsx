'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface Props {
  documentId: string
  ms: boolean
}

export function PaymentVerifying({ documentId, ms }: Props) {
  const router = useRouter()

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 20 // 60 seconds (20 × 3s)

    const interval = setInterval(async () => {
      attempts++
      try {
        const res  = await fetch(`/api/payment/status/${documentId}`)
        const data = await res.json()
        if (data.completed) {
          clearInterval(interval)
          router.refresh()
        } else if (attempts >= maxAttempts) {
          clearInterval(interval)
          router.push(`/payment/${documentId}`)
        }
      } catch {
        if (attempts >= maxAttempts) {
          clearInterval(interval)
          router.push(`/payment/${documentId}`)
        }
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [documentId, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <h1 className="text-xl font-bold">
          {ms ? 'Mengesahkan Pembayaran...' : 'Verifying Payment...'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {ms
            ? 'Sila tunggu. Proses ini boleh mengambil masa sehingga 60 saat.'
            : 'Please wait. This may take up to 60 seconds.'}
        </p>
        <p className="text-xs text-muted-foreground">
          {ms
            ? 'Jangan tutup atau muat semula halaman ini.'
            : 'Do not close or refresh this page.'}
        </p>
      </div>
    </div>
  )
}
