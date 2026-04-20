'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import type { WasiatTestatorInfo, Gender, MaritalStatus } from '@/types/database'
import {
  isValidIC, isValidPhone, formatIC, genderFromIC, dobFromIC,
  genderFromName, genderMismatchWarning,
} from '@/lib/validation'

const MALAYSIAN_STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
  'Pahang', 'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak',
  'Selangor', 'Terengganu',
  'W.P. Kuala Lumpur', 'W.P. Labuan', 'W.P. Putrajaya',
]

function isValidEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }

interface Props {
  initialData:   WasiatTestatorInfo | null
  onChange:      (data: WasiatTestatorInfo) => void
  onValidChange: (valid: boolean) => void
}

const EMPTY: WasiatTestatorInfo = {
  full_name: '', ic_number: '', dob: '', gender: 'male',
  marital_status: 'single', address: '', phone: '', email: '',
  religion_confirmed: false, state: '',
}

export function Step1TestatorInfo({ initialData, onChange, onValidChange }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'
  const [form, setForm]       = useState<WasiatTestatorInfo>(initialData ?? EMPTY)
  const [touched, setTouched] = useState<Partial<Record<keyof WasiatTestatorInfo, boolean>>>({})

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
    full_name:          !form.full_name.trim()     ? (ms ? 'Nama diperlukan' : 'Name is required') : '',
    ic_number:          !isValidIC(form.ic_number) ? (ms ? 'No. IC tidak sah' : 'Invalid IC number') : '',
    dob:                !form.dob                  ? (ms ? 'Tarikh lahir diperlukan' : 'Date of birth required') : '',
    address:            !form.address.trim()       ? (ms ? 'Alamat diperlukan' : 'Address is required') : '',
    phone:              !isValidPhone(form.phone)  ? (ms ? 'No. telefon tidak sah' : 'Invalid phone number') : '',
    email:              !isValidEmail(form.email)  ? (ms ? 'E-mel tidak sah' : 'Invalid email') : '',
    state:              !form.state                ? (ms ? 'Negeri diperlukan' : 'State is required') : '',
    religion_confirmed: !form.religion_confirmed   ? (ms ? 'Pengesahan diperlukan' : 'Confirmation required') : '',
  }
  const isValid = Object.values(errors).every(e => !e)

  // Soft gender mismatch warning (name bin/binti vs IC)
  const genderWarning = genderMismatchWarning(form.full_name, form.ic_number, ms)

  useEffect(() => {
    onChange(form)
    onValidChange(isValid)
  }, [form]) // eslint-disable-line react-hooks/exhaustive-deps

  function set<K extends keyof WasiatTestatorInfo>(key: K, value: WasiatTestatorInfo[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setTouched(prev => ({ ...prev, [key]: true }))
  }
  function blur(key: keyof WasiatTestatorInfo) {
    setTouched(prev => ({ ...prev, [key]: true }))
  }
  function err(key: keyof typeof errors) {
    return touched[key] ? errors[key] : ''
  }

  // IC display: show formatted with dashes
  const icDisplay = formatIC(form.ic_number)

  const inp = 'w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20'
  const lbl = 'block text-sm font-medium mb-1'

  return (
    <div className="space-y-6">
      {/* Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
        <p className="font-semibold text-amber-800 mb-1">{ms ? 'Peringatan' : 'Notice'}</p>
        <p className="text-amber-700">
          {ms
            ? 'Wasiat ini adalah untuk pewasiat beragama Islam sahaja. Sila sahkan status agama anda di bawah.'
            : 'This Wasiat is for Muslim testators only. Please confirm your religion at the bottom of this form.'}
        </p>
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
            placeholder={ms ? 'cth. AHMAD BIN IBRAHIM' : 'e.g. AHMAD BIN IBRAHIM'}
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
            value={icDisplay}
            onChange={e => set('ic_number', e.target.value.replace(/\D/g, '').slice(0, 12))}
            onBlur={() => blur('ic_number')}
            placeholder="820101-01-2345"
            maxLength={14}
          />
          {err('ic_number') && <p className="text-xs text-destructive mt-1">{err('ic_number')}</p>}
          {isValidIC(form.ic_number) && (
            <p className="text-xs text-emerald-600 mt-1">
              {ms ? `✓ Tarikh lahir & jantina diisi secara automatik` : `✓ DOB & gender auto-filled`}
            </p>
          )}
        </div>

        {/* Date of birth — auto-filled from IC */}
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

        {/* Gender — auto-filled from IC */}
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

        {/* State */}
        <div className="sm:col-span-2">
          <label className={lbl}>
            {ms ? 'Negeri (untuk tujuan Mahkamah Syariah)' : 'State (for Syariah Court purposes)'}
            <span className="text-destructive ml-0.5">*</span>
          </label>
          <select className={inp} value={form.state} onChange={e => set('state', e.target.value)} onBlur={() => blur('state')}>
            <option value="">{ms ? '-- Pilih negeri --' : '-- Select state --'}</option>
            {MALAYSIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {err('state') && <p className="text-xs text-destructive mt-1">{err('state')}</p>}
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
            placeholder="ahmad@example.com"
          />
          {err('email') && <p className="text-xs text-destructive mt-1">{err('email')}</p>}
        </div>
      </div>

      {/* Religion confirmation */}
      <div className={`border rounded-lg p-4 ${touched.religion_confirmed && !form.religion_confirmed ? 'border-destructive bg-destructive/5' : 'border-border'}`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 accent-primary"
            checked={form.religion_confirmed}
            onChange={e => set('religion_confirmed', e.target.checked)}
          />
          <span className="text-sm leading-relaxed">
            <span className="font-medium">{ms ? 'Pengesahan Agama' : 'Religion Confirmation'}</span>
            <br />
            {ms
              ? 'Saya mengesahkan bahawa saya seorang Muslim dan berhak untuk membuat Wasiat mengikut undang-undang Islam yang terpakai di negeri saya.'
              : 'I confirm that I am a Muslim and am entitled to make this Wasiat under the Islamic law applicable in my state.'}
          </span>
        </label>
        {touched.religion_confirmed && !form.religion_confirmed && (
          <p className="text-xs text-destructive mt-2 ml-7">{err('religion_confirmed')}</p>
        )}
      </div>
    </div>
  )
}
