import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WILL_STEPS } from '@/lib/formSteps'

interface Props {
  children: React.ReactNode
  params:   Promise<{ id: string; step: string }>
}

export default async function WillStepLayout({ children, params }: Props) {
  const { id, step } = await params
  const stepNum = parseInt(step, 10)

  if (isNaN(stepNum) || stepNum < 1 || stepNum > WILL_STEPS.length) {
    redirect(`/will/${id}/step/1`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: doc } = await supabase
    .from('documents')
    .select('id, type, status')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!doc) redirect('/dashboard/documents')
  if (doc.type !== 'general_will') redirect(`/wasiat/${id}/step/1`)
  if (doc.status === 'completed') redirect(`/${id}/review`)

  const { data: willData } = await supabase
    .from('will_data')
    .select('testator_info, executor, assets, beneficiaries, guardianship, backup_executor, witnesses, declaration')
    .eq('document_id', id)
    .single()

  if (willData) {
    const completedSteps = WILL_STEPS.filter((s) => !!willData[s.fieldKey as keyof typeof willData])
    const maxAllowedStep = completedSteps.length + 1

    if (stepNum > maxAllowedStep) {
      redirect(`/will/${id}/step/${maxAllowedStep}`)
    }
  }

  return <>{children}</>
}
