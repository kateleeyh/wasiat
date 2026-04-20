'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseStepSaveOptions {
  documentId:  string
  docType:     'wasiat' | 'will'
  fieldKey:    string       // DB column to upsert into
  currentStep: number
  totalSteps:  number
}

export function useStepSave({
  documentId,
  docType,
  fieldKey,
  currentStep,
  totalSteps,
}: UseStepSaveOptions) {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-save: debounced, called on every data change
  const autoSave = useCallback(
    (data: unknown) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      setStatus('saving')

      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch('/api/documents/save-step', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documentId, docType, fieldKey, data }),
          })
          if (!res.ok) throw new Error('Save failed')
          setStatus('saved')
          setTimeout(() => setStatus('idle'), 2000)
        } catch {
          setStatus('error')
        }
      }, 1200)
    },
    [documentId, docType, fieldKey]
  )

  // Save immediately then navigate to next step
  const saveAndNext = useCallback(
    async (data: unknown) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      setStatus('saving')

      try {
        const res = await fetch('/api/documents/save-step', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId, docType, fieldKey, data }),
        })
        if (!res.ok) throw new Error('Save failed')
        setStatus('saved')

        const nextStep = currentStep + 1
        if (nextStep <= totalSteps) {
          router.push(`/${docType}/${documentId}/step/${nextStep}`)
        } else {
          router.push(`/${docType}/${documentId}/review`)
        }
      } catch {
        setStatus('error')
      }
    },
    [documentId, docType, fieldKey, currentStep, totalSteps, router]
  )

  // Save multiple fields at once, then navigate (used for steps with > 1 DB column)
  const saveAndNextMulti = useCallback(
    async (fields: Array<{ fieldKey: string; data: unknown }>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      setStatus('saving')

      try {
        const res = await fetch('/api/documents/save-step', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId, docType, fields }),
        })
        if (!res.ok) throw new Error('Save failed')
        setStatus('saved')

        const nextStep = currentStep + 1
        if (nextStep <= totalSteps) {
          router.push(`/${docType}/${documentId}/step/${nextStep}`)
        } else {
          router.push(`/${docType}/${documentId}/review`)
        }
      } catch {
        setStatus('error')
      }
    },
    [documentId, docType, currentStep, totalSteps, router]
  )

  return { status, autoSave, saveAndNext, saveAndNextMulti, isSaving: status === 'saving' }
}
