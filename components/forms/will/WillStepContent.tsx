'use client'

import { useState, useCallback } from 'react'
import { FormShell } from '@/components/forms/FormShell'
import { WILL_STEPS } from '@/lib/formSteps'
import { useStepSave } from '@/hooks/useStepSave'
import { WillStep1TestatorInfo }  from '@/components/forms/will/steps/WillStep1TestatorInfo'
import { WillStep2Executor }      from '@/components/forms/will/steps/WillStep2Executor'
import { WillStep3Assets }        from '@/components/forms/will/steps/WillStep3Assets'
import { WillStep4Beneficiaries } from '@/components/forms/will/steps/WillStep4Beneficiaries'
import { WillStep5Guardianship }  from '@/components/forms/will/steps/WillStep5Guardianship'
import { WillStep6Witnesses }     from '@/components/forms/will/steps/WillStep6Witnesses'
import { WillStep7Declaration }   from '@/components/forms/will/steps/WillStep7Declaration'
import type {
  WillRecord,
  WillPrimaryExecutor,
  WillBackupExecutor,
  WillBeneficiary,
  AssetDistribution,
  ResidualEstateBeneficiary,
} from '@/types/database'
import type { StepDefinition } from '@/lib/formSteps'

interface Props {
  documentId:      string
  currentStep:     number
  steps:           StepDefinition[]
  completedFields: Record<string, boolean>
  savedData:       WillRecord | null
  docLanguage:     'ms' | 'en'
}

export function WillStepContent({ documentId, currentStep, steps, completedFields, savedData, docLanguage }: Props) {
  const fieldKey = WILL_STEPS[currentStep - 1]?.fieldKey ?? ''

  const { saveAndNext, saveAndNextMulti, autoSave, isSaving } = useStepSave({
    documentId,
    docType:    'will',
    fieldKey,
    currentStep,
    totalSteps: WILL_STEPS.length,
  })

  const [stepData,   setStepData]   = useState<unknown>(null)
  const [isValid,    setIsValid]     = useState(false)

  // Step 2 — executor (two DB columns)
  const [primaryExec,  setPrimaryExec]  = useState<WillPrimaryExecutor | null>(null)
  const [backupExec,   setBackupExec]   = useState<WillBackupExecutor | null>(null)

  // Step 4 — beneficiaries (three DB columns)
  const [beneficiaries,      setBeneficiaries]      = useState<WillBeneficiary[] | null>(null)
  const [assetDistributions, setAssetDistributions] = useState<AssetDistribution[] | null>(null)
  const [residual,           setResidual]           = useState<ResidualEstateBeneficiary | null>(null)

  const handleChange = useCallback((data: unknown) => {
    setStepData(data)
    autoSave(data)
  }, [autoSave])

  const handleNext = useCallback(async () => {
    switch (currentStep) {
      case 2:
        await saveAndNextMulti([
          { fieldKey: 'executor',        data: primaryExec },
          { fieldKey: 'backup_executor', data: backupExec },
        ])
        break
      case 4:
        await saveAndNextMulti([
          { fieldKey: 'beneficiaries',               data: beneficiaries },
          { fieldKey: 'asset_distributions',         data: assetDistributions },
          { fieldKey: 'residual_estate_beneficiary', data: residual },
        ])
        break
      default:
        await saveAndNext(stepData)
    }
  }, [currentStep, saveAndNext, saveAndNextMulti, stepData, primaryExec, backupExec, beneficiaries, assetDistributions, residual])

  function renderStep() {
    switch (currentStep) {
      case 1:
        return (
          <WillStep1TestatorInfo
            initialData={savedData?.testator_info ?? null}
            onChange={handleChange}
            onValidChange={setIsValid}
            docLanguage={docLanguage}
          />
        )
      case 2:
        return (
          <WillStep2Executor
            initialPrimary={savedData?.executor ?? null}
            initialBackup={savedData?.backup_executor ?? null}
            onPrimaryChange={(data) => {
              setPrimaryExec(data)
              autoSave(data)
            }}
            onBackupChange={setBackupExec}
            onValidChange={setIsValid}
            docLanguage={docLanguage}
          />
        )
      case 3:
        return (
          <WillStep3Assets
            initialData={savedData?.assets ?? null}
            onChange={handleChange}
            onValidChange={setIsValid}
          />
        )
      case 4:
        return (
          <WillStep4Beneficiaries
            initialBeneficiaries={savedData?.beneficiaries ?? null}
            initialAssetDistributions={savedData?.asset_distributions ?? null}
            initialResidual={savedData?.residual_estate_beneficiary ?? null}
            assets={savedData?.assets ?? null}
            testatorInfo={savedData?.testator_info ?? null}
            onBeneficiariesChange={setBeneficiaries}
            onAssetDistributionsChange={setAssetDistributions}
            onResidualChange={setResidual}
            onValidChange={setIsValid}
            docLanguage={docLanguage}
          />
        )
      case 5:
        return (
          <WillStep5Guardianship
            initialData={savedData?.guardianship ?? null}
            onChange={handleChange}
            onValidChange={setIsValid}
            docLanguage={docLanguage}
          />
        )
      case 6:
        return (
          <WillStep6Witnesses
            initialData={savedData?.witnesses ?? null}
            beneficiaries={savedData?.beneficiaries ?? null}
            onChange={handleChange}
            onValidChange={setIsValid}
          />
        )
      case 7:
        return (
          <WillStep7Declaration
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
      docType="will"
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
