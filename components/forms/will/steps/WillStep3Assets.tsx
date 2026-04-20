'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import type { WillAssets, WillAssetCategory, AssetItem } from '@/types/database'

// ─── Malaysian banks ──────────────────────────────────────────────────────────
const MY_BANKS_MS = [
  'Maybank', 'Maybank Islamic',
  'CIMB Bank', 'CIMB Islamic',
  'Public Bank', 'Public Islamic Bank',
  'RHB Bank', 'RHB Islamic',
  'Hong Leong Bank', 'Hong Leong Islamic Bank',
  'AmBank', 'AmBank Islamic',
  'Bank Islam Malaysia',
  'Bank Muamalat Malaysia',
  'Alliance Bank',
  'Affin Bank', 'Affin Islamic Bank',
  'OCBC Bank', 'Standard Chartered', 'HSBC Bank', 'UOB Bank',
  'BSN (Bank Simpanan Nasional)',
  'Agrobank', 'Bank Rakyat',
  'Lain-lain',
]

// ─── Category definitions ─────────────────────────────────────────────────────
interface CategoryDef {
  key: string
  ms:  string
  en:  string
  icon: string
}

const CATEGORIES: CategoryDef[] = [
  { key: 'property',   ms: 'Hartanah',            en: 'Property',           icon: '🏠' },
  { key: 'bank',       ms: 'Akaun Bank',           en: 'Bank Account',       icon: '🏦' },
  { key: 'epf',        ms: 'KWSP / EPF',           en: 'EPF / KWSP',         icon: '💼' },
  { key: 'investment', ms: 'Pelaburan',            en: 'Investment',         icon: '📈' },
  { key: 'insurance',  ms: 'Insurans / Takaful',   en: 'Insurance / Takaful', icon: '🛡️' },
  { key: 'business',   ms: 'Perniagaan',           en: 'Business',           icon: '🏢' },
  { key: 'digital',    ms: 'Aset Digital',         en: 'Digital Assets',     icon: '💻' },
  { key: 'vehicle',    ms: 'Kenderaan',            en: 'Vehicle',            icon: '🚗' },
  { key: 'other',      ms: 'Lain-lain',            en: 'Other',              icon: '📦' },
]

// ─── General statement text ───────────────────────────────────────────────────
const GENERAL_STATEMENT_MS =
  'Saya memberikan semua harta saya yang tidak diperuntukkan secara khusus dalam Surat Wasiat ini, ' +
  'termasuk harta alih dan harta tak alih, kepada penerima manfaat sebagaimana yang dinyatakan dalam ' +
  'Artikel Penerima Manfaat Surat Wasiat ini.'

const GENERAL_STATEMENT_EN =
  'I give all my property not otherwise specifically disposed of in this Will, ' +
  'including movable and immovable property, to the beneficiary or beneficiaries as stated in ' +
  'the Beneficiary clause of this Will.'

// ─── Empty items per category ─────────────────────────────────────────────────
function emptyItem(key: string): AssetItem {
  const defaults: Record<string, Partial<AssetItem>> = {
    property:   { type: 'Kediaman',       meta: { subtype: 'Kediaman', address: '', lot_geran: '' } },
    bank:       { type: 'Akaun Bank',     meta: { bank: '', account_no: '' } },
    epf:        { type: 'KWSP',           meta: { member_no: '' } },
    investment: { type: 'Unit Amanah',    meta: { subtype: 'Unit Amanah', institution: '', ref_no: '' } },
    insurance:  { type: 'Insurans Hayat', meta: { subtype: 'Insurans Hayat', company: '', policy_no: '' } },
    business:   { type: 'Sdn Bhd',        meta: { subtype: 'Sdn Bhd', biz_name: '', ssm_no: '', share_pct: '' } },
    // Digital: no account IDs — only platform name + where access details are stored
    digital:    { type: 'Cryptocurrency', meta: { subtype: 'Cryptocurrency', platform: '', access_location: '' } },
    vehicle:    { type: 'Kereta',         meta: { subtype: 'Kereta', brand_model: '', plate: '' } },
    other:      { type: '',               meta: { description: '' } },
  }
  return { type: '', details: '', amount: 0, ...(defaults[key] ?? {}) }
}

// ─── Compose a human-readable details string from meta ────────────────────────
function composeDetails(key: string, type: string, meta: Record<string, string>): string {
  switch (key) {
    case 'property': {
      // Land types show lot/geran; built property shows address
      const isLand = type === 'Tanah Pertanian' || type === 'Tanah Kosong'
      if (isLand) return [meta.lot_geran].filter(Boolean).join('')
      return [meta.address, meta.lot_geran ? `(${meta.lot_geran})` : ''].filter(Boolean).join(' ')
    }
    case 'bank':
      return [meta.bank, meta.account_no].filter(Boolean).join(' | No. Akaun: ')
    case 'epf':
      return meta.member_no ? `No. Ahli: ${meta.member_no}` : ''
    case 'investment':
      return [meta.institution, meta.ref_no].filter(Boolean).join(' | Ref: ')
    case 'insurance':
      return [meta.company, meta.policy_no ? `No. Polisi: ${meta.policy_no}` : ''].filter(Boolean).join(' | ')
    case 'business':
      return [meta.biz_name, meta.ssm_no ? `SSM: ${meta.ssm_no}` : '', meta.share_pct ? `${meta.share_pct}% kepemilikan` : ''].filter(Boolean).join(' | ')
    case 'digital':
      // Intentionally minimal — no account IDs in the document
      return [type, meta.platform, meta.access_location ? `(maklumat akses: ${meta.access_location})` : ''].filter(Boolean).join(' | ')
    case 'vehicle':
      return [meta.brand_model, meta.plate].filter(Boolean).join(', No. Plat: ')
    case 'other':
      return meta.description ?? ''
    default:
      return ''
  }
}

// ─── Per-category item form ───────────────────────────────────────────────────
interface ItemFormProps {
  catKey: string
  item:   AssetItem
  ms:     boolean
  inp:    string
  onChange: (updated: AssetItem) => void
}

function AssetItemForm({ catKey, item, ms, inp, onChange }: ItemFormProps) {
  const meta = item.meta ?? {}

  function setMeta(field: string, value: string) {
    const newMeta = { ...meta, [field]: value }
    const newType = newMeta.subtype ?? item.type
    onChange({
      ...item,
      type:    newType,
      meta:    newMeta,
      details: composeDetails(catKey, newType, newMeta),
    })
  }

  function setType(value: string) {
    const newMeta = { ...meta, subtype: value }
    onChange({
      ...item,
      type:    value,
      meta:    newMeta,
      details: composeDetails(catKey, value, newMeta),
    })
  }

  function setAmount(value: number) {
    onChange({ ...item, amount: value })
  }

  const sel = `${inp} bg-background`
  const lbl = 'block text-xs font-medium mb-1 text-muted-foreground'

  // ── Property ──────────────────────────────────────────────────────────────
  if (catKey === 'property') {
    const isLand = item.type === 'Tanah Pertanian' || item.type === 'Tanah Kosong'
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={lbl}>{ms ? 'Jenis Hartanah *' : 'Property Type *'}</label>
          <select className={sel} value={item.type} onChange={e => setType(e.target.value)}>
            <option value="Kediaman">{ms ? 'Kediaman (Rumah / Apartment / Condo)' : 'Residential (House / Apartment / Condo)'}</option>
            <option value="Komersial">{ms ? 'Komersial (Kedai / Pejabat)' : 'Commercial (Shop / Office)'}</option>
            <option value="Perindustrian">{ms ? 'Perindustrian (Kilang / Gudang)' : 'Industrial (Factory / Warehouse)'}</option>
            <option value="Tanah Pertanian">{ms ? 'Tanah Pertanian' : 'Agricultural Land'}</option>
            <option value="Tanah Kosong">{ms ? 'Tanah Kosong' : 'Vacant Land'}</option>
          </select>
        </div>
        <div>
          <label className={lbl}>{ms ? 'Anggaran Nilai (RM)' : 'Estimated Value (RM)'}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">RM</span>
            <input type="number" className={`${inp} pl-9`} value={item.amount || ''} onChange={e => setAmount(parseFloat(e.target.value) || 0)} placeholder="0" min={0} />
          </div>
        </div>

        {/* Built property → address */}
        {!isLand && (
          <div className="sm:col-span-2">
            <label className={lbl}>{ms ? 'Alamat Hartanah *' : 'Property Address *'}</label>
            <textarea
              className={`${inp} min-h-[70px] resize-y`}
              value={meta.address ?? ''}
              onChange={e => setMeta('address', e.target.value)}
              placeholder={ms ? 'No. rumah, jalan, bandar, poskod, negeri' : 'House no., street, city, postcode, state'}
            />
          </div>
        )}

        {/* Land → lot/geran required; built property → optional */}
        <div className={isLand ? 'sm:col-span-2' : 'sm:col-span-2'}>
          <label className={lbl}>
            {isLand
              ? (ms ? 'No. Lot / No. Geran *' : 'Lot No. / Grant No. *')
              : (ms ? 'No. Lot / No. Geran / Tajuk Strata (jika ada)' : 'Lot No. / Grant No. / Strata Title (if available)')}
          </label>
          <input
            className={inp}
            value={meta.lot_geran ?? ''}
            onChange={e => setMeta('lot_geran', e.target.value)}
            placeholder={ms ? 'cth. Geran 12345, Lot 678, GM 1234' : 'e.g. Grant 12345, Lot 678, GM 1234'}
          />
          {isLand && (
            <p className="text-xs text-muted-foreground mt-1">
              {ms ? 'Tanah dikenalpasti melalui No. Lot / No. Geran — maklumat ini wajib.' : 'Land is identified by Lot No. / Grant No. — this is required.'}
            </p>
          )}
        </div>
      </div>
    )
  }

  // ── Bank Account ──────────────────────────────────────────────────────────
  if (catKey === 'bank') return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className={lbl}>{ms ? 'Nama Bank *' : 'Bank Name *'}</label>
        <select className={sel} value={meta.bank ?? ''} onChange={e => setMeta('bank', e.target.value)}>
          <option value="">{ms ? '-- Pilih bank --' : '-- Select bank --'}</option>
          {MY_BANKS_MS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div>
        <label className={lbl}>{ms ? 'No. Akaun *' : 'Account Number *'}</label>
        <input className={inp} value={meta.account_no ?? ''} onChange={e => setMeta('account_no', e.target.value)} placeholder="1234567890" />
      </div>
      <div>
        <label className={lbl}>{ms ? 'Anggaran Baki (RM)' : 'Estimated Balance (RM)'}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">RM</span>
          <input type="number" className={`${inp} pl-9`} value={item.amount || ''} onChange={e => setAmount(parseFloat(e.target.value) || 0)} placeholder="0" min={0} />
        </div>
      </div>
      <p className="sm:col-span-2 text-xs text-muted-foreground">
        {ms ? 'Nota: Akaun bersama (joint account) biasanya terus kepada pemegang bersama yang masih hidup dan tidak tertakluk kepada Surat Wasiat ini.' : 'Note: Joint accounts typically pass directly to the surviving joint holder and may not be governed by this Will.'}
      </p>
    </div>
  )

  // ── EPF ───────────────────────────────────────────────────────────────────
  if (catKey === 'epf') return (
    <div className="space-y-3">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 leading-relaxed">
        {ms
          ? '⚠ KWSP yang mempunyai penama akan terus kepada penama — BUKAN melalui Surat Wasiat ini. Senaraikan di sini untuk rekod sahaja.'
          : '⚠ EPF with a nominated beneficiary passes directly to the nominee — NOT through this Will. List here for record purposes only.'}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={lbl}>{ms ? 'No. Ahli KWSP *' : 'EPF Member No. *'}</label>
          <input className={inp} value={meta.member_no ?? ''} onChange={e => setMeta('member_no', e.target.value)} placeholder={ms ? 'No. ahli KWSP' : 'EPF member number'} />
        </div>
        <div>
          <label className={lbl}>{ms ? 'Anggaran Baki (RM)' : 'Estimated Balance (RM)'}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">RM</span>
            <input type="number" className={`${inp} pl-9`} value={item.amount || ''} onChange={e => setAmount(parseFloat(e.target.value) || 0)} placeholder="0" min={0} />
          </div>
        </div>
      </div>
    </div>
  )

  // ── Investment ────────────────────────────────────────────────────────────
  if (catKey === 'investment') return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className={lbl}>{ms ? 'Jenis Pelaburan *' : 'Investment Type *'}</label>
        <select className={sel} value={item.type} onChange={e => setType(e.target.value)}>
          <option value="Unit Amanah">{ms ? 'Unit Amanah (Unit Trust)' : 'Unit Trust'}</option>
          <option value="ASB/ASN">ASB / ASN</option>
          <option value="Saham">{ms ? 'Saham (Shares/Stock)' : 'Shares / Stock'}</option>
          <option value="PRS">{ms ? 'PRS (Skim Persaraan Swasta)' : 'PRS (Private Retirement Scheme)'}</option>
          <option value="Sukuk/Bon">{ms ? 'Sukuk / Bon (Bonds)' : 'Sukuk / Bonds'}</option>
          <option value="Emas">{ms ? 'Emas / Logam Berharga' : 'Gold / Precious Metals'}</option>
          <option value="Lain-lain">{ms ? 'Lain-lain' : 'Other'}</option>
        </select>
      </div>
      <div>
        <label className={lbl}>{ms ? 'Nama Institusi / Dana *' : 'Institution / Fund Name *'}</label>
        <input className={inp} value={meta.institution ?? ''} onChange={e => setMeta('institution', e.target.value)} placeholder={ms ? 'cth. Maybank Asset Management, ASNB' : 'e.g. Maybank Asset Management, ASNB'} />
      </div>
      <div>
        <label className={lbl}>{ms ? 'No. Akaun / Rujukan' : 'Account / Reference No.'}</label>
        <input className={inp} value={meta.ref_no ?? ''} onChange={e => setMeta('ref_no', e.target.value)} placeholder={ms ? 'No. akaun atau rujukan' : 'Account or reference number'} />
      </div>
      <div>
        <label className={lbl}>{ms ? 'Anggaran Nilai (RM)' : 'Estimated Value (RM)'}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">RM</span>
          <input type="number" className={`${inp} pl-9`} value={item.amount || ''} onChange={e => setAmount(parseFloat(e.target.value) || 0)} placeholder="0" min={0} />
        </div>
      </div>
    </div>
  )

  // ── Insurance / Takaful ───────────────────────────────────────────────────
  if (catKey === 'insurance') return (
    <div className="space-y-3">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 leading-relaxed">
        {ms
          ? '⚠ Polisi insurans/takaful dengan penama akan terus kepada penama — BUKAN melalui Surat Wasiat ini. Senaraikan di sini untuk rekod sahaja.'
          : '⚠ Insurance/takaful with a nominated beneficiary passes directly to the nominee — NOT through this Will. List here for record purposes only.'}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={lbl}>{ms ? 'Jenis Polisi *' : 'Policy Type *'}</label>
          <select className={sel} value={item.type} onChange={e => setType(e.target.value)}>
            <option value="Insurans Hayat">{ms ? 'Insurans Hayat (Life Insurance)' : 'Life Insurance'}</option>
            <option value="Takaful">{ms ? 'Takaful (Semua jenis)' : 'Takaful (All types)'}</option>
            <option value="Pelaburan Berkaitan Insurans">{ms ? 'Pelaburan Berkaitan Insurans (ILP)' : 'Investment-Linked Policy (ILP)'}</option>
            <option value="Insurans Perubatan">{ms ? 'Insurans Perubatan & Kesihatan' : 'Medical & Health Insurance'}</option>
            <option value="Insurans Am">{ms ? 'Insurans Am (Kereta, Harta, dll)' : 'General Insurance (Car, Property, etc.)'}</option>
          </select>
        </div>
        <div>
          <label className={lbl}>{ms ? 'Nama Syarikat *' : 'Company Name *'}</label>
          <input className={inp} value={meta.company ?? ''} onChange={e => setMeta('company', e.target.value)} placeholder={ms ? 'cth. AIA, Prudential, Great Eastern' : 'e.g. AIA, Prudential, Great Eastern'} />
        </div>
        <div>
          <label className={lbl}>{ms ? 'No. Polisi *' : 'Policy No. *'}</label>
          <input className={inp} value={meta.policy_no ?? ''} onChange={e => setMeta('policy_no', e.target.value)} placeholder={ms ? 'No. polisi insurans' : 'Insurance policy number'} />
        </div>
        <div>
          <label className={lbl}>{ms ? 'Jumlah Dilindungi / Nilai (RM)' : 'Sum Assured / Value (RM)'}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">RM</span>
            <input type="number" className={`${inp} pl-9`} value={item.amount || ''} onChange={e => setAmount(parseFloat(e.target.value) || 0)} placeholder="0" min={0} />
          </div>
        </div>
      </div>
    </div>
  )

  // ── Business ──────────────────────────────────────────────────────────────
  if (catKey === 'business') return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className={lbl}>{ms ? 'Jenis Entiti Perniagaan *' : 'Business Entity Type *'}</label>
        <select className={sel} value={item.type} onChange={e => setType(e.target.value)}>
          <option value="Milikan Tunggal">{ms ? 'Milikan Tunggal (Sole Proprietor)' : 'Sole Proprietorship'}</option>
          <option value="Perkongsian">{ms ? 'Perkongsian (Partnership)' : 'Partnership'}</option>
          <option value="Sdn Bhd">{ms ? 'Syarikat Sdn Bhd (Private Limited)' : 'Private Limited (Sdn Bhd)'}</option>
          <option value="Bhd">{ms ? 'Syarikat Berhad (Public Limited)' : 'Public Limited (Bhd)'}</option>
          <option value="LLP">{ms ? 'Perkongsian Liabiliti Terhad (LLP)' : 'Limited Liability Partnership (LLP)'}</option>
        </select>
      </div>
      <div>
        <label className={lbl}>{ms ? 'Nama Perniagaan *' : 'Business Name *'}</label>
        <input className={inp} value={meta.biz_name ?? ''} onChange={e => setMeta('biz_name', e.target.value)} placeholder={ms ? 'Nama syarikat / perniagaan' : 'Company / business name'} />
      </div>
      <div>
        <label className={lbl}>{ms ? 'No. Pendaftaran SSM' : 'SSM Registration No.'}</label>
        <input className={inp} value={meta.ssm_no ?? ''} onChange={e => setMeta('ssm_no', e.target.value)} placeholder={ms ? 'cth. 202301012345 (Sdn Bhd)' : 'e.g. 202301012345 (Sdn Bhd)'} />
      </div>
      <div>
        <label className={lbl}>{ms ? 'Peratusan Pemilikan (%)' : 'Ownership Share (%)'}</label>
        <div className="relative">
          <input className={`${inp} pr-8`} value={meta.share_pct ?? ''} onChange={e => setMeta('share_pct', e.target.value)} placeholder="100" type="number" min={1} max={100} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className={lbl}>{ms ? 'Anggaran Nilai Bahagian Anda (RM)' : 'Estimated Value of Your Share (RM)'}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">RM</span>
          <input type="number" className={`${inp} pl-9`} value={item.amount || ''} onChange={e => setAmount(parseFloat(e.target.value) || 0)} placeholder="0" min={0} />
        </div>
      </div>
    </div>
  )

  // ── Digital Assets ────────────────────────────────────────────────────────
  if (catKey === 'digital') return (
    <div className="space-y-3">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-2 leading-relaxed">
        <p className="font-semibold">{ms ? '🔒 Panduan Aset Digital dalam Surat Wasiat' : '🔒 Digital Assets in a Will — Best Practice'}</p>
        <p>
          {ms
            ? 'Jangan masukkan kata laluan, PIN, atau kunci peribadi (private key) dalam Surat Wasiat ini — dokumen wasiat boleh menjadi rekod awam semasa proses Probet.'
            : 'Do not include passwords, PINs, or private keys in this Will — a will may become a public record during Probate.'}
        </p>
        <p>
          {ms
            ? 'Amalan terbaik: Simpan maklumat akses dalam satu '
            : 'Best practice: Store access details in a '}
          <strong>{ms ? '"Surat Rahsia" berasingan' : 'separate "Letter of Instruction"'}</strong>
          {ms
            ? ' dan nyatakan dalam Surat Wasiat ini di mana ia disimpan. Serahkan surat itu kepada pelaksana anda secara sulit.'
            : ' and state in this Will where it is kept. Hand this letter privately to your executor.'}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={lbl}>{ms ? 'Jenis Aset Digital *' : 'Digital Asset Type *'}</label>
          <select className={sel} value={item.type} onChange={e => setType(e.target.value)}>
            <option value="Cryptocurrency">{ms ? 'Cryptocurrency (Bitcoin, Ethereum, dll)' : 'Cryptocurrency (Bitcoin, Ethereum, etc.)'}</option>
            <option value="Dompet E">{ms ? "Dompet E (Touch 'n Go, Boost, GrabPay)" : "E-Wallet (Touch 'n Go, Boost, GrabPay)"}</option>
            <option value="Perniagaan Dalam Talian">{ms ? 'Akaun Perniagaan Dalam Talian (Shopee, Lazada)' : 'Online Business Account (Shopee, Lazada)'}</option>
            <option value="Domain/Laman Web">{ms ? 'Domain / Laman Web' : 'Domain / Website'}</option>
            <option value="NFT">NFT</option>
            <option value="Akaun Media Sosial">{ms ? 'Akaun Media Sosial (dengan nilai komersial)' : 'Social Media Account (with commercial value)'}</option>
            <option value="Lain-lain">{ms ? 'Lain-lain' : 'Other'}</option>
          </select>
        </div>
        <div>
          <label className={lbl}>{ms ? 'Platform / Bursa *' : 'Platform / Exchange *'}</label>
          <input
            className={inp}
            value={meta.platform ?? ''}
            onChange={e => setMeta('platform', e.target.value)}
            placeholder={ms ? 'cth. Luno, Binance, Touch\'n Go' : "e.g. Luno, Binance, Touch 'n Go"}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={lbl}>
            {ms ? 'Di mana maklumat akses disimpan? *' : 'Where are the access details stored? *'}
          </label>
          <input
            className={inp}
            value={meta.access_location ?? ''}
            onChange={e => setMeta('access_location', e.target.value)}
            placeholder={ms
              ? 'cth. "Surat Rahsia dalam peti besi di rumah", "Pelaksana telah diberitahu"'
              : 'e.g. "Letter in home safe", "Executor has been informed privately"'}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {ms
              ? 'Maklumat ini akan disertakan dalam dokumen sebagai rujukan untuk pelaksana.'
              : 'This will appear in the document as a reference for your executor.'}
          </p>
        </div>
        <div>
          <label className={lbl}>{ms ? 'Anggaran Nilai (RM)' : 'Estimated Value (RM)'}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">RM</span>
            <input type="number" className={`${inp} pl-9`} value={item.amount || ''} onChange={e => setAmount(parseFloat(e.target.value) || 0)} placeholder="0" min={0} />
          </div>
        </div>
      </div>
    </div>
  )

  // ── Vehicle ───────────────────────────────────────────────────────────────
  if (catKey === 'vehicle') return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className={lbl}>{ms ? 'Jenis Kenderaan *' : 'Vehicle Type *'}</label>
        <select className={sel} value={item.type} onChange={e => setType(e.target.value)}>
          <option value="Kereta">{ms ? 'Kereta (Car)' : 'Car'}</option>
          <option value="Motosikal">{ms ? 'Motosikal (Motorcycle)' : 'Motorcycle'}</option>
          <option value="MPV/SUV">MPV / SUV</option>
          <option value="Lori/Van">{ms ? 'Lori / Van / Pikap' : 'Lorry / Van / Pickup'}</option>
          <option value="Bot/Kapal">{ms ? 'Bot / Kapal' : 'Boat / Vessel'}</option>
          <option value="Lain-lain">{ms ? 'Lain-lain' : 'Other'}</option>
        </select>
      </div>
      <div>
        <label className={lbl}>{ms ? 'Jenama & Model *' : 'Brand & Model *'}</label>
        <input className={inp} value={meta.brand_model ?? ''} onChange={e => setMeta('brand_model', e.target.value)} placeholder={ms ? 'cth. Perodua Myvi, Toyota Vios' : 'e.g. Perodua Myvi, Toyota Vios'} />
      </div>
      <div>
        <label className={lbl}>{ms ? 'No. Pendaftaran (Plat) *' : 'Registration No. (Plate) *'}</label>
        <input className={inp} value={meta.plate ?? ''} onChange={e => setMeta('plate', e.target.value.toUpperCase())} placeholder="WXX 1234" />
        <p className="text-xs text-muted-foreground mt-1">
          {ms ? 'No. plat adalah pengecam unik kenderaan — cukup untuk mengenalpasti kenderaan secara sah.' : 'Plate number is the unique legal identifier for Malaysian vehicles.'}
        </p>
      </div>
      <div>
        <label className={lbl}>{ms ? 'Anggaran Nilai Pasaran (RM)' : 'Estimated Market Value (RM)'}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">RM</span>
          <input type="number" className={`${inp} pl-9`} value={item.amount || ''} onChange={e => setAmount(parseFloat(e.target.value) || 0)} placeholder="0" min={0} />
        </div>
      </div>
    </div>
  )

  // ── Other ─────────────────────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="sm:col-span-2">
        <label className={lbl}>{ms ? 'Penerangan Aset *' : 'Asset Description *'}</label>
        <textarea
          className={`${inp} min-h-[70px] resize-y`}
          value={meta.description ?? ''}
          onChange={e => {
            const v = e.target.value
            onChange({ ...item, type: v.slice(0, 40), details: v, meta: { description: v } })
          }}
          placeholder={ms ? 'Huraikan aset anda...' : 'Describe your asset...'}
        />
      </div>
      <div>
        <label className={lbl}>{ms ? 'Anggaran Nilai (RM)' : 'Estimated Value (RM)'}</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">RM</span>
          <input type="number" className={`${inp} pl-9`} value={item.amount || ''} onChange={e => setAmount(parseFloat(e.target.value) || 0)} placeholder="0" min={0} />
        </div>
      </div>
    </div>
  )
}

// ─── Validation: is an item sufficiently filled? ──────────────────────────────
function isItemComplete(key: string, item: AssetItem): boolean {
  const m = item.meta ?? {}
  const isLand = item.type === 'Tanah Pertanian' || item.type === 'Tanah Kosong'
  switch (key) {
    case 'property':
      if (isLand) return !!item.type && !!(m.lot_geran?.trim())
      return !!item.type && !!(m.address?.trim())
    case 'bank':       return !!(m.bank) && !!(m.account_no?.trim())
    case 'epf':        return !!(m.member_no?.trim())
    case 'investment': return !!item.type && !!(m.institution?.trim())
    case 'insurance':  return !!item.type && !!(m.company?.trim()) && !!(m.policy_no?.trim())
    case 'business':   return !!item.type && !!(m.biz_name?.trim())
    case 'digital':    return !!item.type && !!(m.platform?.trim()) && !!(m.access_location?.trim())
    case 'vehicle':    return !!item.type && !!(m.brand_model?.trim()) && !!(m.plate?.trim())
    case 'other':      return !!(m.description?.trim())
    default:           return false
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  initialData:   WillAssets | null
  onChange:      (data: WillAssets) => void
  onValidChange: (valid: boolean) => void
}

export function WillStep3Assets({ initialData, onChange, onValidChange }: Props) {
  const locale = useLocale()
  const ms     = locale === 'ms'

  const [mode, setMode]           = useState<'itemised' | 'general'>(initialData?.mode ?? 'general')
  const [generalNote, setGeneralNote] = useState(initialData?.general_note ?? '')

  const [categories, setCategories] = useState<Record<string, AssetItem[]>>(() => {
    const map: Record<string, AssetItem[]> = {}
    if (initialData?.categories) {
      for (const c of initialData.categories) map[c.category] = c.items
    }
    return map
  })
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const activeKeys   = Object.keys(categories)
  const itemisedValid =
    activeKeys.length > 0 &&
    Object.entries(categories).every(([key, items]) =>
      items.length > 0 && items.every(item => isItemComplete(key, item))
    )
  const isValid = mode === 'general' || itemisedValid

  // Total estimated value
  const totalValue = activeKeys.reduce((sum, key) =>
    sum + categories[key].reduce((s, i) => s + (i.amount || 0), 0), 0
  )

  useEffect(() => {
    if (mode === 'general') {
      onChange({ mode: 'general', general_note: generalNote || undefined })
    } else {
      const cats: WillAssetCategory[] = activeKeys.map(key => {
        const def = CATEGORIES.find(d => d.key === key)!
        return { category: key, items: categories[key], note: ms ? def.ms : def.en }
      })
      onChange({ mode: 'itemised', categories: cats })
    }
    onValidChange(isValid)
  }, [mode, categories, generalNote]) // eslint-disable-line react-hooks/exhaustive-deps

  const updateItem = useCallback((key: string, idx: number, updated: AssetItem) => {
    setCategories(prev => {
      const items = [...prev[key]]
      items[idx] = updated
      return { ...prev, [key]: items }
    })
  }, [])

  function addCategory(key: string) {
    setCategories(prev => ({ ...prev, [key]: [emptyItem(key)] }))
    setExpanded(prev => ({ ...prev, [key]: true }))
  }

  function removeCategory(key: string) {
    setCategories(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  function addItem(key: string) {
    setCategories(prev => ({ ...prev, [key]: [...prev[key], emptyItem(key)] }))
  }

  function removeItem(key: string, idx: number) {
    setCategories(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }))
  }

  const inp = 'w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20'

  return (
    <div className="space-y-5">

      {/* Mode selector */}
      <div>
        <p className="text-sm font-medium mb-3">
          {ms ? 'Bagaimana anda ingin menghuraikan harta anda?' : 'How would you like to describe your assets?'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* General option */}
          <button
            type="button"
            onClick={() => setMode('general')}
            className={`relative text-left p-5 rounded-xl border-2 transition-all ${
              mode === 'general'
                ? 'border-primary bg-primary text-primary-foreground shadow-md'
                : 'border-border bg-background hover:border-primary/50 hover:shadow-sm'
            }`}
          >
            {/* Selected checkmark */}
            {mode === 'general' && (
              <span className="absolute top-3 right-3 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</span>
            )}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📋</span>
              <div>
                <p className={`text-sm font-bold ${mode === 'general' ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {ms ? 'Secara Keseluruhan' : 'As a Whole'}
                </p>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  mode === 'general' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {ms ? 'Disyorkan' : 'Recommended'}
                </span>
              </div>
            </div>
            <p className={`text-xs leading-relaxed mb-2 italic ${mode === 'general' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {ms
                ? '"Semua harta diserahkan kepada penerima manfaat yang saya lantik."'
                : '"All my property goes to my appointed beneficiaries."'}
            </p>
            <p className={`text-xs leading-relaxed ${mode === 'general' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
              {ms
                ? 'Sesuai untuk kebanyakan orang. Tiada perlu senaraikan setiap aset.'
                : 'Best for most people. No need to list every asset individually.'}
            </p>
          </button>

          {/* Itemised option */}
          <button
            type="button"
            onClick={() => setMode('itemised')}
            className={`relative text-left p-5 rounded-xl border-2 transition-all ${
              mode === 'itemised'
                ? 'border-primary bg-primary text-primary-foreground shadow-md'
                : 'border-border bg-background hover:border-primary/50 hover:shadow-sm'
            }`}
          >
            {mode === 'itemised' && (
              <span className="absolute top-3 right-3 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</span>
            )}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📂</span>
              <p className={`text-sm font-bold ${mode === 'itemised' ? 'text-primary-foreground' : 'text-foreground'}`}>
                {ms ? 'Senarai Aset Terperinci' : 'List Specific Assets'}
              </p>
            </div>
            <p className={`text-xs leading-relaxed mb-2 italic ${mode === 'itemised' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {ms
                ? '"Rumah → isteri. Kereta → anak. Wang → ibu."'
                : '"House → spouse. Car → son. Cash → mother."'}
            </p>
            <p className={`text-xs leading-relaxed ${mode === 'itemised' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
              {ms
                ? 'Sesuai jika anda ingin berikan aset tertentu kepada orang tertentu.'
                : 'Use this to assign specific assets to specific people.'}
            </p>
          </button>

        </div>
      </div>

      {/* General mode */}
      {mode === 'general' && (
        <div className="space-y-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 space-y-2">
            <p className="font-semibold">{ms ? '✓ Klausa Harta Am' : '✓ General Property Clause'}</p>
            <p className="text-xs leading-relaxed italic">"{ms ? GENERAL_STATEMENT_MS : GENERAL_STATEMENT_EN}"</p>
            <p className="text-xs leading-relaxed">
              {ms
                ? 'Pengagihan sebenar ditentukan oleh siapa yang anda tetapkan sebagai Penerima Manfaat dalam langkah seterusnya.'
                : 'Actual distribution is determined by who you appoint as Beneficiaries in the next step.'}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 leading-relaxed">
            <p className="font-semibold mb-0.5">{ms ? '⚠ KWSP & Insurans/Takaful' : '⚠ EPF & Insurance/Takaful'}</p>
            {ms
              ? 'KWSP dan polisi insurans/takaful yang mempunyai penama TIDAK tertakluk kepada Surat Wasiat ini — ia terus kepada penama.'
              : 'EPF and insurance/takaful with a nominated beneficiary are NOT governed by this Will — they pass directly to the nominee.'}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{ms ? 'Nota Tambahan (Pilihan)' : 'Additional Note (Optional)'}</label>
            <textarea
              className={`${inp} min-h-[80px] resize-y`}
              value={generalNote}
              onChange={e => setGeneralNote(e.target.value)}
              placeholder={ms ? 'Sebarang arahan tambahan...' : 'Any additional instructions...'}
            />
          </div>
        </div>
      )}

      {/* Itemised mode */}
      {mode === 'itemised' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 leading-relaxed">
            <p className="font-semibold mb-0.5">{ms ? 'Petua' : 'Tip'}</p>
            {ms
              ? 'Anda tidak perlu senaraikan SEMUA aset. Aset yang tidak disenaraikan akan masuk ke "Harta Baki" dan diagihkan kepada penerima harta baki anda. KWSP dan insurans dengan penama tidak perlu disenaraikan.'
              : 'You don\'t need to list ALL assets. Unlisted assets fall into the "Residual Estate" distributed to your residual beneficiary. EPF and insured assets with nominees don\'t need listing.'}
          </div>

          {/* Total value summary */}
          {activeKeys.length > 0 && totalValue > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 rounded-lg border border-border text-sm">
              <span className="text-muted-foreground">{ms ? 'Jumlah anggaran nilai:' : 'Total estimated value:'}</span>
              <span className="font-semibold">RM {totalValue.toLocaleString('ms-MY')}</span>
            </div>
          )}

          {/* Active category cards */}
          {activeKeys.map(key => {
            const def   = CATEGORIES.find(d => d.key === key)!
            const items = categories[key]
            const isExp = expanded[key] !== false
            const allComplete = items.every(item => isItemComplete(key, item))

            return (
              <div key={key} className="border border-border rounded-xl overflow-hidden">
                {/* Header */}
                <div className={`flex items-center justify-between px-4 py-3 ${allComplete && items.length > 0 ? 'bg-emerald-50' : 'bg-muted/30'}`}>
                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm font-semibold flex-1 text-left"
                    onClick={() => setExpanded(prev => ({ ...prev, [key]: !isExp }))}
                  >
                    {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span>{def.icon} {ms ? def.ms : def.en}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      ({items.length} {ms ? (items.length > 1 ? 'rekod' : 'rekod') : (items.length > 1 ? 'records' : 'record')})
                    </span>
                    {allComplete && items.length > 0 && <span className="text-xs text-emerald-600">✓</span>}
                  </button>
                  <button type="button" onClick={() => removeCategory(key)} className="p-1 text-muted-foreground hover:text-destructive transition ml-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Items */}
                {isExp && (
                  <div className="p-4 space-y-5">
                    {items.map((item, idx) => (
                      <div key={idx} className="relative">
                        {items.length > 1 && (
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-muted-foreground">
                              #{idx + 1}
                            </p>
                            <button type="button" onClick={() => removeItem(key, idx)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition">
                              <Trash2 className="w-3.5 h-3.5" />
                              {ms ? 'Padam' : 'Remove'}
                            </button>
                          </div>
                        )}
                        <AssetItemForm
                          catKey={key}
                          item={item}
                          ms={ms}
                          inp={inp}
                          onChange={updated => updateItem(key, idx, updated)}
                        />
                        {items.length > 1 && idx < items.length - 1 && (
                          <div className="border-t border-dashed border-border mt-5" />
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addItem(key)}
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium py-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {ms ? `Tambah ${def.ms.toLowerCase()} lain` : `Add another ${def.en.toLowerCase()}`}
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {/* Add category */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {ms ? 'Tambah kategori aset:' : 'Add asset category:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter(d => !activeKeys.includes(d.key)).map(def => (
                <button
                  key={def.key}
                  type="button"
                  onClick={() => addCategory(def.key)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:border-primary hover:text-primary transition"
                >
                  <Plus className="w-3 h-3" />
                  {def.icon} {ms ? def.ms : def.en}
                </button>
              ))}
              {CATEGORIES.every(d => activeKeys.includes(d.key)) && (
                <p className="text-xs text-emerald-600">✓ {ms ? 'Semua kategori ditambah' : 'All categories added'}</p>
              )}
            </div>
          </div>

          {activeKeys.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {ms ? 'Tambah sekurang-kurangnya satu kategori aset untuk meneruskan.' : 'Add at least one asset category to continue.'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
