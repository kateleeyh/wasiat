'use client'

import { useState } from 'react'
import { Info, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  titleMs: string
  titleEn: string
  ms: boolean
  children: React.ReactNode
  variant?: 'amber' | 'blue' | 'emerald'
  defaultOpen?: boolean
}

const variants = {
  amber: {
    closed: 'border-amber-300 bg-amber-50/60 hover:bg-amber-50 hover:border-amber-400',
    open:   'border-amber-400 bg-amber-50',
    icon:   'text-amber-600',
    title:  'text-amber-800',
    hint:   'text-amber-600',
    divider: 'border-amber-200',
  },
  blue: {
    closed: 'border-blue-300 bg-blue-50/60 hover:bg-blue-50 hover:border-blue-400',
    open:   'border-blue-400 bg-blue-50',
    icon:   'text-blue-600',
    title:  'text-blue-800',
    hint:   'text-blue-500',
    divider: 'border-blue-200',
  },
  emerald: {
    closed: 'border-emerald-300 bg-emerald-50/60 hover:bg-emerald-50 hover:border-emerald-400',
    open:   'border-emerald-400 bg-emerald-50',
    icon:   'text-emerald-600',
    title:  'text-emerald-800',
    hint:   'text-emerald-500',
    divider: 'border-emerald-200',
  },
}

export function InfoTip({ titleMs, titleEn, ms, children, variant = 'amber', defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const v = variants[variant]
  const title = ms ? titleMs : titleEn

  return (
    <div className={`rounded-xl border-2 transition-all ${open ? v.open : v.closed}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
      >
        <Info className={`w-4 h-4 shrink-0 ${v.icon}`} />
        <span className={`flex-1 text-sm font-semibold ${v.title}`}>{title}</span>
        <span className={`text-xs font-medium ${v.hint} flex items-center gap-1`}>
          {open
            ? <>{ms ? 'Tutup' : 'Close'} <ChevronUp className="w-3 h-3" /></>
            : <>{ms ? 'Ketik untuk baca' : 'Tap to read'} <ChevronDown className="w-3 h-3" /></>}
        </span>
      </button>
      {open && (
        <div className={`px-4 pb-4 pt-2 border-t ${v.divider}`}>
          {children}
        </div>
      )}
    </div>
  )
}
