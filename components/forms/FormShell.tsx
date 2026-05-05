'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Check, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StepDefinition } from '@/lib/formSteps'

interface FormShellProps {
  documentId:   string
  docType:      'wasiat' | 'will'
  currentStep:  number
  steps:        StepDefinition[]
  completedFields: Record<string, boolean>
  children:     React.ReactNode
  onNext?:      () => void
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
  const basePath = `/${docType}/${documentId}/step`

  const completedCount = steps.filter((s) => completedFields[s.fieldKey]).length
  const progressPct = Math.round((completedCount / totalSteps) * 100)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

        {/* Breadcrumb */}
        <div className="mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-border rounded-lg px-3 py-1.5 hover:text-foreground hover:bg-muted/50 transition"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            {locale === 'ms' ? 'Kembali ke Dashboard' : 'Back to Dashboard'}
          </Link>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
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
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {steps.map((s, idx) => {
            const isComplete = completedFields[s.fieldKey]
            const isCurrent  = s.step === currentStep
            const isPast     = s.step < currentStep

            return (
              <div key={s.step} className="flex items-center gap-1 shrink-0">
                <Link
                  href={`${basePath}/${s.step}`}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition min-h-[36px]',
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
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 mb-6">
          <div className="mb-5 pb-4 border-b border-border">
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
            <h2 className="text-base sm:text-lg font-semibold">
              {locale === 'ms'
                ? steps[currentStep - 1]?.labelMs
                : steps[currentStep - 1]?.labelEn}
            </h2>
          </div>

          {children}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 pb-8">
          {!isFirstStep ? (
            <Link
              href={`${basePath}/${prevStep}`}
              className="flex items-center gap-2 px-4 py-3 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition min-h-[48px]"
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
                'flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition min-h-[48px]',
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
              className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-50 min-h-[48px]"
            >
              {locale === 'ms' ? 'Seterusnya' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
