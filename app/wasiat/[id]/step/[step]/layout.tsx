import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WASIAT_STEPS } from '@/lib/formSteps'

interface Props {
  children:  React.ReactNode
  params:    Promise<{ id: string; step: string }>
}

export default async function WasiatStepLayout({ children, params }: Props) {
  const { id, step } = await params
  const stepNum = parseInt(step, 10)

  // Guard: valid step number
  if (isNaN(stepNum) || stepNum < 1 || stepNum > WASIAT_STEPS.length) {
    redirect(`/wasiat/${id}/step/1`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Guard: document must belong to this user and be of type wasiat
  const { data: doc } = await supabase
    .from('documents')
    .select('id, type, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!doc) redirect('/dashboard/documents')
  if (doc.type !== 'wasiat') redirect(`/will/${id}/step/1`)
  if (doc.status === 'completed') redirect(`/${id}/review`)

  // Guard: don't allow skipping ahead past first incomplete step
  const { data: wasiatData } = await supabase
    .from('wasiat_data')
    .select('testator_info, movable_assets, immovable_assets, beneficiaries, executor, backup_executor, witnesses, declaration')
    .eq('document_id', id)
    .single()

  if (wasiatData) {
    const completedSteps = WASIAT_STEPS.filter((s) => !!wasiatData[s.fieldKey as keyof typeof wasiatData])
    const maxAllowedStep = completedSteps.length + 1  // can go one beyond last complete

    if (stepNum > maxAllowedStep) {
      redirect(`/wasiat/${id}/step/${maxAllowedStep}`)
    }
  }

  return <>{children}</>
}
