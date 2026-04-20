'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { AlertTriangle, Plus, X } from 'lucide-react'
import type { WasiatWitnesses, WasiatWitness, WasiatBeneficiary } from '@/types/database'
import { isValidIC, formatIC, genderFromIC } from '@/lib/validation'

// ─── WitnessForm must be defined OUTSIDE the parent to avoid remount on every render ─

const inp = 'w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20'
const lbl = 'block text-sm font-medium mb-1'

function detectGender(ic: string): 'male' | 'female' | null {
  return genderFromIC(ic)
}

interface WitnessFormProps {
  num:           number
  data:          WasiatWitness
  isBeneficiary: boolean
  ms:            boolean
  update:        (key: keyof WasiatWitness, value: string) => void
  onRemove?:     () => void
}

function WitnessForm({ num, data, isBeneficiary, ms, update, onRemove }: WitnessFormProps) {
  const gender = detectGender(data.ic_number)

  return (
    <div className="border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">
            {ms ? `Saksi ${num}` : `Witness ${num}`}
          </h3>
          {isValidIC(data.ic_number) && gender && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              gender === 'male'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-pink-100 text-pink-700'
            }`}>
              {gender === 'male' ? (ms ? '♂ Lelaki' : '♂ Male') : (ms ? '♀ Perempuan' : '♀ Female')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isBeneficiary && (
            <span className="flex items-center gap-1.5 text-xs text-destructive font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              {ms ? 'Penerima manfaat' : 'Is a beneficiary'}
            </span>
          )}
          {onRemove && (
            <button type="button" onClick={onRemove} className="p-1 text-muted-foreground hover:text-destructive transition">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full name */}
        <div className="sm:col-span-2">
          <label className={lbl}>
            {ms ? 'Nama Penuh' : 'Full Name'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <input
            className={`${inp} ${isBeneficiary ? 'border-destructive' : ''}`}
            value={data.full_name}
            onChange={e => update('full_name', e.target.value.toUpperCase())}
            placeholder={ms ? `NAMA PENUH SAKSI ${num}` : `WITNESS ${num} FULL NAME`}
          />
        </div>

        {/* IC */}
        <div>
          <label className={lbl}>
            {ms ? 'No. Kad Pengenalan' : 'IC Number'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <input
            className={`${inp} ${isBeneficiary ? 'border-destructive' : ''}`}
            value={formatIC(data.ic_number)}
            onChange={e => update('ic_number', e.target.value.replace(/\D/g, '').slice(0, 12))}
            placeholder="820101-01-2345"
            maxLength={14}
          />
          {data.ic_number && !isValidIC(data.ic_number) && (
            <p className="text-xs text-destructive mt-1">{ms ? 'IC tidak sah (12 digit)' : 'Invalid IC (12 digits)'}</p>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className={lbl}>
            {ms ? 'Alamat Penuh' : 'Full Address'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <textarea
            className={`${inp} min-h-[80px] resize-y`}
            value={data.address}
            onChange={e => update('address', e.target.value.toUpperCase())}
            placeholder={ms ? 'NO. RUMAH, JALAN, BANDAR, POSKOD, NEGERI' : 'HOUSE NO., STREET, CITY, POSTCODE, STATE'}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

interface Props {
  initialData:   WasiatWitnesses | null
  beneficiaries: WasiatBeneficiary[] | null
  onChange:      (data: WasiatWitnesses) => void
  onValidChange: (valid: boolean) => void
}

const EMPTY_WITNESS: WasiatWitness = { full_name: '', ic_number: '', address: '' }

export function Step6Witnesses({ initialData, beneficiaries, onChange, onValidChange }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'

  const [w1, setW1] = useState<WasiatWitness>(initialData?.witness_1 ?? EMPTY_WITNESS)
  const [w2, setW2] = useState<WasiatWitness>(initialData?.witness_2 ?? EMPTY_WITNESS)
  const [w3, setW3] = useState<WasiatWitness | null>(initialData?.witness_3 ?? null)

  const beneficiaryICs = new Set(
    (beneficiaries ?? []).map(b => b.ic_number.replace(/-/g, ''))
  )

  const w1IsBeneficiary = w1.ic_number.length === 12 && beneficiaryICs.has(w1.ic_number)
  const w2IsBeneficiary = w2.ic_number.length === 12 && beneficiaryICs.has(w2.ic_number)
  const w3IsBeneficiary = !!w3 && w3.ic_number.length === 12 && beneficiaryICs.has(w3.ic_number)

  const allICs = [w1.ic_number, w2.ic_number, w3?.ic_number].filter(Boolean)
  const hasDuplicateIC = allICs.length !== new Set(allICs).size

  // Gender detection
  const g1 = detectGender(w1.ic_number)
  const g2 = detectGender(w2.ic_number)
  const g3 = w3 ? detectGender(w3.ic_number) : null

  // Count males among valid witnesses
  const witnesses = [
    { g: g1, ic: w1.ic_number },
    { g: g2, ic: w2.ic_number },
    ...(w3 ? [{ g: g3, ic: w3.ic_number }] : []),
  ].filter(w => isValidIC(w.ic))

  const maleCount   = witnesses.filter(w => w.g === 'male').length
  const femaleCount = witnesses.filter(w => w.g === 'female').length

  // Valid combos: 2 males, OR 1 male + 2 females (needs 3rd witness)
  const genderValid =
    witnesses.length < 2
      ? true  // don't show error until enough entered
      : (maleCount >= 2) || (maleCount >= 1 && femaleCount >= 2)

  // Need 3rd witness hint: exactly 1 male + 1 female entered, no w3 yet
  const needsThirdWitness = maleCount === 1 && femaleCount === 1 && !w3

  const w1Valid = w1.full_name.trim() !== '' && isValidIC(w1.ic_number) && w1.address.trim() !== ''
  const w2Valid = w2.full_name.trim() !== '' && isValidIC(w2.ic_number) && w2.address.trim() !== ''
  const w3Valid = !w3 || (w3.full_name.trim() !== '' && isValidIC(w3.ic_number) && w3.address.trim() !== '')

  const isValid =
    w1Valid && w2Valid && w3Valid &&
    !w1IsBeneficiary && !w2IsBeneficiary && !w3IsBeneficiary &&
    !hasDuplicateIC && genderValid && !needsThirdWitness

  useEffect(() => {
    onChange({ witness_1: w1, witness_2: w2, ...(w3 ? { witness_3: w3 } : {}) })
    onValidChange(isValid)
  }, [w1, w2, w3]) // eslint-disable-line react-hooks/exhaustive-deps

  function updateW1(key: keyof WasiatWitness, value: string) { setW1(prev => ({ ...prev, [key]: value })) }
  function updateW2(key: keyof WasiatWitness, value: string) { setW2(prev => ({ ...prev, [key]: value })) }
  function updateW3(key: keyof WasiatWitness, value: string) { setW3(prev => prev ? { ...prev, [key]: value } : prev) }

  return (
    <div className="space-y-6">
      {/* Requirements notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 space-y-2">
        <p className="font-semibold">{ms ? 'Syarat Saksi Wasiat' : 'Witness Requirements'}</p>
        <ul className="space-y-1 text-xs leading-relaxed list-none">
          <li>✓ {ms ? <><strong>Muslim</strong> — saksi mestilah beragama Islam</> : <><strong>Muslim</strong> — witnesses must be Muslim</>}</li>
          <li>✓ {ms
            ? <><strong>Bilangan & jantina</strong> — dua lelaki Muslim, ATAU seorang lelaki + dua perempuan Muslim (3 saksi)</>
            : <><strong>Number & gender</strong> — two Muslim men, OR one Muslim man + two Muslim women (3 witnesses)</>}
          </li>
          <li>✓ {ms ? <><strong>Baligh & berakal</strong> — dewasa dan sihat akal</> : <><strong>Baligh & berakal</strong> — adult and of sound mind</>}</li>
          <li>✓ {ms ? <><strong>Adil</strong> — berkelakuan baik dan boleh dipercayai</> : <><strong>Adil</strong> — of good character and trustworthy</>}</li>
          <li>✗ {ms ? <><strong>Bukan penerima manfaat</strong> dalam wasiat ini</> : <><strong>Not a beneficiary</strong> in this Wasiat</>}</li>
          <li>✗ {ms ? <><strong>Bukan suami/isteri</strong> kepada mana-mana penerima manfaat</> : <><strong>Not spouse</strong> of any beneficiary</>}</li>
        </ul>
        <p className="text-xs text-amber-700 italic border-t border-amber-300 pt-2">
          {ms
            ? 'Jantina dikesan secara automatik daripada digit terakhir No. IC Malaysia (ganjil = lelaki, genap = perempuan).'
            : 'Gender is auto-detected from the last digit of the Malaysian IC (odd = male, even = female).'}
        </p>
      </div>

      {/* Duplicate IC warning */}
      {hasDuplicateIC && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive text-sm text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{ms ? 'Saksi-saksi mestilah orang yang berbeza.' : 'All witnesses must be different individuals.'}</span>
        </div>
      )}

      {/* Gender combination warning */}
      {witnesses.length >= 2 && !genderValid && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive text-sm text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {ms
              ? 'Kombinasi saksi tidak sah. Diperlukan: 2 lelaki Muslim, ATAU 1 lelaki + 2 perempuan Muslim.'
              : 'Invalid witness combination. Required: 2 Muslim men, OR 1 Muslim man + 2 Muslim women.'}
          </span>
        </div>
      )}

      {/* Hint: needs 3rd witness */}
      {needsThirdWitness && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-300 text-sm text-blue-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {ms
              ? 'Anda mempunyai 1 lelaki + 1 perempuan. Sila tambah saksi ketiga (perempuan Muslim) untuk melengkapkan kombinasi yang sah.'
              : 'You have 1 male + 1 female. Please add a 3rd witness (Muslim woman) to complete a valid combination.'}
          </span>
        </div>
      )}

      <WitnessForm num={1} data={w1} isBeneficiary={w1IsBeneficiary} ms={ms} update={updateW1} />
      <WitnessForm num={2} data={w2} isBeneficiary={w2IsBeneficiary} ms={ms} update={updateW2} />

      {/* Optional 3rd witness */}
      {w3 ? (
        <WitnessForm
          num={3}
          data={w3}
          isBeneficiary={w3IsBeneficiary}
          ms={ms}
          update={updateW3}
          onRemove={() => setW3(null)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setW3({ ...EMPTY_WITNESS })}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium py-2 transition"
        >
          <Plus className="w-4 h-4" />
          {ms ? 'Tambah Saksi Ketiga (jika perlu)' : 'Add 3rd Witness (if needed)'}
        </button>
      )}
    </div>
  )
}
