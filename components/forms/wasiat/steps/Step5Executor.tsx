'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import type { WasiatPrimaryExecutor, WasiatBackupExecutor } from '@/types/database'
import {
  isValidIC, isValidPhone, formatIC, genderFromIC,
  genderMismatchWarning,
} from '@/lib/validation'

interface Props {
  initialPrimary:    WasiatPrimaryExecutor | null
  initialBackup:     WasiatBackupExecutor | null
  onPrimaryChange:   (data: WasiatPrimaryExecutor) => void
  onBackupChange:    (data: WasiatBackupExecutor | null) => void
  onValidChange:     (valid: boolean) => void
}

const BM_RELATIONSHIPS = [
  'Suami', 'Isteri',
  'Anak Lelaki', 'Anak Perempuan', 'Anak Angkat',
  'Ibu', 'Bapa',
  'Abang', 'Kakak', 'Adik Lelaki', 'Adik Perempuan',
  'Datuk', 'Nenek', 'Cucu',
  'Bapa Saudara', 'Ibu Saudara', 'Sepupu',
  'Ipar Lelaki', 'Ipar Perempuan',
  'Rakan Karib', 'Sahabat', 'Rakan Sekerja',
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

const EMPTY_PRIMARY: WasiatPrimaryExecutor = {
  full_name: '', ic_number: '', relationship: '', phone: '', address: '',
}

const EMPTY_BACKUP: WasiatBackupExecutor = {
  full_name: '', ic_number: '', relationship: '', phone: '',
}

export function Step5Executor({ initialPrimary, initialBackup, onPrimaryChange, onBackupChange, onValidChange }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'

  const [primary, setPrimary]     = useState<WasiatPrimaryExecutor>(initialPrimary ?? EMPTY_PRIMARY)
  const [hasBackup, setHasBackup] = useState<boolean>(!!initialBackup)
  const [backup, setBackup]       = useState<WasiatBackupExecutor>(initialBackup ?? EMPTY_BACKUP)

  const primaryValid =
    primary.full_name.trim() !== '' &&
    isValidIC(primary.ic_number) &&
    primary.relationship.trim() !== '' &&
    isValidPhone(primary.phone) &&
    primary.address.trim() !== ''

  const backupValid = !hasBackup || (
    backup.full_name.trim() !== '' &&
    isValidIC(backup.ic_number) &&
    backup.relationship.trim() !== '' &&
    isValidPhone(backup.phone)
  )

  const isValid = primaryValid && backupValid

  useEffect(() => {
    onPrimaryChange(primary)
    onBackupChange(hasBackup ? backup : null)
    onValidChange(isValid)
  }, [primary, backup, hasBackup]) // eslint-disable-line react-hooks/exhaustive-deps

  function setPrimaryField<K extends keyof WasiatPrimaryExecutor>(key: K, value: WasiatPrimaryExecutor[K]) {
    setPrimary(prev => ({ ...prev, [key]: value }))
  }
  function setBackupField<K extends keyof WasiatBackupExecutor>(key: K, value: WasiatBackupExecutor[K]) {
    setBackup(prev => ({ ...prev, [key]: value }))
  }

  const inp  = 'w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20'
  const lbl  = 'block text-sm font-medium mb-1'
  const lbl2 = 'block text-xs font-medium mb-1 text-muted-foreground'

  // Gender detection for display badges
  const primaryGender = isValidIC(primary.ic_number) ? genderFromIC(primary.ic_number) : null
  const backupGender  = isValidIC(backup.ic_number)  ? genderFromIC(backup.ic_number)  : null

  const primaryGenderWarn = genderMismatchWarning(primary.full_name, primary.ic_number, ms)
  const backupGenderWarn  = genderMismatchWarning(backup.full_name, backup.ic_number, ms)

  return (
    <div className="space-y-8">
      {/* Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 space-y-2">
        <p className="font-semibold">{ms ? 'Syarat Wasi (Pelaksana Wasiat)' : 'Executor (Wasi) Requirements'}</p>
        <ul className="space-y-1 text-xs leading-relaxed list-none">
          <li>✓ {ms ? <><strong>Muslim</strong> — wasi mestilah beragama Islam</> : <><strong>Muslim</strong> — the executor must be Muslim</>}</li>
          <li>✓ {ms ? <><strong>Lelaki atau perempuan</strong> — undang-undang Malaysia membenarkan wasi lelaki atau perempuan Muslim</> : <><strong>Male or female</strong> — Malaysian law permits male or female Muslim executors</>}</li>
          <li>✓ {ms ? <><strong>Baligh & berakal</strong> — dewasa dan sihat akal</> : <><strong>Baligh & berakal</strong> — adult and of sound mind</>}</li>
          <li>✓ {ms ? <><strong>Amanah</strong> — bertanggungjawab dan boleh dipercayai</> : <><strong>Trustworthy</strong> — responsible and reliable</>}</li>
        </ul>
        <p className="text-xs text-amber-700 italic">
          {ms
            ? 'Wasi bertanggungjawab melaksanakan wasiat anda, menyelesaikan hutang, dan mengagihkan harta mengikut Syariah selepas kematian anda.'
            : 'The Wasi is responsible for executing your wasiat, settling debts, and distributing assets according to Syariah after your death.'}
        </p>
      </div>

      {/* Primary executor */}
      <div>
        <h3 className="text-base font-semibold mb-4 pb-2 border-b border-border">
          {ms ? 'Wasi Utama' : 'Primary Executor'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full name */}
          <div className="sm:col-span-2">
            <label className={lbl}>
              {ms ? 'Nama Penuh' : 'Full Name'}
              <span className="text-destructive ml-0.5">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                className={inp}
                value={primary.full_name}
                onChange={e => setPrimaryField('full_name', e.target.value.toUpperCase())}
                placeholder={ms ? 'Nama penuh wasi' : 'Executor full name'}
              />
              {primaryGender && (
                <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                  primaryGender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                }`}>
                  {primaryGender === 'male' ? (ms ? '♂ Lelaki' : '♂ Male') : (ms ? '♀ Perempuan' : '♀ Female')}
                </span>
              )}
            </div>
            {primaryGenderWarn && (
              <p className="text-xs text-amber-600 mt-1">⚠ {primaryGenderWarn}</p>
            )}
          </div>

          {/* IC */}
          <div>
            <label className={lbl}>
              {ms ? 'No. Kad Pengenalan' : 'IC Number'}
              <span className="text-destructive ml-0.5">*</span>
            </label>
            <input
              className={inp}
              value={formatIC(primary.ic_number)}
              onChange={e => setPrimaryField('ic_number', e.target.value.replace(/\D/g, '').slice(0, 12))}
              placeholder="820101-01-2345"
              maxLength={14}
            />
            {primary.ic_number && !isValidIC(primary.ic_number) && (
              <p className="text-xs text-destructive mt-1">{ms ? 'IC tidak sah (12 digit)' : 'Invalid IC (12 digits)'}</p>
            )}
          </div>

          {/* Relationship */}
          <div>
            <label className={lbl}>
              {ms ? 'Hubungan dengan Pewasiat' : 'Relationship to Testator'}
              <span className="text-destructive ml-0.5">*</span>
            </label>
            <BmRelationshipSelect
              value={primary.relationship}
              onChange={v => setPrimaryField('relationship', v)}
              inp={inp}
            />
          </div>

          {/* Phone */}
          <div>
            <label className={lbl}>
              {ms ? 'No. Telefon' : 'Phone Number'}
              <span className="text-destructive ml-0.5">*</span>
            </label>
            <input
              className={inp}
              value={primary.phone}
              onChange={e => setPrimaryField('phone', e.target.value)}
              placeholder="0123456789"
            />
            {primary.phone && !isValidPhone(primary.phone) && (
              <p className="text-xs text-destructive mt-1">{ms ? 'No. telefon tidak sah' : 'Invalid phone number'}</p>
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
              value={primary.address}
              onChange={e => setPrimaryField('address', e.target.value.toUpperCase())}
              placeholder={ms ? 'NO. RUMAH, JALAN, BANDAR, POSKOD, NEGERI' : 'HOUSE NO., STREET, CITY, POSTCODE, STATE'}
            />
          </div>
        </div>
      </div>

      {/* Backup executor toggle */}
      <div className="border border-border rounded-xl overflow-hidden">
        <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/30 transition">
          <input
            type="checkbox"
            className="w-4 h-4 accent-primary"
            checked={hasBackup}
            onChange={e => setHasBackup(e.target.checked)}
          />
          <div>
            <p className="text-sm font-medium">
              {ms ? 'Tambah Wasi Simpanan (Pilihan)' : 'Add Backup Executor (Optional)'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {ms
                ? 'Wasi simpanan akan mengambil alih jika wasi utama tidak dapat menjalankan tugas'
                : 'The backup executor will take over if the primary executor is unable to act'}
            </p>
          </div>
        </label>

        {hasBackup && (
          <div className="border-t border-border p-4 bg-muted/20">
            <h3 className="text-sm font-semibold mb-4">
              {ms ? 'Wasi Simpanan' : 'Backup Executor'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full name */}
              <div className="sm:col-span-2">
                <label className={lbl2}>{ms ? 'Nama Penuh *' : 'Full Name *'}</label>
                <div className="flex items-center gap-2">
                  <input
                    className={inp}
                    value={backup.full_name}
                    onChange={e => setBackupField('full_name', e.target.value.toUpperCase())}
                    placeholder={ms ? 'Nama penuh wasi simpanan' : 'Backup executor full name'}
                  />
                  {backupGender && (
                    <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                      backupGender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {backupGender === 'male' ? (ms ? '♂ Lelaki' : '♂ Male') : (ms ? '♀ Perempuan' : '♀ Female')}
                    </span>
                  )}
                </div>
                {backupGenderWarn && (
                  <p className="text-xs text-amber-600 mt-1">⚠ {backupGenderWarn}</p>
                )}
              </div>

              {/* IC */}
              <div>
                <label className={lbl2}>{ms ? 'No. IC *' : 'IC Number *'}</label>
                <input
                  className={inp}
                  value={formatIC(backup.ic_number)}
                  onChange={e => setBackupField('ic_number', e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="820101-01-2345"
                  maxLength={14}
                />
                {backup.ic_number && !isValidIC(backup.ic_number) && (
                  <p className="text-xs text-destructive mt-1">{ms ? 'IC tidak sah' : 'Invalid IC'}</p>
                )}
              </div>

              {/* Relationship */}
              <div>
                <label className={lbl2}>{ms ? 'Hubungan *' : 'Relationship *'}</label>
                <BmRelationshipSelect
                  value={backup.relationship}
                  onChange={v => setBackupField('relationship', v)}
                  inp={inp}
                />
              </div>

              {/* Phone */}
              <div>
                <label className={lbl2}>{ms ? 'No. Telefon *' : 'Phone *'}</label>
                <input
                  className={inp}
                  value={backup.phone}
                  onChange={e => setBackupField('phone', e.target.value)}
                  placeholder="0123456789"
                />
                {backup.phone && !isValidPhone(backup.phone) && (
                  <p className="text-xs text-destructive mt-1">{ms ? 'No. telefon tidak sah' : 'Invalid phone'}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
