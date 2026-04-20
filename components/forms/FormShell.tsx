'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StepDefinition } from '@/lib/formSteps'

interface FormShellProps {
  documentId:   string
  docType:      'wasiat' | 'will'
  currentStep:  number
  steps:        StepDefinition[]
  completedFields: Record<string, boolean>  // fieldKey → has data
  children:     React.ReactNode
  onNext?:      () => void    // called when Next is clicked (triggers save + navigate)
  isNextDisabled?: boolean
  isSaving?:    boolean
}

export function FormShell({
  documentId,
  docType,
  currentStep,
  steps,
  completedFields,
  children,
  onNext,
  isNextDisabled,
  isSaving,
}: FormShellProps) {
  const locale = useLocale()
  const totalSteps = steps.length
  const isLastStep = currentStep === totalSteps
  const isFirstStep = currentStep === 1

  const prevStep = currentStep - 1
  const nextStep = currentStep + 1
  const basePath = `/${docType}/${documentId}/step`

  const completedCount = steps.filter((s) => completedFields[s.fieldKey]).length
  const progressPct = Math.round((completedCount / totalSteps) * 100)

  return (
    <div className="max-w-3xl mx-auto">

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">
            {completedCount}/{totalSteps} {locale === 'ms' ? 'bahagian selesai' : 'sections complete'}
          </span>
          <span className="text-xs font-medium text-primary">{progressPct}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
        {steps.map((s, idx) => {
          const isComplete = completedFields[s.fieldKey]
          const isCurrent = s.step === currentStep
          const isPast    = s.step < currentStep

          return (
            <div key={s.step} className="flex items-center gap-1 shrink-0">
              <Link
                href={`${basePath}/${s.step}`}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition',
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : isComplete
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : isPast
                        ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                        : 'bg-muted/50 text-muted-foreground/60 pointer-events-none'
                )}
              >
                {isComplete && !isCurrent ? (
                  <Check className="w-3 h-3 shrink-0" />
                ) : (
                  <span className="w-3 h-3 flex items-center justify-center shrink-0 text-[10px] font-bold">
                    {s.step}
                  </span>
                )}
                <span className="hidden sm:block whitespace-nowrap">
                  {locale === 'ms' ? s.labelMs : s.labelEn}
                </span>
              </Link>
              {idx < steps.length - 1 && (
                <div className="w-3 h-px bg-border shrink-0" />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span>{locale === 'ms' ? 'Langkah' : 'Step'} {currentStep} {locale === 'ms' ? 'daripada' : 'of'} {totalSteps}</span>
            {isSaving && (
              <span className="text-amber-500">
                {locale === 'ms' ? '· Menyimpan...' : '· Saving...'}
              </span>
            )}
            {!isSaving && completedFields[steps[currentStep - 1]?.fieldKey] && (
              <span className="text-emerald-600">
                {locale === 'ms' ? '· Tersimpan' : '· Saved'}
              </span>
            )}
          </div>
          <h2 className="text-lg font-semibold">
            {locale === 'ms'
              ? steps[currentStep - 1]?.labelMs
              : steps[currentStep - 1]?.labelEn}
          </h2>
        </div>

        {children}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {!isFirstStep ? (
          <Link
            href={`${basePath}/${prevStep}`}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            {locale === 'ms' ? 'Kembali' : 'Back'}
          </Link>
        ) : (
          <div />
        )}

        {isLastStep ? (
          <Link
            href={`/${docType}/${documentId}/review`}
            className={cn(
              'flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition',
              isNextDisabled && 'opacity-50 pointer-events-none'
            )}
          >
            {locale === 'ms' ? 'Semak & Pratonton' : 'Review & Preview'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={isNextDisabled || isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {locale === 'ms' ? 'Seterusnya' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
