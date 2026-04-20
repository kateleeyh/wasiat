'use client'

import { useEffect, useRef, useState } from 'react'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<void>,
  delayMs = 1500
) {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip the very first render — don't save on mount
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (timerRef.current) clearTimeout(timerRef.current)
    setStatus('saving')

    timerRef.current = setTimeout(async () => {
      try {
        await saveFn(data)
        setStatus('saved')
        // Reset to idle after 2s
        setTimeout(() => setStatus('idle'), 2000)
      } catch {
        setStatus('error')
      }
    }, delayMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  return status
}
