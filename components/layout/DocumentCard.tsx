'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { FileText, Download, Mail, ChevronRight } from 'lucide-react'
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

export function DocumentCard({ document: doc }: { document: DocumentRow }) {
  const t = useTranslations()

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
          <p className="font-medium text-sm">{typeLabel}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{createdDate}</p>
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
            download
            className="p-1.5 text-muted-foreground hover:text-foreground transition"
            title={t('payment.downloadPDF')}
          >
            <Download className="w-4 h-4" />
          </a>
        )}

        {isCompleted && (
          <button
            className="p-1.5 text-muted-foreground hover:text-foreground transition"
            title="Re-send email"
          >
            <Mail className="w-4 h-4" />
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
      </div>
    </div>
  )
}
