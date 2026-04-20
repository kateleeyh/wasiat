'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { Plus, Trash2, AlertTriangle } from 'lucide-react'
import type { WasiatBeneficiary, AssignmentType } from '@/types/database'
import {
  isValidIC, isValidPhone, formatIC, genderFromIC,
  genderMismatchWarning, isFaraidRelationship, faraidWarning,
} from '@/lib/validation'

interface Props {
  initialData:   WasiatBeneficiary[] | null
  onChange:      (data: WasiatBeneficiary[]) => void
  onValidChange: (valid: boolean) => void
}

const BM_RELATIONSHIPS = [
  'Suami', 'Isteri',
  'Anak Lelaki', 'Anak Perempuan', 'Anak Angkat',
  'Ibu', 'Bapa',
  'Abang', 'Kakak', 'Adik Lelaki', 'Adik Perempuan',
  'Datuk', 'Nenek', 'Cucu',
  'Bapa Saudara', 'Ibu Saudara', 'Sepupu',
  'Ipar Lelaki', 'Ipar Perempuan',
  'Rakan', 'Sahabat', 'Rakan Sekerja',
  'Pertubuhan / Badan Amal',
]

function BmRelationshipSelect({ value, onChange, inp }: { value: string; onChange: (v: string) => void; inp: string }) {
  const [customMode, setCustomMode] = useState(() => value !== '' && !BM_RELATIONSHIPS.includes(value))
  const showInput = customMode || (value !== '' && !BM_RELATIONSHIPS.includes(value))
  return (
    <>
      <select
        className={inp}
        value={showInput ? '__other__' : value}
        onChange={e => {
          if (e.target.value === '__other__') { setCustomMode(true); onChange('') }
          else { setCustomMode(false); onChange(e.target.value) }
        }}
      >
        <option value="">-- Pilih hubungan --</option>
        {BM_RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
        <option value="__other__">Lain-lain (nyatakan)</option>
      </select>
      {showInput && (
        <input
          className={inp + ' mt-2'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Taip hubungan dalam Bahasa Melayu"
          autoFocus
        />
      )}
    </>
  )
}

const EMPTY_BENEFICIARY: WasiatBeneficiary = {
  full_name: '', ic_number: '', relationship: '', phone: '',
  assignment_type: 'percentage', percentage: undefined, specific_asset: undefined,
}

export function Step4Beneficiaries({ initialData, onChange, onValidChange }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'

  const [list, setList] = useState<WasiatBeneficiary[]>(
    initialData?.length ? initialData : [{ ...EMPTY_BENEFICIARY }]
  )

  // Total percentage of all percentage-type beneficiaries
  const totalPct = list
    .filter(b => b.assignment_type === 'percentage')
    .reduce((sum, b) => sum + (b.percentage ?? 0), 0)

  const exceedsLimit = totalPct > 100

  const isValid = list.length > 0 && list.every(b => {
    if (!b.full_name.trim() || !isValidIC(b.ic_number) || !b.relationship.trim() || !isValidPhone(b.phone)) return false
    if (b.assignment_type === 'percentage') return (b.percentage ?? 0) > 0 && (b.percentage ?? 0) <= 100
    if (b.assignment_type === 'specific_asset') return !!(b.specific_asset?.trim())
    return false
  }) && !exceedsLimit

  useEffect(() => {
    onChange(list)
    onValidChange(isValid)
  }, [list]) // eslint-disable-line react-hooks/exhaustive-deps

  function update(idx: number, field: keyof WasiatBeneficiary, value: unknown) {
    setList(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      if (field === 'assignment_type') {
        next[idx].percentage    = undefined
        next[idx].specific_asset = undefined
      }
      return next
    })
  }

  function addBeneficiary() {
    setList(prev => [...prev, { ...EMPTY_BENEFICIARY }])
  }

  function removeBeneficiary(idx: number) {
    setList(prev => prev.filter((_, i) => i !== idx))
  }

  const inp = 'w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20'
  const lbl = 'block text-xs font-medium mb-1 text-muted-foreground'

  return (
    <div className="space-y-6">
      {/* 1/3 rule explanation */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 space-y-2">
        <p className="font-semibold">{ms ? 'Peraturan 1/3 Wasiat — Penting' : '1/3 Wasiat Rule — Important'}</p>
        <p>
          {ms
            ? 'Mengikut undang-undang Islam, anda hanya boleh mewasiatkan sehingga 1/3 daripada harta anda. Baki 2/3 akan dibahagikan kepada waris mengikut hukum Faraid. Peratusan di sini merujuk kepada bahagian daripada 1/3 tersebut.'
            : 'Under Islamic law, you may only bequeath up to 1/3 of your estate. The remaining 2/3 is distributed to heirs under Faraid. Percentages here refer to shares within that 1/3 portion.'}
        </p>
        <div className="border-t border-amber-300 pt-2 space-y-1">
          <p className="font-semibold text-xs">
            {ms ? '⚠️ Wasiat kepada waris Faraid (keluarga yang berhak menerima Faraid):' : '⚠️ Bequest to a Faraid heir (family entitled under Faraid):'}
          </p>
          <p className="text-xs leading-relaxed">
            {ms
              ? 'Jika penerima manfaat 1/3 anda adalah juga waris Faraid (contoh: anak, isteri, ibu bapa), maka peruntukan wasiat tersebut adalah TIDAK SAH kecuali semua waris Faraid yang lain bersetuju selepas kematian pewasiat. Persetujuan ini mesti dibuat secara sukarela selepas kematian — bukan sebelumnya.'
              : 'If your 1/3 beneficiary is also a Faraid heir (e.g. child, spouse, parent), the bequest is VOID unless all other Faraid heirs consent after your death. This consent must be given voluntarily after death — not before.'}
          </p>
          <p className="font-semibold text-xs mt-1">
            {ms ? '✓ Wasiat kepada bukan waris Faraid (rakan, amal jariah, bukan Muslim):' : '✓ Bequest to a non-Faraid heir (friend, charity, non-Muslim):'}
          </p>
          <p className="text-xs leading-relaxed">
            {ms
              ? 'Jika penerima manfaat bukan waris Faraid, wasiat sehingga 1/3 adalah sah dan tidak memerlukan persetujuan mana-mana pihak.'
              : 'If the beneficiary is not a Faraid heir, a bequest up to 1/3 is valid and requires no consent from anyone.'}
          </p>
          <p className="text-xs text-amber-700 italic mt-1">
            {ms
              ? 'Sumber: Hadis "Lā wasiyyata li wārith" — tiada wasiat bagi waris tanpa persetujuan waris-waris yang lain.'
              : 'Source: Hadith "Lā wasiyyata li wārith" — no bequest for an heir without consent of the other heirs.'}
          </p>
        </div>
      </div>

      {/* Percentage summary */}
      {list.some(b => b.assignment_type === 'percentage') && (
        <div className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${
          exceedsLimit
            ? 'border-destructive bg-destructive/5 text-destructive'
            : totalPct === 100
              ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
              : 'border-border bg-muted/30 text-muted-foreground'
        }`}>
          {exceedsLimit && <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>
            {ms
              ? `Jumlah peratusan: ${totalPct}% daripada 1/3 harta`
              : `Total percentage: ${totalPct}% of 1/3 estate`}
            {exceedsLimit && (ms ? ' — melebihi had 100%!' : ' — exceeds 100% limit!')}
            {totalPct === 100 && !exceedsLimit && (ms ? ' ✓ Tepat' : ' ✓ Fully allocated')}
          </span>
        </div>
      )}

      {/* Beneficiary list */}
      <div className="space-y-4">
        {list.map((b, idx) => {
          const icDigits     = b.ic_number.replace(/\D/g, '')
          const icDisplay    = formatIC(b.ic_number)
          const gender       = isValidIC(b.ic_number) ? genderFromIC(b.ic_number) : null
          const genderWarn   = genderMismatchWarning(b.full_name, b.ic_number, ms)
          const isFaraid     = isFaraidRelationship(b.relationship)

          return (
            <div key={idx} className="border border-border rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">
                    {ms ? `Penerima Manfaat ${idx + 1}` : `Beneficiary ${idx + 1}`}
                  </h4>
                  {gender && isValidIC(b.ic_number) && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      gender === 'male'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-pink-100 text-pink-700'
                    }`}>
                      {gender === 'male' ? (ms ? '♂ Lelaki' : '♂ Male') : (ms ? '♀ Perempuan' : '♀ Female')}
                    </span>
                  )}
                </div>
                {list.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBeneficiary(idx)}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Faraid inline alert */}
              {isFaraid && b.relationship.trim() && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{faraidWarning(ms)}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full name */}
                <div className="sm:col-span-2">
                  <label className={lbl}>{ms ? 'Nama Penuh *' : 'Full Name *'}</label>
                  <input
                    className={inp}
                    value={b.full_name}
                    onChange={e => update(idx, 'full_name', e.target.value.toUpperCase())}
                    placeholder={ms ? 'Nama penuh' : 'Full name'}
                  />
                  {genderWarn && (
                    <p className="text-xs text-amber-600 mt-1">⚠ {genderWarn}</p>
                  )}
                </div>

                {/* IC */}
                <div>
                  <label className={lbl}>{ms ? 'No. IC *' : 'IC Number *'}</label>
                  <input
                    className={inp}
                    value={icDisplay}
                    onChange={e => update(idx, 'ic_number', e.target.value.replace(/\D/g, '').slice(0, 12))}
                    placeholder="820101-01-2345"
                    maxLength={14}
                  />
                  {b.ic_number && !isValidIC(b.ic_number) && (
                    <p className="text-xs text-destructive mt-1">{ms ? 'IC tidak sah' : 'Invalid IC'}</p>
                  )}
                  {isValidIC(b.ic_number) && (
                    <p className="text-xs text-emerald-600 mt-1">
                      {ms ? '✓ Jantina dikesan secara automatik' : '✓ Gender auto-detected'}
                    </p>
                  )}
                </div>

                {/* Relationship */}
                <div>
                  <label className={lbl}>{ms ? 'Hubungan *' : 'Relationship *'}</label>
                  <BmRelationshipSelect
                    value={b.relationship}
                    onChange={v => update(idx, 'relationship', v)}
                    inp={inp}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className={lbl}>{ms ? 'No. Telefon *' : 'Phone *'}</label>
                  <input
                    className={inp}
                    value={b.phone}
                    onChange={e => update(idx, 'phone', e.target.value)}
                    placeholder="0123456789"
                  />
                  {b.phone && !isValidPhone(b.phone) && (
                    <p className="text-xs text-destructive mt-1">{ms ? 'No. telefon tidak sah' : 'Invalid phone number'}</p>
                  )}
                </div>

                {/* Assignment type */}
                <div>
                  <label className={lbl}>{ms ? 'Kaedah Pembahagian *' : 'Assignment Method *'}</label>
                  <select
                    className={inp}
                    value={b.assignment_type}
                    onChange={e => update(idx, 'assignment_type', e.target.value as AssignmentType)}
                  >
                    <option value="percentage">{ms ? 'Peratusan (%)' : 'Percentage (%)'}</option>
                    <option value="specific_asset">{ms ? 'Harta Tertentu' : 'Specific Asset'}</option>
                  </select>
                </div>

                {/* Percentage or specific asset */}
                {b.assignment_type === 'percentage' && (
                  <div>
                    <label className={lbl}>{ms ? 'Peratusan (%) *' : 'Percentage (%) *'}</label>
                    <div className="relative">
                      <input
                        type="number"
                        className={inp + ' pr-8'}
                        value={b.percentage ?? ''}
                        onChange={e => update(idx, 'percentage', parseFloat(e.target.value) || undefined)}
                        placeholder="0"
                        min={1}
                        max={100}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                )}

                {b.assignment_type === 'specific_asset' && (
                  <div className="sm:col-span-2">
                    <label className={lbl}>{ms ? 'Harta Yang Diwasiatkan *' : 'Specific Asset to Bequeath *'}</label>
                    <input
                      className={inp}
                      value={b.specific_asset ?? ''}
                      onChange={e => update(idx, 'specific_asset', e.target.value)}
                      placeholder={
                        ms
                          ? 'cth. Rumah di No. 10 Jalan Bahagia, Kuala Lumpur'
                          : 'e.g. House at No. 10 Jalan Bahagia, Kuala Lumpur'
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={addBeneficiary}
        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium py-2 transition"
      >
        <Plus className="w-4 h-4" />
        {ms ? 'Tambah Penerima Manfaat' : 'Add Beneficiary'}
      </button>
    </div>
  )
}
