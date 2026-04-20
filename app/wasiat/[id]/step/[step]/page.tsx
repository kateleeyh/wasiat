import { createClient } from '@/lib/supabase/server'
import { WASIAT_STEPS } from '@/lib/formSteps'
import { FormShell } from '@/components/forms/FormShell'
import { WasiatStepContent } from '@/components/forms/wasiat/WasiatStepContent'
import type { WasiatRecord } from '@/types/database'

interface Props {
  params: Promise<{ id: string; step: string }>
}

export default async function WasiatStepPage({ params }: Props) {
  const { id, step } = await params
  const stepNum = parseInt(step, 10)

  const supabase = await createClient()
  const { data: wasiatData } = await supabase
    .from('wasiat_data')
    .select('*')
    .eq('document_id', id)
    .single() as { data: WasiatRecord | null }

  // Build completed fields map for the form shell
  const completedFields: Record<string, boolean> = {}
  WASIAT_STEPS.forEach((s) => {
    completedFields[s.fieldKey] = !!(wasiatData && wasiatData[s.fieldKey as keyof WasiatRecord])
  })

  return (
    <WasiatStepContent
      documentId={id}
      currentStep={stepNum}
      steps={WASIAT_STEPS}
      completedFields={completedFields}
      savedData={wasiatData}
    />
  )
}
