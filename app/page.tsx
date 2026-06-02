import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import {
  Mail, BookOpen, Save,
  Globe, Eye, History, CheckCircle, ArrowRight,
  UserPlus, ClipboardList, CreditCard,
} from 'lucide-react'
import { Navbar } from '@/components/landing/Navbar'
import { FaqAccordion } from '@/components/landing/FaqAccordion'
import { LanguageToggleDark } from '@/components/landing/LanguageToggle'

export default async function LandingPage() {
  const t = await getTranslations('landing')
  const tCommon = await getTranslations('common')
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value ?? 'ms'
  const isMalay = locale === 'ms'

  const wasiatPoints = isMalay
    ? ['Mengikut Enakmen Wasiat Orang Islam', 'Faraid diagihkan secara automatik', 'Wasi (Pelaksana) mesti beragama Islam', 'Saksi & pendaftaran JAWI/JAKIM']
    : ['Follows Syariah Enactment (state-based)', 'Faraid distribution handled automatically', 'Executor (Wasi) must be Muslim', 'Requires witnesses & JAWI/JAKIM registration']

  const willPoints = isMalay
    ? ['Mengikut Akta Wasiat 1959 Malaysia', 'Boleh termasuk penjagaan anak-anak', 'Meliputi aset digital & perniagaan', 'Perlu 2 saksi yang bukan penerima manfaat']
    : ['Follows Wills Act 1959 Malaysia', 'Can include guardianship for children', 'Covers digital assets & business interests', 'Requires 2 non-beneficiary witnesses']

  const features = [
    { icon: BookOpen, title: isMalay ? 'Borang Dipandu' : 'Guided Form', desc: isMalay ? 'Setiap medan dijelaskan. Tiada pengetahuan undang-undang diperlukan.' : 'Every field explained. No legal knowledge required.' },
    { icon: Save, title: isMalay ? 'Auto-Simpan' : 'Auto-Save', desc: isMalay ? 'Kemajuan disimpan secara automatik. Sambung pada bila-bila masa.' : 'Progress saved automatically. Continue anytime.' },
    { icon: Globe, title: isMalay ? 'Dwibahasa' : 'Bilingual', desc: isMalay ? 'Sepenuhnya dalam Bahasa Malaysia dan Bahasa Inggeris.' : 'Fully available in Bahasa Malaysia and English.' },
    { icon: Eye, title: isMalay ? 'Semak Sebelum Bayar' : 'Review Before Paying', desc: isMalay ? 'Semak semua maklumat anda sebelum membuat pembayaran. Tiada kejutan.' : 'Review all your information before payment. No surprises.' },
    { icon: Mail, title: isMalay ? 'Hantar ke E-mel' : 'Email Delivery', desc: isMalay ? 'PDF dihantar terus ke e-mel anda selepas bayaran berjaya.' : 'PDF sent directly to your email after successful payment.' },
    { icon: History, title: isMalay ? 'Sejarah Dokumen' : 'Document History', desc: isMalay ? 'Akses dan muat turun semula dokumen anda bila-bila masa.' : 'Access and re-download your documents anytime.' },
  ]

  const wasiatIncludes = isMalay
    ? ['1 Dokumen Wasiat Islam', 'PDF dijana & dihantar ke e-mel', 'Panduan pasca-penjana', 'Akses semula dari papan pemuka']
    : ['1 Islamic Will Document', 'PDF generated & emailed', 'Post-generation guidance', 'Re-access from dashboard']

  const willIncludes = isMalay
    ? ['1 Surat Wasiat', 'PDF dijana & dihantar ke e-mel', 'Panduan pasca-penjana', 'Akses semula dari papan pemuka']
    : ['1 General Will Document', 'PDF generated & emailed', 'Post-generation guidance', 'Re-access from dashboard']

  const bundleIncludes = isMalay
    ? ['2 dokumen apa-apa jenis', 'Sesuai untuk pasangan atau ahli keluarga', '1 kredit disimpan untuk dokumen kedua', 'PDF dijana & dihantar ke e-mel']
    : ['Any 2 documents', 'Great for couples, siblings or family', '1 credit saved for your 2nd document', 'PDF generated & emailed']

  const faqs = isMalay
    ? [
        { q: 'Adakah dokumen yang dijana sah di sisi undang-undang Malaysia?', a: 'Ya, dokumen yang dijana oleh WasiatHub adalah berdasarkan rangka kerja undang-undang Malaysia — Enakmen Wasiat Orang Islam (untuk Wasiat) dan Akta Wasiat 1959 (untuk Surat Wasiat). Walau bagaimanapun, untuk berkuat kuasa penuh, ia mesti ditandatangani di hadapan saksi dan, untuk Wasiat, didaftarkan dengan Jabatan Agama Islam Negeri.' },
        { q: 'Berapa lama masa yang diperlukan untuk melengkapkan borang?', a: 'Kebanyakan pengguna dapat melengkapkan borang dalam 15–30 minit. Borang dipandu langkah demi langkah dan disimpan secara automatik, jadi anda boleh berehat dan sambung bila-bila masa.' },
        { q: 'Bolehkah saya mengedit draf saya sebelum membayar?', a: 'Ya! Draf anda disimpan secara automatik dan anda boleh kembali dan mengeditnya pada bila-bila masa sebelum membuat bayaran. Selepas membayar, dokumen adalah tetap.' },
        { q: 'Bagaimana saya menerima PDF saya?', a: 'Selepas bayaran berjaya, PDF dijanakan serta-merta dan dihantar ke alamat e-mel yang anda daftarkan. Anda juga boleh memuat turun semula dari papan pemuka anda pada bila-bila masa.' },
        { q: 'Perlukah saya berjumpa peguam atau pegawai Syariah?', a: 'WasiatHub menyediakan perkhidmatan penjana dokumen berdasarkan undang-undang Malaysia. Untuk kes yang lebih kompleks atau untuk ketenangan fikiran, kami mengesyorkan anda berunding dengan peguam atau pegawai Syariah. Dokumen kami adalah titik permulaan yang kukuh.' },
        { q: 'Apakah kaedah pembayaran yang diterima?', a: 'Kami menerima bayaran melalui FPX (perbankan dalam talian — semua bank utama Malaysia), GrabPay dan Touch \'n Go eWallet. Pembayaran diproses melalui DOKU, gateway pembayaran berlesen di Malaysia.' },
      ]
    : [
        { q: 'Are the generated documents legally valid in Malaysia?', a: 'Yes, documents generated by WasiatHub are based on Malaysian legal frameworks — the Syariah Enactment for Wasiat and the Wills Act 1959 for General Wills. However, for full legal effect, they must be signed in front of witnesses and, for Wasiat, registered with the State Islamic Religious Department.' },
        { q: 'How long does it take to complete the form?', a: 'Most users complete the form in 15–30 minutes. The form is guided step-by-step and auto-saved, so you can take a break and continue anytime.' },
        { q: 'Can I edit my draft before paying?', a: 'Yes! Your draft is automatically saved and you can return to edit it anytime before making payment. After payment, the document is finalised.' },
        { q: 'How do I receive my PDF?', a: 'After successful payment, the PDF is generated instantly and sent to your registered email address. You can also re-download it from your dashboard anytime.' },
        { q: 'Do I need to see a lawyer or Syariah officer?', a: 'WasiatHub provides a document generation service based on Malaysian law. For complex cases or peace of mind, we recommend consulting a lawyer or Syariah officer. Our documents are a strong starting point.' },
        { q: 'What payment methods are accepted?', a: 'We accept payment via FPX (online banking — all major Malaysian banks), GrabPay and Touch \'n Go eWallet. Payments are processed through DOKU, a licensed payment gateway in Malaysia.' },
      ]

  const steps = [
    { num: '01', icon: UserPlus,      title: t('howItWorks.step1'), desc: t('howItWorks.step1Desc') },
    { num: '02', icon: ClipboardList, title: t('howItWorks.step2'), desc: t('howItWorks.step2Desc') },
    { num: '03', icon: Eye,           title: t('howItWorks.step3'), desc: t('howItWorks.step3Desc') },
    { num: '04', icon: CreditCard,    title: t('howItWorks.step4'), desc: t('howItWorks.step4Desc') },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        locale={locale}
        t={{
          features: t('nav.features'),
          howItWorks: t('nav.howItWorks'),
          pricing: t('nav.pricing'),
          faq: t('nav.faq'),
          insights: t('nav.insights'),
          login: t('nav.login'),
          register: t('nav.register'),
        }}
      />

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 pt-16 overflow-hidden">
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-300 text-sm font-medium">{t('hero.badge')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                {t('hero.headline1')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  {t('hero.headline2')}
                </span>
              </h1>

              <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t('hero.sub')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
                <Link href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-3.5 rounded-xl text-base transition-all shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5">
                  {t('hero.cta')} <ArrowRight size={18} />
                </Link>
                <a href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-medium px-7 py-3.5 rounded-xl text-base transition-all">
                  {t('hero.ctaSecondary')}
                </a>
              </div>

              <div className="flex justify-center lg:justify-start gap-8">
                {[
                  { val: t('hero.stat1'), label: t('hero.stat1Label') },
                  { val: t('hero.stat2'), label: t('hero.stat2Label') },
                  { val: t('hero.stat3'), label: t('hero.stat3Label') },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-extrabold text-emerald-400">{s.val}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Document Mockup Stack */}
            <div className="hidden lg:flex justify-center items-center py-8">
              <div className="relative w-full max-w-sm">

                {/* Back card — Asset / Faraid distribution (peeking behind, rotated) */}
                <div className="absolute -top-6 -left-8 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/30 p-4 rotate-[-6deg] opacity-90 z-0">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-3">
                    {isMalay ? 'Agihan Harta / Penerima' : 'Asset Distribution'}
                  </p>
                  {[
                    { name: isMalay ? 'Isteri' : 'Spouse',   pct: 50, color: 'bg-emerald-500' },
                    { name: isMalay ? 'Anak 1' : 'Child 1',  pct: 30, color: 'bg-teal-400' },
                    { name: isMalay ? 'Anak 2' : 'Child 2',  pct: 20, color: 'bg-cyan-400' },
                  ].map(b => (
                    <div key={b.name} className="mb-2">
                      <div className="flex justify-between text-[8px] text-slate-500 mb-0.5">
                        <span>{b.name}</span><span className="font-bold">{b.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.pct}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <p className="text-[8px] text-slate-400">
                      {isMalay ? '+ Penjaga anak · Wasi · Saksi' : '+ Guardian · Executor · Witnesses'}
                    </p>
                  </div>
                </div>

                {/* Bottom-right floating tag */}
                <div className="absolute -bottom-4 -right-6 w-52 bg-white rounded-xl shadow-lg border border-slate-200/30 p-3 rotate-[4deg] z-0 opacity-90">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                    {isMalay ? 'Semua Ciri Termasuk' : 'Everything Included'}
                  </p>
                  {[
                    isMalay ? '✓ Penerima tanpa had' : '✓ Unlimited beneficiaries',
                    isMalay ? '✓ Semua jenis aset' : '✓ All asset types',
                    isMalay ? '✓ Penjaga anak-anak' : '✓ Child guardianship',
                  ].map(f => (
                    <p key={f} className="text-[8px] text-emerald-600 font-medium">{f}</p>
                  ))}
                </div>

                {/* Main document card */}
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/20">
                  {/* Document header */}
                  <div className="bg-slate-900 px-6 py-4 text-center border-b border-slate-700">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 mb-1">
                      {isMalay ? 'WASIAT RASMI' : 'LAST WILL AND TESTAMENT'}
                    </p>
                    <p className="text-white font-bold text-base">AHMAD BIN IBRAHIM</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">820101-12-3456</p>
                  </div>

                  {/* Document body — blurred content */}
                  <div className="px-6 py-5 space-y-4 bg-white">
                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-slate-200 rounded-full w-full" />
                      <div className="h-1.5 bg-slate-200 rounded-full w-5/6" />
                      <div className="h-1.5 bg-slate-200 rounded-full w-full" />
                      <div className="h-1.5 bg-slate-200 rounded-full w-4/5" />
                    </div>
                    <div className="border-t border-slate-100 pt-3 space-y-1.5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                        {isMalay ? 'ARTIKEL 1: PELANTIKAN WASI' : 'ARTICLE 1: APPOINTMENT OF EXECUTOR'}
                      </p>
                      <div className="h-1.5 bg-slate-200 rounded-full w-full" />
                      <div className="h-1.5 bg-slate-200 rounded-full w-3/4" />
                    </div>
                    <div className="border-t border-slate-100 pt-3 space-y-1.5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                        {isMalay ? 'ARTIKEL 2: SENARAI HARTA' : 'ARTICLE 2: ESTATE ASSETS'}
                      </p>
                      <div className="h-1.5 bg-slate-200 rounded-full w-full" />
                      <div className="h-1.5 bg-slate-200 rounded-full w-5/6" />
                    </div>
                    <div className="border-t border-slate-100 pt-3 space-y-1.5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                        {isMalay ? 'ARTIKEL 3: PENERIMA MANFAAT' : 'ARTICLE 3: BENEFICIARIES'}
                      </p>
                      <div className="h-1.5 bg-slate-200 rounded-full w-full" />
                      <div className="h-1.5 bg-slate-200 rounded-full w-2/3" />
                    </div>

                    {/* Signature area */}
                    <div className="border-t border-slate-200 pt-4 flex gap-6">
                      <div className="flex-1">
                        <div className="h-px bg-slate-300 w-full mb-1" />
                        <p className="text-[8px] text-slate-400">{isMalay ? 'Tandatangan Pewasiat' : 'Testator Signature'}</p>
                      </div>
                      <div className="flex-1">
                        <div className="h-px bg-slate-300 w-full mb-1" />
                        <p className="text-[8px] text-slate-400">{isMalay ? 'Saksi 1' : 'Witness 1'}</p>
                      </div>
                    </div>
                  </div>

                  {/* WasiatHub footer */}
                  <div className="bg-slate-50 px-6 py-2.5 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[9px] font-bold text-emerald-600">WasiatHub</span>
                    <span className="text-[8px] text-slate-400">WST-2026-XXXXXX</span>
                  </div>
                </div>

                {/* "Generated instantly" label */}
                <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg">
                  ⚡ {isMalay ? 'Jana Segera' : 'Instant PDF'}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-10">
            {[
              { emoji: '🔒', label: isMalay ? 'SSL Selamat' : 'SSL Secured', sub: isMalay ? 'Data disulitkan' : 'Data encrypted' },
              { emoji: null, label: t('trust.secure'), sub: t('trust.secureDesc') },
              { emoji: '🇲🇾', label: isMalay ? 'Patuh PDPA' : 'PDPA Compliant', sub: isMalay ? 'Perlindungan data' : 'Data protected' },
              { emoji: '⚡', label: isMalay ? 'PDF Segera' : 'Instant PDF', sub: isMalay ? 'Jana dalam minit' : 'Generated in minutes' },
              { emoji: '📋', label: isMalay ? 'Akta Wasiat 1959' : 'Wills Act 1959', sub: isMalay ? 'Rangka kerja undang-undang' : 'Legal framework' },
              { emoji: '🧑‍🤝‍🧑', label: t('trust.allRaces'), sub: t('trust.allRacesDesc') },
            ].map(({ emoji, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                {emoji === null ? (
                  <div className="flex items-center gap-1">
                    <img src="/payment/fpx.svg"        alt="FPX"     className="h-5 w-auto rounded" />
                    <img src="/payment/grabpay.svg"    alt="GrabPay" className="h-5 w-auto rounded" />
                    <img src="/payment/tng.svg"        alt="TnG"     className="h-5 w-auto rounded" />
                    <img src="/payment/visa.svg"       alt="Visa"    className="h-5 w-auto rounded" />
                    <img src="/payment/mastercard.svg" alt="MC"      className="h-5 w-auto rounded" />
                  </div>
                ) : (
                  <span className="text-xl">{emoji}</span>
                )}
                <div>
                  <div className="text-xs font-semibold text-slate-800">{label}</div>
                  <div className="text-[10px] text-slate-400">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFFERENTIATOR ── */}
      <section className="bg-gradient-to-r from-emerald-900 to-teal-900 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="shrink-0 text-center md:text-left">
              <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-1">
                {isMalay ? 'Kenapa WasiatHub?' : 'Why WasiatHub?'}
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {isMalay ? 'Satu harga. Tiada had.' : 'One price. Zero limits.'}
              </h3>
            </div>
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                isMalay ? '✓ Penerima manfaat tanpa had' : '✓ Unlimited beneficiaries',
                isMalay ? '✓ Semua jenis aset' : '✓ All asset types',
                isMalay ? '✓ Penjaga anak-anak' : '✓ Child guardianship',
                isMalay ? '✓ Wasi + Saksi' : '✓ Executor + Witnesses',
                isMalay ? '✓ Semak maklumat sebelum bayar' : '✓ Review all details before paying',
                isMalay ? '✓ Tiada caj tambahan' : '✓ No extra charges',
              ].map(f => (
                <div key={f} className="bg-white/10 rounded-lg px-3 py-2 text-xs text-emerald-100 font-medium">{f}</div>
              ))}
            </div>
            <div className="shrink-0 text-center">
              <div className="text-3xl font-extrabold text-white">RM 79</div>
              <div className="text-emerald-300 text-xs mt-0.5">
                {isMalay ? 'semuanya termasuk' : 'all features included'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOCUMENT TYPES ── */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{t('docTypes.title')}</h2>
            <p className="text-slate-500 max-w-xl mx-auto">{t('docTypes.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Wasiat card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 text-white shadow-xl shadow-emerald-500/20">
              <div className="inline-block bg-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-4">
                {t('docTypes.wasiatFor')}
              </div>
              <h3 className="text-2xl font-bold mb-3">{isMalay ? 'Wasiat Islam' : 'Islamic Will (Wasiat)'}</h3>
              <p className="text-emerald-100 text-sm mb-6 leading-relaxed">{t('docTypes.wasiatDesc')}</p>
              <ul className="space-y-2.5">
                {wasiatPoints.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle size={16} className="text-emerald-300 mt-0.5 shrink-0" />
                    <span className="text-white/90">{pt}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="mt-8 inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-emerald-50 transition-colors"
              >
                {isMalay ? 'Mulakan Wasiat' : 'Start Wasiat'} <ArrowRight size={15} />
              </Link>
              <Link href="/wasiat-101" className="mt-3 flex items-center gap-1.5 text-emerald-200 hover:text-white text-xs transition-colors">
                📖 {isMalay ? 'Baca Wasiat 101 dahulu — apa yang perlu anda tahu' : 'Read Wasiat 101 first — what you need to know'}
              </Link>
            </div>

            {/* Will card */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
              <div className="inline-block bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-xs font-semibold mb-4">
                {t('docTypes.willFor')}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('docTypes.willTitle')}</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">{t('docTypes.willDesc')}</p>
              <ul className="space-y-2.5">
                {willPoints.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-slate-700">{pt}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="mt-8 inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-slate-700 transition-colors"
              >
                {isMalay ? 'Mulakan Surat Wasiat' : 'Start General Will'} <ArrowRight size={15} />
              </Link>
              <Link href="/will-101" className="mt-3 flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-xs transition-colors">
                📖 {isMalay ? 'Baca General Will 101 dahulu — apa yang perlu anda tahu' : 'Read General Will 101 first — what you need to know'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{t('howItWorks.title')}</h2>
            <p className="text-slate-500">{t('howItWorks.subtitle')}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-4">
            {steps.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center text-center">
                {/* Connector arrow between steps */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-9 left-[calc(50%+2.75rem)] right-[-calc(50%-2.75rem)] items-center">
                    <div className="flex-1 h-0.5 bg-emerald-200" />
                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[7px] border-l-emerald-300" />
                  </div>
                )}
                {/* Big step number circle */}
                <div className="relative z-10 w-[4.5rem] h-[4.5rem] bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-200/60">
                  <span className="text-white font-extrabold text-2xl leading-none">{step.num}</span>
                </div>
                {/* Icon badge */}
                <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-center mb-3">
                  <step.icon size={18} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{t('features.title')}</h2>
            <p className="text-slate-500">{t('features.subtitle')}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all group"
              >
                <div className="w-11 h-11 bg-emerald-50 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <Icon size={20} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVACY ── */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {t('privacy.title')}
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
              {t('privacy.subtitle')}
            </p>
          </div>
          <p className="text-slate-300 text-center text-base leading-relaxed mb-10 max-w-2xl mx-auto">
            {t('privacy.body')}
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { emoji: '🔒', text: t('privacy.point1') },
              { emoji: '📄', text: t('privacy.point2') },
              { emoji: '✅', text: t('privacy.point3') },
            ].map(({ emoji, text }) => (
              <div key={text} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 flex items-start gap-3">
                <span className="text-xl shrink-0">{emoji}</span>
                <p className="text-slate-200 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{t('pricing.title')}</h2>
            <p className="text-slate-500">{t('pricing.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Wasiat */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-md transition-shadow">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{t('pricing.wasiatTitle')}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">{t('pricing.price79')}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {wasiatIncludes.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="block text-center bg-slate-900 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {t('pricing.cta')}
              </Link>
            </div>

            {/* Bundle — highlighted */}
            <div className="bg-gradient-to-b from-emerald-600 to-teal-700 rounded-2xl p-8 shadow-xl shadow-emerald-500/25 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                  {t('pricing.bundleBadge')}
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{t('pricing.bundleTitle')}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-white">{t('pricing.price129')}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {bundleIncludes.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-emerald-100">
                    <CheckCircle size={16} className="text-emerald-300 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="block text-center bg-white hover:bg-emerald-50 text-emerald-700 font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {t('pricing.cta')}
              </Link>
            </div>

            {/* General Will */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-md transition-shadow">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{t('pricing.willTitle')}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">{t('pricing.price79')}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {willIncludes.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth/register"
                className="block text-center bg-slate-900 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {t('pricing.cta')}
              </Link>
            </div>
          </div>

          <p className="text-center text-slate-400 text-sm mt-8">{t('pricing.disclaimer')}</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-slate-50 py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{t('faq.title')}</h2>
            <p className="text-slate-500">{t('faq.subtitle')}</p>
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">{t('cta.subtitle')}</p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5"
          >
            {t('cta.button')} <ArrowRight size={20} />
          </Link>
          <p className="text-slate-400 text-sm mt-4">{t('cta.note')}</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="text-white font-bold text-xl mb-3">{tCommon('appName')}</div>
              <p className="text-sm leading-relaxed">{t('footer.tagline')}</p>
              <div className="mt-4">
                <LanguageToggleDark locale={locale} />
              </div>
            </div>

            {/* Product */}
            <div>
              <div className="text-white font-semibold text-sm mb-4">{t('footer.product')}</div>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">{t('nav.features')}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t('nav.pricing')}</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">{t('nav.howItWorks')}</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <div className="text-white font-semibold text-sm mb-4">{t('footer.legal')}</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/disclaimer" className="hover:text-white transition-colors">{t('footer.disclaimer')}</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <div className="text-white font-semibold text-sm mb-4">{t('footer.support')}</div>
              <ul className="space-y-2 text-sm">
                <li><a href="/#faq" className="hover:text-white transition-colors">{t('footer.faq')}</a></li>
                <li><Link href="/wasiat-101" className="hover:text-white transition-colors">Wasiat 101</Link></li>
                <li><Link href="/will-101" className="hover:text-white transition-colors">General Will 101</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">{t('footer.contact')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <div>
              <span>© {new Date().getFullYear()} WasiatHub. {t('footer.rights')}</span>
              <span className="block text-[11px] text-slate-500 mt-0.5">
                {isMalay
                  ? 'WasiatHub dikendalikan oleh WF Wealth Management Sdn. Bhd. (202101017850-M)'
                  : 'WasiatHub is operated by WF Wealth Management Sdn. Bhd. (202101017850-M)'}
              </span>
            </div>
            <span className="text-center">{t('footer.disclaimerShort')}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
