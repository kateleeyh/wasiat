'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { Plus, Trash2, CheckCircle } from 'lucide-react'
import type { WasiatImmovableAssets, WasiatMovableAssets, AssetItem } from '@/types/database'

const IMMOVABLE_TYPES_MS = ['Rumah Kediaman', 'Hartanah Komersial', 'Tanah']
const IMMOVABLE_TYPES_EN = ['Residential Property', 'Commercial Property', 'Land']

interface Props {
  initialData:   WasiatImmovableAssets | null
  movableData:   WasiatMovableAssets | null       // passed from parent to detect mode
  onChange:      (data: WasiatImmovableAssets) => void
  onValidChange: (valid: boolean) => void
}

const EMPTY_ITEM: AssetItem = { type: '', details: '', amount: 0 }

function makeEmpty(): WasiatImmovableAssets {
  return { mode: 'itemised', items: [{ ...EMPTY_ITEM }] }
}

export function Step3ImmovableAssets({ initialData, movableData, onChange, onValidChange }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'
  const types  = ms ? IMMOVABLE_TYPES_MS : IMMOVABLE_TYPES_EN

  // If movable step chose 'general', this step is covered — auto-set and skip
  const isGeneralMode = movableData?.mode === 'general'

  const [form, setForm] = useState<WasiatImmovableAssets>(initialData ?? makeEmpty())

  // When general mode, auto-emit valid data and mark as valid
  useEffect(() => {
    if (isGeneralMode) {
      const autoData: WasiatImmovableAssets = { mode: 'general' }
      onChange(autoData)
      onValidChange(true)
    }
  }, [isGeneralMode]) // eslint-disable-line react-hooks/exhaustive-deps

  const isValid = isGeneralMode
    ? true
    : (() => {
        const items = form.items ?? []
        return items.length > 0 && items.every(i => i.type && i.details.trim())
      })()

  useEffect(() => {
    if (!isGeneralMode) {
      onChange(form)
      onValidChange(isValid)
    }
  }, [form]) // eslint-disable-line react-hooks/exhaustive-deps

  function updateItem(idx: number, field: keyof AssetItem, value: string | number) {
    setForm(prev => {
      const items = [...(prev.items ?? [])]
      items[idx] = { ...items[idx], [field]: value }
      return { ...prev, items }
    })
  }

  function addItem() {
    setForm(prev => ({ ...prev, items: [...(prev.items ?? []), { ...EMPTY_ITEM }] }))
  }

  function removeItem(idx: number) {
    setForm(prev => ({ ...prev, items: (prev.items ?? []).filter((_, i) => i !== idx) }))
  }

  const inp = 'w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20'

  // ── General mode: covered by Pernyataan Am ────────────────────────────────
  if (isGeneralMode) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-5 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm text-green-800 mb-1">
              {ms ? 'Harta Tak Alih Diliputi oleh Pernyataan Am' : 'Immovable Assets Covered by General Statement'}
            </p>
            <p className="text-xs text-green-700 leading-relaxed">
              {ms
                ? 'Anda telah memilih Pernyataan Am pada langkah sebelumnya. Pernyataan tersebut meliputi semua harta anda termasuk harta tak alih seperti tanah, rumah dan bangunan. Tiada tindakan lanjut diperlukan pada langkah ini.'
                : 'You selected a General Statement in the previous step, which covers all your assets including immovable properties such as land, houses and buildings. No further action is needed on this step.'}
            </p>
          </div>
        </div>

        {movableData?.general_note && (
          <div className="border border-border rounded-lg p-4 bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {ms ? 'Pernyataan yang akan dimasukkan dalam dokumen:' : 'Statement that will appear in your document:'}
            </p>
            <p className="text-sm leading-relaxed text-foreground/80 italic">
              "{movableData.general_note}"
            </p>
          </div>
        )}
      </div>
    )
  }

  // ── Lampiran A mode: immovable list ──────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
        {ms
          ? 'Harta Tak Alih: tanah, rumah kediaman, bangunan komersial. Sertakan alamat penuh dan nombor hakmilik / lot.'
          : 'Immovable assets: land, residential houses, commercial buildings. Include the full address and title / lot number.'}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">
            {ms ? 'Senarai Harta Tak Alih' : 'Immovable Asset List'}
          </p>
          <span className="text-xs text-muted-foreground">
            {form.items?.length ?? 0} item(s)
          </span>
        </div>

        <div className="hidden sm:grid sm:grid-cols-[1fr_2fr_120px_40px] gap-2 text-xs font-medium text-muted-foreground px-1 mb-1">
          <span>{ms ? 'Jenis Hartanah' : 'Property Type'}</span>
          <span>{ms ? 'Alamat & No. Hakmilik' : 'Address & Title No.'}</span>
          <span>{ms ? 'Anggaran (RM)' : 'Est. Value (RM)'}</span>
          <span />
        </div>

        <div className="space-y-2">
          {(form.items ?? []).map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_120px_40px] gap-2 items-start bg-muted/30 sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none">
              <div>
                <label className="sm:hidden text-xs font-medium mb-1 block">{ms ? 'Jenis' : 'Type'}</label>
                <select className={inp} value={item.type} onChange={e => updateItem(idx, 'type', e.target.value)}>
                  <option value="">{ms ? '-- Pilih --' : '-- Select --'}</option>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="sm:hidden text-xs font-medium mb-1 block">{ms ? 'Alamat & No. Hakmilik' : 'Address & Title No.'}</label>
                <input
                  className={inp}
                  value={item.details}
                  onChange={e => updateItem(idx, 'details', e.target.value)}
                  placeholder={ms ? 'cth. No. 10 Jalan Merdeka, KL — HS(D) 12345 PT 678' : 'e.g. No. 10 Jalan Merdeka, KL — HS(D) 12345 PT 678'}
                />
              </div>
              <div>
                <label className="sm:hidden text-xs font-medium mb-1 block">{ms ? 'Anggaran (RM)' : 'Est. Value (RM)'}</label>
                <input
                  type="number"
                  className={inp}
                  value={item.amount || ''}
                  onChange={e => updateItem(idx, 'amount', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  min={0}
                />
              </div>
              <div className="flex sm:justify-center items-start sm:pt-2">
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  disabled={(form.items?.length ?? 0) <= 1}
                  className="p-2 text-muted-foreground hover:text-destructive disabled:opacity-30 transition"
                  aria-label={ms ? 'Buang' : 'Remove'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium py-2 mt-1 transition"
        >
          <Plus className="w-4 h-4" />
          {ms ? 'Tambah Hartanah' : 'Add Property'}
        </button>
      </div>
    </div>
  )
}
