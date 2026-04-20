'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'

interface Props {
  documentId:     string
  existingPdfUrl: string | null
}

export function DownloadButton({ documentId, existingPdfUrl }: Props) {
  const [loading, setLoading]   = useState(false)
  const [pdfUrl, setPdfUrl]     = useState<string | null>(existingPdfUrl)
  const [error, setError]       = useState('')

  async function callGenerate() {
    const res = await fetch('/api/documents/generate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ documentId }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Generation failed')
    return data
  }

  async function handleGenerate() {
    setLoading(true)
    setError('')

    try {
      let data: { pdf_url?: string }
      try {
        data = await callGenerate()
      } catch {
        // First attempt failed — likely a cold-start issue. Retry once after a short delay.
        await new Promise(r => setTimeout(r, 2000))
        data = await callGenerate()
      }

      setPdfUrl(data.pdf_url ?? null)

      if (data.pdf_url) {
        window.open(data.pdf_url, '_blank')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (pdfUrl) {
    return (
      <div className="space-y-2">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
        <p className="text-xs text-muted-foreground">
          A copy has also been sent to your registered email address.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Generate & Download PDF
          </>
        )}
      </button>
      {loading && (
        <p className="text-xs text-muted-foreground">
          This may take a few seconds. The PDF will open automatically when ready.
        </p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
