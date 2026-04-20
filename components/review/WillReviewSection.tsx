'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ChevronDown, ChevronUp, Pencil, Check, AlertCircle, Lock } from 'lucide-react'
import type { WillRecord } from '@/types/database'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(date: string) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })
}

function currency(n: number) {
  return `RM ${n.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  step, title, isComplete, optional, editHref, children,
}: {
  step:       number
  title:      string
  isComplete: boolean
  optional?:  boolean
  editHref:   string
  children:   React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`border rounded-xl overflow-hidden ${
      isComplete ? 'border-border' : optional ? 'border-border' : 'border-amber-300'
    }`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/30 transition"
      >
        <span className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-xs font-bold ${
          isComplete
            ? 'bg-emerald-100 text-emerald-700'
            : optional
              ? 'bg-muted text-muted-foreground'
              : 'bg-amber-100 text-amber-700'
        }`}>
          {isComplete ? <Check className="w-3.5 h-3.5" /> : step}
        </span>

        <span className="flex-1 font-medium text-sm">{title}</span>

        {!isComplete && !optional && (
          <span className="text-xs text-amber-600 font-medium mr-2">Incomplete</span>
        )}
        {!isComplete && optional && (
          <span className="text-xs text-muted-foreground mr-2">Optional</span>
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
              {optional ? 'This optional section has not been filled in.' : 'This section has not been filled in yet.'}
              {' '}<Link href={editHref} className="underline">{optional ? 'Fill it in →' : 'Fill it in now →'}</Link>
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
      <span className="text-muted-foreground w-44 shrink-0">{label}</span>
      <span className="font-medium">{value || '—'}</span>
    </div>
  )
}

function BlurSection({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="blur-sm select-none pointer-events-none opacity-60">{children}</div>
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
  willData:   WillRecord | null
  docStatus:  string
}

export function WillReviewSection({ documentId, willData: d, docStatus }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'

  const base = `/will/${documentId}/step`

  const complete = {
    1: !!d?.testator_info,
    2: !!d?.executor,
    3: !!d?.assets,
    4: !!(d?.beneficiaries?.length),
    5: !!(d?.guardianship !== null && d?.guardianship !== undefined),
    6: !!(d?.witnesses?.witness_1 && d?.witnesses?.witness_2),
    7: !!d?.declaration,
  }

  // Step 5 (guardianship) is optional if has_minor_children = false
  const guardianshipOptional = d?.guardianship?.has_minor_children === false
  const requiredComplete = complete[1] && complete[2] && complete[3] && complete[4] && complete[6] && complete[7]
  const completedCount   = Object.values(complete).filter(Boolean).length

  // Total asset value
  const totalAssets = (d?.assets?.categories ?? [])
    .flatMap(c => c.items)
    .reduce((s, i) => s + (i.amount || 0), 0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <Link href={`${base}/7`} className="text-sm text-muted-foreground hover:text-foreground transition">
          ← {ms ? 'Kembali ke borang' : 'Back to form'}
        </Link>
        <h1 className="text-2xl font-bold mt-3">
          {ms ? 'Semak & Pratonton Surat Wasiat' : 'Review & Preview Last Will'}
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

      {/* ═══ Data review cards ═══ */}
      <h2 className="text-base font-semibold mb-3">
        {ms ? 'Bahagian 1 — Semakan Data' : 'Part 1 — Data Review'}
      </h2>
      <div className="space-y-3 mb-10">

        {/* Step 1 — Testator */}
        <SectionCard step={1} title={ms ? 'Maklumat Pewasiat' : 'Testator Info'} isComplete={complete[1]} editHref={`${base}/1`}>
          <Row label={ms ? 'Nama Penuh' : 'Full Name'}           value={d?.testator_info?.full_name} />
          <Row label={ms ? 'No. IC / Pasport' : 'IC / Passport'} value={d?.testator_info?.ic_number} />
          <Row label={ms ? 'Tarikh Lahir' : 'Date of Birth'}     value={d?.testator_info?.dob ? fmt(d.testator_info.dob) : '—'} />
          <Row label={ms ? 'Jantina' : 'Gender'}                 value={d?.testator_info?.gender === 'male' ? (ms ? 'Lelaki' : 'Male') : (ms ? 'Perempuan' : 'Female')} />
          <Row label={ms ? 'Status Perkahwinan' : 'Marital Status'} value={d?.testator_info?.marital_status} />
          <Row label={ms ? 'Kewarganegaraan' : 'Nationality'}    value={d?.testator_info?.nationality} />
          <Row label={ms ? 'Agama' : 'Religion'}                 value={d?.testator_info?.religion} />
          <Row label={ms ? 'No. Telefon' : 'Phone'}              value={d?.testator_info?.phone} />
          <Row label="Email"                                      value={d?.testator_info?.email} />
        </SectionCard>

        {/* Step 2 — Executor */}
        <SectionCard step={2} title={ms ? 'Pelaksana' : 'Executor'} isComplete={complete[2]} editHref={`${base}/2`}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            {ms ? 'Pelaksana Utama' : 'Primary Executor'}
          </p>
          <Row label={ms ? 'Nama' : 'Name'}         value={d?.executor?.full_name} />
          <Row label={ms ? 'Hubungan' : 'Relation'} value={d?.executor?.relationship} />
          <Row label={ms ? 'No. Telefon' : 'Phone'} value={d?.executor?.phone} />
          {d?.backup_executor && (
            <>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-3 mb-1">
                {ms ? 'Pelaksana Simpanan' : 'Backup Executor'}
              </p>
              <Row label={ms ? 'Nama' : 'Name'}         value={d.backup_executor.full_name} />
              <Row label={ms ? 'Hubungan' : 'Relation'} value={d.backup_executor.relationship} />
            </>
          )}
        </SectionCard>

        {/* Step 3 — Assets */}
        <SectionCard step={3} title={ms ? 'Aset' : 'Assets'} isComplete={complete[3]} editHref={`${base}/3`}>
          <Row
            label={ms ? 'Kaedah' : 'Method'}
            value={d?.assets?.mode === 'itemised'
              ? (ms ? 'Senarai Terperinci' : 'Itemised List')
              : (ms ? 'Pernyataan Am' : 'General Statement')}
          />
          {d?.assets?.mode === 'itemised' && (
            <>
              <Row
                label={ms ? 'Kategori' : 'Categories'}
                value={`${d.assets.categories?.length ?? 0} ${ms ? 'kategori' : 'categories'}`}
              />
              {totalAssets > 0 && (
                <Row label={ms ? 'Jumlah Anggaran' : 'Total Estimated'} value={currency(totalAssets)} />
              )}
              {(d.assets.categories ?? []).map((cat, i) => (
                <Row
                  key={i}
                  label={cat.note ?? cat.category}
                  value={`${cat.items.length} item(s) — ${currency(cat.items.reduce((s, item) => s + (item.amount || 0), 0))}`}
                />
              ))}
            </>
          )}
        </SectionCard>

        {/* Step 4 — Beneficiaries */}
        <SectionCard step={4} title={ms ? 'Penerima Manfaat' : 'Beneficiaries'} isComplete={complete[4]} editHref={`${base}/4`}>
          <Row label={ms ? 'Bilangan' : 'Count'} value={`${d?.beneficiaries?.length ?? 0} ${ms ? 'orang' : 'person(s)'}`} />
          {d?.beneficiaries?.map((b, i) => (
            <Row
              key={i}
              label={b.full_name || `Beneficiary ${i + 1}`}
              value={b.assignment_type === 'percentage'
                ? `${b.percentage}% ${ms ? 'daripada harta' : 'of estate'}`
                : (b.specific_asset ?? '—')}
            />
          ))}
          {d?.residual_estate_beneficiary && (
            <Row
              label={ms ? 'Penerima Harta Baki' : 'Residual Beneficiary'}
              value={d.residual_estate_beneficiary.full_name}
            />
          )}
        </SectionCard>

        {/* Step 5 — Guardianship (optional) */}
        <SectionCard
          step={5}
          title={ms ? 'Penjagaan Anak' : 'Guardianship'}
          isComplete={complete[5]}
          optional={guardianshipOptional || !complete[5]}
          editHref={`${base}/5`}
        >
          {d?.guardianship?.has_minor_children ? (
            <>
              <Row label={ms ? 'Bilangan Anak' : 'Children'} value={`${d.guardianship.children?.length ?? 0}`} />
              <Row label={ms ? 'Penjaga Utama' : 'Primary Guardian'} value={d.guardianship.primary_guardian?.full_name} />
              {d.guardianship.backup_guardian && (
                <Row label={ms ? 'Penjaga Simpanan' : 'Backup Guardian'} value={d.guardianship.backup_guardian.full_name} />
              )}
            </>
          ) : (
            <Row label={ms ? 'Anak Bawah Umur' : 'Minor Children'} value={ms ? 'Tiada' : 'None'} />
          )}
        </SectionCard>

        {/* Step 6 — Witnesses */}
        <SectionCard step={6} title={ms ? 'Saksi' : 'Witnesses'} isComplete={complete[6]} editHref={`${base}/6`}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            {ms ? 'Saksi 1' : 'Witness 1'}
          </p>
          <Row label={ms ? 'Nama' : 'Name'} value={d?.witnesses?.witness_1.full_name} />
          <Row label={ms ? 'ID' : 'ID'} value={d?.witnesses?.witness_1.ic_number} />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-3 mb-1">
            {ms ? 'Saksi 2' : 'Witness 2'}
          </p>
          <Row label={ms ? 'Nama' : 'Name'} value={d?.witnesses?.witness_2.full_name} />
          <Row label={ms ? 'ID' : 'ID'} value={d?.witnesses?.witness_2.ic_number} />
        </SectionCard>

        {/* Step 7 — Declaration */}
        <SectionCard step={7} title={ms ? 'Pengisytiharan' : 'Declaration'} isComplete={complete[7]} editHref={`${base}/7`}>
          <Row label={ms ? 'Tarikh' : 'Date'}           value={d?.declaration?.date ? fmt(d.declaration.date) : '—'} />
          <Row label={ms ? 'Nama Tandatangan' : 'Signature Name'} value={d?.declaration?.signature_name} />
          <Row label={ms ? 'Diakui' : 'Acknowledged'}   value={d?.declaration?.acknowledged ? (ms ? 'Ya ✓' : 'Yes ✓') : (ms ? 'Belum' : 'Not yet')} />
        </SectionCard>

      </div>

      {/* ═══ Document preview ═══ */}
      <h2 className="text-base font-semibold mb-1">
        {ms ? 'Bahagian 2 — Pratonton Dokumen' : 'Part 2 — Document Preview'}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {ms
          ? 'Beberapa bahagian disembunyikan. Bayar untuk melihat dokumen penuh yang boleh dimuat turun.'
          : 'Some sections are hidden. Pay to unlock the full downloadable document.'}
      </p>

      <div className="bg-white border border-border rounded-xl shadow-sm p-8 mb-8 text-sm leading-relaxed font-serif space-y-6">

        {/* Cover */}
        <div className="text-center space-y-1 border-b pb-4">
          <p className="text-xs text-muted-foreground tracking-widest uppercase">WasiatHub</p>
          <h2 className="text-2xl font-bold tracking-wide">LAST WILL AND TESTAMENT</h2>
          <p className="text-xs text-muted-foreground">Surat Wasiat Am — Wills Act 1959 (Malaysia)</p>
        </div>

        {/* Intro */}
        {d?.testator_info && (
          <p className="text-justify">
            I, <strong>{d.testator_info.full_name}</strong>, IC / Passport No.{' '}
            <strong>{d.testator_info.ic_number}</strong>, of{' '}
            <strong>{d.testator_info.address}</strong>, being of sound mind and
            disposing memory, hereby revoke all former wills and testamentary
            dispositions made by me and declare this to be my Last Will and Testament.
          </p>
        )}

        {/* Article 1 — Testator info (visible) */}
        <div>
          <p className="font-bold uppercase tracking-wide text-xs mb-3 text-muted-foreground">
            Article 1 — Testator Information
          </p>
          {d?.testator_info ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <span className="text-muted-foreground">Full Name:</span>        <span>{d.testator_info.full_name}</span>
              <span className="text-muted-foreground">IC / Passport:</span>   <span>{d.testator_info.ic_number}</span>
              <span className="text-muted-foreground">Date of Birth:</span>   <span>{fmt(d.testator_info.dob)}</span>
              <span className="text-muted-foreground">Nationality:</span>     <span>{d.testator_info.nationality}</span>
              <span className="text-muted-foreground">Religion:</span>        <span>{d.testator_info.religion}</span>
              <span className="text-muted-foreground">Marital Status:</span>  <span className="capitalize">{d.testator_info.marital_status}</span>
            </div>
          ) : (
            <p className="text-muted-foreground italic text-xs">Not filled yet.</p>
          )}
        </div>

        {/* Article 2 — Executor (BLURRED) */}
        <div>
          <p className="font-bold uppercase tracking-wide text-xs mb-3 text-muted-foreground">
            Article 2 — Executor
          </p>
          <BlurSection label={ms ? 'Bayar untuk melihat' : 'Pay to unlock'}>
            <div className="text-xs space-y-1">
              <p>I appoint <strong>{d?.executor?.full_name ?? 'EXECUTOR NAME'}</strong> (IC: {d?.executor?.ic_number ?? '——————'}) as the Executor of this Will.</p>
              {d?.backup_executor && (
                <p>If unable to act, <strong>{d.backup_executor.full_name}</strong> shall serve as alternate Executor.</p>
              )}
            </div>
          </BlurSection>
        </div>

        {/* Article 3 — Assets (BLURRED) */}
        <div>
          <p className="font-bold uppercase tracking-wide text-xs mb-3 text-muted-foreground">
            Article 3 — Assets
          </p>
          <BlurSection label={ms ? 'Bayar untuk melihat' : 'Pay to unlock'}>
            <div className="text-xs space-y-1">
              {d?.assets?.mode === 'itemised' ? (
                <p>My assets are set out in Schedule A attached to this Will comprising {d.assets.categories?.length ?? 0} categories with an estimated total value of {currency(totalAssets)}.</p>
              ) : (
                <p>{d?.assets?.general_note ?? 'I give all my property not otherwise specifically disposed of in this Will to the beneficiaries named herein.'}</p>
              )}
            </div>
          </BlurSection>
        </div>

        {/* Article 4 — Beneficiaries (BLURRED) */}
        <div>
          <p className="font-bold uppercase tracking-wide text-xs mb-3 text-muted-foreground">
            Article 4 — Beneficiaries
          </p>
          <BlurSection label={ms ? 'Bayar untuk melihat' : 'Pay to unlock'}>
            <div className="text-xs space-y-2">
              {(d?.beneficiaries ?? []).map((b, i) => (
                <p key={i}>
                  <strong>{b.full_name || `[Name ${i + 1}]`}</strong> ({b.relationship}) —{' '}
                  {b.assignment_type === 'percentage'
                    ? `${b.percentage}% of the estate`
                    : b.specific_asset}
                </p>
              ))}
            </div>
          </BlurSection>
        </div>

        {/* Witnesses (visible) */}
        <div>
          <p className="font-bold uppercase tracking-wide text-xs mb-3 text-muted-foreground">
            Signature Block
          </p>
          <div className="grid grid-cols-2 gap-6 text-xs">
            {/* Testator */}
            <div className="space-y-1 col-span-2">
              <p className="font-semibold">Testator / Pewasiat</p>
              <p className="text-muted-foreground">{d?.testator_info?.full_name ?? '—'}</p>
              <div className="border-t border-dashed mt-3 pt-2">
                <p className="text-muted-foreground">Signature / Tandatangan:</p>
                <div className="h-8" />
              </div>
            </div>
            {/* Witnesses */}
            {d?.witnesses ? (
              [d.witnesses.witness_1, d.witnesses.witness_2].map((w, i) => (
                <div key={i} className="space-y-1">
                  <p className="font-semibold">Witness {i + 1} / Saksi {i + 1}</p>
                  <p>{w.full_name}</p>
                  <p className="text-muted-foreground">IC/Passport: {w.ic_number}</p>
                  <div className="border-t border-dashed mt-3 pt-2">
                    <p className="text-muted-foreground">Signature:</p>
                    <div className="h-8" />
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-2 text-muted-foreground italic">Witnesses not yet filled.</p>
            )}
          </div>
        </div>

        {/* Declaration date */}
        {d?.declaration && (
          <div>
            <p className="font-bold uppercase tracking-wide text-xs mb-2 text-muted-foreground">Declaration</p>
            <p className="text-xs">
              Signed on <strong>{fmt(d.declaration.date)}</strong>.
            </p>
            <BlurSection label={ms ? 'Bayar untuk melihat tandatangan' : 'Pay to unlock signature'}>
              <div className="text-xs mt-2 space-y-1">
                <p>Testator's Signature: ___________________________</p>
                <p>Name: <strong>{d.declaration.signature_name}</strong></p>
              </div>
            </BlurSection>
          </div>
        )}

      </div>

      {/* ═══ Sticky CTA ═══ */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{ms ? 'Bayaran Sekali Sahaja' : 'One-Time Payment'}</p>
            <p className="text-xs text-muted-foreground">{ms ? 'PDF Surat Wasiat + Penghantaran E-mel' : 'Last Will PDF + Email delivery'}</p>
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
