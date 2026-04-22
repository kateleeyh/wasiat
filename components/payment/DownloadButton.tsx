'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'

interface Props {
  documentId: string
  existingPdfUrl: string | null
}

function makeDocRef(type: string, id: string) {
  const prefix = type === 'wasiat' ? 'WST' : 'WLL'
  return `${prefix}-${new Date().getFullYear()}-${id.slice(0, 6).toUpperCase()}`
}

export function DownloadButton({ documentId, existingPdfUrl }: Props) {
  const [loading, setLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(existingPdfUrl)
  const [error, setError] = useState('')

  async function handleGenerate() {
    setLoading(true)
    setError('')

    try {
      // 1. Fetch document data from server
      const dataRes = await fetch('/api/documents/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId }),
      })
      const docPayload = await dataRes.json()
      if (!dataRes.ok) throw new Error(docPayload.error ?? 'Failed to load document data')

      const { type, language, data } = docPayload
      const docRef = makeDocRef(type, documentId)
      const generatedAt = new Date().toISOString()

      // 2. Generate PDF client-side (browser supports WebAssembly)
      const { pdf } = await import('@react-pdf/renderer')
      const React = (await import('react')).default

      let element: React.ReactElement
      let testatorName: string
      let testatorEmail: string
      let fileName: string

      if (type === 'wasiat') {
        const { WasiatPdf } = await import('@/lib/pdf/WasiatPdf')
        element = React.createElement(WasiatPdf, { data, docRef, generatedAt })
        testatorName = data.testator_info?.full_name ?? ''
        testatorEmail = data.testator_info?.email ?? ''
        fileName = `Wasiat-${testatorName.replace(/\s+/g, '-')}.pdf`
      } else {
        const { WillPdf } = await import('@/lib/pdf/WillPdf')
        element = React.createElement(WillPdf, { data, docRef, generatedAt, language: (language ?? 'ms') as 'ms' | 'en' })
        testatorName = data.testator_info?.full_name ?? ''
        testatorEmail = data.testator_info?.email ?? ''
        fileName = `LastWill-${testatorName.replace(/\s+/g, '-')}.pdf`
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await pdf(element as any).toBlob()

      // 3. Trigger browser download immediately
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = fileName
      a.click()
      URL.revokeObjectURL(objectUrl)

      // 4. Upload to storage + send email in background
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1]
          const finalRes = await fetch('/api/documents/finalize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documentId, pdfBase64: base64, fileName, testatorName, testatorEmail, docType: type, language }),
          })
          const finalData = await finalRes.json()
          if (finalData.pdf_url) setPdfUrl(finalData.pdf_url)
        } catch (e) {
          console.error('Finalize error:', e)
        }
      }
      reader.readAsDataURL(blob)

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
            {`Generating PDF...`}
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            {`Generate & Download PDF`}
          </>
        )}
      </button>
      {loading && (
        <p className="text-xs text-muted-foreground">
          Generating in your browser — this may take a few seconds.
        </p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
