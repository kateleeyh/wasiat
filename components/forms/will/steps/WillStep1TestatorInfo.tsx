'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import type { WillTestatorInfo, Gender, MaritalStatus } from '@/types/database'
import {
  isValidIC, isValidPhone, formatIC, genderFromIC, dobFromIC,
  genderMismatchWarning,
} from '@/lib/validation'

function isValidEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }

const MS_RELIGIONS = ['Islam', 'Kristian', 'Buddha', 'Hindu', 'Tao', 'Sikh', 'Tiada Agama', 'Lain-lain']
const EN_RELIGIONS = ['Islam', 'Christianity', 'Buddhism', 'Hinduism', 'Taoism', 'Sikhism', 'No Religion', 'Others']

interface Props {
  initialData:   WillTestatorInfo | null
  onChange:      (data: WillTestatorInfo) => void
  onValidChange: (valid: boolean) => void
  docLanguage:   'ms' | 'en'
}

const EMPTY: WillTestatorInfo = {
  full_name: '', ic_number: '', dob: '', gender: 'male',
  marital_status: 'single', nationality: 'Malaysian', religion: '',
  address: '', phone: '', email: '',
}

export function WillStep1TestatorInfo({ initialData, onChange, onValidChange, docLanguage }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'
  const [form, setForm]       = useState<WillTestatorInfo>(initialData ?? EMPTY)
  const [touched, setTouched] = useState<Partial<Record<keyof WillTestatorInfo, boolean>>>({})
  const religionList = docLanguage === 'ms' ? MS_RELIGIONS : EN_RELIGIONS
  const [religionCustom, setReligionCustom] = useState(() => {
    const v = initialData?.religion ?? ''
    return v !== '' && !MS_RELIGIONS.includes(v) && !EN_RELIGIONS.includes(v)
  })
  const showReligionInput = religionCustom || (form.religion !== '' && !religionList.includes(form.religion))

  // Auto-fill DOB and gender from IC
  useEffect(() => {
    const digits = form.ic_number.replace(/\D/g, '')
    if (digits.length === 12) {
      const dob    = dobFromIC(digits)
      const gender = genderFromIC(digits)
      setForm(prev => ({
        ...prev,
        dob:    dob ? dob.toISOString().split('T')[0] : prev.dob,
        gender: gender ?? prev.gender,
      }))
    }
  }, [form.ic_number]) // eslint-disable-line react-hooks/exhaustive-deps

  const errors = {
    full_name:  !form.full_name.trim()     ? (ms ? 'Nama diperlukan' : 'Name is required') : '',
    ic_number:  !isValidIC(form.ic_number) ? (ms ? 'No. IC tidak sah' : 'Invalid IC number') : '',
    dob:        !form.dob                  ? (ms ? 'Tarikh lahir diperlukan' : 'Date of birth required') : '',
    address:    !form.address.trim()       ? (ms ? 'Alamat diperlukan' : 'Address is required') : '',
    phone:      !isValidPhone(form.phone)  ? (ms ? 'No. telefon tidak sah' : 'Invalid phone number') : '',
    email:      !isValidEmail(form.email)  ? (ms ? 'E-mel tidak sah' : 'Invalid email') : '',
    religion:   !form.religion.trim()      ? (ms ? 'Agama diperlukan' : 'Religion is required') : '',
    nationality:!form.nationality.trim()   ? (ms ? 'Kewarganegaraan diperlukan' : 'Nationality is required') : '',
  }
  const isValid = Object.values(errors).every(e => !e)

  const genderWarning = genderMismatchWarning(form.full_name, form.ic_number, ms)

  useEffect(() => {
    onChange(form)
    onValidChange(isValid)
  }, [form]) // eslint-disable-line react-hooks/exhaustive-deps

  function set<K extends keyof WillTestatorInfo>(key: K, value: WillTestatorInfo[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setTouched(prev => ({ ...prev, [key]: true }))
  }
  function blur(key: keyof WillTestatorInfo) {
    setTouched(prev => ({ ...prev, [key]: true }))
  }
  function err(key: keyof typeof errors) {
    return touched[key] ? errors[key] : ''
  }

  const inp = 'w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20'
  const lbl = 'block text-sm font-medium mb-1'

  return (
    <div className="space-y-6">
      {/* Wills Act notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <p className="font-semibold text-blue-800 mb-1">{ms ? 'Akta Wasiat 1959' : 'Wills Act 1959'}</p>
        <p className="text-blue-700 text-xs leading-relaxed">
          {ms
            ? 'Surat Wasiat Am ini disediakan di bawah Akta Wasiat 1959 (Malaysia). Ia boleh dibuat oleh mana-mana individu yang berumur 18 tahun ke atas dan sihat akal, tanpa mengira agama.'
            : 'This General Will is prepared under the Wills Act 1959 (Malaysia). It may be made by any individual aged 18 and above of sound mind, regardless of religion.'}
        </p>
      </div>

      {/* Distribution Act explanation */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 space-y-3">
        <p className="font-semibold">{ms ? 'Mengapa Surat Wasiat Penting?' : 'Why Is a Will Important?'}</p>
        <div className="space-y-2 text-xs leading-relaxed">
          <p>
            {ms
              ? 'Tanpa Surat Wasiat, harta anda akan dibahagikan mengikut '
              : 'Without a Will, your estate is distributed under the '}
            <strong>{ms ? 'Akta Pembahagian 1958' : 'Distribution Act 1958'}</strong>
            {ms
              ? ' — formula tetap yang mungkin tidak mencerminkan kehendak anda.'
              : ' — a fixed formula that may not reflect your wishes.'}
          </p>
          <div className="bg-amber-100 rounded-lg p-3 space-y-1">
            <p className="font-semibold text-amber-900">{ms ? 'Formula Akta Pembahagian 1958:' : 'Distribution Act 1958 Formula:'}</p>
            <ul className="space-y-0.5 list-none">
              <li>• {ms ? 'Ada pasangan & anak → Pasangan ¼, Anak ¾' : 'Spouse & children → Spouse ¼, Children ¾'}</li>
              <li>• {ms ? 'Ada pasangan sahaja (tiada anak) → Pasangan ½, Ibu bapa ½' : 'Spouse only (no children) → Spouse ½, Parents ½'}</li>
              <li>• {ms ? 'Ada anak sahaja (tiada pasangan) → Anak semua' : 'Children only (no spouse) → Children take all'}</li>
              <li>• {ms ? 'Tiada pasangan, anak, atau ibu bapa → Saudara mara' : 'No spouse, children, or parents → Siblings/relatives'}</li>
            </ul>
          </div>
          <p className="text-amber-700">
            {ms
              ? '⚠ Akta ini tidak memperuntukkan bahagian kepada rakan, kekasih, badan amal, atau mana-mana orang yang anda pilih di luar keluarga. Surat Wasiat membolehkan anda menentukannya sendiri.'
              : '⚠ The Act makes no provision for friends, partners, charities, or anyone outside the defined family. A Will lets you decide for yourself.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Full name */}
        <div className="sm:col-span-2">
          <label className={lbl}>
            {ms ? 'Nama Penuh (seperti dalam MyKad)' : 'Full Name (as per MyKad)'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <input
            className={inp}
            value={form.full_name}
            onChange={e => set('full_name', e.target.value.toUpperCase())}
            onBlur={() => blur('full_name')}
            placeholder={docLanguage === 'ms' ? 'cth. ZHANG SAN HE' : 'e.g. ZHANG SAN HE'}
          />
          {err('full_name') && <p className="text-xs text-destructive mt-1">{err('full_name')}</p>}
          {genderWarning && !err('full_name') && (
            <p className="text-xs text-amber-600 mt-1">⚠ {genderWarning}</p>
          )}
        </div>

        {/* IC number */}
        <div>
          <label className={lbl}>
            {ms ? 'No. Kad Pengenalan' : 'IC Number'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <input
            className={inp}
            value={formatIC(form.ic_number)}
            onChange={e => set('ic_number', e.target.value.replace(/\D/g, '').slice(0, 12))}
            onBlur={() => blur('ic_number')}
            placeholder="820101-01-2345"
            maxLength={14}
          />
          {err('ic_number') && <p className="text-xs text-destructive mt-1">{err('ic_number')}</p>}
          {isValidIC(form.ic_number) && (
            <p className="text-xs text-emerald-600 mt-1">
              {ms ? '✓ Tarikh lahir & jantina diisi secara automatik' : '✓ DOB & gender auto-filled'}
            </p>
          )}
        </div>

        {/* Date of birth */}
        <div>
          <label className={lbl}>
            {ms ? 'Tarikh Lahir' : 'Date of Birth'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <input
            type="date"
            className={`${inp} bg-muted/30`}
            value={form.dob}
            onChange={e => set('dob', e.target.value)}
            onBlur={() => blur('dob')}
            max={new Date().toISOString().split('T')[0]}
          />
          {err('dob') && <p className="text-xs text-destructive mt-1">{err('dob')}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className={lbl}>
            {ms ? 'Jantina' : 'Gender'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <select className={`${inp} bg-muted/30`} value={form.gender} onChange={e => set('gender', e.target.value as Gender)}>
            <option value="male">{ms ? 'Lelaki' : 'Male'}</option>
            <option value="female">{ms ? 'Perempuan' : 'Female'}</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            {ms ? 'Diisi automatik daripada No. IC' : 'Auto-filled from IC number'}
          </p>
        </div>

        {/* Marital status */}
        <div>
          <label className={lbl}>
            {ms ? 'Status Perkahwinan' : 'Marital Status'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <select className={inp} value={form.marital_status} onChange={e => set('marital_status', e.target.value as MaritalStatus)}>
            <option value="single">{ms ? 'Bujang' : 'Single'}</option>
            <option value="married">{ms ? 'Berkahwin' : 'Married'}</option>
            <option value="widowed">{ms ? 'Balu / Duda' : 'Widowed'}</option>
            <option value="divorced">{ms ? 'Bercerai' : 'Divorced'}</option>
          </select>
        </div>

        {/* Nationality */}
        <div>
          <label className={lbl}>
            {ms ? 'Kewarganegaraan' : 'Nationality'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <input
            className={inp}
            value={form.nationality}
            onChange={e => set('nationality', e.target.value)}
            onBlur={() => blur('nationality')}
            placeholder={ms ? 'cth. Warganegara Malaysia' : 'e.g. Malaysian'}
          />
          {err('nationality') && <p className="text-xs text-destructive mt-1">{err('nationality')}</p>}
        </div>

        {/* Religion */}
        <div>
          <label className={lbl}>
            {ms ? 'Agama' : 'Religion'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <>
            <select
              className={inp}
              value={showReligionInput ? '__other__' : form.religion}
              onChange={e => {
                if (e.target.value === '__other__') { setReligionCustom(true); set('religion', '') }
                else { setReligionCustom(false); set('religion', e.target.value) }
              }}
              onBlur={() => blur('religion')}
            >
              <option value="">{docLanguage === 'ms' ? '-- Pilih agama --' : '-- Select religion --'}</option>
              {religionList.map(r => <option key={r} value={r}>{r}</option>)}
              <option value="__other__">{docLanguage === 'ms' ? 'Lain-lain (nyatakan)' : 'Others (specify)'}</option>
            </select>
            {showReligionInput && (
              <input
                className={inp + ' mt-2'}
                value={form.religion}
                onChange={e => set('religion', e.target.value)}
                onBlur={() => blur('religion')}
                placeholder={docLanguage === 'ms' ? 'Nyatakan agama' : 'Specify religion'}
                autoFocus
              />
            )}
          </>
          {err('religion') && <p className="text-xs text-destructive mt-1">{err('religion')}</p>}
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className={lbl}>
            {ms ? 'Alamat Penuh' : 'Full Address'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <textarea
            className={`${inp} min-h-[80px] resize-y`}
            value={form.address}
            onChange={e => set('address', e.target.value.toUpperCase())}
            onBlur={() => blur('address')}
            placeholder={ms ? 'NO. RUMAH, JALAN, BANDAR, POSKOD, NEGERI' : 'HOUSE NO., STREET, CITY, POSTCODE, STATE'}
          />
          {err('address') && <p className="text-xs text-destructive mt-1">{err('address')}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className={lbl}>
            {ms ? 'No. Telefon' : 'Phone Number'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <input
            className={inp}
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            onBlur={() => blur('phone')}
            placeholder="0123456789"
          />
          {err('phone') && <p className="text-xs text-destructive mt-1">{err('phone')}</p>}
        </div>

        {/* Email */}
        <div>
          <label className={lbl}>
            {ms ? 'E-mel' : 'Email'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <input
            type="email"
            className={inp}
            value={form.email}
            onChange={e => set('email', e.target.value)}
            onBlur={() => blur('email')}
            placeholder={docLanguage === 'ms' ? 'ahmad@example.com' : 'john@example.com'}
          />
          {err('email') && <p className="text-xs text-destructive mt-1">{err('email')}</p>}
        </div>
      </div>
    </div>
  )
}
