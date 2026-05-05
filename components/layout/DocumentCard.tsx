'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { FileText, Download, Mail, ChevronRight, Loader2, CheckCircle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentRow {
  id: string
  type: 'wasiat' | 'general_will'
  status: 'draft' | 'completed'
  language: 'ms' | 'en'
  created_at: string
  updated_at: string
  pdf_url: string | null
  payment_status: string | null
}

export function DocumentCard({ document: doc, testatorName }: { document: DocumentRow; testatorName?: string }) {
  const t = useTranslations()
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [emailError, setEmailError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch('/api/documents/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: doc.id }),
      })
      if (res.ok) window.location.reload()
      else setDeleting(false)
    } catch {
      setDeleting(false)
    }
  }

  async function handleResendEmail() {
    setEmailState('sending')
    try {
      const res  = await fetch('/api/documents/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: doc.id }),
      })
      const data = await res.json()
      if (res.ok) {
        setEmailState('sent')
        setTimeout(() => setEmailState('idle'), 3000)
      } else {
        setEmailState('error')
        setEmailError(data.error ?? 'Failed to send')
      }
    } catch {
      setEmailState('error')
      setEmailError('Network error')
    }
  }

  const isCompleted = doc.status === 'completed'
  const docPath = doc.type === 'wasiat' ? 'wasiat' : 'will'

  const typeLabel =
    doc.type === 'wasiat'
      ? t('documentType.wasiat')
      : t('documentType.generalWill')

  const createdDate = new Date(doc.created_at).toLocaleDateString('ms-MY', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-xl px-5 py-4 hover:shadow-sm transition">
      <div className="flex items-center gap-4">
        <div className={cn(
          'p-2 rounded-lg',
          doc.type === 'wasiat' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
        )}>
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-sm">{testatorName ?? typeLabel}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{typeLabel} · {createdDate}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={cn(
          'text-xs px-2.5 py-1 rounded-full font-medium',
          isCompleted
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-amber-100 text-amber-700'
        )}>
          {isCompleted ? t('dashboard.completed') : t('dashboard.draft')}
        </span>

        {isCompleted && doc.pdf_url && (
          <a
            href={doc.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-muted-foreground hover:text-foreground transition"
            title={t('payment.downloadPDF')}
          >
            <Download className="w-4 h-4" />
          </a>
        )}

        {isCompleted && (
          <button
            onClick={handleResendEmail}
            disabled={emailState === 'sending'}
            className={cn(
              'p-1.5 transition',
              emailState === 'sent' ? 'text-emerald-600' : emailState === 'error' ? 'text-destructive' : 'text-muted-foreground hover:text-foreground'
            )}
            title={emailState === 'sent' ? 'Email sent!' : emailState === 'error' ? emailError : 'Re-send email'}
          >
            {emailState === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" />
              : emailState === 'sent' ? <CheckCircle className="w-4 h-4" />
              : <Mail className="w-4 h-4" />}
          </button>
        )}

        {!isCompleted && (
          <Link
            href={`/${docPath}/${doc.id}/resume`}
            className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
          >
            {t('common.continueEditing')}
            <ChevronRight className="w-3 h-3" />
          </Link>
        )}

        {/* Delete button */}
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 text-muted-foreground/50 hover:text-destructive transition"
            title="Delete document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg px-2 py-1">
            <span className="text-xs text-destructive font-medium">Delete?</span>
            <button onClick={handleDelete} disabled={deleting}
              className="text-xs text-destructive font-bold hover:underline disabled:opacity-50">
              {deleting ? '...' : 'Yes'}
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="text-xs text-muted-foreground hover:underline">
              No
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
