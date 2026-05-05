import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wasiat Islam vs Surat Wasiat Am — Apa Bezanya?',
  description: 'Wasiat Islam dan Surat Wasiat Am adalah dua dokumen berbeza di bawah undang-undang Malaysia. Ketahui mana satu yang sesuai untuk anda.',
}

export default async function Article() {
  const cookieStore = await cookies()
  const ms = (cookieStore.get('locale')?.value ?? 'ms') === 'ms'

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 pt-16 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <Link href="/insights" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {ms ? 'Kembali ke Insights' : 'Back to Insights'}
          </Link>
          <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
            {ms ? 'Panduan' : 'Guide'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-4 leading-tight">
            {ms
              ? 'Wasiat Islam vs Surat Wasiat Am — Apa Bezanya dan Mana Satu Untuk Anda?'
              : 'Islamic Will vs General Will — What\'s the Difference and Which Is For You?'}
          </h1>
          <p className="text-slate-400 text-sm mt-3">
            {ms ? '28 April 2026 · 5 minit bacaan' : '28 April 2026 · 5 min read'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-slate-700 text-sm leading-relaxed space-y-6">

          <p className="text-base">
            {ms
              ? 'Malaysia adalah negara majmuk. Undang-undang pewarisan harta berbeza bergantung kepada agama — dan ini bermakna dokumen wasiat yang anda perlukan juga berbeza. Ramai yang keliru antara Wasiat Islam dan Surat Wasiat Am. Artikel ini menjelaskannya dengan mudah.'
              : 'Malaysia is a multiracial country. Inheritance laws differ depending on religion — and this means the will document you need is also different. Many people confuse Islamic Will and General Will. This article explains it simply.'}
          </p>

          {/* Quick answer */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">
                {ms ? 'WASIAT ISLAM' : 'ISLAMIC WILL (WASIAT)'}
              </p>
              <p className="font-bold text-emerald-900 text-base mb-2">
                {ms ? 'Untuk penganut Islam' : 'For Muslims'}
              </p>
              <p className="text-xs text-emerald-700">
                {ms
                  ? 'Di bawah hukum Syariah. Mengikut Enakmen Wasiat Orang Islam negeri masing-masing. Tertakluk kepada peraturan Faraid — anda hanya boleh wasiatkan sehingga 1/3 harta kepada orang di luar waris Faraid.'
                  : 'Under Syariah law. Governed by each state\'s Islamic Will Enactment. Subject to Faraid rules — you can only bequeath up to 1/3 of your estate to non-Faraid heirs.'}
              </p>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">
                {ms ? 'SURAT WASIAT AM' : 'GENERAL WILL'}
              </p>
              <p className="font-bold text-blue-900 text-base mb-2">
                {ms ? 'Untuk bukan Islam' : 'For Non-Muslims'}
              </p>
              <p className="text-xs text-blue-700">
                {ms
                  ? 'Di bawah Akta Wasiat 1959. Anda bebas menentukan siapa mendapat apa — tanpa had Faraid. Meliputi semua jenis harta termasuk penjagaan anak-anak.'
                  : 'Under the Wills Act 1959. You are free to determine who gets what — without Faraid restrictions. Covers all asset types including child guardianship.'}
              </p>
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Perbandingan terperinci' : 'Detailed comparison'}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="text-left p-3 font-bold text-slate-700 border border-slate-200 w-1/3"></th>
                  <th className="text-left p-3 font-bold text-emerald-700 border border-slate-200 bg-emerald-50">Wasiat Islam</th>
                  <th className="text-left p-3 font-bold text-blue-700 border border-slate-200 bg-blue-50">{ms ? 'Surat Wasiat Am' : 'General Will'}</th>
                </tr>
              </thead>
              <tbody>
                {(ms ? [
                  ['Undang-undang', 'Enakmen Wasiat Orang Islam (berbeza mengikut negeri)', 'Akta Wasiat 1959 (Malaysia)'],
                  ['Siapa boleh buat', 'Muslim, 18 tahun ke atas, sihat akal', 'Semua warganegara/pemastautin Malaysia, 18 tahun ke atas'],
                  ['Had wasiat', 'Hanya 1/3 harta — baki 2/3 mengikut Faraid', 'Tiada had — anda boleh tentukan semua harta'],
                  ['Bahasa dokumen', 'Bahasa Melayu', 'Bahasa Melayu atau Inggeris'],
                  ['Pelaksana (Wasi)', 'Mesti beragama Islam', 'Sesiapa yang dipercayai'],
                  ['Penjaga anak', 'Tidak dimasukkan', 'Boleh dilantik dalam dokumen'],
                  ['Pendaftaran', 'Disyorkan di Jabatan Agama Islam negeri', 'Simpan di tempat selamat, boleh daftar dengan badan penjaga'],
                  ['Saksi', '2 saksi Muslim', '2 saksi (bukan penerima manfaat)'],
                ] : [
                  ['Law', 'Islamic Will Enactment (varies by state)', 'Wills Act 1959 (Malaysia)'],
                  ['Who can make', 'Muslims, 18+ years, sound mind', 'All Malaysian citizens/residents, 18+ years'],
                  ['Bequest limit', 'Only 1/3 of estate — remaining 2/3 follows Faraid', 'No limit — you can determine all assets'],
                  ['Document language', 'Bahasa Melayu', 'Bahasa Melayu or English'],
                  ['Executor (Wasi)', 'Must be Muslim', 'Anyone you trust'],
                  ['Child guardian', 'Not included', 'Can be appointed in document'],
                  ['Registration', 'Recommended at state Islamic Religious Dept', 'Keep safely, can register with will custodian'],
                  ['Witnesses', '2 Muslim witnesses', '2 witnesses (not beneficiaries)'],
                ]).map(([aspect, wasiat, will]) => (
                  <tr key={aspect} className="border border-slate-200">
                    <td className="p-3 font-medium text-slate-700 bg-slate-50">{aspect}</td>
                    <td className="p-3 text-slate-600 bg-emerald-50/30">{wasiat}</td>
                    <td className="p-3 text-slate-600 bg-blue-50/30">{will}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Soalan lazim' : 'Frequently asked questions'}
          </h2>

          <div className="space-y-4">
            {(ms ? [
              {
                q: 'Bolehkah seorang Muslim buat Surat Wasiat Am?',
                a: 'Secara teknikal, Akta Wasiat 1959 terpakai kepada semua orang di Malaysia tanpa mengira agama. Walau bagaimanapun, bagi Muslim, wasiat yang melibatkan harta bukan alih (seperti hartanah) tetap tertakluk kepada hukum Faraid. Wasiat Islam adalah lebih sesuai dan menyeluruh untuk umat Islam Malaysia.',
              },
              {
                q: 'Apa itu Faraid?',
                a: 'Faraid adalah undang-undang pewarisan Islam yang menentukan bahagian setiap waris. Ia adalah hak waris yang tidak boleh dinafikan — sebab itulah Wasiat Islam hanya membenarkan 1/3 harta diperuntukkan mengikut kehendak pewasiat.',
              },
              {
                q: 'Bolehkah saya buat kedua-dua dokumen?',
                a: 'Tidak perlu. Pilih satu berdasarkan agama anda. Wasiat Islam untuk Muslim, Surat Wasiat Am untuk bukan Muslim.',
              },
            ] : [
              {
                q: 'Can a Muslim make a General Will?',
                a: 'Technically, the Wills Act 1959 applies to everyone in Malaysia regardless of religion. However, for Muslims, wills involving immovable property are still subject to Faraid law. An Islamic Will is more appropriate and comprehensive for Malaysian Muslims.',
              },
              {
                q: 'What is Faraid?',
                a: 'Faraid is Islamic inheritance law that determines each heir\'s share. It is a right of heirs that cannot be denied — which is why an Islamic Will only allows 1/3 of the estate to be allocated at the testator\'s discretion.',
              },
              {
                q: 'Can I make both documents?',
                a: 'Not necessary. Choose one based on your religion. Islamic Will for Muslims, General Will for non-Muslims.',
              },
            ]).map(({ q, a }) => (
              <div key={q} className="border border-slate-200 rounded-xl p-4">
                <p className="font-semibold text-slate-900 mb-2">Q: {q}</p>
                <p className="text-slate-600 text-xs leading-relaxed"><span className="font-bold">A:</span> {a}</p>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="font-semibold text-emerald-800 mb-2">
              {ms ? '💡 Kesimpulan mudah' : '💡 Simple conclusion'}
            </p>
            <div className="space-y-1 text-sm text-emerald-700">
              <p className="flex items-center gap-2"><Check className="w-4 h-4" />{ms ? 'Anda Muslim? → Wasiat Islam' : 'You are Muslim? → Islamic Will (Wasiat)'}</p>
              <p className="flex items-center gap-2"><Check className="w-4 h-4" />{ms ? 'Anda bukan Muslim? → Surat Wasiat Am' : 'You are non-Muslim? → General Will'}</p>
              <p className="flex items-center gap-2"><Check className="w-4 h-4" />{ms ? 'Kedua-duanya: satu harga, semua ciri termasuk' : 'Both: one price, all features included'}</p>
            </div>
          </div>

        </div>

        <div className="mt-10 p-6 bg-slate-900 rounded-2xl text-center">
          <p className="text-white font-bold text-lg mb-2">
            {ms ? 'Dah tahu mana satu untuk anda?' : 'Know which one is for you?'}
          </p>
          <p className="text-slate-400 text-sm mb-5">
            {ms ? 'Mulakan dalam 15 minit. Satu harga. Tiada had.' : 'Start in 15 minutes. One price. Zero limits.'}
          </p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            {ms ? 'Mulakan Sekarang — RM 79' : 'Get Started — RM 79'}
          </Link>
        </div>
      </div>
    </div>
  )
}
