import { cookies } from 'next/headers'
import Link from 'next/link'
import { ArrowLeft, X, Check } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EPF Nomination Bukan Wasiat — Ramai Yang Silap Faham Ini',
  description: 'Ramai yang ingat EPF nomination sudah cukup menggantikan wasiat. Ini adalah salah faham yang serius. Ketahui perbezaan sebenar antara keduanya.',
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
          <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full">
            {ms ? 'Salah Faham Biasa' : 'Common Misconception'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-4 leading-tight">
            {ms
              ? 'EPF Nomination Bukan Wasiat — Ramai Yang Silap Faham Perkara Ini'
              : 'EPF Nomination Is NOT a Will — A Common Misunderstanding'}
          </h1>
          <p className="text-slate-400 text-sm mt-3">
            {ms ? '28 April 2026 · 4 minit bacaan' : '28 April 2026 · 4 min read'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-slate-700 text-sm leading-relaxed space-y-6">

          <div className="bg-purple-50 border-l-4 border-purple-400 rounded-r-xl p-5">
            <p className="text-purple-900 font-semibold text-base">
              {ms
                ? '"Saya dah letak nama isteri dalam EPF. Tak payah buat wasiat lah." — Adakah anda pernah fikir begini? Atau dengar orang lain cakap begini? Ini adalah salah faham yang serius dan berleluasa di Malaysia.'
                : '"I already put my wife\'s name in EPF. No need for a will." — Have you ever thought this? Or heard others say it? This is a serious and widespread misconception in Malaysia.'}
            </p>
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Apa itu EPF nomination sebenarnya?' : 'What is EPF nomination actually?'}
          </h2>
          <p>
            {ms
              ? 'EPF nomination menentukan siapa yang akan menerima wang KWSP anda sebagai PENTADBIR — bukan sebagai pemilik mutlak. Mereka menerima wang itu untuk tujuan menguruskan harta pusaka anda, bukan semestinya untuk diri mereka sendiri.'
              : 'EPF nomination determines who will receive your EPF savings as an ADMINISTRATOR — not as the absolute owner. They receive the money to manage your estate, not necessarily for themselves.'}
          </p>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Perbezaan kritikal yang perlu anda tahu' : 'Critical differences you need to know'}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="text-left p-3 font-bold text-slate-700 border border-slate-200"></th>
                  <th className="text-left p-3 font-bold text-slate-700 border border-slate-200">EPF Nomination</th>
                  <th className="text-left p-3 font-bold text-emerald-700 border border-slate-200 bg-emerald-50">Wasiat / Will</th>
                </tr>
              </thead>
              <tbody>
                {(ms ? [
                  ['Meliputi', 'Wang KWSP sahaja', 'Semua harta — rumah, kereta, akaun bank, pelaburan'],
                  ['Untuk Muslim', 'Wang tetap dibahagi mengikut Faraid, walaupun ada nomination', 'Anda boleh tetapkan siapa dapat apa (sehingga 1/3)'],
                  ['Untuk bukan Muslim', 'Penama terima wang terus', 'Pelaksana agihkan semua harta mengikut arahan anda'],
                  ['Kuasa harta lain', 'Tiada', 'Ya — rumah, kereta, simpanan, perniagaan'],
                  ['Lantik penjaga anak', 'Tidak boleh', 'Boleh'],
                ] : [
                  ['Covers', 'EPF savings only', 'All assets — house, car, bank accounts, investments'],
                  ['For Muslims', 'Money still distributed under Faraid, regardless of nomination', 'You can specify who gets what (up to 1/3)'],
                  ['For non-Muslims', 'Nominee receives money directly', 'Executor distributes all assets per your instructions'],
                  ['Power over other assets', 'None', 'Yes — house, car, savings, business'],
                  ['Appoint child guardian', 'Cannot', 'Can'],
                ]).map(([aspect, epf, will]) => (
                  <tr key={aspect} className="border border-slate-200">
                    <td className="p-3 font-medium text-slate-700 bg-slate-50">{aspect}</td>
                    <td className="p-3 text-slate-600">
                      <span className="flex items-start gap-1"><X className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />{epf}</span>
                    </td>
                    <td className="p-3 text-emerald-700 bg-emerald-50/50">
                      <span className="flex items-start gap-1"><Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />{will}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Perkara paling penting untuk penama Muslim' : 'Most important point for Muslim EPF members'}
          </h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-900 text-sm">
              {ms
                ? 'Bagi penama Muslim: Walaupun anda letak nama isteri sebagai penama KWSP, wang tersebut masih perlu diagihkan mengikut hukum Faraid. Isteri anda tidak berhak menyimpan kesemuanya — melainkan waris-waris lain bersetuju. EPF nomination hanya menentukan siapa yang TERIMA wang dahulu untuk tujuan pentadbiran, bukan siapa PEMILIK wang tersebut.'
                : 'For Muslim members: Even if you nominate your wife as EPF nominee, the money must still be distributed according to Faraid law. Your wife is not entitled to keep all of it — unless other heirs agree. EPF nomination only determines who RECEIVES the money first for administrative purposes, not who OWNS it.'}
            </p>
          </div>

          <h2 className="text-lg font-bold text-slate-900">
            {ms ? 'Jadi, apa yang wasiat boleh buat yang EPF tidak boleh?' : 'So, what can a will do that EPF cannot?'}
          </h2>
          <div className="space-y-2">
            {(ms ? [
              'Melantik pelaksana (wasi/executor) untuk mengurus SEMUA harta pusaka',
              'Menentukan siapa mendapat rumah, kereta, akaun bank, pelaburan',
              'Melantik penjaga untuk anak-anak di bawah umur',
              'Menyatakan hasrat peribadi dan arahan khas',
              'Mengelakkan pertikaian keluarga dalam pembahagian harta',
            ] : [
              'Appoint an executor to manage ALL estate assets',
              'Specify who gets the house, car, bank accounts, investments',
              'Appoint a guardian for minor children',
              'State personal wishes and special instructions',
              'Prevent family disputes in asset distribution',
            ]).map(item => (
              <div key={item} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <p className="font-semibold text-emerald-800 mb-2">
              {ms ? '💡 Kesimpulan' : '💡 Bottom line'}
            </p>
            <p className="text-sm text-emerald-700">
              {ms
                ? 'EPF nomination dan wasiat adalah dua perkara yang berbeza dan saling melengkapi — bukan pengganti antara satu sama lain. EPF nomination = untuk wang KWSP sahaja. Wasiat = untuk semua harta anda yang lain.'
                : 'EPF nomination and a will are two different, complementary things — not substitutes for each other. EPF nomination = for EPF savings only. A will = for all your other assets.'}
            </p>
          </div>

        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 mt-6">
          <p>{ms
            ? '📌 Rujukan undang-undang: Akta Kumpulan Wang Simpanan Pekerja 1991 (Seksyen 74) — peruntukan penamaan KWSP. Bagi penama Muslim, hukum Faraid terpakai di bawah undang-undang Syariah negeri masing-masing. Maklumat ini adalah umum — sila rujuk KWSP atau peguam untuk nasihat khusus.'
            : '📌 Legal references: Employees Provident Fund Act 1991 (Section 74) — EPF nomination provisions. For Muslim nominees, Faraid applies under each state&apos;s Syariah law. This information is general — consult EPF or a lawyer for specific advice.'}</p>
        </div>

        <div className="mt-6 p-6 bg-slate-900 rounded-2xl text-center">
          <p className="text-white font-bold text-lg mb-2">
            {ms ? 'Jangan bergantung pada EPF nomination sahaja.' : "Don't rely on EPF nomination alone."}
          </p>
          <p className="text-slate-400 text-sm mb-5">
            {ms ? 'Lengkapkan perlindungan harta anda dengan wasiat. Selesai dalam 15 minit.' : 'Complete your asset protection with a will. Done in 15 minutes.'}
          </p>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all">
            {ms ? 'Buat Wasiat Sekarang — RM 79' : 'Create Your Will Now — RM 79'}
          </Link>
        </div>
      </div>
    </div>
  )
}
