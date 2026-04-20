import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WILL_STEPS, getFirstIncompleteStep } from '@/lib/formSteps'
import type { WillRecord } from '@/types/database'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: doc } = await supabase
    .from('documents')
    .select('id, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!doc) redirect('/dashboard/documents')
  if (doc.status === 'completed') redirect(`/will/${id}/review`)

  const { data: willData } = await supabase
    .from('will_data')
    .select('testator_info, executor, assets, beneficiaries, guardianship, backup_executor, witnesses, declaration')
    .eq('document_id', id)
    .single() as { data: Partial<WillRecord> | null }

  const resumeStep = willData
    ? getFirstIncompleteStep(willData as Record<string, unknown>, WILL_STEPS)
    : 1

  redirect(`/will/${id}/step/${resumeStep}`)
}
