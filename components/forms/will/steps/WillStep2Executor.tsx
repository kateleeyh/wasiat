'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import type { WillPrimaryExecutor, WillBackupExecutor } from '@/types/database'
import {
  isValidIC, isValidPhone, formatIC, genderFromIC, genderMismatchWarning,
} from '@/lib/validation'

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

const EN_RELATIONSHIPS = [
  'Spouse', 'Son', 'Daughter', 'Adopted Child',
  'Mother', 'Father',
  'Brother', 'Sister',
  'Grandfather', 'Grandmother', 'Grandchild',
  'Uncle', 'Aunt', 'Cousin',
  'Brother-in-law', 'Sister-in-law', 'Father-in-law', 'Mother-in-law',
  'Partner', 'Friend', 'Close Friend', 'Colleague',
  'Charity / Organisation',
]

function RelationshipField({
  value, onChange, docLanguage, inp,
}: { value: string; onChange: (v: string) => void; docLanguage: 'ms' | 'en'; inp: string }) {
  const list = docLanguage === 'ms' ? BM_RELATIONSHIPS : EN_RELATIONSHIPS
  const [customMode, setCustomMode] = useState(() => value !== '' && !list.includes(value))
  const showInput = customMode || (value !== '' && !list.includes(value))
  return (
    <>
      <select
        className={inp}
        value={showInput ? '__other__' : value}
        onChange={e => {
          if (e.target.value === '__other__') {
            setCustomMode(true)
            onChange('')
          } else {
            setCustomMode(false)
            onChange(e.target.value)
          }
        }}
      >
        <option value="">{docLanguage === 'ms' ? '-- Pilih hubungan --' : '-- Select relationship --'}</option>
        {list.map(r => <option key={r} value={r}>{r}</option>)}
        <option value="__other__">{docLanguage === 'ms' ? 'Lain-lain (nyatakan)' : 'Others (specify)'}</option>
      </select>
      {showInput && (
        <input
          className={inp + ' mt-2'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={docLanguage === 'ms' ? 'Taip hubungan dalam Bahasa Melayu' : 'Specify relationship'}
          autoFocus
        />
      )}
    </>
  )
}

interface Props {
  initialPrimary:  WillPrimaryExecutor | null
  initialBackup:   WillBackupExecutor | null
  onPrimaryChange: (data: WillPrimaryExecutor) => void
  onBackupChange:  (data: WillBackupExecutor | null) => void
  onValidChange:   (valid: boolean) => void
  docLanguage:     'ms' | 'en'
}

const EMPTY_PRIMARY: WillPrimaryExecutor = {
  full_name: '', ic_number: '', relationship: '', phone: '', address: '',
}
const EMPTY_BACKUP: WillBackupExecutor = {
  full_name: '', ic_number: '', relationship: '', phone: '',
}

export function WillStep2Executor({ initialPrimary, initialBackup, onPrimaryChange, onBackupChange, onValidChange, docLanguage }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'

  const [primary, setPrimary]     = useState<WillPrimaryExecutor>(initialPrimary ?? EMPTY_PRIMARY)
  const [hasBackup, setHasBackup] = useState<boolean>(!!initialBackup)
  const [backup, setBackup]       = useState<WillBackupExecutor>(initialBackup ?? EMPTY_BACKUP)

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

  function setPrimaryField<K extends keyof WillPrimaryExecutor>(key: K, value: WillPrimaryExecutor[K]) {
    setPrimary(prev => ({ ...prev, [key]: value }))
  }
  function setBackupField<K extends keyof WillBackupExecutor>(key: K, value: WillBackupExecutor[K]) {
    setBackup(prev => ({ ...prev, [key]: value }))
  }

  const inp  = 'w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20'
  const lbl  = 'block text-sm font-medium mb-1'
  const lbl2 = 'block text-xs font-medium mb-1 text-muted-foreground'

  const primaryGender    = isValidIC(primary.ic_number) ? genderFromIC(primary.ic_number) : null
  const backupGender     = isValidIC(backup.ic_number)  ? genderFromIC(backup.ic_number)  : null
  const primaryGenderWarn = genderMismatchWarning(primary.full_name, primary.ic_number, ms)
  const backupGenderWarn  = genderMismatchWarning(backup.full_name, backup.ic_number, ms)

  return (
    <div className="space-y-8">
      {/* Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 space-y-2">
        <p className="font-semibold">{ms ? 'Syarat Pelaksana (Executor)' : 'Executor Requirements'}</p>
        <ul className="space-y-1 text-xs leading-relaxed list-none">
          <li>✓ {ms ? <><strong>Berumur 18 tahun ke atas</strong> dan sihat akal</> : <><strong>Aged 18 and above</strong> and of sound mind</>}</li>
          <li>✓ {ms ? <><strong>Boleh lelaki atau perempuan</strong> — tiada sekatan jantina atau agama di bawah Akta Wasiat 1959</> : <><strong>Male or female</strong> — no gender or religion restriction under the Wills Act 1959</>}</li>
          <li>✓ {ms ? <><strong>Boleh juga penerima manfaat</strong> — pelaksana dibenarkan menerima harta dalam wasiat yang sama (sangat biasa — contoh: isteri dilantik sebagai pelaksana dan juga penerima manfaat)</> : <><strong>Can also be a beneficiary</strong> — executors may inherit under the same will (very common — e.g. spouse as both executor and main beneficiary)</>}</li>
          <li>✓ {ms ? <><strong>Amanah</strong> — bertanggungjawab menguruskan harta anda mengikut wasiat</> : <><strong>Trustworthy</strong> — responsible for administering your estate per the will</>}</li>
        </ul>
        <p className="text-xs text-amber-700 italic">
          {ms
            ? 'Pelaksana bertanggungjawab memohon Geran Probet, menyelesaikan hutang, dan mengagihkan harta mengikut Surat Wasiat ini.'
            : 'The executor is responsible for applying for Grant of Probate, settling debts, and distributing assets according to this Will.'}
        </p>
      </div>

      {/* Primary executor */}
      <div>
        <h3 className="text-base font-semibold mb-4 pb-2 border-b border-border">
          {ms ? 'Pelaksana Utama' : 'Primary Executor'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                placeholder={ms ? 'Nama penuh pelaksana' : 'Executor full name'}
              />
              {primaryGender && (
                <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                  primaryGender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                }`}>
                  {primaryGender === 'male' ? (ms ? '♂ Lelaki' : '♂ Male') : (ms ? '♀ Perempuan' : '♀ Female')}
                </span>
              )}
            </div>
            {primaryGenderWarn && <p className="text-xs text-amber-600 mt-1">⚠ {primaryGenderWarn}</p>}
          </div>

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
              <p className="text-xs text-destructive mt-1">{ms ? 'IC tidak sah' : 'Invalid IC'}</p>
            )}
          </div>

          <div>
            <label className={lbl}>
              {ms ? 'Hubungan dengan Pewasiat' : 'Relationship to Testator'}
              <span className="text-destructive ml-0.5">*</span>
            </label>
            <RelationshipField
              value={primary.relationship}
              onChange={v => setPrimaryField('relationship', v)}
              docLanguage={docLanguage}
              inp={inp}
            />
          </div>

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
              <p className="text-xs text-destructive mt-1">{ms ? 'No. telefon tidak sah' : 'Invalid phone'}</p>
            )}
          </div>

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

      {/* Backup executor */}
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
              {ms ? 'Tambah Pelaksana Simpanan (Pilihan)' : 'Add Backup Executor (Optional)'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {ms
                ? 'Akan mengambil alih jika pelaksana utama tidak dapat menjalankan tugas'
                : 'Will act if the primary executor is unable to serve'}
            </p>
          </div>
        </label>

        {hasBackup && (
          <div className="border-t border-border p-4 bg-muted/20">
            <h3 className="text-sm font-semibold mb-4">{ms ? 'Pelaksana Simpanan' : 'Backup Executor'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={lbl2}>{ms ? 'Nama Penuh *' : 'Full Name *'}</label>
                <div className="flex items-center gap-2">
                  <input
                    className={inp}
                    value={backup.full_name}
                    onChange={e => setBackupField('full_name', e.target.value.toUpperCase())}
                    placeholder={ms ? 'Nama penuh pelaksana simpanan' : 'Backup executor full name'}
                  />
                  {backupGender && (
                    <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
                      backupGender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {backupGender === 'male' ? (ms ? '♂ Lelaki' : '♂ Male') : (ms ? '♀ Perempuan' : '♀ Female')}
                    </span>
                  )}
                </div>
                {backupGenderWarn && <p className="text-xs text-amber-600 mt-1">⚠ {backupGenderWarn}</p>}
              </div>

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

              <div>
                <label className={lbl2}>{ms ? 'Hubungan *' : 'Relationship *'}</label>
                <RelationshipField
                  value={backup.relationship}
                  onChange={v => setBackupField('relationship', v)}
                  docLanguage={docLanguage}
                  inp={inp}
                />
              </div>

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
