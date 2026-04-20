'use client'

import { useState, useCallback } from 'react'
import { FormShell } from '@/components/forms/FormShell'
import { WASIAT_STEPS } from '@/lib/formSteps'
import { useStepSave } from '@/hooks/useStepSave'
import { Step1TestatorInfo }    from '@/components/forms/wasiat/steps/Step1TestatorInfo'
import { Step2MovableAssets }   from '@/components/forms/wasiat/steps/Step2MovableAssets'
import { Step3ImmovableAssets } from '@/components/forms/wasiat/steps/Step3ImmovableAssets'
import { Step4Beneficiaries }   from '@/components/forms/wasiat/steps/Step4Beneficiaries'
import { Step5Executor }        from '@/components/forms/wasiat/steps/Step5Executor'
import { Step6Witnesses }       from '@/components/forms/wasiat/steps/Step6Witnesses'
import { Step7Declaration }     from '@/components/forms/wasiat/steps/Step7Declaration'
import type { WasiatRecord, WasiatPrimaryExecutor, WasiatBackupExecutor } from '@/types/database'
import type { StepDefinition } from '@/lib/formSteps'

interface Props {
  documentId:      string
  currentStep:     number
  steps:           StepDefinition[]
  completedFields: Record<string, boolean>
  savedData:       WasiatRecord | null
}

export function WasiatStepContent({ documentId, currentStep, steps, completedFields, savedData }: Props) {
  const fieldKey = WASIAT_STEPS[currentStep - 1]?.fieldKey ?? ''

  const { saveAndNext, saveAndNextMulti, autoSave, isSaving } = useStepSave({
    documentId,
    docType:    'wasiat',
    fieldKey,
    currentStep,
    totalSteps: WASIAT_STEPS.length,
  })

  // Current step's form data (used by onNext)
  const [stepData,   setStepData]   = useState<unknown>(null)
  const [isValid,    setIsValid]     = useState(false)

  // Step 5 needs two separate fields
  const [primaryData, setPrimaryData] = useState<WasiatPrimaryExecutor | null>(null)
  const [backupData,  setBackupData]  = useState<WasiatBackupExecutor | null>(null)

  const handleChange = useCallback((data: unknown) => {
    setStepData(data)
    autoSave(data)
  }, [autoSave])

  const handleNext = useCallback(async () => {
    if (currentStep === 5) {
      // Executor step: save both executor and backup_executor columns
      await saveAndNextMulti([
        { fieldKey: 'executor',        data: primaryData },
        { fieldKey: 'backup_executor', data: backupData },
      ])
    } else {
      await saveAndNext(stepData)
    }
  }, [currentStep, saveAndNext, saveAndNextMulti, stepData, primaryData, backupData])

  function renderStep() {
    switch (currentStep) {
      case 1:
        return (
          <Step1TestatorInfo
            initialData={savedData?.testator_info ?? null}
            onChange={handleChange}
            onValidChange={setIsValid}
          />
        )
      case 2:
        return (
          <Step2MovableAssets
            initialData={savedData?.movable_assets ?? null}
            onChange={handleChange}
            onValidChange={setIsValid}
          />
        )
      case 3:
        return (
          <Step3ImmovableAssets
            initialData={savedData?.immovable_assets ?? null}
            movableData={savedData?.movable_assets ?? null}
            onChange={handleChange}
            onValidChange={setIsValid}
          />
        )
      case 4:
        return (
          <Step4Beneficiaries
            initialData={savedData?.beneficiaries ?? null}
            onChange={handleChange}
            onValidChange={setIsValid}
          />
        )
      case 5:
        return (
          <Step5Executor
            initialPrimary={savedData?.executor ?? null}
            initialBackup={savedData?.backup_executor ?? null}
            onPrimaryChange={(data) => {
              setPrimaryData(data)
              autoSave(data)  // debounced save of primary executor field
            }}
            onBackupChange={setBackupData}
            onValidChange={setIsValid}
          />
        )
      case 6:
        return (
          <Step6Witnesses
            initialData={savedData?.witnesses ?? null}
            beneficiaries={savedData?.beneficiaries ?? null}
            onChange={handleChange}
            onValidChange={setIsValid}
          />
        )
      case 7:
        return (
          <Step7Declaration
            initialData={savedData?.declaration ?? null}
            testatorInfo={savedData?.testator_info ?? null}
            onChange={handleChange}
            onValidChange={setIsValid}
          />
        )
      default:
        return null
    }
  }

  return (
    <FormShell
      documentId={documentId}
      docType="wasiat"
      currentStep={currentStep}
      steps={steps}
      completedFields={completedFields}
      onNext={handleNext}
      isNextDisabled={!isValid}
      isSaving={isSaving}
    >
      {renderStep()}
    </FormShell>
  )
}
