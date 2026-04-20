'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import type { WillDeclaration, WillTestatorInfo } from '@/types/database'

interface Props {
  initialData:   WillDeclaration | null
  testatorInfo:  WillTestatorInfo | null
  onChange:      (data: WillDeclaration) => void
  onValidChange: (valid: boolean) => void
}

export function WillStep7Declaration({ initialData, testatorInfo, onChange, onValidChange }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState<WillDeclaration>({
    date:            initialData?.date            ?? today,
    signature_name:  initialData?.signature_name  ?? (testatorInfo?.full_name ?? ''),
    acknowledged:    initialData?.acknowledged    ?? false,
    special_wishes:  initialData?.special_wishes  ?? '',
  })

  const isValid = !!form.date && !!form.signature_name.trim() && form.acknowledged

  useEffect(() => {
    onChange(form)
    onValidChange(isValid)
  }, [form]) // eslint-disable-line react-hooks/exhaustive-deps

  function set<K extends keyof WillDeclaration>(key: K, value: WillDeclaration[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const inp = 'w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20'
  const lbl = 'block text-sm font-medium mb-1'

  return (
    <div className="space-y-6">
      {/* Declaration preview */}
      <div className="bg-muted/50 border border-border rounded-xl p-5 text-sm leading-relaxed text-foreground/80 italic">
        {ms ? (
          <>
            <p>
              Saya, <strong className="text-foreground not-italic">{testatorInfo?.full_name || '[ Nama Pewasiat ]'}</strong>,
              No. Kad Pengenalan <strong className="text-foreground not-italic">{testatorInfo?.ic_number || '[ No. IC ]'}</strong>,
              beralamat di <strong className="text-foreground not-italic">{testatorInfo?.address || '[ Alamat ]'}</strong>,
              dengan ini mengisytiharkan bahawa ini adalah Surat Wasiat terakhir saya dan saya membatalkan semua wasiat dan kodisil terdahulu.
            </p>
            <p className="mt-3">
              Saya membuat Surat Wasiat ini dengan kehendak bebas saya sendiri tanpa sebarang paksaan atau pengaruh luar,
              dan saya adalah berumur 18 tahun ke atas serta sihat akal ketika membuatnya.
            </p>
          </>
        ) : (
          <>
            <p>
              I, <strong className="text-foreground not-italic">{testatorInfo?.full_name || '[ Testator Name ]'}</strong>,
              IC Number <strong className="text-foreground not-italic">{testatorInfo?.ic_number || '[ IC No. ]'}</strong>,
              of <strong className="text-foreground not-italic">{testatorInfo?.address || '[ Address ]'}</strong>,
              hereby declare this to be my last Will and Testament and revoke all former wills and codicils.
            </p>
            <p className="mt-3">
              I make this Will of my own free will without any coercion or undue influence,
              and I am of the age of 18 years or above and of sound mind when making it.
            </p>
          </>
        )}
      </div>

      {/* Special wishes */}
      <div>
        <label className={lbl}>
          {ms ? 'Arahan Khas / Hasrat Peribadi (Pilihan)' : 'Special Instructions / Personal Wishes (Optional)'}
        </label>
        <textarea
          className={`${inp} min-h-[100px] resize-y`}
          value={form.special_wishes ?? ''}
          onChange={e => set('special_wishes', e.target.value)}
          placeholder={ms
            ? 'cth. Saya berhasrat agar pengurusan jenazah saya dilakukan secara ringkas dan sederhana. Saya berpesan agar waris-waris saya hidup dalam harmoni...'
            : 'e.g. I wish for my funeral arrangements to be simple and modest. I ask that my family maintain harmony and goodwill among themselves...'}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {ms
            ? 'Arahan ini akan muncul sebagai artikel berasingan dalam dokumen Surat Wasiat.'
            : 'These instructions will appear as a separate article in the Will document.'}
        </p>
      </div>

      {/* Date */}
      <div className="max-w-xs">
        <label className={lbl}>
          {ms ? 'Tarikh Pengisytiharan' : 'Declaration Date'}
          <span className="text-destructive ml-0.5">*</span>
        </label>
        <input
          type="date"
          className={inp}
          value={form.date}
          onChange={e => set('date', e.target.value)}
          max={today}
        />
      </div>

      {/* Signature name */}
      <div>
        <label className={lbl}>
          {ms ? 'Nama untuk Tandatangan' : 'Name for Signature'}
          <span className="text-destructive ml-0.5">*</span>
        </label>
        <input
          className={inp}
          value={form.signature_name}
          onChange={e => set('signature_name', e.target.value.toUpperCase())}
          placeholder={ms ? 'Nama penuh seperti dalam MyKad' : 'Full name as per MyKad'}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {ms
            ? 'Nama ini akan muncul di baris tandatangan pada dokumen bercetak.'
            : 'This name appears on the signature line of the printed document.'}
        </p>
      </div>

      {/* Acknowledgement */}
      <div className={`border rounded-xl p-4 ${!form.acknowledged ? 'border-border' : 'border-emerald-400 bg-emerald-50'}`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 accent-primary"
            checked={form.acknowledged}
            onChange={e => set('acknowledged', e.target.checked)}
          />
          <span className="text-sm leading-relaxed">
            {ms ? (
              <>
                Saya <strong>mengakui dan bersetuju</strong> bahawa:
                <ul className="list-disc list-inside mt-2 space-y-1 font-normal text-muted-foreground">
                  <li>Kandungan Surat Wasiat ini adalah benar dan tepat mengikut pengetahuan saya</li>
                  <li>Surat Wasiat ini mesti ditandatangani di hadapan dua orang saksi secara serentak</li>
                  <li>Kedua-dua saksi <strong>bukan</strong> penerima manfaat atau pasangan penerima manfaat</li>
                  <li>Surat Wasiat asal mesti disimpan di tempat yang selamat</li>
                  <li>WasiatHub tidak memberikan nasihat guaman — sila rujuk peguam jika perlu</li>
                </ul>
              </>
            ) : (
              <>
                I <strong>acknowledge and agree</strong> that:
                <ul className="list-disc list-inside mt-2 space-y-1 font-normal text-muted-foreground">
                  <li>The contents of this Will are true and accurate to the best of my knowledge</li>
                  <li>This Will must be signed in the presence of two witnesses simultaneously</li>
                  <li>Both witnesses are <strong>not</strong> beneficiaries or spouses of beneficiaries</li>
                  <li>The original Will must be kept in a safe place</li>
                  <li>WasiatHub does not provide legal advice — consult a lawyer if needed</li>
                </ul>
              </>
            )}
          </span>
        </label>
      </div>

      {!form.acknowledged && (
        <p className="text-xs text-muted-foreground">
          {ms
            ? 'Tandakan petak di atas untuk meneruskan ke pratonton dokumen.'
            : 'Check the box above to proceed to the document preview.'}
        </p>
      )}
    </div>
  )
}
