import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WasiatReviewSection } from '@/components/review/WasiatReviewSection'
import type { WasiatRecord } from '@/types/database'

interface Props {
  params: Promise<{ id: string }>
}

export default async function WasiatReviewPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: doc } = await supabase
    .from('documents')
    .select('id, type, status, language')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!doc) redirect('/dashboard/documents')
  if (doc.type !== 'wasiat') redirect(`/will/${id}/review`)

  const { data: wasiatData } = await supabase
    .from('wasiat_data')
    .select('*')
    .eq('document_id', id)
    .single() as { data: WasiatRecord | null }

  return (
    <div className="min-h-screen bg-background">
      <WasiatReviewSection
        documentId={id}
        wasiatData={wasiatData}
        docStatus={doc.status}
      />
    </div>
  )
}
