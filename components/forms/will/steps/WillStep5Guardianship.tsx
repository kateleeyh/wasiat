'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { Plus, Trash2 } from 'lucide-react'
import type { Guardianship, ChildInfo, WillPrimaryGuardian, WillBackupGuardian } from '@/types/database'
import { isValidIC, isValidPhone, formatIC, dobFromIC } from '@/lib/validation'

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
          if (e.target.value === '__other__') { setCustomMode(true); onChange('') }
          else { setCustomMode(false); onChange(e.target.value) }
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
          placeholder={docLanguage === 'ms' ? 'Taip hubungan' : 'Specify relationship'}
          autoFocus
        />
      )}
    </>
  )
}

interface Props {
  initialData:   Guardianship | null
  onChange:      (data: Guardianship) => void
  onValidChange: (valid: boolean) => void
  docLanguage:   'ms' | 'en'
}

const EMPTY_CHILD: ChildInfo = { full_name: '', id_type: 'ic', ic_birth_cert: '', dob: '' }
const EMPTY_PRIMARY: WillPrimaryGuardian = { full_name: '', ic_number: '', relationship: '', address: '', phone: '' }
const EMPTY_BACKUP: WillBackupGuardian  = { full_name: '', ic_number: '', relationship: '', phone: '' }

export function WillStep5Guardianship({ initialData, onChange, onValidChange, docLanguage }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'

  const [hasMinor, setHasMinor]     = useState(initialData?.has_minor_children ?? false)
  const [children, setChildren]     = useState<ChildInfo[]>(initialData?.children ?? [{ ...EMPTY_CHILD }])
  const [primary, setPrimary]       = useState<WillPrimaryGuardian>(initialData?.primary_guardian ?? EMPTY_PRIMARY)
  const [hasBackup, setHasBackup]   = useState(!!initialData?.backup_guardian)
  const [backup, setBackup]         = useState<WillBackupGuardian>(initialData?.backup_guardian ?? EMPTY_BACKUP)

  const childrenValid = !hasMinor || (
    children.length > 0 && children.every(c => c.full_name.trim() !== '' && c.ic_birth_cert.trim() !== '' && c.dob !== '')
  )

  const primaryValid = !hasMinor || (
    primary.full_name.trim() !== '' &&
    isValidIC(primary.ic_number) &&
    primary.relationship.trim() !== '' &&
    isValidPhone(primary.phone) &&
    primary.address.trim() !== ''
  )

  const backupValid = !hasMinor || !hasBackup || (
    backup.full_name.trim() !== '' &&
    isValidIC(backup.ic_number) &&
    backup.relationship.trim() !== '' &&
    isValidPhone(backup.phone)
  )

  const isValid = childrenValid && primaryValid && backupValid

  useEffect(() => {
    const data: Guardianship = {
      has_minor_children: hasMinor,
      ...(hasMinor ? {
        children,
        primary_guardian: primary,
        ...(hasBackup ? { backup_guardian: backup } : {}),
      } : {}),
    }
    onChange(data)
    onValidChange(isValid)
  }, [hasMinor, children, primary, backup, hasBackup]) // eslint-disable-line react-hooks/exhaustive-deps

  function updateChild(idx: number, field: keyof ChildInfo, value: string) {
    setChildren(prev => {
      const next = [...prev]
      const child = { ...next[idx], [field]: field === 'full_name' ? value.toUpperCase() : value }

      // Auto-derive DOB from IC
      if (field === 'ic_birth_cert' && (child.id_type ?? 'ic') === 'ic') {
        const cleanedIC = value.replace(/\D/g, '').slice(0, 12)
        child.ic_birth_cert = cleanedIC
        if (isValidIC(cleanedIC)) {
          const derived = dobFromIC(cleanedIC)
          if (derived) child.dob = derived.toISOString().split('T')[0]
        }
      }

      // When switching id_type, clear the ID field and DOB
      if (field === 'id_type') {
        child.ic_birth_cert = ''
        child.dob = ''
      }

      next[idx] = child
      return next
    })
  }

  const inp  = 'w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20'
  const lbl  = 'block text-sm font-medium mb-1'
  const lbl2 = 'block text-xs font-medium mb-1 text-muted-foreground'

  return (
    <div className="space-y-6">
      {/* Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">{ms ? 'Penjagaan Anak-Anak Kecil' : 'Minor Children Guardianship'}</p>
        <p className="text-xs leading-relaxed">
          {ms
            ? 'Jika anda mempunyai anak-anak bawah umur (bawah 18 tahun), anda boleh melantik penjaga untuk mereka. Perlantikan ini tertakluk kepada keputusan mahkamah.'
            : 'If you have minor children (under 18), you may appoint a guardian for them. This appointment is subject to court approval.'}
        </p>
      </div>

      {/* Has minor children toggle */}
      <div className="border border-border rounded-xl overflow-hidden">
        <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/30 transition">
          <input
            type="checkbox"
            className="w-4 h-4 accent-primary"
            checked={hasMinor}
            onChange={e => setHasMinor(e.target.checked)}
          />
          <div>
            <p className="text-sm font-medium">
              {ms ? 'Saya mempunyai anak-anak bawah umur' : 'I have minor children (under 18)'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {ms ? 'Tandakan jika anda ingin melantik penjaga' : 'Check if you want to appoint a guardian'}
            </p>
          </div>
        </label>
      </div>

      {hasMinor && (
        <>
          {/* Children list */}
          <div>
            <h3 className="text-sm font-semibold mb-3 pb-2 border-b border-border">
              {ms ? 'Anak-Anak Kecil' : 'Minor Children'}
            </h3>
            <div className="space-y-3">
              {children.map((child, idx) => (
                <div key={idx} className="border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-muted-foreground">
                      {ms ? `Anak ${idx + 1}` : `Child ${idx + 1}`}
                    </h4>
                    {children.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setChildren(prev => prev.filter((_, i) => i !== idx))}
                        className="p-1 text-muted-foreground hover:text-destructive transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className={lbl2}>{ms ? 'Nama Penuh *' : 'Full Name *'}</label>
                      <input
                        className={inp}
                        value={child.full_name}
                        onChange={e => updateChild(idx, 'full_name', e.target.value)}
                        placeholder={ms ? 'Nama penuh anak' : "Child's full name"}
                      />
                    </div>

                    {/* ID type toggle */}
                    <div className="sm:col-span-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">
                        {ms ? 'Jenis Dokumen Pengenalan *' : 'Identity Document Type *'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(['ic', 'birth_cert', 'passport'] as const).map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => updateChild(idx, 'id_type', t)}
                            className={`px-3 py-1 text-xs rounded-lg border font-medium transition ${
                              (child.id_type ?? 'ic') === t
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                            }`}
                          >
                            {t === 'ic'
                              ? (ms ? 'MyKid / MyKad (Malaysia)' : 'MyKid / MyKad (Malaysian IC)')
                              : t === 'birth_cert'
                                ? (ms ? 'Sijil Lahir' : 'Birth Certificate')
                                : (ms ? 'Pasport' : 'Passport')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ID input — varies by type */}
                    <div>
                      <label className={lbl2}>
                        {(child.id_type ?? 'ic') === 'ic'
                          ? (ms ? 'No. MyKid / MyKad *' : 'MyKid / MyKad No. *')
                          : (child.id_type === 'birth_cert'
                              ? (ms ? 'No. Sijil Lahir *' : 'Birth Certificate No. *')
                              : (ms ? 'No. Pasport *' : 'Passport No. *'))}
                      </label>
                      {(child.id_type ?? 'ic') === 'ic' ? (
                        <>
                          <input
                            className={inp}
                            value={formatIC(child.ic_birth_cert)}
                            onChange={e => updateChild(idx, 'ic_birth_cert', e.target.value)}
                            placeholder="090101-01-2345"
                            maxLength={14}
                          />
                          {child.ic_birth_cert && !isValidIC(child.ic_birth_cert) && (
                            <p className="text-xs text-destructive mt-1">
                              {ms ? 'No. IC tidak sah (12 digit)' : 'Invalid IC (12 digits)'}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {ms ? 'Tarikh lahir akan diisi secara automatik daripada No. IC.' : 'Date of birth auto-fills from IC number.'}
                          </p>
                        </>
                      ) : (
                        <input
                          className={inp}
                          value={child.ic_birth_cert}
                          onChange={e => updateChild(idx, 'ic_birth_cert', e.target.value.toUpperCase())}
                          placeholder={child.id_type === 'birth_cert'
                            ? (ms ? 'cth. A12345678' : 'e.g. A12345678')
                            : 'A12345678'}
                        />
                      )}
                    </div>

                    {/* DOB — auto-filled for IC, manual for others */}
                    <div>
                      <label className={lbl2}>
                        {ms ? 'Tarikh Lahir *' : 'Date of Birth *'}
                        {(child.id_type ?? 'ic') === 'ic' && child.dob && (
                          <span className="ml-1 text-emerald-600 font-normal">✓ {ms ? 'auto' : 'auto-filled'}</span>
                        )}
                      </label>
                      <input
                        type="date"
                        className={`${inp} ${(child.id_type ?? 'ic') === 'ic' && child.dob ? 'bg-emerald-50 border-emerald-300' : ''}`}
                        value={child.dob}
                        onChange={e => updateChild(idx, 'dob', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        readOnly={(child.id_type ?? 'ic') === 'ic' && isValidIC(child.ic_birth_cert)}
                      />
                      {(child.id_type ?? 'ic') === 'ic' && isValidIC(child.ic_birth_cert) && (
                        <p className="text-xs text-emerald-600 mt-1">
                          {ms ? 'Diisi daripada No. IC — edit jika tidak tepat.' : 'Derived from IC — edit if incorrect.'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setChildren(prev => [...prev, { ...EMPTY_CHILD }])}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium py-2 mt-2 transition"
            >
              <Plus className="w-4 h-4" />
              {ms ? 'Tambah anak' : 'Add child'}
            </button>
          </div>

          {/* Primary guardian */}
          <div>
            <h3 className="text-sm font-semibold mb-3 pb-2 border-b border-border">
              {ms ? 'Penjaga Utama' : 'Primary Guardian'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={lbl}>
                  {ms ? 'Nama Penuh' : 'Full Name'}
                  <span className="text-destructive ml-0.5">*</span>
                </label>
                <input
                  className={inp}
                  value={primary.full_name}
                  onChange={e => setPrimary(prev => ({ ...prev, full_name: e.target.value.toUpperCase() }))}
                  placeholder={ms ? 'Nama penuh penjaga' : "Guardian's full name"}
                />
              </div>

              <div>
                <label className={lbl}>
                  {ms ? 'No. Kad Pengenalan' : 'IC Number'}
                  <span className="text-destructive ml-0.5">*</span>
                </label>
                <input
                  className={inp}
                  value={formatIC(primary.ic_number)}
                  onChange={e => setPrimary(prev => ({ ...prev, ic_number: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
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
                  onChange={v => setPrimary(prev => ({ ...prev, relationship: v }))}
                  docLanguage={docLanguage}
                  inp={inp}
                />
              </div>

              <div>
                <label className={lbl}>
                  {ms ? 'No. Telefon' : 'Phone'}
                  <span className="text-destructive ml-0.5">*</span>
                </label>
                <input
                  className={inp}
                  value={primary.phone}
                  onChange={e => setPrimary(prev => ({ ...prev, phone: e.target.value }))}
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
                  onChange={e => setPrimary(prev => ({ ...prev, address: e.target.value.toUpperCase() }))}
                  placeholder={ms ? 'NO. RUMAH, JALAN, BANDAR, POSKOD, NEGERI' : 'HOUSE NO., STREET, CITY, POSTCODE, STATE'}
                />
              </div>
            </div>
          </div>

          {/* Backup guardian */}
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
                  {ms ? 'Tambah Penjaga Simpanan (Pilihan)' : 'Add Backup Guardian (Optional)'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ms ? 'Akan mengambil alih jika penjaga utama tidak dapat bertugas' : 'Acts if the primary guardian is unable to serve'}
                </p>
              </div>
            </label>

            {hasBackup && (
              <div className="border-t border-border p-4 bg-muted/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className={lbl2}>{ms ? 'Nama Penuh *' : 'Full Name *'}</label>
                    <input
                      className={inp}
                      value={backup.full_name}
                      onChange={e => setBackup(prev => ({ ...prev, full_name: e.target.value.toUpperCase() }))}
                      placeholder={ms ? 'Nama penuh penjaga simpanan' : 'Backup guardian full name'}
                    />
                  </div>
                  <div>
                    <label className={lbl2}>{ms ? 'No. IC *' : 'IC Number *'}</label>
                    <input
                      className={inp}
                      value={formatIC(backup.ic_number)}
                      onChange={e => setBackup(prev => ({ ...prev, ic_number: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
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
                      onChange={v => setBackup(prev => ({ ...prev, relationship: v }))}
                      docLanguage={docLanguage}
                      inp={inp}
                    />
                  </div>
                  <div>
                    <label className={lbl2}>{ms ? 'No. Telefon *' : 'Phone *'}</label>
                    <input
                      className={inp}
                      value={backup.phone}
                      onChange={e => setBackup(prev => ({ ...prev, phone: e.target.value }))}
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
        </>
      )}

      {!hasMinor && (
        <div className="bg-muted/30 rounded-xl p-5 text-center text-sm text-muted-foreground">
          <p>{ms ? 'Tiada anak-anak bawah umur — langkah ini boleh dilangkau.' : 'No minor children — this step can be skipped.'}</p>
          <p className="text-xs mt-1">{ms ? 'Klik "Seterusnya" untuk meneruskan.' : 'Click "Next" to continue.'}</p>
        </div>
      )}
    </div>
  )
}
