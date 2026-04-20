import { createClient } from '@/lib/supabase/server'
import { WILL_STEPS } from '@/lib/formSteps'
import { WillStepContent } from '@/components/forms/will/WillStepContent'
import type { WillRecord } from '@/types/database'

interface Props {
  params: Promise<{ id: string; step: string }>
}

export default async function WillStepPage({ params }: Props) {
  const { id, step } = await params
  const stepNum = parseInt(step, 10)

  const supabase = await createClient()

  const [willResult, docResult] = await Promise.all([
    supabase.from('will_data').select('*').eq('document_id', id).single(),
    supabase.from('documents').select('language').eq('id', id).single(),
  ])
  const willData = willResult.data as WillRecord | null
  const doc      = docResult.data

  const docLanguage = (doc?.language ?? 'ms') as 'ms' | 'en'

  const completedFields: Record<string, boolean> = {}
  WILL_STEPS.forEach((s) => {
    completedFields[s.fieldKey] = !!(willData && willData[s.fieldKey as keyof WillRecord])
  })

  return (
    <WillStepContent
      documentId={id}
      currentStep={stepNum}
      steps={WILL_STEPS}
      completedFields={completedFields}
      savedData={willData}
      docLanguage={docLanguage}
    />
  )
}
