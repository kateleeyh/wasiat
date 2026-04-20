'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ChevronDown, ChevronUp, Pencil, Check, AlertCircle, Lock } from 'lucide-react'
import type { WasiatRecord } from '@/types/database'

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(date: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })
}

function currency(n: number) {
  return `RM ${n.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  step, title, isComplete, editHref, children,
}: {
  step:       number
  title:      string
  isComplete: boolean
  editHref:   string
  children:   React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`border rounded-xl overflow-hidden ${isComplete ? 'border-border' : 'border-amber-300'}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/30 transition"
      >
        {/* Status dot */}
        <span className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-xs font-bold ${
          isComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {isComplete ? <Check className="w-3.5 h-3.5" /> : step}
        </span>

        <span className="flex-1 font-medium text-sm">{title}</span>

        {!isComplete && (
          <span className="text-xs text-amber-600 font-medium mr-2">Incomplete</span>
        )}

        <Link
          href={editHref}
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium px-2 py-1 rounded-md hover:bg-primary/5 transition mr-1"
        >
          <Pencil className="w-3 h-3" />
          Edit
        </Link>

        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-border bg-muted/20">
          {isComplete ? (
            <div className="pt-4 space-y-2">{children}</div>
          ) : (
            <p className="pt-4 text-sm text-amber-600">
              This section has not been filled in yet.
              <Link href={editHref} className="underline ml-1">Fill it in now →</Link>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-muted-foreground w-40 shrink-0">{label}</span>
      <span className="font-medium">{value || '—'}</span>
    </div>
  )
}

// ─── Blurred section wrapper ───────────────────────────────────────────────────

function BlurSection({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="blur-sm select-none pointer-events-none opacity-60">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-2 bg-white/90 border border-border rounded-full px-4 py-2 shadow-sm text-sm font-medium text-muted-foreground">
          <Lock className="w-3.5 h-3.5" />
          {label}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

interface Props {
  documentId: string
  wasiatData: WasiatRecord | null
  docStatus:  string
}

export function WasiatReviewSection({ documentId, wasiatData: d, docStatus }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'

  const base = `/wasiat/${documentId}/step`

  // Completion map
  const complete = {
    1: !!d?.testator_info,
    2: !!d?.movable_assets,
    3: !!d?.immovable_assets,
    4: !!(d?.beneficiaries?.length),
    5: !!d?.executor,
    6: !!(d?.witnesses?.witness_1 && d?.witnesses?.witness_2),
    7: !!d?.declaration,
  }

  // Required steps to proceed to payment (step 6 witnesses is recommended but not blocking)
  const requiredComplete = complete[1] && complete[2] && complete[3] && complete[4] && complete[5] && complete[7]
  const completedCount   = Object.values(complete).filter(Boolean).length

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Link href={`${base}/7`} className="text-sm text-muted-foreground hover:text-foreground transition">
            ← {ms ? 'Kembali ke borang' : 'Back to form'}
          </Link>
        </div>
        <h1 className="text-2xl font-bold mt-3">
          {ms ? 'Semak & Pratonton Wasiat' : 'Review & Preview Wasiat'}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {ms
            ? 'Semak maklumat anda sebelum meneruskan ke pembayaran.'
            : 'Review your information before proceeding to payment.'}
        </p>
      </div>

      {/* Completion banner */}
      <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
        requiredComplete
          ? 'bg-emerald-50 border border-emerald-200'
          : 'bg-amber-50 border border-amber-200'
      }`}>
        {requiredComplete
          ? <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          : <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />}
        <div>
          <p className={`font-medium text-sm ${requiredComplete ? 'text-emerald-800' : 'text-amber-800'}`}>
            {completedCount}/7 {ms ? 'bahagian selesai' : 'sections complete'}
          </p>
          {!requiredComplete && (
            <p className="text-xs text-amber-700 mt-0.5">
              {ms
                ? 'Sila lengkapkan semua bahagian wajib untuk meneruskan ke pembayaran.'
                : 'Please complete all required sections before proceeding to payment.'}
            </p>
          )}
        </div>
      </div>

      {/* ═══ SECTION 1: Review cards ═══ */}
      <h2 className="text-base font-semibold mb-3">
        {ms ? 'Bahagian 1 — Semakan Data' : 'Part 1 — Data Review'}
      </h2>
      <div className="space-y-3 mb-10">

        {/* Step 1 — Testator */}
        <SectionCard step={1} title={ms ? 'Maklumat Pewasiat' : 'Testator Info'} isComplete={complete[1]} editHref={`${base}/1`}>
          <Row label={ms ? 'Nama Penuh' : 'Full Name'}       value={d?.testator_info?.full_name} />
          <Row label={ms ? 'No. IC' : 'IC Number'}           value={d?.testator_info?.ic_number} />
          <Row label={ms ? 'Tarikh Lahir' : 'Date of Birth'} value={d?.testator_info?.dob ? fmt(d.testator_info.dob) : '—'} />
          <Row label={ms ? 'Jantina' : 'Gender'}             value={d?.testator_info?.gender === 'male' ? (ms ? 'Lelaki' : 'Male') : (ms ? 'Perempuan' : 'Female')} />
          <Row label={ms ? 'Status' : 'Marital Status'}      value={d?.testator_info?.marital_status} />
          <Row label={ms ? 'Negeri' : 'State'}               value={d?.testator_info?.state} />
          <Row label={ms ? 'No. Telefon' : 'Phone'}          value={d?.testator_info?.phone} />
          <Row label="Email"                                  value={d?.testator_info?.email} />
        </SectionCard>

        {/* Step 2 — Movable assets */}
        <SectionCard step={2} title={ms ? 'Harta Alih' : 'Movable Assets'} isComplete={complete[2]} editHref={`${base}/2`}>
          <Row label={ms ? 'Kaedah' : 'Method'} value={d?.movable_assets?.mode === 'itemised' ? 'Lampiran A (Itemised)' : 'Pernyataan Am (General)'} />
          {d?.movable_assets?.mode === 'itemised' && (
            <Row label={ms ? 'Bilangan Item' : 'Items'} value={`${d.movable_assets.items?.length ?? 0} item(s) — ${currency(d.movable_assets.items?.reduce((s, i) => s + i.amount, 0) ?? 0)} total`} />
          )}
          {d?.movable_assets?.mode === 'general' && d.movable_assets.general_note && (
            <Row label={ms ? 'Pernyataan' : 'Statement'} value={d.movable_assets.general_note.slice(0, 80) + (d.movable_assets.general_note.length > 80 ? '…' : '')} />
          )}
        </SectionCard>

        {/* Step 3 — Immovable assets */}
        <SectionCard step={3} title={ms ? 'Harta Tak Alih' : 'Immovable Assets'} isComplete={complete[3]} editHref={`${base}/3`}>
          <Row label={ms ? 'Kaedah' : 'Method'} value={d?.immovable_assets?.mode === 'itemised' ? 'Lampiran A (Itemised)' : 'Pernyataan Am (General)'} />
          {d?.immovable_assets?.mode === 'itemised' && (
            <Row label={ms ? 'Bilangan Item' : 'Items'} value={`${d.immovable_assets.items?.length ?? 0} item(s) — ${currency(d.immovable_assets.items?.reduce((s, i) => s + i.amount, 0) ?? 0)} total`} />
          )}
          {d?.immovable_assets?.mode === 'general' && d.immovable_assets.general_note && (
            <Row label={ms ? 'Pernyataan' : 'Statement'} value={d.immovable_assets.general_note.slice(0, 80) + (d.immovable_assets.general_note.length > 80 ? '…' : '')} />
          )}
        </SectionCard>

        {/* Step 4 — Beneficiaries */}
        <SectionCard step={4} title={ms ? 'Penerima Manfaat' : 'Beneficiaries'} isComplete={complete[4]} editHref={`${base}/4`}>
          <Row label={ms ? 'Bilangan' : 'Count'} value={`${d?.beneficiaries?.length ?? 0} ${ms ? 'orang' : 'person(s)'}`} />
          {d?.beneficiaries?.map((b, i) => (
            <Row
              key={i}
              label={b.full_name}
              value={b.assignment_type === 'percentage'
                ? `${b.percentage}% ${ms ? 'daripada 1/3' : 'of 1/3'}`
                : b.specific_asset ?? '—'}
            />
          ))}
        </SectionCard>

        {/* Step 5 — Executor */}
        <SectionCard step={5} title={ms ? 'Wasi (Pelaksana)' : 'Executor'} isComplete={complete[5]} editHref={`${base}/5`}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{ms ? 'Wasi Utama' : 'Primary'}</p>
          <Row label={ms ? 'Nama' : 'Name'}         value={d?.executor?.full_name} />
          <Row label={ms ? 'Hubungan' : 'Relation'} value={d?.executor?.relationship} />
          <Row label={ms ? 'No. Telefon' : 'Phone'} value={d?.executor?.phone} />
          {d?.backup_executor && (
            <>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-3 mb-1">{ms ? 'Wasi Simpanan' : 'Backup'}</p>
              <Row label={ms ? 'Nama' : 'Name'}         value={d.backup_executor.full_name} />
              <Row label={ms ? 'Hubungan' : 'Relation'} value={d.backup_executor.relationship} />
            </>
          )}
        </SectionCard>

        {/* Step 6 — Witnesses */}
        <SectionCard step={6} title={ms ? 'Saksi' : 'Witnesses'} isComplete={complete[6]} editHref={`${base}/6`}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{ms ? 'Saksi 1' : 'Witness 1'}</p>
          <Row label={ms ? 'Nama' : 'Name'}   value={d?.witnesses?.witness_1.full_name} />
          <Row label={ms ? 'No. IC' : 'IC'}   value={d?.witnesses?.witness_1.ic_number} />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-3 mb-1">{ms ? 'Saksi 2' : 'Witness 2'}</p>
          <Row label={ms ? 'Nama' : 'Name'}   value={d?.witnesses?.witness_2.full_name} />
          <Row label={ms ? 'No. IC' : 'IC'}   value={d?.witnesses?.witness_2.ic_number} />
        </SectionCard>

        {/* Step 7 — Declaration */}
        <SectionCard step={7} title={ms ? 'Perisytiharan' : 'Declaration'} isComplete={complete[7]} editHref={`${base}/7`}>
          <Row label={ms ? 'Tarikh' : 'Date'}      value={d?.declaration?.date ? fmt(d.declaration.date) : '—'} />
          <Row label={ms ? 'Diakui' : 'Acknowledged'} value={d?.declaration?.acknowledged ? (ms ? 'Ya ✓' : 'Yes ✓') : (ms ? 'Belum' : 'Not yet')} />
        </SectionCard>

      </div>

      {/* ═══ SECTION 2: Document preview ═══ */}
      <h2 className="text-base font-semibold mb-1">
        {ms ? 'Bahagian 2 — Pratonton Dokumen' : 'Part 2 — Document Preview'}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {ms
          ? 'Beberapa bahagian disembunyikan. Bayar untuk melihat dokumen penuh yang boleh dimuat turun.'
          : 'Some sections are hidden. Pay to unlock the full downloadable document.'}
      </p>

      {/* Document paper */}
      <div className="bg-white border border-border rounded-xl shadow-sm p-8 mb-8 text-sm leading-relaxed font-serif space-y-6">

        {/* Header */}
        <div className="text-center space-y-1 border-b pb-4">
          <p className="text-xs text-muted-foreground tracking-widest uppercase">WasiatHub</p>
          <h2 className="text-2xl font-bold tracking-wide">WASIAT</h2>
          <p className="text-xs text-muted-foreground">
            {ms ? 'Dokumen Wasiat Mengikut Syariah Islam' : 'Islamic Will Document (Wasiat) Under Syariah Law'}
          </p>
        </div>

        {/* Intro paragraph */}
        {d?.testator_info && (
          <p className="text-justify">
            Saya, <strong>{d.testator_info.full_name}</strong>, No. Kad Pengenalan{' '}
            <strong>{d.testator_info.ic_number}</strong>, beralamat di{' '}
            <strong>{d.testator_info.address}</strong>, dengan ini mengisytiharkan
            bahawa ini adalah Wasiat saya yang terakhir dan saya membuat wasiat ini
            dengan kehendak bebas saya sendiri tanpa sebarang paksaan atau pengaruh luar.
          </p>
        )}

        {/* Testator details — visible */}
        <div>
          <p className="font-bold uppercase tracking-wide text-xs mb-3 text-muted-foreground">
            Bahagian 1 — Maklumat Pewasiat
          </p>
          {d?.testator_info ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <span className="text-muted-foreground">Nama Penuh:</span>
              <span>{d.testator_info.full_name}</span>
              <span className="text-muted-foreground">No. Kad Pengenalan:</span>
              <span>{d.testator_info.ic_number}</span>
              <span className="text-muted-foreground">Tarikh Lahir:</span>
              <span>{fmt(d.testator_info.dob)}</span>
              <span className="text-muted-foreground">Jantina:</span>
              <span>{d.testator_info.gender === 'male' ? 'Lelaki' : 'Perempuan'}</span>
              <span className="text-muted-foreground">Status Perkahwinan:</span>
              <span className="capitalize">{d.testator_info.marital_status}</span>
              <span className="text-muted-foreground">Negeri:</span>
              <span>{d.testator_info.state}</span>
            </div>
          ) : (
            <p className="text-muted-foreground italic text-xs">{ms ? 'Belum diisi.' : 'Not filled yet.'}</p>
          )}
        </div>

        {/* Movable assets — BLURRED */}
        <div>
          <p className="font-bold uppercase tracking-wide text-xs mb-3 text-muted-foreground">
            Bahagian 2 — Harta Alih
          </p>
          <BlurSection label={ms ? 'Bayar untuk melihat' : 'Pay to unlock'}>
            <div className="text-xs space-y-1">
              {d?.movable_assets?.mode === 'itemised'
                ? (d.movable_assets.items ?? []).map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.type} — {item.details}</span>
                      <span>{currency(item.amount)}</span>
                    </div>
                  ))
                : <p>{d?.movable_assets?.general_note ?? 'Segala harta alih milik saya...'}</p>
              }
            </div>
          </BlurSection>
        </div>

        {/* Immovable assets — BLURRED */}
        <div>
          <p className="font-bold uppercase tracking-wide text-xs mb-3 text-muted-foreground">
            Bahagian 3 — Harta Tak Alih
          </p>
          <BlurSection label={ms ? 'Bayar untuk melihat' : 'Pay to unlock'}>
            <div className="text-xs space-y-1">
              {d?.immovable_assets?.mode === 'itemised'
                ? (d.immovable_assets.items ?? []).map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.type} — {item.details}</span>
                      <span>{currency(item.amount)}</span>
                    </div>
                  ))
                : <p>{d?.immovable_assets?.general_note ?? 'Segala harta tak alih milik saya...'}</p>
              }
            </div>
          </BlurSection>
        </div>

        {/* Beneficiaries — BLURRED */}
        <div>
          <p className="font-bold uppercase tracking-wide text-xs mb-3 text-muted-foreground">
            Bahagian 4 — Penerima Manfaat
          </p>
          <BlurSection label={ms ? 'Bayar untuk melihat' : 'Pay to unlock'}>
            <div className="text-xs space-y-2">
              {(d?.beneficiaries ?? []).map((b, i) => (
                <div key={i}>
                  <strong>{b.full_name}</strong> (IC: {b.ic_number}) — {b.relationship}
                  {b.assignment_type === 'percentage'
                    ? ` — ${b.percentage}% daripada 1/3 harta`
                    : ` — ${b.specific_asset}`}
                </div>
              ))}
            </div>
          </BlurSection>
        </div>

        {/* Executor — BLURRED */}
        <div>
          <p className="font-bold uppercase tracking-wide text-xs mb-3 text-muted-foreground">
            Bahagian 5 — Wasi (Pelaksana)
          </p>
          <BlurSection label={ms ? 'Bayar untuk melihat' : 'Pay to unlock'}>
            <div className="text-xs space-y-1">
              <p><strong>{d?.executor?.full_name}</strong> (IC: {d?.executor?.ic_number})</p>
              <p>{d?.executor?.relationship} — {d?.executor?.phone}</p>
              <p>{d?.executor?.address}</p>
            </div>
          </BlurSection>
        </div>

        {/* Witnesses — visible */}
        <div>
          <p className="font-bold uppercase tracking-wide text-xs mb-3 text-muted-foreground">
            Bahagian 6 — Saksi
          </p>
          {d?.witnesses ? (
            <div className="grid grid-cols-2 gap-6 text-xs">
              {[d.witnesses.witness_1, d.witnesses.witness_2].map((w, i) => (
                <div key={i} className="space-y-1">
                  <p className="font-semibold">Saksi {i + 1}</p>
                  <p>{w.full_name}</p>
                  <p className="text-muted-foreground">IC: {w.ic_number}</p>
                  <p className="text-muted-foreground">{w.address}</p>
                  <div className="border-t border-dashed mt-4 pt-3">
                    <p className="text-muted-foreground">Tandatangan:</p>
                    <div className="h-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic text-xs">{ms ? 'Belum diisi.' : 'Not filled yet.'}</p>
          )}
        </div>

        {/* Declaration — signature BLURRED */}
        <div>
          <p className="font-bold uppercase tracking-wide text-xs mb-3 text-muted-foreground">
            Bahagian 7 — Perisytiharan
          </p>
          {d?.declaration ? (
            <div className="text-xs space-y-3">
              <p>
                Saya mengisytiharkan bahawa wasiat ini dibuat oleh saya pada{' '}
                <strong>{fmt(d.declaration.date)}</strong>.
              </p>
              <BlurSection label={ms ? 'Bayar untuk melihat tandatangan' : 'Pay to unlock signature'}>
                <div className="space-y-1">
                  <p>Tandatangan Pewasiat: ___________________________</p>
                  <p>Nama: <strong>{d.testator_info?.full_name ?? '—'}</strong></p>
                  <p>Tarikh: {fmt(d.declaration.date)}</p>
                </div>
              </BlurSection>
            </div>
          ) : (
            <p className="text-muted-foreground italic text-xs">{ms ? 'Belum diisi.' : 'Not filled yet.'}</p>
          )}
        </div>

      </div>

      {/* ═══ Sticky CTA ═══ */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{ms ? 'Bayaran Sekali Sahaja' : 'One-Time Payment'}</p>
            <p className="text-xs text-muted-foreground">{ms ? 'PDF Wasiat + Penghantaran E-mel' : 'Wasiat PDF + Email delivery'}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold">RM 49</span>
            {requiredComplete ? (
              <Link
                href={`/payment/${documentId}`}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition"
              >
                {ms ? 'Teruskan ke Pembayaran' : 'Proceed to Payment'}
              </Link>
            ) : (
              <button
                disabled
                className="px-6 py-2.5 bg-primary/40 text-primary-foreground rounded-xl text-sm font-semibold cursor-not-allowed"
              >
                {ms ? 'Lengkapkan semua bahagian' : 'Complete all sections'}
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
