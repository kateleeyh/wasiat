import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, XCircle, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '5 Salah Faham Tentang Wasiat Yang Ramai Orang Malaysia Percaya',
  description: '"Saya masih muda." "Saya tak kaya." "Keluarga boleh urus sendiri." Ini adalah salah faham biasa yang menyebabkan ramai menangguhkan pembuatan wasiat hingga terlambat.',
}

export default async function Article() {
  const cookieStore = await cookies()
  const ms = (cookieStore.get('locale')?.value ?? 'ms') === 'ms'

  const misconceptions = ms ? [
    {
      myth: '"Saya masih muda — tak perlu lagi."',
      reality: 'Tiada had umur minimum untuk harta pusaka. Seseorang berumur 25 tahun yang memiliki kereta, akaun KWSP, dan simpanan perlu wasiat. Akta Wasiat 1959 memerlukan pewasiat berumur 18 tahun ke atas — bukan 60 ke atas.',
      law: 'Akta Wasiat 1959, Seksyen 4',
    },
    {
      myth: '"Saya tak ada harta — tak perlu wasiat."',
      reality: 'Jika anda ada akaun bank, kereta, simpanan ASB/unit amanah, atau insurans dengan nilai tunai — anda ada harta pusaka. Mengikut Akta Pembahagian 1958, semua ini akan diagihkan mengikut formula tetap undang-undang jika tiada wasiat.',
      law: 'Akta Pembahagian 1958',
    },
    {
      myth: '"Nama dalam geran rumah dah cukup."',
      reality: 'Nama dalam geran hanya membuktikan pemilikan — ia tidak menentukan siapa yang mewarisi bila anda meninggal. Walaupun nama anda dalam geran, harta itu tetap menjadi harta pusaka yang perlu melalui proses undang-undang.',
      law: 'Akta Pengangkutan Jalan 1987 | Kanun Tanah Negara',
    },
    {
      myth: '"Keluarga boleh urus sendiri tanpa susah-susah."',
      reality: 'Tanpa wasiat, keluarga perlu memohon Letter of Administration — yang memerlukan persetujuan semua waris, jaminan dua orang penjamin, dan proses mahkamah yang boleh mengambil berbulan hingga bertahun. Konflik keluarga atas harta pusaka adalah antara kes paling biasa di Mahkamah Sivil Malaysia.',
      law: 'Akta Probet dan Pentadbiran 1959',
    },
    {
      myth: '"Wasiat terus pindahkan harta kepada waris."',
      reality: 'Wasiat tidak memindahkan harta secara automatik. Masih perlu melalui proses Grant of Probate di mahkamah. Perbezaannya: dengan wasiat, proses ini lebih cepat, lebih murah, dan kurang konflik — berbanding Letter of Administration tanpa wasiat.',
      law: 'Akta Probet dan Pentadbiran 1959',
    },
  ] : [
    {
      myth: '"I\'m still young — don\'t need one yet."',
      reality: 'There is no minimum age for estate matters. A 25-year-old with a car, EPF account, and savings needs a will. The Wills Act 1959 requires testators to be 18 years and above — not 60 and above.',
      law: 'Wills Act 1959, Section 4',
    },
    {
      myth: '"I don\'t have assets — don\'t need a will."',
      reality: 'If you have a bank account, car, ASB/unit trust savings, or insurance with cash value — you have an estate. Under the Distribution Act 1958, all of this will be distributed according to a fixed legal formula without a will.',
      law: 'Distribution Act 1958',
    },
    {
      myth: '"My name on the house grant is enough."',
      reality: 'Your name on the grant only proves ownership — it does not determine who inherits when you die. Even if your name is on the grant, the property becomes part of the estate requiring legal process.',
      law: 'Road Transport Act 1987 | National Land Code',
    },
    {
      myth: '"Family can handle it without the hassle."',
      reality: 'Without a will, family must apply for a Letter of Administration — requiring all heirs\' consent, bonds from two guarantors, and court proceedings that can take months to years. Family conflicts over estates are among the most common cases in Malaysian Civil Courts.',
      law: 'Probate and Administration Act 1959',
    },
    {
      myth: '"A will automatically transfers assets to heirs."',
      reality: 'A will does not automatically transfer assets. Grant of Probate through court is still required. The difference: with a will, this process is faster, cheaper, and less contentious — compared to Letters of Administration without a will.',
      law: 'Probate and Administration Act 1959',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 pt-16 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <Link href="/insights" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {ms ? 'Kembali ke Insights' : 'Back to Insights'}
          </Link>
          <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full">
            {ms ? 'Salah Faham Biasa' : 'Common Misconceptions'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-4 leading-tight">
            {ms
              ? '5 Salah Faham Tentang Wasiat Yang Ramai Orang Malaysia Percaya'
              : '5 Misconceptions About Wills That Many Malaysians Believe'}
          </h1>
          <p className="text-slate-400 text-sm mt-3">
            {ms ? '1 Mei 2026 · 6 minit bacaan' : '1 May 2026 · 6 min read'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-slate-700 text-sm leading-relaxed space-y-6">

          <p>
            {ms
              ? 'Penangguhan adalah musuh wasiat. Ramai orang Malaysia tahu mereka patut membuat wasiat — tetapi terus menangguhkan kerana mempercayai salah satu daripada salah faham berikut. Mari kita luruskan satu persatu, berdasarkan undang-undang Malaysia yang sebenar.'
              : 'Procrastination is the enemy of estate planning. Many Malaysians know they should make a will — but keep putting it off because of one of these misconceptions. Let\'s address each one, based on actual Malaysian law.'}
          </p>

          <div className="space-y-5">
            {misconceptions.map((item, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-red-50 border-b border-red-100 p-4">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-red-500 uppercase tracking-wide">{ms ? `Salah Faham ${i + 1}` : `Misconception ${i + 1}`}</span>
                      <p className="font-semibold text-red-800 mt-0.5">{item.myth}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-50 p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">{ms ? 'Hakikat Sebenar' : 'The Reality'}</span>
                      <p className="text-emerald-800 text-xs mt-1 leading-relaxed">{item.reality}</p>
                      <p className="text-emerald-600 text-[10px] mt-2 font-medium">📌 {item.law}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Siapa Yang Benar-benar Perlu Wasiat?' : 'Who Really Needs a Will?'}
          </h2>
          <p>
            {ms
              ? 'Jawapan mudah: Sesiapa yang ada harta — tidak kira nilai atau umur. Jika anda ada mana-mana daripada berikut, anda perlukan wasiat:'
              : 'Simple answer: Anyone who has assets — regardless of value or age. If you have any of the following, you need a will:'}
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {(ms ? [
              'Akaun bank',
              'Kereta atau motosikal',
              'Simpanan ASB / unit amanah',
              'Hartanah',
              'KWSP / Tabung Haji',
              'Polisi insurans dengan nilai tunai',
              'Perniagaan atau saham syarikat',
              'Aset digital (kripto, domain, dll)',
            ] : [
              'Bank account',
              'Car or motorcycle',
              'ASB / unit trust savings',
              'Property',
              'EPF / Tabung Haji',
              'Insurance policy with cash value',
              'Business or company shares',
              'Digital assets (crypto, domain, etc)',
            ]).map(item => (
              <div key={item} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-700">
                <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />{item}
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
            <p>📌 {ms
              ? 'Rujukan undang-undang: Akta Wasiat 1959 | Akta Pembahagian 1958 | Akta Probet dan Pentadbiran 1959 | Enakmen Wasiat Orang Islam (mengikut negeri). Maklumat ini adalah panduan umum — sila rujuk peguam atau pihak yang berkelayakan untuk situasi spesifik anda.'
              : 'Legal references: Wills Act 1959 | Distribution Act 1958 | Probate and Administration Act 1959 | Islamic Will Enactments (by state). This is general guidance — consult a lawyer or qualified party for your specific situation.'}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="font-semibold text-emerald-800 mb-2">💡 {ms ? 'Satu pemikiran untuk dibawa pulang' : 'One thought to take home'}</p>
            <p className="text-sm text-emerald-700">
              {ms
                ? 'Wasiat bukan tentang berapa banyak harta yang anda ada. Ia tentang siapa yang memutuskan nasib harta itu — anda semasa hidup, atau undang-undang selepas anda tiada.'
                : 'A will is not about how many assets you have. It\'s about who decides the fate of those assets — you while alive, or the law after you\'re gone.'}
            </p>
          </div>

        </div>

        <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
          <p className="font-semibold text-slate-800 mb-2">{ms ? 'Baca juga:' : 'Read also:'}</p>
          <Link href="/insights/epf-nomination-bukan-wasiat" className="text-emerald-600 hover:underline block">
            → {ms ? 'EPF Nomination Bukan Wasiat — Ramai Yang Silap Faham' : 'EPF Nomination Is NOT a Will'}
          </Link>
          <Link href="/insights/wasiat-vs-surat-wasiat" className="text-emerald-600 hover:underline block mt-1">
            → {ms ? 'Wasiat Islam vs Surat Wasiat Am — Mana Satu Untuk Anda?' : 'Islamic Will vs General Will — Which Is For You?'}
          </Link>
        </div>

        <div className="mt-6 p-6 bg-slate-900 rounded-2xl text-center">
          <p className="text-white font-bold text-lg mb-2">
            {ms ? 'Tiada alasan untuk tunggu lagi.' : 'No reason to wait any longer.'}
          </p>
          <p className="text-slate-400 text-sm mb-5">
            {ms ? 'Buat wasiat dalam 15 minit. Dari RM79.' : 'Create your will in 15 minutes. From RM79.'}
          </p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            {ms ? 'Buat Wasiat Sekarang' : 'Create Your Will Now'}
          </Link>
        </div>
      </div>
    </div>
  )
}
