'use client'

import { useState, useEffect } from 'react'
import { InfoTip } from '@/components/forms/InfoTip'
import { useLocale } from 'next-intl'
import { AlertTriangle, PenLine, Clock } from 'lucide-react'
import type { WillWitnesses, WillWitness, WillBeneficiary, ResidualEstateBeneficiary, WillTestatorInfo } from '@/types/database'
import { isValidIC, isValidIDNumber, isValidPassport, formatIC, genderFromIC } from '@/lib/validation'

const inp = 'w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20'
const lbl = 'block text-sm font-medium mb-1'

interface WitnessFormProps {
  num:           number
  data:          WillWitness
  isBeneficiary: boolean
  ms:            boolean
  update:        (key: keyof WillWitness, value: string) => void
}

function WitnessForm({ num, data, isBeneficiary, ms, update }: WitnessFormProps) {
  const idType = data.id_type ?? 'ic'
  const gender = idType === 'ic' && isValidIC(data.ic_number) ? genderFromIC(data.ic_number) : null

  const idLabel    = idType === 'ic'
    ? (ms ? 'No. Kad Pengenalan' : 'IC Number')
    : (ms ? 'No. Pasport'        : 'Passport Number')

  const idPlaceholder = idType === 'ic' ? '820101-01-2345' : (ms ? 'A12345678' : 'A12345678')

  const idValue  = idType === 'ic' ? formatIC(data.ic_number) : data.ic_number
  const idMaxLen = idType === 'ic' ? 14 : 20

  function handleIdChange(raw: string) {
    if (idType === 'ic') {
      update('ic_number', raw.replace(/\D/g, '').slice(0, 12))
    } else {
      update('ic_number', raw.replace(/\s/g, '').toUpperCase().slice(0, 20))
    }
  }

  const idError = data.ic_number
    ? (idType === 'ic'
        ? (!isValidIC(data.ic_number) ? (ms ? 'IC tidak sah (12 digit)' : 'Invalid IC (12 digits)') : null)
        : (!isValidPassport(data.ic_number) ? (ms ? 'No. pasport tidak sah (6–20 aksara alfanumerik)' : 'Invalid passport (6–20 alphanumeric characters)') : null))
    : null

  return (
    <div className="border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">
            {ms ? `Saksi ${num}` : `Witness ${num}`}
          </h3>
          {gender && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
            }`}>
              {gender === 'male' ? (ms ? '♂ Lelaki' : '♂ Male') : (ms ? '♀ Perempuan' : '♀ Female')}
            </span>
          )}
        </div>
        {isBeneficiary && (
          <span className="flex items-center gap-1.5 text-xs text-destructive font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            {ms ? 'Penerima manfaat' : 'Is a beneficiary'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* ID type toggle */}
        <div className="sm:col-span-2">
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            {ms ? 'Jenis Dokumen Pengenalan *' : 'Identity Document Type *'}
          </p>
          <div className="flex gap-2">
            {(['ic', 'passport'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => { update('id_type' as keyof WillWitness, t); update('ic_number', '') }}
                className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition ${
                  idType === t
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {t === 'ic'
                  ? (ms ? 'Kad Pengenalan (Malaysia)' : 'IC (Malaysian)')
                  : (ms ? 'Pasport (Antarabangsa)'    : 'Passport (Foreign)')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={lbl}>
            {idLabel}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <input
            className={`${inp} ${isBeneficiary ? 'border-destructive' : ''}`}
            value={idValue}
            onChange={e => handleIdChange(e.target.value)}
            placeholder={idPlaceholder}
            maxLength={idMaxLen}
          />
          {idError && <p className="text-xs text-destructive mt-1">{idError}</p>}
          {idType === 'passport' && (
            <p className="text-xs text-muted-foreground mt-1">
              {ms ? 'Diterima untuk saksi asing — tiada sekatan kewarganegaraan di bawah Akta Wasiat 1959'
                  : 'Accepted for foreign witnesses — no nationality restriction under the Wills Act 1959'}
            </p>
          )}
        </div>

        <div>
          <label className={lbl}>{ms ? 'No. Telefon' : 'Phone Number'}</label>
          <input
            className={inp}
            value={data.phone ?? ''}
            onChange={e => update('phone' as keyof WillWitness, e.target.value)}
            placeholder="0123456789"
          />
        </div>

        <div>
          <label className={lbl}>{ms ? 'E-mel' : 'Email'}</label>
          <input
            type="email"
            className={inp}
            value={data.email ?? ''}
            onChange={e => update('email' as keyof WillWitness, e.target.value)}
            placeholder="witness@example.com"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={lbl}>
            {ms ? 'Alamat Penuh' : 'Full Address'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <textarea
            className={`${inp} min-h-[80px] resize-y`}
            value={data.address}
            onChange={e => update('address', e.target.value.toUpperCase())}
            placeholder={ms ? 'NO. RUMAH, JALAN, BANDAR, POSKOD, NEGERI / NEGARA' : 'HOUSE/UNIT NO., STREET, CITY, POSTCODE, STATE / COUNTRY'}
          />
        </div>
      </div>
    </div>
  )
}

interface Props {
  initialData:         WillWitnesses | null
  beneficiaries:       WillBeneficiary[] | null
  residualBeneficiary: ResidualEstateBeneficiary | null
  testatorInfo:        WillTestatorInfo | null
  onChange:            (data: WillWitnesses) => void
  onValidChange:       (valid: boolean) => void
}

const EMPTY: WillWitness = { full_name: '', id_type: 'ic', ic_number: '', phone: '', email: '', address: '' }

export function WillStep6Witnesses({ initialData, beneficiaries, residualBeneficiary, testatorInfo, onChange, onValidChange }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'

  const [deferred, setDeferred] = useState<boolean>(initialData?.deferred ?? false)
  const [w1, setW1] = useState<WillWitness>(initialData?.witness_1 ?? { ...EMPTY })
  const [w2, setW2] = useState<WillWitness>(initialData?.witness_2 ?? { ...EMPTY })

  // Build blocked ID set: named beneficiaries + residual beneficiary
  const normaliseRaw = (ic: string) => ic.replace(/\D/g, '') || ic.trim().toUpperCase()
  const beneficiaryIDs = new Set([
    ...(beneficiaries ?? []).map(b => normaliseRaw(b.ic_number)),
    ...(residualBeneficiary?.ic_number ? [normaliseRaw(residualBeneficiary.ic_number)] : []),
  ])

  const testatorID = testatorInfo?.ic_number ? normaliseRaw(testatorInfo.ic_number) : ''

  function normaliseID(w: WillWitness) {
    return (w.id_type ?? 'ic') === 'ic'
      ? w.ic_number.replace(/\D/g, '')
      : w.ic_number.trim().toUpperCase()
  }

  const w1ID = normaliseID(w1)
  const w2ID = normaliseID(w2)

  const w1IsBeneficiary = w1ID.length >= 6 && beneficiaryIDs.has(w1ID)
  const w2IsBeneficiary = w2ID.length >= 6 && beneficiaryIDs.has(w2ID)
  const w1IsTestator    = testatorID.length >= 6 && w1ID === testatorID
  const w2IsTestator    = testatorID.length >= 6 && w2ID === testatorID
  const hasDuplicateID  = w1ID.length >= 6 && w1ID === w2ID

  const w1Valid = w1.full_name.trim() !== '' && isValidIDNumber(w1.ic_number) && w1.address.trim() !== ''
  const w2Valid = w2.full_name.trim() !== '' && isValidIDNumber(w2.ic_number) && w2.address.trim() !== ''

  const isValid =
    w1Valid && w2Valid &&
    !w1IsBeneficiary && !w2IsBeneficiary &&
    !w1IsTestator && !w2IsTestator &&
    !hasDuplicateID

  useEffect(() => {
    if (deferred) {
      onChange({ witness_1: { ...EMPTY }, witness_2: { ...EMPTY }, deferred: true })
      onValidChange(true)
    } else {
      onChange({ witness_1: w1, witness_2: w2 })
      onValidChange(isValid)
    }
  }, [w1, w2, deferred]) // eslint-disable-line react-hooks/exhaustive-deps

  function updateW1(key: keyof WillWitness, value: string) { setW1(prev => ({ ...prev, [key]: value })) }
  function updateW2(key: keyof WillWitness, value: string) { setW2(prev => ({ ...prev, [key]: value })) }

  return (
    <div className="space-y-6">

      {/* Fill now vs fill at signing toggle */}
      <div className="grid grid-cols-2 gap-3">
        {([
          { value: false, icon: PenLine, labelMs: 'Isi Sekarang',           labelEn: 'Fill In Now',     descMs: 'Masukkan maklumat saksi dalam borang ini',                                        descEn: 'Enter witness details in this form' },
          { value: true,  icon: Clock,   labelMs: 'Isi Semasa Tandatangan', labelEn: 'Fill At Signing', descMs: 'Biarkan kosong — isi secara tulis tangan semasa menandatangani dokumen bercetak', descEn: 'Leave blank — fill in by hand when signing the printed document' },
        ] as const).map(({ value, icon: Icon, labelMs, labelEn, descMs, descEn }) => (
          <button
            key={String(value)}
            type="button"
            onClick={() => setDeferred(value)}
            className={`flex flex-col items-start gap-1.5 rounded-xl border-2 p-4 text-left transition ${
              deferred === value
                ? 'border-primary bg-primary/5'
                : 'border-border bg-background hover:border-primary/40'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${deferred === value ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-sm font-semibold ${deferred === value ? 'text-primary' : 'text-foreground'}`}>
                {ms ? labelMs : labelEn}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {ms ? descMs : descEn}
            </p>
          </button>
        ))}
      </div>

      {deferred ? (
        <div className="rounded-xl border border-border bg-muted/30 p-5 text-sm space-y-2">
          <p className="font-medium text-foreground">
            {ms ? 'Maklumat saksi akan diisi semasa tandatangan.' : 'Witness details will be filled in at signing.'}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {ms
              ? 'PDF akan dijanakan dengan ruangan saksi yang kosong. Tuliskan nama, no. kad pengenalan, alamat dan tandatangan saksi secara tangan pada dokumen bercetak semasa majlis tandatangan.'
              : 'The PDF will be generated with blank witness fields. Write in the witness names, IC numbers, addresses and signatures by hand on the printed document at signing.'}
          </p>
        </div>
      ) : (
        <>
          <InfoTip titleMs="ℹ️ Syarat Saksi — Baca Sebelum Isi" titleEn="ℹ️ Witness Requirements — Read First" ms={ms} variant="blue">
            <div className="text-sm text-blue-800 space-y-2 mt-2">
              <p className="font-semibold">{ms ? 'Syarat Saksi (Akta Wasiat 1959)' : 'Witness Requirements (Wills Act 1959)'}</p>
              <ul className="space-y-1 text-xs leading-relaxed list-none">
                <li>✓ {ms ? <><strong>Dua saksi</strong> diperlukan — tandatangan serentak di hadapan pewasiat</> : <><strong>Two witnesses</strong> required — sign simultaneously in the testator&apos;s presence</>}</li>
                <li>✓ {ms ? <><strong>Berumur 18 tahun ke atas</strong> dan sihat akal</> : <><strong>Aged 18 and above</strong> and of sound mind</>}</li>
                <li>✓ {ms ? <><strong>Tiada sekatan jantina, agama, atau kewarganegaraan</strong> — warganegara asing diterima</> : <><strong>No gender, religion, or nationality restriction</strong> — foreign nationals accepted</>}</li>
                <li>✓ {ms ? <><strong>Pasport diterima</strong> bagi saksi asing</> : <><strong>Passport accepted</strong> for foreign witnesses</>}</li>
              </ul>
            </div>
          </InfoTip>

          <div className="flex gap-3 bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-semibold mb-0.5">{ms ? 'Larangan Undang-Undang' : 'Legal Restriction'}</p>
              <p className="leading-relaxed">
                {ms
                  ? 'Saksi TIDAK BOLEH menjadi penerima manfaat atau pasangan kepada penerima manfaat dalam Surat Wasiat ini. Wasiat yang ditandatangani oleh saksi yang juga penerima manfaat adalah sah, tetapi pemberian kepada saksi tersebut akan terbatal.'
                  : 'A witness MUST NOT be a beneficiary or the spouse of a beneficiary in this Will. The Will remains valid, but any gift to such a witness will be void.'}
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {ms
              ? '* Jantina dikesan secara automatik daripada digit terakhir No. IC Malaysia (ganjil = lelaki, genap = perempuan).'
              : '* Gender is auto-detected from the last digit of a Malaysian IC number (odd = male, even = female).'}
          </p>

          {hasDuplicateID && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive text-sm text-destructive">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{ms ? 'Saksi-saksi mestilah orang yang berbeza.' : 'Witnesses must be different individuals.'}</span>
            </div>
          )}

          {(w1IsTestator || w2IsTestator) && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive text-sm text-destructive">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{ms ? 'Pewasiat tidak boleh menjadi saksi kepada wasiat sendiri.' : 'The testator cannot witness their own Will.'}</span>
            </div>
          )}

          <WitnessForm num={1} data={w1} isBeneficiary={w1IsBeneficiary || w1IsTestator} ms={ms} update={updateW1} />
          <WitnessForm num={2} data={w2} isBeneficiary={w2IsBeneficiary || w2IsTestator} ms={ms} update={updateW2} />
        </>
      )}
    </div>
  )
}
