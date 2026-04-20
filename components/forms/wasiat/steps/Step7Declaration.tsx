'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import type { WasiatDeclaration, WasiatTestatorInfo } from '@/types/database'

const PRESET_WISHES_MS =
  'Saya mengarahkan supaya pengurusan jenazah saya dilaksanakan secara ringkas, patuh sunnah ' +
  'dan mengelakkan sebarang pembaziran yang bercanggah dengan Syariah. ' +
  'Saya berharap agar waris-waris saya hidup dalam suasana kasih sayang, saling menghormati, ' +
  'bertolak ansur, dan sentiasa meneruskan amalan sedekah dan kebaikan bagi pihak saya.'

const PRESET_WISHES_EN =
  'I direct that my funeral arrangements be carried out simply, in accordance with the Sunnah, ' +
  'and without extravagance contrary to Syariah. ' +
  'I hope my heirs live in love, mutual respect, and harmony, and continue acts of charity and ' +
  'kindness on my behalf.'

interface Props {
  initialData:   WasiatDeclaration | null
  testatorInfo:  WasiatTestatorInfo | null   // used to prefill and validate signature name
  onChange:      (data: WasiatDeclaration) => void
  onValidChange: (valid: boolean) => void
}

export function Step7Declaration({ initialData, testatorInfo, onChange, onValidChange }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState<WasiatDeclaration>({
    date:             initialData?.date            ?? today,
    acknowledged:     initialData?.acknowledged    ?? false,
    personal_wishes:  initialData?.personal_wishes ?? '',
  })
  const [useCustomWishes, setUseCustomWishes] = useState(
    !!initialData?.personal_wishes && initialData.personal_wishes !== (ms ? PRESET_WISHES_MS : PRESET_WISHES_EN)
  )

  const isValid =
    !!form.date &&
    form.acknowledged

  useEffect(() => {
    onChange(form)
    onValidChange(isValid)
  }, [form]) // eslint-disable-line react-hooks/exhaustive-deps

  function set<K extends keyof WasiatDeclaration>(key: K, value: WasiatDeclaration[K]) {
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
              dengan ini mengisytiharkan bahawa ini adalah Wasiat saya yang terakhir dan saya membuat wasiat ini
              dengan kehendak bebas saya sendiri tanpa sebarang paksaan atau pengaruh luar.
            </p>
            <p className="mt-3">
              Saya mengesahkan bahawa saya adalah seorang Muslim yang berakal dan berumur 18 tahun ke atas,
              dan wasiat ini dibuat mengikut kehendak saya dengan sepenuhnya.
            </p>
          </>
        ) : (
          <>
            <p>
              I, <strong className="text-foreground not-italic">{testatorInfo?.full_name || '[ Testator Name ]'}</strong>,
              IC Number <strong className="text-foreground not-italic">{testatorInfo?.ic_number || '[ IC No. ]'}</strong>,
              of <strong className="text-foreground not-italic">{testatorInfo?.address || '[ Address ]'}</strong>,
              hereby declare this to be my last Wasiat and that I make this Wasiat of my own free will
              without any coercion or undue influence.
            </p>
            <p className="mt-3">
              I confirm that I am a Muslim of sound mind and above 18 years of age,
              and that this Wasiat fully reflects my wishes.
            </p>
          </>
        )}
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
        <p className="text-xs text-muted-foreground mt-1">
          {ms
            ? 'Tandatangan fizikal pewasiat akan dibuat pada dokumen bercetak.'
            : 'The physical signature will be made on the printed document.'}
        </p>
      </div>

      {/* Personal wishes */}
      <div className="border border-border rounded-xl p-5 space-y-3">
        <div>
          <p className="text-sm font-semibold mb-0.5">
            {ms ? 'Pesanan & Hasrat Peribadi (Arahan Khas)' : 'Personal Message & Wishes (Special Instructions)'}
          </p>
          <p className="text-xs text-muted-foreground">
            {ms
              ? 'Bahagian ini akan dimasukkan ke dalam Artikel 5 wasiat anda. Anda boleh menggunakan teks piawai atau tulis sendiri.'
              : 'This appears in Article 5 of your wasiat. Use the preset text or write your own.'}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setUseCustomWishes(false)
              set('personal_wishes', '')
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              !useCustomWishes
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/40'
            }`}
          >
            {ms ? 'Gunakan teks piawai' : 'Use preset text'}
          </button>
          <button
            type="button"
            onClick={() => {
              setUseCustomWishes(true)
              if (!form.personal_wishes) {
                set('personal_wishes', ms ? PRESET_WISHES_MS : PRESET_WISHES_EN)
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              useCustomWishes
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/40'
            }`}
          >
            {ms ? 'Tulis sendiri' : 'Write my own'}
          </button>
        </div>

        {/* Preset preview */}
        {!useCustomWishes && (
          <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground leading-relaxed italic">
            "{ms ? PRESET_WISHES_MS : PRESET_WISHES_EN}"
          </div>
        )}

        {/* Custom text */}
        {useCustomWishes && (
          <textarea
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-y leading-relaxed"
            value={form.personal_wishes ?? ''}
            onChange={e => set('personal_wishes', e.target.value)}
            placeholder={ms
              ? 'Tulis pesanan anda kepada keluarga, arahan khas pengurusan jenazah, atau sebarang hasrat peribadi...'
              : 'Write your message to family, funeral instructions, or any personal wishes...'}
          />
        )}
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
                  <li>Kandungan Wasiat ini adalah benar dan tepat mengikut pengetahuan saya</li>
                  <li>Wasiat ini mesti ditandatangani di hadapan dua orang saksi Muslim yang baligh</li>
                  <li>Adalah disyorkan untuk mendaftarkan Wasiat ini di Pejabat Agama Islam negeri anda</li>
                  <li>WasiatHub tidak memberikan nasihat guaman — sila rujuk peguam syarie jika perlu</li>
                </ul>
              </>
            ) : (
              <>
                I <strong>acknowledge and agree</strong> that:
                <ul className="list-disc list-inside mt-2 space-y-1 font-normal text-muted-foreground">
                  <li>The contents of this Wasiat are true and accurate to the best of my knowledge</li>
                  <li>This Wasiat must be signed in the presence of two Muslim adult witnesses</li>
                  <li>It is recommended to register this Wasiat with your state Islamic Religious Department</li>
                  <li>WasiatHub does not provide legal advice — consult a Syarie lawyer if needed</li>
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
