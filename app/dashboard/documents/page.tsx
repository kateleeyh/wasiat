import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FileText, PlusCircle } from 'lucide-react'
import { DocumentCard } from '@/components/layout/DocumentCard'
import type { DocumentWithStatus } from '@/types/database'

export default async function DocumentsPage() {
  const t = await getTranslations()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: documents } = await supabase
    .from('documents_with_status')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false }) as { data: DocumentWithStatus[] | null }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">{t('dashboard.myDocuments')}</h1>
        <Link
          href="/dashboard/create"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
        >
          <PlusCircle className="w-4 h-4" />
          {t('dashboard.createNew')}
        </Link>
      </div>

      {!documents || documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-16 text-center">
          <FileText className="w-10 h-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-sm mb-4">{t('dashboard.noDocuments')}</p>
          <Link
            href="/dashboard/create"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
          >
            <PlusCircle className="w-4 h-4" />
            {t('dashboard.createNew')}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  )
}
