import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import Link from 'next/link'
import {
  Shield, Zap, FileText, Mail, BookOpen, Save,
  Globe, Eye, History, CheckCircle, ArrowRight, Lock,
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
    { icon: Eye, title: isMalay ? 'Pratonton Dokumen' : 'Document Preview', desc: isMalay ? 'Lihat dokumen anda sebelum membayar. Keyakinan penuh.' : 'Preview your document before paying. Full confidence.' },
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
    ? ['1 Wasiat + 1 Surat Wasiat', 'Sesuai untuk pasangan suami isteri', 'PDF dijana & dihantar ke e-mel', 'Akses semula dari papan pemuka']
    : ['1 Wasiat + 1 General Will', 'Perfect for married couples', 'PDF generated & emailed', 'Re-access from dashboard']

  const faqs = isMalay
    ? [
        { q: 'Adakah dokumen yang dijana sah di sisi undang-undang Malaysia?', a: 'Ya, dokumen yang dijana oleh WasiatHub adalah berdasarkan rangka kerja undang-undang Malaysia — Enakmen Wasiat Orang Islam (untuk Wasiat) dan Akta Wasiat 1959 (untuk Surat Wasiat). Walau bagaimanapun, untuk berkuat kuasa penuh, ia mesti ditandatangani di hadapan saksi dan, untuk Wasiat, didaftarkan dengan Jabatan Agama Islam Negeri.' },
        { q: 'Berapa lama masa yang diperlukan untuk melengkapkan borang?', a: 'Kebanyakan pengguna dapat melengkapkan borang dalam 15–30 minit. Borang dipandu langkah demi langkah dan disimpan secara automatik, jadi anda boleh berehat dan sambung bila-bila masa.' },
        { q: 'Bolehkah saya mengedit draf saya sebelum membayar?', a: 'Ya! Draf anda disimpan secara automatik dan anda boleh kembali dan mengeditnya pada bila-bila masa sebelum membuat bayaran. Selepas membayar, dokumen adalah tetap.' },
        { q: 'Bagaimana saya menerima PDF saya?', a: 'Selepas bayaran berjaya, PDF dijanakan serta-merta dan dihantar ke alamat e-mel yang anda daftarkan. Anda juga boleh memuat turun semula dari papan pemuka anda pada bila-bila masa.' },
        { q: 'Perlukah saya berjumpa peguam atau pegawai Syariah?', a: 'WasiatHub menyediakan perkhidmatan penjana dokumen berdasarkan undang-undang Malaysia. Untuk kes yang lebih kompleks atau untuk ketenangan fikiran, kami mengesyorkan anda berunding dengan peguam atau pegawai Syariah. Dokumen kami adalah titik permulaan yang kukuh.' },
        { q: 'Apakah kaedah pembayaran yang diterima?', a: 'Kami menerima bayaran melalui FPX (Sistem Pemindahan Dana Elektronik) — sistem pembayaran bank-ke-bank Malaysia yang selamat. Semua bank utama Malaysia disokong.' },
      ]
    : [
        { q: 'Are the generated documents legally valid in Malaysia?', a: 'Yes, documents generated by WasiatHub are based on Malaysian legal frameworks — the Syariah Enactment for Wasiat and the Wills Act 1959 for General Wills. However, for full legal effect, they must be signed in front of witnesses and, for Wasiat, registered with the State Islamic Religious Department.' },
        { q: 'How long does it take to complete the form?', a: 'Most users complete the form in 15–30 minutes. The form is guided step-by-step and auto-saved, so you can take a break and continue anytime.' },
        { q: 'Can I edit my draft before paying?', a: 'Yes! Your draft is automatically saved and you can return to edit it anytime before making payment. After payment, the document is finalised.' },
        { q: 'How do I receive my PDF?', a: 'After successful payment, the PDF is generated instantly and sent to your registered email address. You can also re-download it from your dashboard anytime.' },
        { q: 'Do I need to see a lawyer or Syariah officer?', a: 'WasiatHub provides a document generation service based on Malaysian law. For complex cases or peace of mind, we recommend consulting a lawyer or Syariah officer. Our documents are a strong starting point.' },
        { q: 'What payment methods are accepted?', a: 'We accept payment via FPX (Electronic Fund Transfer System) — Malaysia\'s trusted bank-to-bank payment system. All major Malaysian banks are supported.' },
      ]

  const steps = [
    { num: '01', title: t('howItWorks.step1'), desc: t('howItWorks.step1Desc') },
    { num: '02', title: t('howItWorks.step2'), desc: t('howItWorks.step2Desc') },
    { num: '03', title: t('howItWorks.step3'), desc: t('howItWorks.step3Desc') },
    { num: '04', title: t('howItWorks.step4'), desc: t('howItWorks.step4Desc') },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        locale={locale}
        appName={tCommon('appName')}
        t={{
          features: t('nav.features'),
          howItWorks: t('nav.howItWorks'),
          pricing: t('nav.pricing'),
          faq: t('nav.faq'),
          login: t('nav.login'),
          register: t('nav.register'),
        }}
      />

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-300 text-sm font-medium">{t('hero.badge')}</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            {t('hero.headline1')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              {t('hero.headline2')}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero.sub')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              {t('hero.cta')}
              <ArrowRight size={20} />
            </Link>
            <button
              onClick={() => {
                document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-medium px-8 py-4 rounded-xl text-lg transition-all"
            >
              {t('hero.ctaSecondary')}
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16">
            {[
              { val: t('hero.stat1'), label: t('hero.stat1Label') },
              { val: t('hero.stat2'), label: t('hero.stat2Label') },
              { val: t('hero.stat3'), label: t('hero.stat3Label') },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-emerald-400">{s.val}</div>
                <div className="text-slate-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: t('trust.legal'), desc: t('trust.legalDesc') },
              { icon: Lock, title: t('trust.secure'), desc: t('trust.secureDesc') },
              { icon: Zap, title: t('trust.fast'), desc: t('trust.fastDesc') },
              { icon: Mail, title: t('trust.pdf'), desc: t('trust.pdfDesc') },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Icon size={22} className="text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{title}</div>
                  <div className="text-slate-500 text-xs mt-1">{desc}</div>
                </div>
              </div>
            ))}
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
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">{t('howItWorks.title')}</h2>
            <p className="text-slate-500">{t('howItWorks.subtitle')}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-emerald-200 to-transparent z-0" />
                )}
                <div className="relative bg-slate-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg mb-5 shadow-md shadow-emerald-200">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
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
                  <span className="text-4xl font-extrabold text-slate-900">{t('pricing.price49')}</span>
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
                  <span className="text-4xl font-extrabold text-white">{t('pricing.price79')}</span>
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
                  <span className="text-4xl font-extrabold text-slate-900">{t('pricing.price49')}</span>
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
                <li><button onClick={() => {}} className="hover:text-white transition-colors">{t('nav.features')}</button></li>
                <li><button onClick={() => {}} className="hover:text-white transition-colors">{t('nav.pricing')}</button></li>
                <li><button onClick={() => {}} className="hover:text-white transition-colors">{t('nav.howItWorks')}</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <div className="text-white font-semibold text-sm mb-4">{t('footer.legal')}</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">{t('footer.disclaimer')}</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <div className="text-white font-semibold text-sm mb-4">{t('footer.support')}</div>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white transition-colors">{t('footer.faq')}</button></li>
                <li><Link href="mailto:support@wasiathub.com" className="hover:text-white transition-colors">{t('footer.contact')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <span>© {new Date().getFullYear()} WasiatHub. {t('footer.rights')}</span>
            <span className="text-center">{t('footer.disclaimerShort')}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
