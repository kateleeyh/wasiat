'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { Plus, Trash2 } from 'lucide-react'
import type { WasiatMovableAssets, AssetItem } from '@/types/database'

const MOVABLE_TYPES_MS = [
  'Akaun Bank', 'KWSP / EPF', 'Insurans / Takaful', 'Pelaburan / Saham',
  'Kenderaan', 'Barang Kemas / Emas', 'Lain-lain',
]
const MOVABLE_TYPES_EN = [
  'Bank Account', 'EPF / KWSP', 'Insurance / Takaful', 'Investment / Shares',
  'Vehicle', 'Jewellery / Gold', 'Other',
]

// Pre-filled general statement — standard legal paragraph covering ALL assets
const GENERAL_STATEMENT_MS =
  'Saya mengisytiharkan bahawa semua harta yang saya miliki pada tarikh kematian saya — ' +
  'termasuk tetapi tidak terhad kepada harta tak alih seperti tanah, rumah dan bangunan; ' +
  'serta harta alih seperti tunai, akaun bank, kenderaan, KWSP, takaful, pelaburan, emas ' +
  'dan apa jua bentuk aset lain — hendaklah ditadbir, diurus dan diagihkan oleh wasi ' +
  'mengikut ketetapan dalam wasiat ini serta selaras dengan hukum Syariah dan undang-undang ' +
  'yang berkuat kuasa di Malaysia.'

const GENERAL_STATEMENT_EN =
  'I hereby declare that all assets owned by me at the date of my death — ' +
  'including but not limited to immovable assets such as land, houses and buildings; ' +
  'and movable assets such as cash, bank accounts, vehicles, EPF, takaful, investments, gold ' +
  'and any other form of asset — shall be administered, managed and distributed by the executor ' +
  'in accordance with the provisions of this wasiat and in compliance with Shariah law and the ' +
  'laws in force in Malaysia.'

interface Props {
  initialData:   WasiatMovableAssets | null
  onChange:      (data: WasiatMovableAssets) => void
  onValidChange: (valid: boolean) => void
}

const EMPTY_ITEM: AssetItem = { type: '', details: '', amount: 0 }

function makeEmpty(): WasiatMovableAssets {
  return { mode: 'itemised', items: [{ ...EMPTY_ITEM }] }
}

export function Step2MovableAssets({ initialData, onChange, onValidChange }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'
  const types  = ms ? MOVABLE_TYPES_MS : MOVABLE_TYPES_EN

  const [form, setForm] = useState<WasiatMovableAssets>(() => {
    if (!initialData) return makeEmpty()
    // Ensure general mode has a pre-filled note
    if (initialData.mode === 'general' && !initialData.general_note) {
      return { ...initialData, general_note: ms ? GENERAL_STATEMENT_MS : GENERAL_STATEMENT_EN }
    }
    return initialData
  })

  const isValid = (() => {
    if (form.mode === 'itemised') {
      const items = form.items ?? []
      return items.length > 0 && items.every(i => i.type && i.details.trim())
    }
    if (form.mode === 'general') {
      return (form.general_note ?? '').trim().length > 0
    }
    return false
  })()

  useEffect(() => {
    onChange(form)
    onValidChange(isValid)
  }, [form]) // eslint-disable-line react-hooks/exhaustive-deps

  function setMode(mode: 'itemised' | 'general') {
    setForm(prev => ({
      ...prev,
      mode,
      items: mode === 'itemised' ? (prev.items?.length ? prev.items : [{ ...EMPTY_ITEM }]) : prev.items,
      general_note: mode === 'general'
        ? (prev.general_note || (ms ? GENERAL_STATEMENT_MS : GENERAL_STATEMENT_EN))
        : prev.general_note,
    }))
  }

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

  return (
    <div className="space-y-6">

      {/* Mode selection */}
      <div>
        <p className="text-sm font-medium mb-1">
          {ms ? 'Pilih kaedah pengisytiharan harta:' : 'Choose how to declare your assets:'}
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          {ms
            ? 'Kaedah ini akan digunakan untuk harta alih DAN harta tak alih anda.'
            : 'This method applies to both your movable AND immovable assets.'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Option A — Lampiran */}
          <button
            type="button"
            onClick={() => setMode('itemised')}
            className={`text-left p-5 rounded-xl border-2 transition ${
              form.mode === 'itemised'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40'
            }`}
          >
            <div className="font-semibold text-sm mb-2">
              {ms ? 'Lampiran A — Senarai Terperinci' : 'Lampiran A — Itemised List'}
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              {ms
                ? 'Senaraikan setiap harta secara terperinci mengikut kategori. Disyorkan agar harta dapat dikenal pasti dengan tepat.'
                : 'List each asset by category with specific details. Recommended so assets can be precisely identified.'}
            </div>
          </button>

          {/* Option B — Pernyataan Am */}
          <button
            type="button"
            onClick={() => setMode('general')}
            className={`text-left p-5 rounded-xl border-2 transition ${
              form.mode === 'general'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40'
            }`}
          >
            <div className="font-semibold text-sm mb-2">
              {ms ? 'Pernyataan Am — Meliputi Semua Harta' : 'General Statement — Covers All Assets'}
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              {ms
                ? 'Gunakan pernyataan piawai yang meliputi semua harta alih dan harta tak alih secara keseluruhan.'
                : 'Use a standard declaration covering all movable and immovable assets in general.'}
            </div>
          </button>
        </div>
      </div>

      {/* Option A — itemised movable list */}
      {form.mode === 'itemised' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            {ms
              ? 'Harta Alih: wang simpanan, kenderaan, pelaburan, barang kemas, KWSP, insurans, dan lain-lain. Harta Tak Alih (tanah, rumah, bangunan) akan disenaraikan pada langkah berikutnya.'
              : 'Movable assets: savings, vehicles, investments, jewellery, EPF, insurance, etc. Immovable assets (land, houses, buildings) will be listed in the next step.'}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">
                {ms ? 'Senarai Harta Alih' : 'Movable Asset List'}
              </p>
              <span className="text-xs text-muted-foreground">
                {ms ? `${form.items?.length ?? 0} item` : `${form.items?.length ?? 0} item(s)`}
              </span>
            </div>

            {/* Header row */}
            <div className="hidden sm:grid sm:grid-cols-[1fr_2fr_120px_40px] gap-2 text-xs font-medium text-muted-foreground px-1 mb-1">
              <span>{ms ? 'Jenis Harta' : 'Asset Type'}</span>
              <span>{ms ? 'Butiran' : 'Details'}</span>
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
                    <label className="sm:hidden text-xs font-medium mb-1 block">{ms ? 'Butiran' : 'Details'}</label>
                    <input
                      className={inp}
                      value={item.details}
                      onChange={e => updateItem(idx, 'details', e.target.value)}
                      placeholder={ms ? 'cth. Maybank, No. Akaun 1234-5678' : 'e.g. Maybank, Account No. 1234-5678'}
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
              {ms ? 'Tambah Harta Alih' : 'Add Movable Asset'}
            </button>
          </div>
        </div>
      )}

      {/* Option B — pre-filled general statement */}
      {form.mode === 'general' && (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
            {ms
              ? 'Pernyataan am di bawah meliputi SEMUA harta anda — harta alih dan harta tak alih. Anda boleh mengedit teks ini jika perlu.'
              : 'The general statement below covers ALL your assets — movable and immovable. You may edit the text if needed.'}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              {ms ? 'Pernyataan Am Harta' : 'General Asset Statement'}
              <span className="text-destructive ml-1">*</span>
            </label>
            <textarea
              className={`${inp} min-h-[140px] resize-y leading-relaxed`}
              value={form.general_note ?? ''}
              onChange={e => setForm(prev => ({ ...prev, general_note: e.target.value }))}
            />
          </div>
        </div>
      )}
    </div>
  )
}
