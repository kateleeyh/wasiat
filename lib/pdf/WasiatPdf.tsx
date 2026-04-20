import React from 'react'
import {
  Document, Page, View, Text, StyleSheet,
} from '@react-pdf/renderer'
import type { WasiatRecord } from '@/types/database'

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    fontFamily:    'Helvetica',
    fontSize:       10.5,
    color:          '#1a1a1a',
    paddingTop:     56,
    paddingBottom:  60,
    paddingLeft:    72,
    paddingRight:   72,
    lineHeight:     1.65,
  },

  // ── Cover page ──
  coverPage: {
    fontFamily:   'Helvetica',
    color:        '#1a1a1a',
    paddingTop:   140,
    paddingBottom: 60,
    paddingLeft:   72,
    paddingRight:  72,
    alignItems:   'center',
  },
  coverLabel:    { fontSize: 13, fontFamily: 'Helvetica-Bold', letterSpacing: 2, marginBottom: 16 },
  coverName:     { fontSize: 26, fontFamily: 'Helvetica-Bold', letterSpacing: 1, marginBottom: 20 },
  coverMeta:     { fontSize: 10, color: '#555', marginBottom: 6 },
  coverLine:     { width: 120, height: 1, backgroundColor: '#ccc', marginVertical: 24 },

  // ── Page header (non-cover) ──
  pageHeader:       { textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 10, marginBottom: 18 },
  pageHeaderTitle:  { fontSize: 14, fontFamily: 'Helvetica-Bold', letterSpacing: 2 },
  pageHeaderSub:    { fontSize: 9, fontStyle: 'italic', color: '#555', marginTop: 3 },

  // ── Article ──
  articleTitle:  { fontSize: 10.5, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5, marginBottom: 8, marginTop: 20 },
  para:          { fontSize: 10.5, lineHeight: 1.75, textAlign: 'justify', marginBottom: 8 },
  bold:          { fontFamily: 'Helvetica-Bold' },

  // ── Quran / Hadis quote ──
  quote: {
    borderLeftWidth: 3, borderLeftColor: '#aaa',
    paddingLeft: 10, marginVertical: 8,
    fontStyle: 'italic', fontSize: 10, color: '#444', lineHeight: 1.7,
  },
  quoteSource: { fontSize: 8.5, color: '#888', marginTop: 2, fontStyle: 'italic' },

  // ── Bullet list ──
  bullet:     { flexDirection: 'row', marginBottom: 4 },
  bulletDot:  { width: 16, fontSize: 10.5 },
  bulletText: { flex: 1, fontSize: 10.5, lineHeight: 1.7, textAlign: 'justify' },

  // ── Beneficiary entry ──
  beneItem:   { marginBottom: 8, paddingLeft: 12 },
  beneName:   { fontSize: 10.5, fontFamily: 'Helvetica-Bold' },
  beneSub:    { fontSize: 9.5, color: '#444', lineHeight: 1.6 },

  // ── Signature section ──
  sigDivider: { borderTopWidth: 1, borderTopColor: '#555', marginVertical: 20 },
  sigSection: { marginBottom: 16 },
  sigLabel:   { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginBottom: 10 },
  sigGrid:    { flexDirection: 'row', gap: 40 },
  sigCol:     { flex: 1 },
  sigLine:    { borderBottomWidth: 0.75, borderBottomColor: '#555', marginBottom: 4, marginTop: 24, width: '100%' },
  sigName:    { fontSize: 9.5, color: '#555' },
  sigDotLine: { fontSize: 10, color: '#333', marginBottom: 3 },
  closingLine: { textAlign: 'center', fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginTop: 24 },

  // ── Lampiran A ──
  lampiranTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 4 },
  lampiranSub:   { fontSize: 10, textAlign: 'center', color: '#555', marginBottom: 4 },
  lampiranIntro: { fontSize: 10, lineHeight: 1.7, marginBottom: 16, textAlign: 'justify' },
  sectionBox:    { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 16 },
  sectionBoxHdr: { backgroundColor: '#f0f0f0', paddingVertical: 6, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#ccc', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  sectionBoxHdrText: { fontSize: 10.5, fontFamily: 'Helvetica-Bold' },
  itemBox:       { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 4, margin: 10, padding: 10 },
  itemTitle:     { fontSize: 10.5, fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  itemDetail:    { fontSize: 9.5, color: '#333', marginBottom: 1 },
  itemValue:     { fontSize: 9.5, color: '#666', marginTop: 4 },

  // ── Footer ──
  footer:      { position: 'absolute', bottom: 28, left: 72, right: 72, borderTopWidth: 0.5, borderTopColor: '#ccc', paddingTop: 5, flexDirection: 'row', justifyContent: 'space-between' },
  footerText:  { fontSize: 7.5, color: '#999' },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })
}

function currency(n: number) {
  return `RM ${n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={S.bullet}>
      <Text style={S.bulletDot}>•</Text>
      <Text style={S.bulletText}>{text}</Text>
    </View>
  )
}

function Footer({ docRef }: { docRef: string }) {
  return (
    <View style={S.footer} fixed>
      <Text style={S.footerText}>WasiatHub | {docRef}</Text>
      <Text style={S.footerText} render={({ pageNumber, totalPages }) =>
        `Muka Surat ${pageNumber} / ${totalPages}`
      } />
    </View>
  )
}

// ─── Main PDF Document ────────────────────────────────────────────────────────

interface Props {
  data:        WasiatRecord
  docRef:      string
  generatedAt: string
}

export function WasiatPdf({ data, docRef, generatedAt }: Props) {
  const t  = data.testator_info!
  const mv = data.movable_assets
  const im = data.immovable_assets
  const bn = data.beneficiaries ?? []
  const ex = data.executor
  const bk = data.backup_executor
  const wt = data.witnesses
  const dc = data.declaration

  const hasLampiranA =
    (mv?.mode === 'itemised' && (mv.items?.length ?? 0) > 0) ||
    (im?.mode === 'itemised' && (im.items?.length ?? 0) > 0)

  const maritalMs: Record<string, string> = {
    single: 'Bujang', married: 'Berkahwin', widowed: 'Balu / Duda', divorced: 'Bercerai',
  }

  return (
    <Document
      title={`Wasiat Rasmi — ${t.full_name}`}
      author="WasiatHub"
      subject="Dokumen Wasiat Islam"
    >

      {/* ═══════════════════════════════════════════════
          COVER PAGE
      ═══════════════════════════════════════════════ */}
      <Page size="A4" style={S.coverPage}>
        <Text style={S.coverLabel}>WASIAT RASMI</Text>
        <Text style={S.coverName}>{t.full_name.toUpperCase()}</Text>
        <Text style={S.coverMeta}>No. Kad Pengenalan: {t.ic_number}</Text>
        <View style={S.coverLine} />
        <Text style={S.coverMeta}>Tarikh Penjanaan: {fmtDate(generatedAt)}</Text>
        <Text style={[S.coverMeta, { marginTop: 4 }]}>No. Rujukan: {docRef}</Text>
        <Text style={[S.coverMeta, { marginTop: 40, fontSize: 8, color: '#aaa' }]}>
          Dokumen ini dijana oleh WasiatHub. Sah apabila ditandatangani di hadapan dua orang saksi.
        </Text>
      </Page>

      {/* ═══════════════════════════════════════════════
          MAIN DOCUMENT
      ═══════════════════════════════════════════════ */}
      <Page size="A4" style={S.page}>
        <Footer docRef={docRef} />

        {/* Header */}
        <View style={S.pageHeader}>
          <Text style={S.pageHeaderTitle}>WASIAT RASMI</Text>
          <Text style={S.pageHeaderSub}>Dengan Nama Allah Yang Maha Pemurah Lagi Maha Penyayang</Text>
        </View>

        {/* MUKADIMAH */}
        <Text style={S.articleTitle}>MUKADIMAH</Text>

        <Text style={S.para}>
          Segala puji bagi Allah SWT, Tuhan sekalian alam. Selawat dan salam ke atas junjungan
          besar Nabi Muhammad SAW, keluarga baginda, para sahabat, serta seluruh umat Islam yang
          mengikuti sunnahnya hingga ke hari kiamat.
        </Text>

        <Text style={S.para}>
          Saya, <Text style={S.bold}>{t.full_name.toUpperCase()}</Text>, No. Kad Pengenalan{' '}
          <Text style={S.bold}>{t.ic_number}</Text>, yang beralamat di{' '}
          <Text style={S.bold}>{t.address}</Text>, dengan penuh kesedaran, keinsafan, dan tanpa
          sebarang paksaan daripada mana-mana pihak, dengan ini menyatakan bahawa dokumen ini
          adalah <Text style={S.bold}>Wasiat Terakhir</Text> saya yang sah menurut hukum Syariah
          dan undang-undang yang berkuat kuasa di Malaysia.
        </Text>

        <Text style={S.para}>
          Saya mengisytiharkan bahawa wasiat ini menggantikan semua wasiat terdahulu saya (jika
          ada), dan akan menjadi panduan utama bagi pelaksanaan harta pusaka saya kelak.
        </Text>

        {/* ARTIKEL 1: PELANTIKAN WASI */}
        <Text style={S.articleTitle}>ARTIKEL 1: PELANTIKAN WASI – AMANAH YANG DIPERTANGGUNGJAWABKAN</Text>

        {ex ? (
          <>
            <Text style={S.para}>
              Saya dengan ini melantik <Text style={S.bold}>{ex.full_name.toUpperCase()}</Text>{' '}
              (No. K/P: {ex.ic_number}) ({ex.relationship}) sebagai wasi utama yang
              bertanggungjawab menguruskan harta pusaka saya, menyelesaikan hutang dan amanah,
              serta melaksanakan segala arahan yang dinyatakan dalam wasiat ini selepas kematian saya.
            </Text>
            {bk ? (
              <Text style={S.para}>
                Sekiranya wasi utama meninggal dunia, enggan, tidak layak, atau tidak dapat
                menjalankan amanah ini, maka wasi ganti yang dilantik ialah{' '}
                <Text style={S.bold}>{bk.full_name.toUpperCase()}</Text>{' '}
                (No. K/P: {bk.ic_number}) ({bk.relationship}) untuk mengambil alih dan
                melaksanakan amanah yang sama menurut wasiat ini.
              </Text>
            ) : (
              <Text style={S.para}>
                Sekiranya wasi utama meninggal dunia, enggan, tidak layak, atau tidak dapat
                menjalankan amanah ini, maka pelaksanaan wasiat ini hendaklah diserahkan kepada
                waris yang paling hampir atau pihak yang dilantik oleh mahkamah yang berbidangkuasa.
              </Text>
            )}
          </>
        ) : (
          <Text style={[S.para, { color: '#888' }]}>— Wasi belum dilantik —</Text>
        )}

        <Text style={S.para}>
          Pelantikan ini dibuat atas dasar <Text style={S.bold}>kepercayaan dan amanah</Text>,
          sebagaimana prinsip yang ditegaskan dalam firman Allah SWT:
        </Text>

        <View style={S.quote}>
          <Text>"Sesungguhnya Allah menyuruh kamu menyampaikan amanah kepada yang berhak menerimanya."</Text>
          <Text style={S.quoteSource}>(Surah An-Nisa', ayat 58)</Text>
        </View>

        <Text style={S.para}>
          Saya memberikan kuasa kepada wasi yang dilantik untuk mengambil langkah-langkah yang
          perlu dan munasabah bagi memastikan urusan pentadbiran harta pusaka saya dapat
          dilaksanakan dengan teratur, termasuk penyelesaian hutang, kos pengurusan jenazah, dan
          pelaksanaan peruntukan yang dinyatakan dalam wasiat ini.
        </Text>

        <Text style={S.para}>Walau bagaimanapun, segala tindakan wasi hendaklah:</Text>
        <Bullet text={'Dilaksanakan dengan adil, jujur dan berhemah'} />
        <Bullet text={'Tidak bercanggah dengan hukum Syarak'} />
        <Bullet text={'Tidak menafikan hak waris-waris yang berhak di bawah hukum Faraid, kecuali setakat yang dibenarkan secara sah melalui peruntukan wasiat ini'} />

        {/* ARTIKEL 2: HUTANG */}
        <Text style={S.articleTitle}>ARTIKEL 2: PENYELESAIAN HUTANG, AMANAH & KEWAJIPAN</Text>

        <Text style={S.para}>
          Saya dengan ini menegaskan bahawa segala hutang, liabiliti, amanah, kewajipan agama dan
          apa-apa tanggungan yang sah ke atas diri saya hendaklah dikenal pasti dan diselesaikan
          terlebih dahulu sebelum sebarang pembahagian harta pusaka dibuat kepada mana-mana pihak.
        </Text>

        <Text style={S.para}>
          Tanggungjawab ini meliputi, antara lain, hutang kepada institusi kewangan, hutang
          peribadi, tunggakan zakat, fidyah, nazar, kaffarah, amanah yang masih belum dipulangkan,
          serta apa-apa kewajipan lain yang diiktiraf oleh hukum Syarak dan undang-undang yang
          berkuat kuasa di Malaysia.
        </Text>

        <View style={S.quote}>
          <Text>"Roh seseorang mukmin tergantung disebabkan hutangnya hingga hutangnya dilunasi."</Text>
          <Text style={S.quoteSource}>(Riwayat Tirmizi)</Text>
        </View>

        {/* ARTIKEL 3: HARTA */}
        <Text style={S.articleTitle}>ARTIKEL 3: SENARAI HARTA & RUJUKAN LAMPIRAN</Text>

        {mv?.mode === 'general' ? (
          // Pernyataan Am — single paragraph covering ALL assets
          <Text style={S.para}>
            {mv.general_note ??
              'Saya mengisytiharkan bahawa semua harta yang saya miliki pada tarikh kematian saya hendaklah ditadbir, diurus dan diagihkan oleh wasi mengikut ketetapan dalam wasiat ini serta selaras dengan hukum Syariah dan undang-undang yang berkuat kuasa di Malaysia.'}
          </Text>
        ) : (
          // Lampiran A — reference each section separately
          <>
            {mv?.mode === 'itemised' && (mv.items?.length ?? 0) > 0 && (
              <Text style={S.para}>
                Senarai <Text style={S.bold}>Harta Alih</Text> saya adalah seperti yang dinyatakan
                dalam <Text style={S.bold}>Lampiran A – Bahagian I</Text> yang dilampirkan bersama
                dokumen ini.
              </Text>
            )}
            {im?.mode === 'itemised' && (im.items?.length ?? 0) > 0 && (
              <Text style={S.para}>
                Senarai <Text style={S.bold}>Harta Tak Alih</Text> saya adalah seperti yang
                dinyatakan dalam <Text style={S.bold}>Lampiran A – Bahagian II</Text> yang
                dilampirkan bersama dokumen ini.
              </Text>
            )}
            <Text style={S.para}>
              Lampiran tersebut hendaklah menjadi rujukan rasmi kepada wasi dalam mengenal pasti,
              mengurus dan mentadbir harta pusaka saya selepas kematian saya.
            </Text>
          </>
        )}

        <Text style={S.para}>
          Sekiranya terdapat mana-mana harta lain yang tidak sempat dinyatakan atau diperoleh
          kemudian, harta tersebut tetap hendaklah dianggap sebagai sebahagian daripada harta
          pusaka saya dan ditadbir menurut hukum Syarak dan undang-undang yang berkuat kuasa
          di Malaysia.
        </Text>

        {/* ARTIKEL 4: AGIHAN HARTA */}
        <Text style={S.articleTitle}>ARTIKEL 4: AGIHAN HARTA MENGIKUT WASIAT & FARAID</Text>

        <Text style={S.para}>
          Selepas diselesaikan segala hutang, kos pengurusan jenazah, amanah, kewajipan agama dan
          apa-apa tanggungan lain yang sah, maka baki bersih harta pusaka saya hendaklah ditadbir
          dan diagihkan menurut ketetapan hukum Faraid kepada waris-waris yang berhak. Bahagian
          Faraid tersebut adalah hak waris yang wajib dipelihara.
        </Text>

        <Text style={S.para}>
          Daripada baki bersih harta pusaka tersebut, saya menggunakan hak wasiat saya untuk
          memperuntukkan sehingga satu pertiga (1/3) kepada penerima-penerima yang dinamakan di
          bawah, tertakluk kepada had dan syarat yang dibenarkan oleh hukum Syarak.
        </Text>

        {bn.length > 0 ? (
          <>
            <Text style={S.para}>
              Dengan ini, saya memperuntukkan bahagian satu pertiga (1/3) tersebut kepada
              pihak-pihak berikut:
            </Text>

            {bn.map((b, i) => (
              <View key={i} style={S.beneItem}>
                <Text style={S.para}>
                  {`\u2022  `}
                  <Text style={S.bold}>{b.full_name.toUpperCase()}</Text>
                  {` (No. K/P: ${b.ic_number}) – ${b.relationship}`}
                </Text>
                <Text style={S.beneSub}>
                  {b.assignment_type === 'percentage'
                    ? `${b.percentage}% daripada bahagian 1/3 harta saya.`
                    : `Harta khusus yang diwasiatkan: ${b.specific_asset}`}
                </Text>
              </View>
            ))}

            <Text style={S.para}>
              Sekiranya mana-mana penerima yang dinamakan bagi bahagian 1/3 ini meninggal dunia
              terlebih dahulu daripada saya, menolak peruntukan tersebut, atau tidak dapat
              dikenal pasti secara sah ketika pelaksanaan dibuat, maka bahagian berkenaan
              hendaklah terbatal dan kembali menjadi sebahagian daripada baki harta pusaka saya.
            </Text>

            <Text style={S.para}>
              Selepas pelaksanaan peruntukan wasiat yang sah tersebut, baki selebihnya hendaklah
              diagihkan kepada waris-waris yang berhak mengikut hukum Faraid.
            </Text>
          </>
        ) : (
          <Text style={[S.para, { color: '#888' }]}>— Tiada penerima manfaat dinyatakan —</Text>
        )}

        {/* ARTIKEL 5: ARAHAN KHAS */}
        <Text style={S.articleTitle}>ARTIKEL 5: ARAHAN KHAS, PESANAN & HASRAT PERIBADI</Text>

        {dc?.personal_wishes ? (
          <Text style={S.para}>{dc.personal_wishes}</Text>
        ) : (
          <>
            <Text style={S.para}>
              Saya mengarahkan supaya pengurusan jenazah saya dilaksanakan secara ringkas, patuh
              sunnah dan mengelakkan sebarang pembaziran yang bercanggah dengan Syariah. Saya memohon
              kepada Allah SWT agar mengampunkan dosa-dosa saya, kedua ibu bapa saya, ahli keluarga
              saya dan seluruh umat Islam, dan saya berpesan agar mereka sentiasa mendoakan saya
              selepas pemergian saya.
            </Text>
            <Text style={S.para}>
              Saya berharap agar hubungan silaturrahim sesama ahli keluarga dan sanak saudara sentiasa
              dipelihara, dan sebarang perselisihan yang timbul hendaklah diselesaikan dengan penuh
              hikmah dan kasih sayang. Saya berharap agar waris-waris saya hidup dalam suasana kasih
              sayang, saling menghormati, bertolak ansur, dan sentiasa menjaga nama baik keluarga
              serta meneruskan amalan sedekah dan kebaikan bagi pihak saya.
            </Text>
          </>
        )}

        {/* ARTIKEL 6: PENUTUP */}
        <Text style={S.articleTitle}>ARTIKEL 6: PENUTUP & PENGAKUAN – PENEGASAN NIAT PERWASIAT</Text>

        <Text style={S.para}>
          Wasiat ini dibuat oleh saya dalam keadaan{' '}
          <Text style={S.bold}>sedar, berakal sempurna, dan tanpa sebarang paksaan</Text>{' '}
          daripada mana-mana pihak. Saya memahami sepenuhnya kandungan wasiat ini serta
          implikasinya menurut hukum Syariah dan undang-undang yang berkuat kuasa di Malaysia.
        </Text>

        <Text style={S.para}>
          Saya mengesahkan bahawa wasiat ini mencerminkan{' '}
          <Text style={S.bold}>niat dan kehendak sebenar saya</Text>, dan hendaklah dijadikan
          panduan utama dalam pengurusan serta pembahagian harta pusaka saya setelah kematian saya.
        </Text>

        <Text style={S.para}>
          Saya berharap agar semua waris dan pihak yang berkaitan dapat menerima dan menghormati
          wasiat ini dengan penuh kefahaman, serta menyelesaikan segala urusan pusaka saya secara
          harmoni, adil dan berlandaskan ajaran Islam.
        </Text>

        <Text style={S.para}>
          Akhir kata, saya memohon ke hadrat Allah SWT agar segala perancangan yang terkandung
          dalam wasiat ini dipermudahkan pelaksanaannya, diampunkan dosa-dosa saya, serta
          dijadikan wasiat ini sebagai salah satu bentuk amal kebajikan yang memberi manfaat
          selepas pemergian saya.
        </Text>

        <View style={S.quote}>
          <Text>
            "Apabila seseorang anak Adam meninggal dunia, terputuslah amalannya kecuali tiga
            perkara: sedekah jariah, ilmu yang bermanfaat, dan anak soleh yang mendoakannya."
          </Text>
          <Text style={S.quoteSource}>(Hadis Riwayat Muslim)</Text>
        </View>

        {/* Signature section */}
        <View style={S.sigDivider} />

        <View style={S.sigSection}>
          <Text style={S.sigLabel}>TARIKH DAN SAKSI</Text>

          <Text style={S.para}>
            <Text style={S.bold}>Tarikh:</Text> {dc?.date ? fmtDate(dc.date) : '___________________________'}
          </Text>

          <View style={{ marginTop: 16 }}>
            <View style={S.sigLine} />
            <Text style={S.sigName}>Tandatangan Pewasiat</Text>
            <Text style={[S.sigDotLine, { marginTop: 8 }]}>
              {'Nama: '}
              <Text style={S.bold}>{t.full_name.toUpperCase()}</Text>
            </Text>
            <Text style={S.sigDotLine}>No. K/P: <Text style={S.bold}>{t.ic_number}</Text></Text>
          </View>
        </View>

        {/* Witnesses */}
        <View style={{ marginTop: 8 }}>
          <Text style={S.para}>
            KAMI DENGAN INI MENGESAHKAN bahawa wasiat ini telah pada tarikh di sini
            ditandatangani, dibuat dan diisytiharkan oleh Pewasiat{' '}
            <Text style={S.bold}>{t.full_name}</Text> (No. K/P: {t.ic_number}) sebagai wasiat
            terakhirnya, dihadapan kami dan dengan kehadiran kami atas permintaan beliau dan
            dengan kehadiran satu sama lain dan telah menurunkan nama kami sebagai saksi di sini
            dan penuh kepercayaan bahawa Pewasiat pada masa wasiat ini ditandatangani dalam
            keadaan waras.
          </Text>
        </View>

        <View style={S.sigGrid}>
          {/* Witness 1 */}
          <View style={S.sigCol}>
            <Text style={[S.para, { fontFamily: 'Helvetica-Bold', marginBottom: 8 }]}>SAKSI 1:</Text>
            <View style={S.sigLine} />
            <Text style={S.sigName}>Tandatangan Saksi 1</Text>
            <Text style={[S.sigDotLine, { marginTop: 10 }]}>
              {'Nama: '}
              <Text style={S.bold}>{wt?.witness_1.full_name ? wt.witness_1.full_name.toUpperCase() : '______________________'}</Text>
            </Text>
            <Text style={S.sigDotLine}>{'No. IC: ' + (wt?.witness_1.ic_number || '______________________')}</Text>
          </View>
          {/* Witness 2 */}
          <View style={S.sigCol}>
            <Text style={[S.para, { fontFamily: 'Helvetica-Bold', marginBottom: 8 }]}>SAKSI 2:</Text>
            <View style={S.sigLine} />
            <Text style={S.sigName}>Tandatangan Saksi 2</Text>
            <Text style={[S.sigDotLine, { marginTop: 10 }]}>
              {'Nama: '}
              <Text style={S.bold}>{wt?.witness_2.full_name ? wt.witness_2.full_name.toUpperCase() : '______________________'}</Text>
            </Text>
            <Text style={S.sigDotLine}>{'No. IC: ' + (wt?.witness_2.ic_number || '______________________')}</Text>
          </View>
        </View>

        {/* Witness 3 — only if present (1 male + 2 female combination) */}
        {wt?.witness_3 && (
          <View style={[S.sigGrid, { marginTop: 16 }]}>
            <View style={S.sigCol}>
              <Text style={[S.para, { fontFamily: 'Helvetica-Bold', marginBottom: 8 }]}>SAKSI 3:</Text>
              <View style={S.sigLine} />
              <Text style={S.sigName}>Tandatangan Saksi 3</Text>
              <Text style={[S.sigDotLine, { marginTop: 10 }]}>
                {'Nama: '}
                <Text style={S.bold}>{wt.witness_3.full_name.toUpperCase()}</Text>
              </Text>
              <Text style={S.sigDotLine}>{'No. IC: ' + wt.witness_3.ic_number}</Text>
            </View>
            <View style={S.sigCol} />
          </View>
        )}

        <Text style={S.closingLine}>— TAMAT DOKUMEN WASIAT RASMI —</Text>

        {/* Legal basis & disclaimer */}
        <View style={{ marginTop: 28, borderTopWidth: 0.5, borderTopColor: '#ccc', paddingTop: 12 }}>
          <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: '#444', marginBottom: 4 }}>
            ASAS PERUNDANGAN & PENAFIAN
          </Text>
          <Text style={{ fontSize: 8, color: '#666', lineHeight: 1.6, textAlign: 'justify' }}>
            Dokumen Wasiat ini disediakan berdasarkan prinsip-prinsip Fiqh Muamalat mazhab
            Syafi'i yang diterima pakai secara universal di Malaysia dan disokong oleh
            peruntukan Undang-Undang Keluarga Islam yang berkuat kuasa di negeri-negeri Malaysia.
            Struktur, format dan kandungan dokumen ini adalah selaras dengan amalan peguam-peguam
            Syarie dan badan-badan agama Islam di seluruh Malaysia.
          </Text>
          <Text style={{ fontSize: 8, color: '#666', lineHeight: 1.6, textAlign: 'justify', marginTop: 4 }}>
            Untuk pendaftaran, sila hubungi Jabatan Agama Islam negeri anda memandangkan
            prosedur pendaftaran berbeza mengikut negeri. Dokumen ini sah apabila ditandatangani
            di hadapan saksi-saksi yang memenuhi syarat yang ditetapkan.
          </Text>
          <Text style={{ fontSize: 8, color: '#888', lineHeight: 1.6, marginTop: 4, fontStyle: 'italic' }}>
            WasiatHub tidak memberikan nasihat guaman. Sila rujuk Peguam Syarie yang bertauliah
            jika anda memerlukan panduan undang-undang khusus berkaitan wasiat anda.
          </Text>
        </View>

      </Page>

      {/* ═══════════════════════════════════════════════
          LAMPIRAN A (conditional)
      ═══════════════════════════════════════════════ */}
      {hasLampiranA && (
        <Page size="A4" style={S.page}>
          <Footer docRef={docRef} />

          <Text style={S.lampiranTitle}>LAMPIRAN A – SENARAI HARTA</Text>
          <Text style={S.lampiranSub}>Rujukan: Wasiat Rasmi {t.full_name} | {docRef}</Text>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 12 }} />

          <Text style={S.lampiranIntro}>
            Senarai penuh harta saya adalah seperti berikut. Lampiran ini hendaklah dibaca bersama
            dokumen wasiat ini sebagai rujukan rasmi kepada wasi.
          </Text>

          {/* Harta Alih */}
          {mv?.mode === 'itemised' && (mv.items?.length ?? 0) > 0 && (
            <View style={S.sectionBox}>
              <View style={S.sectionBoxHdr}>
                <Text style={S.sectionBoxHdrText}>Harta Alih</Text>
              </View>
              {mv.items!.map((item, i) => (
                <View key={i} style={S.itemBox}>
                  <Text style={S.itemTitle}>{item.type}</Text>
                  <Text style={S.itemDetail}>{item.details}</Text>
                  <Text style={S.itemValue}>Anggaran nilai: {currency(item.amount)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Harta Tak Alih */}
          {im?.mode === 'itemised' && (im.items?.length ?? 0) > 0 && (
            <View style={S.sectionBox}>
              <View style={S.sectionBoxHdr}>
                <Text style={S.sectionBoxHdrText}>Harta Tak Alih</Text>
              </View>
              {im.items!.map((item, i) => (
                <View key={i} style={S.itemBox}>
                  <Text style={S.itemTitle}>{item.type}</Text>
                  <Text style={S.itemDetail}>{item.details}</Text>
                  <Text style={S.itemValue}>Anggaran nilai: {currency(item.amount)}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ marginTop: 20 }}>
            <Text style={S.para}>Disahkan oleh Pewasiat:</Text>
            <View style={{ borderBottomWidth: 0.75, borderBottomColor: '#555', width: 200, marginTop: 20, marginBottom: 4 }} />
            <Text style={S.sigName}>{t.full_name} | No. K/P: {t.ic_number}</Text>
          </View>

        </Page>
      )}

    </Document>
  )
}
