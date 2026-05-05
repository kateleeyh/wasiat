import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, BookOpen, ArrowRight } from 'lucide-react'

const articles = [
  {
    slug: 'kereta-tanpa-wasiat',
    titleMs: 'Tukar Nama Kereta Arwah di Malaysia: Proses, Kos Sebenar & Kenapa Boleh Cecah RM10,000+',
    titleEn: 'Transferring a Deceased\'s Car in Malaysia: Real Process, Real Costs & Why It Can Reach RM10,000+',
    excerptMs: 'Arif sangka boleh selesai dalam seminggu. Hampir setahun kemudian, baru dia faham kenapa proses ini jauh lebih rumit daripada yang dijangka.',
    excerptEn: 'Arif thought it could be done in a week. Nearly a year later, he finally understood why this process is far more complex than expected.',
    date: '1 Mei 2026',
    tag: 'Situasi Sebenar',
    tagEn: 'Real Situation',
    tagColor: 'bg-red-50 text-red-700',
    isPillar: true,
  },
  {
    slug: 'akaun-bank-dibekukan',
    titleMs: 'Akaun Bank Dibekukan Bila Meninggal Dunia — Ini Yang Sebenarnya Berlaku',
    titleEn: 'Bank Account Frozen When Someone Dies — What Really Happens',
    excerptMs: 'Wang dalam akaun tidak boleh dikeluarkan oleh sesiapa — termasuk pasangan atau anak. Ini proses undang-undang, bukan dasar bank.',
    excerptEn: 'Money in the account cannot be withdrawn by anyone — not even a spouse or children. This is a legal process, not just bank policy.',
    date: '1 Mei 2026',
    tag: 'Penting Diketahui',
    tagEn: 'Important to Know',
    tagColor: 'bg-amber-50 text-amber-700',
    isPillar: false,
  },
  {
    slug: 'grant-of-probate-vs-loa',
    titleMs: 'Grant of Probate vs Letter of Administration — Apa Bezanya?',
    titleEn: 'Grant of Probate vs Letter of Administration — What\'s the Difference?',
    excerptMs: 'Dua dokumen mahkamah ini menentukan berapa lama dan berapa mahal proses pusaka anda. Faham perbezaannya sebelum terlambat.',
    excerptEn: 'These two court documents determine how long and how costly your estate process will be. Understand the difference before it\'s too late.',
    date: '1 Mei 2026',
    tag: 'Panduan Undang-undang',
    tagEn: 'Legal Guide',
    tagColor: 'bg-blue-50 text-blue-700',
    isPillar: false,
  },
  {
    slug: 'salah-faham-wasiat',
    titleMs: '5 Salah Faham Tentang Wasiat Yang Ramai Orang Malaysia Percaya',
    titleEn: '5 Misconceptions About Wills That Many Malaysians Believe',
    excerptMs: '"Saya masih muda." "Saya tak ada harta." "Keluarga boleh urus sendiri." Ini salah faham yang menyebabkan ramai menangguhkan hingga terlambat.',
    excerptEn: '"I\'m still young." "I have no assets." "Family can handle it." These misconceptions cause many to delay until it\'s too late.',
    date: '1 Mei 2026',
    tag: 'Salah Faham',
    tagEn: 'Misconceptions',
    tagColor: 'bg-purple-50 text-purple-700',
    isPillar: false,
  },
  {
    slug: 'epf-nomination-bukan-wasiat',
    titleMs: 'EPF Nomination Bukan Wasiat — Ramai Yang Silap Faham Perkara Ini',
    titleEn: 'EPF Nomination Is NOT a Will — A Common Misunderstanding',
    excerptMs: 'Letak nama dalam KWSP tidak bermakna mereka terus dapat wang itu. Ini perbezaan kritikal yang ramai tidak tahu.',
    excerptEn: 'Nominating someone in EPF does not mean they automatically receive the money. This is a critical difference most people don\'t know.',
    date: '28 April 2026',
    tag: 'Salah Faham',
    tagEn: 'Misconception',
    tagColor: 'bg-purple-50 text-purple-700',
    isPillar: false,
  },
  {
    slug: 'wasiat-vs-surat-wasiat',
    titleMs: 'Wasiat Islam vs Surat Wasiat Am — Apa Bezanya dan Mana Satu Untuk Anda?',
    titleEn: 'Islamic Will vs General Will — What\'s the Difference and Which Is For You?',
    excerptMs: 'Dua dokumen berbeza di bawah undang-undang Malaysia. Pilih yang betul berdasarkan agama dan situasi anda.',
    excerptEn: 'Two different documents under Malaysian law. Choose the right one based on your religion and situation.',
    date: '28 April 2026',
    tag: 'Panduan',
    tagEn: 'Guide',
    tagColor: 'bg-blue-50 text-blue-700',
    isPillar: false,
  },
]

export default async function InsightsPage() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value ?? 'ms'
  const ms = locale === 'ms'

  const pillar = articles.find(a => a.isPillar)
  const supporting = articles.filter(a => !a.isPillar)

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {ms ? 'Kembali ke Laman Utama' : 'Back to Home'}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">Insights</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {ms ? 'Panduan & Pengetahuan' : 'Guides & Knowledge'}
          </h1>
          <p className="text-slate-400 text-lg">
            {ms
              ? 'Faham proses pusaka & undang-undang wasiat di Malaysia — sebelum terlambat.'
              : 'Understand estate processes & will laws in Malaysia — before it\'s too late.'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Pillar article — featured */}
        {pillar && (
          <div className="mb-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              {ms ? '📌 Artikel Utama' : '📌 Featured Article'}
            </p>
            <Link href={`/insights/${pillar.slug}`}>
              <div className="bg-slate-900 rounded-2xl p-6 hover:bg-slate-800 transition-all group">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pillar.tagColor}`}>
                    {ms ? pillar.tag : pillar.tagEn}
                  </span>
                  <span className="text-xs text-slate-500">{pillar.date}</span>
                </div>
                <h2 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {ms ? pillar.titleMs : pillar.titleEn}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                  {ms ? pillar.excerptMs : pillar.excerptEn}
                </p>
                <p className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                  {ms ? 'Baca artikel' : 'Read article'} <ArrowRight className="w-3 h-3" />
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Supporting articles */}
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          {ms ? 'Artikel Lain' : 'More Articles'}
        </p>
        <div className="space-y-4">
          {supporting.map((a) => (
            <Link key={a.slug} href={`/insights/${a.slug}`}>
              <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.tagColor}`}>
                      {ms ? a.tag : a.tagEn}
                    </span>
                    <span className="text-xs text-slate-400">{a.date}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
                <h2 className="text-base font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                  {ms ? a.titleMs : a.titleEn}
                </h2>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {ms ? a.excerptMs : a.excerptEn}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
