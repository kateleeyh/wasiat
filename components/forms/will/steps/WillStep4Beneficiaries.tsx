'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { Plus, Trash2 } from 'lucide-react'
import type { WillBeneficiary, AssetDistribution, ResidualEstateBeneficiary, AssignmentType, WillTestatorInfo, WillAssets, MaritalStatus } from '@/types/database'
import { isValidIC, isValidIDNumber, isValidPhone, formatIC, genderFromIC, genderMismatchWarning } from '@/lib/validation'

const BM_RELATIONSHIPS = [
  'Suami', 'Isteri',
  'Anak Lelaki', 'Anak Perempuan', 'Anak Angkat',
  'Ibu', 'Bapa',
  'Abang', 'Kakak', 'Adik Lelaki', 'Adik Perempuan',
  'Datuk', 'Nenek', 'Cucu',
  'Bapa Saudara', 'Ibu Saudara', 'Sepupu',
  'Ipar Lelaki', 'Ipar Perempuan',
  'Rakan', 'Sahabat', 'Rakan Sekerja',
  'Pertubuhan / Badan Amal',
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
          placeholder={docLanguage === 'ms' ? 'Taip hubungan dalam Bahasa Melayu' : 'Specify relationship'}
          autoFocus
        />
      )}
    </>
  )
}

// ─── Pool member type (for itemised mode phase 1) ────────────────────────────

interface PoolMember {
  full_name:    string
  id_type:      'ic' | 'passport'
  ic_number:    string
  relationship: string
}

const EMPTY_POOL: PoolMember = { full_name: '', id_type: 'ic', ic_number: '', relationship: '' }

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  initialBeneficiaries:       WillBeneficiary[] | null
  initialAssetDistributions:  AssetDistribution[] | null
  initialResidual:            ResidualEstateBeneficiary | null
  assets:                     WillAssets | null
  testatorInfo:               WillTestatorInfo | null
  onBeneficiariesChange:      (data: WillBeneficiary[]) => void
  onAssetDistributionsChange: (data: AssetDistribution[] | null) => void
  onResidualChange:           (data: ResidualEstateBeneficiary | null) => void
  onValidChange:              (valid: boolean) => void
  docLanguage:                'ms' | 'en'
}

// ─── General-mode helpers ────────────────────────────────────────────────────

const EMPTY_BEN: WillBeneficiary = {
  full_name: '', id_type: 'ic', ic_number: '', relationship: '', phone: '', address: '',
  assignment_type: 'percentage', percentage: undefined, specific_asset: undefined,
}

const EMPTY_RESIDUAL: ResidualEstateBeneficiary = {
  full_name: '', id_type: 'ic', ic_number: '', relationship: '',
}

function makeBen(relationship: string, pct: number): WillBeneficiary {
  return { ...EMPTY_BEN, relationship, assignment_type: 'percentage', percentage: pct }
}

function buildSuggestion(maritalStatus: MaritalStatus | undefined, hasChildren: boolean): WillBeneficiary[] {
  const isMarried  = maritalStatus === 'married'
  const isWidowed  = maritalStatus === 'widowed'
  const isDivorced = maritalStatus === 'divorced'
  const isSingle   = maritalStatus === 'single'
  if (isMarried && hasChildren)                              return [makeBen('Spouse / Suami / Isteri', 25), makeBen('Child / Anak', 75)]
  if (isMarried && !hasChildren)                             return [makeBen('Spouse / Suami / Isteri', 50), makeBen('Parent / Ibu Bapa', 50)]
  if ((isWidowed || isDivorced || isSingle) && hasChildren)  return [makeBen('Child / Anak', 100)]
  return [{ ...EMPTY_BEN }]
}

function suggestionLabel(maritalStatus: MaritalStatus | undefined, hasChildren: boolean, ms: boolean): string {
  const isMarried  = maritalStatus === 'married'
  const isWidowed  = maritalStatus === 'widowed'
  const isDivorced = maritalStatus === 'divorced'
  if (isMarried && hasChildren)                     return ms ? 'Pasangan ¼, Anak-anak ¾ (bahagi sama rata)' : 'Spouse ¼, Children ¾ (divided equally)'
  if (isMarried && !hasChildren)                    return ms ? 'Pasangan ½, Ibu Bapa ½ (bahagi sama rata)' : 'Spouse ½, Parents ½ (divided equally)'
  if ((isWidowed || isDivorced) && hasChildren)     return ms ? 'Anak-anak 100% (bahagi sama rata)' : 'Children 100% (divided equally)'
  if (!hasChildren)                                 return ms ? 'Berdasarkan susunan prioriti waris mengikut akta' : 'Based on priority order of heirs under the Act'
  return ms ? 'Anak-anak 100% (bahagi sama rata)' : 'Children 100% (divided equally)'
}

// ─── Component ───────────────────────────────────────────────────────────────

export function WillStep4Beneficiaries({
  initialBeneficiaries, initialAssetDistributions, initialResidual, assets, testatorInfo,
  onBeneficiariesChange, onAssetDistributionsChange, onResidualChange, onValidChange, docLanguage,
}: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'

  const isItemised  = assets?.mode === 'itemised'
  const isFirstLoad = !initialBeneficiaries?.length && !initialAssetDistributions?.length

  // ── Itemised mode sub-step: 'pool' = entering beneficiaries, 'assign' = per-asset assignment ──
  const [subStep, setSubStep] = useState<'pool' | 'assign'>('pool')

  // ── Itemised mode: phase 1 — beneficiary pool ──
  const [pool, setPool] = useState<PoolMember[]>(() => {
    if (initialBeneficiaries?.length) {
      return initialBeneficiaries.map(b => ({
        full_name: b.full_name, id_type: b.id_type ?? 'ic',
        ic_number: b.ic_number, relationship: b.relationship,
      }))
    }
    return [{ ...EMPTY_POOL }]
  })

  // ── Itemised mode: phase 2 — per-asset distributions ──
  // assetDists[i].beneficiaries = checked pool members + their per-asset percentage
  const [assetDists, setAssetDists] = useState<AssetDistribution[]>(() => {
    if (initialAssetDistributions?.length) return initialAssetDistributions
    if (!assets?.categories) return []
    const result: AssetDistribution[] = []
    assets.categories.forEach((cat, catIdx) => {
      cat.items.forEach((item, itemIdx) => {
        result.push({ asset_key: `${catIdx}-${itemIdx}`, asset_label: `${cat.category} — ${item.details}`, beneficiaries: [] })
      })
    })
    return result
  })

  // ── General mode: beneficiary list ──
  const [list, setList] = useState<WillBeneficiary[]>(
    initialBeneficiaries?.length && !isItemised ? initialBeneficiaries : [{ ...EMPTY_BEN }]
  )

  const [hasResidual, setHasResidual] = useState(!!initialResidual)
  const [residual, setResidual]       = useState<ResidualEstateBeneficiary>(initialResidual ?? EMPTY_RESIDUAL)
  const [stage, setStage]             = useState<'choose' | 'act' | 'form'>(isFirstLoad && !isItemised ? 'choose' : 'form')
  const [hasChildren, setHasChildren] = useState<boolean | null>(null)

  // ── Validation ──
  const poolValid = pool.length > 0 && pool.every(p =>
    p.full_name.trim() && isValidIDNumber(p.ic_number) && p.relationship.trim()
  )

  const assetDistsValid = assetDists.length > 0 && assetDists.every(ad => {
    if (!ad.beneficiaries.length) return false
    const allPctPositive = ad.beneficiaries.every(b => b.percentage > 0)
    const total = ad.beneficiaries.reduce((s, b) => s + b.percentage, 0)
    return allPctPositive && total === 100
  })

  const totalPct     = list.filter(b => b.assignment_type === 'percentage').reduce((s, b) => s + (b.percentage ?? 0), 0)
  const exceedsLimit = totalPct > 100
  const listValid    = list.length > 0 && list.every(b => {
    if (!b.full_name.trim() || !isValidIDNumber(b.ic_number) || !b.relationship.trim() || !isValidPhone(b.phone) || !b.address.trim()) return false
    if (b.assignment_type === 'percentage')     return (b.percentage ?? 0) > 0 && (b.percentage ?? 0) <= 100
    if (b.assignment_type === 'specific_asset') return !!(b.specific_asset?.trim())
    return false
  }) && !exceedsLimit

  const residualValid = !hasResidual || (
    residual.full_name.trim() !== '' && isValidIDNumber(residual.ic_number) && residual.relationship.trim() !== ''
  )

  const isValid = isItemised
    ? (subStep === 'assign' && poolValid && assetDistsValid && residualValid)
    : (stage === 'form' && listValid && residualValid)

  useEffect(() => {
    if (isItemised) {
      onBeneficiariesChange(pool.map(p => ({
        full_name: p.full_name, id_type: p.id_type, ic_number: p.ic_number,
        relationship: p.relationship, phone: '', address: '',
        assignment_type: 'percentage' as AssignmentType, percentage: undefined, specific_asset: undefined,
      })))
      onAssetDistributionsChange(assetDists)
    } else {
      onBeneficiariesChange(list)
      onAssetDistributionsChange(null)
    }
    onResidualChange(hasResidual ? residual : null)
  }, [pool, list, assetDists, residual, hasResidual, isItemised]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onValidChange(isValid)
  }, [isValid]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Itemised mode helpers ──
  function isChecked(adIdx: number, p: PoolMember): boolean {
    return assetDists[adIdx]?.beneficiaries.some(b => b.ic_number === p.ic_number) ?? false
  }

  function toggleCheck(adIdx: number, p: PoolMember) {
    setAssetDists(prev => prev.map((ad, i) => {
      if (i !== adIdx) return ad
      const already = ad.beneficiaries.some(b => b.ic_number === p.ic_number)
      if (already) {
        return { ...ad, beneficiaries: ad.beneficiaries.filter(b => b.ic_number !== p.ic_number) }
      } else {
        return { ...ad, beneficiaries: [...ad.beneficiaries, { full_name: p.full_name, id_type: p.id_type, ic_number: p.ic_number, relationship: p.relationship, phone: '', percentage: 0 }] }
      }
    }))
  }

  function updatePct(adIdx: number, p: PoolMember, pct: number) {
    setAssetDists(prev => prev.map((ad, i) => {
      if (i !== adIdx) return ad
      return { ...ad, beneficiaries: ad.beneficiaries.map(b => b.ic_number === p.ic_number ? { ...b, percentage: pct } : b) }
    }))
  }

  function splitEqually(adIdx: number) {
    setAssetDists(prev => prev.map((ad, i) => {
      if (i !== adIdx) return ad
      const count = ad.beneficiaries.length
      if (!count) return ad
      const each = Math.floor(100 / count)
      const remainder = 100 - each * count
      return {
        ...ad,
        beneficiaries: ad.beneficiaries.map((b, bi) => ({ ...b, percentage: each + (bi === 0 ? remainder : 0) })),
      }
    }))
  }

  function updatePool(idx: number, field: keyof PoolMember, value: string) {
    setPool(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      if (field === 'id_type') next[idx].ic_number = ''
      return next
    })
    // Sync name/relationship changes into any assetDists that already reference this member
    if (field === 'full_name' || field === 'relationship') {
      const ic = pool[idx]?.ic_number
      if (ic) {
        setAssetDists(prev => prev.map(ad => ({
          ...ad,
          beneficiaries: ad.beneficiaries.map(b =>
            b.ic_number === ic ? { ...b, [field]: value } : b
          ),
        })))
      }
    }
  }

  function removePoolMember(idx: number) {
    const ic = pool[idx]?.ic_number
    setPool(prev => prev.filter((_, i) => i !== idx))
    if (ic) {
      setAssetDists(prev => prev.map(ad => ({
        ...ad, beneficiaries: ad.beneficiaries.filter(b => b.ic_number !== ic),
      })))
    }
  }

  // ── General mode helpers ──
  function update(idx: number, field: keyof WillBeneficiary, value: unknown) {
    setList(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      if (field === 'assignment_type') { next[idx].percentage = undefined; next[idx].specific_asset = undefined }
      if (field === 'id_type') next[idx].ic_number = ''
      return next
    })
  }

  function applyFormula() {
    if (hasChildren === null) return
    setList(buildSuggestion(testatorInfo?.marital_status, hasChildren))
    setStage('form')
  }

  const inp = 'w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20'
  const lbl = 'block text-xs font-medium mb-1 text-muted-foreground'

  function renderIDField(b: WillBeneficiary, idx: number) {
    const idType  = b.id_type ?? 'ic'
    const invalid = b.ic_number ? !isValidIDNumber(b.ic_number) : false
    const errMsg  = idType === 'ic' ? (ms ? 'IC tidak sah' : 'Invalid IC') : (ms ? 'Pasport tidak sah (6–20 aksara)' : 'Invalid passport (6–20 characters)')
    return (
      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2 flex gap-2">
          {(['ic', 'passport'] as const).map(t => (
            <button key={t} type="button" onClick={() => update(idx, 'id_type', t)}
              className={`px-3 py-1 text-xs rounded-lg border font-medium transition ${idType === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/50'}`}>
              {t === 'ic' ? (ms ? 'Kad Pengenalan' : 'Malaysian IC') : (ms ? 'Pasport' : 'Passport')}
            </button>
          ))}
        </div>
        <div>
          <label className={lbl}>{idType === 'ic' ? (ms ? 'No. IC *' : 'IC Number *') : (ms ? 'No. Pasport *' : 'Passport No. *')}</label>
          <input className={inp} value={idType === 'ic' ? formatIC(b.ic_number) : b.ic_number}
            onChange={e => {
              const raw = idType === 'ic' ? e.target.value.replace(/\D/g, '').slice(0, 12) : e.target.value.replace(/\s/g, '').toUpperCase().slice(0, 20)
              update(idx, 'ic_number', raw)
            }}
            placeholder={idType === 'ic' ? '820101-01-2345' : 'A12345678'} maxLength={idType === 'ic' ? 14 : 20} />
          {invalid && <p className="text-xs text-destructive mt-1">{errMsg}</p>}
        </div>
      </div>
    )
  }

  const maritalStatus  = testatorInfo?.marital_status
  const canShowFormula = maritalStatus === 'married' || maritalStatus === 'widowed' || maritalStatus === 'divorced' || maritalStatus === 'single'

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ══ ITEMISED MODE ══ */}
      {isItemised && (
        <div className="space-y-8">

          {/* ── Sub-step indicator ── */}
          <div className="flex items-center gap-2 mb-2">
            {(['pool', 'assign'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && <div className="w-8 h-px bg-border" />}
                <div className={`flex items-center gap-1.5 text-xs font-medium ${subStep === s ? 'text-primary' : 'text-muted-foreground'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${subStep === s ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{i + 1}</span>
                  {s === 'pool' ? (ms ? 'Penerima' : 'Beneficiaries') : (ms ? 'Agihan Harta' : 'Asset Assignment')}
                </div>
              </div>
            ))}
          </div>

          {/* ── Sub-step 1: Beneficiary Pool ── */}
          {subStep === 'pool' && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              {ms
                ? 'Masukkan semua orang yang mungkin menerima harta anda. Anda hanya perlu isi sekali.'
                : 'Enter everyone who may receive assets. You only need to fill this in once.'}
            </p>

            <div className="space-y-3">
              {pool.map((p, idx) => {
                const idType  = p.id_type ?? 'ic'
                const gender  = idType === 'ic' && isValidIC(p.ic_number) ? genderFromIC(p.ic_number) : null
                const invalid = p.ic_number ? !isValidIDNumber(p.ic_number) : false
                return (
                  <div key={idx} className="border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {ms ? `Penerima ${idx + 1}` : `Beneficiary ${idx + 1}`}
                        </span>
                        {gender && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                            {gender === 'male' ? (ms ? '♂ Lelaki' : '♂ Male') : (ms ? '♀ Perempuan' : '♀ Female')}
                          </span>
                        )}
                      </div>
                      {pool.length > 1 && (
                        <button type="button" onClick={() => removePoolMember(idx)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className={lbl}>{ms ? 'Nama Penuh *' : 'Full Name *'}</label>
                        <input className={inp} value={p.full_name}
                          onChange={e => updatePool(idx, 'full_name', e.target.value.toUpperCase())}
                          placeholder={ms ? 'Nama penuh' : 'Full name'} />
                      </div>

                      <div className="sm:col-span-2 flex gap-2">
                        {(['ic', 'passport'] as const).map(t => (
                          <button key={t} type="button" onClick={() => updatePool(idx, 'id_type', t)}
                            className={`px-3 py-1 text-xs rounded-lg border font-medium transition ${idType === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/50'}`}>
                            {t === 'ic' ? (ms ? 'Kad Pengenalan' : 'Malaysian IC') : (ms ? 'Pasport' : 'Passport')}
                          </button>
                        ))}
                      </div>

                      <div>
                        <label className={lbl}>{idType === 'ic' ? (ms ? 'No. IC *' : 'IC Number *') : (ms ? 'No. Pasport *' : 'Passport No. *')}</label>
                        <input className={inp}
                          value={idType === 'ic' ? formatIC(p.ic_number) : p.ic_number}
                          onChange={e => {
                            const raw = idType === 'ic' ? e.target.value.replace(/\D/g, '').slice(0, 12) : e.target.value.replace(/\s/g, '').toUpperCase().slice(0, 20)
                            updatePool(idx, 'ic_number', raw)
                          }}
                          placeholder={idType === 'ic' ? '820101-01-2345' : 'A12345678'}
                          maxLength={idType === 'ic' ? 14 : 20} />
                        {invalid && <p className="text-xs text-destructive mt-1">{ms ? 'Nombor tidak sah' : 'Invalid ID'}</p>}
                      </div>

                      <div>
                        <label className={lbl}>{ms ? 'Hubungan *' : 'Relationship *'}</label>
                        <RelationshipField value={p.relationship} onChange={v => updatePool(idx, 'relationship', v)} docLanguage={docLanguage} inp={inp} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <button type="button" onClick={() => setPool(prev => [...prev, { ...EMPTY_POOL }])}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium py-1 transition">
              <Plus className="w-4 h-4" />
              {ms ? 'Tambah Penerima' : 'Add Beneficiary'}
            </button>

            <button type="button" disabled={!poolValid} onClick={() => setSubStep('assign')}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition">
              {ms ? 'Seterusnya: Agihkan Harta →' : 'Next: Assign Assets →'}
            </button>
            <p className="text-xs text-center text-muted-foreground">
              {ms
                ? 'Klik butang di atas untuk meneruskan ke langkah pengagihan harta.'
                : 'Click the button above to proceed to asset assignment. The outer "Next" activates after that step.'}
            </p>
          </div>
          )}

          {/* ── Sub-step 2: Per-asset assignment ── */}
          {subStep === 'assign' && (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  {ms
                    ? 'Tandakan siapa yang menerima setiap harta. Jumlah mesti 100% bagi setiap harta.'
                    : 'Tick who receives each asset. Total must equal 100% per asset.'}
                </p>
                <button type="button" onClick={() => setSubStep('pool')}
                  className="text-xs text-primary hover:text-primary/80 font-medium whitespace-nowrap transition">
                  {ms ? '← Ubah penerima' : '← Edit beneficiaries'}
                </button>
              </div>

              {assetDists.map((ad, adIdx) => {
                const adTotal   = ad.beneficiaries.reduce((s, b) => s + (b.percentage || 0), 0)
                const adChecked = ad.beneficiaries.length
                const adDone    = adChecked > 0 && adTotal === 100 && ad.beneficiaries.every(b => b.percentage > 0)
                return (
                  <div key={adIdx} className={`border-2 rounded-xl overflow-hidden transition ${adDone ? 'border-emerald-400' : 'border-border'}`}>
                    {/* Asset header */}
                    <div className={`px-4 py-3 flex items-center justify-between ${adDone ? 'bg-emerald-50' : 'bg-muted/30'}`}>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                          {ms ? `Harta ${adIdx + 1}` : `Asset ${adIdx + 1}`}
                        </p>
                        <p className="text-sm font-semibold">{ad.asset_label}</p>
                      </div>
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        adTotal > 100 ? 'bg-destructive/10 text-destructive'
                          : adTotal === 100 ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {adTotal}% / 100%
                      </div>
                    </div>

                    {/* Pool member rows */}
                    <div className="p-4 space-y-2">
                      {pool.map((p, pi) => {
                        const checked = isChecked(adIdx, p)
                        const benData = ad.beneficiaries.find(b => b.ic_number === p.ic_number)
                        return (
                          <div key={pi} className={`flex items-center gap-3 p-3 rounded-lg border transition ${checked ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-primary flex-shrink-0"
                              checked={checked}
                              onChange={() => toggleCheck(adIdx, p)}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{p.full_name || (ms ? '(Nama belum diisi)' : '(Name not filled)')}</p>
                              <p className="text-xs text-muted-foreground">{p.relationship}</p>
                            </div>
                            {checked && (
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <div className="relative w-24">
                                  <input
                                    type="number"
                                    className="w-full border border-border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 pr-7"
                                    value={benData?.percentage || ''}
                                    onChange={e => updatePct(adIdx, p, parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                    min={1} max={100}
                                  />
                                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}

                      {/* Split Equally button */}
                      {adChecked > 0 && (
                        <button type="button" onClick={() => splitEqually(adIdx)}
                          className="mt-2 px-3 py-1.5 text-xs rounded-lg border border-primary/40 text-primary font-medium hover:bg-primary/5 transition">
                          {ms ? `Bahagi Sama Rata (${Math.floor(100 / adChecked)}% setiap orang)` : `Split Equally (${Math.floor(100 / adChecked)}% each)`}
                        </button>
                      )}

                      {adTotal > 100 && (
                        <p className="text-xs text-destructive pt-1">
                          {ms ? `Jumlah: ${adTotal}% — melebihi 100%!` : `Total: ${adTotal}% — exceeds 100%!`}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ══ GENERAL MODE ══ */}
      {!isItemised && <>

      {stage === 'choose' && canShowFormula && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold mb-1">
              {ms ? 'Bagaimana anda ingin menetapkan penerima manfaat?' : 'How would you like to set up your beneficiaries?'}
            </p>
            <p className="text-xs text-muted-foreground">
              {ms ? 'Pilih cara yang paling sesuai untuk anda. Anda boleh ubah segala-galanya selepas ini.' : 'Choose what works best for you. Everything can be edited afterwards.'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" onClick={() => setStage('act')}
              className="text-left p-4 rounded-xl border-2 border-border hover:border-primary/50 transition">
              <p className="text-sm font-semibold mb-1">{ms ? '📋 Gunakan formula Akta Pembahagian' : '📋 Use Distribution Act formula'}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {ms ? 'Kami pra-isi senarai berdasarkan status perkahwinan anda.' : 'We pre-fill the list based on your marital status.'}
              </p>
              <p className="text-xs font-medium text-primary">{ms ? 'Pilih ini →' : 'Choose this →'}</p>
            </button>
            <button type="button" onClick={() => setStage('form')}
              className="text-left p-4 rounded-xl border-2 border-border hover:border-primary/50 transition">
              <p className="text-sm font-semibold mb-1">{ms ? '✏️ Isi sendiri' : '✏️ Fill it myself'}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {ms ? 'Saya sudah tahu siapa yang ingin saya tetapkan dan berapa bahagian mereka.' : 'I already know who I want to include and what share to give each person.'}
              </p>
              <p className="text-xs font-medium text-primary">{ms ? 'Pilih ini →' : 'Choose this →'}</p>
            </button>
          </div>
        </div>
      )}

      {stage === 'act' && (
        <div className="border border-primary/30 rounded-xl p-5 space-y-4 bg-primary/5">
          <p className="text-sm font-semibold">{ms ? 'Satu soalan sahaja:' : 'Just one question:'}</p>
          <div>
            <p className="text-sm font-medium mb-2">{ms ? 'Adakah anda mempunyai anak?' : 'Do you have children?'}</p>
            <div className="flex gap-2">
              {([true, false] as const).map(val => (
                <button key={String(val)} type="button" onClick={() => setHasChildren(val)}
                  className={`px-5 py-2 text-sm rounded-lg border font-medium transition ${hasChildren === val ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/50'}`}>
                  {val ? (ms ? 'Ya' : 'Yes') : (ms ? 'Tidak' : 'No')}
                </button>
              ))}
            </div>
          </div>
          {hasChildren !== null && (
            <div className="bg-white border border-border rounded-lg p-3 text-xs space-y-1">
              <p className="font-semibold text-foreground">{ms ? 'Formula yang akan digunakan:' : 'Formula that will be applied:'}</p>
              <p className="text-muted-foreground">{suggestionLabel(maritalStatus, hasChildren, ms)}</p>
              <p className="text-muted-foreground italic">
                {ms ? '* Anda boleh ubah nama, peratusan, dan tambah penerima selepas ini.' : '* You can edit names, percentages, and add more people afterwards.'}
              </p>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <button type="button" disabled={hasChildren === null} onClick={applyFormula}
              className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition">
              {ms ? 'Pra-isi Senarai' : 'Pre-fill List'}
            </button>
            <button type="button" onClick={() => setStage('choose')}
              className="px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:border-primary/50 transition">
              {ms ? '← Kembali' : '← Back'}
            </button>
          </div>
        </div>
      )}

      {stage === 'form' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 space-y-1">
          <p className="font-semibold">{ms ? 'Penerima Manfaat' : 'Beneficiaries'}</p>
          <p className="text-xs leading-relaxed">
            {ms
              ? 'Anda bebas meninggalkan harta kepada sesiapa. Tiada keperluan mengikut formula Akta Pembahagian 1958 — formula itu hanya digunakan jika tiada Surat Wasiat.'
              : 'You are free to leave assets to anyone. The Distribution Act 1958 formula only applies if there is no Will — you are not bound by it.'}
          </p>
          <p className="text-xs text-blue-600">✓ {ms ? 'Pelaksana boleh juga menjadi penerima manfaat.' : 'Executor may also be a beneficiary.'}</p>
          <p className="text-xs text-blue-600">✓ {ms ? 'Penerima asing boleh dimasukkan menggunakan nombor pasport.' : 'Foreign beneficiaries accepted via passport number.'}</p>
          <p className="text-xs text-blue-600">✓ {ms ? 'Pastikan jumlah peratusan tidak melebihi 100%.' : 'Ensure total percentage does not exceed 100%.'}</p>
        </div>
      )}

      {stage === 'form' && <>
        {list.some(b => b.assignment_type === 'percentage') && (
          <div className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${exceedsLimit ? 'border-destructive bg-destructive/5 text-destructive' : totalPct === 100 ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-border bg-muted/30 text-muted-foreground'}`}>
            <span>
              {ms ? `Jumlah: ${totalPct}%` : `Total: ${totalPct}%`}
              {exceedsLimit && (ms ? ' — melebihi 100%!' : ' — exceeds 100%!')}
              {totalPct === 100 && !exceedsLimit && (ms ? ' ✓ Tepat' : ' ✓ Fully allocated')}
            </span>
          </div>
        )}

        <div className="space-y-4">
          {list.map((b, idx) => {
            const idType     = b.id_type ?? 'ic'
            const gender     = idType === 'ic' && isValidIC(b.ic_number) ? genderFromIC(b.ic_number) : null
            const genderWarn = idType === 'ic' ? genderMismatchWarning(b.full_name, b.ic_number, ms) : null
            return (
              <div key={idx} className="border border-border rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">{ms ? `Penerima Manfaat ${idx + 1}` : `Beneficiary ${idx + 1}`}</h4>
                    {gender && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                        {gender === 'male' ? (ms ? '♂ Lelaki' : '♂ Male') : (ms ? '♀ Perempuan' : '♀ Female')}
                      </span>
                    )}
                    {idType === 'passport' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">
                        {ms ? '🌐 Asing' : '🌐 Foreign'}
                      </span>
                    )}
                  </div>
                  {list.length > 1 && (
                    <button type="button" onClick={() => setList(prev => prev.filter((_, i) => i !== idx))}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className={lbl}>{ms ? 'Nama Penuh *' : 'Full Name *'}</label>
                    <input className={inp} value={b.full_name}
                      onChange={e => update(idx, 'full_name', e.target.value.toUpperCase())}
                      placeholder={ms ? 'Nama penuh' : 'Full name'} />
                    {genderWarn && <p className="text-xs text-amber-600 mt-1">⚠ {genderWarn}</p>}
                  </div>

                  {renderIDField(b, idx)}

                  <div>
                    <label className={lbl}>{ms ? 'Hubungan *' : 'Relationship *'}</label>
                    <RelationshipField value={b.relationship} onChange={v => update(idx, 'relationship', v)} docLanguage={docLanguage} inp={inp} />
                  </div>

                  <div>
                    <label className={lbl}>{ms ? 'No. Telefon *' : 'Phone *'}</label>
                    <input className={inp} value={b.phone} onChange={e => update(idx, 'phone', e.target.value)} placeholder="+601X-XXXXXXX" />
                    {b.phone && !isValidPhone(b.phone) && <p className="text-xs text-destructive mt-1">{ms ? 'No. telefon tidak sah' : 'Invalid phone'}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className={lbl}>{ms ? 'Alamat *' : 'Address *'}</label>
                    <textarea className={`${inp} min-h-[60px] resize-y`} value={b.address}
                      onChange={e => update(idx, 'address', e.target.value.toUpperCase())}
                      placeholder={ms ? 'NO. RUMAH, JALAN, BANDAR, POSKOD, NEGERI / NEGARA' : 'HOUSE NO., STREET, CITY, POSTCODE, STATE / COUNTRY'} />
                  </div>

                  <div>
                    <label className={lbl}>{ms ? 'Kaedah Pembahagian *' : 'Assignment Method *'}</label>
                    <select className={inp} value={b.assignment_type} onChange={e => update(idx, 'assignment_type', e.target.value as AssignmentType)}>
                      <option value="percentage">{ms ? 'Peratusan (%) harta' : 'Percentage (%) of estate'}</option>
                      <option value="specific_asset">{ms ? 'Harta Tertentu' : 'Specific Asset'}</option>
                    </select>
                  </div>

                  {b.assignment_type === 'percentage' && (
                    <div>
                      <label className={lbl}>{ms ? 'Peratusan (%) *' : 'Percentage (%) *'}</label>
                      <div className="relative">
                        <input type="number" className={inp + ' pr-8'} value={b.percentage ?? ''}
                          onChange={e => update(idx, 'percentage', parseFloat(e.target.value) || undefined)}
                          placeholder="0" min={1} max={100} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                  )}

                  {b.assignment_type === 'specific_asset' && (
                    <div className="sm:col-span-2">
                      <label className={lbl}>{ms ? 'Harta Yang Diberi *' : 'Specific Asset *'}</label>
                      <input className={inp} value={b.specific_asset ?? ''}
                        onChange={e => update(idx, 'specific_asset', e.target.value)}
                        placeholder={ms ? 'cth. Rumah di No. 10 Jalan Bahagia, KL' : 'e.g. House at No. 10 Jalan Bahagia, KL'} />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <button type="button" onClick={() => setList(prev => [...prev, { ...EMPTY_BEN }])}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium py-2 transition">
          <Plus className="w-4 h-4" />
          {ms ? 'Tambah Penerima Manfaat' : 'Add Beneficiary'}
        </button>
      </>}

      </>} {/* end !isItemised */}

      {/* ── Residual estate beneficiary (shared by both modes) ── */}
      {((!isItemised && stage === 'form') || (isItemised && subStep === 'assign')) && (
        <div className="border border-border rounded-xl overflow-hidden">
          <label className="flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/30 transition">
            <input type="checkbox" className="w-4 h-4 accent-primary mt-0.5 shrink-0" checked={hasResidual} onChange={e => setHasResidual(e.target.checked)} />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {ms ? 'Penerima Harta Baki (Pilihan)' : 'Residual Estate Beneficiary (Optional)'}
              </p>
              {ms ? (
                <div className="text-xs text-muted-foreground space-y-1.5">
                  <p>Sesiapa yang akan menerima harta yang <strong className="text-foreground">tidak dinyatakan secara khusus</strong> dalam wasiat ini.</p>
                  <p className="text-slate-400 italic">Contoh: Jika anda terlupa menyenaraikan sebuah aset, atau membeli harta baru selepas menulis wasiat ini — ia akan pergi kepada orang ini secara automatik.</p>
                  <p className="text-amber-600">⚠ Jangan masukkan aset tertentu di sini. Untuk aset seperti rumah, kereta, atau akaun bank — tambah dalam senarai aset di atas dan tetapkan penerima secara khusus.</p>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground space-y-1.5">
                  <p>The person who receives all assets <strong className="text-foreground">not specifically named</strong> in this Will.</p>
                  <p className="text-slate-400 italic">Example: If you forgot to list an asset, or acquire new property after writing this Will — it goes to this person automatically.</p>
                  <p className="text-amber-600">⚠ Do not use this for specific assets. For named assets like property, vehicles, or bank accounts — add them to the asset list above and assign a specific beneficiary.</p>
                </div>
              )}
            </div>
          </label>

          {hasResidual && (
            <div className="border-t border-border p-4 bg-muted/20 space-y-3">
              <div className="flex gap-2">
                {(['ic', 'passport'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setResidual(prev => ({ ...prev, id_type: t, ic_number: '' }))}
                    className={`px-3 py-1 text-xs rounded-lg border font-medium transition ${(residual.id_type ?? 'ic') === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/50'}`}>
                    {t === 'ic' ? (ms ? 'Kad Pengenalan' : 'Malaysian IC') : (ms ? 'Pasport' : 'Passport')}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className={lbl}>{ms ? 'Nama Penuh *' : 'Full Name *'}</label>
                  <input className={inp} value={residual.full_name}
                    onChange={e => setResidual(prev => ({ ...prev, full_name: e.target.value.toUpperCase() }))}
                    placeholder={ms ? 'Nama penuh penerima harta baki' : 'Residual beneficiary full name'} />
                </div>
                <div>
                  <label className={lbl}>{(residual.id_type ?? 'ic') === 'ic' ? (ms ? 'No. IC *' : 'IC Number *') : (ms ? 'No. Pasport *' : 'Passport No. *')}</label>
                  <input className={inp}
                    value={(residual.id_type ?? 'ic') === 'ic' ? formatIC(residual.ic_number) : residual.ic_number}
                    onChange={e => {
                      const raw = (residual.id_type ?? 'ic') === 'ic' ? e.target.value.replace(/\D/g, '').slice(0, 12) : e.target.value.replace(/\s/g, '').toUpperCase().slice(0, 20)
                      setResidual(prev => ({ ...prev, ic_number: raw }))
                    }}
                    placeholder={(residual.id_type ?? 'ic') === 'ic' ? '820101-01-2345' : 'A12345678'}
                    maxLength={(residual.id_type ?? 'ic') === 'ic' ? 14 : 20} />
                  {residual.ic_number && !isValidIDNumber(residual.ic_number) && (
                    <p className="text-xs text-destructive mt-1">{ms ? 'Nombor pengenalan tidak sah' : 'Invalid ID number'}</p>
                  )}
                </div>
                <div>
                  <label className={lbl}>{ms ? 'Hubungan *' : 'Relationship *'}</label>
                  <RelationshipField value={residual.relationship} onChange={v => setResidual(prev => ({ ...prev, relationship: v }))} docLanguage={docLanguage} inp={inp} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
