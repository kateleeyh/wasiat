import React from 'react'
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import type { WillRecord, WillAssetCategory } from '@/types/database'

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    fontFamily:   'Helvetica',
    fontSize:      10.5,
    color:         '#1a1a1a',
    paddingTop:    56,
    paddingBottom: 60,
    paddingLeft:   72,
    paddingRight:  72,
    lineHeight:    1.65,
  },
  coverPage: {
    fontFamily:    'Helvetica',
    color:         '#1a1a1a',
    paddingTop:    140,
    paddingBottom: 60,
    paddingLeft:   72,
    paddingRight:  72,
    alignItems:    'center',
  },
  coverLabel:  { fontSize: 11, fontFamily: 'Helvetica-Bold', letterSpacing: 2, marginBottom: 6, color: '#555' },
  coverTitle:  { fontSize: 26, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 6 },
  coverSub:    { fontSize: 13, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 20, color: '#333' },
  coverName:   { fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 20 },
  coverMeta:   { fontSize: 10, color: '#555', marginBottom: 6 },
  coverLine:   { width: 120, height: 1, backgroundColor: '#ccc', marginVertical: 24 },

  pageHeader:      { textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10, marginBottom: 18 },
  pageHeaderTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', letterSpacing: 2 },
  pageHeaderSub:   { fontSize: 9, color: '#555', marginTop: 3 },

  articleTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5, marginBottom: 8, marginTop: 20 },
  para:         { fontSize: 10.5, lineHeight: 1.75, textAlign: 'justify', marginBottom: 8 },
  bold:         { fontFamily: 'Helvetica-Bold' },

  bullet:     { flexDirection: 'row', marginBottom: 4 },
  bulletDot:  { width: 16, fontSize: 10.5 },
  bulletText: { flex: 1, fontSize: 10.5, lineHeight: 1.7, textAlign: 'justify' },

  beneItem: { marginBottom: 10, paddingLeft: 12, paddingVertical: 6, borderLeftWidth: 2, borderLeftColor: '#ddd' },
  beneName: { fontSize: 10.5, fontFamily: 'Helvetica-Bold' },
  beneSub:  { fontSize: 9.5, color: '#444', lineHeight: 1.6 },

  infoBox: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 4,
    padding: 10, marginVertical: 6,
  },
  infoLabel: { fontSize: 9, color: '#888', marginBottom: 2 },
  infoValue: { fontSize: 10.5 },

  sigDivider: { borderTopWidth: 1, borderTopColor: '#555', marginVertical: 20 },
  sigSection: { marginBottom: 16 },
  sigLabel:   { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginBottom: 10 },
  sigGrid:    { flexDirection: 'row', gap: 40 },
  sigCol:     { flex: 1 },
  sigLine:    { borderBottomWidth: 0.75, borderBottomColor: '#555', marginBottom: 4, marginTop: 24, width: '100%' },
  sigName:    { fontSize: 9.5, color: '#555' },
  sigDotLine: { fontSize: 10, color: '#333', marginBottom: 3 },
  closingLine: { textAlign: 'center', fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginTop: 24 },

  scheduleTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 4 },
  scheduleSub:   { fontSize: 10, textAlign: 'center', color: '#555', marginBottom: 4 },
  sectionBox:    { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 16 },
  sectionHdr:    { backgroundColor: '#f0f0f0', paddingVertical: 6, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  sectionHdrText:{ fontSize: 10.5, fontFamily: 'Helvetica-Bold' },
  itemBox:       { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 4, margin: 10, padding: 10 },
  itemTitle:     { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  itemDetail:    { fontSize: 9.5, color: '#333', marginBottom: 1 },
  itemValue:     { fontSize: 9.5, color: '#666', marginTop: 4 },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string, locale: string = 'ms-MY') {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

function currency(n: number) {
  return `RM ${n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// ─── Main PDF ─────────────────────────────────────────────────────────────────

interface Props {
  data:        WillRecord
  docRef:      string
  generatedAt: string
  language:    'ms' | 'en'
}

export function WillPdf({ data, docRef, generatedAt, language }: Props) {
  const ms     = language === 'ms'
  const locale = ms ? 'ms-MY' : 'en-MY'
  const fmt    = (d: string) => fmtDate(d, locale)

  const t  = data.testator_info!
  const ex = data.executor
  const bk = data.backup_executor
  const as = data.assets
  const bn = data.beneficiaries ?? []
  const ad = data.asset_distributions ?? []
  const rb = data.residual_estate_beneficiary
  const gd = data.guardianship
  const wt = data.witnesses
  const dc = data.declaration

  const hasSchedule      = as?.mode === 'itemised' && (as.categories?.length ?? 0) > 0
  const hasGuardianship  = gd?.has_minor_children && (gd.children?.length ?? 0) > 0
  const hasSpecialWishes = !!(dc?.special_wishes?.trim())
  const generalProvisionsArticleNo = 6 + (hasGuardianship ? 1 : 0) + (hasSpecialWishes ? 1 : 0)
  const closingArticleNo           = generalProvisionsArticleNo + 1

  const NO_RELIGION_VALUES = ['No Religion', 'Tiada Agama', 'None', '']
  const showReligion = !!t.religion && !NO_RELIGION_VALUES.includes(t.religion)

  const maritalLabel: Record<string, string> = ms
    ? { single: 'Bujang', married: 'Berkahwin', widowed: 'Balu atau Duda', divorced: 'Bercerai' }
    : { single: 'Single', married: 'Married', widowed: 'Widowed', divorced: 'Divorced' }

  const CATEGORY_LABELS: Record<string, string> = ms
    ? { property: 'Hartanah', bank: 'Akaun Bank', epf: 'KWSP', investment: 'Pelaburan',
        insurance: 'Insurans / Takaful', business: 'Perniagaan', digital: 'Aset Digital',
        vehicle: 'Kenderaan', other: 'Lain-lain' }
    : { property: 'Property', bank: 'Bank Account', epf: 'EPF', investment: 'Investment',
        insurance: 'Insurance / Takaful', business: 'Business', digital: 'Digital Assets',
        vehicle: 'Vehicle', other: 'Other' }

  return (
    <Document
      title={ms ? `Surat Wasiat Am — ${t.full_name}` : `Last Will and Testament — ${t.full_name}`}
      author="WasiatHub"
      subject={ms ? 'Surat Wasiat Am — Akta Wasiat 1959 (Malaysia)' : 'General Will — Wills Act 1959 (Malaysia)'}
    >
      {/* ═══════════════════════════════════════════════
          COVER PAGE
      ═══════════════════════════════════════════════ */}
      <Page size="A4" style={S.coverPage}>
        <Text style={S.coverLabel}>{ms ? 'DOKUMEN RASMI' : 'OFFICIAL DOCUMENT'}</Text>
        {ms ? (
          <Text style={S.coverTitle}>SURAT WASIAT AM</Text>
        ) : (
          <>
            <Text style={S.coverTitle}>LAST WILL</Text>
            <Text style={S.coverSub}>AND TESTAMENT</Text>
          </>
        )}
        <Text style={S.coverName}>{t.full_name.toUpperCase()}</Text>
        <Text style={S.coverMeta}>{ms ? 'No. Kad Pengenalan' : 'IC No.'}: {t.ic_number}</Text>
        <Text style={S.coverMeta}>
          {t.nationality}{showReligion ? ` | ${t.religion}` : ''}
        </Text>
        <View style={S.coverLine} />
        <Text style={S.coverMeta}>{ms ? 'Tarikh Dijana' : 'Generated'}: {fmt(generatedAt)}</Text>
        <Text style={[S.coverMeta, { marginTop: 4 }]}>{ms ? 'No. Rujukan' : 'Ref'}: {docRef}</Text>
        <Text style={[S.coverMeta, { marginTop: 40, fontSize: 8, color: '#aaa', textAlign: 'center' }]}>
          {ms
            ? 'Disediakan di bawah Akta Wasiat 1959 (Malaysia)\nSah apabila ditandatangani di hadapan dua orang saksi'
            : 'Prepared under the Wills Act 1959 (Malaysia)\nValid when signed in the presence of two witnesses'}
        </Text>
      </Page>

      {/* ═══════════════════════════════════════════════
          MAIN DOCUMENT
      ═══════════════════════════════════════════════ */}
      <Page size="A4" style={S.page}>

        {/* Header */}
        <View style={S.pageHeader}>
          <Text style={S.pageHeaderTitle}>
            {ms ? 'SURAT WASIAT AM' : 'LAST WILL AND TESTAMENT'}
          </Text>
          <Text style={S.pageHeaderSub}>
            {ms ? 'Akta Wasiat 1959 (Malaysia)' : 'Wills Act 1959 (Malaysia)'}
          </Text>
        </View>

        {/* Opening declaration */}
        <View wrap={false}>
          <Text style={S.articleTitle}>{ms ? 'PENGISYTIHARAN' : 'DECLARATION'}</Text>
          {ms ? (
            <Text style={S.para}>
              Saya, <Text style={S.bold}>{t.full_name.toUpperCase()}</Text>, No. Kad Pengenalan{' '}
              <Text style={S.bold}>{t.ic_number}</Text>, warganegara{' '}
              <Text style={S.bold}>{t.nationality}</Text>
              {showReligion ? <Text>, beragama <Text style={S.bold}>{t.religion}</Text></Text> : null}
              , beralamat di <Text style={S.bold}>{t.address}</Text>,{' '}
              dengan penuh kesedaran, berfikiran waras, dan tanpa sebarang paksaan, dengan ini
              mengisytiharkan bahawa inilah <Text style={S.bold}>Surat Wasiat Terakhir</Text> saya
              dan saya membatalkan semua wasiat dan kodisil yang terdahulu.
            </Text>
          ) : (
            <Text style={S.para}>
              I, <Text style={S.bold}>{t.full_name.toUpperCase()}</Text>, IC No.{' '}
              <Text style={S.bold}>{t.ic_number}</Text>, {t.nationality} citizen
              {showReligion ? <Text>, religion: <Text style={S.bold}>{t.religion}</Text></Text> : null}
              , of <Text style={S.bold}>{t.address}</Text>,{' '}
              being of sound mind and free from any undue influence, hereby declare this to be my{' '}
              <Text style={S.bold}>Last Will and Testament</Text> and revoke all former wills and codicils.
            </Text>
          )}
        </View>

        {/* ARTICLE 1: EXECUTOR */}
        <View wrap={false}>
          <Text style={S.articleTitle}>
            {ms ? 'ARTIKEL 1: PELANTIKAN PELAKSANA' : 'ARTICLE 1: APPOINTMENT OF EXECUTOR'}
          </Text>
          {ex ? (
            ms ? (
              <Text style={S.para}>
                Saya dengan ini melantik{' '}
                <Text style={S.bold}>{ex.full_name.toUpperCase()}</Text>{' '}
                (No. K/P: {ex.ic_number}), {ex.relationship}, beralamat di {ex.address},
                sebagai <Text style={S.bold}>Pelaksana Utama</Text> Surat Wasiat ini.
              </Text>
            ) : (
              <Text style={S.para}>
                I hereby appoint{' '}
                <Text style={S.bold}>{ex.full_name.toUpperCase()}</Text>{' '}
                (IC: {ex.ic_number}), {ex.relationship}, of {ex.address},
                as the <Text style={S.bold}>Primary Executor</Text> of this Will.
              </Text>
            )
          ) : (
            <Text style={[S.para, { color: '#888' }]}>
              {ms ? '— Pelaksana belum dilantik —' : '— Executor not appointed —'}
            </Text>
          )}
        </View>

        {ex && (
          <>
            {bk && (
              ms ? (
                <Text style={S.para}>
                  Sekiranya pelaksana utama meninggal dunia, enggan berkhidmat, atau tidak layak
                  sebelum atau semasa pentadbiran harta pusaka ini, maka{' '}
                  <Text style={S.bold}>{bk.full_name.toUpperCase()}</Text>{' '}
                  (No. K/P: {bk.ic_number}), {bk.relationship},
                  dilantik sebagai <Text style={S.bold}>Pelaksana Simpanan</Text>.
                </Text>
              ) : (
                <Text style={S.para}>
                  Should the primary executor predecease me, refuse to act, or be unable to act
                  before or during the administration of this estate,{' '}
                  <Text style={S.bold}>{bk.full_name.toUpperCase()}</Text>{' '}
                  (IC: {bk.ic_number}), {bk.relationship},
                  is appointed as the <Text style={S.bold}>Backup Executor</Text>.
                </Text>
              )
            )}

            <Text style={S.para}>
              {ms
                ? 'Pelaksana diberi kuasa penuh untuk: (a) memohon Geran Probet atau Surat Pentadbiran dari mahkamah yang berbidang kuasa; (b) mengenal pasti, mengumpul dan menjaga semua harta pusaka; (c) menyelesaikan semua hutang, cukai, kos pengebumian dan perbelanjaan pentadbiran yang sah; (d) menjual, menukar atau menguruskan mana-mana aset yang diperlukan bagi pentadbiran harta pusaka; dan (e) mengagihkan harta pusaka kepada penerima manfaat yang berhak mengikut peruntukan Surat Wasiat ini.'
                : 'The Executor is hereby empowered to: (a) apply for Grant of Probate or Letters of Administration from the competent court; (b) identify, collect and preserve all estate assets; (c) settle all just debts, taxes, funeral costs and administration expenses; (d) sell, convert or manage any assets as required for estate administration; and (e) distribute the estate to the entitled beneficiaries in accordance with this Will.'}
            </Text>
          </>
        )}

        {/* ARTICLE 2: DEBTS */}
        <View wrap={false}>
          <Text style={S.articleTitle}>
            {ms ? 'ARTIKEL 2: PENYELESAIAN HUTANG DAN LIABILITI' : 'ARTICLE 2: SETTLEMENT OF DEBTS AND LIABILITIES'}
          </Text>
          <Text style={S.para}>
            {ms
              ? 'Saya mengarahkan pelaksana saya untuk menyelesaikan, seberapa segera yang boleh dilaksanakan selepas kematian saya, semua hutang dan liabiliti yang sah termasuk:'
              : 'I direct my Executor to settle, as soon as practicable after my death, all my just debts and liabilities including:'}
          </Text>
        </View>

        {[
          ms ? 'Hutang peribadi kepada individu atau institusi kewangan' : 'Personal debts owed to individuals or financial institutions',
          ms ? 'Hutang gadai janji, pinjaman kereta, atau pinjaman lain yang masih belum selesai' : 'Outstanding mortgage, vehicle loans, or other secured/unsecured loans',
          ms ? 'Cukai yang kena dibayar kepada Lembaga Hasil Dalam Negeri atau mana-mana pihak berkuasa berkenaan' : 'Taxes due to the Inland Revenue Board or any relevant authority',
          ms ? 'Kos pengebumian dan majlis sempena pemergian saya yang berpatutan' : 'Reasonable funeral and related ceremony expenses',
          ms ? 'Kos pentadbiran harta pusaka, yuran guaman dan mahkamah yang berkaitan' : 'Estate administration costs, legal and court fees',
        ].map((item, i) => (
          <View key={i} style={S.bullet}>
            <Text style={S.bulletDot}>•</Text>
            <Text style={S.bulletText}>{item}</Text>
          </View>
        ))}

        <Text style={S.para}>
          {ms
            ? 'Sebarang perbelanjaan tersebut hendaklah dibayar daripada harta pusaka saya sebelum sebarang pengagihan kepada penerima manfaat dilaksanakan.'
            : 'All such payments shall be made from my estate before any distribution to beneficiaries is effected.'}
        </Text>

        {/* ARTICLE 3: ASSETS */}
        <View wrap={false}>
          <Text style={S.articleTitle}>
            {ms ? 'ARTIKEL 3: HARTA PUSAKA' : 'ARTICLE 3: ESTATE ASSETS'}
          </Text>
          {as?.mode === 'general' ? (
            <Text style={S.para}>
              {ms
                ? 'Saya memberikan semua harta saya yang tidak diperuntukkan secara khusus dalam Surat Wasiat ini, termasuk harta alih dan harta tak alih, kepada penerima manfaat sebagaimana dinyatakan dalam Artikel 4.'
                : 'I give all my property not otherwise specifically disposed of in this Will, including movable and immovable property, to the beneficiaries as stated in Article 4.'}
            </Text>
          ) : hasSchedule ? (
            <Text style={S.para}>
              {ms
                ? 'Harta pusaka saya adalah seperti yang dinyatakan dalam Jadual Harta (Lampiran A) yang dilampirkan bersama dokumen ini. Mana-mana harta yang tidak disenaraikan dalam Jadual tersebut adalah termasuk dalam Harta Baki yang dirujuk dalam Artikel 5.'
                : 'My estate assets are as set out in the Asset Schedule (Appendix A) attached to this Will. Any assets not listed in the Schedule form part of the Residual Estate referred to in Article 5.'}
            </Text>
          ) : (
            <Text style={[S.para, { color: '#888' }]}>
              {ms ? '— Harta belum dinyatakan —' : '— Assets not specified —'}
            </Text>
          )}
        </View>

        {as?.mode === 'general' && as.general_note && (
          <Text style={S.para}>{as.general_note}</Text>
        )}

        <Text style={S.para}>
          {ms
            ? 'Nota: Harta yang mempunyai penama (KWSP, insurans/takaful) dan harta bersama (joint tenancy) tidak tertakluk kepada Surat Wasiat ini dan akan diuruskan mengikut undang-undang yang berkenaan.'
            : 'Note: Assets with a named nominee (EPF, insurance/takaful) and jointly held property (joint tenancy) are not governed by this Will and shall be dealt with under the relevant law.'}
        </Text>

        {/* ARTICLE 4: BENEFICIARIES */}
        {as?.mode === 'itemised' && ad.length > 0 ? (
          <>
            <View wrap={false}>
              <Text style={S.articleTitle}>
                {ms ? 'ARTIKEL 4: PENGAGIHAN KEPADA PENERIMA MANFAAT' : 'ARTICLE 4: DISTRIBUTION TO BENEFICIARIES'}
              </Text>
              <Text style={S.para}>
                {ms
                  ? 'Selepas penyelesaian hutang dan kos pentadbiran, saya MEMBERIKAN, MENGHADIAHKAN DAN MEWASIATKAN harta-harta saya seperti berikut:'
                  : 'After settlement of debts and administration costs, I GIVE, DEVISE AND BEQUEATH my assets as follows:'}
              </Text>
            </View>

            {ad.map((dist, di) => (
              <View key={di} style={{ marginBottom: 12 }}>
                <Text style={[S.beneName, { marginBottom: 4 }]}>
                  {`(${di + 1}) `}{dist.asset_label.toUpperCase()}
                </Text>
                <Text style={[S.para, { marginBottom: 4, fontStyle: 'italic' }]}>
                  {ms
                    ? 'kepada penerima-penerima berikut dalam bahagian yang dinyatakan:'
                    : 'to the following beneficiaries in the proportions stated:'}
                </Text>
                {dist.beneficiaries.map((b, bi) => (
                  <View key={bi} style={[S.beneItem, { marginLeft: 16, marginBottom: 6 }]}>
                    <Text style={S.beneName}>{b.full_name.toUpperCase()} — {b.percentage}%</Text>
                    <Text style={S.beneSub}>
                      {(ms ? 'No. K/P: ' : 'IC/Passport: ') + b.ic_number + '  |  ' + b.relationship}
                    </Text>
                    {b.phone && (
                      <Text style={S.beneSub}>{(ms ? 'Tel: ' : 'Tel: ') + b.phone}</Text>
                    )}
                  </View>
                ))}
              </View>
            ))}

            <Text style={S.para}>
              {ms
                ? 'Sekiranya mana-mana penerima meninggal dunia sebelum saya atau menolak peruntukan tersebut, bahagian berkenaan hendaklah masuk ke dalam Harta Baki dan diagihkan mengikut Artikel 5.'
                : 'Should any beneficiary predecease me or disclaim their entitlement, that share shall fall into the Residual Estate and be distributed under Article 5.'}
            </Text>
          </>

        ) : bn.length > 0 ? (
          <>
            <View wrap={false}>
              <Text style={S.articleTitle}>
                {ms ? 'ARTIKEL 4: PENGAGIHAN KEPADA PENERIMA MANFAAT' : 'ARTICLE 4: DISTRIBUTION TO BENEFICIARIES'}
              </Text>
              <Text style={S.para}>
                {ms
                  ? 'Selepas penyelesaian hutang dan kos pentadbiran, saya mengagihkan harta pusaka saya kepada penerima-penerima manfaat berikut:'
                  : 'After settlement of debts and administration costs, I distribute my estate to the following beneficiaries:'}
              </Text>
            </View>

            {bn.map((b, i) => (
              <View key={i} style={S.beneItem}>
                <Text style={S.beneName}>{b.full_name.toUpperCase()}</Text>
                <Text style={S.beneSub}>
                  {(ms ? 'No. K/P: ' : 'IC: ') + b.ic_number + '  |  ' + b.relationship}
                </Text>
                <Text style={S.beneSub}>
                  {b.assignment_type === 'percentage'
                    ? (ms
                        ? `Menerima ${b.percentage}% daripada harta pusaka saya`
                        : `Receives ${b.percentage}% of my estate`)
                    : (ms
                        ? `Harta khusus: ${b.specific_asset}`
                        : `Specific asset: ${b.specific_asset}`)}
                </Text>
                {b.address && (
                  <Text style={S.beneSub}>{(ms ? 'Alamat: ' : 'Address: ') + b.address}</Text>
                )}
              </View>
            ))}

            <Text style={S.para}>
              {ms
                ? 'Sekiranya mana-mana penerima meninggal dunia sebelum saya atau menolak peruntukan tersebut, bahagian berkenaan hendaklah masuk ke dalam Harta Baki dan diagihkan mengikut Artikel 5.'
                : 'Should any beneficiary predecease me or disclaim their entitlement, that share shall fall into the Residual Estate and be distributed under Article 5.'}
            </Text>
          </>
        ) : (
          <View wrap={false}>
            <Text style={S.articleTitle}>
              {ms ? 'ARTIKEL 4: PENGAGIHAN KEPADA PENERIMA MANFAAT' : 'ARTICLE 4: DISTRIBUTION TO BENEFICIARIES'}
            </Text>
            <Text style={[S.para, { color: '#888' }]}>
              {ms ? '— Tiada penerima manfaat dinyatakan —' : '— No beneficiaries specified —'}
            </Text>
          </View>
        )}

        {/* ARTICLE 5: RESIDUAL ESTATE */}
        <View wrap={false}>
          <Text style={S.articleTitle}>
            {ms ? 'ARTIKEL 5: HARTA BAKI' : 'ARTICLE 5: RESIDUAL ESTATE'}
          </Text>
          {rb ? (
            ms ? (
              <Text style={S.para}>
                Saya memberikan semua harta pusaka saya yang berbaki selepas pengagihan yang dinyatakan
                di atas kepada{' '}
                <Text style={S.bold}>{rb.full_name.toUpperCase()}</Text>{' '}
                (No. K/P: {rb.ic_number}), {rb.relationship}.
              </Text>
            ) : (
              <Text style={S.para}>
                I give all the rest and residue of my estate remaining after the above distributions to{' '}
                <Text style={S.bold}>{rb.full_name.toUpperCase()}</Text>{' '}
                (IC: {rb.ic_number}), {rb.relationship}.
              </Text>
            )
          ) : (
            <Text style={S.para}>
              {ms
                ? 'Mana-mana harta yang berbaki selepas pengagihan di atas hendaklah diagihkan mengikut Akta Pembahagian 1958 atau undang-undang yang berkuat kuasa di Malaysia.'
                : 'Any remaining estate after the above distributions shall be distributed in accordance with the Distribution Act 1958 or applicable Malaysian law.'}
            </Text>
          )}
        </View>

        {/* ARTICLE 6: GUARDIANSHIP (conditional) */}
        {hasGuardianship && (
          <>
            <View wrap={false}>
              <Text style={S.articleTitle}>
                {ms ? 'ARTIKEL 6: PENJAGAAN ANAK-ANAK KECIL' : 'ARTICLE 6: GUARDIANSHIP OF MINOR CHILDREN'}
              </Text>
              <Text style={S.para}>
                {ms
                  ? 'Saya mempunyai anak-anak kecil yang memerlukan penjagaan sekiranya saya meninggal dunia. Saya dengan ini menyatakan hasrat saya berkenaan penjagaan mereka:'
                  : 'I have minor children who will require guardianship in the event of my death. I hereby express my wishes regarding their care:'}
              </Text>
            </View>

            <Text style={[S.para, { fontFamily: 'Helvetica-Bold', marginBottom: 4 }]}>
              {ms ? 'Anak-Anak:' : 'Children:'}
            </Text>
            {gd!.children!.map((c, i) => (
              <View key={i} style={[S.beneItem, { marginBottom: 6 }]}>
                <Text style={S.beneName}>{c.full_name.toUpperCase()}</Text>
                <Text style={S.beneSub}>
                  {ms ? 'No. K/P / Sijil Lahir: ' : 'IC / Birth Cert: '}{c.ic_birth_cert}
                  {'  |  '}{ms ? 'Tarikh Lahir: ' : 'Date of Birth: '}{fmt(c.dob)}
                </Text>
              </View>
            ))}

            {gd!.primary_guardian && (
              <>
                <Text style={[S.para, { fontFamily: 'Helvetica-Bold', marginTop: 8, marginBottom: 4 }]}>
                  {ms ? 'Penjaga Utama:' : 'Primary Guardian:'}
                </Text>
                <View style={S.beneItem}>
                  <Text style={S.beneName}>{gd!.primary_guardian.full_name.toUpperCase()}</Text>
                  <Text style={S.beneSub}>
                    {(ms ? 'No. K/P: ' : 'IC: ') + gd!.primary_guardian.ic_number}
                    {'  |  '}{gd!.primary_guardian.relationship}
                  </Text>
                  <Text style={S.beneSub}>{'Tel: ' + gd!.primary_guardian.phone}</Text>
                  <Text style={S.beneSub}>{(ms ? 'Alamat: ' : 'Address: ') + gd!.primary_guardian.address}</Text>
                </View>
              </>
            )}

            {gd!.backup_guardian && (
              <>
                <Text style={[S.para, { fontFamily: 'Helvetica-Bold', marginTop: 8, marginBottom: 4 }]}>
                  {ms ? 'Penjaga Simpanan:' : 'Backup Guardian:'}
                </Text>
                <View style={S.beneItem}>
                  <Text style={S.beneName}>{gd!.backup_guardian.full_name.toUpperCase()}</Text>
                  <Text style={S.beneSub}>
                    {(ms ? 'No. K/P: ' : 'IC: ') + gd!.backup_guardian.ic_number}
                    {'  |  '}{gd!.backup_guardian.relationship}
                  </Text>
                  <Text style={S.beneSub}>{'Tel: ' + gd!.backup_guardian.phone}</Text>
                </View>
              </>
            )}

            <Text style={S.para}>
              {ms
                ? 'Perlantikan penjaga ini tertakluk kepada keputusan mahkamah yang berbidangkuasa.'
                : 'This guardianship appointment is subject to the decision of the competent court.'}
            </Text>
          </>
        )}

        {/* SPECIAL WISHES (if declaration notes exist) */}
        {hasSpecialWishes && (
          <View wrap={false}>
            <Text style={S.articleTitle}>
              {ms
                ? `ARTIKEL ${closingArticleNo - 1}: ARAHAN KHAS DAN HASRAT PERIBADI`
                : `ARTICLE ${closingArticleNo - 1}: SPECIAL INSTRUCTIONS AND PERSONAL WISHES`}
            </Text>
            <Text style={S.para}>{dc?.special_wishes}</Text>
          </View>
        )}

        {/* GENERAL PROVISIONS */}
        <View wrap={false}>
          <Text style={S.articleTitle}>
            {ms
              ? `ARTIKEL ${generalProvisionsArticleNo}: PERUNTUKAN AM`
              : `ARTICLE ${generalProvisionsArticleNo}: GENERAL PROVISIONS`}
          </Text>
          <Text style={S.para}>
            {ms
              ? '(a) Pelaksana dan Pemegang Amanah saya berhak dibayar balik untuk semua kos dan perbelanjaan yang munasabah yang ditanggung berkaitan dengan tugas-tugas di bawah Surat Wasiat ini.'
              : '(a) My Executor and Trustee shall be reimbursed for all reasonable costs and expenses incurred in connection with their duties under this Will.'}
          </Text>
        </View>

        {ms ? (
          <>
            <Text style={S.para}>
              (b) Sekiranya tidak praktik atau tidak mungkin bagi Pelaksana dan Pemegang Amanah saya untuk mengagihkan mana-mana harta saya kepada penerima manfaat mengikut cara yang dinyatakan, Pelaksana dan Pemegang Amanah saya hendaklah mempunyai kuasa untuk menjual dan menukar keseluruhan atau sebahagian daripada harta saya tanpa bertanggungjawab atas apa-apa kerugian yang timbul, dan hasilnya hendaklah dibahagikan kepada penerima manfaat yang berhak mengikut Surat Wasiat ini.
            </Text>
            <Text style={S.para}>
              (c) Pelaksana dan Pemegang Amanah saya tidak bertanggungjawab atas apa-apa kerugian yang timbul akibat tindakan yang dilakukan dengan niat baik dalam melaksanakan amanah di bawah Surat Wasiat ini, kecuali penipuan atau salah laku yang disengajakan.
            </Text>
            <Text style={S.para}>
              (d) Sekiranya mana-mana penerima manfaat meninggal dunia sebelum atau serentak dengan saya akibat bencana atau malapetaka yang sama, bahagian penerima manfaat tersebut hendaklah tertakluk kepada peruntukan Harta Baki dalam Artikel 5 Surat Wasiat ini.
            </Text>
            <Text style={S.para}>
              (e) Sekiranya mana-mana peruntukan Surat Wasiat ini didapati tidak boleh dikuatkuasakan atau tidak sah, peruntukan-peruntukan yang lain hendaklah terus berkuat kuasa sepenuhnya setakat yang dibenarkan oleh undang-undang Malaysia.
            </Text>
            <Text style={S.para}>
              (f) Perkataan yang membawa maksud jantina lelaki hendaklah termasuk jantina perempuan dan neutral, dan sebaliknya. Perkataan dalam bentuk tunggal hendaklah termasuk bentuk jamak, dan sebaliknya.
            </Text>
          </>
        ) : (
          <>
            <Text style={S.para}>
              (b) In the event that it is not practicable or possible for my Executor and Trustee to distribute any of my Assets to the beneficiary(s) in the manner set out herein, my Executor and Trustee shall have the power to sell and convert the whole or such part of my Assets without being liable for any loss arising therefrom, and shall divide the proceeds to the beneficiary(s) entitled under this Will in such sums as shall represent each beneficiary&apos;s respective entitlement.
            </Text>
            <Text style={S.para}>
              (c) My Executor and Trustee shall not be liable for any loss arising as a result of any act done in good faith in the discharge of the trusts under this Will, or by reason of any mistake or omission made in good faith, except for wilful fraud or wrongdoing.
            </Text>
            <Text style={S.para}>
              (d) In the event that any beneficiary dies before or simultaneously with me as a result of a common disaster or calamity, such beneficiary&apos;s share shall be subject to the Residual Estate provisions under Article 5 of this Will.
            </Text>
            <Text style={S.para}>
              (e) If any provision of this Will is held to be unenforceable or invalid, the remaining provisions shall remain in full force and effect to the fullest extent permissible under Malaysian law.
            </Text>
            <Text style={S.para}>
              (f) Words importing the masculine gender shall include the feminine and neuter genders and vice versa. Words in the singular shall include the plural and vice versa.
            </Text>
          </>
        )}

        {/* CLOSING ARTICLE */}
        <View wrap={false}>
          <Text style={S.articleTitle}>
            {ms
              ? `ARTIKEL ${closingArticleNo}: PENUTUP DAN PENGAKUAN`
              : `ARTICLE ${closingArticleNo}: CLOSING DECLARATION AND TESTIMONIUM`}
          </Text>
          <Text style={S.para}>
            {ms
              ? 'Surat Wasiat ini dibuat oleh saya dalam keadaan sedar, berfikiran waras, dan tanpa sebarang paksaan daripada mana-mana pihak pada tarikh yang dinyatakan di bawah. Saya memahami sepenuhnya kandungan dan implikasi undang-undang Surat Wasiat ini.'
              : 'This Will has been made by me while I am of sound mind, of full legal capacity, and free from undue influence from any party on the date stated below. I fully understand the contents and legal implications of this Will.'}
          </Text>
        </View>

        <Text style={S.para}>
          {ms
            ? 'Saya mengesahkan bahawa Surat Wasiat ini mencerminkan niat dan kehendak sebenar saya. Mana-mana wasiat, kodisil atau dokumen berkaitan yang dibuat sebelum ini adalah dengan ini dibatalkan sepenuhnya.'
            : 'I confirm that this Will reflects my true intentions and wishes. Any former will, codicil or testamentary document made by me is hereby wholly revoked.'}
        </Text>

        <Text style={S.para}>
          {ms
            ? 'Surat Wasiat ini hendaklah dikuatkuasakan dan ditafsirkan mengikut undang-undang Malaysia, khususnya Akta Wasiat 1959, Akta Pembahagian 1958 (pindaan 1997), dan mana-mana undang-undang lain yang berkaitan yang berkuat kuasa di Malaysia.'
            : 'This Will shall be enforced and construed in accordance with the laws of Malaysia, in particular the Wills Act 1959, the Distribution Act 1958 (amended 1997), and any other applicable Malaysian law in force at the time of execution.'}
        </Text>

        {/* Signature divider */}
        <View style={S.sigDivider} />

        <Text style={S.para}>
          <Text style={S.bold}>{ms ? 'Tarikh: ' : 'Date: '}</Text>
          {dc?.date ? fmt(dc.date) : '___________________________'}
        </Text>

        {/* Witnesses — Declaration by Testator */}
        <View style={{ marginTop: 8 }}>
          <Text style={[S.para, { fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 10 }]}>
            {ms ? 'PENGISYTIHARAN OLEH PEWASIAT' : 'DECLARATION BY TESTATOR'}
          </Text>
          {ms ? (
            <Text style={S.para}>
              DENGAN INI SAYA menandatangani nama saya pada Surat Wasiat ini pada tarikh yang dinyatakan di atas.
              Saya telah memaklumkan kepada saksi-saksi yang tersenarai di bawah bahawa ini adalah Surat Wasiat saya
              dan meminta mereka menjadi saksi.
            </Text>
          ) : (
            <Text style={S.para}>
              IN WITNESS WHEREOF I sign my name to this Will on the date stated above.
              I have told the persons listed below that this is my Will and asked them to be my witnesses.
            </Text>
          )}
        </View>

        <View style={S.sigSection}>
          <View style={S.sigLine} />
          <Text style={S.sigName}>{ms ? 'Tandatangan Pewasiat' : 'Testator Signature'}</Text>
          <Text style={[S.sigDotLine, { marginTop: 8 }]}>
            {ms ? 'Nama: ' : 'Name: '}
            <Text style={S.bold}>{(dc?.signature_name || t.full_name).toUpperCase()}</Text>
          </Text>
          <Text style={S.sigDotLine}>
            {ms ? 'No. K/P: ' : 'IC No.: '}
            <Text style={S.bold}>{t.ic_number}</Text>
          </Text>
        </View>

        {/* Witnesses — Declaration by Witnesses */}
        <View style={{ marginTop: 16 }}>
          <Text style={[S.para, { fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 8 }]}>
            {ms ? 'PENGISYTIHARAN OLEH SAKSI-SAKSI' : 'DECLARATION BY WITNESSES'}
          </Text>
          {ms ? (
            <Text style={S.para}>
              Kami memahami bahawa ini adalah Surat Wasiat Pewasiat. Pewasiat menandatangani Surat Wasiat ini di hadapan kami,
              semua kami hadir pada masa yang sama. Kami percaya Pewasiat berumur lebih 18 tahun, sihat akal, dan setakat
              pengetahuan kami, Surat Wasiat ini tidak diperoleh melalui paksaan, ugutan, penipuan atau pengaruh yang tidak
              wajar. Setiap daripada kami berumur lebih 18 tahun dan merupakan saksi yang layak.
            </Text>
          ) : (
            <Text style={S.para}>
              We understand that this is the Testator&apos;s Will. The Testator signed this Will in our presence, all of us being
              present at the same time. We believe the Testator is above 18 years old, is of sound mind and memory, and to
              the best of our knowledge, this Will was not procured by duress, menace, fraud or undue influence. Each of us
              is above 18 years old and is a competent witness.
            </Text>
          )}
        </View>

        <View style={S.sigGrid}>
          <View style={S.sigCol}>
            <Text style={[S.para, { fontFamily: 'Helvetica-Bold', marginBottom: 8 }]}>
              {ms ? 'SAKSI PERTAMA:' : 'FIRST WITNESS:'}
            </Text>
            <View style={S.sigLine} />
            <Text style={S.sigName}>{ms ? 'Tandatangan' : 'Signature'}</Text>
            <Text style={[S.sigDotLine, { marginTop: 10 }]}>
              {ms ? 'Nama: ' : 'Name: '}
              <Text style={S.bold}>
                {wt?.witness_1.full_name ? wt.witness_1.full_name.toUpperCase() : '______________________'}
              </Text>
            </Text>
            <Text style={S.sigDotLine}>
              {ms ? 'No. K/P: ' : 'IC No.: '}
              {wt?.witness_1.ic_number || '______________________'}
            </Text>
            {wt?.witness_1.phone && (
              <Text style={S.sigDotLine}>{ms ? 'Tel: ' : 'Phone: '}{wt.witness_1.phone}</Text>
            )}
            {wt?.witness_1.email && (
              <Text style={S.sigDotLine}>{ms ? 'E-mel: ' : 'Email: '}{wt.witness_1.email}</Text>
            )}
            <Text style={S.sigDotLine}>
              {ms ? 'Alamat: ' : 'Address: '}
              {wt?.witness_1.address || '______________________'}
            </Text>
          </View>
          <View style={S.sigCol}>
            <Text style={[S.para, { fontFamily: 'Helvetica-Bold', marginBottom: 8 }]}>
              {ms ? 'SAKSI KEDUA:' : 'SECOND WITNESS:'}
            </Text>
            <View style={S.sigLine} />
            <Text style={S.sigName}>{ms ? 'Tandatangan' : 'Signature'}</Text>
            <Text style={[S.sigDotLine, { marginTop: 10 }]}>
              {ms ? 'Nama: ' : 'Name: '}
              <Text style={S.bold}>
                {wt?.witness_2.full_name ? wt.witness_2.full_name.toUpperCase() : '______________________'}
              </Text>
            </Text>
            <Text style={S.sigDotLine}>
              {ms ? 'No. K/P: ' : 'IC No.: '}
              {wt?.witness_2.ic_number || '______________________'}
            </Text>
            {wt?.witness_2.phone && (
              <Text style={S.sigDotLine}>{ms ? 'Tel: ' : 'Phone: '}{wt.witness_2.phone}</Text>
            )}
            {wt?.witness_2.email && (
              <Text style={S.sigDotLine}>{ms ? 'E-mel: ' : 'Email: '}{wt.witness_2.email}</Text>
            )}
            <Text style={S.sigDotLine}>
              {ms ? 'Alamat: ' : 'Address: '}
              {wt?.witness_2.address || '______________________'}
            </Text>
          </View>
        </View>

        <Text style={S.closingLine}>
          {ms ? '— TAMAT SURAT WASIAT AM —' : '— END OF LAST WILL AND TESTAMENT —'}
        </Text>
      </Page>

      {/* ═══════════════════════════════════════════════
          APPENDIX A — ASSET SCHEDULE (conditional)
      ═══════════════════════════════════════════════ */}
      {hasSchedule && (
        <Page size="A4" style={S.page}>
          <Text style={S.scheduleTitle}>
            {ms ? 'LAMPIRAN A' : 'APPENDIX A'}
          </Text>
          <Text style={S.scheduleSub}>
            {ms ? 'JADUAL HARTA' : 'ASSET SCHEDULE'}
          </Text>
          <Text style={[S.scheduleSub, { marginBottom: 4 }]}>
            {ms ? 'Rujukan' : 'Ref'}: {t.full_name} | {docRef}
          </Text>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 12 }} />

          <Text style={[S.para, { fontSize: 9.5 }]}>
            {ms
              ? `Jadual ini adalah sebahagian daripada Surat Wasiat Am bertarikh ${dc?.date ? fmt(dc.date) : '___'} dan hendaklah dibaca bersama dokumen wasiat tersebut.`
              : `This Schedule forms part of the Last Will dated ${dc?.date ? fmt(dc.date) : '___'} and shall be read together with that Will.`}
          </Text>

          {as!.categories!.map((cat: WillAssetCategory, ci: number) => {
            const label    = CATEGORY_LABELS[cat.category] ?? cat.note ?? cat.category
            const totalVal = cat.items.reduce((s, i) => s + (i.amount || 0), 0)
            return (
              <View key={ci} style={S.sectionBox}>
                <View style={S.sectionHdr}>
                  <Text style={S.sectionHdrText}>
                    {label}{totalVal > 0 ? `  —  ${currency(totalVal)}` : ''}
                  </Text>
                </View>
                {cat.items.map((item, ii) => (
                  <View key={ii} style={S.itemBox}>
                    <Text style={S.itemTitle}>{item.type}</Text>
                    {item.details ? <Text style={S.itemDetail}>{item.details}</Text> : null}
                    {item.amount > 0 && (
                      <Text style={S.itemValue}>
                        {ms ? 'Anggaran nilai' : 'Est. value'}: {currency(item.amount)}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )
          })}

          {/* Total */}
          {(() => {
            const grand = as!.categories!.reduce((s, c) =>
              s + c.items.reduce((ss, i) => ss + (i.amount || 0), 0), 0)
            return grand > 0 ? (
              <View style={[S.infoBox, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <Text style={{ fontSize: 10.5, fontFamily: 'Helvetica-Bold' }}>
                  {ms ? 'Jumlah Anggaran:' : 'Total Estimated Value:'}
                </Text>
                <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold' }}>{currency(grand)}</Text>
              </View>
            ) : null
          })()}

          <View style={{ marginTop: 20 }}>
            <Text style={S.para}>
              {ms ? 'Disahkan oleh Pewasiat:' : 'Confirmed by Testator:'}
            </Text>
            <View style={{ borderBottomWidth: 0.75, borderBottomColor: '#555', width: 220, marginTop: 20, marginBottom: 4 }} />
            <Text style={S.sigName}>
              {t.full_name.toUpperCase()} | {ms ? 'No. K/P: ' : 'IC: '}{t.ic_number}
            </Text>
          </View>
        </Page>
      )}

      {/* ═══════════════════════════════════════════════
          DISCLAIMER PAGE (separate, last)
      ═══════════════════════════════════════════════ */}
      <Page size="A4" style={[S.page, { paddingTop: 120 }]}>
        <View style={{ maxWidth: 380, alignSelf: 'center' }}>
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#444', marginBottom: 16, textAlign: 'center', letterSpacing: 1 }}>
            {ms ? 'ASAS PERUNDANGAN & PENAFIAN' : 'LEGAL BASIS & DISCLAIMER'}
          </Text>
          <View style={{ borderTopWidth: 1, borderTopColor: '#ccc', marginBottom: 20 }} />
          <Text style={{ fontSize: 9.5, color: '#555', lineHeight: 1.75, textAlign: 'justify', marginBottom: 16 }}>
            {ms
              ? 'Surat Wasiat Am ini disediakan di bawah Akta Wasiat 1959 Malaysia. Ia adalah sah dan berkuat kuasa apabila ditandatangani oleh pewasiat di hadapan dua orang saksi yang hadir secara serentak, dan kedua-dua saksi menandatangani di hadapan pewasiat. Saksi tidak boleh merupakan penerima manfaat atau pasangan penerima manfaat di bawah Surat Wasiat ini.'
              : 'This General Will is prepared under the Wills Act 1959 (Malaysia). It is valid and enforceable when signed by the testator in the presence of two witnesses present at the same time, who also sign in the presence of the testator. Witnesses must not be beneficiaries or spouses of beneficiaries under this Will.'}
          </Text>
          <Text style={{ fontSize: 9.5, color: '#555', lineHeight: 1.75, textAlign: 'justify', marginBottom: 16 }}>
            {ms
              ? 'Dokumen ini tidak menggantikan nasihat guaman profesional. Pewasiat digalakkan untuk mendapatkan khidmat peguam bertauliah untuk mengesahkan kesahihan dan keberkesanan Surat Wasiat ini mengikut keadaan peribadi masing-masing.'
              : 'This document does not substitute professional legal advice. The testator is encouraged to consult a qualified lawyer to confirm the validity and effectiveness of this Will according to their individual circumstances.'}
          </Text>
          <Text style={{ fontSize: 9.5, color: '#555', lineHeight: 1.75, textAlign: 'justify', marginBottom: 24 }}>
            {ms
              ? 'WasiatHub bertindak sebagai platform penyediaan dokumen sahaja dan tidak bertanggungjawab ke atas sebarang pertikaian undang-undang yang timbul daripada penggunaan dokumen ini.'
              : 'WasiatHub acts solely as a document preparation platform and bears no responsibility for any legal disputes arising from the use of this document.'}
          </Text>
          <View style={{ borderTopWidth: 0.5, borderTopColor: '#ccc', paddingTop: 12 }}>
            <Text style={{ fontSize: 8.5, color: '#aaa', textAlign: 'center', fontStyle: 'italic' }}>
              {ms
                ? `Dijana oleh WasiatHub pada ${fmt(generatedAt)} | Rujukan: ${docRef}`
                : `Generated by WasiatHub on ${fmt(generatedAt)} | Ref: ${docRef}`}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
