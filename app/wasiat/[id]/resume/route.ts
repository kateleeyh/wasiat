import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WASIAT_STEPS, getFirstIncompleteStep } from '@/lib/formSteps'
import type { WasiatRecord } from '@/types/database'

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
  if (doc.status === 'completed') redirect(`/wasiat/${id}/review`)

  const { data: wasiatData } = await supabase
    .from('wasiat_data')
    .select('testator_info, movable_assets, immovable_assets, beneficiaries, executor, backup_executor, witnesses, declaration')
    .eq('document_id', id)
    .single() as { data: Partial<WasiatRecord> | null }

  const resumeStep = wasiatData
    ? getFirstIncompleteStep(wasiatData as Record<string, unknown>, WASIAT_STEPS)
    : 1

  redirect(`/wasiat/${id}/step/${resumeStep}`)
}
