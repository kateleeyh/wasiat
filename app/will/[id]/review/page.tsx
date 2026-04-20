import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WillReviewSection } from '@/components/review/WillReviewSection'
import type { WillRecord } from '@/types/database'

interface Props {
  params: Promise<{ id: string }>
}

export default async function WillReviewPage({ params }: Props) {
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
  if (doc.type !== 'general_will') redirect(`/wasiat/${id}/review`)

  const { data: willData } = await supabase
    .from('will_data')
    .select('*')
    .eq('document_id', id)
    .single() as { data: WillRecord | null }

  return (
    <div className="min-h-screen bg-background">
      <WillReviewSection
        documentId={id}
        willData={willData}
        docStatus={doc.status}
      />
    </div>
  )
}
